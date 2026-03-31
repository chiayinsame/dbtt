"""
ActiveSG Player Matchmaking — ML Recommendation Model

Trains and evaluates a Random Forest and Neural Network for player
compatibility prediction at ActiveSG venues. Outputs ranked recommendations
and six diagnostic plots to outputs/.

Phases: data generation → feature engineering → training → evaluation → demo
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score, 
    roc_curve, accuracy_score, precision_recall_curve
)
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import warnings
import os

warnings.filterwarnings('ignore')
tf.get_logger().setLevel('ERROR')

# Set random seed for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

# Create output directory for plots
os.makedirs('outputs', exist_ok=True)

# ── 1. SYNTHETIC DATA GENERATION ─────────────────────────────────────────────

print("=" * 60)
print("PHASE 1: GENERATING SYNTHETIC USER & MATCH DATA")
print("=" * 60)

# Configuration
NUM_USERS = 500
NUM_MATCHES = 5000

# Singapore ActiveSG venue locations (real coordinates)
VENUES = {
    'Kallang Badminton Hall': (1.3020, 103.8750),
    'Jurong East Sports Centre': (1.3330, 103.7420),
    'Tampines Sports Hall': (1.3530, 103.9440),
    'Bishan Sports Hall': (1.3510, 103.8480),
    'Clementi Sports Hall': (1.3150, 103.7650),
    'Yio Chu Kang Sports Hall': (1.3820, 103.8450),
    'Sengkang Sports Centre': (1.3920, 103.8950),
    'Hougang Sports Centre': (1.3710, 103.8930),
    'Woodlands Sports Centre': (1.4370, 103.7860),
    'Pasir Ris Sports Centre': (1.3730, 103.9490),
    'Toa Payoh Sports Hall': (1.3340, 103.8510),
    'Choa Chu Kang Sports Centre': (1.3850, 103.7440),
}

SPORTS = ['Badminton', 'Basketball', 'Tennis', 'Table Tennis', 
           'Volleyball', 'Football', 'Swimming']

SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Competitive']

PLAY_STYLES = ['Casual', 'Regular', 'Competitive']

TIME_SLOTS = [
    'Weekday Morning', 'Weekday Afternoon', 'Weekday Evening',
    'Weekend Morning', 'Weekend Afternoon', 'Weekend Evening'
]

AGE_GROUPS = ['13-19', '20-29', '30-39', '40-49', '50-59', '60+']


def generate_users(n=NUM_USERS):
    """Generate n synthetic user profiles with realistic Singapore demographics."""
    users = []

    for i in range(n):
        age_group = np.random.choice(AGE_GROUPS, p=[0.12, 0.25, 0.22, 0.18, 0.13, 0.10])

        # Badminton is most popular in Singapore
        primary_sport = np.random.choice(SPORTS, p=[0.30, 0.15, 0.10, 0.15, 0.08, 0.12, 0.10])

        has_secondary = np.random.random() < 0.35
        secondary_sport = np.random.choice(
            [s for s in SPORTS if s != primary_sport]
        ) if has_secondary else None

        # Skill level correlated with age
        if age_group == '13-19':
            skill = np.random.choice(SKILL_LEVELS, p=[0.30, 0.40, 0.20, 0.10])
        elif age_group in ['20-29', '30-39']:
            skill = np.random.choice(SKILL_LEVELS, p=[0.15, 0.35, 0.30, 0.20])
        else:
            skill = np.random.choice(SKILL_LEVELS, p=[0.20, 0.40, 0.30, 0.10])

        style = np.random.choice(PLAY_STYLES, p=[0.40, 0.35, 0.25])

        home_venue = np.random.choice(list(VENUES.keys()))
        home_lat, home_lon = VENUES[home_venue]

        # 2–4 time slots; working adults prefer evenings/weekends
        num_slots = np.random.randint(2, 5)
        if age_group in ['20-29', '30-39', '40-49']:
            slot_weights = [0.05, 0.05, 0.30, 0.20, 0.20, 0.20]
        elif age_group == '13-19':
            slot_weights = [0.10, 0.20, 0.20, 0.15, 0.20, 0.15]
        else:  # 50+, retired — prefer mornings
            slot_weights = [0.25, 0.25, 0.10, 0.20, 0.15, 0.05]
        slot_weights = np.array(slot_weights) / sum(slot_weights)
        availability = list(np.random.choice(TIME_SLOTS, size=num_slots, replace=False, p=slot_weights))

        sessions = max(1, int(np.random.exponential(15)))
        rating = round(np.clip(np.random.normal(3.8, 0.7), 1.0, 5.0), 1)
        
        users.append({
            'user_id': f'U{i+1:04d}',
            'age_group': age_group,
            'primary_sport': primary_sport,
            'secondary_sport': secondary_sport,
            'skill_level': skill,
            'play_style': style,
            'home_venue': home_venue,
            'latitude': home_lat,
            'longitude': home_lon,
            'availability': availability,
            'total_sessions': sessions,
            'user_rating': rating
        })
    
    return pd.DataFrame(users)


def calculate_compatibility(user_a, user_b):
    """Compute a ground-truth compatibility score (0–1) used to generate training labels."""
    score = 0.0

    sports_a = {user_a['primary_sport']}
    if user_a['secondary_sport']:
        sports_a.add(user_a['secondary_sport'])
    sports_b = {user_b['primary_sport']}
    if user_b['secondary_sport']:
        sports_b.add(user_b['secondary_sport'])

    if not (sports_a & sports_b):
        return 0.05  # No sport in common — floor score

    score += 0.25 if user_a['primary_sport'] == user_b['primary_sport'] else 0.10

    # Skill gap
    skill_map = {'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Competitive': 4}
    skill_gap = abs(skill_map[user_a['skill_level']] - skill_map[user_b['skill_level']])
    score += {0: 0.20, 1: 0.12, 2: 0.04}.get(skill_gap, 0.0)

    # Distance (Euclidean × 111 ≈ km)
    dist = np.sqrt(
        (user_a['latitude'] - user_b['latitude'])**2 +
        (user_a['longitude'] - user_b['longitude'])**2
    ) * 111
    if dist < 3:   score += 0.15
    elif dist < 7: score += 0.10
    elif dist < 12: score += 0.05

    # Availability overlap (capped at 3 slots)
    avail_overlap = len(set(user_a['availability']) & set(user_b['availability']))
    score += min(avail_overlap * 0.06, 0.18)

    # Play style compatibility
    style_compat = {
        ('Casual', 'Casual'): 0.12,
        ('Casual', 'Regular'): 0.08,
        ('Casual', 'Competitive'): 0.02,
        ('Regular', 'Regular'): 0.12,
        ('Regular', 'Competitive'): 0.08,
        ('Competitive', 'Competitive'): 0.12,
    }
    style_pair = tuple(sorted([user_a['play_style'], user_b['play_style']]))
    score += style_compat.get(style_pair, 0.05)

    # Age compatibility
    age_map = {'13-19': 16, '20-29': 25, '30-39': 35, '40-49': 45, '50-59': 55, '60+': 65}
    age_gap = abs(age_map[user_a['age_group']] - age_map[user_b['age_group']])
    
    if age_gap <= 10:   score += 0.08
    elif age_gap <= 20: score += 0.04

    # Rating bonus (small)
    avg_rating = (user_a['user_rating'] + user_b['user_rating']) / 2
    score += (avg_rating - 3.0) * 0.03

    # Clip, add noise, clip again
    score = np.clip(score + np.random.normal(0, 0.08), 0, 1)
    
    return score


def generate_match_history(users_df, n_matches=NUM_MATCHES):
    """Sample n_matches random user pairs and compute ground-truth compatibility."""
    matches = []
    user_list = users_df.to_dict('records')
    n_users = len(user_list)

    for _ in range(n_matches):
        idx_a, idx_b = np.random.choice(n_users, size=2, replace=False)
        user_a = user_list[idx_a]
        user_b = user_list[idx_b]

        compat_score = calculate_compatibility(user_a, user_b)
        is_good_match = 1 if compat_score > 0.45 else 0

        matches.append({
            'user_a_id': user_a['user_id'],
            'user_b_id': user_b['user_id'],
            'compatibility_score': round(compat_score, 3),
            'is_good_match': is_good_match,
            'a_sport': user_a['primary_sport'],
            'b_sport': user_b['primary_sport'],
            'a_secondary': user_a['secondary_sport'],
            'b_secondary': user_b['secondary_sport'],
            'a_skill': user_a['skill_level'],
            'b_skill': user_b['skill_level'],
            'a_style': user_a['play_style'],
            'b_style': user_b['play_style'],
            'a_age': user_a['age_group'],
            'b_age': user_b['age_group'],
            'a_lat': user_a['latitude'],
            'a_lon': user_a['longitude'],
            'b_lat': user_b['latitude'],
            'b_lon': user_b['longitude'],
            'a_availability': user_a['availability'],
            'b_availability': user_b['availability'],
            'a_sessions': user_a['total_sessions'],
            'b_sessions': user_b['total_sessions'],
            'a_rating': user_a['user_rating'],
            'b_rating': user_b['user_rating'],
        })
    
    return pd.DataFrame(matches)


# Generate data
print("\nGenerating 500 synthetic user profiles...")
users_df = generate_users()
print(f"  Users created: {len(users_df)}")
print(f"  Sport distribution:")
for sport, count in users_df['primary_sport'].value_counts().items():
    print(f"    {sport}: {count} ({count/len(users_df)*100:.1f}%)")

print(f"\nGenerating {NUM_MATCHES} match pairs...")
matches_df = generate_match_history(users_df)
print(f"  Good matches: {matches_df['is_good_match'].sum()} ({matches_df['is_good_match'].mean()*100:.1f}%)")
print(f"  Poor matches: {(1-matches_df['is_good_match']).sum()} ({(1-matches_df['is_good_match'].mean())*100:.1f}%)")


# ── 2. FEATURE ENGINEERING ───────────────────────────────────────────────────

print("\n" + "=" * 60)
print("PHASE 2: FEATURE ENGINEERING")
print("=" * 60)


def engineer_features(df):
    """Build the 18 pairwise compatibility features from a match records DataFrame."""
    features = pd.DataFrame()

    # Sport features
    features['sport_match'] = (df['a_sport'] == df['b_sport']).astype(int)

    def any_sport_overlap(row):
        sports_a = {row['a_sport']}
        if row['a_secondary']:
            sports_a.add(row['a_secondary'])
        sports_b = {row['b_sport']}
        if row['b_secondary']:
            sports_b.add(row['b_secondary'])
        return int(bool(sports_a & sports_b))
    
    features['any_sport_overlap'] = df.apply(any_sport_overlap, axis=1)

    # Skill features
    skill_map = {'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Competitive': 4}
    features['skill_gap'] = abs(df['a_skill'].map(skill_map) - df['b_skill'].map(skill_map))
    features['avg_skill'] = (df['a_skill'].map(skill_map) + df['b_skill'].map(skill_map)) / 2
    features['same_skill'] = (df['a_skill'] == df['b_skill']).astype(int)

    # Distance features (Euclidean × 111 ≈ km)
    features['distance_km'] = np.sqrt(
        (df['a_lat'] - df['b_lat'])**2 + (df['a_lon'] - df['b_lon'])**2
    ) * 111
    features['nearby'] = (features['distance_km'] < 5).astype(int)

    # Availability features
    features['avail_overlap'] = df.apply(
        lambda r: len(set(r['a_availability']) & set(r['b_availability'])), axis=1
    )
    features['has_avail_overlap'] = (features['avail_overlap'] > 0).astype(int)

    # Play style features
    style_map = {'Casual': 1, 'Regular': 2, 'Competitive': 3}
    features['style_gap'] = abs(df['a_style'].map(style_map) - df['b_style'].map(style_map))
    features['same_style'] = (df['a_style'] == df['b_style']).astype(int)

    # Age features
    age_map = {'13-19': 16, '20-29': 25, '30-39': 35, '40-49': 45, '50-59': 55, '60+': 65}
    features['age_gap'] = abs(df['a_age'].map(age_map) - df['b_age'].map(age_map))
    features['same_age_group'] = (df['a_age'] == df['b_age']).astype(int)

    # Experience features
    features['avg_sessions'] = (df['a_sessions'] + df['b_sessions']) / 2
    features['session_ratio'] = (
        df[['a_sessions', 'b_sessions']].min(axis=1) /
        df[['a_sessions', 'b_sessions']].max(axis=1)
    )

    # Rating features
    features['avg_rating'] = (df['a_rating'] + df['b_rating']) / 2
    features['min_rating'] = df[['a_rating', 'b_rating']].min(axis=1)
    features['rating_gap'] = abs(df['a_rating'] - df['b_rating'])
    
    return features


# Engineer features
feature_df = engineer_features(matches_df)
target = matches_df['is_good_match']

print(f"\nEngineered {len(feature_df.columns)} pairwise features:")
for col in feature_df.columns:
    print(f"  - {col}")

print(f"\nFeature matrix shape: {feature_df.shape}")
print(f"\nFeature statistics:")
print(feature_df.describe().round(3).to_string())


# ── 3. MODEL TRAINING ────────────────────────────────────────────────────────

print("\n" + "=" * 60)
print("PHASE 3: MODEL TRAINING")
print("=" * 60)

X_train, X_test, y_train, y_test = train_test_split(
    feature_df, target, test_size=0.2, random_state=42, stratify=target
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"\nTraining set: {len(X_train)} samples")
print(f"Test set:     {len(X_test)} samples")

# Random Forest
print("\n--- Training Random Forest ---")
rf_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    random_state=42
)
rf_model.fit(X_train_scaled, y_train)
rf_pred = rf_model.predict(X_test_scaled)
rf_prob = rf_model.predict_proba(X_test_scaled)[:, 1]

rf_acc = accuracy_score(y_test, rf_pred)
rf_auc = roc_auc_score(y_test, rf_prob)
print(f"  Accuracy: {rf_acc:.4f}")
print(f"  AUC-ROC:  {rf_auc:.4f}")


# Neural Network
print("\n--- Training Neural Network ---")

nn_model = keras.Sequential([
    layers.Dense(64, activation='relu', input_shape=(X_train_scaled.shape[1],)),
    layers.BatchNormalization(),
    layers.Dropout(0.3),
    layers.Dense(32, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.2),
    layers.Dense(16, activation='relu'),
    layers.Dense(1, activation='sigmoid')
])

nn_model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

history = nn_model.fit(
    X_train_scaled, y_train,
    epochs=50,
    batch_size=32,
    validation_split=0.2,
    verbose=0
)

nn_pred_prob = nn_model.predict(X_test_scaled, verbose=0).flatten()
nn_pred = (nn_pred_prob > 0.5).astype(int)

nn_acc = accuracy_score(y_test, nn_pred)
nn_auc = roc_auc_score(y_test, nn_pred_prob)
print(f"  Accuracy: {nn_acc:.4f}")
print(f"  AUC-ROC:  {nn_auc:.4f}")


# ── 4. EVALUATION & VISUALISATION ────────────────────────────────────────────

print("\n" + "=" * 60)
print("PHASE 4: MODEL EVALUATION")
print("=" * 60)

print("\n--- Random Forest Classification Report ---")
print(classification_report(y_test, rf_pred, target_names=['Poor Match', 'Good Match']))

print("\n--- Neural Network Classification Report ---")
print(classification_report(y_test, nn_pred, target_names=['Poor Match', 'Good Match']))

print("\n" + "-" * 50)
print("MODEL COMPARISON SUMMARY")
print("-" * 50)
print(f"{'Metric':<20} {'Random Forest':<18} {'Neural Network':<18}")
print(f"{'Accuracy':<20} {rf_acc:<18.4f} {nn_acc:<18.4f}")
print(f"{'AUC-ROC':<20} {rf_auc:<18.4f} {nn_auc:<18.4f}")

best_model_name = "Neural Network" if nn_auc > rf_auc else "Random Forest"
print(f"\n>> Best model by AUC-ROC: {best_model_name}")


# Plot 1: Neural Network Training History

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Loss
axes[0].plot(history.history['loss'], label='Training Loss', color='#1a7a6d', linewidth=2)
axes[0].plot(history.history['val_loss'], label='Validation Loss', color='#c8e64e', linewidth=2)
axes[0].set_title('Neural Network Training Loss', fontsize=13, fontweight='bold')
axes[0].set_xlabel('Epoch')
axes[0].set_ylabel('Loss')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# Accuracy
axes[1].plot(history.history['accuracy'], label='Training Accuracy', color='#1a7a6d', linewidth=2)
axes[1].plot(history.history['val_accuracy'], label='Validation Accuracy', color='#c8e64e', linewidth=2)
axes[1].set_title('Neural Network Training Accuracy', fontsize=13, fontweight='bold')
axes[1].set_xlabel('Epoch')
axes[1].set_ylabel('Accuracy')
axes[1].legend()
axes[1].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('outputs/01_training_history.png', dpi=150, bbox_inches='tight')
plt.close()
print("\nSaved: outputs/01_training_history.png")


# Plot 2: ROC Curve Comparison

fig, ax = plt.subplots(figsize=(8, 7))

# Random Forest ROC
rf_fpr, rf_tpr, _ = roc_curve(y_test, rf_prob)
ax.plot(rf_fpr, rf_tpr, color='#1a7a6d', linewidth=2.5,
        label=f'Random Forest (AUC = {rf_auc:.3f})')

# Neural Network ROC
nn_fpr, nn_tpr, _ = roc_curve(y_test, nn_pred_prob)
ax.plot(nn_fpr, nn_tpr, color='#c8e64e', linewidth=2.5,
        label=f'Neural Network (AUC = {nn_auc:.3f})')

# Diagonal
ax.plot([0, 1], [0, 1], 'k--', alpha=0.5, label='Random (AUC = 0.500)')

ax.set_xlabel('False Positive Rate', fontsize=12)
ax.set_ylabel('True Positive Rate', fontsize=12)
ax.set_title('ROC Curve Comparison: Player Matchmaking Models', fontsize=13, fontweight='bold')
ax.legend(fontsize=11)
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('outputs/02_roc_comparison.png', dpi=150, bbox_inches='tight')
plt.close()
print("Saved: outputs/02_roc_comparison.png")


# Plot 3: Confusion Matrices

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

for ax, pred, name in [(axes[0], rf_pred, 'Random Forest'), 
                         (axes[1], nn_pred, 'Neural Network')]:
    cm = confusion_matrix(y_test, pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='YlGn', ax=ax,
                xticklabels=['Poor Match', 'Good Match'],
                yticklabels=['Poor Match', 'Good Match'],
                annot_kws={'size': 14})
    ax.set_title(f'{name} Confusion Matrix', fontsize=13, fontweight='bold')
    ax.set_xlabel('Predicted')
    ax.set_ylabel('Actual')

plt.tight_layout()
plt.savefig('outputs/03_confusion_matrices.png', dpi=150, bbox_inches='tight')
plt.close()
print("Saved: outputs/03_confusion_matrices.png")


# Plot 4: Feature Importance (Random Forest)

importances = rf_model.feature_importances_
feat_imp = pd.Series(importances, index=feature_df.columns).sort_values(ascending=True)

fig, ax = plt.subplots(figsize=(10, 7))
colors = plt.cm.YlGn(np.linspace(0.3, 0.9, len(feat_imp)))
feat_imp.plot(kind='barh', ax=ax, color=colors)
ax.set_title('Feature Importance for Player Matchmaking', fontsize=13, fontweight='bold')
ax.set_xlabel('Importance Score')
ax.grid(True, axis='x', alpha=0.3)

plt.tight_layout()
plt.savefig('outputs/04_feature_importance.png', dpi=150, bbox_inches='tight')
plt.close()
print("Saved: outputs/04_feature_importance.png")


# Plot 5: User Demographics Overview

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

sport_counts = users_df['primary_sport'].value_counts()
colors_sport = ['#1a7a6d', '#238b7e', '#2d9c8f', '#42b5a1', '#5dc9b3', '#8ddbc7', '#c8e64e']
axes[0, 0].pie(sport_counts.values, labels=sport_counts.index, autopct='%1.1f%%',
               colors=colors_sport, startangle=90)
axes[0, 0].set_title('Primary Sport Distribution', fontsize=12, fontweight='bold')

skill_counts = users_df['skill_level'].value_counts().reindex(SKILL_LEVELS)
axes[0, 1].bar(skill_counts.index, skill_counts.values, color='#1a7a6d', edgecolor='white')
axes[0, 1].set_title('Skill Level Distribution', fontsize=12, fontweight='bold')
axes[0, 1].set_ylabel('Number of Users')

age_counts = users_df['age_group'].value_counts().reindex(AGE_GROUPS)
axes[1, 0].bar(age_counts.index, age_counts.values, color='#c8e64e', edgecolor='white')
axes[1, 0].set_title('Age Group Distribution', fontsize=12, fontweight='bold')
axes[1, 0].set_ylabel('Number of Users')

style_counts = users_df['play_style'].value_counts()
axes[1, 1].bar(style_counts.index, style_counts.values, color='#42b5a1', edgecolor='white')
axes[1, 1].set_title('Play Style Distribution', fontsize=12, fontweight='bold')
axes[1, 1].set_ylabel('Number of Users')

plt.suptitle('ActiveSG User Demographics Overview', fontsize=14, fontweight='bold', y=1.01)
plt.tight_layout()
plt.savefig('outputs/05_user_demographics.png', dpi=150, bbox_inches='tight')
plt.close()
print("Saved: outputs/05_user_demographics.png")


# Plot 6: Compatibility Score Distribution

fig, ax = plt.subplots(figsize=(10, 5))

good = matches_df[matches_df['is_good_match'] == 1]['compatibility_score']
poor = matches_df[matches_df['is_good_match'] == 0]['compatibility_score']

ax.hist(poor, bins=30, alpha=0.7, color='#d4534a', label='Poor Match', edgecolor='white')
ax.hist(good, bins=30, alpha=0.7, color='#1a7a6d', label='Good Match', edgecolor='white')
ax.axvline(x=0.45, color='black', linestyle='--', linewidth=1.5, label='Decision Threshold (0.45)')
ax.set_title('Distribution of Compatibility Scores', fontsize=13, fontweight='bold')
ax.set_xlabel('Compatibility Score')
ax.set_ylabel('Number of Pairs')
ax.legend(fontsize=11)
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('outputs/06_compatibility_distribution.png', dpi=150, bbox_inches='tight')
plt.close()
print("Saved: outputs/06_compatibility_distribution.png")


# ── 5. RECOMMENDATION DEMO ───────────────────────────────────────────────────

print("\n" + "=" * 60)
print("PHASE 5: RECOMMENDATION DEMO")
print("=" * 60)

if nn_auc >= rf_auc:
    best_model = nn_model
    model_type = 'neural_network'
    print(f"\nUsing Neural Network (AUC: {nn_auc:.3f}) for recommendations")
else:
    best_model = rf_model
    model_type = 'random_forest'
    print(f"\nUsing Random Forest (AUC: {rf_auc:.3f}) for recommendations")


def recommend_players(target_user_id, users_df, model, scaler, model_type,
                      sport_filter=None, top_n=5):
    """Return the top-N most compatible players for the given user."""
    target = users_df[users_df['user_id'] == target_user_id].iloc[0]
    candidates = users_df[users_df['user_id'] != target_user_id].copy()

    if sport_filter:
        candidates = candidates[
            (candidates['primary_sport'] == sport_filter) |
            (candidates['secondary_sport'] == sport_filter)
        ]

    pairs = []
    for _, cand in candidates.iterrows():
        pair = {
            'a_sport': target['primary_sport'],
            'b_sport': cand['primary_sport'],
            'a_secondary': target['secondary_sport'],
            'b_secondary': cand['secondary_sport'],
            'a_skill': target['skill_level'],
            'b_skill': cand['skill_level'],
            'a_style': target['play_style'],
            'b_style': cand['play_style'],
            'a_age': target['age_group'],
            'b_age': cand['age_group'],
            'a_lat': target['latitude'],
            'a_lon': target['longitude'],
            'b_lat': cand['latitude'],
            'b_lon': cand['longitude'],
            'a_availability': target['availability'],
            'b_availability': cand['availability'],
            'a_sessions': target['total_sessions'],
            'b_sessions': cand['total_sessions'],
            'a_rating': target['user_rating'],
            'b_rating': cand['user_rating'],
        }
        pairs.append(pair)
    
    pairs_df = pd.DataFrame(pairs)
    pair_features = engineer_features(pairs_df)
    pair_scaled = scaler.transform(pair_features)

    if model_type == 'neural_network':
        scores = model.predict(pair_scaled, verbose=0).flatten()
    else:
        scores = model.predict_proba(pair_scaled)[:, 1]

    candidates = candidates.copy()
    candidates['match_score'] = scores
    top = candidates.nlargest(top_n, 'match_score')
    
    return top, target


def display_recommendations(target_user_id, users_df, model, scaler, model_type,
                             sport_filter=None, top_n=5):
    """Display formatted recommendations with explanations."""
    
    top, target = recommend_players(
        target_user_id, users_df, model, scaler, model_type, sport_filter, top_n
    )
    
    print(f"\n{'─' * 60}")
    print(f"  PLAYER RECOMMENDATIONS FOR: {target['user_id']}")
    print(f"{'─' * 60}")
    print(f"  Sport: {target['primary_sport']}" + 
          (f" / {target['secondary_sport']}" if target['secondary_sport'] else ""))
    print(f"  Skill: {target['skill_level']}  |  Style: {target['play_style']}")
    print(f"  Age: {target['age_group']}  |  Venue: {target['home_venue']}")
    print(f"  Rating: {'★' * int(target['user_rating'])}{'☆' * (5 - int(target['user_rating']))} ({target['user_rating']})")
    print(f"  Available: {', '.join(target['availability'])}")
    if sport_filter:
        print(f"  Filtering for: {sport_filter}")
    print(f"{'─' * 60}")
    
    for rank, (_, player) in enumerate(top.iterrows(), 1):
        score_pct = player['match_score'] * 100
        bar = '█' * int(score_pct / 5) + '░' * (20 - int(score_pct / 5))
        
        # Generate explanation
        reasons = []
        if player['primary_sport'] == target['primary_sport']:
            reasons.append(f"Same sport ({player['primary_sport']})")
        if player['skill_level'] == target['skill_level']:
            reasons.append(f"Same skill ({player['skill_level']})")
        if player['play_style'] == target['play_style']:
            reasons.append(f"Same style ({player['play_style']})")
        
        avail_overlap = set(target['availability']) & set(player['availability'])
        if avail_overlap:
            reasons.append(f"{len(avail_overlap)} shared time slot(s)")
        
        dist = np.sqrt(
            (target['latitude'] - player['latitude'])**2 +
            (target['longitude'] - player['longitude'])**2
        ) * 111
        if dist < 5:
            reasons.append(f"Nearby ({dist:.1f}km)")
        
        print(f"\n  #{rank}  {player['user_id']}  [{bar}] {score_pct:.1f}%")
        print(f"      Sport: {player['primary_sport']}" +
              (f" / {player['secondary_sport']}" if player['secondary_sport'] else "") +
              f"  |  Skill: {player['skill_level']}")
        print(f"      Style: {player['play_style']}  |  Age: {player['age_group']}  |  Rating: {player['user_rating']}")
        print(f"      Venue: {player['home_venue']}")
        if reasons:
            print(f"      Why:   {' • '.join(reasons)}")
    
    print(f"\n{'─' * 60}")


# --- Run Demo Scenarios ---

print("\n" + "=" * 60)
print("SCENARIO 1: Casual badminton player looking for a partner")
print("=" * 60)
# Find a casual badminton player
casual_badminton = users_df[
    (users_df['primary_sport'] == 'Badminton') & 
    (users_df['play_style'] == 'Casual')
].iloc[0]
display_recommendations(casual_badminton['user_id'], users_df, best_model, 
                         scaler, model_type, sport_filter='Badminton')

print("\n" + "=" * 60)
print("SCENARIO 2: Competitive basketball player seeking teammates")
print("=" * 60)
comp_basketball = users_df[
    (users_df['primary_sport'] == 'Basketball') & 
    (users_df['skill_level'].isin(['Advanced', 'Competitive']))
].iloc[0]
display_recommendations(comp_basketball['user_id'], users_df, best_model, 
                         scaler, model_type, sport_filter='Basketball')

print("\n" + "=" * 60)
print("SCENARIO 3: Elderly user looking for any sport partner")
print("=" * 60)
elderly_user = users_df[users_df['age_group'] == '60+'].iloc[0]
display_recommendations(elderly_user['user_id'], users_df, best_model, 
                         scaler, model_type)


# ── FINAL SUMMARY ────────────────────────────────────────────────────────────

print("\n" + "=" * 60)
print("SUMMARY: PLAYER MATCHMAKING MODEL")
print("=" * 60)

print(f"""
Dataset:
  • {NUM_USERS} synthetic user profiles
  • {NUM_MATCHES} pairwise match records
  • {len(feature_df.columns)} engineered features

Models Trained:
  • Random Forest  — Accuracy: {rf_acc:.3f}, AUC-ROC: {rf_auc:.3f}
  • Neural Network — Accuracy: {nn_acc:.3f}, AUC-ROC: {nn_auc:.3f}

Key Features (by importance):
""")

top_features = feat_imp.tail(5)
for feat, imp in top_features.items():
    print(f"  • {feat}: {imp:.4f}")

print(f"""
Application in ActiveSG Platform:
  • Walk-in users can find compatible players at their venue in real-time
  • Groups needing 1-2 extra players get ranked suggestions
  • Model considers sport, skill, location, availability, and play style
  • Continuously improves as more match data is collected
  
Output Files:
  • outputs/01_training_history.png
  • outputs/02_roc_comparison.png
  • outputs/03_confusion_matrices.png
  • outputs/04_feature_importance.png
  • outputs/05_user_demographics.png
  • outputs/06_compatibility_distribution.png
""")

# Save data for reference
users_df.to_csv('outputs/user_profiles.csv', index=False)
matches_df.to_csv('outputs/match_history.csv', index=False)
print("Saved: outputs/user_profiles.csv")
print("Saved: outputs/match_history.csv")

print("\n Player Matchmaking Model complete.")
