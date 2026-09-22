(function () {
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mainNav = document.querySelector("[data-main-nav]");
  if (menuToggle && mainNav) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.addEventListener("click", function (event) {
      if (!event.target.closest("a")) return;
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  }
  var root = "https://thenaturelover343-jpg.github.io/taponderhoud-Tenerife-/";
  var params = new URLSearchParams(window.location.search);
  var lang = params.get("lang");
  if (lang === "nl" || lang === "en") window.location.replace(root + lang + "/");
})();

(function(){
  if(window.innerWidth<900) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var hero=document.querySelector('.hero');
  if(!hero||document.getElementById('beer-pour-canvas')) return;
  var c=document.createElement('canvas');
  c.id='beer-pour-canvas';
  c.setAttribute('aria-hidden','true');
  c.style.cssText='position:absolute;right:24px;bottom:28px;width:180px;height:290px;z-index:4;pointer-events:none;';
  hero.appendChild(c);
  var ctx=c.getContext('2d'); if(!ctx) return;
  function fit(){
    if(window.innerWidth<900){ c.style.display='none'; return; }
    c.style.display='block';
    var r=Math.min(2,window.devicePixelRatio||1);
    var W=180,H=290;
    c.style.width=W+'px'; c.style.height=H+'px';
    c.width=Math.round(W*r); c.height=Math.round(H*r);
    ctx.setTransform(r,0,0,r,0,0); c._W=W; c._H=H;
  }
  fit(); addEventListener('resize',fit);
  var t0=performance.now(), bs=[];
  for(var i=0;i<16;i++) bs.push({x:.3+Math.random()*.4,p:Math.random(),s:.4+Math.random()*.8,r:2+Math.random()*3});
  function loop(now){
    requestAnimationFrame(loop);
    if(window.innerWidth<900) return;
    var w=c._W,h=c._H,t=(now-t0)/1000,fill=Math.min(1,t/3);
    if(!w) return;
    ctx.clearRect(0,0,w,h);
    var gx=w*0.2,gy=h*0.22,gw=w*0.6,gh=h*0.7;
    ctx.fillStyle='#e8c36a'; ctx.fillRect(w*0.45,h*0.02,w*0.1,h*0.15);
    ctx.fillStyle='#c49228'; ctx.fillRect(w*0.42,h*0.14,w*0.16,h*0.035);
    if(t<3.2){ ctx.fillStyle='#d9a02a'; ctx.fillRect(w*0.48,h*0.17,w*0.04,gy+gh*fill); }
    ctx.strokeStyle='#fff'; ctx.lineWidth=3; ctx.beginPath();
    ctx.moveTo(gx,gy); ctx.lineTo(gx,gy+gh-16);
    ctx.quadraticCurveTo(gx,gy+gh,gx+16,gy+gh);
    ctx.lineTo(gx+gw-16,gy+gh);
    ctx.quadraticCurveTo(gx+gw,gy+gh,gx+gw,gy+gh-16);
    ctx.lineTo(gx+gw,gy); ctx.stroke();
    ctx.save(); ctx.beginPath();
    ctx.moveTo(gx+3,gy); ctx.lineTo(gx+3,gy+gh-16);
    ctx.quadraticCurveTo(gx+3,gy+gh-3,gx+16,gy+gh-3);
    ctx.lineTo(gx+gw-16,gy+gh-3);
    ctx.quadraticCurveTo(gx+gw-3,gy+gh-3,gx+gw-3,gy+gh-16);
    ctx.lineTo(gx+gw-3,gy); ctx.closePath(); ctx.clip();
    var beerH=gh*0.8*fill, wave=Math.sin(t*3)*3, top=gy+gh-3-beerH+wave;
    var g=ctx.createLinearGradient(gx,0,gx+gw,0);
    g.addColorStop(0,'#7a3e0c'); g.addColorStop(.5,'#d09022'); g.addColorStop(1,'#f2c456');
    ctx.fillStyle=g; ctx.fillRect(gx,top,gw,gy+gh-top);
    if(fill>0.06){ ctx.fillStyle='#fff6e4'; ctx.fillRect(gx,top-18,gw,22); }
    if(fill>0.12){
      ctx.fillStyle='rgba(255,248,220,.95)';
      for(var i=0;i<bs.length;i++){
        var b=bs[i], by=top+10+(1-((t*b.s+b.p)%1))*(beerH-24);
        if(by>top+4 && by<gy+gh-8){ ctx.beginPath(); ctx.arc(gx+b.x*gw,by,b.r,0,6.28); ctx.fill(); }
      }
    }
    ctx.restore();
  }
  requestAnimationFrame(loop);
})();
