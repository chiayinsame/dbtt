import $ from "../../theme/tokens";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { IcMap, IcSearch, IcDumbbell, IcCalendar, IcUsers, IcUser, IcTarget, IcLocker } from "../ui/Icons";

const TABS = [
  {id:"map",      Ic:IcMap,      lb:"Home"},
  {id:"search",   Ic:IcSearch,   lb:"Search"},
  {id:"players",  Ic:IcTarget,   lb:"Find Game"},
  {id:"workouts", Ic:IcDumbbell, lb:"Workouts"},
  {id:"bookings", Ic:IcCalendar, lb:"Bookings"},
  {id:"locker",   Ic:IcLocker,   lb:"Locker"},
  {id:"friends",  Ic:IcUsers,    lb:"Friends"},
  {id:"profile",  Ic:IcUser,     lb:"Profile"},
];

const BottomNav = ({active, onNav, credits}) => {
  const { isDesktop } = useBreakpoint();

  if (isDesktop) {
    return (
      <div style={{width:220,height:"100%",background:$.bg2,borderRight:`1px solid ${$.bd}`,display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
        {/* Branding */}
        <div style={{padding:"28px 20px 22px",borderBottom:`1px solid ${$.bd}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(145deg,#E63946,#B91C2C)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(230,57,70,0.4)"}}><IcMap s={18} c="#fff"/></div>
            <div>
              <div style={{fontSize:15,fontWeight:900,color:$.t1,letterSpacing:-.3}}>ActiveSG</div>
              <div style={{fontSize:10,color:$.t3,marginTop:1}}>Sports Discovery</div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{flex:1,padding:"12px 10px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto"}}>
          {TABS.map(t => {
            const isActive = active === t.id;
            return (
              <button key={t.id} onClick={() => onNav(t.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:12,background:isActive?`${$.ac}12`:"transparent",border:isActive?`1px solid ${$.ac}20`:"1px solid transparent",color:isActive?$.ac:$.t2,cursor:"pointer",fontSize:14,fontWeight:isActive?700:500,fontFamily:$.font,textAlign:"left",width:"100%",transition:"all .15s"}}>
                <t.Ic s={18} c={isActive?$.ac:$.t2}/>
                <span>{t.lb}</span>
                {isActive && <div style={{marginLeft:"auto",width:6,height:6,borderRadius:3,background:$.ac,boxShadow:`0 0 8px ${$.ac}`}}/>}
              </button>
            );
          })}
        </nav>

        {/* Credits + Footer */}
        <div style={{padding:"16px 20px",borderTop:`1px solid ${$.bd}`}}>
          {credits !== undefined && (
            <div style={{display:"flex",alignItems:"center",gap:8,background:`${$.ac}12`,border:`1px solid ${$.ac}25`,borderRadius:12,padding:"10px 12px",marginBottom:12,cursor:"pointer"}} onClick={() => onNav("locker")}>
              <span style={{fontSize:18}}>🏅</span>
              <div>
                <div style={{fontSize:15,fontWeight:900,color:$.ac,lineHeight:1}}>{credits}</div>
                <div style={{fontSize:10,color:$.t3,marginTop:2}}>ActiveSG Credits</div>
              </div>
            </div>
          )}
          <div style={{fontSize:10,color:$.t3,fontWeight:600,letterSpacing:.5}}>ActiveSG © 2026</div>
        </div>
      </div>
    );
  }

  // Mobile bottom bar
  const mobileTabs = TABS.filter(t => ["map","search","players","locker","bookings","profile"].includes(t.id));
  return (
    <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:90,background:$.glass,backdropFilter:$.blur,borderTop:`1px solid ${$.bd}`,paddingBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-around",padding:"9px 0 3px"}}>
        {mobileTabs.map(t => (
          <button key={t.id} onClick={() => onNav(t.id)} style={{background:"none",border:"none",color:active===t.id?$.ac:$.t3,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"4px 14px",transition:"color .2s"}}>
            <t.Ic s={20} c={active===t.id?$.ac:$.t3}/>
            <span style={{fontSize:9,fontWeight:600,fontFamily:$.font}}>{t.lb}</span>
            {active===t.id && <div style={{width:5,height:5,borderRadius:3,background:$.ac,boxShadow:`0 0 8px ${$.ac}`,marginTop:1}}/>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
