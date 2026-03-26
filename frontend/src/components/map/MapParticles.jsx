const CRYSTALS = [{x:200,y:150},{x:450,y:120},{x:680,y:300},{x:300,y:480},{x:600,y:500},{x:150,y:400},{x:500,y:280},{x:780,y:180},{x:350,y:600},{x:700,y:550},{x:250,y:250},{x:550,y:380},{x:100,y:550},{x:820,y:480},{x:430,y:50},{x:660,y:620},{x:180,y:270},{x:740,y:140}];

const MapParticles = () => (
  <>{CRYSTALS.map((c,i) => (
    <div key={i} style={{position:"absolute",left:c.x,top:c.y,width:i%3===0?12:9,height:i%3===0?12:9,pointerEvents:"none",background:i%4===0?"linear-gradient(135deg,#48CAE4,#00B4D8)":i%4===1?"linear-gradient(135deg,#4EEAAA,#2DD4BF)":"linear-gradient(135deg,#818CF8,#6366F1)",borderRadius:i%2===0?2:6,transform:"rotate(45deg)",boxShadow:`0 0 ${i%3===0?12:6}px ${i%4===0?"rgba(0,180,216,0.6)":i%4===1?"rgba(78,234,170,0.5)":"rgba(99,102,241,0.5)"}`,animation:`a-drift ${3+i%4}s ease-in-out ${i*.3}s infinite alternate`,opacity:.75}}/>
  ))}</>
);

export default MapParticles;
