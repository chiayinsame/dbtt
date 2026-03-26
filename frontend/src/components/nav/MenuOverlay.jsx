import $ from "../../theme/tokens";
import { IcGrad, IcPlay, IcUsers, IcX } from "../ui/Icons";

const MenuOverlay = ({onClose,onNav}) => {
  const items=[
    {id:"classes", Ic:IcGrad, lb:"Classes"},
    {id:"lessons", Ic:IcPlay, lb:"Lessons"},
    {id:"friends", Ic:IcUsers,lb:"Friends"},
  ];
  const pos=[
    {top:"40%",left:"18%"},
    {top:"40%",right:"18%"},
    {top:"56%",left:"50%",transform:"translateX(-50%)"},
  ];
  return <div style={{position:"absolute",inset:0,zIndex:95,background:`linear-gradient(180deg,rgba(8,20,38,0.96),rgba(4,10,20,0.98))`,backdropFilter:"blur(32px)",animation:"a-fade .2s",fontFamily:$.font}}>
    {items.map((it,i)=><button key={it.id} onClick={()=>{onNav(it.id);onClose()}} style={{position:"absolute",...pos[i],background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:10,color:$.t1,animation:`a-pop .3s cubic-bezier(.34,1.56,.64,1) ${i*.05}s both`}}>
      <div style={{width:74,height:74,borderRadius:"50%",background:"rgba(255,255,255,0.03)",border:`2px solid ${$.ac}25`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 24px ${$.ac}06`,transition:"all .2s"}}><it.Ic s={30} c={$.ac}/></div>
      <span style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:`${$.ac}BB`}}>{it.lb}</span>
    </button>)}
    <div style={{position:"absolute",bottom:92,left:"50%",transform:"translateX(-50%)"}}>
      <button onClick={onClose} style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,0.05)",border:`2px solid ${$.bl}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:$.t1}}><IcX s={20} c={$.t1}/></button>
    </div>
  </div>;
};

export default MenuOverlay;
