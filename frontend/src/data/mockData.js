export const SPORTS = {
  basketball:{icon:"🏀",label:"Basketball",hue:"#F5A623",alt:"#E8930C"},
  badminton: {icon:"🏸",label:"Badminton", hue:"#00D68F",alt:"#0BB87A"},
  swimming:  {icon:"🏊",label:"Swimming",  hue:"#00B4D8",alt:"#0096B7"},
  football:  {icon:"⚽",label:"Football",  hue:"#A855F7",alt:"#9333EA"},
  tennis:    {icon:"🎾",label:"Tennis",    hue:"#F43F5E",alt:"#E11D48"},
  volleyball:{icon:"🏐",label:"Volleyball",hue:"#F97316",alt:"#EA580C"},
};

export const VENUES = [
  {id:1, name:"Kallang Wave Mall",sport:"basketball",x:1750,y:1120,players:5,max:6,courts:3,open:1,equip:[{n:"Basketball",q:4},{n:"Towel",q:8},{n:"Water Bottle",q:12}]},
  {id:2, name:"Toa Payoh Sports Hall",sport:"badminton",x:1350,y:820,players:8,max:12,courts:6,open:2,equip:[{n:"Racket",q:6},{n:"Shuttlecock",q:20},{n:"Towel",q:5}]},
  {id:3, name:"Jurong East Swimming",sport:"swimming",x:560,y:1000,players:15,max:50,courts:4,open:4,equip:[{n:"Goggles",q:10},{n:"Kickboard",q:8},{n:"Towel",q:15}]},
  {id:4, name:"Bishan ActiveSG Stadium",sport:"football",x:1280,y:660,players:0,max:22,courts:2,open:2,equip:[{n:"Football",q:5},{n:"Shin Guards",q:10},{n:"Bib",q:20}]},
  {id:5, name:"Clementi Sports Centre",sport:"tennis",x:720,y:1100,players:3,max:4,courts:4,open:1,equip:[{n:"Tennis Racket",q:4},{n:"Tennis Ball",q:12},{n:"Towel",q:6}]},
  {id:6, name:"Pasir Ris Sports Centre",sport:"volleyball",x:2580,y:920,players:10,max:12,courts:2,open:0,equip:[{n:"Volleyball",q:3},{n:"Knee Pads",q:6}]},
  {id:7, name:"Yio Chu Kang Swimming",sport:"swimming",x:1460,y:490,players:2,max:40,courts:3,open:3,equip:[{n:"Goggles",q:8},{n:"Float",q:5},{n:"Towel",q:10}]},
  {id:8, name:"Hougang Sports Centre",sport:"basketball",x:1860,y:700,players:4,max:10,courts:2,open:1,equip:[{n:"Basketball",q:3},{n:"Wristband",q:8}]},
  {id:9, name:"Tampines Hub",sport:"badminton",x:2440,y:980,players:6,max:8,courts:8,open:3,equip:[{n:"Racket",q:10},{n:"Shuttlecock",q:30},{n:"Grip Tape",q:15}]},
  {id:10,name:"Choa Chu Kang SC",sport:"football",x:580,y:540,players:11,max:22,courts:1,open:0,equip:[{n:"Football",q:4},{n:"Bib",q:20},{n:"Cones",q:12}]},
  {id:11,name:"Woodlands Swimming",sport:"swimming",x:1050,y:300,players:0,max:30,courts:2,open:2,equip:[{n:"Goggles",q:6},{n:"Kickboard",q:4}]},
  {id:12,name:"Sengkang Sports Centre",sport:"tennis",x:2080,y:600,players:2,max:4,courts:3,open:2,equip:[{n:"Tennis Racket",q:6},{n:"Tennis Ball",q:18}]},
  {id:13,name:"Novena Sports Centre",sport:"basketball",x:1300,y:780,players:7,max:10,courts:3,open:2,equip:[{n:"Basketball",q:5},{n:"Towel",q:10}]},
  {id:14,name:"Dakota ActiveSG",sport:"badminton",x:1560,y:900,players:5,max:8,courts:4,open:2,equip:[{n:"Racket",q:8},{n:"Shuttlecock",q:24}]},
  {id:15,name:"Buona Vista SC",sport:"swimming",x:860,y:1040,players:12,max:40,courts:3,open:3,equip:[{n:"Goggles",q:8},{n:"Kickboard",q:6}]},
  {id:16,name:"Geylang ActiveSG",sport:"football",x:1620,y:1060,players:9,max:22,courts:2,open:1,equip:[{n:"Football",q:4},{n:"Bib",q:18}]},
  {id:17,name:"Bukit Merah SC",sport:"volleyball",x:1100,y:1200,players:6,max:12,courts:2,open:1,equip:[{n:"Volleyball",q:4},{n:"Knee Pads",q:8}]},
  {id:18,name:"Orchard ActiveSG",sport:"tennis",x:1165,y:1000,players:4,max:4,courts:5,open:0,equip:[{n:"Tennis Racket",q:6},{n:"Tennis Ball",q:20}]},
];

export const vstatus = v => { const r=v.players/v.max; return r>=.7?"hot":v.players>=3?"active":v.players>0?"quiet":"empty"; };
export const USER = {name:"Alex Tan",level:43,xp:7200,xpMax:10000,avatar:"🏃",gamesPlayed:156,hoursActive:312,friendCount:28,streak:7,activeSGCredits:500};
export const USER_ID = "U0001";

export const FRIENDS = [
  {id:1,name:"Sarah Lim",av:"👩",on:true,ven:"Kallang Wave Mall",sp:"basketball"},
  {id:2,name:"Wei Ming",av:"👨",on:true,ven:"Toa Payoh Sports Hall",sp:"badminton"},
  {id:3,name:"Priya K.",av:"👩‍🦰",on:false,ven:null,sp:null},
  {id:4,name:"Jun Hao",av:"🧑",on:true,ven:"Orchard ActiveSG",sp:"tennis"},
  {id:5,name:"Aisha N.",av:"🧕",on:true,ven:"Tampines Hub",sp:"badminton"},
  {id:6,name:"David Chen",av:"👨‍🦲",on:true,ven:"Orchard ActiveSG",sp:"tennis"},
  {id:7,name:"Mei Ling",av:"👧",on:true,ven:"Clementi Sports Centre",sp:"tennis"},
  {id:8,name:"Ravi S.",av:"👨‍🦱",on:true,ven:"Orchard ActiveSG",sp:"tennis"},
];
export const LFG = [
  {id:101,name:"Marcus T.",av:"🧔",sp:"basketball",ven:"Kallang Wave Mall",msg:"1 more for 3v3"},
  {id:102,name:"Zhi Ying",av:"👩‍🦱",sp:"badminton",ven:"Toa Payoh",msg:"Doubles partner"},
  {id:103,name:"Ahmad R.",av:"🧑‍🦱",sp:"football",ven:"Choa Chu Kang",msg:"5-a-side team"},
];
export const BOOK = [
  {id:1,ven:"Kallang Wave Mall",sp:"basketball",ct:"Court 2",dt:"2026-03-25",tm:"18:00–19:00",st:"upcoming"},
  {id:2,ven:"Toa Payoh Sports Hall",sp:"badminton",ct:"Court 5",dt:"2026-03-27",tm:"10:00–11:00",st:"upcoming"},
  {id:3,ven:"Clementi SC",sp:"tennis",ct:"Court 1",dt:"2026-03-29",tm:"16:00–17:30",st:"upcoming"},
  {id:4,ven:"Jurong East Swimming",sp:"swimming",ct:"Lane 3",dt:"2026-03-20",tm:"07:00–08:00",st:"completed"},
  {id:5,ven:"Bishan Stadium",sp:"football",ct:"Field A",dt:"2026-03-18",tm:"19:00–21:00",st:"completed"},
  {id:6,ven:"Pasir Ris SC",sp:"volleyball",ct:"Court 1",dt:"2026-03-15",tm:"14:00–16:00",st:"cancelled"},
];
export const WORK = [
  {id:1,sp:"basketball",ven:"Kallang Wave Mall",dt:"2026-03-23",dur:"1h 30m",cal:450},
  {id:2,sp:"badminton",ven:"Toa Payoh",dt:"2026-03-21",dur:"1h",cal:320},
  {id:3,sp:"swimming",ven:"Jurong East",dt:"2026-03-20",dur:"45m",cal:380},
  {id:4,sp:"football",ven:"Bishan Stadium",dt:"2026-03-18",dur:"2h",cal:680},
  {id:5,sp:"tennis",ven:"Clementi SC",dt:"2026-03-16",dur:"1h 15m",cal:410},
  {id:6,sp:"basketball",ven:"Hougang SC",dt:"2026-03-14",dur:"1h",cal:300},
];
export const WKCH = [{d:"M",m:90},{d:"T",m:0},{d:"W",m:60},{d:"T",m:45},{d:"F",m:0},{d:"S",m:120},{d:"S",m:75}];
export const CATS = [{name:"Racket Sports",ic:"🏸",cl:"#00D68F",n:24},{name:"Team Sports",ic:"⚽",cl:"#A855F7",n:18},{name:"Water Sports",ic:"🏊",cl:"#00B4D8",n:12},{name:"Fitness",ic:"💪",cl:"#F43F5E",n:31}];
// Popular times data: hourly busyness (0-100) per day, keyed by venue id
const BASE_TIMES = {
  indoor:  [0,0,0,0,0,0,10,25,40,50,55,65,70,60,45,40,55,75,85,70,50,30,15,5],
  outdoor: [0,0,0,0,0,5,20,45,60,55,45,35,30,25,30,40,50,65,80,75,55,35,15,5],
  pool:    [0,0,0,0,0,0,15,40,55,60,50,40,35,30,35,45,55,65,70,55,40,25,10,0],
};
const jitter = (arr,seed) => arr.map((v,i)=>{const j=((seed*7+i*13)%21)-10; return Math.max(0,Math.min(100,v+j));});
const dayScale = [0.9,1.0,0.95,1.05,1.1,1.3,1.2]; // Mon-Sun multiplier

export const POPULAR_TIMES = Object.fromEntries(VENUES.map(v=>{
  const type = v.sport==="swimming"?"pool":["football","volleyball"].includes(v.sport)?"outdoor":"indoor";
  const base = BASE_TIMES[type];
  const days = ["MON","TUE","WED","THU","FRI","SAT","SUN"].map((label,di)=>({
    label,
    hours: jitter(base,v.id*10+di).map(h=>Math.round(Math.min(100,h*dayScale[di])))
  }));
  return [v.id, days];
}));

export const MW = 3200;
export const MH = 1800;

export const LEADERBOARD_STEPS = [
  {rank:1,  name:"Wei Ming",   av:"👨",   steps:87420, isYou:false, delta:2},
  {rank:2,  name:"Sarah Lim",  av:"👩",   steps:76850, isYou:false, delta:1},
  {rank:3,  name:"Priya K.",   av:"👩‍🦰", steps:71200, isYou:false, delta:-1},
  {rank:4,  name:"Alex Tan",   av:"🏃",   steps:68900, isYou:true,  delta:0},
  {rank:5,  name:"Jun Hao",    av:"🧑",   steps:62100, isYou:false, delta:3},
  {rank:6,  name:"Aisha N.",   av:"🧕",   steps:58700, isYou:false, delta:-2},
  {rank:7,  name:"David Chen", av:"👨‍🦲", steps:51200, isYou:false, delta:-1},
  {rank:8,  name:"Mei Ling",   av:"👧",   steps:43900, isYou:false, delta:1},
  {rank:9,  name:"Ravi S.",    av:"👨‍🦱", steps:38400, isYou:false, delta:0},
  {rank:10, name:"Marcus T.",  av:"🧔",   steps:29100, isYou:false, delta:-1},
];

export const LEADERBOARD_ACTIVITY = [
  {rank:1,  name:"Aisha N.",   av:"🧕",   score:1240, bk:8, rent:4, sess:12, isYou:false, delta:1},
  {rank:2,  name:"Sarah Lim",  av:"👩",   score:1180, bk:7, rent:6, sess:10, isYou:false, delta:-1},
  {rank:3,  name:"Alex Tan",   av:"🏃",   score:980,  bk:6, rent:2, sess:9,  isYou:true,  delta:2},
  {rank:4,  name:"Wei Ming",   av:"👨",   score:920,  bk:5, rent:5, sess:8,  isYou:false, delta:-1},
  {rank:5,  name:"Jun Hao",    av:"🧑",   score:860,  bk:6, rent:1, sess:8,  isYou:false, delta:1},
  {rank:6,  name:"Marcus T.",  av:"🧔",   score:740,  bk:4, rent:3, sess:7,  isYou:false, delta:0},
  {rank:7,  name:"David Chen", av:"👨‍🦲", score:680,  bk:3, rent:4, sess:6,  isYou:false, delta:1},
  {rank:8,  name:"Mei Ling",   av:"👧",   score:590,  bk:4, rent:0, sess:6,  isYou:false, delta:-2},
  {rank:9,  name:"Priya K.",   av:"👩‍🦰", score:510,  bk:2, rent:2, sess:5,  isYou:false, delta:0},
  {rank:10, name:"Ravi S.",    av:"👨‍🦱", score:430,  bk:3, rent:0, sess:4,  isYou:false, delta:-1},
];
