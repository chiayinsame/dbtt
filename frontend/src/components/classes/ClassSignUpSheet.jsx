import { useState } from "react";
import $ from "../../theme/tokens";
import { IcX } from "../ui/Icons";
import Pill from "../ui/Pill";
import { USER } from "../../data/mockData";

// ─── Static data for the Tai Chi class ────────────────────────────────────────
const CLS = {
  title: "Tai Chi for Wellness",
  category: "Tai Chi",
  venue: "Toa Payoh Sports Hall",
  venueAddr: "297 Lorong 6 Toa Payoh, Singapore 319390",
  time: "Tue & Thu  ·  6:30 – 7:30 AM",
  coach: "Master Chen Wei",
  level: "Beginner",
  spots: 15,
  maxSpots: 30,
  icon: "🥋",
  color: "#00D68F",
  fee: 8,
  longDesc:
    "Rooted in ancient Chinese tradition, Tai Chi blends slow, deliberate movements with deep breathing and mindful meditation. This programme is designed for all ages and fitness levels — no prior experience needed.",
  learns: [
    "Fundamental stances, warm-ups & cool-downs",
    "Breathing techniques for stress relief & focus",
    "The 24-form Yang-style Tai Chi sequence",
  ],
  bring: "Comfortable loose clothing · Flat shoes or bare feet · Water bottle",
  coachBio:
    "Certified Tai Chi master with 20+ years of teaching experience and former national coaching committee member.",
};

const SESSIONS = [
  { id: "a", day: "Tue", date: "1 Apr 2026",  fullLabel: "Tuesday, 1 April",  spots: 15 },
  { id: "b", day: "Thu", date: "3 Apr 2026",  fullLabel: "Thursday, 3 April", spots: 14 },
  { id: "c", day: "Tue", date: "8 Apr 2026",  fullLabel: "Tuesday, 8 April",  spots: 15 },
  { id: "d", day: "Thu", date: "10 Apr 2026", fullLabel: "Thursday, 10 April",spots: 12 },
];

const BOOKING_REF = "TC-20260401-8821";

// ─── Shared back-button ────────────────────────────────────────────────────────
const BackBtn = ({ onBack, title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 22px 0" }}>
    <button onClick={onBack} style={{
      width: 36, height: 36, borderRadius: 10,
      background: "rgba(255,255,255,0.06)", border: `1px solid ${$.bd}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0,
    }}>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={$.t2} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <span style={{ fontSize: 17, fontWeight: 800, color: $.t1 }}>{title}</span>
  </div>
);

// ─── Step 1: Class detail ──────────────────────────────────────────────────────
const DetailStep = ({ onClose, onNext }) => {
  const pct = Math.round((CLS.maxSpots - CLS.spots) / CLS.maxSpots * 100);
  return (
    <div style={{ padding: "20px 22px 40px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{
            width: 58, height: 58, borderRadius: 18,
            background: `${CLS.color}15`, border: `1px solid ${CLS.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 30, flexShrink: 0, boxShadow: `0 0 24px ${CLS.color}18`,
          }}>{CLS.icon}</div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, color: $.t1, lineHeight: 1.2 }}>{CLS.title}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <Pill color={CLS.color}>{CLS.category}</Pill>
              <Pill color={$.t3}>{CLS.level}</Pill>
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{
          width: 34, height: 34, borderRadius: 10,
          background: "rgba(255,255,255,0.06)", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
        }}>
          <IcX s={16} c={$.t2} />
        </button>
      </div>

      {/* About */}
      <div style={{ fontSize: 14, color: $.t2, lineHeight: 1.7, marginBottom: 20 }}>
        {CLS.longDesc}
      </div>

      {/* What you'll learn */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: $.t3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
          What you'll learn
        </div>
        {CLS.learns.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1,
              background: `${CLS.color}20`, border: `1px solid ${CLS.color}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, color: CLS.color, fontWeight: 800,
            }}>{i + 1}</div>
            <span style={{ fontSize: 13, color: $.t2, lineHeight: 1.5 }}>{l}</span>
          </div>
        ))}
      </div>

      {/* What to bring */}
      <div style={{
        background: "rgba(255,255,255,0.04)", borderRadius: 12,
        padding: "12px 14px", marginBottom: 20,
        border: `1px solid ${$.bd}`,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: $.t3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
          What to bring
        </div>
        <div style={{ fontSize: 13, color: $.t2 }}>{CLS.bring}</div>
      </div>

      {/* Coach card */}
      <div style={{
        display: "flex", gap: 12, alignItems: "center",
        background: "rgba(255,255,255,0.04)", borderRadius: 12,
        padding: "12px 14px", marginBottom: 20, border: `1px solid ${$.bd}`,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: `${CLS.color}15`, border: `1px solid ${CLS.color}30`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>🧑‍🏫</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: $.t1 }}>{CLS.coach}</div>
          <div style={{ fontSize: 12, color: $.t3, marginTop: 2, lineHeight: 1.4 }}>{CLS.coachBio}</div>
        </div>
      </div>

      {/* Schedule + venue */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {[
          { icon: "🕐", text: CLS.time },
          { icon: "📍", text: CLS.venue },
          { icon: "🗺", text: CLS.venueAddr },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{r.icon}</span>
            <span style={{ fontSize: 13, color: $.t2 }}>{r.text}</span>
          </div>
        ))}
      </div>

      {/* Spots bar */}
      <div style={{
        background: "rgba(255,255,255,0.04)", borderRadius: 12,
        padding: "14px 16px", marginBottom: 20, border: `1px solid ${$.bd}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: $.t2, fontWeight: 600 }}>Spots remaining</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: CLS.color }}>{CLS.spots} / {CLS.maxSpots}</span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            width: `${pct}%`, height: "100%",
            background: `linear-gradient(90deg,${CLS.color},#00B8A9)`,
            borderRadius: 3, boxShadow: `0 0 10px ${CLS.color}40`,
          }}/>
        </div>
        <div style={{ fontSize: 11, color: $.t3, marginTop: 6 }}>{CLS.maxSpots - CLS.spots} enrolled · {CLS.spots} spots left</div>
      </div>

      {/* Fee + CTA */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{
          padding: "12px 16px", borderRadius: 12,
          background: `${CLS.color}12`, border: `1px solid ${CLS.color}25`,
        }}>
          <div style={{ fontSize: 11, color: $.t3, marginBottom: 2 }}>Per session</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: CLS.color }}>${CLS.fee}.00</div>
          <div style={{ fontSize: 10, color: $.t3 }}>ActiveSG subsidised</div>
        </div>
        <button onClick={onNext} style={{
          flex: 1, padding: "16px 0",
          background: `linear-gradient(135deg,${CLS.color},#00B8A9)`,
          border: "none", borderRadius: 14, fontSize: 15, fontWeight: 800,
          color: "#000", cursor: "pointer", fontFamily: $.font,
          boxShadow: `0 4px 24px ${CLS.color}35`,
        }}>
          Register Now →
        </button>
      </div>
    </div>
  );
};

// ─── Step 2: Pick a session ────────────────────────────────────────────────────
const PickStep = ({ onBack, onNext, selected, setSelected }) => (
  <div style={{ padding: "0 0 40px" }}>
    <BackBtn onBack={onBack} title="Choose a Session" />
    <div style={{ padding: "6px 22px 0", fontSize: 13, color: $.t3, marginBottom: 20 }}>
      All sessions run 6:30 – 7:30 AM at {CLS.venue}
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 22px", marginBottom: 24 }}>
      {SESSIONS.map(s => {
        const isSelected = selected === s.id;
        return (
          <button key={s.id} onClick={() => setSelected(s.id)} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 16px", borderRadius: 14, cursor: "pointer",
            background: isSelected ? `${CLS.color}14` : "rgba(255,255,255,0.04)",
            border: isSelected ? `1.5px solid ${CLS.color}` : `1px solid ${$.bd}`,
            fontFamily: $.font, textAlign: "left", transition: "all .15s",
          }}>
            {/* Day badge */}
            <div style={{
              width: 52, height: 52, borderRadius: 12, flexShrink: 0,
              background: isSelected ? `${CLS.color}20` : "rgba(255,255,255,0.06)",
              border: `1px solid ${isSelected ? CLS.color + "50" : $.bd}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: isSelected ? CLS.color : $.t3, textTransform: "uppercase" }}>{s.day}</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: isSelected ? CLS.color : $.t1, lineHeight: 1 }}>
                {s.date.split(" ")[0]}
              </span>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: isSelected ? CLS.color : $.t1 }}>{s.fullLabel}</div>
              <div style={{ fontSize: 12, color: $.t3, marginTop: 2 }}>6:30 – 7:30 AM  ·  {s.spots} spots left</div>
            </div>

            {/* Selection indicator */}
            <div style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
              background: isSelected ? CLS.color : "transparent",
              border: `2px solid ${isSelected ? CLS.color : $.bd}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {isSelected && (
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>

    <div style={{ padding: "0 22px" }}>
      <button
        onClick={() => selected && onNext()}
        style={{
          width: "100%", padding: "16px 0", borderRadius: 14, border: "none",
          background: selected ? `linear-gradient(135deg,${CLS.color},#00B8A9)` : "rgba(255,255,255,0.06)",
          color: selected ? "#000" : $.t3,
          fontSize: 15, fontWeight: 800, fontFamily: $.font,
          cursor: selected ? "pointer" : "default",
          boxShadow: selected ? `0 4px 20px ${CLS.color}35` : "none",
          transition: "all .2s",
        }}>
        Continue →
      </button>
    </div>
  </div>
);

// ─── Step 3: Review & confirm ──────────────────────────────────────────────────
const ReviewStep = ({ onBack, onConfirm, session }) => (
  <div style={{ padding: "0 0 40px" }}>
    <BackBtn onBack={onBack} title="Review Booking" />

    <div style={{ padding: "20px 22px 0" }}>
      {/* Class summary card */}
      <div style={{
        display: "flex", gap: 12, padding: "14px 16px",
        background: "rgba(255,255,255,0.04)", borderRadius: 14,
        border: `1px solid ${$.bd}`, marginBottom: 16,
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
          background: `${CLS.color}15`, border: `1px solid ${CLS.color}30`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
        }}>{CLS.icon}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: $.t1 }}>{CLS.title}</div>
          <div style={{ fontSize: 12, color: $.t3, marginTop: 3 }}>📍 {CLS.venue}</div>
          <div style={{ fontSize: 12, color: $.t3, marginTop: 2 }}>👤 {CLS.coach}</div>
        </div>
      </div>

      {/* Selected session */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: $.t3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
          Selected Session
        </div>
        <div style={{
          display: "flex", gap: 12, padding: "14px 16px",
          background: `${CLS.color}10`, border: `1px solid ${CLS.color}30`,
          borderRadius: 12,
        }}>
          <span style={{ fontSize: 22 }}>📅</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: CLS.color }}>{session?.fullLabel}</div>
            <div style={{ fontSize: 12, color: $.t3, marginTop: 2 }}>6:30 – 7:30 AM  ·  Toa Payoh Sports Hall</div>
          </div>
        </div>
      </div>

      {/* Participant */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: $.t3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
          Participant
        </div>
        <div style={{
          display: "flex", gap: 12, alignItems: "center",
          padding: "12px 16px", background: "rgba(255,255,255,0.04)",
          borderRadius: 12, border: `1px solid ${$.bd}`,
        }}>
          <span style={{ fontSize: 24 }}>{USER.avatar}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: $.t1 }}>{USER.name}</div>
            <div style={{ fontSize: 12, color: $.t3, marginTop: 1 }}>ActiveSG Member  ·  Level {USER.level}</div>
          </div>
        </div>
      </div>

      {/* Fee breakdown */}
      <div style={{
        background: "rgba(255,255,255,0.04)", borderRadius: 12,
        padding: "14px 16px", marginBottom: 24, border: `1px solid ${$.bd}`,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: $.t3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
          Payment Summary
        </div>
        {[
          { label: "Class fee", val: "$12.00" },
          { label: "ActiveSG subsidy", val: "−$4.00", c: CLS.color },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: $.t2 }}>{r.label}</span>
            <span style={{ fontSize: 13, color: r.c || $.t1, fontWeight: 600 }}>{r.val}</span>
          </div>
        ))}
        <div style={{ height: 1, background: $.bd, margin: "10px 0" }}/>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: $.t1 }}>Total payable</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: CLS.color }}>${CLS.fee}.00</span>
        </div>
      </div>

      {/* Confirm CTA */}
      <button onClick={onConfirm} style={{
        width: "100%", padding: "16px 0", borderRadius: 14, border: "none",
        background: `linear-gradient(135deg,${CLS.color},#00B8A9)`,
        color: "#000", fontSize: 15, fontWeight: 800,
        fontFamily: $.font, cursor: "pointer",
        boxShadow: `0 4px 24px ${CLS.color}35`,
      }}>
        Confirm Booking  ·  ${CLS.fee}.00
      </button>
    </div>
  </div>
);

// ─── Step 4: Confirmed ─────────────────────────────────────────────────────────
const ConfirmedStep = ({ onClose, session }) => (
  <div style={{ padding: "30px 22px 44px", display: "flex", flexDirection: "column", alignItems: "center" }}>
    {/* Success icon */}
    <div style={{
      width: 88, height: 88, borderRadius: "50%", marginBottom: 20,
      background: `${CLS.color}18`, border: `2px solid ${CLS.color}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 44, animation: "a-pop .4s cubic-bezier(.34,1.56,.64,1) both",
      boxShadow: `0 0 40px ${CLS.color}30`,
    }}>✅</div>

    <div style={{ fontSize: 22, fontWeight: 900, color: $.t1, marginBottom: 6, textAlign: "center" }}>
      Booking Confirmed!
    </div>
    <div style={{ fontSize: 14, color: $.t3, marginBottom: 24, textAlign: "center" }}>
      See you at Toa Payoh Sports Hall 🥋
    </div>

    {/* Booking reference card */}
    <div style={{
      width: "100%", background: "rgba(255,255,255,0.04)",
      border: `1px solid ${$.bd}`, borderRadius: 16,
      padding: "18px 18px", marginBottom: 16,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: $.t3, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Booking Ref</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: CLS.color, letterSpacing: .5 }}>{BOOKING_REF}</span>
      </div>
      {[
        { icon: "🥋", label: "Class",   val: CLS.title },
        { icon: "📅", label: "Date",    val: session?.fullLabel },
        { icon: "🕐", label: "Time",    val: "6:30 – 7:30 AM" },
        { icon: "📍", label: "Venue",   val: CLS.venue },
        { icon: "👤", label: "Coach",   val: CLS.coach },
        { icon: "💳", label: "Paid",    val: `$${CLS.fee}.00` },
      ].map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: `1px solid ${$.bd}` }}>
          <span style={{ fontSize: 15, width: 22, textAlign: "center", flexShrink: 0 }}>{r.icon}</span>
          <span style={{ fontSize: 12, color: $.t3, width: 52, flexShrink: 0 }}>{r.label}</span>
          <span style={{ fontSize: 13, color: $.t1, fontWeight: 600 }}>{r.val}</span>
        </div>
      ))}
    </div>

    {/* What to bring reminder */}
    <div style={{
      width: "100%", background: `${CLS.color}0C`,
      border: `1px solid ${CLS.color}25`, borderRadius: 12,
      padding: "12px 14px", marginBottom: 24,
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: CLS.color, marginBottom: 4 }}>Reminder — what to bring</div>
      <div style={{ fontSize: 12, color: $.t2 }}>{CLS.bring}</div>
    </div>

    {/* Buttons */}
    <div style={{ display: "flex", gap: 10, width: "100%" }}>
      <button style={{
        flex: 1, padding: "14px 0", borderRadius: 12,
        background: "rgba(255,255,255,0.06)", border: `1px solid ${$.bd}`,
        color: $.t2, fontSize: 13, fontWeight: 700,
        fontFamily: $.font, cursor: "pointer",
      }}>
        + Add to Calendar
      </button>
      <button onClick={onClose} style={{
        flex: 1, padding: "14px 0", borderRadius: 12, border: "none",
        background: `linear-gradient(135deg,${CLS.color},#00B8A9)`,
        color: "#000", fontSize: 13, fontWeight: 800,
        fontFamily: $.font, cursor: "pointer",
        boxShadow: `0 4px 16px ${CLS.color}30`,
      }}>
        Done
      </button>
    </div>
  </div>
);

// ─── Root sheet component ──────────────────────────────────────────────────────
const ClassSignUpSheet = ({ onClose, onBooked }) => {
  const [step, setStep] = useState("detail");
  const [selected, setSelected] = useState(null);
  const session = SESSIONS.find(s => s.id === selected);

  const handleConfirm = () => {
    onBooked?.({
      classId: 3,
      title:   CLS.title,
      icon:    CLS.icon,
      color:   CLS.color,
      venue:   CLS.venue,
      session,
      ref:     BOOKING_REF,
    });
    setStep("confirmed");
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 200, animation: "a-fade .15s" }}>
      {/* Backdrop — clicking closes unless on confirmation */}
      <div
        onClick={step === "confirmed" ? undefined : onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }}
      />

      {/* Sheet */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: `linear-gradient(180deg,${$.surf},${$.bg})`,
        borderRadius: "26px 26px 0 0",
        border: `1px solid ${$.bd}`, borderBottom: "none",
        maxHeight: "90vh", overflowY: "auto",
        animation: "a-up .3s cubic-bezier(.32,.72,0,1)",
        fontFamily: $.font,
      }}>
        {/* Drag handle */}
        <div style={{ width: 42, height: 4, background: "rgba(255,255,255,0.12)", borderRadius: 2, margin: "16px auto 0" }} />

        {step === "detail"    && <DetailStep    onClose={onClose} onNext={() => setStep("pick")} />}
        {step === "pick"      && <PickStep      onBack={() => setStep("detail")} onNext={() => setStep("review")} selected={selected} setSelected={setSelected} />}
        {step === "review"    && <ReviewStep    onBack={() => setStep("pick")} onConfirm={handleConfirm} session={session} />}
        {step === "confirmed" && <ConfirmedStep onClose={onClose} session={session} />}
      </div>
    </div>
  );
};

export default ClassSignUpSheet;
