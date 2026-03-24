import { USER } from "../../data/mockData";
import $ from "../../theme/tokens";
import { USER_AVATAR } from "../../images/avatars";

const PlayerAvatar = ({pos,dragging}) => (
  <div style={{position:"absolute",left:pos.x,top:pos.y,transform:"translate(-50%,-50%)",zIndex:30,cursor:dragging?"grabbing":"grab",touchAction:"none",userSelect:"none"}}>
    <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:360,height:360,borderRadius:"50%",border:`2px solid rgba(78,234,170,0.15)`,background:"radial-gradient(circle, rgba(78,234,170,0.06) 0%, rgba(78,234,170,0.02) 40%, transparent 70%)",pointerEvents:"none"}}/>
    <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:90,height:90,borderRadius:"50%",border:"2px solid rgba(78,234,170,0.2)",animation:"a-pulse2 3s ease-in-out infinite",pointerEvents:"none"}}/>
    <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:64,height:64,borderRadius:"50%",background:"radial-gradient(circle, rgba(78,234,170,0.18) 0%, transparent 70%)",pointerEvents:"none"}}/>
    <div style={{width:52,height:52,borderRadius:"50%",position:"relative",boxShadow:`0 0 28px ${$.ac}55, 0 0 56px ${$.ac}18, 0 6px 20px rgba(0,0,0,0.5)`,border:`3px solid ${$.ac}`,"--gc":`${$.ac}40`,animation:"a-glow 3s ease-in-out infinite",overflow:"hidden",flexShrink:0}}>
      <img src={USER_AVATAR} alt={USER.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
      <div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"6px solid transparent",borderRight:"6px solid transparent",borderBottom:`10px solid ${$.ac}`}}/>
    </div>
  </div>
);

export default PlayerAvatar;
