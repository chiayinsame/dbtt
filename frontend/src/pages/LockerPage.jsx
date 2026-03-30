import { useState, useEffect } from "react";
import $ from "../theme/tokens";
import Shell from "../components/ui/PageShell";
import Card from "../components/ui/GlassCard";
import QRScanner from "../components/locker/QRScanner";
import RentalModal from "../components/locker/RentalModal";
import { IcQR, IcLocker } from "../components/ui/Icons";
import { USER_ID } from "../data/mockData";

const EQUIP_ICONS = {
  "Basketball": "🏀", "Football": "⚽", "Volleyball": "🏐",
  "Badminton Racket": "🏸", "Tennis Racket": "🎾",
  "Swimming Goggles": "🥽", "Kickboard": "🏊", "Float Board": "🏊",
  "Shuttlecock (6-pack)": "🏸", "Tennis Balls (3-pack)": "🎾",
  "Shin Guards": "🦵", "Training Bib": "👕", "Knee Pads": "🦵",
  "Towel": "🧣", "Grip Tape (2-pack)": "🎾", "Wristband Set": "💪",
};

const fmt = iso => {
  const d = new Date(iso);
  return d.toLocaleString("en-SG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const LockerPage = ({ onBack, credits, setCredits }) => {
  const [scanning, setScanning] = useState(false);
  const [lockerInfo, setLockerInfo] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [renting, setRenting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch(`/api/rentals/${USER_ID}`)
      .then(r => r.json())
      .then(data => Array.isArray(data) && setRentals(data))
      .catch(() => {});
  }, []);

  const handleScan = async (lockerId) => {
    setScanning(false);
    try {
      const res = await fetch(`/api/lockers/${lockerId}`);
      if (!res.ok) { showToast("Locker not found", "error"); return; }
      const data = await res.json();
      if (!data.available) { showToast("This locker is currently in use", "error"); return; }
      setLockerInfo(data);
    } catch {
      showToast("Could not reach server", "error");
    }
  };

  const handleConfirm = async (durationHours) => {
    if (!lockerInfo) return;
    setRenting(true);
    try {
      const res = await fetch("/api/rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: USER_ID, locker_id: lockerInfo.id, duration_hours: durationHours }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Rental failed", "error");
        return;
      }
      setCredits(data.credits_remaining);
      setRentals(prev => [data.rental, ...prev]);
      setLockerInfo(null);
      showToast(`Rented ${data.rental.equipment} for ${durationHours}h!`);
    } catch {
      showToast("Could not reach server", "error");
    } finally {
      setRenting(false);
    }
  };

  const handleReturn = async (rentalId) => {
    try {
      const res = await fetch("/api/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rental_id: rentalId }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Return failed", "error"); return; }
      setRentals(prev => prev.map(r => r.rental_id === rentalId ? { ...r, status: "returned" } : r));
      showToast("Equipment returned successfully!");
    } catch {
      showToast("Could not reach server", "error");
    }
  };

  const handleTopup = async () => {
    try {
      const res = await fetch(`/api/credits/${USER_ID}/topup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 200 }),
      });
      const data = await res.json();
      if (res.ok) { setCredits(data.credits); showToast("Added 200 credits!"); }
    } catch {
      // Offline fallback
      setCredits(prev => prev + 200);
      showToast("Added 200 credits!");
    }
  };

  const activeRentals = rentals.filter(r => r.status === "active");
  const pastRentals = rentals.filter(r => r.status !== "active");

  return (
    <Shell title="Equipment Locker" onBack={onBack}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)",
          zIndex: 400, padding: "12px 22px",
          background: toast.type === "error" ? "rgba(230,57,70,0.95)" : "rgba(78,234,170,0.95)",
          color: toast.type === "error" ? "#fff" : "#001a10",
          borderRadius: 12, fontSize: 14, fontWeight: 700,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)", whiteSpace: "nowrap"
        }}>{toast.msg}</div>
      )}

      {/* Credits balance card */}
      <Card style={{ marginBottom: 16, background: `linear-gradient(135deg, ${$.ac}12, ${$.ac2}08)`, border: `1px solid ${$.ac}25` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: $.t3, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>ActiveSG Credits</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: $.ac, letterSpacing: -1 }}>{credits}</div>
            <div style={{ fontSize: 12, color: $.t2, marginTop: 4 }}>Available to spend</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🏅</div>
            <button
              onClick={handleTopup}
              style={{
                padding: "8px 16px", borderRadius: 10,
                background: `${$.ac}20`, border: `1px solid ${$.ac}40`,
                color: $.ac, fontSize: 12, fontWeight: 700,
                fontFamily: $.font, cursor: "pointer"
              }}>
              + Top Up
            </button>
          </div>
        </div>
      </Card>

      {/* Scan QR button */}
      <button
        onClick={() => setScanning(true)}
        style={{
          width: "100%", padding: "20px 0", marginBottom: 24,
          borderRadius: 16, border: `1px dashed ${$.ac}60`,
          background: `${$.ac}08`, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          fontFamily: $.font, transition: "all .2s"
        }}>
        <IcQR s={24} c={$.ac} />
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: $.ac }}>Scan Locker QR Code</div>
          <div style={{ fontSize: 12, color: $.t2, marginTop: 2 }}>Point camera at the QR on the locker door</div>
        </div>
      </button>

      {/* Active rentals */}
      {activeRentals.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: $.t2, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>Active Rentals</div>
          {activeRentals.map(r => (
            <Card key={r.rental_id} style={{ marginBottom: 10, border: `1px solid ${$.ac}30`, background: `${$.ac}06` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 26 }}>{EQUIP_ICONS[r.equipment] || "🔐"}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{r.equipment}</div>
                    <div style={{ fontSize: 12, color: $.t2, marginTop: 2 }}>📍 {r.venue} · Locker {r.locker_number}</div>
                    <div style={{ fontSize: 11, color: $.t3, marginTop: 2 }}>Until {fmt(r.end_time)}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: $.ac, fontWeight: 700, marginBottom: 8 }}>{r.total_cost} cr</div>
                  <button
                    onClick={() => handleReturn(r.rental_id)}
                    style={{
                      padding: "8px 14px", borderRadius: 10,
                      background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.3)",
                      color: "#E63946", fontSize: 12, fontWeight: 700,
                      fontFamily: $.font, cursor: "pointer"
                    }}>
                    Return
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* How it works — shown when no active rentals */}
      {activeRentals.length === 0 && (
        <Card style={{ marginBottom: 24, background: "rgba(255,255,255,0.02)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: $.t2, marginBottom: 14 }}>How It Works</div>
          {[
            { n: "1", t: "Find a locker", d: "Smart lockers are at every ActiveSG venue near the entrance." },
            { n: "2", t: "Scan QR code", d: "Use the scanner above to scan the QR code on the locker door." },
            { n: "3", t: "Confirm & pay", d: "Select rental duration — credits are deducted automatically." },
            { n: "4", t: "Return & done", d: "Tap Return above when you're finished. Locker unlocks automatically." },
          ].map(s => (
            <div key={s.n} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${$.ac}20`, border: `1px solid ${$.ac}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: $.ac, flexShrink: 0 }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{s.t}</div>
                <div style={{ fontSize: 12, color: $.t2 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Rental history */}
      {pastRentals.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: $.t2, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>Rental History</div>
          {pastRentals.map(r => (
            <div key={r.rental_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: `1px solid ${$.bd}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 20 }}>{EQUIP_ICONS[r.equipment] || "🔐"}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{r.equipment}</div>
                  <div style={{ fontSize: 11, color: $.t3, marginTop: 2 }}>{fmt(r.start_time)} · {r.duration_hours}h</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: $.t2 }}>−{r.total_cost} cr</div>
                <div style={{ fontSize: 11, color: "#4CAF50", marginTop: 2 }}>Returned</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {scanning && <QRScanner onScan={handleScan} onClose={() => setScanning(false)} />}
      {lockerInfo && (
        <RentalModal
          locker={lockerInfo}
          credits={credits}
          onConfirm={handleConfirm}
          onClose={() => setLockerInfo(null)}
          loading={renting}
        />
      )}
    </Shell>
  );
};

export default LockerPage;
