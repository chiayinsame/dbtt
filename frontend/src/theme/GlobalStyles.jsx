const GlobalCSS = () => <style>{`
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%}
body{overflow:hidden}
@keyframes a-pulse{0%,100%{transform:scale(1);opacity:.65}50%{transform:scale(1.18);opacity:1}}
@keyframes a-pulse2{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.35);opacity:.75}}
@keyframes a-spin{to{transform:rotate(360deg)}}
@keyframes a-spinR{to{transform:rotate(-360deg)}}
@keyframes a-float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
@keyframes a-beam{0%,100%{opacity:.5}50%{opacity:1}}
@keyframes a-spark{0%,100%{opacity:0;transform:scale(.4) rotate(0deg)}50%{opacity:1;transform:scale(1.1) rotate(180deg)}}
@keyframes a-ring{0%{transform:scale(.7);opacity:.9}100%{transform:scale(2.2);opacity:0}}
@keyframes a-ring2{0%{transform:scale(.9);opacity:.6}100%{transform:scale(1.8);opacity:0}}
@keyframes a-drift{0%{transform:translateY(0) rotate(0deg);opacity:.8}100%{transform:translateY(-24px) rotate(60deg);opacity:0}}
@keyframes a-up{from{transform:translateY(110%)}to{transform:translateY(0)}}
@keyframes a-fade{from{opacity:0}to{opacity:1}}
@keyframes a-pop{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes a-glow{0%,100%{box-shadow:0 0 15px var(--gc,rgba(78,234,170,.3))}50%{box-shadow:0 0 30px var(--gc,rgba(78,234,170,.5))}}
@keyframes a-heatmap{0%,100%{opacity:.35}50%{opacity:.6}}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.22)}
`}</style>;

export default GlobalCSS;
