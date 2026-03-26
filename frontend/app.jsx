import { useState, useRef, useCallback, useMemo, useEffect } from "react";

/*
 ┌─────────────────────────────────────────────────────────────────┐
 │  ActiveSG Sports Discovery — Frontend Prototype                 │
 │                                                                 │
 │  INTENDED FILE STRUCTURE (for production split):                │
 │                                                                 │
 │  src/                                                           │
 │  ├── data/                                                      │
 │  │   └── mockData.js .............. All mock datasets           │
 │  ├── theme/                                                     │
 │  │   ├── tokens.js ............... Design tokens & constants    │
 │  │   └── GlobalStyles.jsx ........ Keyframe animations          │
 │  ├── components/                                                │
 │  │   ├── ui/                                                    │
 │  │   │   ├── Pill.jsx                                           │
 │  │   │   ├── GlassCard.jsx                                      │
 │  │   │   └── PageShell.jsx                                      │
 │  │   ├── map/                                                   │
 │  │   │   ├── VenueTower.jsx ...... SVG tower renderer           │
 │  │   │   ├── PlayerAvatar.jsx .... Draggable character          │
 │  │   │   ├── MapTerrain.jsx ...... SVG ground layer             │
 │  │   │   └── MapParticles.jsx .... Floating decorative items    │
 │  │   ├── venue/                                                 │
 │  │   │   ├── VenueSheet.jsx ...... Bottom sheet detail          │
 │  │   │   └── BookingModal.jsx                                   │
 │  │   └── nav/                                                   │
 │  │       ├── BottomNav.jsx                                      │
 │  │       ├── MenuOverlay.jsx                                    │
 │  │       └── StatusBar.jsx                                      │
 │  ├── pages/                                                     │
 │  │   ├── MapPage.jsx ............ Main map + HUD                │
 │  │   ├── SearchPage.jsx                                         │
 │  │   ├── ProfilePage.jsx                                        │
 │  │   ├── WorkoutsPage.jsx                                       │
 │  │   ├── BookingsPage.jsx                                       │
 │  │   └── FriendsPage.jsx                                        │
 │  └── App.jsx ................... Root router + state             │
 │                                                                 │
 │  Python backend integration:                                    │
 │  Replace mock data imports with fetch calls to your API.        │
 │  The data shapes are documented per-object below.               │
 └─────────────────────────────────────────────────────────────────┘
*/

// ╔══════════════════════════════════════════════════════════════════╗
// ║  data/mockData.js                                               ║
// ║  All mock datasets — swap with API calls for Python backend     ║
// ╚══════════════════════════════════════════════════════════════════╝

const SPORTS = {
  basketball:{icon:"🏀",label:"Basketball",hue:"#F5A623",alt:"#E8930C"},
  badminton: {icon:"🏸",label:"Badminton", hue:"#00D68F",alt:"#0BB87A"},
  swimming:  {icon:"🏊",label:"Swimming",  hue:"#00B4D8",alt:"#0096B7"},
  football:  {icon:"⚽",label:"Football",  hue:"#A855F7",alt:"#9333EA"},
  tennis:    {icon:"🎾",label:"Tennis",    hue:"#F43F5E",alt:"#E11D48"},
  volleyball:{icon:"🏐",label:"Volleyball",hue:"#F97316",alt:"#EA580C"},
};

// Venue shape: { id, name, sport, x, y, players, max, courts, open, equip:[{n,q}] }
const VENUES = [
  {id:1, name:"Kallang Wave Mall",sport:"basketball",x:520,y:460,players:5,max:6,courts:3,open:1,equip:[{n:"Basketball",q:4},{n:"Towel",q:8},{n:"Water Bottle",q:12}]},
  {id:2, name:"Toa Payoh Sports Hall",sport:"badminton",x:340,y:300,players:8,max:12,courts:6,open:2,equip:[{n:"Racket",q:6},{n:"Shuttlecock",q:20},{n:"Towel",q:5}]},
  {id:3, name:"Jurong East Swimming",sport:"swimming",x:150,y:520,players:15,max:50,courts:4,open:4,equip:[{n:"Goggles",q:10},{n:"Kickboard",q:8},{n:"Towel",q:15}]},
  {id:4, name:"Bishan ActiveSG Stadium",sport:"football",x:380,y:220,players:0,max:22,courts:2,open:2,equip:[{n:"Football",q:5},{n:"Shin Guards",q:10},{n:"Bib",q:20}]},
  {id:5, name:"Clementi Sports Centre",sport:"tennis",x:120,y:360,players:3,max:4,courts:4,open:1,equip:[{n:"Tennis Racket",q:4},{n:"Tennis Ball",q:12},{n:"Towel",q:6}]},
  {id:6, name:"Pasir Ris Sports Centre",sport:"volleyball",x:720,y:260,players:10,max:12,courts:2,open:0,equip:[{n:"Volleyball",q:3},{n:"Knee Pads",q:6}]},
  {id:7, name:"Yio Chu Kang Swimming",sport:"swimming",x:480,y:160,players:2,max:40,courts:3,open:3,equip:[{n:"Goggles",q:8},{n:"Float",q:5},{n:"Towel",q:10}]},
  {id:8, name:"Hougang Sports Centre",sport:"basketball",x:620,y:200,players:4,max:10,courts:2,open:1,equip:[{n:"Basketball",q:3},{n:"Wristband",q:8}]},
  {id:9, name:"Tampines Hub",sport:"badminton",x:760,y:420,players:6,max:8,courts:8,open:3,equip:[{n:"Racket",q:10},{n:"Shuttlecock",q:30},{n:"Grip Tape",q:15}]},
  {id:10,name:"Choa Chu Kang SC",sport:"football",x:100,y:180,players:11,max:22,courts:1,open:0,equip:[{n:"Football",q:4},{n:"Bib",q:20},{n:"Cones",q:12}]},
  {id:11,name:"Woodlands Swimming",sport:"swimming",x:300,y:100,players:0,max:30,courts:2,open:2,equip:[{n:"Goggles",q:6},{n:"Kickboard",q:4}]},
  {id:12,name:"Sengkang Sports Centre",sport:"tennis",x:580,y:340,players:2,max:4,courts:3,open:2,equip:[{n:"Tennis Racket",q:6},{n:"Tennis Ball",q:18}]},
];

const vstatus = v => { const r=v.players/v.max; return r>=.7?"hot":v.players>=3?"active":v.players>0?"quiet":"empty"; };
const USER = {name:"Alex Tan",level:43,xp:7200,xpMax:10000,avatar:"🏃",gamesPlayed:156,hoursActive:312,friendCount:28,streak:7};

const FRIENDS = [
  {id:1,name:"Sarah Lim",av:"👩",on:true,ven:"Kallang Wave Mall",sp:"basketball"},
  {id:2,name:"Wei Ming",av:"👨",on:true,ven:"Toa Payoh Sports Hall",sp:"badminton"},
  {id:3,name:"Priya K.",av:"👩‍🦰",on:false,ven:null,sp:null},
  {id:4,name:"Jun Hao",av:"🧑",on:true,ven:null,sp:null},
  {id:5,name:"Aisha N.",av:"🧕",on:true,ven:"Tampines Hub",sp:"badminton"},
  {id:6,name:"David Chen",av:"👨‍🦲",on:false,ven:null,sp:null},
  {id:7,name:"Mei Ling",av:"👧",on:true,ven:"Clementi Sports Centre",sp:"tennis"},
  {id:8,name:"Ravi S.",av:"👨‍🦱",on:false,ven:null,sp:null},
];
const LFG = [
  {id:101,name:"Marcus T.",av:"🧔",sp:"basketball",ven:"Kallang Wave Mall",msg:"1 more for 3v3"},
  {id:102,name:"Zhi Ying",av:"👩‍🦱",sp:"badminton",ven:"Toa Payoh",msg:"Doubles partner"},
  {id:103,name:"Ahmad R.",av:"🧑‍🦱",sp:"football",ven:"Choa Chu Kang",msg:"5-a-side team"},
];
const BOOK = [
  {id:1,ven:"Kallang Wave Mall",sp:"basketball",ct:"Court 2",dt:"2026-03-25",tm:"18:00–19:00",st:"upcoming"},
  {id:2,ven:"Toa Payoh Sports Hall",sp:"badminton",ct:"Court 5",dt:"2026-03-27",tm:"10:00–11:00",st:"upcoming"},
  {id:3,ven:"Clementi SC",sp:"tennis",ct:"Court 1",dt:"2026-03-29",tm:"16:00–17:30",st:"upcoming"},
  {id:4,ven:"Jurong East Swimming",sp:"swimming",ct:"Lane 3",dt:"2026-03-20",tm:"07:00–08:00",st:"completed"},
  {id:5,ven:"Bishan Stadium",sp:"football",ct:"Field A",dt:"2026-03-18",tm:"19:00–21:00",st:"completed"},
  {id:6,ven:"Pasir Ris SC",sp:"volleyball",ct:"Court 1",dt:"2026-03-15",tm:"14:00–16:00",st:"cancelled"},
];
const WORK = [
  {id:1,sp:"basketball",ven:"Kallang Wave Mall",dt:"2026-03-23",dur:"1h 30m",cal:450},
  {id:2,sp:"badminton",ven:"Toa Payoh",dt:"2026-03-21",dur:"1h",cal:320},
  {id:3,sp:"swimming",ven:"Jurong East",dt:"2026-03-20",dur:"45m",cal:380},
  {id:4,sp:"football",ven:"Bishan Stadium",dt:"2026-03-18",dur:"2h",cal:680},
  {id:5,sp:"tennis",ven:"Clementi SC",dt:"2026-03-16",dur:"1h 15m",cal:410},
  {id:6,sp:"basketball",ven:"Hougang SC",dt:"2026-03-14",dur:"1h",cal:300},
];
const WKCH = [{d:"M",m:90},{d:"T",m:0},{d:"W",m:60},{d:"T",m:45},{d:"F",m:0},{d:"S",m:120},{d:"S",m:75}];
const CATS = [{name:"Racket Sports",ic:"🏸",cl:"#00D68F",n:24},{name:"Team Sports",ic:"⚽",cl:"#A855F7",n:18},{name:"Water Sports",ic:"🏊",cl:"#00B4D8",n:12},{name:"Fitness",ic:"💪",cl:"#F43F5E",n:31}];
const MW=1200,MH=900;

// ╔══════════════════════════════════════════════════════════════════╗
// ║  theme/tokens.js — Design tokens                                ║
// ╚══════════════════════════════════════════════════════════════════╝

const $ = {
  bg:"#061220", bg2:"#0C1F35", surf:"#112A45", glass:"rgba(8,18,32,0.88)",
  ac:"#4EEAAA", ac2:"#2DD4BF", red:"#E63946",
  t1:"#FFFFFF", t2:"rgba(255,255,255,0.55)", t3:"rgba(255,255,255,0.25)",
  bd:"rgba(255,255,255,0.07)", bl:"rgba(255,255,255,0.14)",
  blur:"blur(24px)", r:16, font:"'Outfit',sans-serif",
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  theme/GlobalStyles.jsx — Keyframes + resets                    ║
// ╚══════════════════════════════════════════════════════════════════╝

const GlobalCSS = () => <style>{`
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
@keyframes a-pulse{0%,100%{transform:scale(1);opacity:.65}50%{transform:scale(1.18);opacity:1}}
@keyframes a-pulse2{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.35);opacity:.75}}
@keyframes a-spin{to{transform:rotate(360deg)}}
@keyframes a-spinR{to{transform:rotate(-360deg)}}
@keyframes a-float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
@keyframes a-beam{0%,100%{opacity:.5}50%{opacity:1}}
@keyframes a-spark{0%,100%{opacity:0;transform:scale(.4) rotate(0deg)}50%{opacity:1;transform:scale(1.1) rotate(180deg)}}
@keyframes a-ring{0%{transform:scale(.7);opacity:.9}100%{transform:scale(2.2);opacity:0}}
@keyframes a-ring2{0%{transform:scale(.9);opacity:.6}100%{transform:scale(1.8);opacity:0}}
@keyframes a-drift{0%{transform:translateY(0) rotate(0deg);opacity:.8}100%{transform:translateY(-24px) rotate(60deg);opacity:0}}
@keyframes a-up{from{transform:translateY(110%)}to{transform:translateY(0)}}
@keyframes a-fade{from{opacity:0}to{opacity:1}}
@keyframes a-pop{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes a-glow{0%,100%{box-shadow:0 0 15px var(--gc,rgba(78,234,170,.3))}50%{box-shadow:0 0 30px var(--gc,rgba(78,234,170,.5))}}
@keyframes a-heatmap{0%,100%{opacity:.35}50%{opacity:.6}}
::-webkit-scrollbar{width:0;height:0}
`}</style>;

// ╔══════════════════════════════════════════════════════════════════╗
// ║  components/ui — Shared UI primitives                           ║
// ╚══════════════════════════════════════════════════════════════════╝

const Pill = ({children,color=$.ac,bg:bgc}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,background:bgc||`${color}18`,color,whiteSpace:"nowrap"}}>{children}</span>
);

const Card = ({children,style:s,onClick:oc}) => (
  <div onClick={oc} style={{background:$.surf,borderRadius:$.r,border:`1px solid ${$.bd}`,padding:16,...s}}>{children}</div>
);

const Shell = ({title,children}) => (
  <div style={{position:"absolute",inset:0,background:$.bg,paddingTop:48,overflowY:"auto",paddingBottom:100,fontFamily:$.font,color:$.t1}}>
    <div style={{padding:"0 20px"}}>
      <h1 style={{fontSize:30,fontWeight:900,margin:"0 0 20px",letterSpacing:-.5,background:`linear-gradient(135deg,${$.t1},${$.t2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{title}</h1>
      {children}
    </div>
  </div>
);

// ╔══════════════════════════════════════════════════════════════════╗
// ║  components/map/VenueTower.jsx — The visual centrepiece          ║
// ║  Each tower: base rings → segmented shaft → emblem → orb → beam ║
// ╚══════════════════════════════════════════════════════════════════╝

const VenueTower = ({venue:v,onClick,pp}) => {
  const sp=SPORTS[v.sport], st=vstatus(v), c=sp.hue,
    need=v.max-v.players,
    hot=st==="hot", act=st==="active", alive=st!=="empty",
    h=hot?80:act?64:st==="quiet"?48:34,
    dist=Math.hypot(v.x-pp.x,v.y-pp.y), near=dist<200;

  // Number of tower segments scales with activity
  const segs = hot?5:act?4:alive?3:2;

  return (
    <div onClick={()=>onClick(v)} style={{position:"absolute",left:v.x,top:v.y,transform:"translate(-50%,-100%)",cursor:"pointer",zIndex:hot?22:act?18:alive?14:8,filter:near?"none":"brightness(0.5) saturate(0.35)",transition:"filter 0.6s ease"}}>

      {/* === HEAT MAP AURA (hot venues only) === */}
      {hot && <div style={{position:"absolute",bottom:-20,left:"50%",transform:"translateX(-50%)",width:140,height:50,background:`radial-gradient(ellipse,${c}35 0%,${c}15 40%,transparent 70%)`,borderRadius:"50%",animation:"a-heatmap 2.5s ease-in-out infinite",pointerEvents:"none"}}/>}

      {/* === EXPANDING SONAR RINGS === */}
      {alive && <div style={{position:"absolute",bottom:-8,left:"50%",transform:"translateX(-50%)",width:90,height:30,pointerEvents:"none"}}>
        <div style={{position:"absolute",inset:0,border:`1.5px solid ${c}`,borderRadius:"50%",opacity:0,animation:"a-ring 3s ease-out infinite"}}/>
        {(hot||act) && <div style={{position:"absolute",inset:0,border:`1px solid ${c}`,borderRadius:"50%",opacity:0,animation:"a-ring 3s ease-out 1s infinite"}}/>}
        {hot && <div style={{position:"absolute",inset:0,border:`1px solid ${c}80`,borderRadius:"50%",opacity:0,animation:"a-ring2 2s ease-out .4s infinite"}}/>}
      </div>}

      {/* === GROUND GLOW === */}
      <div style={{position:"absolute",bottom:-12,left:"50%",transform:"translateX(-50%)",width:hot?110:act?80:60,height:hot?40:act?28:20,background:`radial-gradient(ellipse,${c}${hot?"60":"35"} 0%,transparent 70%)`,borderRadius:"50%",animation:alive?"a-pulse 2.5s ease-in-out infinite":"none",pointerEvents:"none"}}/>

      {/* === BASE PLATFORM (isometric ellipse) === */}
      <div style={{position:"absolute",bottom:-5,left:"50%",transform:"translateX(-50%)",width:62,height:20,borderRadius:"50%",background:`${c}10`,border:`2px solid ${c}${alive?"50":"20"}`,boxShadow:alive?`inset 0 0 10px ${c}20, 0 0 15px ${c}20`:"none"}}/>

      {/* === SEGMENTED TOWER SHAFT === */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",height:h,justifyContent:"flex-end",position:"relative"}}>
        {Array.from({length:segs}).map((_,i) => {
          const segW = 24 - i*1.5;
          const segH = (h/segs) - 2;
          const opacity = alive ? (0.4 + (i/segs)*0.6) : 0.2;
          return <div key={i} style={{
            width:segW, height:segH, marginBottom:2,
            background:`linear-gradient(180deg, ${c}${Math.round(opacity*255).toString(16).padStart(2,'0')} 0%, ${c}${Math.round(opacity*0.4*255).toString(16).padStart(2,'0')} 100%)`,
            borderRadius:3,
            boxShadow: alive ? `inset 0 0 6px ${c}30, 0 0 8px ${c}15` : "none",
            position:"relative",
          }}>
            {/* Horizontal band on each segment */}
            <div style={{position:"absolute",top:"45%",left:2,right:2,height:1.5,background:`${c}${alive?"70":"25"}`,borderRadius:1}}/>
          </div>;
        })}

        {/* === CENTRE EMBLEM === */}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:20,height:20,borderRadius:"50%",background:`${c}50`,border:`1.5px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,boxShadow:alive?`0 0 10px ${c}40`:"none",zIndex:2}}>{sp.icon}</div>
      </div>

      {/* === TOP CAP (disc) === */}
      <div style={{width:30,height:9,margin:"-1px auto 0",borderRadius:"50%",background:`linear-gradient(180deg, ${c}80, ${c}40)`,boxShadow:`0 0 10px ${c}35`}}/>

      {/* === FLOATING ORB with ORBITING RING === */}
      <div style={{width:42,height:42,margin:"-6px auto 0",position:"relative",animation:alive?"a-float 3.5s ease-in-out infinite":"none"}}>
        {/* Orbiting ring */}
        {alive && <div style={{position:"absolute",inset:-8,border:`1.5px solid ${c}60`,borderTop:`2px solid ${c}`,borderRadius:"50%",animation:`a-spin ${hot?"1.8s":"3.5s"} linear infinite`}}/>}
        {hot && <div style={{position:"absolute",inset:-14,border:`1px solid ${c}30`,borderBottom:`1.5px solid ${c}80`,borderRadius:"50%",animation:"a-spinR 5s linear infinite"}}/>}
        {/* Orb body */}
        <div style={{width:42,height:42,borderRadius:"50%",background:`radial-gradient(circle at 30% 30%, #fff4, ${c}CC, ${c}88)`,boxShadow:`0 0 24px ${c}55, 0 0 48px ${c}20, 0 4px 16px rgba(0,0,0,0.4)`,border:`2px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,position:"relative",zIndex:2}}>
          {sp.icon}
        </div>
      </div>

      {/* === LIGHT BEAM (active+ venues) === */}
      {alive && <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",bottom:h+30,width:hot?6:3,height:hot?80:40,background:`linear-gradient(180deg, transparent 0%, ${c}${hot?"80":"40"} 30%, ${c}${hot?"CC":"60"} 50%, ${c}${hot?"80":"40"} 70%, transparent 100%)`,borderRadius:3,animation:"a-beam 2.5s ease-in-out infinite",pointerEvents:"none",filter:hot?`drop-shadow(0 0 6px ${c}60)`:"none"}}/>}

      {/* === SPARKLE PARTICLES === */}
      {alive && [0,1,2,3].map(i => (
        <div key={i} style={{position:"absolute",left:`${40+(i-1.5)*20}%`,top:`${5+i*15}%`,width:hot?6:4,height:hot?6:4,pointerEvents:"none",background:i%2===0?c:"#fff",borderRadius:1,transform:"rotate(45deg)",animation:`a-spark ${2.2+i*.6}s ease-in-out ${i*.4}s infinite`,opacity:.8}}/>
      ))}

      {/* === PLAYER COUNT BADGE === */}
      {v.players > 0 && (
        <div style={{position:"absolute",top:-22,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg, ${$.glass}, rgba(0,0,0,0.6))`,backdropFilter:$.blur,border:`1px solid ${c}55`,borderRadius:22,padding:"5px 14px",whiteSpace:"nowrap",fontSize:10,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",gap:6,boxShadow:`0 4px 16px rgba(0,0,0,0.5), 0 0 8px ${c}20`}}>
          <span style={{width:7,height:7,borderRadius:4,background:c,boxShadow:`0 0 8px ${c}`}}/>
          {v.players} Playing{need>0&&need<=3?`, ${need} More!`:""}
        </div>
      )}

      {/* === MINI AVATARS at base === */}
      {v.players >= 3 && (
        <div style={{position:"absolute",bottom:2,left:"50%",transform:"translateX(-50%)",display:"flex",pointerEvents:"none"}}>
          {Array.from({length:Math.min(v.players,5)}).map((_,i)=>(
            <div key={i} style={{width:16,height:16,borderRadius:8,marginLeft:i>0?-5:0,background:`hsl(${i*55+180},55%,60%)`,border:"2px solid rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:7}}>{"👤👩🧑👨👧"[i%5]}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  components/map/PlayerAvatar.jsx — Draggable character          ║
// ╚══════════════════════════════════════════════════════════════════╝

const PlayerAvatar = ({pos,dragging}) => (
  <div style={{position:"absolute",left:pos.x,top:pos.y,transform:"translate(-50%,-50%)",zIndex:30,cursor:dragging?"grabbing":"grab",touchAction:"none",userSelect:"none"}}>
    {/* Range circle */}
    <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:360,height:360,borderRadius:"50%",border:`2px solid rgba(78,234,170,0.15)`,background:"radial-gradient(circle, rgba(78,234,170,0.06) 0%, rgba(78,234,170,0.02) 40%, transparent 70%)",pointerEvents:"none"}}/>
    {/* Outer pulse ring */}
    <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:90,height:90,borderRadius:"50%",border:"2px solid rgba(78,234,170,0.2)",animation:"a-pulse2 3s ease-in-out infinite",pointerEvents:"none"}}/>
    {/* Inner glow */}
    <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:64,height:64,borderRadius:"50%",background:"radial-gradient(circle, rgba(78,234,170,0.18) 0%, transparent 70%)",pointerEvents:"none"}}/>
    {/* Avatar body */}
    <div style={{width:52,height:52,borderRadius:"50%",position:"relative",background:`linear-gradient(145deg, ${$.ac}, ${$.ac2})`,boxShadow:`0 0 28px ${$.ac}55, 0 0 56px ${$.ac}18, 0 6px 20px rgba(0,0,0,0.5)`,border:`3px solid ${$.ac}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,"--gc":`${$.ac}40`,animation:"a-glow 3s ease-in-out infinite"}}>
      {USER.avatar}
      {/* Direction triangle */}
      <div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"6px solid transparent",borderRight:"6px solid transparent",borderBottom:`10px solid ${$.ac}`}}/>
    </div>
    {!dragging && <div style={{position:"absolute",top:36,left:"50%",transform:"translateX(-50%)",fontSize:8,color:$.t3,whiteSpace:"nowrap",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",pointerEvents:"none",textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>WASD / drag</div>}
  </div>
);

// ╔══════════════════════════════════════════════════════════════════╗
// ║  components/map/MapTerrain.jsx — SVG ground layer               ║
// ╚══════════════════════════════════════════════════════════════════╝

const CRYSTALS = [{x:200,y:150},{x:450,y:120},{x:680,y:300},{x:300,y:480},{x:600,y:500},{x:150,y:400},{x:500,y:280},{x:780,y:180},{x:350,y:600},{x:700,y:550},{x:250,y:250},{x:550,y:380},{x:100,y:550},{x:820,y:480},{x:430,y:50},{x:660,y:620},{x:180,y:270},{x:740,y:140}];
const BLDGS = [[60,240,28,18],[88,255,22,14],[250,340,32,20],[500,130,26,16],[528,122,18,22],[650,440,30,18],[340,500,24,14],[368,508,20,12],[770,330,28,16],[200,80,22,14],[420,280,26,18],[600,600,24,16],[140,450,20,12],[800,520,22,14],[310,160,18,10],[560,250,16,22],[680,140,20,16],[400,620,26,14],[72,480,24,16],[520,560,20,14],[380,380,18,12],[700,400,22,16],[260,600,24,18],[160,120,20,14]];

const MapTerrain = () => (
  <svg width={MW} height={MH} style={{position:"absolute",top:0,left:0}}>
    <defs>
      <pattern id="gd" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0L0 0 0 50" fill="none" stroke="rgba(78,234,170,0.05)" strokeWidth="0.5"/></pattern>
      <radialGradient id="wg"><stop offset="0%" stopColor="rgba(0,180,216,0.3)"/><stop offset="100%" stopColor="transparent"/></radialGradient>
      <radialGradient id="pg"><stop offset="0%" stopColor="rgba(16,185,129,0.22)"/><stop offset="100%" stopColor="transparent"/></radialGradient>
      <linearGradient id="rd" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="rgba(20,60,100,0)"/><stop offset="50%" stopColor="rgba(20,60,100,0.5)"/><stop offset="100%" stopColor="rgba(20,60,100,0)"/></linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#gd)"/>

    {/* Roads — main arteries */}
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 180Q250 165 450 200Q650 235 900 210" stroke="rgba(22,55,90,0.6)" strokeWidth="14"/>
      <path d="M0 180Q250 165 450 200Q650 235 900 210" stroke="rgba(30,70,110,0.4)" strokeWidth="10"/>
      <path d="M0 400Q200 375 500 420Q700 450 900 400" stroke="rgba(22,55,90,0.6)" strokeWidth="16"/>
      <path d="M0 400Q200 375 500 420Q700 450 900 400" stroke="rgba(30,70,110,0.4)" strokeWidth="12"/>
      <path d="M0 580Q300 555 600 595Q800 610 900 580" stroke="rgba(22,55,90,0.5)" strokeWidth="10"/>
      <path d="M180 0Q165 200 200 400Q225 560 190 700" stroke="rgba(22,55,90,0.5)" strokeWidth="12"/>
      <path d="M450 0Q425 180 460 350Q485 525 450 700" stroke="rgba(22,55,90,0.6)" strokeWidth="16"/>
      <path d="M450 0Q425 180 460 350Q485 525 450 700" stroke="rgba(30,70,110,0.4)" strokeWidth="12"/>
      <path d="M700 0Q715 200 690 400Q675 555 710 700" stroke="rgba(22,55,90,0.5)" strokeWidth="12"/>
    </g>
    {/* Centre dashes */}
    <g fill="none" strokeDasharray="10 16" strokeLinecap="round">
      <path d="M0 400Q200 375 500 420Q700 450 900 400" stroke="rgba(60,120,170,0.18)" strokeWidth="1.5"/>
      <path d="M450 0Q425 180 460 350Q485 525 450 700" stroke="rgba(60,120,170,0.18)" strokeWidth="1.5"/>
    </g>
    {/* Secondary roads */}
    <g fill="none" stroke="rgba(22,55,90,0.35)" strokeLinecap="round">
      <path d="M300 0Q315 160 290 320" strokeWidth="6"/><path d="M0 290Q220 300 420 280" strokeWidth="6"/>
      <path d="M580 340Q720 330 900 355" strokeWidth="6"/><path d="M0 500Q150 490 300 510" strokeWidth="5"/>
      <path d="M600 0Q590 120 610 260" strokeWidth="5"/><path d="M320 500Q400 480 500 510" strokeWidth="5"/>
    </g>

    {/* Buildings (isometric-style blocks) */}
    <g>{BLDGS.map(([bx,by,bw,bh],i) => (
      <g key={i}>
        <rect x={bx} y={by} width={bw} height={bh} rx="2" fill="rgba(16,32,58,0.7)" stroke="rgba(35,70,120,0.3)" strokeWidth="0.5"/>
        <rect x={bx+1} y={by+1} width={bw-2} height={3} rx="1" fill="rgba(40,90,140,0.15)"/>
      </g>
    ))}</g>

    {/* Water bodies */}
    <ellipse cx="80" cy="630" rx="65" ry="38" fill="url(#wg)"/>
    <ellipse cx="810" cy="115" rx="55" ry="32" fill="url(#wg)"/>
    <ellipse cx="460" cy="665" rx="75" ry="28" fill="url(#wg)"/>
    <ellipse cx="320" cy="550" rx="35" ry="18" fill="url(#wg)"/>

    {/* Parks */}
    <ellipse cx="250" cy="440" rx="50" ry="32" fill="url(#pg)"/>
    <ellipse cx="660" cy="565" rx="58" ry="38" fill="url(#pg)"/>
    <ellipse cx="385" cy="145" rx="42" ry="28" fill="url(#pg)"/>
    <ellipse cx="725" cy="385" rx="38" ry="24" fill="url(#pg)"/>
    <ellipse cx="550" cy="480" rx="30" ry="18" fill="url(#pg)"/>

    {/* Area labels */}
    <g fill="rgba(255,255,255,0.06)" fontFamily="'Outfit',sans-serif" fontSize="10" fontWeight="600" letterSpacing="3">
      <text x="55" y="128">WOODLANDS</text><text x="345" y="78">YISHUN</text>
      <text x="615" y="148">SENGKANG</text><text x="35" y="348">CLEMENTI</text>
      <text x="475" y="438">KALLANG</text><text x="695" y="278">PASIR RIS</text>
      <text x="95" y="558">JURONG</text><text x="715" y="458">TAMPINES</text>
      <text x="345" y="238">BISHAN</text><text x="565" y="218">HOUGANG</text>
    </g>
  </svg>
);

// ╔══════════════════════════════════════════════════════════════════╗
// ║  components/map/MapParticles.jsx — Floating crystal items       ║
// ╚══════════════════════════════════════════════════════════════════╝

const MapParticles = () => (
  <>{CRYSTALS.map((c,i) => (
    <div key={i} style={{position:"absolute",left:c.x,top:c.y,width:i%3===0?12:9,height:i%3===0?12:9,pointerEvents:"none",background:i%4===0?"linear-gradient(135deg,#48CAE4,#00B4D8)":i%4===1?"linear-gradient(135deg,#4EEAAA,#2DD4BF)":"linear-gradient(135deg,#818CF8,#6366F1)",borderRadius:i%2===0?2:6,transform:"rotate(45deg)",boxShadow:`0 0 ${i%3===0?12:6}px ${i%4===0?"rgba(0,180,216,0.6)":i%4===1?"rgba(78,234,170,0.5)":"rgba(99,102,241,0.5)"}`,animation:`a-drift ${3+i%4}s ease-in-out ${i*.3}s infinite alternate`,opacity:.75}}/>
  ))}</>
);

// ╔══════════════════════════════════════════════════════════════════╗
// ║  components/map/VenueMarker.jsx — Simplified zoomed-out marker  ║
// ╚══════════════════════════════════════════════════════════════════╝

const VenueMarker = ({venue:v, onClick}) => {
  const sp = SPORTS[v.sport], st = vstatus(v), c = sp.hue;
  const alive = st !== "empty";
  return (
    <div onClick={() => onClick(v)} data-t style={{position:"absolute",left:v.x,top:v.y,transform:"translate(-50%,-50%)",cursor:"pointer",zIndex:alive?12:8}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:`${c}CC`,border:`2.5px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:`0 0 14px ${c}70`,animation:alive?"a-pulse 2.5s ease-in-out infinite":"none"}}>
        {sp.icon}
      </div>
      {alive && (
        <div style={{position:"absolute",top:-20,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.78)",backdropFilter:"blur(8px)",borderRadius:8,padding:"2px 7px",fontSize:9,fontWeight:700,color:"#fff",whiteSpace:"nowrap",border:`1px solid ${c}40`}}>
          {v.players}/{v.max} 🧑
        </div>
      )}
      <div style={{position:"absolute",top:38,left:"50%",transform:"translateX(-50%)",fontSize:8,color:"rgba(255,255,255,0.65)",whiteSpace:"nowrap",fontWeight:600,maxWidth:80,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",textShadow:"0 1px 4px rgba(0,0,0,0.9)",pointerEvents:"none"}}>
        {v.name}
      </div>
    </div>
  );
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  pages/MapPage.jsx — Main map screen + HUD + interaction logic  ║
// ╚══════════════════════════════════════════════════════════════════╝

const MapPage = ({onVenue,onMenu}) => {
  const [mapOff,setMapOff] = useState({x:-180,y:-100});
  const [pp,setPp] = useState({x:420,y:380});
  const [dragMap,setDragMap] = useState(false);
  const [dragP,setDragP] = useState(false);
  const [zoom,setZoom] = useState(1);
  const ref = useRef({}), mRef = useRef(null), keysRef = useRef({}), containerRef = useRef(null);

  const onDown = useCallback(e => {
    if(e.target.closest('[data-p]')){setDragP(true);const r=mRef.current.getBoundingClientRect();ref.current={sx:e.clientX,sy:e.clientY,ox:pp.x,oy:pp.y,r};e.preventDefault();return;}
    if(e.target.closest('[data-t]'))return;
    setDragMap(true);ref.current={sx:e.clientX,sy:e.clientY,ox:mapOff.x,oy:mapOff.y};
  },[mapOff,pp]);

  const onMove = useCallback(e => {
    if(dragP){const{sx,sy,ox,oy,r}=ref.current;setPp({x:Math.max(20,Math.min(MW-20,ox+(e.clientX-sx)*(MW/r.width))),y:Math.max(20,Math.min(MH-20,oy+(e.clientY-sy)*(MH/r.height)))});return;}
    if(dragMap){const{sx,sy,ox,oy}=ref.current;setMapOff({x:ox+(e.clientX-sx),y:oy+(e.clientY-sy)});}
  },[dragMap,dragP]);

  const onUp = useCallback(() => {setDragMap(false);setDragP(false);},[]);
  const nearby = useMemo(() => VENUES.filter(v=>Math.hypot(v.x-pp.x,v.y-pp.y)<200&&v.players>0).length,[pp]);

  // ── Wheel zoom toward cursor ──
  const onWheel = useCallback(e => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.88 : 1.12;
    const nz = Math.max(0.3, Math.min(2.5, zoom * factor));
    const ratio = nz / zoom;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    setZoom(nz);
    setMapOff(off => ({x: cx - (cx - off.x) * ratio, y: cy - (cy - off.y) * ratio}));
  }, [zoom]);

  // ── WASD / arrow key movement ──
  useEffect(() => {
    const keys = keysRef.current;
    const onKeyDown = e => { keys[e.key.toLowerCase()] = true; };
    const onKeyUp   = e => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);
    const speed = 4;
    const id = setInterval(() => {
      let dx = 0, dy = 0;
      if (keys['w'] || keys['arrowup'])    dy -= speed;
      if (keys['s'] || keys['arrowdown'])  dy += speed;
      if (keys['a'] || keys['arrowleft'])  dx -= speed;
      if (keys['d'] || keys['arrowright']) dx += speed;
      if (dx || dy) setPp(p => ({x: Math.max(20, Math.min(MW-20, p.x+dx)), y: Math.max(20, Math.min(MH-20, p.y+dy))}));
    }, 16);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); clearInterval(id); };
  }, []);

  return (
    <div ref={containerRef} style={{position:"absolute",inset:0,overflow:"hidden",background:`radial-gradient(ellipse at 40% 30%, #0C2440 0%, ${$.bg} 50%, #040A14 100%)`}} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp} onWheel={onWheel}>

      {/* ── HUD Top ── */}
      <div style={{position:"absolute",top:48,left:16,right:16,zIndex:50,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <button onClick={onMenu} style={{background:$.glass,backdropFilter:$.blur,border:`1px solid ${$.bl}`,borderRadius:14,width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:$.t1,boxShadow:"0 2px 12px rgba(0,0,0,0.3)"}}>☰</button>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{background:$.glass,backdropFilter:$.blur,border:`1px solid ${$.bl}`,borderRadius:14,padding:"9px 16px",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6,color:$.t1,boxShadow:"0 2px 12px rgba(0,0,0,0.3)"}}><span style={{color:$.ac,fontSize:8}}>●</span>0.3 km</div>
          <div style={{background:$.glass,backdropFilter:$.blur,border:`1px solid ${$.bl}`,borderRadius:14,padding:"9px 16px",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6,color:$.t1,position:"relative",boxShadow:"0 2px 12px rgba(0,0,0,0.3)"}}>🔭 Nearby{nearby>0&&<span style={{position:"absolute",top:-6,right:-6,background:$.red,borderRadius:10,width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,boxShadow:`0 2px 8px ${$.red}60`}}>{nearby}</span>}</div>
          {/* Zoom controls */}
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <button onClick={()=>setZoom(z=>Math.min(2.5,z*1.25))} style={{background:$.glass,backdropFilter:$.blur,border:`1px solid ${$.bl}`,borderRadius:10,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:$.t1,fontWeight:700,lineHeight:1,boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>+</button>
            <button onClick={()=>setZoom(z=>Math.max(0.3,z*0.8))}  style={{background:$.glass,backdropFilter:$.blur,border:`1px solid ${$.bl}`,borderRadius:10,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:$.t1,fontWeight:700,lineHeight:1,boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>−</button>
          </div>
          {/* Zoom level badge */}
          <div style={{background:$.glass,backdropFilter:$.blur,border:`1px solid ${$.bl}`,borderRadius:10,padding:"5px 10px",fontSize:10,fontWeight:700,color:zoom<0.65?$.ac:$.t2,boxShadow:"0 2px 8px rgba(0,0,0,0.3)",minWidth:42,textAlign:"center"}}>
            {zoom<0.65?"overview":zoom>1.5?"close-up":`${Math.round(zoom*100)}%`}
          </div>
        </div>
      </div>

      {/* ── Map World ── */}
      <div ref={mRef} style={{position:"absolute",width:MW,height:MH,transform:`translate(${mapOff.x}px,${mapOff.y}px) scale(${zoom})`,transformOrigin:"0 0",cursor:dragMap?"grabbing":dragP?"default":"grab",transition:(dragMap||dragP)?"none":"transform 0.15s ease-out"}}>
        <MapTerrain/>
        <MapParticles/>
        {VENUES.map(v => (
          <div key={v.id} data-t>
            {zoom < 0.65
              ? <VenueMarker venue={v} onClick={onVenue}/>
              : <VenueTower venue={v} onClick={onVenue} pp={pp}/>}
          </div>
        ))}
        <div data-p><PlayerAvatar pos={pp} dragging={dragP}/></div>
      </div>

      {/* ── Bottom HUD ── */}
      <div style={{position:"absolute",bottom:78,left:0,right:0,zIndex:50,display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"0 16px"}}>
        {/* Profile chip */}
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:$.glass,backdropFilter:$.blur,border:`2.5px solid ${$.ac}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:`0 0 16px ${$.ac}18`}}>{USER.avatar}</div>
          <div><div style={{fontSize:15,fontWeight:800,color:$.t1}}>{USER.level}</div>
          <div style={{width:56,height:5,background:"rgba(255,255,255,0.08)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${(USER.xp/USER.xpMax)*100}%`,height:"100%",background:`linear-gradient(90deg,${$.ac},${$.ac2})`,borderRadius:3}}/></div></div>
        </div>
        {/* ActiveSG orb */}
        <button onClick={onMenu} style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(145deg,${$.red},#B91C2C)`,border:"3px solid rgba(255,255,255,0.18)",boxShadow:`0 6px 28px rgba(230,57,70,0.5), 0 0 48px rgba(230,57,70,0.15), inset 0 -2px 8px rgba(0,0,0,0.3)`,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#fff",position:"absolute",left:"50%",transform:"translateX(-50%)",bottom:0}}>
          <span style={{fontSize:22}}>🔥</span><span style={{fontSize:7,fontWeight:800,letterSpacing:.6,marginTop:-2}}>ActiveSG</span>
        </button>
        {/* Nearby events */}
        <div style={{background:$.glass,backdropFilter:$.blur,border:`1px solid ${$.bl}`,borderRadius:14,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,cursor:"pointer",boxShadow:"0 2px 12px rgba(0,0,0,0.3)"}}>
          <span style={{fontSize:20}}>🔭</span><div style={{fontSize:10,fontWeight:600,color:$.t2,lineHeight:1.3}}>Nearby<br/>Events</div>
        </div>
      </div>
    </div>
  );
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  components/venue/VenueSheet.jsx — Bottom sheet detail view     ║
// ╚══════════════════════════════════════════════════════════════════╝

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

// ╔══════════════════════════════════════════════════════════════════╗
// ║  components/venue/BookingModal.jsx                               ║
// ╚══════════════════════════════════════════════════════════════════╝

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

// ╔══════════════════════════════════════════════════════════════════╗
// ║  components/nav/MenuOverlay.jsx                                  ║
// ╚══════════════════════════════════════════════════════════════════╝

const MenuOverlay = ({onClose,onNav}) => {
  const items=[{id:"search",ic:"🔍",lb:"Search"},{id:"bookings",ic:"📅",lb:"Bookings"},{id:"workouts",ic:"🏋️",lb:"Workouts"},{id:"friends",ic:"👥",lb:"Friends"},{id:"profile",ic:"👤",lb:"Profile"}];
  const pos=[{top:"34%",left:"16%"},{top:"34%",right:"16%"},{top:"50%",left:"50%",transform:"translateX(-50%)"},{top:"64%",left:"16%"},{top:"64%",right:"16%"}];
  return <div style={{position:"absolute",inset:0,zIndex:95,background:`linear-gradient(180deg,rgba(8,20,38,0.96),rgba(4,10,20,0.98))`,backdropFilter:"blur(32px)",animation:"a-fade .2s",fontFamily:$.font}}>
    <div style={{position:"absolute",top:56,right:20,display:"flex",flexDirection:"column",gap:10,alignItems:"flex-end"}}>{["Settings ⚙️","Events 🎫","Notices 🔔"].map(l=><button key={l} style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${$.bl}`,borderRadius:12,padding:"9px 18px",color:$.t1,fontSize:12,fontWeight:600,cursor:"pointer"}}>{l}</button>)}</div>
    {items.map((it,i)=><button key={it.id} onClick={()=>{onNav(it.id);onClose()}} style={{position:"absolute",...pos[i],background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:10,color:$.t1,animation:`a-pop .3s cubic-bezier(.34,1.56,.64,1) ${i*.05}s both`}}>
      <div style={{width:74,height:74,borderRadius:"50%",background:"rgba(255,255,255,0.03)",border:`2px solid ${$.ac}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,boxShadow:`0 0 24px ${$.ac}06`,transition:"all .2s"}}>{it.ic}</div>
      <span style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:`${$.ac}BB`}}>{it.lb}</span>
    </button>)}
    <div style={{position:"absolute",bottom:92,left:"50%",transform:"translateX(-50%)",display:"flex",gap:30,alignItems:"center"}}>
      <button style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:$.t3}}>📸</button>
      <button onClick={onClose} style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,0.05)",border:`2px solid ${$.bl}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,cursor:"pointer",color:$.t1}}>✕</button>
      <button style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:$.t3}}>📢</button>
    </div>
  </div>;
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  components/nav/BottomNav.jsx + StatusBar.jsx                   ║
// ╚══════════════════════════════════════════════════════════════════╝

const BottomNav = ({active:a,onNav}) => {
  const tabs=[{id:"map",ic:"🏠",lb:"Home"},{id:"search",ic:"🔍",lb:"Search"},{id:"workouts",ic:"🏋️",lb:"Workouts"},{id:"bookings",ic:"📅",lb:"Bookings"},{id:"profile",ic:"👤",lb:"Profile"}];
  return <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:90,background:$.glass,backdropFilter:$.blur,borderTop:`1px solid ${$.bd}`,paddingBottom:10}}>
    <div style={{display:"flex",justifyContent:"space-around",padding:"9px 0 3px"}}>{tabs.map(t=><button key={t.id} onClick={()=>onNav(t.id)} style={{background:"none",border:"none",color:a===t.id?$.ac:$.t3,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",fontSize:20,padding:"4px 14px",transition:"color .2s"}}><span>{t.ic}</span><span style={{fontSize:9,fontWeight:600,fontFamily:$.font}}>{t.lb}</span>{a===t.id&&<div style={{width:5,height:5,borderRadius:3,background:$.ac,boxShadow:`0 0 8px ${$.ac}`,marginTop:1}}/>}</button>)}</div>
  </div>;
};

const StatusBar = () => <div style={{height:44,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",fontSize:13,fontWeight:600,position:"absolute",top:0,left:0,right:0,zIndex:100,background:"linear-gradient(180deg,rgba(6,18,32,0.9) 0%,transparent 100%)",color:$.t1,fontFamily:$.font}}><span>9:41</span><div style={{display:"flex",gap:5,alignItems:"center",fontSize:11}}><span>5G</span><span style={{fontSize:14}}>📶🔋</span></div></div>;

// ╔══════════════════════════════════════════════════════════════════╗
// ║  pages/SearchPage.jsx                                           ║
// ╚══════════════════════════════════════════════════════════════════╝

const SearchPage = () => {
  const[q,sQ]=useState("");const res=q?VENUES.filter(v=>v.name.toLowerCase().includes(q.toLowerCase())||v.sport.includes(q.toLowerCase())):[];
  return <Shell title="Search"><div style={{position:"relative",marginBottom:20}}><input value={q} onChange={e=>sQ(e.target.value)} placeholder="Courts, sports, venues…" style={{width:"100%",padding:"15px 18px 15px 46px",background:$.surf,border:`1px solid ${$.bd}`,borderRadius:$.r,fontSize:15,color:$.t1,outline:"none",fontFamily:$.font}}/><span style={{position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",fontSize:16,opacity:.35}}>🔍</span></div>
  <div style={{marginBottom:24}}><h3 style={{fontSize:16,fontWeight:700,margin:"0 0 10px"}}>Browse nearby</h3><div style={{background:$.surf,borderRadius:$.r,height:135,border:`1px solid ${$.bd}`,position:"relative",overflow:"hidden"}}><svg width="100%" height="100%" style={{opacity:.2}}><defs><pattern id="sg" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0L0 0 0 24" fill="none" stroke={$.ac} strokeWidth="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(#sg)"/></svg>{VENUES.slice(0,6).map((v,i)=>{const s=SPORTS[v.sport];return<div key={i} style={{position:"absolute",left:`${10+i*15}%`,top:`${18+(i%3)*22}%`,width:28,height:28,borderRadius:"50%",background:`${s.hue}22`,border:`2px solid ${s.hue}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,boxShadow:`0 0 10px ${s.hue}30`}}>{s.icon}</div>})}<div style={{position:"absolute",bottom:12,right:16,fontSize:11,color:$.t3,fontWeight:600}}>{VENUES.length} venues</div></div></div>
  <h3 style={{fontSize:16,fontWeight:700,margin:"0 0 10px"}}>Browse all</h3><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>{CATS.map(c=><div key={c.name} style={{background:`${c.cl}0A`,border:`1px solid ${c.cl}1A`,borderRadius:$.r,padding:18,cursor:"pointer",transition:"all .2s"}}><div style={{fontSize:30,marginBottom:8}}>{c.ic}</div><div style={{fontSize:14,fontWeight:700}}>{c.name}</div><div style={{fontSize:11,color:$.t3,marginTop:4}}>{c.n} venues</div></div>)}</div>
  <h3 style={{fontSize:16,fontWeight:700,margin:"0 0 10px"}}>{q?"Results":"Saved places"}</h3>{q?(res.length?res.map(v=>{const s=SPORTS[v.sport];return<div key={v.id} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 0",borderBottom:`1px solid ${$.bd}`}}><div style={{width:46,height:46,borderRadius:14,background:`${s.hue}10`,border:`1px solid ${s.hue}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{s.icon}</div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{v.name}</div><div style={{fontSize:11,color:$.t3,marginTop:2}}>{v.players} playing · {v.open} open</div></div></div>}):<div style={{textAlign:"center",padding:30,color:$.t3,fontSize:13}}>No results</div>):<div style={{display:"flex",gap:12,overflow:"auto",paddingBottom:8}}>{[1,2,3,4,5].map(i=><div key={i} style={{width:56,height:56,borderRadius:"50%",border:`2px dashed ${$.bl}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18,color:$.t3}}>+</div>)}</div>}
  </Shell>;
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  pages/ProfilePage.jsx                                          ║
// ╚══════════════════════════════════════════════════════════════════╝

const ProfilePage = () => <Shell title="Profile">
  <div style={{background:`linear-gradient(145deg,${$.ac}10,${$.ac2}06)`,borderRadius:22,padding:30,textAlign:"center",border:`1px solid ${$.ac}15`,marginBottom:20}}>
    <div style={{width:88,height:88,borderRadius:"50%",background:`linear-gradient(145deg,${$.ac},${$.ac2})`,margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,boxShadow:`0 0 36px ${$.ac}30`}}>{USER.avatar}</div>
    <div style={{fontSize:24,fontWeight:900}}>{USER.name}</div><div style={{fontSize:13,color:$.t2,marginTop:4}}>Level {USER.level} · ActiveSG Member</div>
    <div style={{margin:"18px auto 0",width:"55%"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:$.t3,marginBottom:5}}><span>XP</span><span>{USER.xp.toLocaleString()}/{USER.xpMax.toLocaleString()}</span></div><div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}><div style={{width:`${(USER.xp/USER.xpMax)*100}%`,height:"100%",background:`linear-gradient(90deg,${$.ac},${$.ac2})`,borderRadius:4,boxShadow:`0 0 10px ${$.ac}40`}}/></div></div>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>{[{l:"Games",v:USER.gamesPlayed,i:"🎮"},{l:"Hours",v:USER.hoursActive,i:"⏱️"},{l:"Friends",v:USER.friendCount,i:"👥"}].map(s=><Card key={s.l} style={{textAlign:"center",padding:18}}><div style={{fontSize:26,marginBottom:6}}>{s.i}</div><div style={{fontSize:26,fontWeight:900}}>{s.v}</div><div style={{fontSize:10,color:$.t3,marginTop:4}}>{s.l}</div></Card>)}</div>
  <Card style={{marginBottom:20,background:"rgba(245,158,11,0.05)",border:"1px solid rgba(245,158,11,0.12)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:15,fontWeight:700}}>🔥 {USER.streak} Day Streak</div><div style={{fontSize:12,color:$.t2,marginTop:4}}>Play tomorrow to keep going!</div></div><div style={{fontSize:40,fontWeight:900,color:"#F59E0B"}}>{USER.streak}</div></div></Card>
  {["Account Settings","Notifications","Privacy","Equipment Locker","Help & Support"].map(i=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 0",borderBottom:`1px solid ${$.bd}`,cursor:"pointer"}}><span style={{fontSize:14}}>{i}</span><span style={{color:$.t3,fontSize:18}}>›</span></div>)}
</Shell>;

// ╔══════════════════════════════════════════════════════════════════╗
// ║  pages/WorkoutsPage.jsx                                         ║
// ╚══════════════════════════════════════════════════════════════════╝

const WorkoutsPage = () => {const mx=Math.max(...WKCH.map(d=>d.m));return<Shell title="Workouts">
  <Card style={{marginBottom:20,padding:20}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:14,fontWeight:700}}>This week</span><span style={{fontSize:13,color:$.ac,fontWeight:700}}>{WKCH.reduce((a,d)=>a+d.m,0)} min</span></div>
  <div style={{display:"flex",alignItems:"flex-end",gap:7,height:95}}>{WKCH.map((d,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}><div style={{width:"100%",borderRadius:6,height:d.m>0?Math.max((d.m/mx)*76,8):3,background:d.m>0?`linear-gradient(180deg,${$.ac},${$.ac2})`:"rgba(255,255,255,0.05)",boxShadow:d.m>0?`0 0 10px ${$.ac}28`:"none",transition:"height .5s ease"}}/><span style={{fontSize:10,color:$.t3,fontWeight:500}}>{d.d}</span></div>)}</div></Card>
  <h3 style={{fontSize:16,fontWeight:700,margin:"0 0 12px"}}>Recent activity</h3>{WORK.map(w=>{const s=SPORTS[w.sp];return<div key={w.id} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:`1px solid ${$.bd}`}}><div style={{width:46,height:46,borderRadius:14,background:`${s.hue}10`,border:`1px solid ${s.hue}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{s.icon}</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:600}}>{s.label}</span><span style={{fontSize:11,color:$.t3}}>{w.dt.slice(5).replace("-","/")}</span></div><div style={{fontSize:12,color:$.t3,marginTop:3}}>{w.ven}</div><div style={{display:"flex",gap:14,marginTop:6}}><Pill color={$.ac}>⏱ {w.dur}</Pill><Pill color="#F59E0B">🔥 {w.cal} cal</Pill></div></div></div>})}
</Shell>};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  pages/BookingsPage.jsx                                         ║
// ╚══════════════════════════════════════════════════════════════════╝

const BookingsPage = () => {const[tab,sT]=useState("upcoming");const list=BOOK.filter(b=>tab==="upcoming"?b.st==="upcoming":b.st!=="upcoming");return<Shell title="Bookings">
  <div style={{display:"flex",marginBottom:20,background:$.surf,borderRadius:12,padding:3}}>{["upcoming","past"].map(t=><button key={t} onClick={()=>sT(t)} style={{flex:1,padding:"11px 0",background:tab===t?`${$.ac}15`:"transparent",border:"none",borderRadius:10,color:tab===t?$.ac:$.t3,fontSize:13,fontWeight:600,cursor:"pointer",textTransform:"capitalize",fontFamily:$.font,transition:"all .2s"}}>{t}</button>)}</div>
  {!list.length?<div style={{textAlign:"center",padding:40,color:$.t3,fontSize:14}}>No {tab} bookings</div>:list.map(b=>{const s=SPORTS[b.sp],sc=b.st==="upcoming"?$.ac:b.st==="completed"?"#60A5FA":"#F87171";return<Card key={b.id} style={{marginBottom:10,border:`1px solid ${sc}12`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div><div style={{fontSize:15,fontWeight:700}}>{b.ven}</div><div style={{fontSize:12,color:$.t2,marginTop:4}}>{s.icon} {s.label} · {b.ct}</div></div><Pill color={sc}>{b.st}</Pill></div>
    <div style={{display:"flex",gap:16,fontSize:12,color:$.t3}}><span>📅 {b.dt}</span><span>🕐 {b.tm}</span></div>
    {b.st==="upcoming"&&<div style={{display:"flex",gap:8,marginTop:12}}><button style={{flex:1,padding:10,background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.18)",borderRadius:10,color:"#F87171",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:$.font}}>Cancel</button><button style={{flex:1,padding:10,background:`${$.ac}0A`,border:`1px solid ${$.ac}1A`,borderRadius:10,color:$.ac,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:$.font}}>Modify</button></div>}
  </Card>})}
</Shell>};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  pages/FriendsPage.jsx                                          ║
// ╚══════════════════════════════════════════════════════════════════╝

const FriendsPage = () => <Shell title="Friends">
  <Card style={{marginBottom:20,background:"linear-gradient(145deg,rgba(245,158,11,0.06),rgba(239,68,68,0.03))",border:"1px solid rgba(245,158,11,0.12)",padding:16}}>
    <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>🔥 Looking for players nearby</div>
    {LFG.map(p=>{const s=SPORTS[p.sp];return<div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${$.bd}`}}><div style={{width:40,height:40,borderRadius:"50%",background:$.surf,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,border:`1px solid ${$.bd}`}}>{p.av}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.name} {s.icon}</div><div style={{fontSize:11,color:$.t3}}>{p.msg} · {p.ven}</div></div><button style={{background:`linear-gradient(135deg,${$.ac},${$.ac2})`,border:"none",borderRadius:10,padding:"8px 18px",fontSize:11,fontWeight:700,color:$.bg,cursor:"pointer",fontFamily:$.font}}>Join</button></div>})}
  </Card>
  <h3 style={{fontSize:16,fontWeight:700,margin:"0 0 12px"}}>Your friends</h3>
  {FRIENDS.map(f=>{const s=f.sp?SPORTS[f.sp]:null;return<div key={f.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:`1px solid ${$.bd}`}}><div style={{position:"relative"}}><div style={{width:48,height:48,borderRadius:"50%",background:$.surf,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,border:`1px solid ${$.bd}`}}>{f.av}</div><div style={{position:"absolute",bottom:-1,right:-1,width:14,height:14,borderRadius:7,background:f.on?$.ac:"rgba(255,255,255,0.12)",border:`2.5px solid ${$.bg}`}}/></div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{f.name}</div><div style={{fontSize:11,color:$.t3,marginTop:2}}>{f.ven?`${s?.icon} at ${f.ven}`:f.on?"Online":"Offline"}</div></div>{f.on&&<button style={{background:`${$.ac}0A`,border:`1px solid ${$.ac}1A`,borderRadius:10,padding:"8px 18px",fontSize:11,fontWeight:600,color:$.ac,cursor:"pointer",fontFamily:$.font}}>Invite</button>}</div>})}
</Shell>;

// ╔══════════════════════════════════════════════════════════════════╗
// ║  App.jsx — Root component: routing + overlay state management   ║
// ╚══════════════════════════════════════════════════════════════════╝

export default function App() {
  const [scr,setScr] = useState("map");
  const [menu,setMenu] = useState(false);
  const [selV,setSelV] = useState(null);
  const [bookV,setBookV] = useState(null);
  const nav = id => { setSelV(null); setScr(id); };

  return (
    <div style={{width:"100%",maxWidth:430,margin:"0 auto",height:"100dvh",maxHeight:932,position:"relative",overflow:"hidden",fontFamily:$.font,color:$.t1,background:$.bg,borderRadius:24,boxShadow:"0 0 100px rgba(0,0,0,0.7)"}}>
      <GlobalCSS/>
      <StatusBar/>
      {scr==="map"      && <MapPage onVenue={v=>setSelV(v)} onMenu={()=>setMenu(true)}/>}
      {scr==="search"   && <SearchPage/>}
      {scr==="profile"  && <ProfilePage/>}
      {scr==="workouts" && <WorkoutsPage/>}
      {scr==="bookings" && <BookingsPage/>}
      {scr==="friends"  && <FriendsPage/>}
      {scr==="map" && selV && <VenueSheet venue={selV} onClose={()=>setSelV(null)} onBook={v=>{setSelV(null);setBookV(v)}}/>}
      {menu && <MenuOverlay onClose={()=>setMenu(false)} onNav={nav}/>}
      {bookV && <BookModal venue={bookV} onClose={()=>setBookV(null)}/>}
      <BottomNav active={scr} onNav={nav}/>
    </div>
  );
}
