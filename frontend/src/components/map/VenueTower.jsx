import { SPORTS, vstatus, FRIENDS } from "../../data/mockData";
import { FRIEND_AVATARS } from "../../images/avatars";
import $ from "../../theme/tokens";

const VenueTower = ({venue:v,onClick,pp}) => {
  const friendsHere = FRIENDS.filter(f => f.on && f.ven === v.name);
  const sp=SPORTS[v.sport], st=vstatus(v), c=sp.hue,
    need=v.max-v.players,
    hot=st==="hot", act=st==="active", alive=st!=="empty",
    h=hot?80:act?64:st==="quiet"?48:34,
    dist=Math.hypot(v.x-pp.x,v.y-pp.y), near=dist<200;
  const segs = hot?5:act?4:alive?3:2;
  return (
    <div onClick={()=>onClick(v)} style={{position:"absolute",left:v.x,top:v.y,transform:"translate(-50%,-100%)",cursor:"pointer",zIndex:hot?22:act?18:alive?14:8,filter:near?"none":"brightness(0.5) saturate(0.35)",transition:"filter 0.6s ease"}}>
      {hot && <div style={{position:"absolute",bottom:-20,left:"50%",transform:"translateX(-50%)",width:140,height:50,background:`radial-gradient(ellipse,${c}35 0%,${c}15 40%,transparent 70%)`,borderRadius:"50%",animation:"a-heatmap 2.5s ease-in-out infinite",pointerEvents:"none"}}/>}
      {alive && <div style={{position:"absolute",bottom:-8,left:"50%",transform:"translateX(-50%)",width:90,height:30,pointerEvents:"none"}}>
        <div style={{position:"absolute",inset:0,border:`1.5px solid ${c}`,borderRadius:"50%",opacity:0,animation:"a-ring 3s ease-out infinite"}}/>
        {(hot||act) && <div style={{position:"absolute",inset:0,border:`1px solid ${c}`,borderRadius:"50%",opacity:0,animation:"a-ring 3s ease-out 1s infinite"}}/>}
        {hot && <div style={{position:"absolute",inset:0,border:`1px solid ${c}80`,borderRadius:"50%",opacity:0,animation:"a-ring2 2s ease-out .4s infinite"}}/>}
      </div>}
      <div style={{position:"absolute",bottom:-12,left:"50%",transform:"translateX(-50%)",width:hot?110:act?80:60,height:hot?40:act?28:20,background:`radial-gradient(ellipse,${c}${hot?"60":"35"} 0%,transparent 70%)`,borderRadius:"50%",animation:alive?"a-pulse 2.5s ease-in-out infinite":"none",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-5,left:"50%",transform:"translateX(-50%)",width:62,height:20,borderRadius:"50%",background:`${c}10`,border:`2px solid ${c}${alive?"50":"20"}`,boxShadow:alive?`inset 0 0 10px ${c}20, 0 0 15px ${c}20`:"none"}}/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",height:h,justifyContent:"flex-end",position:"relative"}}>
        {Array.from({length:segs}).map((_,i) => {
          const segW = 24 - i*1.5;
          const segH = (h/segs) - 2;
          const opacity = alive ? (0.4 + (i/segs)*0.6) : 0.2;
          return <div key={i} style={{width:segW,height:segH,marginBottom:2,background:`linear-gradient(180deg, ${c}${Math.round(opacity*255).toString(16).padStart(2,'0')} 0%, ${c}${Math.round(opacity*0.4*255).toString(16).padStart(2,'0')} 100%)`,borderRadius:3,boxShadow:alive?`inset 0 0 6px ${c}30, 0 0 8px ${c}15`:"none",position:"relative"}}>
            <div style={{position:"absolute",top:"45%",left:2,right:2,height:1.5,background:`${c}${alive?"70":"25"}`,borderRadius:1}}/>
          </div>;
        })}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:20,height:20,borderRadius:"50%",background:`${c}50`,border:`1.5px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,boxShadow:alive?`0 0 10px ${c}40`:"none",zIndex:2}}>{sp.icon}</div>
      </div>
      <div style={{width:30,height:9,margin:"-1px auto 0",borderRadius:"50%",background:`linear-gradient(180deg, ${c}80, ${c}40)`,boxShadow:`0 0 10px ${c}35`}}/>
      <div style={{width:42,height:42,margin:"-6px auto 0",position:"relative",animation:alive?"a-float 3.5s ease-in-out infinite":"none"}}>
        {alive && <div style={{position:"absolute",inset:-8,border:`1.5px solid ${c}60`,borderTop:`2px solid ${c}`,borderRadius:"50%",animation:`a-spin ${hot?"1.8s":"3.5s"} linear infinite`}}/>}
        {hot && <div style={{position:"absolute",inset:-14,border:`1px solid ${c}30`,borderBottom:`1.5px solid ${c}80`,borderRadius:"50%",animation:"a-spinR 5s linear infinite"}}/>}
        <div style={{width:42,height:42,borderRadius:"50%",background:`radial-gradient(circle at 30% 30%, #fff4, ${c}CC, ${c}88)`,boxShadow:`0 0 24px ${c}55, 0 0 48px ${c}20, 0 4px 16px rgba(0,0,0,0.4)`,border:`2px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,position:"relative",zIndex:2}}>{sp.icon}</div>
      </div>
      {alive && <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",bottom:h+30,width:hot?6:3,height:hot?80:40,background:`linear-gradient(180deg, transparent 0%, ${c}${hot?"80":"40"} 30%, ${c}${hot?"CC":"60"} 50%, ${c}${hot?"80":"40"} 70%, transparent 100%)`,borderRadius:3,animation:"a-beam 2.5s ease-in-out infinite",pointerEvents:"none",filter:hot?`drop-shadow(0 0 6px ${c}60)`:"none"}}/>}
      {alive && [0,1,2,3].map(i => (
        <div key={i} style={{position:"absolute",left:`${40+(i-1.5)*20}%`,top:`${5+i*15}%`,width:hot?6:4,height:hot?6:4,pointerEvents:"none",background:i%2===0?c:"#fff",borderRadius:1,transform:"rotate(45deg)",animation:`a-spark ${2.2+i*.6}s ease-in-out ${i*.4}s infinite`,opacity:.8}}/>
      ))}
      {v.players > 0 && (
        <div style={{position:"absolute",top:-22,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg, ${$.glass}, rgba(0,0,0,0.6))`,backdropFilter:$.blur,border:`1px solid ${c}55`,borderRadius:22,padding:"5px 14px",whiteSpace:"nowrap",fontSize:10,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",gap:6,boxShadow:`0 4px 16px rgba(0,0,0,0.5), 0 0 8px ${c}20`}}>
          <span style={{width:7,height:7,borderRadius:4,background:c,boxShadow:`0 0 8px ${c}`}}/>
          {v.players} Playing{need>0&&need<=3?`, ${need} More!`:""}
        </div>
      )}
      {v.players >= 3 && (
        <div style={{position:"absolute",bottom:2,left:"50%",transform:"translateX(-50%)",display:"flex",pointerEvents:"none"}}>
          {Array.from({length:Math.min(v.players,5)}).map((_,i)=>{
            const friend = friendsHere[i];
            if (friend) {
              const idx = FRIENDS.findIndex(f => f.id === friend.id);
              return (
                <img key={i} src={FRIEND_AVATARS[idx % FRIEND_AVATARS.length]} alt={friend.name} title={friend.name} style={{width:18,height:18,borderRadius:9,marginLeft:i>0?-5:0,objectFit:"cover",border:`2px solid ${c}`,boxShadow:`0 0 6px ${c}60`,zIndex:5-i,flexShrink:0}}/>
              );
            }
            return (
              <div key={i} style={{width:16,height:16,borderRadius:8,marginLeft:i>0?-5:0,background:`hsl(${i*55+180},55%,60%)`,border:"2px solid rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5-i}}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="rgba(0,0,0,0.55)" stroke="none"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VenueTower;
