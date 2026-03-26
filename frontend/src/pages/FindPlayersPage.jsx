import { useState, useEffect, useCallback } from "react";
import $ from "../theme/tokens";
import Shell from "../components/ui/PageShell";
import Card from "../components/ui/GlassCard";
import Pill from "../components/ui/Pill";

const SPORT_ICONS = {
  Badminton: "🏸", Basketball: "🏀", Tennis: "🎾",
  "Table Tennis": "🏓", Volleyball: "🏐", Football: "⚽", Swimming: "🏊",
};

const inp = {
  width: "100%", background: $.bg2, border: `1px solid ${$.bd}`,
  borderRadius: 10, padding: "10px 14px", color: $.t1, fontSize: 14,
  fontFamily: $.font, outline: "none", boxSizing: "border-box",
  appearance: "none", WebkitAppearance: "none",
};

const lbl = {
  fontSize: 11, color: $.t3, fontWeight: 700, letterSpacing: 0.6,
  display: "block", marginBottom: 6,
};

const btnPrimary = {
  width: "100%",
  background: `linear-gradient(135deg,${$.ac},${$.ac2})`,
  border: "none", borderRadius: 12, padding: "14px 0",
  fontSize: 15, fontWeight: 700, color: $.bg,
  cursor: "pointer", fontFamily: $.font, letterSpacing: 0.3,
};

const btnOutline = {
  width: "100%", background: "transparent",
  border: `1px solid ${$.bd}`, borderRadius: 12, padding: "12px 0",
  fontSize: 13, fontWeight: 600, color: $.t2,
  cursor: "pointer", fontFamily: $.font,
};

/* ── Stars ─────────────────────────────────────────────────────────────── */
function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span style={{ fontSize: 12, color: "#F59E0B" }}>
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(empty)}
      <span style={{ color: $.t3, fontSize: 11, marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </span>
  );
}

/* ── Score bar ─────────────────────────────────────────────────────────── */
function ScoreBar({ score, height = 5 }) {
  const hi = score >= 70;
  const mid = score >= 45;
  const barColor = hi
    ? `linear-gradient(90deg,${$.ac},${$.ac2})`
    : mid
      ? "linear-gradient(90deg,#F59E0B,#FBBF24)"
      : "linear-gradient(90deg,rgba(255,255,255,0.25),rgba(255,255,255,0.4))";
  return (
    <div style={{ height, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{
        width: `${Math.min(score, 100)}%`, height: "100%", borderRadius: 3,
        background: barColor,
        boxShadow: hi ? `0 0 8px ${$.ac}50` : "none",
        transition: "width .4s ease",
      }} />
    </div>
  );
}

function scoreColor(score) {
  return score >= 70 ? $.ac : score >= 45 ? "#F59E0B" : $.t2;
}

/* ── Player mini-card (inside venue card) ──────────────────────────────── */
function PlayerRow({ p }) {
  const initials = p.display_name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div style={{
      display: "flex", gap: 10, alignItems: "center",
      padding: "10px 0", borderTop: `1px solid ${$.bd}`,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%",
        background: `linear-gradient(145deg,${$.ac}25,${$.ac2}10)`,
        border: `1.5px solid ${$.ac}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 800, color: $.ac, flexShrink: 0,
      }}>{initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{p.display_name}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(p.match_score), flexShrink: 0 }}>
            {p.match_score}%
          </span>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
          <Pill color={$.ac}>{p.skill_level}</Pill>
          <Pill color={$.ac2}>{p.play_style}</Pill>
        </div>
        <div style={{ marginTop: 4 }}><Stars rating={p.user_rating} /></div>
        {p.reasons?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 5 }}>
            {p.reasons.map((r, i) => (
              <span key={i} style={{
                fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20,
                background: `${$.ac}0A`, border: `1px solid ${$.ac}15`, color: $.t2,
              }}>{r}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Venue recommendation card ─────────────────────────────────────────── */
function VenueCard({ venue, sport, rank, isTop, onGo }) {
  const [expanded, setExpanded] = useState(false);
  const icon = SPORT_ICONS[sport] || "🏃";
  const sc = scoreColor(venue.match_score);

  return (
    <Card
      style={{
        overflow: "hidden", cursor: "pointer",
        border: isTop ? `1px solid ${$.ac}30` : undefined,
        boxShadow: isTop ? `0 0 20px ${$.ac}10` : undefined,
      }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Top pick badge */}
      {isTop && (
        <div style={{
          fontSize: 10, fontWeight: 700, color: $.bg,
          background: `linear-gradient(90deg,${$.ac},${$.ac2})`,
          padding: "3px 10px", borderRadius: 6,
          display: "inline-block", marginBottom: 10,
          letterSpacing: 0.5,
        }}>BEST MATCH</div>
      )}

      {/* Header row */}
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        {/* Rank + Venue icon */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: $.t3, fontWeight: 700 }}>#{rank}</div>
          <div style={{
            width: 46, height: 46, borderRadius: 14,
            background: `linear-gradient(145deg,${$.ac}18,${$.ac2}08)`,
            border: `1.5px solid ${$.ac}20`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
          }}>{icon}</div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + score */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>
              {venue.venue_name}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: sc, flexShrink: 0, marginLeft: 8 }}>
              {venue.match_score}%
            </div>
          </div>

          <ScoreBar score={venue.match_score} />

          {/* Meta pills row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
            <Pill color={$.t2}>📍 {venue.distance_km} km · {venue.travel_min} min</Pill>
            <Pill color={venue.players_looking > 0 ? $.ac : $.t3}>
              {venue.players_looking} player{venue.players_looking !== 1 ? "s" : ""} looking
            </Pill>
            <Pill color={$.ac2}>{venue.courts_available} court{venue.courts_available !== 1 ? "s" : ""} free</Pill>
          </div>

          {/* Availability window + expand hint */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: 8,
          }}>
            <div style={{ fontSize: 11, color: $.t3, fontWeight: 600 }}>
              ⏱ Available for ~{venue.predicted_available_min} min
            </div>
            <div style={{
              fontSize: 10, color: $.t3, fontWeight: 600,
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform .2s ease",
            }}>▼</div>
          </div>
        </div>
      </div>

      {/* Expanded: players + Go button */}
      {expanded && (
        <div style={{ marginTop: 14, animation: "a-fade .2s ease" }}>
          {/* Court details */}
          <div style={{
            fontSize: 11, fontWeight: 700, color: $.t3, letterSpacing: 0.5,
            marginBottom: 8,
          }}>AVAILABLE COURTS</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {venue.court_details.map(c => {
              const pct = c.capacity > 0 ? c.current_occupancy / c.capacity : 0;
              const cColor = pct === 0 ? $.ac : pct < 0.75 ? "#F59E0B" : $.red;
              return (
                <span key={c.court_id} style={{
                  fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 8,
                  background: $.bg2, border: `1px solid ${cColor}25`, color: $.t2,
                }}>
                  {c.court_id}
                  <span style={{ color: cColor, marginLeft: 6, fontWeight: 700 }}>
                    {c.current_occupancy}/{c.capacity}
                  </span>
                </span>
              );
            })}
          </div>

          {/* Players at this venue */}
          {venue.players.length > 0 ? (
            <>
              <div style={{
                fontSize: 11, fontWeight: 700, color: $.t3, letterSpacing: 0.5,
                marginBottom: 4,
              }}>PLAYERS LOOKING FOR A MATCH</div>
              {venue.players.map(p => <PlayerRow key={p.user_id} p={p} />)}
            </>
          ) : (
            <Card style={{
              background: $.bg2, textAlign: "center", padding: "14px 16px",
              marginBottom: 8,
            }}>
              <div style={{ fontSize: 12, color: $.t3 }}>
                No players currently looking — but courts are free!
              </div>
            </Card>
          )}

          {/* Go button */}
          <button
            onClick={e => { e.stopPropagation(); onGo(venue); }}
            style={{
              ...btnPrimary, marginTop: 14,
              boxShadow: `0 4px 20px ${$.ac}30`,
            }}
          >
            I'm heading there →
          </button>
        </div>
      )}
    </Card>
  );
}

/* ── Demo user picker ──────────────────────────────────────────────────── */
function DemoUserPicker({ onPick, onBack }) {
  const [demoUsers, setDemoUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users?active=true&looking=true")
      .then(r => r.json())
      .then(data => { setDemoUsers(data.slice(0, 12)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Shell title="Quick Demo">
      <Card style={{ marginBottom: 16, textAlign: "center", padding: "20px 16px" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
        <div style={{ fontSize: 13, color: $.t2, lineHeight: 1.5 }}>
          Pick an existing user to skip onboarding and jump straight into Find Game.
        </div>
      </Card>
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: $.t3 }}>
          <div style={{ animation: "a-spin 1s linear infinite", display: "inline-block", fontSize: 24 }}>🎯</div>
          <div style={{ marginTop: 10, fontSize: 13 }}>Loading users...</div>
        </div>
      ) : demoUsers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: $.t3, fontSize: 13 }}>
          No active users found. Start the Flask server first.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {demoUsers.map(u => (
            <Card key={u.user_id} onClick={() => onPick(u)} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: `linear-gradient(145deg,${$.ac}25,${$.ac2}10)`,
                  border: `1.5px solid ${$.ac}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800, color: $.ac,
                }}>{u.display_name.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {u.display_name} {SPORT_ICONS[u.primary_sport] || ""}
                  </div>
                  <div style={{ fontSize: 11, color: $.t3, marginTop: 2 }}>
                    {u.primary_sport} · {u.skill_level} · {u.home_venue}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: $.t3, flexShrink: 0 }}>→</div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <button onClick={onBack} style={{ ...btnOutline, marginTop: 16 }}>← Back to registration</button>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════════════════ */
export default function FindPlayersPage() {
  // Steps: "form" | "demo" | "loading" | "results" | "confirmed"
  const [step, setStep] = useState("form");
  const [config, setConfig] = useState(null);
  const [configError, setConfigError] = useState("");

  // Onboarding form state
  const [form, setForm] = useState({
    display_name: "", primary_sport: "", secondary_sport: "",
    skill_level: "", play_style: "", age_group: "",
    home_venue: "", availability: [],
  });
  const [submitError, setSubmitError] = useState("");

  // User state (set after onboarding or demo pick)
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Find Game state
  const [sportFilter, setSportFilter] = useState("");
  const [venueResults, setVenueResults] = useState([]);
  const [recsLoading, setRecsLoading] = useState(false);

  // Confirmation state
  const [confirmedVenue, setConfirmedVenue] = useState(null);

  // Load config on mount
  useEffect(() => {
    fetch("/api/config")
      .then(r => r.json())
      .then(setConfig)
      .catch(() => setConfigError(
        "Cannot connect to the matchmaking server. Start it with: cd backend/matchmakingAPI && python app.py"
      ));
  }, []);

  // Fetch venue recommendations
  const fetchVenues = useCallback(async (uid, sport) => {
    setRecsLoading(true);
    try {
      const params = new URLSearchParams();
      if (sport) params.set("sport", sport);
      const res = await fetch(`/api/find-game/${uid}?${params}`);
      const data = await res.json();
      setVenueResults(data.venues || []);
    } finally {
      setRecsLoading(false);
    }
  }, []);

  // Helpers
  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggleAvail = slot => setForm(f => ({
    ...f,
    availability: f.availability.includes(slot)
      ? f.availability.filter(s => s !== slot)
      : [...f.availability, slot],
  }));

  // Handle onboarding submit
  const handleSubmit = async () => {
    setSubmitError("");
    const { display_name, primary_sport, skill_level, play_style, age_group, home_venue, availability } = form;
    if (!display_name.trim() || !primary_sport || !skill_level || !play_style || !age_group || !home_venue || availability.length === 0) {
      setSubmitError("Please fill in all fields and select at least one availability slot.");
      return;
    }
    setStep("loading");
    try {
      const body = { ...form };
      if (!body.secondary_sport) delete body.secondary_sport;
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Registration failed.");
        setStep("form");
        return;
      }
      const uid = data.user.user_id;
      setUserId(uid);
      setUserProfile(data.user);
      const sport = primary_sport;
      setSportFilter(sport);
      await fetchVenues(uid, sport);
      setStep("results");
    } catch {
      setSubmitError("Server error. Make sure the Flask API is running on port 5000.");
      setStep("form");
    }
  };

  // Handle demo user pick
  const handleDemoPick = async (user) => {
    setStep("loading");
    setUserId(user.user_id);
    setUserProfile(user);
    const sport = user.primary_sport;
    setSportFilter(sport);
    await fetchVenues(user.user_id, sport);
    setStep("results");
  };

  // Handle sport filter change
  const handleSportChange = async (sport) => {
    setSportFilter(sport);
    await fetchVenues(userId, sport);
  };

  // Handle "I'm heading there"
  const handleGo = (venue) => {
    setConfirmedVenue(venue);
    setStep("confirmed");
  };

  /* ── DEMO PICKER ─────────────────────────────────────────────────────── */
  if (step === "demo") {
    return <DemoUserPicker onPick={handleDemoPick} onBack={() => setStep("form")} />;
  }

  /* ── ONBOARDING FORM ─────────────────────────────────────────────────── */
  if (step === "form") {
    return (
      <Shell title="Find Game">
        {configError && (
          <div style={{
            background: `${$.red}15`, border: `1px solid ${$.red}30`, borderRadius: 10,
            padding: "12px 16px", marginBottom: 16, fontSize: 13, color: $.red,
          }}>{configError}</div>
        )}
        {submitError && (
          <div style={{
            background: `${$.red}15`, border: `1px solid ${$.red}30`, borderRadius: 10,
            padding: "12px 16px", marginBottom: 16, fontSize: 13, color: $.red,
          }}>{submitError}</div>
        )}
        {!config && !configError && (
          <div style={{ textAlign: "center", padding: 40, color: $.t3 }}>
            <div style={{ animation: "a-spin 1s linear infinite", display: "inline-block", fontSize: 24 }}>🎯</div>
            <div style={{ marginTop: 10, fontSize: 13 }}>Connecting to matchmaking server...</div>
          </div>
        )}
        {config && (
          <>
            {/* Hero */}
            <Card style={{ marginBottom: 16, textAlign: "center", padding: "24px 16px" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🎯</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Find Your Game</div>
              <div style={{ fontSize: 13, color: $.t2, lineHeight: 1.5 }}>
                We'll scan all courts across Singapore and find the best match based on court availability, player compatibility, and travel distance.
              </div>
            </Card>

            <Card>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>Set up your profile</div>

              {/* Display name */}
              <label style={lbl}>DISPLAY NAME</label>
              <input
                style={{ ...inp, marginBottom: 16 }}
                value={form.display_name}
                placeholder="e.g. Wei Ming"
                onChange={e => setField("display_name", e.target.value)}
              />

              {/* Sport + Secondary sport */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={lbl}>PRIMARY SPORT</label>
                  <select style={inp} value={form.primary_sport} onChange={e => setField("primary_sport", e.target.value)}>
                    <option value="">Select sport</option>
                    {config.sports.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>SECONDARY SPORT</label>
                  <select style={inp} value={form.secondary_sport} onChange={e => setField("secondary_sport", e.target.value)}>
                    <option value="">None</option>
                    {config.sports.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Skill + Style */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={lbl}>SKILL LEVEL</label>
                  <select style={inp} value={form.skill_level} onChange={e => setField("skill_level", e.target.value)}>
                    <option value="">Select level</option>
                    {config.skill_levels.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>PLAY STYLE</label>
                  <select style={inp} value={form.play_style} onChange={e => setField("play_style", e.target.value)}>
                    <option value="">Select style</option>
                    {config.play_styles.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Age + Venue */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={lbl}>AGE GROUP</label>
                  <select style={inp} value={form.age_group} onChange={e => setField("age_group", e.target.value)}>
                    <option value="">Select age</option>
                    {config.age_groups.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>HOME VENUE</label>
                  <select style={inp} value={form.home_venue} onChange={e => setField("home_venue", e.target.value)}>
                    <option value="">Select venue</option>
                    {config.venues.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              {/* Availability */}
              <label style={lbl}>AVAILABILITY (select all that apply)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {config.time_slots.map(slot => {
                  const on = form.availability.includes(slot);
                  return (
                    <button key={slot} onClick={() => toggleAvail(slot)} style={{
                      background: on ? `${$.ac}18` : "transparent",
                      border: `1px solid ${on ? $.ac : $.bd}`,
                      borderRadius: 20, padding: "7px 15px",
                      fontSize: 12, fontWeight: 600,
                      color: on ? $.ac : $.t2,
                      cursor: "pointer", fontFamily: $.font, transition: "all .15s",
                    }}>{slot}</button>
                  );
                })}
              </div>

              <button onClick={handleSubmit} style={btnPrimary}>
                Find My Game →
              </button>
            </Card>

            {/* Skip / demo */}
            <button onClick={() => setStep("demo")} style={{ ...btnOutline, marginTop: 12 }}>
              Skip (demo) — pick an existing user
            </button>
          </>
        )}
      </Shell>
    );
  }

  /* ── LOADING ─────────────────────────────────────────────────────────── */
  if (step === "loading") {
    return (
      <Shell title="Find Game">
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: 48, animation: "a-pulse 1.5s ease infinite", display: "inline-block" }}>🎯</div>
          <div style={{ marginTop: 20, fontSize: 17, fontWeight: 700 }}>Scanning courts across Singapore...</div>
          <div style={{ marginTop: 8, fontSize: 13, color: $.t3 }}>
            Checking court availability, player compatibility &amp; travel distance
          </div>
        </div>
      </Shell>
    );
  }

  /* ── CONFIRMED ───────────────────────────────────────────────────────── */
  if (step === "confirmed" && confirmedVenue) {
    const bestCourt = confirmedVenue.court_details[0];
    return (
      <Shell title="Find Game">
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontSize: 52, marginBottom: 16, animation: "a-pop .4s ease" }}>🎉</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>You're on your way!</div>
          <div style={{ fontSize: 14, color: $.t2, lineHeight: 1.6, marginBottom: 8 }}>
            Heading to <strong style={{ color: $.t1 }}>{confirmedVenue.venue_name}</strong>
            {bestCourt && <> — {bestCourt.court_id}</>}
          </div>
          <div style={{ fontSize: 12, color: $.t3 }}>
            Players at the venue have been notified.
          </div>
        </div>

        <Card style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: `linear-gradient(145deg,${$.ac}18,${$.ac2}08)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, flexShrink: 0,
            }}>
              {SPORT_ICONS[sportFilter] || "🏃"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{confirmedVenue.venue_name}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Pill color={$.t2}>📍 {confirmedVenue.distance_km} km · ~{confirmedVenue.travel_min} min</Pill>
                <Pill color={$.ac}>{confirmedVenue.match_score}% match</Pill>
              </div>
            </div>
          </div>
        </Card>

        {/* Court + player summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <Card style={{ textAlign: "center", padding: 14 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: $.ac }}>{confirmedVenue.courts_available}</div>
            <div style={{ fontSize: 11, color: $.t3, marginTop: 2 }}>Courts available</div>
          </Card>
          <Card style={{ textAlign: "center", padding: 14 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: $.ac }}>{confirmedVenue.players_looking}</div>
            <div style={{ fontSize: 11, color: $.t3, marginTop: 2 }}>Players waiting</div>
          </Card>
        </div>

        {confirmedVenue.players.length > 0 && (
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: $.t3, letterSpacing: 0.5, marginBottom: 8 }}>
              PLAYERS NOTIFIED
            </div>
            {confirmedVenue.players.slice(0, 4).map((p, i) => (
              <div key={p.user_id} style={{
                display: "flex", gap: 8, alignItems: "center",
                padding: "8px 0",
                borderBottom: i < Math.min(confirmedVenue.players.length, 4) - 1 ? `1px solid ${$.bd}` : "none",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: `${$.ac}15`, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800, color: $.ac,
                }}>
                  {p.display_name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{p.display_name}</span>
                <Pill color={scoreColor(p.match_score)}>{p.match_score}%</Pill>
              </div>
            ))}
          </Card>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => { setStep("results"); setConfirmedVenue(null); }}
            style={{ ...btnOutline, flex: 1 }}
          >
            ← Back
          </button>
          <button
            onClick={() => { setStep("form"); setVenueResults([]); setUserId(null); setUserProfile(null); setConfirmedVenue(null); }}
            style={{ ...btnPrimary, flex: 1 }}
          >
            Find another game
          </button>
        </div>
      </Shell>
    );
  }

  /* ── RESULTS (venue-first recommendations) ──────────────────────────── */
  const totalPlayers = venueResults.reduce((s, v) => s + v.players_looking, 0);
  const totalCourts = venueResults.reduce((s, v) => s + v.courts_available, 0);

  return (
    <Shell title="Find Game">
      {/* User badge */}
      {userProfile && (
        <div style={{
          display: "flex", gap: 10, alignItems: "center",
          marginBottom: 14, fontSize: 13, color: $.t2,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `${$.ac}15`, display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: $.ac,
          }}>
            {userProfile.display_name?.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </div>
          <span style={{ fontWeight: 600 }}>{userProfile.display_name}</span>
          <span style={{ color: $.t3 }}>·</span>
          <span>{SPORT_ICONS[sportFilter]} {sportFilter}</span>
        </div>
      )}

      {/* Summary stats */}
      {!recsLoading && venueResults.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
          <Card style={{ textAlign: "center", padding: "10px 8px" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: $.ac }}>{venueResults.length}</div>
            <div style={{ fontSize: 10, color: $.t3, marginTop: 1 }}>Venues</div>
          </Card>
          <Card style={{ textAlign: "center", padding: "10px 8px" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: $.ac }}>{totalPlayers}</div>
            <div style={{ fontSize: 10, color: $.t3, marginTop: 1 }}>Players</div>
          </Card>
          <Card style={{ textAlign: "center", padding: "10px 8px" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: $.ac }}>{totalCourts}</div>
            <div style={{ fontSize: 10, color: $.t3, marginTop: 1 }}>Courts free</div>
          </Card>
        </div>
      )}

      {/* Filter bar */}
      <Card style={{ marginBottom: 14, padding: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={sportFilter}
            onChange={e => handleSportChange(e.target.value)}
            style={{ ...inp, width: "auto", flex: "1 1 120px" }}
          >
            {config?.sports.map(s => <option key={s}>{s}</option>)}
          </select>

          <button
            onClick={() => { setStep("form"); setVenueResults([]); setUserId(null); setUserProfile(null); }}
            style={{
              background: "transparent", border: `1px solid ${$.bd}`,
              borderRadius: 10, padding: "10px 14px",
              fontSize: 12, fontWeight: 600, color: $.t3,
              cursor: "pointer", fontFamily: $.font,
            }}
          >
            ← New search
          </button>
        </div>
      </Card>

      {/* Venue cards */}
      {recsLoading ? (
        <div style={{ textAlign: "center", padding: 40, color: $.t3 }}>
          <div style={{ animation: "a-spin 1s linear infinite", display: "inline-block", fontSize: 24 }}>🎯</div>
          <div style={{ marginTop: 10, fontSize: 13 }}>Scanning venues...</div>
        </div>
      ) : venueResults.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: $.t3 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🏟</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}>No venues with available courts found.</div>
          <div style={{ fontSize: 12 }}>Try a different sport or check back later.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {venueResults.map((v, i) => (
            <VenueCard
              key={v.venue_name}
              venue={v}
              sport={sportFilter}
              rank={i + 1}
              isTop={i === 0}
              onGo={handleGo}
            />
          ))}
        </div>
      )}
    </Shell>
  );
}
