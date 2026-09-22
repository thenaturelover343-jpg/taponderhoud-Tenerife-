(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero=document.querySelector('.hero');
  if(!hero) return;
  const canvas=document.createElement('canvas');
  canvas.className='bubbles-gl';
  canvas.setAttribute('aria-hidden','true');
  hero.prepend(canvas);
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true});
  if(!gl){ canvas.remove(); return; }

  const vs=`attribute vec2 a;
attribute vec4 i;
varying vec2 uv; varying float aop;
uniform vec2 res; uniform float t;
void main(){
  float ph=i.w;
  float y=fract(i.y + t*i.z);
  float x=i.x + 0.04*sin(t*1.7+ph*6.28);
  float s=mix(8.0,28.0,i.z)* (res.y<700.0?0.7:1.0);
  vec2 p=vec2(x*res.x,(1.0-y)*res.y)+a*s;
  gl_Position=vec4((p/res)*2.0-1.0,0.0,1.0);
  uv=a*0.5+0.5; aop=smoothstep(0.0,0.12,y)*smoothstep(1.0,0.82,y);
}`;
  const fs=`precision mediump float; varying vec2 uv; varying float aop;
void main(){
  vec2 p=uv*2.0-1.0;
  float d=length(p);
  if(d>1.0) discard;
  float rim=smoothstep(1.0,0.72,d);
  float hl=smoothstep(0.45,0.05,length(p-vec2(-0.28,-0.32)));
  vec3 col=mix(vec3(0.95,0.82,0.45),vec3(1.0,0.97,0.88),hl);
  gl_FragColor=vec4(col, rim*aop*0.55);
}`;

  function sh(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
  const pr=gl.createProgram();
  gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));
  gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));
  gl.linkProgram(pr); gl.useProgram(pr);

  const quad=new Float32Array([-1,-1,1,-1,-1,1,1,1]);
  const qb=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,qb);
  gl.bufferData(gl.ARRAY_BUFFER,quad,gl.STATIC_DRAW);
  const locA=gl.getAttribLocation(pr,'a');
  gl.enableVertexAttribArray(locA);
  gl.vertexAttribPointer(locA,2,gl.FLOAT,false,0,0);

  const n=window.innerWidth<800?48:90;
  const inst=new Float32Array(n*4);
  for(let k=0;k<n;k++){
    inst[k*4]=Math.random();
    inst[k*4+1]=Math.random();
    inst[k*4+2]=0.12+Math.random()*0.35;
    inst[k*4+3]=Math.random();
  }
  const ib=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,ib);
  gl.bufferData(gl.ARRAY_BUFFER,inst,gl.STATIC_DRAW);
  const locI=gl.getAttribLocation(pr,'i');
  const ext=gl.getExtension('ANGLE_instanced_arrays');
  if(!ext){ canvas.remove(); return; }
  gl.enableVertexAttribArray(locI);
  gl.vertexAttribPointer(locI,4,gl.FLOAT,false,0,0);
  ext.vertexAttribDivisorANGLE(locI,1);

  const uRes=gl.getUniformLocation(pr,'res');
  const uT=gl.getUniformLocation(pr,'t');
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA,gl.ONE);

  function size(){
    const r=Math.min(2,window.devicePixelRatio||1);
    const w=hero.clientWidth, h=hero.clientHeight;
    canvas.width=w*r; canvas.height=h*r;
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.uniform2f(uRes,canvas.width,canvas.height);
  }
  size(); window.addEventListener('resize',size);

  let t0=performance.now(), live=true;
  document.addEventListener('visibilitychange',()=>{live=!document.hidden; if(live) t0=performance.now();});
  function frame(now){
    requestAnimationFrame(frame);
    if(!live) return;
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER,qb);
    gl.vertexAttribPointer(locA,2,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,ib);
    gl.vertexAttribPointer(locI,4,gl.FLOAT,false,0,0);
    gl.uniform1f(uT,(now-t0)*0.00022);
    ext.drawArraysInstancedANGLE(gl.TRIANGLE_STRIP,0,4,n);
  }
  requestAnimationFrame(frame);
})();
