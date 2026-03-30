import $ from "../../theme/tokens";
import { useBreakpoint } from "../../hooks/useBreakpoint";

const StatusBar = ({ credits }) => {
  const { isDesktop } = useBreakpoint();
  if (isDesktop) return null;
  return (
    <div style={{height:44,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",fontSize:13,fontWeight:600,position:"absolute",top:0,left:0,right:0,zIndex:100,background:"linear-gradient(180deg,rgba(6,18,32,0.9) 0%,transparent 100%)",color:$.t1,fontFamily:$.font}}>
      <span>9:41</span>
      {credits !== undefined && (
        <div style={{display:"flex",alignItems:"center",gap:5,background:`${$.ac}18`,border:`1px solid ${$.ac}30`,borderRadius:20,padding:"3px 10px"}}>
          <span style={{fontSize:13}}>🏅</span>
          <span style={{fontSize:12,fontWeight:800,color:$.ac}}>{credits}</span>
          <span style={{fontSize:10,color:$.t2}}>cr</span>
        </div>
      )}
      <div style={{display:"flex",gap:5,alignItems:"center",fontSize:11}}><span>5G</span><span style={{fontSize:14}}>📶🔋</span></div>
    </div>
  );
};

export default StatusBar;
