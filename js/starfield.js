
(() => {
  const canvas = document.getElementById('starfall');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w=0,h=0,dpr=1,stars=[],pointer={x:-1000,y:-1000},raf=0;
  const count = () => Math.min(150, Math.max(65, Math.floor(w*h/12500)));
  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,2); w=innerWidth; h=innerHeight;
    canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr);
    canvas.style.width=w+'px'; canvas.style.height=h+'px'; ctx.setTransform(dpr,0,0,dpr,0,0);
    stars=Array.from({length:count()},()=>({x:Math.random()*w,y:Math.random()*h,r:.45+Math.random()*1.7,v:.18+Math.random()*.72,drift:(Math.random()-.5)*.35,a:.28+Math.random()*.65,tw:Math.random()*6.28,tail:4+Math.random()*12}));
    draw(true);
  }
  function draw(staticFrame=false){
    ctx.clearRect(0,0,w,h);
    for(const s of stars){
      if(!staticFrame&&!reduce){s.y+=s.v;s.x+=s.drift;s.tw+=.025;if(s.y>h+16){s.y=-12;s.x=Math.random()*w;}if(s.x<-15)s.x=w+10;if(s.x>w+15)s.x=-10;}
      const dx=s.x-pointer.x,dy=s.y-pointer.y,dist=Math.hypot(dx,dy);
      const glow=dist<130?(1-dist/130)*.95:0;
      ctx.globalAlpha=Math.min(1,s.a+glow*.45);
      ctx.strokeStyle=glow>.08?'#fff0bd':'#e9c77e';ctx.lineWidth=glow>.3?1.25:.65;
      ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-s.drift*s.tail,s.y-s.tail*(.55+s.v*.5));ctx.stroke();
      ctx.beginPath();ctx.arc(s.x,s.y,s.r+glow*1.1,0,Math.PI*2);ctx.fillStyle='#fff1c5';ctx.fill();
      if(glow>.35){ctx.globalAlpha=glow*.65;ctx.beginPath();ctx.arc(s.x,s.y,3+glow*5,0,Math.PI*2);ctx.fillStyle='#e8bd68';ctx.fill();}
    }
    ctx.globalAlpha=1;
    if(!reduce&&!staticFrame) raf=requestAnimationFrame(()=>draw());
  }
  canvas.addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY;});
  canvas.addEventListener('pointerleave',()=>{pointer.x=-1000;pointer.y=-1000;});
  canvas.addEventListener('pointerdown',e=>{
    pointer.x=e.clientX;pointer.y=e.clientY;
    for(let i=0;i<12;i++)stars.push({x:e.clientX+(Math.random()-.5)*70,y:e.clientY+(Math.random()-.5)*50,r:.7+Math.random()*2,v:.7+Math.random()*1.5,drift:(Math.random()-.5)*1.5,a:.8,tw:0,tail:8+Math.random()*16});
    stars=stars.slice(-190);
  });
  window.addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();});
  resize();
})();
