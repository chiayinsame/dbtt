import { useState } from "react";
import $ from "../theme/tokens";
import Shell from "../components/ui/PageShell";
import Card from "../components/ui/GlassCard";
import Pill from "../components/ui/Pill";
import ClassSignUpSheet from "../components/classes/ClassSignUpSheet";

const CLASSES = [
  {
    id: 1, title: "Sunrise Yoga", category: "Yoga",
    venue: "Kallang ActiveSG", time: "Sat 7:00 – 8:00 AM",
    coach: "Sarah Tan", spots: 8, maxSpots: 20, level: "All Levels",
    icon: "🧘", color: "#A855F7",
    desc: "Start your weekend with a calming vinyasa flow suitable for all fitness levels.",
  },
  {
    id: 2, title: "Basketball Academy", category: "Academy",
    venue: "Bishan ActiveSG Stadium", time: "Sun 9:00 – 11:00 AM",
    coach: "Coach Marcus Lee", spots: 3, maxSpots: 16, level: "Intermediate",
    icon: "🏀", color: "#F5A623",
    desc: "Sharpen your dribbling, shooting, and game IQ with structured drills and scrimmages.",
  },
  {
    id: 3, title: "Tai Chi for Wellness", category: "Tai Chi",
    venue: "Toa Payoh Sports Hall", time: "Tue & Thu 6:30 – 7:30 AM",
    coach: "Master Chen Wei", spots: 15, maxSpots: 30, level: "Beginner",
    icon: "🥋", color: "#00D68F",
    desc: "Gentle movements to improve balance, flexibility, and mental clarity.",
  },
  {
    id: 4, title: "HIIT Bootcamp", category: "Fitness",
    venue: "Jurong East ActiveSG", time: "Mon, Wed, Fri 6:00 – 7:00 PM",
    coach: "Danial Aziz", spots: 0, maxSpots: 25, level: "Advanced",
    icon: "💪", color: "#F43F5E",
    desc: "High-intensity interval training to torch calories and build endurance.",
  },
  {
    id: 5, title: "Badminton Basics", category: "Academy",
    venue: "Tampines Hub", time: "Sat 2:00 – 4:00 PM",
    coach: "Jasmine Ng", spots: 6, maxSpots: 12, level: "Beginner",
    icon: "🏸", color: "#00D68F",
    desc: "Learn proper grip, footwork, and basic strokes. Rackets provided.",
  },
  {
    id: 6, title: "Aqua Aerobics", category: "Swimming",
    venue: "Clementi Swimming Complex", time: "Wed 10:00 – 11:00 AM",
    coach: "Linda Ho", spots: 10, maxSpots: 20, level: "All Levels",
    icon: "🏊", color: "#00B4D8",
    desc: "Low-impact water workout perfect for joint-friendly cardio training.",
  },
  {
    id: 7, title: "Football Skills Clinic", category: "Academy",
    venue: "Woodlands ActiveSG", time: "Sun 4:00 – 6:00 PM",
    coach: "Coach Ravi", spots: 5, maxSpots: 22, level: "Intermediate",
    icon: "⚽", color: "#A855F7",
    desc: "Passing, positioning, and small-sided games to level up your football.",
  },
  {
    id: 8, title: "Power Yoga", category: "Yoga",
    venue: "Sengkang ActiveSG", time: "Thu 7:00 – 8:00 PM",
    coach: "Priya Menon", spots: 12, maxSpots: 18, level: "Intermediate",
    icon: "🧘", color: "#A855F7",
    desc: "Dynamic, strength-focused yoga flow to build core stability and flexibility.",
  },
];

const ClassesPage = ({onBack}) => {
  const [showSignUp, setShowSignUp]     = useState(false);
  const [confirmedBookings, setConfirmedBookings] = useState([]);

  const handleBooked = (booking) => {
    setConfirmedBookings(prev => [...prev, booking]);
  };

  return (
    <>
      <Shell title="Classes & Programmes" onBack={onBack}>

        {/* ── Confirmed bookings section ─────────────────────────── */}
        {confirmedBookings.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: $.t3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
              My Upcoming Classes
            </div>
            {confirmedBookings.map((b, i) => (
              <div key={i} style={{
                display: "flex", gap: 14, padding: "14px 16px",
                background: `${b.color}0C`,
                border: `1px solid ${b.color}30`,
                borderLeft: `3px solid ${b.color}`,
                borderRadius: 12, marginBottom: 8,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${b.color}18`, border: `1px solid ${b.color}35`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>{b.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: $.t1 }}>{b.title}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 800, color: b.color,
                      background: `${b.color}18`, padding: "3px 8px", borderRadius: 20,
                      border: `1px solid ${b.color}30`, whiteSpace: "nowrap",
                    }}>✓ Confirmed</span>
                  </div>
                  <div style={{ fontSize: 12, color: $.t2, marginTop: 3 }}>
                    📅 {b.session.fullLabel}  ·  6:30 – 7:30 AM
                  </div>
                  <div style={{ fontSize: 11, color: $.t3, marginTop: 2 }}>📍 {b.venue}</div>
                  <div style={{ fontSize: 10, color: $.t3, marginTop: 4, letterSpacing: 0.3 }}>Ref: {b.ref}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Subtitle ───────────────────────────────────────────── */}
        <div style={{ fontSize: 13, color: $.t3, marginBottom: 18 }}>
          Browse guided classes and academies at ActiveSG venues
        </div>

        {/* ── Filter chips ───────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          {["All", "Yoga", "Academy", "Fitness", "Swimming", "Tai Chi"].map(cat => (
            <button key={cat} style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: cat === "All" ? $.ac : "rgba(255,255,255,0.05)",
              color: cat === "All" ? $.bg : $.t2,
              border: cat === "All" ? "none" : `1px solid ${$.bd}`,
              cursor: "pointer", fontFamily: $.font, whiteSpace: "nowrap", flexShrink: 0,
            }}>{cat}</button>
          ))}
        </div>

        {/* ── Class cards ────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {CLASSES.map(cls => {
            const full     = cls.spots === 0;
            const isTaiChi = cls.id === 3;
            const booked   = confirmedBookings.some(b => b.classId === cls.id);
            return (
              <Card
                key={cls.id}
                onClick={isTaiChi && !booked ? () => setShowSignUp(true) : undefined}
                style={{
                  padding: 16,
                  cursor: isTaiChi && !booked ? "pointer" : "default",
                  ...(isTaiChi && { border: `1px solid ${cls.color}30`, boxShadow: `0 0 20px ${cls.color}08` }),
                }}
              >
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: `${cls.color}12`, border: `1px solid ${cls.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26, flexShrink: 0,
                  }}>{cls.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{cls.title}</div>
                      <Pill color={cls.color}>{cls.category}</Pill>
                    </div>
                    <div style={{ fontSize: 12, color: $.t3, marginTop: 4 }}>{cls.desc}</div>
                    <div style={{ fontSize: 11, color: $.t3, marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                      <span>📍 {cls.venue}</span>
                      <span>🕐 {cls.time}</span>
                      <span>👤 {cls.coach}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Pill color={full ? "#E63946" : $.ac}>
                          {full ? "Full" : `${cls.maxSpots - cls.spots} spots left`}
                        </Pill>
                        <span style={{ fontSize: 11, color: $.t3 }}>{cls.level}</span>
                      </div>
                      {booked ? (
                        <span style={{
                          padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                          background: `${cls.color}15`, color: cls.color,
                          border: `1px solid ${cls.color}30`,
                        }}>✓ Enrolled</span>
                      ) : (
                        <button
                          onClick={isTaiChi ? e => { e.stopPropagation(); setShowSignUp(true); } : undefined}
                          style={{
                            padding: "8px 20px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                            fontFamily: $.font, cursor: full ? "default" : "pointer",
                            background: full ? "rgba(255,255,255,0.05)" : `linear-gradient(135deg,${cls.color},${cls.color}CC)`,
                            color: full ? $.t3 : "#000", border: "none",
                            opacity: full ? 0.5 : 1,
                          }}>{full ? "Waitlist" : "Sign Up"}</button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Shell>

      {/* Sheet rendered OUTSIDE Shell so it isn't clipped by Shell's overflow */}
      {showSignUp && (
        <ClassSignUpSheet
          onClose={() => setShowSignUp(false)}
          onBooked={handleBooked}
        />
      )}
    </>
  );
};

export default ClassesPage;
