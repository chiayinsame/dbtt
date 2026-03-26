import { SPORTS, vstatus } from "../../data/mockData";
import $ from "../../theme/tokens";
import Pill from "../ui/Pill";
import Card from "../ui/GlassCard";

const VenueSheet = ({venue:v,onClose,onBook}) => {
  if(!v)return null;
  const sp=SPORTS[v.sport],c=sp.hue,st=vstatus(v),need=v.max-v.players,pct=(v.players/v.max)*100;
  return (
    <div style={{position:"absolute",inset:0,zIndex:80,animation:"a-fade .15s"}}><div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.35)"}}/>
    <div style={{position:"absolute",bottom:0,left:0,right:0,background:`linear-gradient(180deg,${$.surf},${$.bg})`,borderRadius:"26px 26px 0 0",border:`1px solid ${$.bd}`,borderBottom:"none",padding:"14px 20px 100px",maxHeight:"72vh",overflowY:"auto",animation:"a-up .3s cubic-bezier(.32,.72,0,1)",fontFamily:$.font}}>
      <div style={{width:42,height:4,background:"rgba(255,255,255,0.12)",borderRadius:2,margin:"0 auto 18px"}}/>
      <div style={{display:"flex",gap:14,marginBottom:18}}>
        <div style={{width:58,height:58,borderRadius:18,background:`${c}12`,border:`2px solid ${c}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0,boxShadow:`0 0 24px ${c}15`}}>{sp.icon}</div>
        <div style={{flex:1}}><h2 style={{fontSize:19,fontWeight:800,color:$.t1,lineHeight:1.3}}>{v.name}</h2>
        <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}><Pill color={st==="hot"?"#F87171":st==="active"?$.ac:$.t3}>{st==="hot"?"🔥 Hot":st==="active"?"● Active":st==="empty"?"Empty":"Quiet"}</Pill><Pill color={$.t2} bg="rgba(255,255,255,0.05)">0.3 km</Pill></div></div>
      </div>
      <Card style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontSize:13,fontWeight:600,color:$.t2}}>Players now</span><span style={{fontSize:28,fontWeight:900,color:c}}>{v.players}<span style={{fontSize:14,color:$.t3}}>/{v.max}</span></span></div>
      <div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${c},${sp.alt})`,borderRadius:4,boxShadow:`0 0 12px ${c}40`,transition:"width .5s ease"}}/></div>
      {need>0&&need<=3&&<div style={{marginTop:12,background:`${c}12`,border:`1px solid ${c}25`,borderRadius:12,padding:"10px 14px",textAlign:"center",fontSize:14,fontWeight:700,color:c}}>{sp.icon} {need} More Needed!</div>}</Card>
      <Card style={{marginBottom:12}}><div style={{fontSize:13,fontWeight:700,color:$.t1,marginBottom:10}}>Facilities</div>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(v.courts,6)},1fr)`,gap:6}}>{Array.from({length:v.courts}).map((_,i)=>{const o=i<v.open;return<div key={i} style={{height:46,borderRadius:10,background:o?`${$.ac}0C`:"rgba(248,113,113,0.06)",border:`1px solid ${o?`${$.ac}28`:"rgba(248,113,113,0.18)"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,color:o?$.ac:"#F87171",gap:2}}><span style={{fontSize:14}}>{o?"✓":"✕"}</span>{o?"Open":"In Use"}</div>})}</div></Card>
      <Card style={{marginBottom:18}}><div style={{fontSize:13,fontWeight:700,color:$.t1,marginBottom:10}}>🔐 Smart Locker Rentals</div>{v.equip.map((eq,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<v.equip.length-1?`1px solid ${$.bd}`:"none"}}><span style={{fontSize:13,color:$.t1}}>{eq.n}</span><Pill color={eq.q>3?$.ac:"#F59E0B"}>{eq.q} avail</Pill></div>)}</Card>
      <div style={{display:"flex",gap:10}}>{v.players>0&&need>0&&<button style={{flex:1,padding:"16px 0",background:`linear-gradient(135deg,${c},${sp.alt})`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#fff",cursor:"pointer",boxShadow:`0 4px 24px ${c}40`,fontFamily:$.font}}>Join Game</button>}<button onClick={()=>onBook(v)} style={{flex:1,padding:"16px 0",background:`linear-gradient(135deg,${$.ac},${$.ac2})`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:$.bg,cursor:"pointer",boxShadow:`0 4px 24px ${$.ac}35`,fontFamily:$.font}}>Book Now</button></div>
    </div></div>
  );
};

export default VenueSheet;
