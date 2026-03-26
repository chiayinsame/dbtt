import { SPORTS, FRIENDS, LFG } from "../data/mockData";
import $ from "../theme/tokens";
import Shell from "../components/ui/PageShell";
import Card from "../components/ui/GlassCard";
import { FRIEND_AVATARS } from "../images/avatars";

const FriendsPage = ({onBack}) => <Shell title="Friends" onBack={onBack}>
  <Card style={{marginBottom:20,background:"linear-gradient(145deg,rgba(245,158,11,0.06),rgba(239,68,68,0.03))",border:"1px solid rgba(245,158,11,0.12)",padding:16}}>
    <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>🔥 Looking for players nearby</div>
    {LFG.map((p,i)=>{const s=SPORTS[p.sp];return<div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${$.bd}`}}><img src={FRIEND_AVATARS[(6+i)%FRIEND_AVATARS.length]} alt={p.name} style={{width:40,height:40,borderRadius:"50%",objectFit:"cover",border:`1px solid ${$.bd}`,flexShrink:0}}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.name} {s.icon}</div><div style={{fontSize:11,color:$.t3}}>{p.msg} · {p.ven}</div></div><button style={{background:`linear-gradient(135deg,${$.ac},${$.ac2})`,border:"none",borderRadius:10,padding:"8px 18px",fontSize:11,fontWeight:700,color:$.bg,cursor:"pointer",fontFamily:$.font}}>Join</button></div>})}
  </Card>
  <h3 style={{fontSize:16,fontWeight:700,margin:"0 0 12px"}}>Your friends</h3>
  {FRIENDS.map((f,i)=>{const s=f.sp?SPORTS[f.sp]:null;return<div key={f.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:`1px solid ${$.bd}`}}><div style={{position:"relative"}}><img src={FRIEND_AVATARS[i%FRIEND_AVATARS.length]} alt={f.name} style={{width:48,height:48,borderRadius:"50%",objectFit:"cover",border:`1px solid ${$.bd}`,display:"block"}}/><div style={{position:"absolute",bottom:-1,right:-1,width:14,height:14,borderRadius:7,background:f.on?$.ac:"rgba(255,255,255,0.12)",border:`2.5px solid ${$.bg}`}}/></div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{f.name}</div><div style={{fontSize:11,color:$.t3,marginTop:2}}>{f.ven?`${s?.icon} at ${f.ven}`:f.on?"Online":"Offline"}</div></div>{f.on&&<button style={{background:`${$.ac}0A`,border:`1px solid ${$.ac}1A`,borderRadius:10,padding:"8px 18px",fontSize:11,fontWeight:600,color:$.ac,cursor:"pointer",fontFamily:$.font}}>Invite</button>}</div>})}
</Shell>;

export default FriendsPage;
