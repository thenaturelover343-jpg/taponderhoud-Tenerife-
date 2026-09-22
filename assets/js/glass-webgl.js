(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const host=document.querySelector('.pour');
  if(!host) return;
  host.style.display='block';
  host.style.visibility='visible';
  host.style.opacity='1';
  const canvas=document.createElement('canvas');
  canvas.className='glass-gl';
  host.classList.add('has-gl');
  host.appendChild(canvas);
  const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:true})||canvas.getContext('experimental-webgl');
  if(!gl){ host.classList.remove('has-gl'); canvas.remove(); return; }

  const vs='attribute vec2 a;varying vec2 v;void main(){v=a*0.5+0.5;gl_Position=vec4(a,0.0,1.0);}';
  const fs=[
    'precision mediump float;',
    'varying vec2 v; uniform float t;',
    'void main(){',
    ' vec2 uv=v;',
    ' vec2 c=uv-vec2(0.50,0.46);',
    ' float gx=abs(c.x);',
    ' float wall=step(gx,0.30)*step(uv.y,0.88)*step(0.18,uv.y);',
    ' float bottom=step(gx,0.30)*step(uv.y,0.24)*step(0.18,uv.y);',
    ' float fill=clamp(t/3.0,0.0,1.0);',
    ' float beerTop=0.24+0.50*fill + 0.012*sin(uv.x*30.0+t*3.0);',
    ' float inGlass=step(gx,0.27)*step(0.20,uv.y)*step(uv.y,0.86);',
    ' float beer=inGlass*step(uv.y,beerTop)*step(0.20,uv.y);',
    ' float foam=inGlass*step(beerTop,uv.y)*step(uv.y,beerTop+0.07);',
    ' float tap=step(abs(uv.x-0.50),0.035)*step(uv.y,0.16)*step(0.02,uv.y);',
    ' float stream=0.0;',
    ' if(t<3.2) stream=step(abs(uv.x-0.50),0.016)*step(0.16,uv.y)*step(uv.y,beerTop+0.02);',
    ' float bub=0.0;',
    ' for(int i=0;i<12;i++){',
    '  float fi=float(i);',
    '  float bx=0.50+0.20*sin(fi*1.7);',
    '  float by=mod(0.22+fract(fi*0.13+t*0.22)*0.55,0.75);',
    '  float d=length(uv-vec2(bx,by));',
    '  bub+=step(d,0.018)*beer;',
    ' }',
    ' vec3 col=vec3(0.0); float a=0.0;',
    ' if(wall>0.5){ col=vec3(0.95,0.93,0.88); a=0.35; }',
    ' if(beer>0.5){ col=mix(vec3(0.55,0.28,0.05),vec3(0.92,0.68,0.18),uv.x); a=0.96; }',
    ' if(foam>0.5){ col=vec3(1.0,0.97,0.90); a=1.0; }',
    ' if(bub>0.5){ col=vec3(1.0,0.95,0.75); a=1.0; }',
    ' if(stream>0.5){ col=vec3(0.90,0.62,0.16); a=0.95; }',
    ' if(tap>0.5){ col=vec3(0.93,0.74,0.28); a=1.0; }',
    ' float rim=step(abs(gx-0.30),0.018)*step(0.18,uv.y)*step(uv.y,0.88);',
    ' if(rim>0.5){ col=vec3(1.0); a=0.85; }',
    ' if(a<0.05) discard;',
    ' gl_FragColor=vec4(col,a);',
    '}'
  ].join('\n');

  function compile(src,type){
    const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); }
    return s;
  }
  const pr=gl.createProgram();
  gl.attachShader(pr,compile(vs,gl.VERTEX_SHADER));
  gl.attachShader(pr,compile(fs,gl.FRAGMENT_SHADER));
  gl.linkProgram(pr); gl.useProgram(pr);
  const buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(pr,'a');
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const uT=gl.getUniformLocation(pr,'t');
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

  function size(){
    const r=Math.min(2,window.devicePixelRatio||1);
    const w=Math.max(host.clientWidth,160);
    const h=Math.max(host.clientHeight,250);
    canvas.width=w*r; canvas.height=h*r;
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    host.style.width=w+'px'; host.style.height=h+'px';
    gl.viewport(0,0,canvas.width,canvas.height);
  }
  size(); window.addEventListener('resize',size);
  let t0=performance.now(), live=true;
  document.addEventListener('visibilitychange',function(){ live=!document.hidden; });
  function frame(now){
    requestAnimationFrame(frame);
    if(!live) return;
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uT,(now-t0)*0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  }
  requestAnimationFrame(frame);
})();
