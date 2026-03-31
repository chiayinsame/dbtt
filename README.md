# ActiveSG Smart Venue Booking

**Smart Venue Booking for a More Active Population** — an all-in-one platform for real-time court discovery, player matchmaking, and spontaneous sports participation at ActiveSG venues across Singapore.

> IS215 Digital Business Technology & Transformation — Group 4, Singapore Management University

---

## The Problem

Sporting spaces in Singapore are underutilised. The current ActiveSG booking system requires advance bookings, provides no real-time availability info, and offers no way to find people to play with. Between 2021-2023, the platform was plagued by bots and scalpers (200 accounts suspended, 600+ bookings cancelled). Only ~25% of Singaporeans' physical activity is intentional sports, and 64% fail to meet strength training targets.

## Our Solution

A platform that removes friction from sports participation through:

- **Real-time court discovery** — interactive map showing venue occupancy via CV/OCR detection
- **Player matchmaking** — ML-powered recommendations to find compatible players based on sport, skill, play style, location, and availability
- **Find Game** — one-tap feature that recommends the best court + compatible players across all venues
- **IoT equipment rental** — rent sporting equipment via QR code from smart lockers at venues

---

## Architecture

```
┌─────────────────────────────────────────┐
│       React + Vite Frontend             │
│  Map, Search, FindPlayers, Bookings,    │
│  Profile, Workouts, Friends             │
└──────────────────┬──────────────────────┘
                   │ /api proxy → localhost:5000
                   ▼
┌──────────────────────────────────────────┐
│       Flask API Server                   │
│  /api/config · /api/venues · /api/users  │
│  /api/recommend · /api/find-game         │
└──────────────────┬───────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
  Random Forest Model    JSON Data Store
  (18 features, ~90%     (80 users,
   accuracy, 0.92 AUC)   12 venues)
```

### Data Pipeline (Team Integration)

Three analytics components feed into each other:

1. **Computer Vision** (Jasper) — OCR model detects real-time court occupancy from venue cameras
2. **Demand Forecasting** (Chia Yin) — multilinear regression predicts future venue demand using time, weather, and occupancy data
3. **Player Matchmaking** (Ihsan) — Random Forest recommends best court + compatible players using occupancy and demand signals

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6, JSX |
| Backend | Python, Flask 3.1, Flask-CORS |
| ML (Production) | scikit-learn 1.6 (Random Forest Classifier) |
| ML (Analysis) | TensorFlow/Keras (Neural Network), matplotlib, seaborn |
| Data | NumPy, pandas, synthetic data, data.gov.sg APIs |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend/matchmakingAPI
pip install -r requirements.txt

# One-time setup: generate users, venues, and train the model
python seed_database.py

# Start the API server
python app.py
# → http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install

npm run dev
# → http://localhost:5173 (proxies /api to localhost:5000)

npm run build    # Production build → dist/
```

> Run both the backend and frontend simultaneously. The Vite dev server proxies all `/api/*` requests to the Flask server.

---

## API Endpoints

### Core & Matchmaking

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/config` | GET | Dropdown options (sports, skills, venues, time slots) |
| `/api/venues` | GET | All venues with coordinates, sports offered, and active user counts |
| `/api/users` | GET | List users — filters: `active=true`, `looking=true`, `sport=`, `venue=` |
| `/api/users/<id>` | GET | Full user profile including availability slots |
| `/api/users` | POST | Register a new user (onboarding) — returns the created user with generated ID |
| `/api/recommend/<user_id>` | GET | Top-N player recommendations — filters: `sport=`, `venue_only=true`, `looking_only=true`, `top_n=` |
| `/api/find-game/<user_id>` | GET | Venue-first matchmaking — returns courts ranked by combined player compatibility, player count, and proximity |
| `/api/venue/<name>/active` | GET | All active users at a specific venue |

### Equipment Rental

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/lockers` | GET | List lockers — filters: `venue=`, `available=true` |
| `/api/lockers/<locker_id>` | GET | Single locker details |
| `/api/rent` | POST | Rent equipment — body: `{ user_id, locker_id, duration_hours }` — deducts credits, marks locker unavailable |
| `/api/return` | POST | Return equipment — body: `{ rental_id }` — re-enables locker |
| `/api/rentals/<user_id>` | GET | Rental history — filter: `status=active\|returned` |
| `/api/credits/<user_id>` | GET | Get user's ActiveSG credit balance |
| `/api/credits/<user_id>/topup` | POST | Add credits — body: `{ amount }` (demo/testing use) |

---

## ML Model

### Algorithm

The production model is a **Random Forest Classifier** (`scikit-learn`):

- **Trees:** 100
- **Max depth:** 10
- **Min samples split:** 5
- **Random state:** 42
- **Performance:** ~90% accuracy, ~0.92 AUC-ROC on held-out test set
- **Decision threshold:** model probability > 0.45 → "good match" during training label generation; at inference time the raw probability is surfaced as a 0–100% match score

### Features (18 Engineered Pairwise Features)

All features are computed for each `(target_user, candidate_user)` pair. Feature values are normalized with a `StandardScaler` before being passed to the model — the same scaler fitted during training is serialised to `data/scaler.pkl` and applied at inference time.

| # | Feature | Type | Description |
|---|---------|------|-------------|
| 1 | `sport_match` | Binary | Primary sports are identical |
| 2 | `any_sport_overlap` | Binary | Any shared sport (primary or secondary) |
| 3 | `skill_gap` | Numeric | \|skill_a − skill_b\| on the 1–4 ordinal scale (Beginner=1 … Competitive=4) |
| 4 | `avg_skill` | Numeric | Mean skill level of the pair |
| 5 | `same_skill` | Binary | Exact skill level match |
| 6 | `distance_km` | Numeric | Euclidean distance × 111 between home venue coordinates (degrees → km) |
| 7 | `nearby` | Binary | Distance < 5 km |
| 8 | `avail_overlap` | Numeric | Count of shared time slots (0–6) |
| 9 | `has_avail_overlap` | Binary | At least one shared time slot |
| 10 | `style_gap` | Numeric | \|play_style_a − play_style_b\| on the 1–3 ordinal scale (Casual=1, Regular=2, Competitive=3) |
| 11 | `same_style` | Binary | Exact play style match |
| 12 | `age_gap` | Numeric | Absolute difference in age group midpoints (years) |
| 13 | `same_age_group` | Binary | Same age bracket string |
| 14 | `avg_sessions` | Numeric | Mean lifetime sessions played by the pair |
| 15 | `session_ratio` | Numeric | min(sessions) / max(sessions) — 1.0 = equal experience, lower = imbalanced |
| 16 | `avg_rating` | Numeric | Mean user rating (1–5 stars) |
| 17 | `min_rating` | Numeric | Lower of the two ratings |
| 18 | `rating_gap` | Numeric | \|rating_a − rating_b\| |

### Training Pipeline

Training happens inside `backend/matchmakingAPI/seed_database.py`. The steps are:

1. **Generate 80 app users** — realistic Singapore demographics (name pool, age distribution, sport weights, skill-by-age correlations, availability weighted by working-adult vs. student patterns).
2. **Generate 500 training users** — a separate, larger pool used only for training; never served by the API.
3. **Sample 5,000 random pairs** from the 500-user training pool.
4. **Compute ground-truth compatibility** for each pair using the rule-based formula below.
5. **Binarise labels** — score > 0.45 → label 1 (good match), otherwise 0.
6. **Engineer 18 features** for each pair.
7. **80/20 stratified split** into train (4,000) and test (1,000).
8. **Fit StandardScaler** on train features; apply to test.
9. **Train RandomForestClassifier** on scaled train features.
10. **Evaluate** on test set; report accuracy and AUC-ROC.
11. **Serialise** `model.pkl`, `scaler.pkl`, and `feature_columns.json` to `data/`.

### Ground-Truth Compatibility Formula

The rule-based function used to generate training labels before binarisation:

```
score = 0.0

# Sport — required gateway
if no shared sport at all:          return 0.05   (floor, immediately)
if primary sports match:            score += 0.25
else (secondary overlap only):      score += 0.10

# Skill gap (ordinal 1–4)
gap == 0  →  +0.20
gap == 1  →  +0.12
gap == 2  →  +0.04
gap >= 3  →  +0.00

# Geographic distance (km)
dist < 3   →  +0.15
dist < 7   →  +0.10
dist < 12  →  +0.05

# Availability overlap (per shared slot, capped at 3 slots)
+0.06 per overlap, max +0.18

# Play style compatibility
(Casual, Casual)       →  +0.12
(Casual, Regular)      →  +0.08
(Casual, Competitive)  →  +0.02
(Regular, Regular)     →  +0.12
(Regular, Competitive) →  +0.08
(Competitive, Comp.)   →  +0.12

# Age compatibility (midpoint gap in years)
gap ≤ 10  →  +0.08
gap ≤ 20  →  +0.04

# Rating bonus
+ (avg_rating − 3.0) × 0.03

# Noise injection (training only)
score += Normal(0, 0.08)
score = clip(score, 0, 1)

label = 1 if score > 0.45 else 0
```

### Inference: Step-by-Step Prediction

For `GET /api/recommend/<user_id>`:

1. Load target user profile.
2. Filter candidate pool (optional: by sport, same venue, looking-for-match status).
3. Compute all 18 pairwise features for each `(target, candidate)` pair.
4. Apply the pre-fitted `StandardScaler` to normalise features.
5. Call `model.predict_proba(scaled)[:, 1]` — extracts the positive-class probability.
6. Sort candidates by probability descending; return top-N.
7. For each top result, generate a human-readable explanation array (`reasons`).

Match score returned to the frontend = `round(probability × 100, 1)` — shown as a 0–100% value.

### Human-Readable Explanation Generation

After scoring, `generate_explanation()` produces a `reasons` list for each match:

| Condition | Reason text |
|-----------|-------------|
| Same primary sport | `"Plays <sport>"` |
| Candidate's secondary sport matches target's primary | `"Also plays <sport>"` |
| Same skill level | `"<Level> level"` |
| Skill gap == 1 | `"Close skill level (<candidate's level>)"` |
| Same play style | `"<Style> player"` |
| Any shared time slots | `"<N> shared time slot(s)"` |
| Distance < 2 km | `"Same venue area"` |
| Distance 2–5 km | `"Nearby (<dist>km)"` |
| Candidate rating ≥ 4.0 | `"Highly rated (<rating>★)"` |

### Find-Game Venue Scoring

`GET /api/find-game/<user_id>` scores each eligible venue using a weighted composite:

```
venue_match_score =
    avg_player_compatibility × 0.60   +   # average ML score of players at venue
    player_count_score        × 0.25   +   # min(players / 4, 1.0) × 100
    proximity_score           × 0.15       # max(0, 100 − dist_km × 5)
```

Only venues that (a) support the requested sport, (b) have at least one available court for that sport, and (c) have the sport listed in their `courts` array are included. Venues are sorted by `venue_match_score` descending.

### Analysis Script

`backend/recommendationSystemModel/player_matchmaking_1.py` is a standalone research/comparison script (not part of the running application). It:

- Trains **both** a Random Forest and a 3-layer Neural Network (64→32→16 neurons, BatchNorm + Dropout)
- Compares performance via ROC curves, confusion matrices, and feature importance plots
- Runs demo recommendation scenarios with synthetic data
- Writes 6 visualisation plots to `outputs/`:
  1. Neural Network training history
  2. ROC curve comparison (RF vs. NN)
  3. Confusion matrices side-by-side
  4. Feature importance ranking
  5. User demographics (sport, skill, age, play style)
  6. Compatibility score distribution

This script is the primary deliverable for the ML portion of the project submission.

---

## Project Structure

```
dbtt/
├── backend/
│   ├── matchmakingAPI/
│   │   ├── app.py                     # Flask API server (8 endpoints)
│   │   ├── seed_database.py           # Data generation + model training
│   │   ├── requirements.txt           # Python dependencies
│   │   ├── README.md                  # API-specific documentation
│   │   └── data/
│   │       ├── users.json             # 80 user profiles
│   │       ├── venues.json            # 12 ActiveSG venues with courts
│   │       ├── model.pkl              # Trained Random Forest model
│   │       ├── scaler.pkl             # Feature normalization scaler
│   │       ├── feature_columns.json   # Model feature names (order matters for inference)
│   │       ├── lockers.json           # Equipment locker inventory
│   │       └── rentals.json           # Rental records (active + returned)
│   └── recommendationSystemModel/
│       └── player_matchmaking_1.py    # ML analysis script (RF + NN comparison)
├── frontend/
│   ├── package.json
│   ├── vite.config.js                 # Dev server + /api proxy config
│   ├── index.html
│   └── src/
│       ├── main.jsx                   # React entry point
│       ├── App.jsx                    # Router (10 screens)
│       ├── theme/
│       │   ├── tokens.js             # Design tokens (colors, spacing, fonts)
│       │   └── GlobalStyles.jsx      # CSS animations & reset
│       ├── hooks/
│       │   └── useBreakpoint.js      # Responsive breakpoint (768px)
│       ├── data/
│       │   └── mockData.js           # Mock venues, sports, friends, workouts
│       ├── images/                    # Avatar photos
│       ├── components/
│       │   ├── ui/
│       │   │   ├── PageShell.jsx     # Page layout wrapper
│       │   │   ├── GlassCard.jsx     # Glass-morphism card
│       │   │   ├── Pill.jsx          # Badge/tag component
│       │   │   └── Icons.jsx         # 20+ SVG icons
│       │   ├── nav/
│       │   │   ├── StatusBar.jsx     # Mobile status bar
│       │   │   ├── BottomNav.jsx     # Bottom nav (mobile) / sidebar (desktop)
│       │   │   └── MenuOverlay.jsx   # Radial floating menu
│       │   ├── map/
│       │   │   ├── MapPage.jsx       # 3200x1800 interactive map controller
│       │   │   ├── MapTerrain.jsx    # SVG Singapore map (MRT, roads, zones)
│       │   │   ├── MapParticles.jsx  # Ambient particle effects
│       │   │   ├── PlayerAvatar.jsx  # Draggable player marker
│       │   │   ├── VenueMarker.jsx   # Venue icon (zoomed out)
│       │   │   └── VenueTower.jsx    # 3D venue tower (zoomed in)
│       │   ├── locker/
│       │   │   ├── QRScanner.jsx     # QR code scanner for locker unlock
│       │   │   └── RentalModal.jsx   # Rental confirmation & duration picker
│       │   ├── classes/
│       │   │   └── ClassSignUpSheet.jsx  # Class sign-up bottom sheet
│       │   └── venue/
│       │       ├── VenueSheet.jsx    # Venue detail bottom sheet
│       │       └── BookingModal.jsx  # Booking confirmation modal
│       └── pages/
│           ├── MapPage.jsx           # Map-based venue discovery
│           ├── SearchPage.jsx        # Venue/sport search & browse
│           ├── FindPlayersPage.jsx   # ML matchmaking UI
│           ├── ProfilePage.jsx       # User profile & stats
│           ├── WorkoutsPage.jsx      # Workout history & weekly chart
│           ├── BookingsPage.jsx      # Booking management
│           ├── FriendsPage.jsx       # Friends & nearby players
│           ├── LeaderboardPage.jsx   # Activity leaderboard
│           ├── ClassesPage.jsx       # Browse & sign up for classes
│           ├── LessonsPage.jsx       # Lesson listings
│           └── LockerPage.jsx        # Equipment rental (QR + locker UI)
└── .gitignore
```

---

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Interactive venue map | ✅ Done | 3200x1800 map with zoom, pan, 3D venue towers, Singapore MRT/roads |
| Player matchmaking API | ✅ Done | 15 endpoints, 18-feature Random Forest model, human-readable explanations |
| ML analysis script | ✅ Done | RF + Neural Network comparison with visualizations |
| Synthetic data generation | ✅ Done | 80 users, 12 real ActiveSG venues, automated model training |
| Find Players UI | ✅ Done | Onboarding form, recommendation cards, score bars, match reasons |
| Search & browse | ✅ Done | Category browsing, nearby venues, search bar |
| Profile page | ✅ Done | Stats, XP bar, settings menu |
| Bookings page | ✅ Done | Upcoming/past tabs, cancel/modify actions |
| Workouts page | ✅ Done | Weekly chart, activity history with calories |
| Friends page | ✅ Done | Online status, "looking for players" section |
| Responsive design | ✅ Done | Mobile (bottom nav) + desktop (sidebar) layouts |
| IoT Smart Locker rental | ✅ Done | 7 API endpoints: rent, return, lockers, rentals, credits; JSON-backed |
| Frontend-backend integration | 🔧 In Progress | FindPlayersPage wired to API; other pages use mock data |
| Real-time occupancy (CV/OCR) | 🔧 In Progress | Jasper's model — to be integrated |
| Demand forecasting | 🔧 In Progress | Chia Yin's model — to be integrated |
| User authentication | 📋 Planned | No auth layer yet |
| Persistent database | 📋 Planned | Currently JSON file-based |
| Push notifications | 📋 Planned | — |

---

## Data Sources

- **Venue locations:** Real ActiveSG facility coordinates (Kallang, Jurong East, Tampines, Woodlands, etc.)
- **User profiles:** Synthetic data generated with realistic Singapore demographics
- **Sports distribution:** Badminton (30%), Basketball (15%), Table Tennis (15%), Football (12%), Swimming (10%), Tennis (10%), Volleyball (8%)
- **External data:** [data.gov.sg](https://data.gov.sg) Sport Singapore datasets

---

## Team

| Member | Responsibility |
|--------|---------------|
| Ihsan | Player matchmaking recommendation system (Random Forest + Neural Network), Flask API |
| Jasper | OCR/Computer Vision model for real-time court occupancy detection |
| Chia Yin | Demand forecasting model (multilinear regression) |
| Zaer & team | Frontend development, UI/UX, prototype |

---

## License

University project — IS215 Digital Business Technology & Transformation, Singapore Management University.
