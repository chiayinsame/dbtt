import { useState } from "react";
import $ from "../../theme/tokens";
import { IcX, IcLocker } from "../ui/Icons";

const DURATIONS = [
  { hours: 1, label: "1 hour" },
  { hours: 2, label: "2 hours" },
  { hours: 3, label: "3 hours" },
];

const EQUIP_ICONS = {
  "Basketball": "🏀", "Football": "⚽", "Volleyball": "🏐",
  "Badminton Racket": "🏸", "Tennis Racket": "🎾",
  "Swimming Goggles": "🥽", "Kickboard": "🏊", "Float Board": "🏊",
  "Shuttlecock (6-pack)": "🏸", "Tennis Balls (3-pack)": "🎾",
  "Shin Guards": "🦵", "Training Bib": "👕", "Knee Pads": "🦵",
  "Towel": "🧣", "Grip Tape (2-pack)": "🎾", "Wristband Set": "💪",
};

const RentalModal = ({ locker, credits, onConfirm, onClose, loading }) => {
  const [duration, setDuration] = useState(1);
  const totalCost = locker.cost_per_hour * duration;
  const canAfford = credits >= totalCost;
  const icon = EQUIP_ICONS[locker.equipment] || "🔐";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.75)", display: "flex",
      alignItems: "flex-end", justifyContent: "center"
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 480,
          background: $.bg2, borderRadius: "24px 24px 0 0",
          border: `1px solid ${$.bd}`, padding: "28px 24px 40px",
        }}>
        {/* Handle */}
        <div style={{ width: 40, height: 4, background: $.bl, borderRadius: 2, margin: "0 auto 24px" }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: `${$.ac}15`, border: `1px solid ${$.ac}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26
            }}>{icon}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: $.t1 }}>{locker.equipment}</div>
              <div style={{ fontSize: 13, color: $.t2, marginTop: 3 }}>📍 {locker.venue}</div>
              <div style={{ fontSize: 12, color: $.t3, marginTop: 2 }}>Locker {locker.locker_number}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <IcX s={16} c={$.t2} />
          </button>
        </div>

        {/* Description */}
        <div style={{ fontSize: 13, color: $.t2, marginBottom: 20, padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10 }}>
          {locker.description}
        </div>

        {/* Duration selector */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: $.t2, marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>Rental Duration</div>
          <div style={{ display: "flex", gap: 10 }}>
            {DURATIONS.map(d => (
              <button
                key={d.hours}
                onClick={() => setDuration(d.hours)}
                style={{
                  flex: 1, padding: "12px 0",
                  borderRadius: 12, cursor: "pointer",
                  fontFamily: $.font, fontWeight: 700, fontSize: 14,
                  border: duration === d.hours ? `1px solid ${$.ac}` : `1px solid ${$.bd}`,
                  background: duration === d.hours ? `${$.ac}18` : "rgba(255,255,255,0.04)",
                  color: duration === d.hours ? $.ac : $.t2,
                  transition: "all .15s",
                }}>
                <div>{d.label}</div>
                <div style={{ fontSize: 12, marginTop: 3, opacity: 0.8 }}>{locker.cost_per_hour * d.hours} cr</div>
              </button>
            ))}
          </div>
        </div>

        {/* Cost breakdown */}
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: $.t2 }}>{locker.cost_per_hour} credits × {duration}h</span>
            <span style={{ fontSize: 13, color: $.t1, fontWeight: 600 }}>{totalCost} credits</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${$.bd}` }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: $.t1 }}>Total</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: canAfford ? $.ac : "#E63946" }}>{totalCost} credits</span>
          </div>
        </div>

        {/* Balance */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, padding: "10px 14px", background: canAfford ? `${$.ac}08` : "rgba(230,57,70,0.08)", borderRadius: 10, border: `1px solid ${canAfford ? $.ac + "20" : "rgba(230,57,70,0.2)"}` }}>
          <span style={{ fontSize: 13, color: $.t2 }}>Your balance</span>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: canAfford ? $.ac : "#E63946" }}>{credits} credits</div>
            {canAfford
              ? <div style={{ fontSize: 11, color: $.t3 }}>After: {credits - totalCost} credits</div>
              : <div style={{ fontSize: 11, color: "#E63946" }}>Need {totalCost - credits} more</div>
            }
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={() => canAfford && !loading && onConfirm(duration)}
          disabled={!canAfford || loading}
          style={{
            width: "100%", padding: "16px 0",
            borderRadius: 14, border: "none",
            background: canAfford ? `linear-gradient(135deg, ${$.ac}, ${$.ac2})` : "rgba(255,255,255,0.06)",
            color: canAfford ? "#000" : $.t3,
            fontSize: 16, fontWeight: 800, fontFamily: $.font,
            cursor: canAfford ? "pointer" : "not-allowed",
            boxShadow: canAfford ? `0 4px 20px ${$.ac}40` : "none",
            transition: "all .2s",
          }}>
          {loading ? "Processing..." : canAfford ? `Confirm Rental — ${totalCost} credits` : "Insufficient Credits"}
        </button>
      </div>
    </div>
  );
};

export default RentalModal;
