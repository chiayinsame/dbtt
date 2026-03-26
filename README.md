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

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/config` | GET | Dropdown options (sports, skills, venues, time slots) |
| `/api/venues` | GET | All venues with active user counts |
| `/api/users` | GET | List users (filters: `active`, `looking`, `sport`, `venue`) |
| `/api/users/<id>` | GET | Full user profile |
| `/api/users` | POST | Register new user |
| `/api/recommend/<user_id>` | GET | Top-N player recommendations (filters: `sport`, `venue_only`, `looking_only`, `top_n`) |
| `/api/find-game/<user_id>` | GET | Venue-first matchmaking — recommends courts ranked by player compatibility |
| `/api/venue/<name>/active` | GET | Active players at a specific venue |

---

## ML Model

### Features (18 Engineered Pairwise Features)

| # | Feature | Description |
|---|---------|-------------|
| 1 | `sport_match` | Primary sport match (binary) |
| 2 | `any_sport_overlap` | Any shared sport (binary) |
| 3 | `skill_gap` | Absolute skill level difference |
| 4 | `avg_skill` | Average skill level |
| 5 | `same_skill` | Exact skill match (binary) |
| 6 | `distance_km` | Geographic distance between players |
| 7 | `nearby` | Within 5km (binary) |
| 8 | `avail_overlap` | Number of shared time slots |
| 9 | `has_avail_overlap` | Any time slot overlap (binary) |
| 10 | `style_gap` | Play style difference (Casual/Regular/Competitive) |
| 11 | `same_style` | Exact style match (binary) |
| 12 | `age_gap` | Age group difference |
| 13 | `same_age_group` | Same age bracket (binary) |
| 14 | `avg_sessions` | Average sessions played |
| 15 | `session_ratio` | Experience ratio between users |
| 16 | `avg_rating` | Average user rating |
| 17 | `min_rating` | Minimum rating between pair |
| 18 | `rating_gap` | Rating difference |

### Training

- **Algorithm:** Random Forest Classifier (100 trees, max_depth=10)
- **Training data:** 5,000 pairwise comparisons from 500 synthetic users
- **Labels:** Binary compatibility (threshold > 0.45)
- **Performance:** ~90% accuracy, ~0.92 AUC-ROC

### Analysis Script

`backend/recommendationSystemModel/player_matchmaking_1.py` is a standalone analytics script that:

- Trains both Random Forest and Neural Network models
- Compares performance (ROC curves, confusion matrices, feature importance)
- Runs demo recommendation scenarios
- Outputs visualizations to `outputs/`

This script is the source code deliverable for the project submission — it is not part of the running application.

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
│   │       └── feature_columns.json   # Model feature names
│   └── recommendationSystemModel/
│       └── player_matchmaking_1.py    # ML analysis script (RF + NN comparison)
├── frontend/
│   ├── package.json
│   ├── vite.config.js                 # Dev server + /api proxy config
│   ├── index.html
│   └── src/
│       ├── main.jsx                   # React entry point
│       ├── App.jsx                    # Router (7 pages)
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
│           └── FriendsPage.jsx       # Friends & nearby players
└── .gitignore
```

---

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Interactive venue map | ✅ Done | 3200x1800 map with zoom, pan, 3D venue towers, Singapore MRT/roads |
| Player matchmaking API | ✅ Done | 8 endpoints, 18-feature Random Forest model, human-readable explanations |
| ML analysis script | ✅ Done | RF + Neural Network comparison with visualizations |
| Synthetic data generation | ✅ Done | 80 users, 12 real ActiveSG venues, automated model training |
| Find Players UI | ✅ Done | Onboarding form, recommendation cards, score bars, match reasons |
| Search & browse | ✅ Done | Category browsing, nearby venues, search bar |
| Profile page | ✅ Done | Stats, XP bar, settings menu |
| Bookings page | ✅ Done | Upcoming/past tabs, cancel/modify actions |
| Workouts page | ✅ Done | Weekly chart, activity history with calories |
| Friends page | ✅ Done | Online status, "looking for players" section |
| Responsive design | ✅ Done | Mobile (bottom nav) + desktop (sidebar) layouts |
| Frontend-backend integration | 🔧 In Progress | FindPlayersPage wired to API; other pages use mock data |
| Real-time occupancy (CV/OCR) | 🔧 In Progress | Jasper's model — to be integrated |
| Demand forecasting | 🔧 In Progress | Chia Yin's model — to be integrated |
| IoT Smart Locker rental | 📋 Planned | Concept/wireframe stage |
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
