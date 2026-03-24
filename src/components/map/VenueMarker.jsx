import { SPORTS } from "../../data/mockData";

const vstatus = v => { const r=v.players/v.max; return r>=.7?"hot":v.players>=3?"active":v.players>0?"quiet":"empty"; };

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

export default VenueMarker;
