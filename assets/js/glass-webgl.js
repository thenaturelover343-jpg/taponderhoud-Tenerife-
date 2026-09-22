(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(window.matchMedia('(max-width:800px)').matches) return;
  const host=document.querySelector('.pour');
  if(!host) return;
  const canvas=document.createElement('canvas');
  canvas.className='glass-gl';
  host.classList.add('has-gl');
  host.appendChild(canvas);
  const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:true});
  if(!gl){ host.classList.remove('has-gl'); canvas.remove(); return; }

  const vs='attribute vec2 a;varying vec2 v;void main(){v=a*0.5+0.5;gl_Position=vec4(a,0.,1.);}';
  const fs=`precision mediump float;varying vec2 v;uniform float t;
float sdRoundBox(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 uv=v;
  vec2 p=(uv-vec2(0.5,0.42))*vec2(2.05,1.72);
  float glass=sdRoundBox(p,vec2(0.38,0.62),0.18);
  float inner=sdRoundBox(p-vec2(0.,0.02),vec2(0.30,0.54),0.14);
  float fill=smoothstep(0.,3.2,t)*0.72;
  float wave=0.012*sin(uv.x*28.+t*3.2);
  float beerTop= -0.48 + fill + wave;
  float inBeer=step(p.y,beerTop)*step(inner,0.002);
  float foamH=0.07+0.02*sin(uv.x*40.+t*2.);
  float inFoam=step(p.y,beerTop+foamH)*step(beerTop-0.01,p.y)*step(inner,0.01);
  float tap=smoothstep(0.045,0.02,abs(uv.x-0.5))*smoothstep(0.22,0.0,uv.y)*smoothstep(0.28,0.18,uv.y);
  float stream=0.;
  if(t<3.4){
    stream=smoothstep(0.018,0.004,abs(uv.x-0.5))*smoothstep(0.22,0.28,uv.y)*smoothstep(0.72-fill*0.15,0.38,uv.y);
  }
  float bub=0.;
  for(int i=0;i<10;i++){
    float fi=float(i);
    vec2 id=vec2(hash(vec2(fi,1.3)),hash(vec2(fi,4.7)));
    float bx=mix(-0.26,0.26,id.x);
    float by=fract(id.y+t*0.18+fi*0.07);
    vec2 bp=p-vec2(bx, mix(-0.5,beerTop-0.02,by));
    bub+=smoothstep(0.028,0.006,length(bp))*inBeer;
  }
  vec3 beer=mix(vec3(0.42,0.22,0.05),vec3(0.85,0.58,0.16),uv.x*0.5+0.2);
  vec3 foam=vec3(0.98,0.95,0.88);
  vec3 col=vec3(0.);
  float a=0.;
  if(glass<0.01 && inner>0.){ col=vec3(0.95,0.93,0.88); a=0.55; }
  if(inBeer>0.5){ col=beer; a=0.92; }
  col+=vec3(1.)*bub*0.45;
  if(inFoam>0.5){ col=foam; a=0.96; }
  col=mix(col,vec3(0.91,0.72,0.28),tap*0.9);
  col=mix(col,vec3(0.86,0.55,0.14),stream);
  a=max(a,max(tap,stream));
  float rim=smoothstep(0.02,0.,abs(glass));
  col=mix(col,vec3(1.),rim*0.35); a=max(a,rim*0.4);
  if(inner>0.02 && glass>0.02 && tap<0.01 && stream<0.01) discard;
  gl_FragColor=vec4(col,clamp(a,0.,1.));
}`;

  function compile(src,type){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
  const pr=gl.createProgram();
  gl.attachShader(pr,compile(vs,gl.VERTEX_SHADER));
  gl.attachShader(pr,compile(fs,gl.FRAGMENT_SHADER));
  gl.linkProgram(pr);gl.useProgram(pr);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(pr,'a');
  gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const uT=gl.getUniformLocation(pr,'t');
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

  function size(){
    const r=Math.min(2,window.devicePixelRatio||1);
    const w=host.clientWidth,h=host.clientHeight;
    canvas.width=w*r;canvas.height=h*r;
    canvas.style.width=w+'px';canvas.style.height=h+'px';
    gl.viewport(0,0,canvas.width,canvas.height);
  }
  size();window.addEventListener('resize',size);
  let t0=performance.now(),live=true;
  document.addEventListener('visibilitychange',()=>{live=!document.hidden;});
  function frame(now){
    requestAnimationFrame(frame);
    if(!live) return;
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uT,(now-t0)*0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  }
  requestAnimationFrame(frame);
})();
