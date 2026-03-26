import { useState } from "react";
import { SPORTS, BOOK } from "../data/mockData";
import $ from "../theme/tokens";
import Shell from "../components/ui/PageShell";
import Card from "../components/ui/GlassCard";
import Pill from "../components/ui/Pill";

const BookingsPage = () => {const[tab,sT]=useState("upcoming");const list=BOOK.filter(b=>tab==="upcoming"?b.st==="upcoming":b.st!=="upcoming");return<Shell title="Bookings">
  <div style={{display:"flex",marginBottom:20,background:$.surf,borderRadius:12,padding:3}}>{["upcoming","past"].map(t=><button key={t} onClick={()=>sT(t)} style={{flex:1,padding:"11px 0",background:tab===t?`${$.ac}15`:"transparent",border:"none",borderRadius:10,color:tab===t?$.ac:$.t3,fontSize:13,fontWeight:600,cursor:"pointer",textTransform:"capitalize",fontFamily:$.font,transition:"all .2s"}}>{t}</button>)}</div>
  {!list.length?<div style={{textAlign:"center",padding:40,color:$.t3,fontSize:14}}>No {tab} bookings</div>:list.map(b=>{const s=SPORTS[b.sp],sc=b.st==="upcoming"?$.ac:b.st==="completed"?"#60A5FA":"#F87171";return<Card key={b.id} style={{marginBottom:10,border:`1px solid ${sc}12`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div><div style={{fontSize:15,fontWeight:700}}>{b.ven}</div><div style={{fontSize:12,color:$.t2,marginTop:4}}>{s.icon} {s.label} · {b.ct}</div></div><Pill color={sc}>{b.st}</Pill></div>
    <div style={{display:"flex",gap:16,fontSize:12,color:$.t3}}><span>📅 {b.dt}</span><span>🕐 {b.tm}</span></div>
    {b.st==="upcoming"&&<div style={{display:"flex",gap:8,marginTop:12}}><button style={{flex:1,padding:10,background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.18)",borderRadius:10,color:"#F87171",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:$.font}}>Cancel</button><button style={{flex:1,padding:10,background:`${$.ac}0A`,border:`1px solid ${$.ac}1A`,borderRadius:10,color:$.ac,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:$.font}}>Modify</button></div>}
  </Card>})}
</Shell>};

export default BookingsPage;
