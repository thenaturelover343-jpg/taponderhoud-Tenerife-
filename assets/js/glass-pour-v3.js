(function(){
  var hero=document.querySelector('.hero');
  if(!hero) return;
  var c=document.createElement('canvas');
  c.setAttribute('aria-hidden','true');
  c.style.cssText='position:absolute;right:3%;bottom:7%;width:210px;height:330px;z-index:20;pointer-events:none;';
  hero.appendChild(c);
  var ctx=c.getContext('2d');
  if(!ctx) return;
  function fit(){
    var r=Math.min(2,window.devicePixelRatio||1);
    var cssW=window.innerWidth<700?120:210;
    var cssH=window.innerWidth<700?190:330;
    c.style.width=cssW+'px'; c.style.height=cssH+'px';
    c.width=Math.round(cssW*r); c.height=Math.round(cssH*r);
    ctx.setTransform(r,0,0,r,0,0);
    c._w=cssW; c._h=cssH;
  }
  fit(); window.addEventListener('resize',fit);
  var t0=performance.now();
  var bubbles=[];
  for(var i=0;i<14;i++) bubbles.push({x:0.28+Math.random()*0.44, p:Math.random(), s:0.35+Math.random()*0.7, r:2+Math.random()*3});
  function frame(now){
    requestAnimationFrame(frame);
    var w=c._w, h=c._h, t=(now-t0)/1000;
    var fill=Math.min(1, t/3);
    ctx.clearRect(0,0,w,h);
    var gx=w*0.22, gy=h*0.22, gw=w*0.56, gh=h*0.72;
    // tap
    ctx.fillStyle='#e2b24a';
    ctx.fillRect(w*0.46, h*0.02, w*0.08, h*0.16);
    ctx.fillStyle='#c4922a';
    ctx.fillRect(w*0.44, h*0.14, w*0.12, h*0.04);
    // stream
    if(t<3.15){
      ctx.fillStyle='#d9a02a';
      ctx.fillRect(w*0.485, h*0.18, w*0.03, gy+gh*(1-0.18)-h*0.18 + gh*fill*0.5);
    }
    // glass body
    ctx.strokeStyle='rgba(255,255,255,0.95)';
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx, gy+gh-18);
    ctx.quadraticCurveTo(gx, gy+gh, gx+18, gy+gh);
    ctx.lineTo(gx+gw-18, gy+gh);
    ctx.quadraticCurveTo(gx+gw, gy+gh, gx+gw, gy+gh-18);
    ctx.lineTo(gx+gw, gy);
    ctx.stroke();
    // clip beer
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(gx+3, gy);
    ctx.lineTo(gx+3, gy+gh-18);
    ctx.quadraticCurveTo(gx+3, gy+gh-3, gx+18, gy+gh-3);
    ctx.lineTo(gx+gw-18, gy+gh-3);
    ctx.quadraticCurveTo(gx+gw-3, gy+gh-3, gx+gw-3, gy+gh-18);
    ctx.lineTo(gx+gw-3, gy);
    ctx.closePath();
    ctx.clip();
    var beerH=gh*0.78*fill;
    var wave=Math.sin(t*3.2)*4;
    var top=gy+gh-3-beerH+wave;
    var grd=ctx.createLinearGradient(gx,0,gx+gw,0);
    grd.addColorStop(0,'#8a4a10');
    grd.addColorStop(0.45,'#d09022');
    grd.addColorStop(1,'#f0c050');
    ctx.fillStyle=grd;
    ctx.fillRect(gx, top, gw, gy+gh-top);
    // foam
    if(fill>0.08){
      ctx.fillStyle='#fff8e8';
      ctx.fillRect(gx, top-16, gw, 20+Math.sin(t*4)*2);
    }
    // bubbles in beer
    if(fill>0.15){
      ctx.fillStyle='rgba(255,245,210,0.9)';
      for(var i=0;i<bubbles.length;i++){
        var b=bubbles[i];
        var by=top+8+(1-(((t*b.s)+b.p)%1))*(beerH-20);
        if(by>top+6 && by<gy+gh-10){
          ctx.beginPath();
          ctx.arc(gx+b.x*gw, by, b.r, 0, Math.PI*2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }
  requestAnimationFrame(frame);
})();
