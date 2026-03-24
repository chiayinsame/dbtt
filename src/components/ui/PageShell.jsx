import $ from "../../theme/tokens";
import { useBreakpoint } from "../../hooks/useBreakpoint";

const Shell = ({title, children}) => {
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
        <h1 style={{fontSize: isDesktop ? 36 : 30,fontWeight:900,margin:"0 0 24px",letterSpacing:-.5,background:`linear-gradient(135deg,${$.t1},${$.t2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default Shell;
