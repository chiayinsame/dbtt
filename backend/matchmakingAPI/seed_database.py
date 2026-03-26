"""
seed_database.py
================
Run this ONCE before starting the Flask server.
Generates 80 dummy users across Singapore venues and trains + saves the model.

Usage: python seed_database.py
"""

import numpy as np
import pandas as pd
import json
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score

np.random.seed(42)

# ── Venues (real ActiveSG coordinates) ────────────────────────────────────────
VENUES = {
    'Kallang Badminton Hall': {'lat': 1.3020, 'lon': 103.8750, 'sports': ['Badminton']},
    'Jurong East Sports Centre': {'lat': 1.3330, 'lon': 103.7420, 'sports': ['Badminton', 'Basketball', 'Table Tennis']},
    'Tampines Sports Hall': {'lat': 1.3530, 'lon': 103.9440, 'sports': ['Badminton', 'Basketball', 'Volleyball']},
    'Bishan Sports Hall': {'lat': 1.3510, 'lon': 103.8480, 'sports': ['Badminton', 'Basketball', 'Table Tennis']},
    'Clementi Sports Hall': {'lat': 1.3150, 'lon': 103.7650, 'sports': ['Badminton', 'Basketball', 'Volleyball']},
    'Yio Chu Kang Sports Hall': {'lat': 1.3820, 'lon': 103.8450, 'sports': ['Badminton', 'Table Tennis']},
    'Sengkang Sports Centre': {'lat': 1.3920, 'lon': 103.8950, 'sports': ['Badminton', 'Basketball', 'Swimming']},
    'Hougang Sports Centre': {'lat': 1.3710, 'lon': 103.8930, 'sports': ['Badminton', 'Basketball', 'Table Tennis']},
    'Woodlands Sports Centre': {'lat': 1.4370, 'lon': 103.7860, 'sports': ['Badminton', 'Basketball', 'Football']},
    'Pasir Ris Sports Centre': {'lat': 1.3730, 'lon': 103.9490, 'sports': ['Badminton', 'Tennis', 'Swimming']},
    'Toa Payoh Sports Hall': {'lat': 1.3340, 'lon': 103.8510, 'sports': ['Badminton', 'Basketball', 'Table Tennis']},
    'Choa Chu Kang Sports Centre': {'lat': 1.3850, 'lon': 103.7440, 'sports': ['Badminton', 'Football', 'Basketball']},
}

SPORTS = ['Badminton', 'Basketball', 'Tennis', 'Table Tennis', 'Volleyball', 'Football', 'Swimming']
SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Competitive']
PLAY_STYLES = ['Casual', 'Regular', 'Competitive']
TIME_SLOTS = ['Weekday Morning', 'Weekday Afternoon', 'Weekday Evening',
              'Weekend Morning', 'Weekend Afternoon', 'Weekend Evening']
AGE_GROUPS = ['13-19', '20-29', '30-39', '40-49', '50-59', '60+']

# Some realistic names for the demo
FIRST_NAMES = [
    'Wei Ming', 'Jia Hui', 'Kai Xuan', 'Siti', 'Muhammad', 'Priya', 'Ravi',
    'Mei Ling', 'Jun Jie', 'Xin Yi', 'Aisha', 'Arjun', 'Li Ting', 'Zhi Wei',
    'Nurul', 'Vikram', 'Hui Min', 'Cheng', 'Farah', 'Darren', 'Ying Xuan',
    'Hafiz', 'Kavitha', 'Boon Kiat', 'Sze Min', 'Ismail', 'Lakshmi', 'Yong Hao',
    'Ain', 'Raj', 'Xiao Ting', 'Ahmad', 'Deepa', 'Jian Ming', 'Shu Wen',
    'Nabil', 'Anita', 'Hao Ran', 'Zara', 'Suresh', 'Pei Shan', 'Rizwan',
    'Meera', 'Zhi Hao', 'Adeline', 'Irfan', 'Divya', 'Yi Xuan', 'Faisal',
    'Gayathri', 'Wee Kiat', 'Syafiqah', 'Karthik', 'Jia Ying', 'Haziq',
    'Shreya', 'Zheng Yu', 'Amira', 'Balaji', 'Wen Xin', 'Hakim', 'Pooja',
    'Jing Wen', 'Rahim', 'Nisha', 'Tian Le', 'Aishah', 'Ganesh', 'Yu Ting',
    'Danish', 'Sangeetha', 'Hong Wei', 'Nabila', 'Arun', 'Shi Min', 'Farid',
    'Anjali', 'Zi Hao', 'Zahra'
]


def generate_users(n=80):
    """Generate n dummy user profiles."""
    users = []
    names_pool = FIRST_NAMES.copy()
    np.random.shuffle(names_pool)

    for i in range(n):
        name = names_pool[i % len(names_pool)]
        age_group = np.random.choice(AGE_GROUPS, p=[0.12, 0.25, 0.22, 0.18, 0.13, 0.10])
        primary_sport = np.random.choice(SPORTS, p=[0.30, 0.15, 0.10, 0.15, 0.08, 0.12, 0.10])

        has_secondary = np.random.random() < 0.35
        secondary_sport = np.random.choice(
            [s for s in SPORTS if s != primary_sport]
        ) if has_secondary else None

        if age_group in ['13-19']:
            skill = np.random.choice(SKILL_LEVELS, p=[0.30, 0.40, 0.20, 0.10])
        elif age_group in ['20-29', '30-39']:
            skill = np.random.choice(SKILL_LEVELS, p=[0.15, 0.35, 0.30, 0.20])
        else:
            skill = np.random.choice(SKILL_LEVELS, p=[0.20, 0.40, 0.30, 0.10])

        style = np.random.choice(PLAY_STYLES, p=[0.40, 0.35, 0.25])
        home_venue = np.random.choice(list(VENUES.keys()))
        venue_info = VENUES[home_venue]

        # 2-4 preferred time slots
        num_slots = np.random.randint(2, 5)
        if age_group in ['20-29', '30-39', '40-49']:
            slot_weights = [0.05, 0.05, 0.30, 0.20, 0.20, 0.20]
        elif age_group in ['13-19']:
            slot_weights = [0.10, 0.20, 0.20, 0.15, 0.20, 0.15]
        else:
            slot_weights = [0.25, 0.25, 0.10, 0.20, 0.15, 0.05]
        slot_weights = np.array(slot_weights) / sum(slot_weights)
        availability = list(np.random.choice(TIME_SLOTS, size=num_slots, replace=False, p=slot_weights))

        sessions = max(1, int(np.random.exponential(15)))
        rating = round(np.clip(np.random.normal(3.8, 0.7), 1.0, 5.0), 1)

        # Some users are currently "at venue" for demo purposes
        is_active = np.random.random() < 0.5  # ~40 users currently active
        current_venue = home_venue if is_active else None
        looking_for_match = is_active and (np.random.random() < 0.6)

        users.append({
            'user_id': f'U{i + 1:04d}',
            'display_name': name,
            'age_group': age_group,
            'primary_sport': primary_sport,
            'secondary_sport': secondary_sport,
            'skill_level': skill,
            'play_style': style,
            'home_venue': home_venue,
            'latitude': venue_info['lat'],
            'longitude': venue_info['lon'],
            'availability': availability,
            'total_sessions': sessions,
            'user_rating': rating,
            'is_active': is_active,
            'current_venue': current_venue,
            'looking_for_match': looking_for_match,
        })

    return users


def calculate_compatibility(user_a, user_b):
    """Calculate ground-truth compatibility between two users (0-1)."""
    score = 0.0

    sports_a = {user_a['primary_sport']}
    if user_a['secondary_sport']:
        sports_a.add(user_a['secondary_sport'])
    sports_b = {user_b['primary_sport']}
    if user_b['secondary_sport']:
        sports_b.add(user_b['secondary_sport'])

    if not (sports_a & sports_b):
        return 0.05

    if user_a['primary_sport'] == user_b['primary_sport']:
        score += 0.25
    else:
        score += 0.10

    skill_map = {'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Competitive': 4}
    skill_gap = abs(skill_map[user_a['skill_level']] - skill_map[user_b['skill_level']])
    score += {0: 0.20, 1: 0.12, 2: 0.04}.get(skill_gap, 0.0)

    dist = np.sqrt((user_a['latitude'] - user_b['latitude']) ** 2 +
                   (user_a['longitude'] - user_b['longitude']) ** 2) * 111
    if dist < 3: score += 0.15
    elif dist < 7: score += 0.10
    elif dist < 12: score += 0.05

    avail_overlap = len(set(user_a['availability']) & set(user_b['availability']))
    score += min(avail_overlap * 0.06, 0.18)

    style_compat = {
        ('Casual', 'Casual'): 0.12, ('Casual', 'Regular'): 0.08,
        ('Casual', 'Competitive'): 0.02, ('Regular', 'Regular'): 0.12,
        ('Regular', 'Competitive'): 0.08, ('Competitive', 'Competitive'): 0.12,
    }
    style_pair = tuple(sorted([user_a['play_style'], user_b['play_style']]))
    score += style_compat.get(style_pair, 0.05)

    age_map = {'13-19': 16, '20-29': 25, '30-39': 35, '40-49': 45, '50-59': 55, '60+': 65}
    age_gap = abs(age_map[user_a['age_group']] - age_map[user_b['age_group']])
    if age_gap <= 10: score += 0.08
    elif age_gap <= 20: score += 0.04

    avg_rating = (user_a['user_rating'] + user_b['user_rating']) / 2
    score += (avg_rating - 3.0) * 0.03

    score = np.clip(score + np.random.normal(0, 0.08), 0, 1)
    return score


def engineer_features(pairs):
    """Create pairwise features from a list of (user_a, user_b) dicts."""
    rows = []
    skill_map = {'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Competitive': 4}
    style_map = {'Casual': 1, 'Regular': 2, 'Competitive': 3}
    age_map = {'13-19': 16, '20-29': 25, '30-39': 35, '40-49': 45, '50-59': 55, '60+': 65}

    for a, b in pairs:
        sports_a = {a['primary_sport']}
        if a['secondary_sport']: sports_a.add(a['secondary_sport'])
        sports_b = {b['primary_sport']}
        if b['secondary_sport']: sports_b.add(b['secondary_sport'])

        dist = np.sqrt((a['latitude'] - b['latitude']) ** 2 +
                       (a['longitude'] - b['longitude']) ** 2) * 111
        avail_ov = len(set(a['availability']) & set(b['availability']))
        sk_a, sk_b = skill_map[a['skill_level']], skill_map[b['skill_level']]
        st_a, st_b = style_map[a['play_style']], style_map[b['play_style']]
        ag_a, ag_b = age_map[a['age_group']], age_map[b['age_group']]

        rows.append({
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
            'avg_sessions': (a['total_sessions'] + b['total_sessions']) / 2,
            'session_ratio': min(a['total_sessions'], b['total_sessions']) /
                             max(a['total_sessions'], b['total_sessions']),
            'avg_rating': (a['user_rating'] + b['user_rating']) / 2,
            'min_rating': min(a['user_rating'], b['user_rating']),
            'rating_gap': abs(a['user_rating'] - b['user_rating']),
        })

    return pd.DataFrame(rows)


def train_and_save():
    """Generate data, train model, save everything."""
    print("Generating 80 dummy users...")
    users = generate_users(80)

    # Save users
    with open('data/users.json', 'w') as f:
        json.dump(users, f, indent=2)
    print(f"  Saved {len(users)} users to data/users.json")
    active = [u for u in users if u['is_active']]
    looking = [u for u in users if u['looking_for_match']]
    print(f"  {len(active)} currently active, {len(looking)} looking for a match")

    # Save venues
    with open('data/venues.json', 'w') as f:
        json.dump(VENUES, f, indent=2)
    print(f"  Saved {len(VENUES)} venues to data/venues.json")

    # Generate training pairs (use a larger pool for training)
    print("\nGenerating 5000 training pairs...")
    training_users = generate_users(500)  # Larger pool just for training
    pairs = []
    labels = []
    for _ in range(5000):
        i, j = np.random.choice(len(training_users), 2, replace=False)
        a, b = training_users[i], training_users[j]
        compat = calculate_compatibility(a, b)
        pairs.append((a, b))
        labels.append(1 if compat > 0.45 else 0)

    features = engineer_features(pairs)
    labels = np.array(labels)
    print(f"  Good matches: {labels.sum()} ({labels.mean() * 100:.1f}%)")

    # Train
    print("\nTraining Random Forest model...")
    X_train, X_test, y_train, y_test = train_test_split(
        features, labels, test_size=0.2, random_state=42, stratify=labels
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = RandomForestClassifier(n_estimators=100, max_depth=10,
                                   min_samples_split=5, random_state=42)
    model.fit(X_train_scaled, y_train)

    pred = model.predict(X_test_scaled)
    prob = model.predict_proba(X_test_scaled)[:, 1]
    acc = accuracy_score(y_test, pred)
    auc = roc_auc_score(y_test, prob)
    print(f"  Accuracy: {acc:.3f}")
    print(f"  AUC-ROC:  {auc:.3f}")

    # Save model & scaler
    with open('data/model.pkl', 'wb') as f:
        pickle.dump(model, f)
    with open('data/scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    print("\n  Saved model to data/model.pkl")
    print("  Saved scaler to data/scaler.pkl")

    # Save feature column order (important for prediction)
    with open('data/feature_columns.json', 'w') as f:
        json.dump(list(features.columns), f)

    print("\n✅ Seed complete. Run `python app.py` to start the API server.")


if __name__ == '__main__':
    os.makedirs('data', exist_ok=True)
    train_and_save()
