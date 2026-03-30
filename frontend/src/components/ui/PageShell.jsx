import $ from "../../theme/tokens";
import { useBreakpoint } from "../../hooks/useBreakpoint";

const BackArrow = ({s=20,c="currentColor"}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c}
    strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
    style={{display:"block",flexShrink:0}}>
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const Shell = ({title, children, onBack}) => {
  const { isDesktop } = useBreakpoint();
  return (
    <div style={{
      position:"absolute", inset:0,
      background:$.bg,
      paddingTop: isDesktop ? 0 : 48,
      overflowY:"auto",
      paddingBottom: isDesktop ? 0 : 100,
      fontFamily:$.font, color:$.t1,
    }}>
      <div style={{
        padding: isDesktop ? "40px 48px" : "0 20px",
        maxWidth: isDesktop ? 900 : "none",
        margin: isDesktop ? "0 auto" : undefined,
      }}>
        {onBack && (
          <button onClick={onBack} style={{
            background:"none", border:"none", cursor:"pointer", padding:"8px 0",
            display:"flex", alignItems:"center", gap:6,
            color:$.t2, fontSize:13, fontWeight:600, fontFamily:$.font,
            marginBottom:4,
          }}>
            <BackArrow s={18} c={$.t2}/>
            Back
          </button>
        )}
        <h1 style={{fontSize: isDesktop ? 36 : 30,fontWeight:900,margin:"0 0 24px",letterSpacing:-.5,background:`linear-gradient(135deg,${$.t1},${$.t2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default Shell;
