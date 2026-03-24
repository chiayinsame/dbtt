import { MW, MH } from "../../data/mockData";

const BLDGS = [[60,240,28,18],[88,255,22,14],[250,340,32,20],[500,130,26,16],[528,122,18,22],[650,440,30,18],[340,500,24,14],[368,508,20,12],[770,330,28,16],[200,80,22,14],[420,280,26,18],[600,600,24,16],[140,450,20,12],[800,520,22,14],[310,160,18,10],[560,250,16,22],[680,140,20,16],[400,620,26,14],[72,480,24,16],[520,560,20,14],[380,380,18,12],[700,400,22,16],[260,600,24,18],[160,120,20,14]];

const LABELS = [
  [920,240,"WOODLANDS"],[1380,270,"YISHUN"],[1940,340,"SELETAR"],
  [490,470,"CHOA CHU KANG"],[1220,555,"ANG MO KIO"],[1980,555,"SENGKANG"],
  [450,780,"JURONG WEST"],[840,760,"BUKIT TIMAH"],[1295,790,"TOA PAYOH"],
  [1820,740,"HOUGANG"],[2480,840,"PASIR RIS"],[2280,960,"TAMPINES"],
  [660,1060,"CLEMENTI"],[1060,990,"QUEENSTOWN"],[1540,1060,"KALLANG"],
  [2080,1180,"BEDOK"],[2820,990,"CHANGI"],[1260,1360,"MARINE PARADE"],
];

// Simplified Singapore outline on a 3200×1800 canvas
const SG = "M 320,750 C 305,590 345,420 460,285 C 575,165 760,135 960,120 C 1080,112 1180,118 1340,130 C 1530,143 1720,160 1900,218 C 2080,270 2260,360 2450,480 C 2620,575 2840,680 2980,860 C 3060,975 3060,1110 2980,1240 C 2900,1360 2730,1450 2520,1500 C 2280,1550 1980,1570 1700,1580 C 1460,1590 1200,1590 980,1570 C 800,1550 640,1500 510,1420 C 380,1340 300,1210 285,1070 C 270,950 295,840 320,750 Z";

const MapTerrain = () => (
  <svg width={MW} height={MH} style={{position:"absolute",top:0,left:0}}>
    <defs>
      <clipPath id="sg"><path d={SG}/></clipPath>

      {/* Fine grid */}
      <pattern id="gd" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M50 0L0 0 0 50" fill="none" stroke="rgba(78,234,170,0.04)" strokeWidth="0.5"/>
      </pattern>

      {/* Urban terrain tile */}
      <pattern id="tt" x="0" y="0" width="900" height="700" patternUnits="userSpaceOnUse">
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
        <g fill="none" strokeDasharray="10 16" strokeLinecap="round">
          <path d="M0 400Q200 375 500 420Q700 450 900 400" stroke="rgba(60,120,170,0.18)" strokeWidth="1.5"/>
          <path d="M450 0Q425 180 460 350Q485 525 450 700" stroke="rgba(60,120,170,0.18)" strokeWidth="1.5"/>
        </g>
        <g fill="none" stroke="rgba(22,55,90,0.35)" strokeLinecap="round">
          <path d="M300 0Q315 160 290 320" strokeWidth="6"/>
          <path d="M0 290Q220 300 420 280" strokeWidth="6"/>
          <path d="M580 340Q720 330 900 355" strokeWidth="6"/>
          <path d="M0 500Q150 490 300 510" strokeWidth="5"/>
          <path d="M600 0Q590 120 610 260" strokeWidth="5"/>
          <path d="M320 500Q400 480 500 510" strokeWidth="5"/>
        </g>
        <g>
          {BLDGS.map(([bx,by,bw,bh],i) => (
            <g key={i}>
              <rect x={bx} y={by} width={bw} height={bh} rx="2" fill="rgba(16,32,58,0.7)" stroke="rgba(35,70,120,0.3)" strokeWidth="0.5"/>
              <rect x={bx+1} y={by+1} width={bw-2} height={3} rx="1" fill="rgba(40,90,140,0.15)"/>
            </g>
          ))}
        </g>
        <ellipse cx="80"  cy="630" rx="65" ry="38" fill="url(#wg)"/>
        <ellipse cx="810" cy="115" rx="55" ry="32" fill="url(#wg)"/>
        <ellipse cx="460" cy="665" rx="75" ry="28" fill="url(#wg)"/>
        <ellipse cx="320" cy="550" rx="35" ry="18" fill="url(#wg)"/>
        <ellipse cx="250" cy="440" rx="50" ry="32" fill="url(#pg)"/>
        <ellipse cx="660" cy="565" rx="58" ry="38" fill="url(#pg)"/>
        <ellipse cx="385" cy="145" rx="42" ry="28" fill="url(#pg)"/>
        <ellipse cx="725" cy="385" rx="38" ry="24" fill="url(#pg)"/>
        <ellipse cx="550" cy="480" rx="30" ry="18" fill="url(#pg)"/>
      </pattern>

      <radialGradient id="wg"><stop offset="0%" stopColor="rgba(0,180,216,0.3)"/><stop offset="100%" stopColor="transparent"/></radialGradient>
      <radialGradient id="pg"><stop offset="0%" stopColor="rgba(16,185,129,0.22)"/><stop offset="100%" stopColor="transparent"/></radialGradient>
    </defs>

    {/* Ocean background */}
    <rect width="100%" height="100%" fill="rgba(3,12,32,1)"/>
    <rect width="100%" height="100%" fill="url(#gd)" opacity="0.6"/>

    {/* Singapore land base */}
    <path d={SG} fill="rgba(8,22,46,1)"/>

    {/* Terrain tiles clipped to Singapore shape */}
    <rect width="100%" height="100%" fill="url(#tt)" clipPath="url(#sg)"/>
    <rect width="100%" height="100%" fill="url(#gd)" clipPath="url(#sg)"/>

    {/* Major expressways (PIE, CTE, AYE, ECP, BKE, SLE, TPE) */}
    <g fill="none" strokeLinecap="round" clipPath="url(#sg)">
      {/* PIE – Pan Island Expressway (E-W spine) */}
      <path d="M380,960 C620,925 900,898 1180,882 C1480,862 1780,858 2080,870 C2320,880 2580,896 2820,922" stroke="rgba(18,48,85,0.8)" strokeWidth="11"/>
      <path d="M380,960 C620,925 900,898 1180,882 C1480,862 1780,858 2080,870 C2320,880 2580,896 2820,922" stroke="rgba(35,80,140,0.55)" strokeWidth="6"/>
      {/* CTE – Central Expressway (N-S) */}
      <path d="M1480,210 C1462,420 1448,620 1452,842 C1456,1022 1480,1202 1500,1440" stroke="rgba(18,48,85,0.8)" strokeWidth="10"/>
      <path d="M1480,210 C1462,420 1448,620 1452,842 C1456,1022 1480,1202 1500,1440" stroke="rgba(35,80,140,0.55)" strokeWidth="5"/>
      {/* BKE – Bukit Timah Expressway */}
      <path d="M978,175 C998,380 1008,562 1002,762" stroke="rgba(18,48,85,0.7)" strokeWidth="8"/>
      <path d="M978,175 C998,380 1008,562 1002,762" stroke="rgba(35,80,140,0.45)" strokeWidth="4"/>
      {/* SLE – Seletar Expressway */}
      <path d="M1480,210 C1278,298 1080,422 958,582 C878,692 858,832 840,960" stroke="rgba(18,48,85,0.65)" strokeWidth="8"/>
      {/* TPE – Tampines Expressway */}
      <path d="M2100,870 C2260,762 2432,658 2622,598 C2782,548 2902,528 2980,524" stroke="rgba(18,48,85,0.65)" strokeWidth="7"/>
      {/* ECP – East Coast Parkway */}
      <path d="M1380,1490 C1700,1500 2020,1490 2320,1428 C2620,1360 2840,1218 2968,1078" stroke="rgba(18,48,85,0.65)" strokeWidth="8"/>
      {/* AYE – Ayer Rajah Expressway */}
      <path d="M378,960 C482,1102 644,1242 812,1362 C960,1462 1200,1492 1380,1490" stroke="rgba(18,48,85,0.65)" strokeWidth="8"/>
      {/* KJE – Kranji Expressway */}
      <path d="M348,758 C422,648 542,558 682,498 C842,428 1002,398 1180,392" stroke="rgba(18,48,85,0.55)" strokeWidth="6"/>
    </g>

    {/* Reservoirs and water bodies */}
    <g clipPath="url(#sg)">
      {/* MacRitchie */}
      <ellipse cx="1062" cy="728" rx="82" ry="52" fill="rgba(0,140,200,0.28)" stroke="rgba(0,165,230,0.4)" strokeWidth="1.2"/>
      {/* Upper Peirce */}
      <ellipse cx="1185" cy="565" rx="62" ry="40" fill="rgba(0,140,200,0.25)" stroke="rgba(0,165,230,0.35)" strokeWidth="1"/>
      {/* Punggol Reservoir */}
      <ellipse cx="2185" cy="518" rx="72" ry="44" fill="rgba(0,140,200,0.25)" stroke="rgba(0,165,230,0.35)" strokeWidth="1"/>
      {/* Jurong Lake */}
      <ellipse cx="538" cy="958" rx="72" ry="46" fill="rgba(0,140,200,0.25)" stroke="rgba(0,165,230,0.35)" strokeWidth="1"/>
      {/* Marina Reservoir */}
      <ellipse cx="1408" cy="1395" rx="95" ry="44" fill="rgba(0,140,200,0.28)" stroke="rgba(0,165,230,0.4)" strokeWidth="1.2"/>
    </g>

    {/* District labels */}
    <g fill="rgba(255,255,255,0.065)" fontFamily="'Outfit',sans-serif" fontSize="11" fontWeight="600" letterSpacing="3" clipPath="url(#sg)">
      {LABELS.map(([x,y,name],i) => <text key={i} x={x} y={y}>{name}</text>)}
    </g>

    {/* Coastline glow */}
    <path d={SG} fill="none" stroke="rgba(0,180,255,0.18)" strokeWidth="16"/>
    <path d={SG} fill="none" stroke="rgba(0,200,255,0.32)" strokeWidth="3"/>
    <path d={SG} fill="none" stroke="rgba(100,220,255,0.55)" strokeWidth="1"/>
  </svg>
);

export default MapTerrain;
