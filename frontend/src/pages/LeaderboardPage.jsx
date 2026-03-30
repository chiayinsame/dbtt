import { useState } from "react";
import { LEADERBOARD_STEPS, LEADERBOARD_ACTIVITY } from "../data/mockData";
import $ from "../theme/tokens";
import Shell from "../components/ui/PageShell";
import Card from "../components/ui/GlassCard";

const deltaLabel = d => {
  if (d > 0) return {text:`↑${d}`, color:"#00D68F"};
  if (d < 0) return {text:`↓${Math.abs(d)}`, color:"#F43F5E"};
  return {text:"–", color:$.t3};
};

const PODIUM_ORDER = [1, 0, 2]; // silver, gold, bronze left-to-right
const PODIUM_HEIGHTS = [80, 110, 60];
const MEDAL_EMOJI = ["🥇","🥈","🥉"];
const MEDAL_COLORS = ["rgba(255,215,0,0.25)","rgba(192,192,192,0.2)","rgba(205,127,50,0.2)"];
const MEDAL_BORDERS = ["rgba(255,215,0,0.5)","rgba(192,192,192,0.4)","rgba(205,127,50,0.4)"];
const MEDAL_TEXT = ["#FFD700","#C0C0C0","#CD7F32"];

const LeaderboardPage = ({onBack}) => {
  const [tab, setTab] = useState("steps");
  const data = tab === "steps" ? LEADERBOARD_STEPS : LEADERBOARD_ACTIVITY;
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  const displayVal = u => tab === "steps"
    ? (u.steps / 1000).toFixed(1) + "K"
    : u.score.toLocaleString();

  return (
    <Shell title="Leaderboard" onBack={onBack}>
      {/* Tab switcher */}
      <div style={{display:"flex",gap:4,marginBottom:20,background:"rgba(255,255,255,0.04)",borderRadius:12,padding:4}}>
        {[{id:"steps",lb:"👟 Steps"},{id:"activity",lb:"⚡ Activity"}].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"9px 0",borderRadius:9,border:"none",background:tab===t.id?$.ac:"transparent",color:tab===t.id?"#000":$.t2,fontSize:13,fontWeight:700,fontFamily:$.font,cursor:"pointer",transition:"all .2s"}}>
            {t.lb}
          </button>
        ))}
      </div>

      {/* Context subtitle */}
      <div style={{fontSize:12,color:$.t3,marginBottom:18,textAlign:"center",letterSpacing:.3}}>
        {tab === "steps"
          ? "This week · Total steps taken"
          : "This week · Bookings + Rentals + Sessions"}
      </div>

      {/* Podium — top 3 */}
      <Card style={{marginBottom:20,padding:"20px 12px 0"}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:6}}>
          {PODIUM_ORDER.map(idx => {
            const u = top3[idx];
            const h = PODIUM_HEIGHTS[idx];
            const {text: dt, color: dc} = deltaLabel(u.delta);
            return (
              <div key={u.rank} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <span style={{fontSize:idx===0?26:20}}>{u.av}</span>
                <span style={{fontSize:10,fontWeight:700,color:$.t1,textAlign:"center",maxWidth:64,lineHeight:1.2}}>{u.name.split(" ")[0]}</span>
                <span style={{fontSize:idx===0?14:12,fontWeight:800,color:MEDAL_TEXT[idx]}}>{displayVal(u)}</span>
                <span style={{fontSize:9,fontWeight:600,color:dc}}>{dt}</span>
                <div style={{width:"100%",height:h,background:MEDAL_COLORS[idx],border:`1px solid ${MEDAL_BORDERS[idx]}`,borderRadius:"8px 8px 0 0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:idx===0?26:20}}>
                  {MEDAL_EMOJI[idx]}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Ranks 4–10 */}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
        {rest.map(u => {
          const {text: dt, color: dc} = deltaLabel(u.delta);
          return (
            <div key={u.rank} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,background:u.isYou?`${$.ac}10`:"rgba(255,255,255,0.03)",border:u.isYou?`1px solid ${$.ac}35`:"1px solid rgba(255,255,255,0.06)"}}>
              <span style={{width:24,fontSize:13,fontWeight:700,color:$.t3,textAlign:"center",flexShrink:0}}>#{u.rank}</span>
              <span style={{fontSize:22,flexShrink:0}}>{u.av}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:u.isYou?800:600,color:u.isYou?$.ac:$.t1}}>
                  {u.name}{u.isYou?" (You)":""}
                </div>
                {tab === "activity" && (
                  <div style={{fontSize:10,color:$.t3,marginTop:2}}>
                    📅 {u.bk} bookings · 🔒 {u.rent} rentals · 🏃 {u.sess} sessions
                  </div>
                )}
                {tab === "steps" && (
                  <div style={{fontSize:10,color:$.t3,marginTop:2}}>
                    Weekly steps
                  </div>
                )}
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:15,fontWeight:800,color:u.isYou?$.ac:$.t1}}>{displayVal(u)}</div>
                <div style={{fontSize:10,fontWeight:600,color:dc}}>{dt}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{textAlign:"center",fontSize:11,color:$.t3,paddingBottom:16}}>
        Resets every Monday · Sync your steps via ActiveSG app
      </div>
    </Shell>
  );
};

export default LeaderboardPage;
