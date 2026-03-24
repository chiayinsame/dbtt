import $ from "../../theme/tokens";
import { useBreakpoint } from "../../hooks/useBreakpoint";

const TABS = [
  {id:"map",     ic:"🏠", lb:"Home"},
  {id:"search",  ic:"🔍", lb:"Search"},
  {id:"workouts",ic:"🏋️", lb:"Workouts"},
  {id:"bookings",ic:"📅", lb:"Bookings"},
  {id:"friends", ic:"👥", lb:"Friends"},
  {id:"profile", ic:"👤", lb:"Profile"},
];

const BottomNav = ({active, onNav}) => {
  const { isDesktop } = useBreakpoint();

  if (isDesktop) {
    return (
      <div style={{width:220,height:"100%",background:$.bg2,borderRight:`1px solid ${$.bd}`,display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
        {/* Branding */}
        <div style={{padding:"28px 20px 22px",borderBottom:`1px solid ${$.bd}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(145deg,#E63946,#B91C2C)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 4px 12px rgba(230,57,70,0.4)"}}>🔥</div>
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
                <span style={{fontSize:18,lineHeight:1}}>{t.ic}</span>
                <span>{t.lb}</span>
                {isActive && <div style={{marginLeft:"auto",width:6,height:6,borderRadius:3,background:$.ac,boxShadow:`0 0 8px ${$.ac}`}}/>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{padding:"16px 20px",borderTop:`1px solid ${$.bd}`}}>
          <div style={{fontSize:10,color:$.t3,fontWeight:600,letterSpacing:.5}}>ActiveSG © 2026</div>
        </div>
      </div>
    );
  }

  // Mobile bottom bar
  const mobileTabs = TABS.filter(t => ["map","search","workouts","bookings","profile"].includes(t.id));
  return (
    <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:90,background:$.glass,backdropFilter:$.blur,borderTop:`1px solid ${$.bd}`,paddingBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-around",padding:"9px 0 3px"}}>
        {mobileTabs.map(t => (
          <button key={t.id} onClick={() => onNav(t.id)} style={{background:"none",border:"none",color:active===t.id?$.ac:$.t3,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",fontSize:20,padding:"4px 14px",transition:"color .2s"}}>
            <span>{t.ic}</span>
            <span style={{fontSize:9,fontWeight:600,fontFamily:$.font}}>{t.lb}</span>
            {active===t.id && <div style={{width:5,height:5,borderRadius:3,background:$.ac,boxShadow:`0 0 8px ${$.ac}`,marginTop:1}}/>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
