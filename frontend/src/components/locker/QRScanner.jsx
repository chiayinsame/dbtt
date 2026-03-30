import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import $ from "../../theme/tokens";
import { IcX } from "../ui/Icons";

const QRScanner = ({ onScan, onClose }) => {
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const scannerRef = useRef(null);
  const elementId = "qr-reader-element";

  useEffect(() => {
    let scanner = null;

    const startScanner = async () => {
      try {
        scanner = new Html5Qrcode(elementId);
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            if (decodedText.startsWith("LOCKER:")) {
              scanner.stop().catch(() => {});
              onScan(decodedText.replace("LOCKER:", ""));
            }
          },
          () => {}
        );
        setStarted(true);
      } catch (err) {
        setError("Camera access denied or unavailable.");
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleDemoScan = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
    }
    onScan("L004");
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.92)", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "0 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: $.t1 }}>Scan Locker QR</div>
            <div style={{ fontSize: 13, color: $.t2, marginTop: 4 }}>Point camera at the QR code on the locker</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <IcX s={18} c={$.t1} />
          </button>
        </div>

        {/* Camera view */}
        {error ? (
          <div style={{ background: "rgba(230,57,70,0.1)", border: `1px solid rgba(230,57,70,0.3)`, borderRadius: 16, padding: 24, textAlign: "center", color: $.t2, fontSize: 14, marginBottom: 20 }}>
            {error}
          </div>
        ) : (
          <div style={{ borderRadius: 16, overflow: "hidden", border: `2px solid ${$.ac}40`, marginBottom: 20, position: "relative" }}>
            <div id={elementId} style={{ width: "100%" }} />
            {started && (
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 220, height: 220,
                border: `2px solid ${$.ac}`,
                borderRadius: 12,
                boxShadow: `0 0 0 9999px rgba(0,0,0,0.45)`,
                pointerEvents: "none"
              }}>
                <div style={{ position: "absolute", top: -2, left: -2, width: 24, height: 24, borderTop: `3px solid ${$.ac}`, borderLeft: `3px solid ${$.ac}`, borderRadius: "4px 0 0 0" }} />
                <div style={{ position: "absolute", top: -2, right: -2, width: 24, height: 24, borderTop: `3px solid ${$.ac}`, borderRight: `3px solid ${$.ac}`, borderRadius: "0 4px 0 0" }} />
                <div style={{ position: "absolute", bottom: -2, left: -2, width: 24, height: 24, borderBottom: `3px solid ${$.ac}`, borderLeft: `3px solid ${$.ac}`, borderRadius: "0 0 0 4px" }} />
                <div style={{ position: "absolute", bottom: -2, right: -2, width: 24, height: 24, borderBottom: `3px solid ${$.ac}`, borderRight: `3px solid ${$.ac}`, borderRadius: "0 0 4px 0" }} />
              </div>
            )}
          </div>
        )}

        {/* Demo scan button */}
        <button
          onClick={handleDemoScan}
          style={{
            width: "100%", padding: "14px 0",
            background: `linear-gradient(135deg, ${$.ac}20, ${$.ac2}15)`,
            border: `1px solid ${$.ac}40`, borderRadius: 12,
            color: $.ac, fontSize: 14, fontWeight: 700,
            fontFamily: $.font, cursor: "pointer", letterSpacing: 0.3
          }}>
          Demo: Simulate Scan (Locker L004)
        </button>

        <div style={{ textAlign: "center", fontSize: 12, color: $.t3, marginTop: 14 }}>
          QR codes are printed on each smart locker door
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
