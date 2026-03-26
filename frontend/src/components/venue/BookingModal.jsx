import { useState } from "react";
import { SPORTS } from "../../data/mockData";
import $ from "../../theme/tokens";
import Card from "../ui/GlassCard";

const BookModal = ({venue:v,onClose}) => {
  const[done,setDone]=useState(false);
  if(!v)return null;const sp=SPORTS[v.sport];
  return <div style={{position:"absolute",inset:0,zIndex:99,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"a-fade .2s"}}>
  <div style={{background:$.surf,borderRadius:24,padding:26,width:"100%",maxWidth:340,border:`1px solid ${$.bd}`,animation:"a-pop .3s cubic-bezier(.34,1.56,.64,1)",fontFamily:$.font}}>
  {!done?<><div style={{textAlign:"center",marginBottom:20}}><div style={{width:66,height:66,margin:"0 auto 14px",borderRadius:"50%",background:`${sp.hue}18`,border:`2px solid ${sp.hue}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,boxShadow:`0 0 28px ${sp.hue}18`}}>{sp.icon}</div><h2 style={{fontSize:18,fontWeight:800,color:$.t1}}>{v.name}</h2><p style={{fontSize:12,color:$.t3,marginTop:4}}>{v.open} courts available</p></div>
  <Card style={{marginBottom:16}}>{[["Date","Today, 25 Mar"],["Time","6:00 PM – 7:00 PM"],["Court",`Court ${Math.ceil(Math.random()*v.courts)}`]].map(([l,val],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:i<2?`1px solid ${$.bd}`:"none",fontSize:13}}><span style={{color:$.t3}}>{l}</span><span style={{color:$.t1,fontWeight:600}}>{val}</span></div>)}</Card>
  <div style={{display:"flex",gap:10}}><button onClick={onClose} style={{flex:1,padding:14,background:"rgba(255,255,255,0.04)",border:`1px solid ${$.bl}`,borderRadius:14,color:$.t1,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:$.font}}>Cancel</button><button onClick={()=>setDone(true)} style={{flex:1,padding:14,background:`linear-gradient(135deg,${$.ac},${$.ac2})`,border:"none",borderRadius:14,color:$.bg,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:$.font}}>Confirm</button></div></>
  :<div style={{textAlign:"center",padding:14}}><div style={{fontSize:58,marginBottom:14,animation:"a-pop .4s cubic-bezier(.34,1.56,.64,1)"}}>✅</div><h2 style={{fontSize:22,fontWeight:900,color:$.t1}}>Booked!</h2><p style={{fontSize:13,color:$.t2,marginTop:8,lineHeight:1.7}}>Your court at {v.name} is confirmed.</p><button onClick={onClose} style={{marginTop:20,padding:"12px 40px",background:`linear-gradient(135deg,${$.ac},${$.ac2})`,border:"none",borderRadius:14,color:$.bg,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:$.font}}>Done</button></div>}
  </div></div>;
};

export default BookModal;
