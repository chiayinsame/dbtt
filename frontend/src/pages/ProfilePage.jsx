import { USER } from "../data/mockData";
import { USER_AVATAR } from "../images/avatars";
import $ from "../theme/tokens";
import Shell from "../components/ui/PageShell";
import Card from "../components/ui/GlassCard";

const ProfilePage = () => <Shell title="Profile">
  <div style={{background:`linear-gradient(145deg,${$.ac}10,${$.ac2}06)`,borderRadius:22,padding:30,textAlign:"center",border:`1px solid ${$.ac}15`,marginBottom:20}}>
    <div style={{width:88,height:88,borderRadius:"50%",background:`linear-gradient(145deg,${$.ac},${$.ac2})`,margin:"0 auto 14px",boxShadow:`0 0 36px ${$.ac}30`,overflow:"hidden"}}><img src={USER_AVATAR} alt={USER.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
    <div style={{fontSize:24,fontWeight:900}}>{USER.name}</div><div style={{fontSize:13,color:$.t2,marginTop:4}}>Level {USER.level} · ActiveSG Member</div>
    <div style={{margin:"18px auto 0",width:"55%"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:$.t3,marginBottom:5}}><span>XP</span><span>{USER.xp.toLocaleString()}/{USER.xpMax.toLocaleString()}</span></div><div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}><div style={{width:`${(USER.xp/USER.xpMax)*100}%`,height:"100%",background:`linear-gradient(90deg,${$.ac},${$.ac2})`,borderRadius:4,boxShadow:`0 0 10px ${$.ac}40`}}/></div></div>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>{[{l:"Games",v:USER.gamesPlayed,i:"🎮"},{l:"Hours",v:USER.hoursActive,i:"⏱️"},{l:"Friends",v:USER.friendCount,i:"👥"}].map(s=><Card key={s.l} style={{textAlign:"center",padding:18}}><div style={{fontSize:26,marginBottom:6}}>{s.i}</div><div style={{fontSize:26,fontWeight:900}}>{s.v}</div><div style={{fontSize:10,color:$.t3,marginTop:4}}>{s.l}</div></Card>)}</div>
  <Card style={{marginBottom:20,background:"rgba(245,158,11,0.05)",border:"1px solid rgba(245,158,11,0.12)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:15,fontWeight:700}}>🔥 {USER.streak} Day Streak</div><div style={{fontSize:12,color:$.t2,marginTop:4}}>Play tomorrow to keep going!</div></div><div style={{fontSize:40,fontWeight:900,color:"#F59E0B"}}>{USER.streak}</div></div></Card>
  {["Account Settings","Notifications","Privacy","Equipment Locker","Help & Support"].map(i=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 0",borderBottom:`1px solid ${$.bd}`,cursor:"pointer"}}><span style={{fontSize:14}}>{i}</span><span style={{color:$.t3,fontSize:18}}>›</span></div>)}
</Shell>;

export default ProfilePage;
