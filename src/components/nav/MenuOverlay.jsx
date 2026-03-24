import $ from "../../theme/tokens";

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

export default MenuOverlay;
