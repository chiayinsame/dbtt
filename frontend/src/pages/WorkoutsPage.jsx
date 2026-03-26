import { SPORTS, WORK, WKCH } from "../data/mockData";
import $ from "../theme/tokens";
import Shell from "../components/ui/PageShell";
import Card from "../components/ui/GlassCard";
import Pill from "../components/ui/Pill";

const WorkoutsPage = ({onBack}) => {const mx=Math.max(...WKCH.map(d=>d.m));return<Shell title="Workouts" onBack={onBack}>
  <Card style={{marginBottom:20,padding:20}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:14,fontWeight:700}}>This week</span><span style={{fontSize:13,color:$.ac,fontWeight:700}}>{WKCH.reduce((a,d)=>a+d.m,0)} min</span></div>
  <div style={{display:"flex",alignItems:"flex-end",gap:7,height:95}}>{WKCH.map((d,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}><div style={{width:"100%",borderRadius:6,height:d.m>0?Math.max((d.m/mx)*76,8):3,background:d.m>0?`linear-gradient(180deg,${$.ac},${$.ac2})`:"rgba(255,255,255,0.05)",boxShadow:d.m>0?`0 0 10px ${$.ac}28`:"none",transition:"height .5s ease"}}/><span style={{fontSize:10,color:$.t3,fontWeight:500}}>{d.d}</span></div>)}</div></Card>
  <h3 style={{fontSize:16,fontWeight:700,margin:"0 0 12px"}}>Recent activity</h3>{WORK.map(w=>{const s=SPORTS[w.sp];return<div key={w.id} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:`1px solid ${$.bd}`}}><div style={{width:46,height:46,borderRadius:14,background:`${s.hue}10`,border:`1px solid ${s.hue}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{s.icon}</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:600}}>{s.label}</span><span style={{fontSize:11,color:$.t3}}>{w.dt.slice(5).replace("-","/")}</span></div><div style={{fontSize:12,color:$.t3,marginTop:3}}>{w.ven}</div><div style={{display:"flex",gap:14,marginTop:6}}><Pill color={$.ac}>⏱ {w.dur}</Pill><Pill color="#F59E0B">🔥 {w.cal} cal</Pill></div></div></div>})}
</Shell>};

export default WorkoutsPage;
