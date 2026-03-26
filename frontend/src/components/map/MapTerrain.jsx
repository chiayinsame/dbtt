import { MW, MH } from "../../data/mockData";

const SG = "M 320,750 C 305,590 345,420 460,285 C 575,165 760,135 960,120 C 1080,112 1180,118 1340,130 C 1530,143 1720,160 1900,218 C 2080,270 2260,360 2450,480 C 2620,575 2840,680 2980,860 C 3060,975 3060,1110 2980,1240 C 2900,1360 2730,1450 2520,1500 C 2280,1550 1980,1570 1700,1580 C 1460,1590 1200,1590 980,1570 C 800,1550 640,1500 510,1420 C 380,1340 300,1210 285,1070 C 270,950 295,840 320,750 Z";

const LABELS = [
  [920,240,"WOODLANDS"],[1380,270,"YISHUN"],[1940,340,"SELETAR"],
  [490,470,"CHOA CHU KANG"],[1220,555,"ANG MO KIO"],[1980,555,"SENGKANG"],
  [450,780,"JURONG WEST"],[840,760,"BUKIT TIMAH"],[1295,790,"TOA PAYOH"],
  [1820,740,"HOUGANG"],[2480,840,"PASIR RIS"],[2280,960,"TAMPINES"],
  [660,1060,"CLEMENTI"],[1060,990,"QUEENSTOWN"],[1540,1060,"KALLANG"],
  [2080,1180,"BEDOK"],[2820,990,"CHANGI"],[1260,1360,"MARINE PARADE"],
  [1360,1185,"CBD"],[1060,1360,"HARBOURFRONT"],
];

// Urban building clusters — [x, y, width, height] per building
const ZONES = {
  cbd: [
    [1355,1162,20,48],[1382,1158,15,55],[1410,1150,12,65],[1440,1162,18,45],[1468,1168,14,52],[1495,1158,16,48],
    [1358,1218,22,40],[1388,1212,18,46],[1418,1205,14,54],[1448,1215,20,42],[1475,1208,16,50],
    [1362,1268,18,36],[1392,1262,22,42],[1422,1258,16,48],[1452,1268,14,38],[1480,1262,18,44],
    [1368,1312,16,34],[1398,1306,20,38],[1428,1302,24,32],[1458,1312,16,36],[1485,1308,12,40],
    [1325,1172,14,42],[1328,1228,16,38],[1332,1278,18,34],
    [1508,1175,10,44],[1512,1230,12,40],[1515,1280,10,36],
  ],
  toaPayoh: [
    [1252,782,16,22],[1275,778,14,25],[1298,785,18,20],[1322,780,14,24],[1345,787,16,22],
    [1255,810,18,20],[1280,806,16,24],[1304,803,14,22],[1328,810,18,20],[1352,806,14,24],
    [1257,835,16,22],[1282,832,18,20],[1306,828,14,24],[1330,835,16,22],[1355,830,18,20],
  ],
  angMoKio: [
    [1168,522,16,22],[1192,518,14,20],[1216,524,18,24],[1240,520,12,22],[1265,526,16,20],
    [1170,548,14,24],[1195,544,18,22],[1220,542,16,20],[1244,548,12,24],[1268,544,14,22],
    [1172,572,18,20],[1198,568,16,24],[1222,565,14,22],[1246,572,18,20],[1270,567,12,24],
    [1295,532,14,22],[1298,558,16,20],[1295,582,14,24],
  ],
  jurong: [
    [505,955,16,20],[530,951,18,22],[556,957,16,20],[582,953,12,24],[608,959,16,22],
    [507,980,18,22],[533,977,16,20],[558,975,14,24],[584,980,12,22],[610,977,16,20],
    [509,1005,16,24],[534,1001,18,22],[560,998,12,20],[586,1004,16,24],[612,1000,14,22],
    [635,958,14,20],[638,982,16,22],[636,1005,14,20],
  ],
  tampines: [
    [2222,920,16,20],[2248,916,18,22],[2274,922,16,20],[2300,918,12,24],[2325,924,16,22],
    [2224,948,18,22],[2250,945,16,20],[2276,942,14,24],[2302,948,12,22],[2327,944,16,20],
    [2226,973,16,24],[2252,970,18,22],[2278,967,12,20],[2304,973,16,24],[2330,968,14,22],
    [2352,924,14,20],[2355,948,16,22],[2353,972,14,20],
  ],
  woodlands: [
    [840,248,14,18],[862,244,18,20],[886,250,14,18],[910,246,16,20],[934,252,12,18],
    [842,270,18,18],[865,268,14,20],[890,266,16,18],[914,270,12,20],[938,267,14,18],
    [844,290,14,18],[868,288,18,20],[892,285,12,18],[916,290,16,18],[940,286,14,20],
  ],
  sengkang: [
    [1932,528,16,20],[1958,524,18,22],[1984,530,14,20],[2010,526,12,24],[2035,532,16,22],
    [1934,555,18,22],[1960,552,14,20],[1986,549,16,24],[2012,555,12,22],[2037,551,14,20],
    [1936,578,14,24],[1962,575,18,22],[1988,572,12,20],[2014,578,16,24],[2040,573,14,22],
  ],
  bedok: [
    [2018,1148,16,20],[2044,1144,18,22],[2070,1150,14,20],[2096,1146,12,24],[2122,1152,16,22],
    [2020,1175,18,22],[2046,1172,14,20],[2072,1169,16,24],[2098,1175,12,22],[2124,1171,14,20],
    [2022,1200,14,24],[2048,1197,18,22],[2074,1194,12,20],[2100,1200,16,24],[2126,1195,14,22],
  ],
  kallang: [
    [1680,1055,14,20],[1705,1051,16,22],[1730,1057,12,20],[1755,1053,14,24],[1780,1059,16,22],
    [1682,1080,16,22],[1708,1077,12,20],[1734,1075,14,24],[1760,1080,16,22],[1785,1076,12,20],
  ],
};

// MRT lines — real Singapore network, approximate coordinates
const MRT_LINES = [
  // NSL – North South Line (Red): forms a large reverse-C loop
  { id:"NSL", color:"#E8231A", glow:"rgba(232,35,26,0.4)", w:4.5,
    paths:[
      // Center spine: Marina Bay → Woodlands
      "M 1412,1392 C 1406,1318 1396,1258 1390,1198 C 1382,1140 1376,1095 1364,1045 C 1348,988 1338,932 1335,878 C 1318,792 1295,702 1282,628 C 1260,530 1246,456 1268,375 C 1280,318 1122,275 920,258 C 795,254 683,294 615,348 C 550,402 508,446 490,492 C 472,568 490,666 518,762 C 544,856 562,938 580,992",
      // West branch: Jurong East → Queenstown → Raffles (closes loop)
      "M 580,992 C 638,1040 718,1085 778,1096 C 895,1110 1038,1108 1198,1120 C 1292,1128 1372,1170 1390,1198",
    ]
  },
  // EWL – East West Line (Green): Boon Lay → Pasir Ris, with Expo branch
  { id:"EWL", color:"#009645", glow:"rgba(0,150,69,0.38)", w:4.5,
    paths:[
      // Boon Lay → Jurong East → City Hall → Tanah Merah
      "M 390,890 C 460,918 525,960 580,992 C 638,1040 718,1085 778,1096 C 892,1110 1038,1108 1198,1120 C 1290,1130 1358,1170 1392,1212 C 1428,1252 1502,1278 1602,1268 C 1720,1255 1845,1222 1958,1215 C 2052,1208 2108,1238 2125,1305",
      // Tanah Merah → Tampines → Pasir Ris
      "M 2125,1305 C 2102,1252 2088,1188 2105,1118 C 2125,1032 2192,985 2282,962 C 2382,938 2442,890 2482,858",
      // Expo / Changi Airport branch
      "M 2125,1305 C 2195,1325 2348,1362 2480,1382 C 2620,1400 2762,1402 2900,1392",
    ]
  },
  // NEL – North East Line (Purple): HarbourFront → Punggol
  { id:"NEL", color:"#9900AA", glow:"rgba(153,0,170,0.35)", w:4,
    paths:[
      "M 1362,1462 C 1292,1390 1268,1308 1288,1238 C 1308,1170 1365,1135 1380,1095 C 1396,1052 1392,998 1398,945 C 1406,880 1445,845 1495,815 C 1552,782 1625,758 1705,732 C 1788,705 1858,685 1892,685 C 1942,698 1955,758 1962,818 C 1978,752 2012,685 2048,618 C 2068,578 2082,502 2090,432",
    ]
  },
  // CCL – Circle Line (Orange): encircles CBD area
  { id:"CCL", color:"#FA9E0D", glow:"rgba(250,158,13,0.35)", w:4,
    paths:[
      "M 1412,1392 C 1488,1378 1558,1345 1622,1302 C 1702,1248 1822,1212 1942,1182 C 2075,1148 2178,1065 2195,968 C 2212,872 2165,798 2050,758 C 1955,725 1812,702 1688,678 C 1568,655 1448,645 1325,662 C 1200,680 1115,725 1065,808 C 1015,892 988,978 995,1065 C 1002,1148 1055,1252 1148,1322 C 1228,1382 1335,1408 1412,1392",
    ]
  },
  // DTL – Downtown Line (Blue): Bukit Panjang → Expo
  { id:"DTL", color:"#005EC4", glow:"rgba(0,94,196,0.32)", w:4,
    paths:[
      "M 675,448 C 745,508 808,588 855,682 C 900,775 978,858 1068,932 C 1150,1002 1248,1065 1355,1105 C 1415,1125 1478,1132 1538,1112 C 1598,1092 1658,1052 1715,1005 C 1778,955 1848,932 1958,938 C 2058,945 2165,965 2268,980 C 2378,994 2458,985 2540,965",
    ]
  },
  // TEL – Thomson-East Coast Line (Brown): Woodlands → east coast
  { id:"TEL", color:"#9D5B25", glow:"rgba(157,91,37,0.28)", w:3.5,
    paths:[
      "M 920,252 C 965,312 1008,392 1048,482 C 1088,568 1145,622 1222,662 C 1272,688 1318,718 1342,772 C 1368,825 1372,890 1372,955 C 1378,1022 1385,1085 1392,1148 C 1405,1225 1448,1295 1525,1368 C 1608,1445 1745,1502 1895,1518 C 2022,1532 2158,1525 2298,1510 C 2435,1495 2572,1465 2692,1425",
    ]
  },
];

// Major interchange stations
const INTERCHANGES = [
  [1390,1198],[580,992],[1380,1095],[1892,685],[778,1096],[2125,1305],[1392,1212],
];

// Regular MRT station dots
const STATIONS = [
  // NSL north
  [920,258],[1268,372],[1242,562],[1292,665],[1316,808],[1338,878],[1364,1045],[1412,1392],
  // NSL west
  [490,492],[618,762],[1038,1108],
  // EWL east
  [390,890],[2482,858],[2282,962],[2125,1305],[2900,1392],
  // NEL
  [1362,1462],[2090,432],[1962,818],[1498,815],
  // CCL
  [1065,808],[1688,678],[2195,968],[1148,1322],
  // DTL
  [675,448],[2540,965],[1355,1105],
  // TEL
  [920,252],[1222,662],[2692,1425],
];

const MapTerrain = () => (
  <svg width={MW} height={MH} style={{position:"absolute",top:0,left:0}}>
    <defs>
      <clipPath id="sg"><path d={SG}/></clipPath>
      <pattern id="gd" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M50 0L0 0 0 50" fill="none" stroke="rgba(78,234,170,0.035)" strokeWidth="0.5"/>
      </pattern>
      <radialGradient id="cbd_light" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(55,110,195,0.14)"/>
        <stop offset="100%" stopColor="transparent"/>
      </radialGradient>
      <radialGradient id="water_r" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(0,130,195,0.38)"/>
        <stop offset="100%" stopColor="rgba(0,115,180,0.18)"/>
      </radialGradient>
    </defs>

    {/* Deep ocean */}
    <rect width="100%" height="100%" fill="rgba(2,8,24,1)"/>
    <rect width="100%" height="100%" fill="url(#gd)" opacity="0.6"/>

    {/* Johor / Malaysia landmass hint (north) */}
    <rect x="0" y="0" width={MW} height="75" fill="rgba(6,14,32,0.98)"/>
    <path d="M 0,78 C 350,68 720,74 1100,72 C 1500,70 1900,65 2300,70 C 2700,74 3000,72 3200,75 L 3200,0 L 0,0 Z" fill="rgba(7,17,38,0.95)"/>
    <path d="M 0,78 C 350,68 720,74 1100,72 C 1500,70 1900,65 2300,70 C 2700,74 3000,72 3200,75" fill="none" stroke="rgba(0,188,255,0.12)" strokeWidth="1.5"/>

    {/* Singapore island base */}
    <path d={SG} fill="rgba(8,20,44,1)"/>

    {/* ── Nature reserves & greenery ── */}
    <g clipPath="url(#sg)">
      {/* Central Catchment Nature Reserve (largest green patch) */}
      <ellipse cx="1285" cy="558" rx="205" ry="148" fill="rgba(8,52,20,0.62)"/>
      <ellipse cx="1252" cy="542" rx="145" ry="105" fill="rgba(10,62,24,0.52)"/>
      <ellipse cx="1225" cy="528" rx="90"  ry="65"  fill="rgba(12,70,26,0.42)"/>
      {/* Bukit Timah Nature Reserve */}
      <ellipse cx="955"  cy="735" rx="92"  ry="70"  fill="rgba(8,52,20,0.52)"/>
      <ellipse cx="952"  cy="732" rx="58"  ry="44"  fill="rgba(11,62,24,0.42)"/>
      {/* Western Catchment / Tengah */}
      <ellipse cx="672"  cy="638" rx="78"  ry="58"  fill="rgba(8,50,18,0.42)"/>
      {/* Mandai / Lower Seletar area */}
      <ellipse cx="1055" cy="375" rx="68"  ry="48"  fill="rgba(8,48,18,0.38)"/>
      {/* Pulau Ubin / northeast greens */}
      <ellipse cx="2200" cy="262" rx="88"  ry="42"  fill="rgba(7,40,16,0.48)"/>
      {/* Changi / Pasir Ris parks */}
      <ellipse cx="2628" cy="855" rx="75"  ry="48"  fill="rgba(8,44,18,0.35)"/>
      <ellipse cx="2865" cy="985" rx="55"  ry="35"  fill="rgba(7,40,15,0.3)"/>
      {/* Kent Ridge / Labrador */}
      <ellipse cx="1052" cy="1298" rx="62" ry="42"  fill="rgba(8,46,18,0.35)"/>
    </g>

    {/* ── Reservoirs & water ── */}
    <g clipPath="url(#sg)">
      {/* Upper Seletar Reservoir */}
      <ellipse cx="1538" cy="368" rx="68" ry="38"  fill="url(#water_r)" stroke="rgba(0,165,225,0.45)" strokeWidth="1"/>
      {/* Lower Seletar Reservoir */}
      <ellipse cx="1688" cy="428" rx="75" ry="40"  fill="url(#water_r)" stroke="rgba(0,162,222,0.42)" strokeWidth="1"/>
      {/* Upper Peirce Reservoir */}
      <ellipse cx="1158" cy="522" rx="58" ry="35"  fill="url(#water_r)" stroke="rgba(0,162,222,0.48)" strokeWidth="1"/>
      {/* MacRitchie Reservoir */}
      <ellipse cx="1282" cy="668" rx="55" ry="34"  fill="url(#water_r)" stroke="rgba(0,165,225,0.45)" strokeWidth="1"/>
      {/* Kranji Reservoir */}
      <ellipse cx="722"  cy="345" rx="58" ry="34"  fill="url(#water_r)" stroke="rgba(0,158,218,0.4)"  strokeWidth="1"/>
      {/* Bedok Reservoir */}
      <ellipse cx="2188" cy="1082" rx="65" ry="36" fill="url(#water_r)" stroke="rgba(0,158,218,0.4)"  strokeWidth="1"/>
      {/* Marina Reservoir / Marina Bay */}
      <path d="M 1328,1318 C 1352,1292 1415,1282 1468,1295 C 1515,1308 1542,1338 1530,1368 C 1518,1398 1472,1412 1420,1405 C 1370,1398 1325,1372 1328,1318 Z"
        fill="rgba(0,140,205,0.42)" stroke="rgba(0,178,238,0.58)" strokeWidth="1.5"/>
      {/* Jurong Lake */}
      <ellipse cx="538"  cy="958" rx="68" ry="42"  fill="url(#water_r)" stroke="rgba(0,158,218,0.38)" strokeWidth="1"/>
    </g>

    {/* Fine grid on land */}
    <rect width="100%" height="100%" fill="url(#gd)" clipPath="url(#sg)"/>

    {/* ── Building clusters ── */}
    <g clipPath="url(#sg)">
      {Object.values(ZONES).map((blds, zi) =>
        blds.map(([bx,by,bw,bh], i) => (
          <g key={`${zi}_${i}`}>
            <rect x={bx} y={by} width={bw} height={bh} rx="1.5" fill="rgba(15,32,62,0.88)" stroke="rgba(38,78,135,0.38)" strokeWidth="0.5"/>
            <rect x={bx+1} y={by+1} width={bw-2} height={2} rx="1" fill="rgba(48,98,162,0.18)" stroke="none"/>
          </g>
        ))
      )}
    </g>

    {/* CBD ambient glow */}
    <ellipse cx="1415" cy="1238" rx="215" ry="165" fill="url(#cbd_light)" clipPath="url(#sg)"/>

    {/* ── Road network ── */}
    <g fill="none" strokeLinecap="round" clipPath="url(#sg)">
      {/* Local street grid EW */}
      {[210,280,350,420,492,562,632,702,772,842,920,990,1062,1132,1202,1274,1344,1416,1486,1554].map((y,i) => (
        <path key={`ew${i}`}
          d={`M 300,${y} C 800,${y+(i%3===0?3:-2)} 1400,${y+(i%2===0?-2:4)} 2000,${y+(i%3===1?3:-1)} C 2400,${y+(i%2===0?-3:2)} 2950,${y}`}
          stroke="rgba(18,48,90,0.42)" strokeWidth="2"/>
      ))}
      {/* Local street grid NS */}
      {[390,462,534,606,678,750,822,894,966,1038,1110,1182,1254,1326,1398,1470,1542,1614,1686,1758,1830,1902,1974,2046,2118,2190,2262,2334,2406,2478,2550,2622,2694,2766,2838,2910].map((x,i) => (
        <path key={`ns${i}`}
          d={`M ${x},160 C ${x+(i%3===0?3:-2)},500 ${x+(i%2===0?-3:2)},850 ${x+(i%3===1?2:-1)},1200 C ${x+(i%2===0?3:-2)},1380 ${x},1580`}
          stroke="rgba(18,48,90,0.42)" strokeWidth="2"/>
      ))}
      {/* Arterial EW */}
      {[295,445,595,725,1065,1205,1345,1485].map((y,i) => (
        <path key={`ae${i}`}
          d={`M 300,${y} C 800,${y+(i%2===0?-3:4)} 1400,${y+(i%2===0?5:-3)} 2000,${y+(i%2===0?-4:3)} C 2400,${y+(i%2===0?3:-2)} 2950,${y}`}
          stroke="rgba(28,72,132,0.60)" strokeWidth="4.5"/>
      ))}
      {/* Arterial NS */}
      {[678,894,1110,1326,1614,1830,2118,2334].map((x,i) => (
        <path key={`an${i}`}
          d={`M ${x},160 C ${x+(i%2===0?4:-3)},500 ${x+(i%2===0?-4:3)},850 ${x+(i%2===0?5:-4)},1200 C ${x+(i%2===0?-3:4)},1380 ${x},1580`}
          stroke="rgba(28,72,132,0.60)" strokeWidth="4.5"/>
      ))}
      {/* Expressways */}
      {[
        ["M380,960 C620,925 900,898 1180,882 C1480,862 1780,858 2080,870 C2320,880 2580,896 2820,922","PIE",12,6],
        ["M1480,210 C1462,420 1448,620 1452,842 C1456,1022 1480,1202 1500,1440","CTE",11,5.5],
        ["M978,175 C998,380 1008,562 1002,762","BKE",9,4.5],
        ["M1480,210 C1278,298 1080,422 958,582 C878,692 858,832 840,960","SLE",9,4.5],
        ["M2100,870 C2260,762 2432,658 2622,598 C2782,548 2902,528 2980,524","TPE",8,4],
        ["M1380,1490 C1700,1500 2020,1490 2320,1428 C2620,1360 2840,1218 2968,1078","ECP",9,4.5],
        ["M378,960 C482,1102 644,1242 812,1362 C960,1462 1200,1492 1380,1490","AYE",9,4.5],
        ["M348,758 C422,648 542,558 682,498 C842,428 1002,398 1180,392","KJE",7,3.5],
      ].map(([d,k,wo,wi]) => (
        <g key={k}>
          <path d={d} stroke="rgba(12,38,78,0.92)" strokeWidth={wo}/>
          <path d={d} stroke="rgba(42,98,180,0.68)" strokeWidth={wi}/>
          <path d={d} stroke="rgba(62,135,225,0.15)" strokeWidth={1.5} strokeDasharray="14 16"/>
        </g>
      ))}
    </g>

    {/* ── MRT Lines ── */}
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#sg)">
      {MRT_LINES.map(line =>
        line.paths.map((d, pi) => (
          <g key={`${line.id}_${pi}`}>
            <path d={d} stroke={line.glow}   strokeWidth={line.w + 6} opacity="0.7"/>
            <path d={d} stroke="rgba(0,0,0,0.55)" strokeWidth={line.w + 2.5}/>
            <path d={d} stroke={line.color}  strokeWidth={line.w} opacity="0.95"/>
          </g>
        ))
      )}
    </g>

    {/* ── MRT Stations ── */}
    <g clipPath="url(#sg)">
      {STATIONS.map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={3.5}
          fill="rgba(195,215,255,0.6)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
      ))}
      {INTERCHANGES.map(([cx,cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={8}   fill="rgba(0,0,0,0.0)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
          <circle cx={cx} cy={cy} r={4.5} fill="rgba(255,255,255,0.9)"/>
        </g>
      ))}
    </g>

    {/* ── Sentosa Island ── */}
    <path d="M 1298,1622 C 1345,1608 1425,1602 1515,1606 C 1588,1610 1648,1625 1652,1642 C 1656,1656 1592,1670 1490,1674 C 1378,1678 1282,1662 1298,1622 Z"
      fill="rgba(7,18,42,0.96)" stroke="rgba(0,188,255,0.28)" strokeWidth="1"/>
    <path d="M 1380,1608 C 1420,1596 1470,1596 1510,1608" fill="none" stroke="rgba(0,188,255,0.18)" strokeWidth="0.8" strokeDasharray="8 6"/>

    {/* ── MRT Legend ── */}
    <g transform="translate(2730,1700)" fontFamily="'Outfit',sans-serif" fontWeight="700">
      {[["NSL","#E8231A"],["EWL","#009645"],["NEL","#9900AA"],["CCL","#FA9E0D"],["DTL","#005EC4"],["TEL","#9D5B25"]].map(([name,color],i) => (
        <g key={name} transform={`translate(${(i%3)*88},${i<3?0:18})`}>
          <rect x="0" y="-7" width="18" height="5" rx="2.5" fill={color} opacity="0.85"/>
          <text x="22" y="-2" fill="rgba(255,255,255,0.45)" fontSize="8" letterSpacing="0.5">{name}</text>
        </g>
      ))}
    </g>

    {/* ── District labels ── */}
    <g fill="rgba(255,255,255,0.055)" fontFamily="'Outfit',sans-serif" fontSize="11" fontWeight="600" letterSpacing="3" clipPath="url(#sg)">
      {LABELS.map(([x,y,name],i) => <text key={i} x={x} y={y}>{name}</text>)}
    </g>

    {/* ── Coastline glow ── */}
    <path d={SG} fill="none" stroke="rgba(0,175,255,0.14)" strokeWidth="20"/>
    <path d={SG} fill="none" stroke="rgba(0,198,255,0.28)" strokeWidth="3"/>
    <path d={SG} fill="none" stroke="rgba(95,218,255,0.52)" strokeWidth="1"/>
  </svg>
);

export default MapTerrain;
