# ActiveSG Player Matchmaking API

ML-powered player recommendation system for the ActiveSG Smart Venue Booking platform.

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Seed the database (generates 80 dummy users + trains model)
python seed_database.py

# 3. Start the API server
python app.py
# → Server runs on http://localhost:5000
```

## API Endpoints

### `GET /api/config`
Returns dropdown options for onboarding forms (sports, skill levels, venues, etc.).

### `GET /api/venues`
Lists all ActiveSG venues with coordinates, sports offered, and active user count.

### `GET /api/users`
Lists users. Supports filters:
- `?active=true` — only currently active users
- `?looking=true` — only users looking for a match
- `?sport=Badminton` — filter by sport
- `?venue=Kallang Badminton Hall` — filter by current venue

### `GET /api/users/:user_id`
Returns full profile for a single user.

### `POST /api/users`
Onboards (registers) a new user. Body:
```json
{
  "display_name": "Ihsan",
  "age_group": "20-29",
  "primary_sport": "Badminton",
  "secondary_sport": null,
  "skill_level": "Intermediate",
  "play_style": "Casual",
  "home_venue": "Kallang Badminton Hall",
  "availability": ["Weekday Evening", "Weekend Morning"]
}
```

### `GET /api/recommend/:user_id`
Returns top-N player recommendations. Supports filters:
- `?sport=Badminton` — only recommend players for a specific sport
- `?top_n=5` — number of results (default 5)
- `?venue_only=true` — only players at the same venue
- `?looking_only=true` — only players actively looking for a match

Response:
```json
{
  "user": { "user_id": "U0081", "display_name": "Ihsan", ... },
  "total_candidates": 24,
  "recommendations": [
    {
      "rank": 1,
      "user_id": "U0023",
      "display_name": "Wei Ming",
      "match_score": 98.5,
      "primary_sport": "Badminton",
      "skill_level": "Intermediate",
      "reasons": ["Plays Badminton", "Intermediate level", "Same venue area"]
    }
  ]
}
```

### `GET /api/venue/:venue_name/active`
Lists all active users at a specific venue.

---

## React Integration

### Fetching recommendations:
```jsx
const getRecommendations = async (userId, sport) => {
  const params = new URLSearchParams({
    sport: sport,
    top_n: '5',
    looking_only: 'true',
  });
  const res = await fetch(`http://localhost:5000/api/recommend/${userId}?${params}`);
  const data = await res.json();
  return data.recommendations;
};
```

### Onboarding a new user:
```jsx
const onboardUser = async (formData) => {
  const res = await fetch('http://localhost:5000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  return data.user; // includes generated user_id
};
```

### Loading form options:
```jsx
const loadConfig = async () => {
  const res = await fetch('http://localhost:5000/api/config');
  return await res.json();
  // { sports: [...], skill_levels: [...], venues: [...], ... }
};
```

---

## Demo Flow

1. Start the Flask server (`python app.py`)
2. In the React app, navigate to Find Players
3. Show the onboarding form (pre-filled or fill live)
4. Submit → new user created with `user_id`
5. Call `/api/recommend/<new_user_id>?sport=Badminton&looking_only=true`
6. Display the ranked recommendation cards with match scores and reasons

## Project Structure

```
matchmaking-api/
├── app.py                 # Flask API server
├── seed_database.py       # Data generation + model training
├── requirements.txt       # Python dependencies
├── README.md
└── data/                  # Generated after running seed_database.py
    ├── users.json         # 80 dummy user profiles
    ├── venues.json        # 12 ActiveSG venues
    ├── model.pkl          # Trained Random Forest model
    ├── scaler.pkl         # Feature scaler
    └── feature_columns.json
```
