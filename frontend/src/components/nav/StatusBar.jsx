import $ from "../../theme/tokens";
import { useBreakpoint } from "../../hooks/useBreakpoint";

const StatusBar = () => {
  const { isDesktop } = useBreakpoint();
  if (isDesktop) return null;
  return (
    <div style={{height:44,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",fontSize:13,fontWeight:600,position:"absolute",top:0,left:0,right:0,zIndex:100,background:"linear-gradient(180deg,rgba(6,18,32,0.9) 0%,transparent 100%)",color:$.t1,fontFamily:$.font}}>
      <span>9:41</span>
      <div style={{display:"flex",gap:5,alignItems:"center",fontSize:11}}><span>5G</span><span style={{fontSize:14}}>📶🔋</span></div>
    </div>
  );
};

export default StatusBar;
