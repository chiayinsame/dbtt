import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { VENUES, MW, MH, SPORTS, vstatus } from "../data/mockData";
import $ from "../theme/tokens";
import { useBreakpoint } from "../hooks/useBreakpoint";
import MapTerrain from "../components/map/MapTerrain";
import MapParticles from "../components/map/MapParticles";
import VenueTower from "../components/map/VenueTower";
import VenueMarker from "../components/map/VenueMarker";
import PlayerAvatar from "../components/map/PlayerAvatar";
import { USER } from "../data/mockData";
import { USER_AVATAR } from "../images/avatars";

const MapPage = ({onVenue,onMenu}) => {
  const { isDesktop } = useBreakpoint();
  const [mapOff,setMapOff] = useState({x:-1100,y:-450});
  const [pp,setPp] = useState({x:1450,y:880});
  const [dragMap,setDragMap] = useState(false);
  const [dragP,setDragP] = useState(false);
  const [zoom,setZoom] = useState(1);
  const [showNearby,setShowNearby] = useState(false);
  const ref = useRef({}), mRef = useRef(null), keysRef = useRef({}), containerRef = useRef(null);

  const onDown = useCallback(e => {
    if(e.target.closest('[data-p]')){setDragP(true);const r=mRef.current.getBoundingClientRect();ref.current={sx:e.clientX,sy:e.clientY,ox:pp.x,oy:pp.y,r};e.preventDefault();return;}
    if(e.target.closest('[data-t]'))return;
    setDragMap(true);ref.current={sx:e.clientX,sy:e.clientY,ox:mapOff.x,oy:mapOff.y};
  },[mapOff,pp]);

  const onMove = useCallback(e => {
    if(dragP){const{sx,sy,ox,oy,r}=ref.current;setPp({x:Math.max(20,Math.min(MW-20,ox+(e.clientX-sx)*(MW/r.width))),y:Math.max(20,Math.min(MH-20,oy+(e.clientY-sy)*(MH/r.height)))});return;}
    if(dragMap){const{sx,sy,ox,oy}=ref.current;setMapOff({x:ox+(e.clientX-sx),y:oy+(e.clientY-sy)});}
  },[dragMap,dragP]);

  const onUp = useCallback(() => {setDragMap(false);setDragP(false);},[]);
  const nearbyVenues = useMemo(() => VENUES.filter(v=>Math.hypot(v.x-pp.x,v.y-pp.y)<200&&v.players>0).sort((a,b)=>Math.hypot(a.x-pp.x,a.y-pp.y)-Math.hypot(b.x-pp.x,b.y-pp.y)),[pp]);
  const nearby = nearbyVenues.length;

  // ── Zoom anchored to a screen point (sx, sy) ──
  const zoomTo = useCallback((factor, sx, sy) => {
    const nz = Math.max(0.3, Math.min(2.5, zoom * factor));
    const ratio = nz / zoom;
    setZoom(nz);
    setMapOff(off => ({x: sx - (sx - off.x) * ratio, y: sy - (sy - off.y) * ratio}));
  }, [zoom]);

  // ── Wheel zoom toward cursor ──
  const onWheel = useCallback(e => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.88 : 1.12;
    const rect = containerRef.current.getBoundingClientRect();
    zoomTo(factor, e.clientX - rect.left, e.clientY - rect.top);
  }, [zoomTo]);

  // ── Button zoom anchored to viewport centre ──
  const zoomCenter = useCallback(factor => {
    const rect = containerRef.current.getBoundingClientRect();
    zoomTo(factor, rect.width / 2, rect.height / 2);
  }, [zoomTo]);

  // ── Re-centre on player avatar ──
  const recenter = useCallback(() => {
    const rect = containerRef.current.getBoundingClientRect();
    setMapOff({x: rect.width / 2 - pp.x * zoom, y: rect.height / 2 - pp.y * zoom});
  }, [pp, zoom]);

  // Attach wheel listener with {passive:false} so preventDefault works
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, {passive: false});
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // ── WASD / arrow key movement ──
  useEffect(() => {
    const keys = keysRef.current;
    const onKeyDown = e => { keys[e.key.toLowerCase()] = true; };
    const onKeyUp   = e => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);
    const speed = 4;
    const id = setInterval(() => {
      let dx = 0, dy = 0;
      if (keys['w'] || keys['arrowup'])    dy -= speed;
      if (keys['s'] || keys['arrowdown'])  dy += speed;
      if (keys['a'] || keys['arrowleft'])  dx -= speed;
      if (keys['d'] || keys['arrowright']) dx += speed;
      if (dx || dy) setPp(p => ({x: Math.max(20, Math.min(MW-20, p.x+dx)), y: Math.max(20, Math.min(MH-20, p.y+dy))}));
    }, 16);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      clearInterval(id);
    };
  }, []);

  const zoomLabel = zoom < 0.65 ? "overview" : zoom > 1.5 ? "close-up" : `${Math.round(zoom * 100)}%`;

  return (
    <div ref={containerRef} style={{position:"absolute",inset:0,overflow:"hidden",background:`radial-gradient(ellipse at 40% 30%, #0C2440 0%, ${$.bg} 50%, #040A14 100%)`}} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>

      {/* ── HUD Top ── */}
      <div style={{position:"absolute",top:isDesktop?16:48,left:16,right:16,zIndex:50,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <button onClick={onMenu} style={{background:$.glass,backdropFilter:$.blur,border:`1px solid ${$.bl}`,borderRadius:14,width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:$.t1,boxShadow:"0 2px 12px rgba(0,0,0,0.3)"}}>☰</button>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{background:$.glass,backdropFilter:$.blur,border:`1px solid ${$.bl}`,borderRadius:14,padding:"9px 16px",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6,color:$.t1,boxShadow:"0 2px 12px rgba(0,0,0,0.3)"}}><span style={{color:$.ac,fontSize:8}}>●</span>0.3 km</div>
          <div style={{background:$.glass,backdropFilter:$.blur,border:`1px solid ${$.bl}`,borderRadius:14,padding:"9px 16px",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6,color:$.t1,position:"relative",boxShadow:"0 2px 12px rgba(0,0,0,0.3)"}}>🔭 Nearby{nearby>0&&<span style={{position:"absolute",top:-6,right:-6,background:$.red,borderRadius:10,width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,boxShadow:`0 2px 8px ${$.red}60`}}>{nearby}</span>}</div>
          {/* Zoom controls */}
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <button onClick={()=>zoomCenter(1.25)} style={{background:$.glass,backdropFilter:$.blur,border:`1px solid ${$.bl}`,borderRadius:10,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:20,fontWeight:700,color:$.t1,boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>+</button>
            <button onClick={()=>zoomCenter(0.8)}  style={{background:$.glass,backdropFilter:$.blur,border:`1px solid ${$.bl}`,borderRadius:10,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:20,fontWeight:700,color:$.t1,boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>−</button>
          </div>
          <div style={{background:$.glass,backdropFilter:$.blur,border:`1px solid ${zoom<0.65?$.ac:$.bl}`,borderRadius:10,padding:"5px 10px",fontSize:10,fontWeight:700,color:zoom<0.65?$.ac:$.t2,boxShadow:"0 2px 8px rgba(0,0,0,0.3)",minWidth:52,textAlign:"center"}}>
            {zoomLabel}
          </div>
        </div>
      </div>

      {/* ── Map World ── */}
      <div ref={mRef} style={{position:"absolute",width:MW,height:MH,transform:`translate(${mapOff.x}px,${mapOff.y}px) scale(${zoom})`,transformOrigin:"0 0",cursor:dragMap?"grabbing":dragP?"default":"grab",transition:(dragMap||dragP)?"none":"transform 0.15s ease-out"}}>
        <MapTerrain/>
        <MapParticles/>
        {VENUES.map(v => (
          <div key={v.id} data-t>
            {zoom < 0.65
              ? <VenueMarker venue={v} onClick={onVenue}/>
              : <VenueTower venue={v} onClick={onVenue} pp={pp}/>}
          </div>
        ))}
        <div data-p><PlayerAvatar pos={pp} dragging={dragP}/></div>
      </div>

      {/* ── Nearby Events Panel ── */}
      {showNearby&&(
        <div style={{position:"absolute",inset:0,zIndex:200,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)"}} onClick={()=>setShowNearby(false)}>
          <div onClick={e=>e.stopPropagation()} style={{position:"absolute",bottom:0,left:0,right:0,background:$.bg2,borderTop:`1px solid ${$.bl}`,borderRadius:"20px 20px 0 0",maxHeight:"60vh",display:"flex",flexDirection:"column",boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
            <div style={{padding:"16px 20px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${$.bd}`}}>
              <div style={{fontSize:15,fontWeight:800,color:$.t1}}>🔭 Nearby Events <span style={{fontSize:12,fontWeight:500,color:$.t2}}>({nearby})</span></div>
              <button onClick={()=>setShowNearby(false)} style={{background:"none",border:"none",color:$.t2,fontSize:20,cursor:"pointer",padding:"0 4px",lineHeight:1}}>×</button>
            </div>
            <div style={{overflowY:"auto",padding:"8px 0"}}>
              {nearbyVenues.length===0?(
                <div style={{padding:"24px",textAlign:"center",color:$.t2,fontSize:13}}>No active venues nearby. Move closer to a venue!</div>
              ):nearbyVenues.map(v=>{
                const st=vstatus(v);
                const sp=SPORTS[v.sport]||{icon:"🏟️",label:v.sport,hue:$.ac};
                const dist=Math.round(Math.hypot(v.x-pp.x,v.y-pp.y));
                const statusColor={hot:$.red,active:$.ac,quiet:"#F5A623",empty:$.t3}[st]||$.t2;
                return(
                  <div key={v.id} onClick={()=>{setShowNearby(false);onVenue(v);}} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 20px",cursor:"pointer",borderBottom:`1px solid ${$.bd}`,transition:"background 0.15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background=$.surf}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{width:44,height:44,borderRadius:12,background:`${sp.hue}22`,border:`1.5px solid ${sp.hue}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{sp.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:700,color:$.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.name}</div>
                      <div style={{fontSize:11,color:$.t2,marginTop:2}}>{sp.label} · <span style={{color:statusColor,fontWeight:600}}>{v.players} playing</span></div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:11,color:$.t2}}>{dist} units</div>
                      <div style={{fontSize:10,fontWeight:700,color:statusColor,textTransform:"uppercase",marginTop:2}}>{st}</div>
                    </div>
                    <span style={{color:$.t3,fontSize:16}}>›</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom HUD ── */}
      <div style={{position:"absolute",bottom:isDesktop?16:78,left:0,right:0,zIndex:50,display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"0 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:48,height:48,borderRadius:"50%",border:`2.5px solid ${$.ac}55`,boxShadow:`0 0 16px ${$.ac}18`,overflow:"hidden",flexShrink:0}}><img src={USER_AVATAR} alt={USER.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/></div>
          <div><div style={{fontSize:15,fontWeight:800,color:$.t1}}>{USER.level}</div>
          <div style={{width:56,height:5,background:"rgba(255,255,255,0.08)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${(USER.xp/USER.xpMax)*100}%`,height:"100%",background:`linear-gradient(90deg,${$.ac},${$.ac2})`,borderRadius:3}}/></div></div>
          <button onClick={recenter} title="Re-centre on me" style={{width:38,height:38,borderRadius:12,background:$.glass,backdropFilter:$.blur,border:`1px solid ${$.ac}55`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,boxShadow:`0 0 12px ${$.ac}22, 0 2px 8px rgba(0,0,0,0.3)`}}>📍</button>
        </div>
        <button onClick={onMenu} style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(145deg,${$.red},#B91C2C)`,border:"3px solid rgba(255,255,255,0.18)",boxShadow:`0 6px 28px rgba(230,57,70,0.5), 0 0 48px rgba(230,57,70,0.15), inset 0 -2px 8px rgba(0,0,0,0.3)`,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#fff",position:"absolute",left:"50%",transform:"translateX(-50%)",bottom:0}}>
          <span style={{fontSize:22}}>🔥</span><span style={{fontSize:7,fontWeight:800,letterSpacing:.6,marginTop:-2}}>ActiveSG</span>
        </button>
        <div onClick={()=>setShowNearby(true)} style={{background:$.glass,backdropFilter:$.blur,border:`1px solid ${nearby>0?$.ac+"55":$.bl}`,borderRadius:14,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,cursor:"pointer",boxShadow:"0 2px 12px rgba(0,0,0,0.3)",position:"relative"}}>
          <span style={{fontSize:20}}>🔭</span><div style={{fontSize:10,fontWeight:600,color:nearby>0?$.ac:$.t2,lineHeight:1.3}}>Nearby<br/>Events</div>
          {nearby>0&&<span style={{position:"absolute",top:-6,right:-6,background:$.red,borderRadius:10,width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",boxShadow:`0 2px 8px ${$.red}60`}}>{nearby}</span>}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
