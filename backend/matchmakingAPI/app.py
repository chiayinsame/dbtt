"""
app.py
======
Flask API server for the ActiveSG Player Matchmaking system.

Endpoints:
  GET  /api/venues                         - list all venues
  GET  /api/users                          - list all users (with filters)
  GET  /api/users/<user_id>                - get single user profile
  POST /api/users                          - onboard a new user (register)
  GET  /api/recommend/<user_id>            - get top-N recommendations
  GET  /api/find-game/<user_id>            - venue-first matchmaking
  GET  /api/venue/<venue_name>/active      - who's active at a specific venue

Usage:
  1. Run `python seed_database.py` first (once)
  2. Run `python app.py`
  3. Server starts at http://localhost:5000
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import pickle
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Allow React frontend to call this API

# ── Load data & model ─────────────────────────────────────────────────────────

DATA_DIR = 'data'


def load_data():
    with open(f'{DATA_DIR}/users.json', 'r') as f:
        users = json.load(f)
    with open(f'{DATA_DIR}/venues.json', 'r') as f:
        venues = json.load(f)
    with open(f'{DATA_DIR}/model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open(f'{DATA_DIR}/scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    with open(f'{DATA_DIR}/feature_columns.json', 'r') as f:
        feature_cols = json.load(f)
    return users, venues, model, scaler, feature_cols


users, venues, model, scaler, feature_cols = load_data()


# ── Feature engineering (same logic as training) ──────────────────────────────

SKILL_MAP = {'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Competitive': 4}
STYLE_MAP = {'Casual': 1, 'Regular': 2, 'Competitive': 3}
AGE_MAP = {'13-19': 16, '20-29': 25, '30-39': 35, '40-49': 45, '50-59': 55, '60+': 65}


def compute_pair_features(a, b):
    """Compute the 18 pairwise features between two user dicts."""
    sports_a = {a['primary_sport']}
    if a.get('secondary_sport'): sports_a.add(a['secondary_sport'])
    sports_b = {b['primary_sport']}
    if b.get('secondary_sport'): sports_b.add(b['secondary_sport'])

    dist = np.sqrt((a['latitude'] - b['latitude']) ** 2 +
                   (a['longitude'] - b['longitude']) ** 2) * 111
    avail_ov = len(set(a.get('availability', [])) & set(b.get('availability', [])))
    sk_a = SKILL_MAP.get(a['skill_level'], 2)
    sk_b = SKILL_MAP.get(b['skill_level'], 2)
    st_a = STYLE_MAP.get(a['play_style'], 1)
    st_b = STYLE_MAP.get(b['play_style'], 1)
    ag_a = AGE_MAP.get(a['age_group'], 30)
    ag_b = AGE_MAP.get(b['age_group'], 30)
    sess_a = a.get('total_sessions', 0) or 1
    sess_b = b.get('total_sessions', 0) or 1
    rat_a = a.get('user_rating', 3.0)
    rat_b = b.get('user_rating', 3.0)

    return {
        'sport_match': int(a['primary_sport'] == b['primary_sport']),
        'any_sport_overlap': int(bool(sports_a & sports_b)),
        'skill_gap': abs(sk_a - sk_b),
        'avg_skill': (sk_a + sk_b) / 2,
        'same_skill': int(sk_a == sk_b),
        'distance_km': dist,
        'nearby': int(dist < 5),
        'avail_overlap': avail_ov,
        'has_avail_overlap': int(avail_ov > 0),
        'style_gap': abs(st_a - st_b),
        'same_style': int(st_a == st_b),
        'age_gap': abs(ag_a - ag_b),
        'same_age_group': int(a['age_group'] == b['age_group']),
        'avg_sessions': (sess_a + sess_b) / 2,
        'session_ratio': min(sess_a, sess_b) / max(sess_a, sess_b),
        'avg_rating': (rat_a + rat_b) / 2,
        'min_rating': min(rat_a, rat_b),
        'rating_gap': abs(rat_a - rat_b),
    }


def generate_explanation(target, candidate, score):
    """Generate a human-readable explanation for why this match was recommended."""
    reasons = []

    if candidate['primary_sport'] == target['primary_sport']:
        reasons.append(f"Plays {candidate['primary_sport']}")
    elif candidate.get('secondary_sport') == target['primary_sport']:
        reasons.append(f"Also plays {target['primary_sport']}")

    if candidate['skill_level'] == target['skill_level']:
        reasons.append(f"{candidate['skill_level']} level")
    else:
        skill_gap = abs(SKILL_MAP.get(candidate['skill_level'], 2) -
                        SKILL_MAP.get(target['skill_level'], 2))
        if skill_gap == 1:
            reasons.append(f"Close skill level ({candidate['skill_level']})")

    if candidate['play_style'] == target['play_style']:
        reasons.append(f"{candidate['play_style']} player")

    avail_overlap = set(target.get('availability', [])) & set(candidate.get('availability', []))
    if avail_overlap:
        reasons.append(f"{len(avail_overlap)} shared time slot(s)")

    dist = np.sqrt((target['latitude'] - candidate['latitude']) ** 2 +
                   (target['longitude'] - candidate['longitude']) ** 2) * 111
    if dist < 2:
        reasons.append("Same venue area")
    elif dist < 5:
        reasons.append(f"Nearby ({dist:.1f}km)")

    if candidate.get('user_rating', 3.0) >= 4.0:
        reasons.append(f"Highly rated ({candidate['user_rating']}★)")

    return reasons


# ── API Endpoints ─────────────────────────────────────────────────────────────

@app.route('/api/venues', methods=['GET'])
def get_venues():
    """List all venues with their coordinates and supported sports."""
    result = []
    for name, info in venues.items():
        # Count active users at this venue
        active_count = sum(1 for u in users if u.get('current_venue') == name)
        result.append({
            'name': name,
            'lat': info['lat'],
            'lon': info['lon'],
            'sports': info['sports'],
            'active_users': active_count,
        })
    return jsonify(result)


@app.route('/api/users', methods=['GET'])
def get_users():
    """
    List users. Supports query params:
      ?active=true        - only currently active users
      ?looking=true       - only users looking for a match
      ?sport=Badminton    - filter by sport
      ?venue=Kallang...   - filter by current venue
    """
    filtered = users

    if request.args.get('active') == 'true':
        filtered = [u for u in filtered if u.get('is_active')]
    if request.args.get('looking') == 'true':
        filtered = [u for u in filtered if u.get('looking_for_match')]
    if request.args.get('sport'):
        sport = request.args.get('sport')
        filtered = [u for u in filtered
                    if u['primary_sport'] == sport or u.get('secondary_sport') == sport]
    if request.args.get('venue'):
        venue = request.args.get('venue')
        filtered = [u for u in filtered if u.get('current_venue') == venue]

    # Don't expose full availability arrays in list view for cleanliness
    safe = []
    for u in filtered:
        safe.append({
            'user_id': u['user_id'],
            'display_name': u['display_name'],
            'primary_sport': u['primary_sport'],
            'secondary_sport': u.get('secondary_sport'),
            'skill_level': u['skill_level'],
            'play_style': u['play_style'],
            'age_group': u['age_group'],
            'home_venue': u['home_venue'],
            'current_venue': u.get('current_venue'),
            'is_active': u.get('is_active', False),
            'looking_for_match': u.get('looking_for_match', False),
            'user_rating': u['user_rating'],
            'total_sessions': u['total_sessions'],
        })

    return jsonify(safe)


@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get a single user's full profile."""
    user = next((u for u in users if u['user_id'] == user_id), None)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user)


@app.route('/api/users', methods=['POST'])
def onboard_user():
    """
    Register a new user (onboarding).

    Expected JSON body:
    {
      "display_name": "John",
      "age_group": "20-29",
      "primary_sport": "Badminton",
      "secondary_sport": null,       // optional
      "skill_level": "Intermediate",
      "play_style": "Casual",
      "home_venue": "Kallang Badminton Hall",
      "availability": ["Weekday Evening", "Weekend Morning"]
    }
    """
    data = request.json

    required = ['display_name', 'primary_sport', 'skill_level', 'play_style',
                'age_group', 'home_venue', 'availability']
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({'error': f'Missing fields: {missing}'}), 400

    # Validate venue
    venue_name = data['home_venue']
    if venue_name not in venues:
        return jsonify({'error': f'Unknown venue: {venue_name}'}), 400

    venue_info = venues[venue_name]

    # Generate user ID
    max_id = max(int(u['user_id'][1:]) for u in users)
    new_id = f'U{max_id + 1:04d}'

    new_user = {
        'user_id': new_id,
        'display_name': data['display_name'],
        'age_group': data['age_group'],
        'primary_sport': data['primary_sport'],
        'secondary_sport': data.get('secondary_sport'),
        'skill_level': data['skill_level'],
        'play_style': data['play_style'],
        'home_venue': venue_name,
        'latitude': venue_info['lat'],
        'longitude': venue_info['lon'],
        'availability': data['availability'],
        'total_sessions': 0,
        'user_rating': 3.0,  # Default for new users
        'is_active': True,  # They just signed up, they're here
        'current_venue': venue_name,
        'looking_for_match': True,
    }

    users.append(new_user)

    # Persist
    with open(f'{DATA_DIR}/users.json', 'w') as f:
        json.dump(users, f, indent=2)

    return jsonify({
        'message': 'User registered successfully',
        'user': new_user
    }), 201


@app.route('/api/recommend/<user_id>', methods=['GET'])
def recommend(user_id):
    """
    Get top-N player recommendations for a user.

    Query params:
      ?sport=Badminton   - filter candidates by sport
      ?top_n=5           - number of results (default 5)
      ?venue_only=true   - only recommend users at the same venue
      ?looking_only=true - only recommend users who are looking for a match
    """
    target = next((u for u in users if u['user_id'] == user_id), None)
    if not target:
        return jsonify({'error': 'User not found'}), 404

    # Filter candidates
    candidates = [u for u in users if u['user_id'] != user_id]

    sport_filter = request.args.get('sport')
    if sport_filter:
        candidates = [u for u in candidates
                      if u['primary_sport'] == sport_filter
                      or u.get('secondary_sport') == sport_filter]

    if request.args.get('venue_only') == 'true' and target.get('current_venue'):
        candidates = [u for u in candidates
                      if u.get('current_venue') == target['current_venue']]

    if request.args.get('looking_only') == 'true':
        candidates = [u for u in candidates if u.get('looking_for_match')]

    top_n = int(request.args.get('top_n', 5))

    if not candidates:
        return jsonify({
            'user': target,
            'recommendations': [],
            'message': 'No matching candidates found with current filters'
        })

    # Compute features for all (target, candidate) pairs
    pair_features = [compute_pair_features(target, c) for c in candidates]
    df = pd.DataFrame(pair_features)[feature_cols]  # Ensure column order
    scaled = scaler.transform(df)

    # Predict
    scores = model.predict_proba(scaled)[:, 1]

    # Rank
    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
    top = ranked[:top_n]

    recommendations = []
    for rank, (cand, score) in enumerate(top, 1):
        reasons = generate_explanation(target, cand, score)
        recommendations.append({
            'rank': rank,
            'user_id': cand['user_id'],
            'display_name': cand['display_name'],
            'match_score': round(float(score) * 100, 1),
            'primary_sport': cand['primary_sport'],
            'secondary_sport': cand.get('secondary_sport'),
            'skill_level': cand['skill_level'],
            'play_style': cand['play_style'],
            'age_group': cand['age_group'],
            'current_venue': cand.get('current_venue'),
            'home_venue': cand['home_venue'],
            'user_rating': cand['user_rating'],
            'total_sessions': cand['total_sessions'],
            'is_active': cand.get('is_active', False),
            'looking_for_match': cand.get('looking_for_match', False),
            'reasons': reasons,
        })

    return jsonify({
        'user': {
            'user_id': target['user_id'],
            'display_name': target['display_name'],
            'primary_sport': target['primary_sport'],
            'skill_level': target['skill_level'],
            'play_style': target['play_style'],
        },
        'filters': {
            'sport': sport_filter,
            'venue_only': request.args.get('venue_only') == 'true',
            'looking_only': request.args.get('looking_only') == 'true',
        },
        'total_candidates': len(candidates),
        'recommendations': recommendations,
    })


@app.route('/api/venue/<path:venue_name>/active', methods=['GET'])
def venue_active(venue_name):
    """Get all active users at a specific venue."""
    active = [u for u in users if u.get('current_venue') == venue_name]
    looking = [u for u in active if u.get('looking_for_match')]

    return jsonify({
        'venue': venue_name,
        'venue_info': venues.get(venue_name, {}),
        'total_active': len(active),
        'total_looking': len(looking),
        'users': [{
            'user_id': u['user_id'],
            'display_name': u['display_name'],
            'primary_sport': u['primary_sport'],
            'skill_level': u['skill_level'],
            'play_style': u['play_style'],
            'looking_for_match': u.get('looking_for_match', False),
            'user_rating': u['user_rating'],
        } for u in active]
    })


@app.route('/api/find-game/<user_id>', methods=['GET'])
def find_game(user_id):
    """
    Court-first matchmaking: recommends the best venues to go to based on
    court availability, player compatibility, and travel distance.

    Query params:
      ?sport=Badminton   - filter by sport (defaults to user's primary sport)
    """
    import random

    target = next((u for u in users if u['user_id'] == user_id), None)
    if not target:
        return jsonify({'error': 'User not found'}), 404

    sport_filter = request.args.get('sport', target['primary_sport'])

    venue_results = []
    for venue_name, venue_info in venues.items():
        # Only consider venues that support the requested sport
        if sport_filter not in venue_info.get('sports', []):
            continue

        # Get courts for this sport at this venue
        all_courts = venue_info.get('courts', [])
        sport_courts = [c for c in all_courts if c['sport'] == sport_filter]
        if not sport_courts:
            continue

        available_courts = [c for c in sport_courts if c['current_occupancy'] < c['capacity']]
        if not available_courts:
            continue

        # Find active, looking users at this venue who play this sport
        venue_players = [u for u in users
                         if u['user_id'] != user_id
                         and u.get('current_venue') == venue_name
                         and u.get('is_active')
                         and u.get('looking_for_match')
                         and (u['primary_sport'] == sport_filter
                              or u.get('secondary_sport') == sport_filter)]

        # Calculate distance from user's home venue
        dist_km = np.sqrt((target['latitude'] - venue_info['lat']) ** 2 +
                          (target['longitude'] - venue_info['lon']) ** 2) * 111
        # Mock travel time: ~6 min per km by MRT in Singapore
        travel_min = max(3, int(dist_km * 6))

        # Score each player at this venue using the ML model
        player_details = []
        if venue_players:
            pair_features = [compute_pair_features(target, p) for p in venue_players]
            df = pd.DataFrame(pair_features)[feature_cols]
            scaled = scaler.transform(df)
            scores = model.predict_proba(scaled)[:, 1]

            for p, score in sorted(zip(venue_players, scores),
                                   key=lambda x: x[1], reverse=True):
                reasons = generate_explanation(target, p, score)
                player_details.append({
                    'user_id': p['user_id'],
                    'display_name': p['display_name'],
                    'match_score': round(float(score) * 100, 1),
                    'primary_sport': p['primary_sport'],
                    'skill_level': p['skill_level'],
                    'play_style': p['play_style'],
                    'age_group': p['age_group'],
                    'user_rating': p['user_rating'],
                    'total_sessions': p['total_sessions'],
                    'reasons': reasons,
                })

        # Compute venue-level match score
        if player_details:
            avg_match = sum(p['match_score'] for p in player_details) / len(player_details)
        else:
            avg_match = 0

        # Combined score: compatibility (60%), player count (25%), proximity (15%)
        player_count_score = min(len(venue_players) / 4.0, 1.0) * 100
        proximity_score = max(0, 100 - dist_km * 5)
        combined_score = round(
            avg_match * 0.60 +
            player_count_score * 0.25 +
            proximity_score * 0.15, 1)

        # Mock predicted availability window
        avail_minutes = random.choice([30, 45, 60, 90, 120])

        venue_results.append({
            'venue_name': venue_name,
            'lat': venue_info['lat'],
            'lon': venue_info['lon'],
            'distance_km': round(dist_km, 1),
            'travel_min': travel_min,
            'match_score': combined_score,
            'avg_player_match': round(avg_match, 1),
            'players_looking': len(venue_players),
            'players': player_details,
            'courts_total': len(sport_courts),
            'courts_available': len(available_courts),
            'court_details': [{
                'court_id': c['court_id'],
                'capacity': c['capacity'],
                'current_occupancy': c['current_occupancy'],
            } for c in available_courts],
            'predicted_available_min': avail_minutes,
        })

    # Sort by combined score descending
    venue_results.sort(key=lambda v: v['match_score'], reverse=True)

    return jsonify({
        'user': {
            'user_id': target['user_id'],
            'display_name': target['display_name'],
            'primary_sport': target['primary_sport'],
            'home_venue': target['home_venue'],
        },
        'sport': sport_filter,
        'total_venues': len(venue_results),
        'venues': venue_results,
    })


@app.route('/api/config', methods=['GET'])
def get_config():
    """Return dropdown options for the onboarding form."""
    return jsonify({
        'sports': ['Badminton', 'Basketball', 'Tennis', 'Table Tennis',
                   'Volleyball', 'Football', 'Swimming'],
        'skill_levels': ['Beginner', 'Intermediate', 'Advanced', 'Competitive'],
        'play_styles': ['Casual', 'Regular', 'Competitive'],
        'age_groups': ['13-19', '20-29', '30-39', '40-49', '50-59', '60+'],
        'time_slots': ['Weekday Morning', 'Weekday Afternoon', 'Weekday Evening',
                       'Weekend Morning', 'Weekend Afternoon', 'Weekend Evening'],
        'venues': list(venues.keys()),
    })


# ── Run ───────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    if not os.path.exists(f'{DATA_DIR}/model.pkl'):
        print("[ERROR] Model not found. Run `python seed_database.py` first.")
        exit(1)

    print("=" * 50)
    print("ActiveSG Matchmaking API")
    print("=" * 50)
    print(f"Users loaded:  {len(users)}")
    print(f"Venues loaded: {len(venues)}")
    print(f"Active users:  {sum(1 for u in users if u.get('is_active'))}")
    print(f"Looking:       {sum(1 for u in users if u.get('looking_for_match'))}")
    print()
    print("Endpoints:")
    print("  GET  /api/config                    - form dropdown options")
    print("  GET  /api/venues                    - all venues")
    print("  GET  /api/users?active=true         - list users")
    print("  GET  /api/users/<id>                - user profile")
    print("  POST /api/users                     - onboard new user")
    print("  GET  /api/recommend/<id>            - recommendations")
    print("  GET  /api/find-game/<id>            - venue-first matchmaking")
    print("  GET  /api/venue/<name>/active       - who's at a venue")
    print()
    print("Starting server on http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, port=5000)
