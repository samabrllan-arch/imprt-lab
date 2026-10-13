import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css               */import{S as Xs,C as Ye,W as Ws,A as Zs,g as Si,a as Qs,l as Mi,P as Js,O as Ks,m as tn,V as Xe,b as en,D as ae,j as an,h as tt,G as sn,M as nn,i as on,B as rn,k as ln,d as cn,f as dn,c as ma,e as un,L as hn,n as pn,o as mn,p as Fa,q as gn,r as fn,s as vn}from"./paths-Bzv2z2i0.js";import{S as Rt,F as Pt}from"./colors-xns7KFWE.js";import{a as bn}from"./imageProcessing-XXxTQDrn.js";import{b as yn,k as wn}from"./colorKey-C1nSbH-k.js";import{c as xn}from"./imageEnhancerService-C14pYpge.js";import{D as ft,s as Me}from"./presets-CiY3Ovxi.js";function qa(e,t={}){const{brightness:a=0,contrast:i=0,invert:s=!1,grayscale:n=!1}=t,o=e.data,r=o.length,l=259*(i+255)/(255*(259-i)),c=a/100*255;for(let d=0;d<r;d+=4){if(o[d+3]===0)continue;let g=o[d],p=o[d+1],h=o[d+2];if(a!==0&&(g+=c,p+=c,h+=c),i!==0&&(g=l*(g-128)+128,p=l*(p-128)+128,h=l*(h-128)+128),n){const u=.299*g+.587*p+.114*h;g=u,p=u,h=u}s&&(g=255-g,p=255-p,h=255-h),o[d]=Math.max(0,Math.min(255,g)),o[d+1]=Math.max(0,Math.min(255,p)),o[d+2]=Math.max(0,Math.min(255,h))}return e}function Ci(e){const t=e.getContext("2d"),a=e.width,i=e.height,n=t.getImageData(0,0,a,i).data;let o=a,r=i,l=0,c=0,d=!1;for(let f=0;f<i;f++)for(let y=0;y<a;y++)n[(f*a+y)*4+3]>5&&(d=!0,y<o&&(o=y),y>l&&(l=y),f<r&&(r=f),f>c&&(c=f));if(!d)return e;const g=12;o=Math.max(0,o-g),r=Math.max(0,r-g),l=Math.min(a-1,l+g),c=Math.min(i-1,c+g);const p=l-o+1,h=c-r+1,u=document.createElement("canvas");return u.width=p,u.height=h,u.getContext("2d").drawImage(e,o,r,p,h,0,0,p,h),u}const En=1.3,Sn=2,Mn=40,Cn=160;function Ai(){var e;return window.innerWidth<=768||!!((e=window.matchMedia)!=null&&e.call(window,"(pointer: coarse)").matches)}const An=()=>Math.min(window.devicePixelRatio||1,Ai()?En:Sn),Ln=()=>Ai()?Mn:Cn;class kn{constructor(t){this.container=t,this.scene=new Xs;const a=document.documentElement.getAttribute("data-theme")||"dark";this.scene.background=new Ye(a==="light"?"#f0f3f8":"#08090d"),window.addEventListener("themechange",i=>{var n;const s=((n=i.detail)==null?void 0:n.theme)||"dark";this.scene.background=new Ye(s==="light"?"#f0f3f8":"#08090d")}),this.renderer=new Ws({antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0}),this.renderer.setSize(t.clientWidth,t.clientHeight),this.renderer.setPixelRatio(An()),this.renderer.toneMapping=Zs,this.renderer.toneMappingExposure=1.15,this.renderer.outputColorSpace=Si,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Qs,t.appendChild(this.renderer.domElement),this.updateCallbacks=[],this.clock=new Mi,this.isRunning=!1,this._isScrolling=!1,this._scrollTimeout=0,this._onScroll=()=>{this._isScrolling=!0,clearTimeout(this._scrollTimeout),this._scrollTimeout=setTimeout(()=>{this._isScrolling=!1},120)},window.addEventListener("scroll",this._onScroll,{passive:!0}),document.addEventListener("scroll",this._onScroll,{passive:!0,capture:!0}),this.onResize=this.handleResize.bind(this),window.addEventListener("resize",this.onResize)}addUpdateCallback(t){this.updateCallbacks.push(t)}startLoop(t){if(this.isRunning)return;this.camera=t,this.isRunning=!0,this.clock.getDelta();let a=!1;const i=()=>{if(!this.isRunning||(this.rafId=requestAnimationFrame(i),this._isScrolling&&(a=!a,a)))return;const s=this.clock.getDelta();for(const n of this.updateCallbacks)n(s);this.renderer.render(this.scene,this.camera)};i()}stopLoop(){this.isRunning=!1,this.rafId&&cancelAnimationFrame(this.rafId),this.rafId=0}handleResize(){if(!this.container||!this.camera)return;const t=this.container.clientWidth,a=this.container.clientHeight;this.camera.aspect=t/a,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,a)}dispose(){this.stopLoop(),window.removeEventListener("resize",this.onResize),this._onScroll&&(window.removeEventListener("scroll",this._onScroll),document.removeEventListener("scroll",this._onScroll,!0)),this.renderer.dispose(),this.renderer.domElement.parentElement&&this.renderer.domElement.parentElement.removeChild(this.renderer.domElement)}}const $n={front:{radius:2.3,theta:0,phi:Math.PI*.49,targetY:0},back:{radius:2.3,theta:Math.PI,phi:Math.PI*.49,targetY:0},free:{radius:2.3,theta:Math.PI*.25,phi:Math.PI*.38,targetY:0}};class Tn{constructor(t,a){const i=t.clientWidth/t.clientHeight;this.camera=new Js(38,i,.1,100),this.controls=new Ks(this.camera,a),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.minDistance=1,this.controls.maxDistance=3.8,this.controls.maxPolarAngle=Math.PI*.78,this.controls.minPolarAngle=Math.PI*.18,this.controls.target.set(0,0,0),this.currentRadius=2.3,this.currentTheta=0,this.currentPhi=Math.PI*.49,this.currentTargetY=0,this.targetRadius=2.3,this.targetTheta=0,this.targetPhi=Math.PI*.49,this.targetTargetY=0,this.isTransitioning=!1,this.spherical=new tn,this._scratchOffset=new Xe,this.applySpherical(),this.controls.update(),this.bindTouchScrollBridge(t,a)}applySpherical(){this.spherical.set(this.currentRadius,this.currentPhi,this.currentTheta),this.camera.position.setFromSpherical(this.spherical),this.camera.position.y+=this.currentTargetY,this.controls.target.set(0,this.currentTargetY,0),this.camera.lookAt(this.controls.target)}update(t){if(this.isTransitioning){const a=Math.min(t*14,.45);let i=this.targetTheta-this.currentTheta;for(;i>Math.PI;)i-=2*Math.PI;for(;i<-Math.PI;)i+=2*Math.PI;this.currentTheta+=i*a,this.currentPhi+=(this.targetPhi-this.currentPhi)*a,this.currentRadius+=(this.targetRadius-this.currentRadius)*a,this.currentTargetY+=(this.targetTargetY-this.currentTargetY)*a,this.applySpherical(),Math.abs(i)<.005&&Math.abs(this.targetPhi-this.currentPhi)<.005&&(this.currentTheta=this.targetTheta,this.currentPhi=this.targetPhi,this.currentRadius=this.targetRadius,this.currentTargetY=this.targetTargetY,this.applySpherical(),this.isTransitioning=!1,this.controls.update())}else{this.controls.update();const a=this._scratchOffset.copy(this.camera.position).sub(this.controls.target);this.spherical.setFromVector3(a),this.currentRadius=this.spherical.radius,this.currentPhi=this.spherical.phi,this.currentTheta=this.spherical.theta,this.currentTargetY=this.controls.target.y}}flyToView(t){const a=$n[t];if(!a)return;const i=this._scratchOffset.copy(this.camera.position).sub(this.controls.target);this.spherical.setFromVector3(i),this.currentRadius=this.spherical.radius,this.currentPhi=this.spherical.phi,this.currentTheta=this.spherical.theta,this.currentTargetY=this.controls.target.y,this.targetRadius=a.radius,this.targetTheta=a.theta,this.targetPhi=a.phi,this.targetTargetY=a.targetY,this.isTransitioning=!0}setAutoRotate(t){this.controls.autoRotate=t,this.controls.autoRotateSpeed=1.4}setFlatMode(t,a="front"){if(this.isFlatMode=t,this.controls.enableRotate=!t,t){const i=a==="back";this.targetRadius=2.2,this.targetTheta=i?Math.PI:0,this.targetPhi=Math.PI*.5,this.targetTargetY=0,this.isTransitioning=!0}}bindTouchScrollBridge(t,a){let i=0,s=0,n=!1,o=!1;const r=c=>{c.touches.length===1&&(i=c.touches[0].clientY,s=c.touches[0].clientX,n=!1,o=!1)},l=c=>{if(c.touches.length!==1)return;const d=c.touches[0].clientY,g=c.touches[0].clientX,p=d-i,h=g-s;if(o||(Math.abs(p)>7||Math.abs(h)>7)&&(o=!0,n=Math.abs(p)>Math.abs(h)*1.15),n){const u=document.querySelector(".studio-fullscreen-workspace");u&&(u.scrollTop-=p,i=d)}};a.addEventListener("touchstart",r,{passive:!0}),a.addEventListener("touchmove",l,{passive:!0}),this._cleanupTouch=()=>{a.removeEventListener("touchstart",r),a.removeEventListener("touchmove",l)}}dispose(){this._cleanupTouch&&this._cleanupTouch(),this.controls.dispose()}}class In{constructor(t){this.scene=t,this.setupLights()}setupLights(){const t=new en(16777215,.7);this.scene.add(t);const a=new ae(16775149,1.4);a.position.set(2.5,3.5,3),a.castShadow=!0,a.shadow.mapSize.width=1024,a.shadow.mapSize.height=1024,a.shadow.camera.near=.5,a.shadow.camera.far=10,a.shadow.bias=-.001,this.scene.add(a);const i=new ae(14742270,.8);i.position.set(-2.5,1.5,2),this.scene.add(i);const s=new ae(16777215,1.1);s.position.set(0,3,-3),this.scene.add(s);const n=new ae(16777215,.35);n.position.set(0,-2.5,1),this.scene.add(n)}}class Dn{constructor(){this.dracoLoader=new an,this.dracoLoader.setDecoderPath(tt("draco/")),this.dracoLoader.setDecoderConfig({type:"js"}),this.gltfLoader=new sn,this.gltfLoader.setDRACOLoader(this.dracoLoader)}async loadModel(t,a){const i=tt(t),s=i.includes("mug_11oz");return new Promise((n,o)=>{this.gltfLoader.load(i,r=>{const l=r.scene,c=new nn({map:a,roughness:s?.16:.88,metalness:s?.04:.02,side:on});c.userData.uBaseFabricColor={value:new Ye(16777215)},c.userData.uIsMug={value:s?1:0},c.userData.uIsMagicMug={value:0},c.userData.uHeatLevel={value:0},c.customProgramCacheKey=()=>s?"mug_thermochromic_v4":"clo_fabric_material_v7",c.onBeforeCompile=S=>{S.uniforms.uBaseFabricColor=c.userData.uBaseFabricColor,S.uniforms.uIsMug=c.userData.uIsMug,S.uniforms.uIsMagicMug=c.userData.uIsMagicMug,S.uniforms.uHeatLevel=c.userData.uHeatLevel,S.vertexShader=S.vertexShader.replace("#include <common>",`#include <common>
              varying float vIsInnerLining;
              varying vec3 vLocalPos;`),S.vertexShader=S.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
              float isInner = 0.0;
              if (position.y > 0.50 && length(position.xz) < 0.11) {
                if (dot(normal.xz, position.xz) < 0.0) {
                  isInner = 1.0;
                }
              }
              vIsInnerLining = isInner;
              vLocalPos = position;`),S.fragmentShader=S.fragmentShader.replace("#include <common>",`#include <common>
              uniform vec3 uBaseFabricColor;
              uniform float uIsMug;
              uniform float uIsMagicMug;
              uniform float uHeatLevel;
              varying float vIsInnerLining;
              varying vec3 vLocalPos;`),S.fragmentShader=S.fragmentShader.replace("#include <map_fragment>",`#ifdef USE_MAP
                if (uIsMug > 0.5) {
                  vec4 texelColor = texture2D( map, vMapUv );
                  // Máscara 3D cilíndrica suave: paredes internas + fondo interno + borde superior circular perfecto en blanco porcelana
                  float rCyl = length(vLocalPos.xz);
                  float innerMask = (1.0 - smoothstep(0.428, 0.434, rCyl)) * smoothstep(-0.445, -0.415, vLocalPos.y);
                  vec3 porcelainWhite = vec3(0.97, 0.97, 0.99);
                  if (uIsMagicMug > 0.5) {
                    vec3 magicBlack = vec3(0.055, 0.06, 0.075);
                    float hNorm = clamp(vLocalPos.y + 0.5, 0.0, 1.0);
                    float wave = sin(vLocalPos.x * 16.0 + uHeatLevel * 9.0) * 0.018 + cos(vLocalPos.z * 16.0 - uHeatLevel * 6.0) * 0.012;
                    float front = uHeatLevel * 1.22 - 0.11 + wave;
                    float reveal = step(0.005, uHeatLevel) * (1.0 - smoothstep(front - 0.05, front + 0.05, hNorm));
                    float edgeGlow = smoothstep(0.0, 0.5, reveal) * smoothstep(1.0, 0.5, reveal) * 4.0;
                    float activeHeat = step(0.01, uHeatLevel) * step(uHeatLevel, 0.99);
                    vec3 reacted = mix(magicBlack, texelColor.rgb, reveal);
                    reacted += vec3(1.0, 0.30, 0.06) * edgeGlow * activeHeat * 0.45;
                    diffuseColor.rgb *= mix(reacted, porcelainWhite, innerMask);
                  } else {
                    diffuseColor.rgb *= mix(texelColor.rgb, porcelainWhite, innerMask);
                  }
                } else if (!gl_FrontFacing || vIsInnerLining > 0.5) {
                  diffuseColor.rgb = uBaseFabricColor * 0.88;
                } else {
                  vec4 sampledDiffuseColor = texture2D( map, vMapUv );
                  diffuseColor *= sampledDiffuseColor;
                }
              #else
                if (!gl_FrontFacing || vIsInnerLining > 0.5) {
                  diffuseColor.rgb = uBaseFabricColor * 0.88;
                }
              #endif`)},s&&(l.rotation.y=Math.PI*.5);const d=new rn().setFromObject(l),g=new Xe;d.getSize(g);const p=new Xe;d.getCenter(p);const h=s?.78:1.05,u=h/(g.y||1);l.position.x=s?0:-p.x,l.position.y=-p.y,l.position.z=s?0:-p.z;const m=new ln;m.scale.setScalar(u),m.add(l);const f=document.createElement("canvas");f.width=128,f.height=128;const y=f.getContext("2d"),v=y.createRadialGradient(64,64,0,64,64,64);v.addColorStop(0,"rgba(0, 0, 0, 0.55)"),v.addColorStop(.4,"rgba(0, 0, 0, 0.2)"),v.addColorStop(1,"rgba(0, 0, 0, 0)"),y.fillStyle=v,y.fillRect(0,0,128,128);const w=new cn(.85,.45);w.rotateX(-Math.PI/2);const b=new dn({map:new ma(f),transparent:!0,opacity:.65,depthWrite:!1}),x=new un(w,b);x.position.set(0,-h*.51,0),m.add(x);let E=0;l.traverse(S=>{S.isMesh&&(E++,S.castShadow=!0,S.receiveShadow=!0,a&&(S.material=c))}),console.log(`[GltfShirtLoader] Modelo CLO3D cargado con éxito (${E} mallas).`),n({scene:m,material:c,dispose:()=>{l.traverse(S=>{S.isMesh&&(S.geometry.dispose(),S.material&&S.material.dispose&&S.material.dispose())})}})},void 0,r=>{console.error("[GltfShirtLoader] Error al cargar modelo GLB:",r),o(r)})})}dispose(){this.dracoLoader.dispose()}}const ht={front:{id:"front",name:"Frente Central",icon:"👕",defaultView:"front",canvasArea:{x:572,y:720,width:440,height:440},canvasAreaBySilhouette:{man:{x:572,y:720,width:440,height:440,bounds:{minX:354,maxX:790,minY:320,maxY:940}},woman:{x:570,y:990,width:380,height:380,bounds:{minX:330,maxX:810,minY:500,maxY:1230}},mug:{x:1044,y:1024,width:640,height:640,baseCm:8,bounds:{minX:204,maxX:1884,minY:684,maxY:1364,strict:!0}}},limits:{minScale:.2,maxScale:2.65,minOffset:-2.5,maxOffset:2.2}},frontPocket:{id:"frontPocket",name:"Logo Pecho (Bolsillo)",icon:"🏷️",defaultView:"front",canvasArea:{x:428,y:755,width:220,height:220},canvasAreaBySilhouette:{man:{x:428,y:755,width:220,height:220,bounds:{minX:260,maxX:560,minY:520,maxY:940}},woman:{x:420,y:1100,width:190,height:190,bounds:{minX:280,maxX:540,minY:920,maxY:1250}}},limits:{minScale:.2,maxScale:1.8,minOffset:-2.2,maxOffset:2.2}},back:{id:"back",name:"Espalda",icon:"🔙",defaultView:"back",canvasArea:{x:1536,y:720,width:460,height:460},canvasAreaBySilhouette:{man:{x:1536,y:720,width:460,height:460,bounds:{minX:1306,maxX:1766,minY:320,maxY:940}},woman:{x:1536,y:990,width:400,height:400,bounds:{minX:1296,maxX:1776,minY:500,maxY:1230}}},limits:{minScale:.2,maxScale:2.2,minOffset:-2.5,maxOffset:2.2}}},Ba=54,Li=.2,rt={FIXED:"fixed",PROPORTIONAL:"proportional"},Pn=2.2,On=1.3,Rn=28,ga=8,Ce=21,ki=8.5,pt=()=>typeof window<"u"&&window.__STORE_SILHOUETTE__==="mug",Ae={front:{baseCm:28,defaultScale:1},frontPocket:{baseCm:11,defaultScale:.85,maxWidthCm:12,maxHeightCm:12},back:{baseCm:29,defaultScale:1}},_n={front:[10,15,21,28],frontPocket:[5,8,10],back:[10,15,21,28],mug:[6,10,15]},dt=e=>Math.round(e*10)/10;function zn(e){var t;return((t=Ae[e])==null?void 0:t.defaultScale)??1}function me(e){return pt()?1:((e==null?void 0:e.widthCm)||Ba)/Ba}function mt(e){if(!e)return 1;const t=e.naturalWidth||e.width||1,a=e.naturalHeight||e.height||1;return t/a}function ut(e,t,a,i=1){var r;if(pt()){const l=Math.min(ga*e,Ce),c=Math.min(l/(i||1),ki);return{w:l,h:c}}const s=(((r=Ae[t])==null?void 0:r.baseCm)??Rn)*me(a)*e;let n=s,o=n/i;return o>s*On&&(o=s,n=o*i),{w:n,h:o}}function _t(e,t){if(pt())return{maxW:Ce,maxH:ki};const a=Ae[e]||{},i=me(t);return{maxW:a.maxWidthCm?a.maxWidthCm*i:(t==null?void 0:t.maxPrintWidthCm)||32,maxH:a.maxHeightCm?a.maxHeightCm*i:(t==null?void 0:t.maxPrintHeightCm)||42}}function $i(e,t,a=1){var r,l;if(pt())return Ce/ga;const{maxW:i,maxH:s}=_t(e,t),n=ut(1,e,t,a),o=((l=(r=ht[e])==null?void 0:r.limits)==null?void 0:l.maxScale)??Pn;return Math.max(Math.min(i/n.w,s/n.h,o),.4)}function fa(e,t,a,i){const s=$i(t,a,mt(i));return Math.min(Math.max(e,Li),s)}function Nt(e,t,a,i){if(pt())return e/ga;const s=ut(1,t,a,mt(i));return e/s.w}function Fn(e,t,a){if(pt())return{min:2,max:Ce};const i=mt(a),s=ut(1,e,t,i);return{min:dt(s.w*Li),max:Math.floor(s.w*$i(e,t,i)*10)/10}}function qn(e,t){const{maxH:a}=_t(e,t);return{min:pt()?2:4,max:dt(a)}}function va(e,t,a){const{maxW:i,maxH:s}=_t(t,a),n={maxWidthCm:dt(i),maxHeightCm:dt(s)};if(!e)return{widthCm:0,heightCm:0,...n,usage:0,atLimit:!1,isLocked:!0};const o=e.lockAspect!==!1;let r,l;if((!o||pt())&&e.widthCm&&e.heightCm)r=Math.min(e.widthCm,i),l=Math.min(e.heightCm,s);else{const d=e.customAspect||mt(e.imageElement),g=ut(e.scale??1,t,a,d);r=Math.min(g.w,i),l=Math.min(g.h,s)}const c=Math.max(r/i,l/s);return{widthCm:dt(r),heightCm:dt(l),...n,usage:Math.min(c,1),atLimit:c>=.995,isLocked:o}}function Jt(e,t,a){if((e.lockAspect===!1||pt())&&e.widthCm&&e.heightCm){const{maxW:s,maxH:n}=_t(t,a);e.widthCm=Math.min(Math.max(e.widthCm,2),s),e.heightCm=Math.min(Math.max(e.heightCm,2),n),e.customAspect=e.widthCm/(e.heightCm||1);return}const i=ut(e.scale??1,t,a,mt(e.imageElement));e.widthCm=i.w,e.heightCm=i.h}function Ti(e,t,a,i,s){const n=(e==null?void 0:e.customAspect)||mt(e.imageElement);if((e==null?void 0:e.lockAspect)===!1&&e.widthCm&&e.heightCm){const{maxW:g,maxH:p}=_t(t,a),h=me(s),u=me(a),m=i===rt.FIXED?e.widthCm:e.widthCm*u/(h||1),f=i===rt.FIXED?e.heightCm:e.heightCm*u/(h||1),y=Math.min(m,g),v=Math.min(f,p),w=y<m-1e-6||v<f-1e-6;return{scale:e.scale??1,intentCm:e.widthCm,reduced:w,widthCm:dt(y),heightCm:dt(v),requestedWidthCm:dt(m)}}const o=e.widthCm??ut(e.scale??1,t,s,n).w,r=i===rt.FIXED?Nt(o,t,a,e.imageElement):e.scale??1,l=fa(r,t,a,e.imageElement),c=ut(l,t,a,n),d=ut(r,t,a,n);return{scale:l,intentCm:o,reduced:l<r-1e-6,widthCm:dt(c.w),heightCm:dt(c.h),requestedWidthCm:dt(d.w)}}function Bn(e,t,a,i,s){return a.map(n=>({id:n.id,label:n.label,...Ti(e,t,n,i,s)}))}function Nn(e,t){const a=pt()?"mug":e;return[...(_n[a]||[]).filter(s=>s>=t.min&&s<=t.max-.8).map(s=>({cm:s,label:`${s}`})),{cm:t.max,label:"Máx",isMax:!0}]}const Ii=.42,Di=.5;function Un(e,t="man"){const a=ht[e];return a?a.canvasAreaBySilhouette&&a.canvasAreaBySilhouette[t]||a.canvasArea:null}function Pi(e="man"){return 1}function Oi(e,t,a=1,i=null){var c,d,g;const s=t.baseCm||28,n=(t.width||440)/s;if(i&&(i.lockAspect===!1||t.baseCm===8)&&i.widthCm&&i.heightCm){const p=(c=t.bounds)!=null&&c.strict?t.bounds.maxX-t.bounds.minX:1/0,h=(d=t.bounds)!=null&&d.strict?t.bounds.maxY-t.bounds.minY:1/0;return{w:Math.min(i.widthCm*n,p),h:Math.min(i.heightCm*n,h)}}const o=i&&i.customAspect?i.customAspect:(e.naturalWidth||e.width)/(e.naturalHeight||e.height||1);let r=t.width*a,l=r/o;if((g=t.bounds)!=null&&g.strict){const p=t.bounds.maxX-t.bounds.minX,h=t.bounds.maxY-t.bounds.minY;r=Math.min(r,p),l=Math.min(l,h)}else l>t.height*a*1.8&&(l=t.height*a*1.8,r=l*o);return{w:r,h:l}}function Ri(e,t,a=0){const i=a*Math.PI/180,s=Math.abs(Math.cos(i)),n=Math.abs(Math.sin(i));return{w:(e*s+t*n)/2,h:(e*n+t*s)/2}}function _i(e,t){return 0}function zi(e,t,a,i){const s=_i();return{x:e.x+s+a*(e.width*Ii),y:e.y+i*Pi(t)*(e.height*Di)}}function Hn(e,t,a,i){const s=_i();return{offsetX:(a-(e.x+s))/(e.width*Ii),offsetY:(i-e.y)/(Pi(t)*e.height*Di)}}function Fi(e,t,a){if(!a)return e;const i=(d,g,p)=>Math.min(Math.max(d,g),p);if(a.strict){const d=a.minX+t.w,g=a.maxX-t.w,p=a.minY+t.h,h=a.maxY-t.h;return{x:d<=g?i(e.x,d,g):(a.minX+a.maxX)*.5,y:p<=h?i(e.y,p,h):(a.minY+a.maxY)*.5}}const s=(a.maxX-a.minX)*.35,n=(a.maxY-a.minY)*.6,o=a.minX-s,r=a.maxX+s,l=a.minY-n,c=a.maxY+n;return{x:i(e.x,o,r),y:i(e.y,l,c)}}function ba(e,t,a){const i=a.offsetX||0,s=a.offsetY||0,n=Un(e,t);if(!n||!n.bounds||!a.imageElement)return{offsetX:i,offsetY:s};const{w:o,h:r}=Oi(a.imageElement,n,a.scale??1,a),l=Ri(o,r,a.rotation||0),c=zi(n,t,i,s),d=Fi(c,l,n.bounds);return Hn(n,t,d.x,d.y)}function jn(e=512,t=512){const a=document.createElement("canvas");a.width=e,a.height=t;const i=a.getContext("2d");i.fillStyle="#ffffff",i.fillRect(0,0,e,t);const s=i.getImageData(0,0,e,t),n=s.data;for(let o=0;o<t;o++)for(let r=0;r<e;r++){const l=(o*e+r)*4,c=Math.sin(r*1.6),d=Math.cos(o*1.6),g=(Math.random()-.5)*8,p=Math.floor(245+c*d*6+g);n[l]=p,n[l+1]=p,n[l+2]=p,n[l+3]=255}return i.putImageData(s,0,0),a}function Vn(e,t,a){e.save(),e.globalCompositeOperation="multiply",e.globalAlpha=.18;const i=e.createRadialGradient(512,180,50,512,180,300);i.addColorStop(0,"rgba(0,0,0,0.5)"),i.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=i,e.fillRect(200,50,624,300);const s=e.createRadialGradient(1536,180,50,1536,180,300);s.addColorStop(0,"rgba(0,0,0,0.5)"),s.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=s,e.fillRect(1224,50,624,300),e.fillStyle="rgba(0,0,0,0.06)",e.beginPath(),e.ellipse(512,1100,260,40,0,0,Math.PI*2),e.fill(),e.restore()}class Gn{constructor(t=2048){this.size=t,this.canvas=document.createElement("canvas"),this.canvas.width=t,this.canvas.height=t,this.ctx=this.canvas.getContext("2d"),this.patternCanvas=jn(512,512),this.baseCanvas=document.createElement("canvas"),this.baseCanvas.width=t,this.baseCanvas.height=t,this.baseCtx=this.baseCanvas.getContext("2d"),this.baseKey=null,this.texture=new ma(this.canvas),this.texture.colorSpace=Si,this.texture.anisotropy=16,this.texture.generateMipmaps=!0,this.texture.minFilter=hn,this.texture.magFilter=pn}getTexture(){return this.texture}getCanvas(){return this.canvas}ensureBaseLayer(t,a=!1){const i=a?"#ffffff":t,s=`${i}_${a?"mug":"shirt"}`;if(this.baseKey===s)return;const{baseCtx:n,size:o}=this;n.clearRect(0,0,o,o),n.fillStyle=i,n.fillRect(0,0,o,o),a||(n.save(),n.globalCompositeOperation="multiply",n.globalAlpha=.22,n.fillStyle=n.createPattern(this.patternCanvas,"repeat"),n.fillRect(0,0,o,o),n.restore(),Vn(n)),this.baseKey=s}compose(t){const{ctx:a,size:i}=this,{selectedColor:s,customizations:n}=t,o=t.selectedSilhouette||"man",r=o==="mug";this.ensureBaseLayer(s.hex,r),a.clearRect(0,0,i,i),a.imageSmoothingEnabled=!0,a.imageSmoothingQuality="high",a.drawImage(this.baseCanvas,0,0);for(const[l,c]of Object.entries(ht)){if(r&&l!=="front")continue;const d=n[l];if(d&&d.hasDecal&&d.imageElement){const g=c.canvasAreaBySilhouette&&c.canvasAreaBySilhouette[o]||c.canvasArea;this.drawDecal(a,d,g,o)}}this.texture.needsUpdate=!0}drawDecal(t,a,i,s="man"){const n=a.imageElement;if(!n)return;t.save(),t.imageSmoothingEnabled=!0,t.imageSmoothingQuality="high",t.beginPath(),s==="mug"?t.rect(204,684,1680,680):t.rect(i.x-i.width*.9,i.y-i.height*2.2,i.width*1.8,i.height*4.4),t.clip();const{w:o,h:r}=Oi(n,i,a.scale,a);let l=zi(i,s,a.offsetX,a.offsetY);if(i.bounds){const g=Ri(o,r,a.rotation||0);l=Fi(l,g,i.bounds)}const c=l.x,d=l.y;t.translate(c,d),t.scale(1,-1),a.rotation&&t.rotate(a.rotation*Math.PI/180),t.globalAlpha=a.opacity??1,t.drawImage(n,-o/2,-r/2,o,r),t.restore()}dispose(){this.texture.dispose()}}class Yn{constructor(t,a=180){this.scene=t,this.count=a,this.clock=new Mi;const i=this.createCircleTexture(),s=new mn,n=new Float32Array(a*3),o=new Float32Array(a),r=new Float32Array(a);for(let l=0;l<a;l++){const c=.8+Math.random()*2.2,d=Math.random()*Math.PI*2;n[l*3]=Math.cos(d)*c,n[l*3+1]=(Math.random()-.5)*3.2,n[l*3+2]=Math.sin(d)*c,o[l]=Math.random()*.8+.3,r[l]=Math.random()*Math.PI*2}s.setAttribute("position",new Fa(n,3)),s.setAttribute("scale",new Fa(o,1)),this.phases=r,this.initialY=n.filter((l,c)=>c%3===1),this.material=new gn({color:16737826,size:.045,map:i,transparent:!0,opacity:.45,blending:fn,depthWrite:!1}),this.points=new vn(s,this.material),this.points.visible=!1,this.scene.add(this.points),window.addEventListener("themechange",l=>{var d;const c=((d=l.detail)==null?void 0:d.theme)==="light";this.material.color.setHex(c?17595:16737826),this.material.opacity=c?.55:.45})}createCircleTexture(){const t=document.createElement("canvas");t.width=64,t.height=64;const a=t.getContext("2d"),i=a.createRadialGradient(32,32,0,32,32,32);i.addColorStop(0,"rgba(255, 255, 255, 1)"),i.addColorStop(.3,"rgba(255, 180, 100, 0.7)"),i.addColorStop(.8,"rgba(255, 100, 20, 0.2)"),i.addColorStop(1,"rgba(0, 0, 0, 0)"),a.fillStyle=i,a.fillRect(0,0,64,64);const s=new ma(t);return s.generateMipmaps=!1,s}setVisible(t){this.points&&(this.points.visible=t)}isVisible(){return this.points?this.points.visible:!1}update(t){if(!this.points||!this.points.visible)return;const a=this.clock.getElapsedTime(),i=this.points.geometry.attributes.position,s=i.array;for(let n=0;n<this.count;n++){const o=n*3;s[o+1]+=Math.sin(a*.8+this.phases[n])*.0018,s[o]+=Math.cos(a*.5+this.phases[n])*.0012,s[o+1]>1.8&&(s[o+1]=-1.5),s[o+1]<-1.5&&(s[o+1]=1.8)}i.needsUpdate=!0,this.points.rotation.y=a*.025}dispose(){this.points&&(this.scene.remove(this.points),this.points.geometry.dispose(),this.material.dispose())}}const G={baseShirtPrice:55e3,baseMugPrice:28e3,magicMugAddon:1e4,zonePrices:{front:0,frontPocket:12e3,back:18e3},sizeAddons:{S:0,M:0,L:0,XL:3e3,XXL:6e3},supportPhone:"573015063187"};function K(e){return new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(e)}const Xn=[{id:"algodon",name:"Algodón 100% Peinado",shortName:"Algodón",badge:"Heavyweight & Soft Touch",description:"Tejido natural peinado de alta densidad, tacto sedoso y máxima fijación térmica para estampados DTF.",icon:"🧵"},{id:"poliester",name:"Poliéster Deportivo Dry-Fit",shortName:"Poliéster",badge:"Transpirable & Flex",description:"Microfibra técnica ligera de secado rápido, elástica y resistente para alto rendimiento y estilo urbano.",icon:"⚡"}],ce=[{id:"120",label:"120 GSM",title:"Ultra Liviana",tag:"Dry-Fit / Liviano",priceModifier:-5e3,description:"Tejido ultra fresco, flexible y ligero para climas cálidos y deportes."},{id:"180",label:"180 GSM",title:"Standard Fit",tag:"Clásico Urbano",priceModifier:0,description:"Calibre intermedio clásico, suave al tacto y equilibrado para todo el día."},{id:"240",label:"240 GSM",title:"Heavyweight Boxy",tag:"Atelier Streetwear",priceModifier:4e3,description:"Gramaje grueso estructurado con caída pesada y cuello indeformable de 3 cm."}],Wn={selectedColor:Pt[0],selectedSilhouette:"man",isMagicMug:!1,mugHeatLevel:0,selectedMaterial:"algodon",selectedGrammage:"240",selectedSize:Rt[2],sizeMode:"fixed",activeZone:"front",activeView:"front",viewMode:"3d",isAutoRotate:!1,customizations:{front:{hasDecal:!1,imageSrc:null,imageElement:null,name:"",scale:1,offsetX:0,offsetY:0,rotation:0,widthCm:null,heightCm:null,lockAspect:!0,customAspect:null,opacity:1},frontPocket:{hasDecal:!1,imageSrc:null,imageElement:null,name:"",scale:.85,offsetX:0,offsetY:0,rotation:0,widthCm:null,heightCm:null,lockAspect:!0,customAspect:null,opacity:1},back:{hasDecal:!1,imageSrc:null,imageElement:null,name:"",scale:1,offsetX:0,offsetY:0,rotation:0,widthCm:null,heightCm:null,lockAspect:!0,customAspect:null,opacity:1}},pricing:{basePrice:G.baseShirtPrice,addonsTotal:0,total:G.baseShirtPrice}};class Zn{constructor(){this.state=structuredClone(Wn),this.listeners=new Set}getState(){return this.state}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(t){this.calculatePricing();for(const a of this.listeners)try{a(this.state,t)}catch(i){console.error("[Store] Error en listener:",i)}}calculatePricing(){if(this.state.selectedSilhouette==="mug"){const s=G.baseMugPrice,n=this.state.isMagicMug?G.magicMugAddon:0;this.state.pricing.basePrice=s,this.state.pricing.addonsTotal=n,this.state.pricing.total=s+n;return}this.state.pricing.basePrice=G.baseShirtPrice;let t=0;const a=this.state.customizations;for(const[s,n]of Object.entries(a))n&&n.hasDecal&&(t+=G.zonePrices[s]||0);t+=G.sizeAddons[this.state.selectedSize.id]||0;const i=ce.find(s=>s.id===this.state.selectedGrammage);i&&i.priceModifier&&(t+=i.priceModifier),this.state.pricing.addonsTotal=t,this.state.pricing.total=Math.max(35e3,this.state.pricing.basePrice+t)}}const C=new Zn;function ge(e){const t=C.getState();t.selectedColor=e,C.notify("color")}function qi(e){const t=C.getState(),a=t.selectedSize;t.selectedSize=e;const i=t.selectedSilhouette||"man",s=[];for(const[n,o]of Object.entries(t.customizations)){if(!o||!o.hasDecal)continue;const r=Ti(o,n,e,t.sizeMode,a);o.scale=r.scale,t.sizeMode===rt.FIXED?o.widthCm=r.intentCm:Jt(o,n,e),r.reduced&&s.push({zoneId:n,requestedCm:r.requestedWidthCm,appliedCm:r.widthCm});const l=ba(n,i,o);o.offsetX=l.offsetX,o.offsetY=l.offsetY}return C.notify("size"),s}function Qn(e){const t=C.getState();if(!(!Object.values(rt).includes(e)||t.sizeMode===e)){t.sizeMode=e;for(const[a,i]of Object.entries(t.customizations))i&&i.hasDecal&&Jt(i,a,t.selectedSize);C.notify("sizeMode")}}function Bi(e){const t=C.getState();t.activeZone=e,C.notify("activeZone")}function We(e){const t=C.getState();t.activeView=e,C.notify("view")}function Jn(){const e=C.getState();e.isAutoRotate=!e.isAutoRotate,C.notify("autoRotate")}function lt(e,{name:t,src:a,imageElement:i}){const s=C.getState();typeof window<"u"&&(window.__STORE_SILHOUETTE__=s.selectedSilhouette);const n=s.customizations[e];n&&(n.hasDecal=!0,n.name=t||"Diseño personalizado",n.imageSrc=a,n.imageElement=i,n.lockAspect=!0,n.customAspect=null,n.widthCm=null,n.heightCm=null,n.offsetX=0,n.offsetY=0,n.scale=1,n.scale=fa(n.scale,e,s.selectedSize,i),Jt(n,e,s.selectedSize),C.notify(`decal:${e}`))}function Kn(e){const a=C.getState().customizations[e];a&&(a.hasDecal=!1,a.name="",a.imageSrc=null,a.imageElement=null,a.widthCm=null,a.heightCm=null,a.lockAspect=!0,a.customAspect=null,C.notify(`decal:${e}`))}function to(e){const t=C.getState();typeof window<"u"&&(window.__STORE_SILHOUETTE__=t.selectedSilhouette);const a=t.customizations[e];if(!a)return;const i=a.lockAspect===!1;if(a.lockAspect=i,!i){const s=ut(a.scale??1,e,t.selectedSize,mt(a.imageElement));a.widthCm||(a.widthCm=s.w),a.heightCm||(a.heightCm=s.h),a.customAspect=a.widthCm/(a.heightCm||1)}C.notify(`transform:${e}`)}function Dt(e,{scale:t,widthCm:a,heightCm:i,lockAspect:s,offsetX:n,offsetY:o,rotation:r}){const l=C.getState();typeof window<"u"&&(window.__STORE_SILHOUETTE__=l.selectedSilhouette);const c=l.customizations[e];if(!c)return;s!==void 0&&(c.lockAspect=s);const d=c.lockAspect!==!1,g=l.selectedSilhouette==="mug",p=mt(c.imageElement),h=d&&g?p:c.customAspect||p;a!==void 0&&i!==void 0?(c.widthCm=a,c.heightCm=i,c.customAspect=a/(i||1),t=Nt(a,e,l.selectedSize,c.imageElement)):a!==void 0?d?(c.widthCm=a,c.heightCm=a/h,t=Nt(a,e,l.selectedSize,c.imageElement)):(c.widthCm=a,c.customAspect=c.heightCm?a/c.heightCm:h,t=Nt(a,e,l.selectedSize,c.imageElement)):i!==void 0&&(d?(c.heightCm=i,c.widthCm=i*h,t=Nt(c.widthCm,e,l.selectedSize,c.imageElement)):(c.heightCm=i,c.customAspect=c.widthCm?c.widthCm/i:h)),t!==void 0&&(c.scale=fa(t,e,l.selectedSize,c.imageElement),Jt(c,e,l.selectedSize)),n!==void 0&&(c.offsetX=Math.max(-2.5,Math.min(2.5,n))),o!==void 0&&(c.offsetY=Math.max(-2.5,Math.min(2.5,o))),r!==void 0&&(c.rotation=(r%360+360)%360);const u=l.selectedSilhouette||"man",m=ba(e,u,c);c.offsetX=m.offsetX,c.offsetY=m.offsetY,C.notify(`transform:${e}`)}function eo(e){const t=C.getState();t.viewMode!==e&&(t.viewMode=e,C.notify("viewMode"))}function Ni(e){var n;const t=C.getState();if(t.selectedSilhouette===e)return;const a=t.selectedSilhouette==="mug",i=e==="mug";if(t.selectedSilhouette=e,typeof window<"u"&&(window.__STORE_SILHOUETTE__=e),i&&(t.activeZone!=="front"&&(t.activeZone="front",C.notify("activeZone")),((n=t.selectedColor)==null?void 0:n.id)==="terracotta")){const o=Pt.find(r=>r.id==="chalk-white");o&&(t.selectedColor=o,C.notify("color"))}let s=!1;for(const[o,r]of Object.entries(t.customizations||{})){if(!r||!r.hasDecal)continue;a!==i&&(r.scale=1,r.offsetX=0,r.offsetY=0,r.widthCm=null,r.heightCm=null,r.customAspect=null,Jt(r,o,t.selectedSize),s=!0);const l=ba(o,e,r);(Math.abs(l.offsetX-(r.offsetX||0))>1e-6||Math.abs(l.offsetY-(r.offsetY||0))>1e-6)&&(r.offsetX=l.offsetX,r.offsetY=l.offsetY,s=!0)}C.notify("silhouette"),s&&t.activeZone&&C.notify(`transform:${t.activeZone}`)}function Ui(e){const t=C.getState(),a=!!e;t.isMagicMug!==a&&(t.isMagicMug=a,a||(t.mugHeatLevel=0),C.notify("magicMug"))}function fe(e){const t=C.getState(),a=Math.max(0,Math.min(1,Number(e)||0));Math.abs(t.mugHeatLevel-a)<1e-4||(t.mugHeatLevel=a,C.notify("mugHeat"))}function ao(e){const t=C.getState();t.selectedMaterial!==e&&(t.selectedMaterial=e,C.notify("material"))}function Na(e){const t=C.getState();t.selectedGrammage!==e&&(t.selectedGrammage=e,C.notify("grammage"))}class io{constructor(t){this.container=t,this.isDragging=!1,this.startX=0,this.startY=0,this.initOffsetX=0,this.initOffsetY=0,this.createHudIndicator(),this.bindEvents()}createHudIndicator(){this.hud=document.createElement("div"),this.hud.className="flat-drag-hud-badge",this.hud.innerHTML=`
      <span class="drag-hud-icon">✋</span>
      <span class="drag-hud-text">Arrastra en pantalla para mover el estampado</span>
    `,this.container.appendChild(this.hud),this.updateHudVisibility()}updateHudVisibility(){const t=C.getState(),a=t.viewMode==="flat",i=t.customizations[t.activeZone],s=i&&i.hasDecal;this.hud&&(a&&s?(this.hud.classList.add("visible"),this.container.style.cursor=this.isDragging?"grabbing":"grab"):(this.hud.classList.remove("visible"),this.container.style.cursor="default"))}bindEvents(){const t=s=>{var c,d;const n=C.getState();if(!(n.viewMode==="flat"||s.altKey||s.shiftKey))return;const l=n.customizations[n.activeZone];!l||!l.hasDecal||(this.isDragging=!0,this.startX=s.clientX,this.startY=s.clientY,this.initOffsetX=l.offsetX||0,this.initOffsetY=l.offsetY||0,(d=(c=this.container).setPointerCapture)==null||d.call(c,s.pointerId),this.container.style.cursor="grabbing",this.hud&&this.hud.classList.add("dragging"))},a=s=>{if(!this.isDragging)return;const n=C.getState(),o=this.container.getBoundingClientRect(),r=s.clientX-this.startX,l=s.clientY-this.startY,c=2.4/(o.height||600),d=n.activeView==="back",g=this.initOffsetX+(d?-r:r)*c,p=this.initOffsetY-l*c;Dt(n.activeZone,{offsetX:g,offsetY:p});const h=C.getState().customizations[n.activeZone],u=h?h.offsetX:g,m=h?h.offsetY:p;if(this.hud){const f=this.hud.querySelector(".drag-hud-text");f&&(f.textContent=`Posición: X: ${u>0?"+":""}${u.toFixed(2)} | Y: ${m>0?"+":""}${m.toFixed(2)}`)}},i=s=>{var o,r;if(!this.isDragging)return;this.isDragging=!1,(r=(o=this.container).releasePointerCapture)==null||r.call(o,s.pointerId);const n=C.getState();if(this.container.style.cursor=n.viewMode==="flat"?"grab":"default",this.hud){this.hud.classList.remove("dragging");const l=this.hud.querySelector(".drag-hud-text");l&&(l.textContent="Arrastra en pantalla para mover el estampado")}};this.container.addEventListener("pointerdown",t),window.addEventListener("pointermove",a),window.addEventListener("pointerup",i),window.addEventListener("pointercancel",i),C.subscribe((s,n)=>{(n==="viewMode"||n==="activeZone"||n&&n.startsWith("decal:"))&&this.updateHudVisibility()})}}const de={get man(){return tt("models/shirt_clo_draco.glb?v=17")},get woman(){return tt("models/shirt_woman_seam_draco.glb?v=1")},get mug(){return tt("models/mug_11oz_draco.glb?v=2")}},so={man:"Cargando silueta masculina • Boxy Fit...",woman:"Cargando silueta femenina • Slim Fit...",mug:"Cargando Vaso Cerámico • Mug 11 Oz..."};class no{constructor(t,a){this.engine=t,this.container=a,this.cache=new Map,this.swapToken=0,this.currentKey="man",this.overlay=null,this.labelEl=null,this.createOverlay()}createOverlay(){if(!this.container)return;const t=document.createElement("div");t.className="model-swap-overlay",t.innerHTML=`
      <div class="model-swap-spinner"></div>
      <div class="model-swap-pill" id="model-swap-label">Cargando silueta...</div>
    `,this.container.appendChild(t),this.overlay=t,this.labelEl=t.querySelector("#model-swap-label")}showOverlay(t){this.labelEl&&t&&(this.labelEl.textContent=t),this.overlay&&this.overlay.classList.add("active")}hideOverlay(){this.overlay&&this.overlay.classList.remove("active")}async preload(t){const a=de[t];if(!(!a||this.cache.has(a)))try{const i=this.engine.textureComposer.getTexture(),s=await this.engine.gltfLoader.loadModel(a,i);s&&this.cache.set(a,s)}catch(i){console.warn(`[ModelSwap] Falló precarga en background para ${t}:`,i)}}schedulePreloadOther(t){const a=t==="man"?"woman":"man";setTimeout(()=>this.preload(a),1200)}async swapTo(t,a){var o;if(this.currentKey===t&&this.engine.activeMeshGroup)return;this.swapToken++;const i=this.swapToken,s=de[t]||de.man,n=so[t]||"Cargando silueta...";this.showOverlay(n),this.engine.activeMeshGroup&&(this.engine.activeMeshGroup.visible=!1);try{let r=this.cache.get(s);if(!r){const l=this.engine.textureComposer.getTexture();r=await this.engine.gltfLoader.loadModel(s,l),r&&this.cache.set(s,r)}if(i!==this.swapToken)return;if(r&&r.scene){this.engine.activeMeshGroup&&this.engine.sceneManager.scene.remove(this.engine.activeMeshGroup),r.scene.visible=!0,this.engine.activeMeshGroup=r.scene,this.engine.cloModelInstance=r,this.engine.sceneManager.scene.add(r.scene),this.currentKey=t;const l=a.selectedColor,c=(o=r.material)==null?void 0:o.userData;c!=null&&c.uBaseFabricColor&&(l!=null&&l.hex)&&c.uBaseFabricColor.value.set(l.hex),c!=null&&c.uIsMagicMug&&(c.uIsMagicMug.value=a.isMagicMug?1:0),c!=null&&c.uHeatLevel&&(c.uHeatLevel.value=a.mugHeatLevel??0),this.engine.textureComposer.compose(a),setTimeout(()=>{i===this.swapToken&&this.hideOverlay()},220)}}catch(r){console.error("[ModelSwap] Error durante cambio de modelo:",r),this.hideOverlay()}}dispose(){this.cache.clear(),this.overlay&&this.overlay.parentNode&&this.overlay.parentNode.removeChild(this.overlay)}}class oo{constructor(t){this.container=t,this.sceneManager=new kn(t),this.textureComposer=new Gn(2048),this.cameraManager=new Tn(t,this.sceneManager.renderer.domElement),this.lighting=new In(this.sceneManager.scene),this.particles=new Yn(this.sceneManager.scene,Ln()),this.dragController=new io(t),this.activeMeshGroup=null,this.gltfLoader=new Dn,this.modelSwap=new no(this,t),this.loadCloModel(de.man);let a=0;this.sceneManager.addUpdateCallback(s=>{if(a+=s,this.cameraManager.update(s),this.particles.update(s),this.activeMeshGroup){const n=C.getState().viewMode==="flat";this.activeMeshGroup.position.y=n?0:-.02+Math.sin(a*1.3)*.005}}),((window.location.hash||"").toLowerCase().includes("estudio")||document.documentElement.classList.contains("route-studio"))&&this.sceneManager.startLoop(this.cameraManager.camera),this.unsubscribe=C.subscribe((s,n)=>{this.handleStateChange(s,n)}),this.textureComposer.compose(C.getState())}async loadCloModel(t){var a,i;try{console.log("[ShirtEngine] Cargando modelo real CLO3D desde:",t),this.modelSwap&&this.modelSwap.showOverlay("Cargando silueta masculina • Boxy Fit...");const s=await this.gltfLoader.loadModel(t,this.textureComposer.getTexture());if(s&&s.scene){this.modelSwap&&(this.modelSwap.cache.set(t,s),this.modelSwap.schedulePreloadOther("man"));const n=document.getElementById("studio-canvas-loader");if(n&&(n.classList.add("fade-out"),setTimeout(()=>n.remove(),400)),C.getState().selectedSilhouette!=="man")return;this.activeMeshGroup&&this.sceneManager.scene.remove(this.activeMeshGroup),this.activeMeshGroup=s.scene,this.sceneManager.scene.add(this.activeMeshGroup),this.cloModelInstance=s,this.modelSwap&&setTimeout(()=>this.modelSwap.hideOverlay(),250);const o=C.getState().selectedColor;(i=(a=s.material)==null?void 0:a.userData)!=null&&i.uBaseFabricColor&&(o!=null&&o.hex)&&s.material.userData.uBaseFabricColor.value.set(o.hex),this.textureComposer.compose(C.getState()),console.log("[ShirtEngine] Modelo real de CLO3D renderizándose en escena.")}}catch(s){console.error("[ShirtEngine] Error al cargar modelo CLO3D:",s),this.modelSwap&&this.modelSwap.hideOverlay()}}switchModel(t="man",a=C.getState()){this.modelSwap&&this.modelSwap.swapTo(t,a)}scheduleCompose(){this._composeQueued||(this._composeQueued=!0,requestAnimationFrame(()=>{this._composeQueued=!1,this.textureComposer.compose(C.getState())}))}handleStateChange(t,a){var i,s,n,o,r,l,c,d,g;if(a==="silhouette"&&this.switchModel(t.selectedSilhouette,t),a==="color"&&(n=(s=(i=this.cloModelInstance)==null?void 0:i.material)==null?void 0:s.userData)!=null&&n.uBaseFabricColor&&(o=t.selectedColor)!=null&&o.hex&&this.cloModelInstance.material.userData.uBaseFabricColor.value.set(t.selectedColor.hex),a==="magicMug"){const p=(l=(r=this.cloModelInstance)==null?void 0:r.material)==null?void 0:l.userData;p!=null&&p.uIsMagicMug&&(p.uIsMagicMug.value=t.isMagicMug?1:0),p!=null&&p.uHeatLevel&&(p.uHeatLevel.value=t.mugHeatLevel??0),(c=this.cloModelInstance)!=null&&c.material&&(this.cloModelInstance.material.roughness=t.isMagicMug?.36:.16),this.scheduleCompose()}if(a==="mugHeat"){const p=(g=(d=this.cloModelInstance)==null?void 0:d.material)==null?void 0:g.userData;p!=null&&p.uHeatLevel&&(p.uHeatLevel.value=t.mugHeatLevel??0)}if((a==="color"||a==="size"||a&&(a.startsWith("decal:")||a.startsWith("transform:")))&&this.scheduleCompose(),a==="view"&&(t.viewMode==="flat"?this.cameraManager.setFlatMode(!0,t.activeView):this.cameraManager.flyToView(t.activeView)),a==="viewMode"){const p=t.viewMode==="flat";this.cameraManager.setFlatMode(p,t.activeView),p&&this.activeMeshGroup&&(this.activeMeshGroup.position.y=0)}a==="autoRotate"&&this.cameraManager.setAutoRotate(t.isAutoRotate)}setView(t){this.cameraManager.flyToView(t)}captureScreenshot(){return this.sceneManager.renderer.render(this.sceneManager.scene,this.cameraManager.camera),this.sceneManager.renderer.domElement.toDataURL("image/png",.95)}setStudioVisible(t){t?this.sceneManager.startLoop(this.cameraManager.camera):this.sceneManager.stopLoop()}pauseRender(){this._renderPaused||(this._renderPaused=!0,this._wasRunning=this.sceneManager.isRunning,this.sceneManager.stopLoop())}resumeRender(){this._renderPaused&&(this._renderPaused=!1,this._wasRunning&&this.sceneManager.startLoop(this.cameraManager.camera),this._wasRunning=!1)}dispose(){this.unsubscribe&&this.unsubscribe(),this.particles&&this.particles.dispose(),this.sceneManager.dispose(),this.cameraManager.dispose(),this.modelSwap&&this.modelSwap.dispose(),this.cloModelInstance&&this.cloModelInstance.dispose(),this.gltfLoader.dispose(),this.textureComposer.dispose()}}function bt(e){if(!e||typeof e.getAttribute!="function")return;const t=parseFloat(e.min!==""?e.min:0),a=parseFloat(e.max!==""?e.max:100),i=parseFloat(e.value!==""?e.value:0),s=a-t||1,n=Math.min(Math.max((i-t)/s*100,0),100),o=(n/100).toFixed(4);e.style.setProperty("--pct",`${n.toFixed(2)}%`),e.style.setProperty("--pct-ratio",o)}function wt(e=document){!e||!e.querySelectorAll||e.querySelectorAll(".range-slider").forEach(bt)}let Ua=!1;function Hi(){if(Ua)return;Ua=!0;const e=t=>{t.target instanceof HTMLInputElement&&t.target.classList.contains("range-slider")&&bt(t.target)};document.addEventListener("input",e,{passive:!0}),document.addEventListener("change",e,{passive:!0}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>wt(document)):wt(document)}let Vt=0;function Ha(e,t=1500){cancelAnimationFrame(Vt);const a=C.getState().mugHeatLevel||0,i=e-a;if(Math.abs(i)<.01){fe(e);return}const s=performance.now();function n(o){const r=Math.min(1,(o-s)/t),l=r<.5?4*r*r*r:1-Math.pow(-2*r+2,3)/2;fe(a+i*l),r<1&&(Vt=requestAnimationFrame(n))}Vt=requestAnimationFrame(n)}function ji(e){const t=Math.round(20+(e||0)*65),a=Math.round((e||0)*100);return a<=5?`❄️ ${t}°C · Frío (Negro Oculto)`:a>=95?`🔥 ${t}°C · Caliente (100% Visible)`:`🌡️ ${t}°C · Revelando (${a}%)`}function ro(e){if(e.selectedSilhouette!=="mug")return"";const t=!!e.isMagicMug,a=e.mugHeatLevel??0,i=a>=.5,s=K(G.baseMugPrice),n=K(G.baseMugPrice+G.magicMugAddon);return`
    <div class="control-card magic-mug-card" id="magic-mug-card">
      <div class="card-header-clean">
        <span class="card-eyebrow">ACABADO DEL VASO 11 OZ</span>
        <span class="color-pill-tag">${t?"✨ Termosensible":"☕ Cerámico Clásico"}</span>
      </div>

      <div class="mug-type-grid" role="group" aria-label="Tipo de Vaso">
        <button type="button" class="btn-mug-type ${t?"":"active"}" data-mug-mode="classic">
          <div class="mug-type-head">
            <span>☕ Clásico</span>
            <span class="mug-type-price">${s}</span>
          </div>
          <span class="mug-type-desc">Cerámica brillante a color. Diseño siempre visible.</span>
        </button>

        <button type="button" class="btn-mug-type ${t?"active":""}" data-mug-mode="magic">
          <div class="mug-type-head">
            <span>✨ Mágico</span>
            <span class="mug-type-price">${n}</span>
          </div>
          <span class="mug-type-desc">Negro en frío ❄️ que revela tu imagen con calor 🔥.</span>
        </button>
      </div>

      ${t?`
        <div class="mug-heat-simulator">
          <button type="button" class="btn-pour-hot ${i?"is-hot":""}" id="btn-toggle-mug-heat">
            <span>${i?"❄️ Enfriar Vaso (Cubrir de Negro)":"☕ Servir Líquido Caliente (Revelar Imagen)"}</span>
          </button>

          <div class="mug-temp-header">
            <span>Simulador Térmico en Vivo</span>
            <span class="mug-temp-badge" id="mug-temp-badge">${ji(a)}</span>
          </div>

          <input
            type="range"
            id="mug-heat-slider"
            class="range-slider"
            min="0"
            max="1"
            step="0.01"
            value="${a.toFixed(2)}"
            aria-label="Temperatura del vaso mágico"
          />
          <div class="mug-temp-scale">
            <span>❄️ 20°C (Negro)</span>
            <span>🌡️ 52°C (Mitad)</span>
            <span>🔥 85°C (Revelado)</span>
          </div>
        </div>
      `:""}
    </div>
  `}function lo(e){e.querySelectorAll("[data-mug-mode]").forEach(i=>{i.addEventListener("click",()=>{const s=i.getAttribute("data-mug-mode")==="magic";cancelAnimationFrame(Vt),Ui(s),s&&(fe(0),setTimeout(()=>Ha(1,1650),320))})});const t=e.querySelector("#btn-toggle-mug-heat");t==null||t.addEventListener("click",()=>{const i=C.getState().mugHeatLevel||0;Ha(i>=.5?0:1,1500)});const a=e.querySelector("#mug-heat-slider");a==null||a.addEventListener("input",i=>{cancelAnimationFrame(Vt),fe(parseFloat(i.target.value))})}function co(e,t){const a=e.querySelector("#mug-heat-slider"),i=e.querySelector("#mug-temp-badge"),s=e.querySelector("#btn-toggle-mug-heat"),n=t.mugHeatLevel||0;if(a&&document.activeElement!==a&&(a.value=n.toFixed(2),wt(e)),i&&(i.textContent=ji(n)),s){const o=n>=.5;s.classList.toggle("is-hot",o),s.innerHTML=`<span>${o?"❄️ Enfriar Vaso (Cubrir de Negro)":"☕ Servir Líquido Caliente (Revelar Imagen)"}</span>`}}function uo(e){function t(){const a=C.getState(),i=a.selectedColor,n=a.selectedSilhouette==="mug"?ro(a):`
        <div class="control-card color-picker-card">
          <div class="card-header-clean">
            <span class="card-eyebrow">TONO DE LA PRENDA</span>
            <div class="selected-color-meta">
              <span class="color-dot-live" id="color-dot-indicator" style="background-color: ${i.hex};"></span>
              <span id="selected-color-name" class="color-pill-tag">${i.name}</span>
            </div>
          </div>

          <div class="swatches-luxury-grid">
            ${Pt.map(l=>`
              <button 
                type="button" 
                class="swatch-luxury ${l.id===i.id?"active":""}" 
                data-color-id="${l.id}" 
                title="${l.name}" 
                style="--swatch-color: ${l.hex};"
              >
                <span class="swatch-core"></span>
                <span class="swatch-check-icon">✓</span>
              </button>
            `).join("")}

            <label class="swatch-luxury swatch-custom" title="Elegir tono personalizado (Rueda cromática)">
              <input type="color" id="custom-color-input" value="${i.hex}" class="custom-color-hidden" />
              <span class="swatch-custom-core">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </span>
            </label>
          </div>
        </div>
      `;e.innerHTML=n,lo(e),wt(e),e.querySelectorAll(".swatch-luxury[data-color-id]").forEach(l=>{l.addEventListener("click",()=>{const c=l.getAttribute("data-color-id"),d=Pt.find(g=>g.id===c);d&&ge(d)})});const r=e.querySelector("#custom-color-input");r&&r.addEventListener("input",l=>{ge({id:"custom",name:"A Medida",hex:l.target.value,roughness:.88,metalness:.02})})}t(),C.subscribe((a,i)=>{if(i==="silhouette"||i==="magicMug")t();else if(i==="mugHeat")co(e,a);else if(i==="color"){const s=e.querySelector("#selected-color-name"),n=e.querySelector("#color-dot-indicator");s&&(s.textContent=a.selectedColor.name),n&&(n.style.backgroundColor=a.selectedColor.hex),e.querySelectorAll(".swatch-luxury[data-color-id]").forEach(r=>{r.classList.toggle("active",r.getAttribute("data-color-id")===a.selectedColor.id)});const o=e.querySelector("#custom-color-input");o&&(o.value=a.selectedColor.hex)}})}let Ut=null;function ho(){Ut||(Ut=document.createElement("div"),Ut.className="toast-container",document.body.appendChild(Ut))}function R(e,t="info",a=3e3){ho();const i=document.createElement("div");i.className=`toast toast-${t}`;const s=t==="success"?"✅":t==="error"?"⚠️":"ℹ️";i.innerHTML=`
    <span class="toast-icon">${s}</span>
    <span class="toast-message">${e}</span>
  `,Ut.appendChild(i),requestAnimationFrame(()=>{i.classList.add("show")}),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>{i.parentElement&&i.parentElement.removeChild(i)},300)},a)}function Ze(e,t,a,i={}){const{tolerance:s=30,feather:n=12,contiguous:o=!1,targetColor:r=null,choke:l=0,bounds:c=null}=i,{data:d,width:g,height:p}=e;let h=r,u=null;if(h)o&&(u=yn(g,p));else{const f=Math.max(0,Math.min(g-1,Math.round(t))),y=Math.max(0,Math.min(p-1,Math.round(a))),v=(y*g+f)*4;if(h={r:d[v],g:d[v+1],b:d[v+2]},d[v+3]<15)return{modified:!1,erasedCount:0,sampledColor:{...h,a:d[v+3]}};o&&(u=[y*g+f])}return{...wn(e,h,{tolerance:s,feather:n,choke:l,seeds:u,bounds:c}),sampledColor:h}}function po(e,t=null,a={}){const{data:i,width:s,height:n}=e,{maxLuma:o=95,passes:r=2}=a,l=t?Math.max(0,t.minX):0,c=t?Math.max(0,t.minY):0,d=t?Math.min(s-1,t.maxX):s-1,g=t?Math.min(n-1,t.maxY):n-1;let p=0;for(let h=0;h<r;h++){const u=[];for(let m=c;m<=g;m++)for(let f=l;f<=d;f++){const y=(m*s+f)*4;if(i[y+3]<25)continue;let w=!1,b=0;for(let S=-1;S<=1;S++){const M=m+S;if(M<0||M>=n){w=!0;continue}for(let A=-1;A<=1;A++){if(A===0&&S===0)continue;const $=f+A;if($<0||$>=s){w=!0;continue}const z=(M*s+$)*4;if(i[z+3]<25)w=!0;else{const J=.299*i[z]+.587*i[z+1]+.114*i[z+2];J>b&&(b=J)}}}if(!w)continue;const x=.299*i[y]+.587*i[y+1]+.114*i[y+2];(x<o||b>140&&b-x>55)&&u.push(y)}if(u.length===0)break;for(let m=0;m<u.length;m++)i[u[m]+3]=0;p+=u.length}return{modified:p>0,cleanedCount:p}}class mo{constructor(t,a=512){this.engine=t,this.maxDim=a,this.sourceKey=null,this.small=null,this.smallCtx=null,this.baseSmall=null,this.scale=1}prepare(t){if(this.sourceKey===t)return;const{width:a,height:i}=t;this.scale=Math.min(1,this.maxDim/Math.max(a,i));const s=Math.max(1,Math.round(a*this.scale)),n=Math.max(1,Math.round(i*this.scale)),o=document.createElement("canvas");o.width=a,o.height=i,o.getContext("2d").putImageData(t,0,0),this.small=document.createElement("canvas"),this.small.width=s,this.small.height=n,this.smallCtx=this.small.getContext("2d",{willReadFrequently:!0}),this.smallCtx.imageSmoothingQuality="high",this.smallCtx.drawImage(o,0,0,s,n),this.baseSmall=this.smallCtx.getImageData(0,0,s,n),this.sourceKey=t}render(t,a){this.prepare(t.baseData);const i=this.scale,s={...t,x:t.x!==void 0?t.x*i:void 0,y:t.y!==void 0?t.y*i:void 0,baseData:this.baseSmall},n={...a,feather:Math.max(2,a.feather*i),choke:Math.round(a.choke*i)},{work:o}=this.engine.runErase(s,n);this.smallCtx.putImageData(o,0,0);const{canvas:r,ctx:l}=this.engine;l.save(),l.globalCompositeOperation="copy",l.imageSmoothingEnabled=!0,l.imageSmoothingQuality="high",l.drawImage(this.small,0,0,r.width,r.height),l.restore()}reset(){this.sourceKey=null,this.baseSmall=null,this.small=null,this.smallCtx=null}}class go{constructor(t){this.engine=t,this.radius=20,this.last=null}start(t,a,i=this.radius){this.engine.pushUndo(),this.engine.lastAction=null,this.last={x:t,y:a},this.dot(t,a,i)}to(t,a,i=this.radius){if(!this.last){this.start(t,a,i);return}const{ctx:s}=this.engine;s.save(),s.globalCompositeOperation="destination-out",s.lineCap="round",s.lineJoin="round",s.lineWidth=i*2,s.beginPath(),s.moveTo(this.last.x,this.last.y),s.lineTo(t,a),s.stroke(),s.restore(),this.last={x:t,y:a},this.engine.touch()}end(){this.last=null}dot(t,a,i=this.radius){const{ctx:s}=this.engine;s.save(),s.globalCompositeOperation="destination-out",s.beginPath(),s.arc(t,a,i,0,Math.PI*2),s.fill(),s.restore(),this.engine.touch()}}class fo{constructor(t,a={}){this.canvas=t,this.ctx=t.getContext("2d",{willReadFrequently:!0}),this.undoStack=[],this.maxUndo=a.maxUndo||15,this.lastAction=null,this.revision=0,this.preview=new mo(this),this.brush=new go(this),this.rawImage=null,this.activeTool="wand",this.settings={tolerance:30,feather:10,choke:1,contiguous:!0}}touch(){this.revision++}getImageData(){return this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height)}commit(t){(this.canvas.width!==t.width||this.canvas.height!==t.height)&&(this.canvas.width=t.width,this.canvas.height=t.height),this.ctx.putImageData(t,0,0),this.touch()}setRawImage(t,a=4096){this.rawImage=t;let i=t.naturalWidth||t.width,s=t.naturalHeight||t.height;(i>a||s>a)&&(i>s?(s=Math.round(s*a/i),i=a):(i=Math.round(i*a/s),s=a)),this.canvas.width=i,this.canvas.height=s,this.ctx.clearRect(0,0,i,s),this.ctx.drawImage(t,0,0,i,s),this.undoStack.length=0,this.lastAction=null,this.preview.reset(),this.touch()}cloneImageData(t){return new ImageData(new Uint8ClampedArray(t.data),t.width,t.height)}pushUndo(t){this.undoStack.length>=this.maxUndo&&this.undoStack.shift(),this.undoStack.push(t||this.getImageData())}undo(){return this.undoStack.length===0?!1:(this.commit(this.undoStack.pop()),this.lastAction=null,!0)}reset(){this.rawImage&&this.setRawImage(this.rawImage)}runErase(t,a){const i=this.cloneImageData(t.baseData),{tolerance:s,feather:n,choke:o}=a;let r;return t.type==="pixel"?r=Ze(i,t.x,t.y,{tolerance:s,feather:n,choke:o,contiguous:t.contiguous,bounds:t.bounds}):t.type==="color"?r=Ze(i,0,0,{tolerance:s,feather:n,choke:o,contiguous:!1,targetColor:t.color,bounds:t.bounds}):(t.type==="cutout"||t.type==="chroma")&&(xn(i,t.type==="chroma"?"chroma":"auto",{tolerance:s,choke:o,contiguous:!0}),r={modified:!0}),{work:i,res:r}}applyAction(t,a=this.settings){const i=this.getImageData(),s={...t,baseData:i},{work:n,res:o}=this.runErase(s,a);return o&&o.modified?(this.pushUndo(i),this.lastAction=s,this.commit(n),{success:!0,res:o}):{success:!1,res:o}}eraseAtPixel(t,a,i={}){return this.applyAction({type:"pixel",x:t,y:a,contiguous:this.settings.contiguous,...i})}cleanVisibleEdges(t=null){const a=this.getImageData(),i=po(a,t);return i.modified&&(this.pushUndo(),this.lastAction=null,this.commit(a)),i}autoErase(){const t=bn(this.getImageData());return t?{...this.applyAction({type:"cutout",color:t,contiguous:!0}),color:t}:{transparent:!0}}chromaErase(){return this.applyAction({type:"chroma",contiguous:!0})}rerunLastAction(){if(!this.lastAction)return!1;const{work:t}=this.runErase(this.lastAction,this.settings);return this.commit(t),!0}ensureAction(){return this.lastAction||null}previewAction(){const t=this.ensureAction();return t?(this.preview.render(t,this.settings),this.touch(),!0):!1}drawOnto(t){this.pushUndo(),this.lastAction=null,t(this.ctx,this.canvas),this.touch()}applyFilter(t){this.pushUndo(),this.lastAction=null;const a=this.getImageData();return t==="invert"?qa(a,{invert:!0}):t==="grayscale"&&qa(a,{grayscale:!0}),this.commit(a),!0}autoCrop(){this.pushUndo(),this.lastAction=null;const t=Ci(this.canvas);return this.canvas.width=t.width,this.canvas.height=t.height,this.ctx.clearRect(0,0,t.width,t.height),this.ctx.drawImage(t,0,0),this.touch(),{width:t.width,height:t.height}}crop(t){if(!t||t.w<10||t.h<10)return!1;const a=this.getImageData();this.pushUndo(a),this.lastAction=null;const i=Math.max(0,Math.min(this.canvas.width-1,Math.round(t.x))),s=Math.max(0,Math.min(this.canvas.height-1,Math.round(t.y))),n=Math.max(10,Math.min(this.canvas.width-i,Math.round(t.w))),o=Math.max(10,Math.min(this.canvas.height-s,Math.round(t.h))),r=this.ctx.getImageData(i,s,n,o);return this.canvas.width=n,this.canvas.height=o,this.ctx.putImageData(r,0,0),this.touch(),!0}expandCanvas(t={top:0,bottom:0,left:0,right:0}){const a=Math.max(0,Math.round(t.top||0)),i=Math.max(0,Math.round(t.bottom||0)),s=Math.max(0,Math.round(t.left||0)),n=Math.max(0,Math.round(t.right||0));if(a===0&&i===0&&s===0&&n===0)return!1;this.pushUndo(),this.lastAction=null;const o=this.canvas.width,r=this.canvas.height,l=o+s+n,c=r+a+i,d=this.ctx.getImageData(0,0,o,r);return this.canvas.width=l,this.canvas.height=c,this.ctx.clearRect(0,0,l,c),this.ctx.putImageData(d,s,a),this.touch(),{width:l,height:c,left:s,top:a}}getUndoCount(){return this.undoStack.length}}const Qe=.02,Je=8,Oe=.3,vo=3,ja=[Qe,Je];class bo{constructor(t,a,i,s,n,o={}){this.viewportEl=t,this.wrapEl=a,this.canvas=i,this.ringEl=s,this.zoomBadgeEl=n,this.getActiveTool=o.getActiveTool||(()=>"wand"),this.zoom=1,this.panX=0,this.panY=0,this.target={zoom:1,panX:0,panY:0},this.raf=0,this.isPanning=!1,this.panStartX=0,this.panStartY=0,this.isSpacePressed=!1,this.ringEl&&(this.ringEl.style.left="0",this.ringEl.style.top="0"),this.bindEvents()}isEditorOpen(){return!!document.querySelector("#image-editor-backdrop.open")}applyTransform(){this.wrapEl&&(this.wrapEl.style.transform=`translate3d(${this.panX}px, ${this.panY}px, 0) scale(${this.zoom})`),this.zoomBadgeEl&&(this.zoomBadgeEl.textContent=`${Math.round(this.zoom*100)}%`),this.canvas.classList.toggle("is-pixelated",this.zoom>=vo)}moveTo(t,a,i,s=!1){const n={zoom:Math.min(Je,Math.max(Qe,t)),panX:a,panY:i};s?(this.stopAnimation(),this.target=n,this.zoom=n.zoom,this.panX=a,this.panY=i,this.applyTransform()):(this.target=n,this.raf||(this.raf=requestAnimationFrame(()=>this.step())))}step(){this.raf=0;const t=this.target;this.zoom*=Math.pow(t.zoom/this.zoom,Oe),this.panX+=(t.panX-this.panX)*Oe,this.panY+=(t.panY-this.panY)*Oe,Math.abs(t.zoom/this.zoom-1)<.002&&Math.abs(t.panX-this.panX)<.4&&Math.abs(t.panY-this.panY)<.4?(this.zoom=t.zoom,this.panX=t.panX,this.panY=t.panY):this.raf=requestAnimationFrame(()=>this.step()),this.applyTransform()}stopAnimation(){this.raf&&cancelAnimationFrame(this.raf),this.raf=0,this.target={zoom:this.zoom,panX:this.panX,panY:this.panY}}setZoom(t,a=null,i=null,s=!1){const n=this.target,o=Math.min(Je,Math.max(Qe,t));let{panX:r,panY:l}=n;if(a!==null&&i!==null&&this.viewportEl){const c=this.viewportEl.getBoundingClientRect(),d=a-c.left-c.width/2,g=i-c.top-c.height/2;r=d-(d-n.panX)*(o/n.zoom),l=g-(g-n.panY)*(o/n.zoom)}this.moveTo(o,r,l,s)}zoomIn(){this.setZoom(this.target.zoom*1.35)}zoomOut(){this.setZoom(this.target.zoom/1.35)}zoomReset(){this.moveTo(1,0,0)}zoomFit(t=!1){if(!this.viewportEl||!this.canvas.width)return;const a=this.viewportEl.getBoundingClientRect();if(!a.width||!a.height)return;const i=24,s=Math.min((a.width-i)/this.canvas.width,(a.height-i)/this.canvas.height,1.2);this.moveTo(s,0,0,t)}getCanvasCoords(t){const a=this.canvas.getBoundingClientRect();return a.width===0||a.height===0?{x:0,y:0}:{x:(t.clientX-a.left)*(this.canvas.width/a.width),y:(t.clientY-a.top)*(this.canvas.height/a.height)}}getVisibleCanvasRect(){if(!this.viewportEl||!this.canvas.width||!this.canvas.height)return null;const t=this.viewportEl.getBoundingClientRect(),a=this.getCanvasCoords({clientX:t.left,clientY:t.top}),i=this.getCanvasCoords({clientX:t.right,clientY:t.bottom});return{minX:Math.max(0,Math.floor(Math.min(a.x,i.x))),minY:Math.max(0,Math.floor(Math.min(a.y,i.y))),maxX:Math.min(this.canvas.width-1,Math.ceil(Math.max(a.x,i.x))),maxY:Math.min(this.canvas.height-1,Math.ceil(Math.max(a.y,i.y)))}}updateRing(t,a){if(!this.ringEl)return;if(this.getActiveTool()!=="brush"||this.isPanning||this.isSpacePressed){this.ringEl.style.display="none";return}const i=this.canvas.getBoundingClientRect(),s=a*2*(i.width/this.canvas.width);this.ringEl.style.display="block",this.ringEl.style.width=`${s}px`,this.ringEl.style.height=`${s}px`,this.ringEl.style.transform=`translate3d(${t.clientX}px, ${t.clientY}px, 0) translate(-50%, -50%)`}hideRing(){this.ringEl&&(this.ringEl.style.display="none")}shouldPan(t){return this.isSpacePressed||t.button===1||t.button===2||this.getActiveTool()==="hand"}resetPan(){var t;this.isPanning=!1,this.isSpacePressed=!1,(t=this.viewportEl)==null||t.classList.remove("is-panning","space-panning")}bindEvents(){if(!this.viewportEl)return;this.viewportEl.addEventListener("wheel",a=>{a.preventDefault();const i=Math.exp(-Math.sign(a.deltaY)*Math.min(Math.abs(a.deltaY),120)*.0016);this.setZoom(this.target.zoom*i,a.clientX,a.clientY)},{passive:!1}),window.addEventListener("keydown",a=>{a.code==="Space"&&!this.isSpacePressed&&this.isEditorOpen()&&!/INPUT|TEXTAREA|SELECT/.test(a.target.tagName)&&(this.isSpacePressed=!0,this.viewportEl.classList.add("space-panning"),this.hideRing(),a.preventDefault())}),window.addEventListener("keyup",a=>{a.code==="Space"&&(this.isSpacePressed=!1,this.viewportEl.classList.remove("space-panning"))}),this.viewportEl.addEventListener("pointerdown",a=>{a.pointerType==="touch"||!this.shouldPan(a)||(this.stopAnimation(),this.isPanning=!0,this.panStartX=a.clientX-this.panX,this.panStartY=a.clientY-this.panY,this.viewportEl.classList.add("is-panning"),a.preventDefault())}),window.addEventListener("pointermove",a=>{!this.isPanning||!this.isEditorOpen()||(this.panX=a.clientX-this.panStartX,this.panY=a.clientY-this.panStartY,this.target={zoom:this.zoom,panX:this.panX,panY:this.panY},this.applyTransform())});const t=()=>{this.isPanning&&(this.isPanning=!1,this.viewportEl.classList.remove("is-panning"))};window.addEventListener("pointerup",t),window.addEventListener("pointercancel",t),this.viewportEl.addEventListener("contextmenu",a=>{(this.shouldPan(a)||this.zoom>1.05)&&a.preventDefault()})}}const Ke=[{id:"anton",label:"Anton",family:"'Anton', Impact, sans-serif",weight:400,group:"Bold"},{id:"bebas",label:"Bebas Neue",family:"'Bebas Neue', Impact, sans-serif",weight:400,group:"Bold"},{id:"kaushan",label:"Kaushan",family:"'Kaushan Script', cursive",weight:400,group:"Streetwear"},{id:"bangers",label:"Bangers Pop",family:"'Bangers', cursive",weight:400,group:"Comic / Pop"},{id:"creepster",label:"Creepster",family:"'Creepster', cursive",weight:400,group:"Terror / Metal"},{id:"sedgwick",label:"Sedgwick",family:"'Sedgwick Ave', cursive",weight:400,group:"Graffiti"},{id:"marker",label:"Marker",family:"'Permanent Marker', cursive",weight:400,group:"Graffiti"},{id:"rocksalt",label:"Rock Salt",family:"'Rock Salt', cursive",weight:400,group:"Graffiti"},{id:"unifraktur",label:"Fraktur",family:"'UnifrakturCook', serif",weight:700,group:"Gótica"},{id:"medieval",label:"Medieval",family:"'MedievalSharp', serif",weight:400,group:"Gótica"},{id:"pirata",label:"Pirata",family:"'Pirata One', cursive",weight:400,group:"Gótica"},{id:"pacifico",label:"Pacifico",family:"'Pacifico', cursive",weight:400,group:"Cursiva"},{id:"dancing",label:"Dancing",family:"'Dancing Script', cursive",weight:700,group:"Cursiva"},{id:"greatvibes",label:"Great Vibes",family:"'Great Vibes', cursive",weight:400,group:"Cursiva"},{id:"blackops",label:"Black Ops",family:"'Black Ops One', cursive",weight:400,group:"Militar"},{id:"specialelite",label:"Typewriter",family:"'Special Elite', cursive",weight:400,group:"Vintage"},{id:"righteous",label:"Righteous",family:"'Righteous', cursive",weight:400,group:"Retro 80s"},{id:"cinzel",label:"Cinzel",family:"'Cinzel', serif",weight:700,group:"Lujo"},{id:"syne",label:"Syne Haute",family:"'Syne', sans-serif",weight:700,group:"Alta Costura"},{id:"grotesk",label:"Grotesk",family:"'Space Grotesk', sans-serif",weight:600,group:"Cyber"}],Y={text:"TU TEXTO",fontId:"anton",sizePct:14,curve:0,fill:"#ffffff",stroke:"#000000",strokeW:3,shadow:0,shadowColor:"#000000",x:.5,y:.2},yo=Math.PI*1.2,ya=e=>Ke.find(t=>t.id===e)||Ke[0];function Re(e,t){e.shadowColor=t?t.color:"transparent",e.shadowBlur=t?t.blur:0,e.shadowOffsetX=t?t.dx:0,e.shadowOffsetY=t?t.dy:0}function wo(e,t){const a=Math.max(0,Math.min(100,e.shadow||0))/100;if(!a)return null;const i=/^#[0-9a-f]{6}$/i.test(e.shadowColor)?e.shadowColor:"#000000";return{color:`rgba(${[1,3,5].map(n=>parseInt(i.slice(n,n+2),16)).join(",")},${(.45+.5*a).toFixed(2)})`,blur:t*.1*a,dx:t*.07*a,dy:t*.09*a}}function Va(e,t,a,i,s,n){Re(e,n),s>0&&(e.strokeText(t,a,i),Re(e,null)),e.fillText(t,a,i),Re(e,null)}function _e(e,t,a,i){const s=(t.text||"").trim();if(!s)return null;const n=ya(t.fontId),o=Math.max(8,a*t.sizePct/100),r=o*t.strokeW/60,l=wo(t,o),c=t.x*a,d=t.y*i;e.save(),e.font=`${n.weight} ${o}px ${n.family}`,e.textAlign="center",e.textBaseline="middle",e.lineJoin="round",e.miterLimit=2,e.fillStyle=t.fill,e.strokeStyle=t.stroke,e.lineWidth=r;let g;if(Math.abs(t.curve)<2){Va(e,s,c,d,r,l);const p=e.measureText(s).width/2;g={x0:c-p,y0:d-o*.6,x1:c+p,y1:d+o*.6}}else{const p=Array.from(s),h=p.map(b=>e.measureText(b).width),u=h.reduce((b,x)=>b+x,0),m=Math.abs(t.curve)/100*yo,f=u/m,y=t.curve>0,v=y?d+f:d-f;g={x0:c,y0:d,x1:c,y1:d};let w=0;p.forEach((b,x)=>{const E=(w+h[x]/2)/f-m/2;w+=h[x];const S=y?-Math.PI/2+E:Math.PI/2-E,M=c+f*Math.cos(S),A=v+f*Math.sin(S);e.save(),e.translate(M,A),e.rotate(y?E:-E),Va(e,b,0,0,r,l),e.restore(),g.x0=Math.min(g.x0,M-o*.6),g.x1=Math.max(g.x1,M+o*.6),g.y0=Math.min(g.y0,A-o*.6),g.y1=Math.max(g.y1,A+o*.6)})}return e.restore(),g}function xo(){const e=Ke.map(t=>`
    <div class="font-dropdown-item ${t.id==="anton"?"active":""}" data-font="${t.id}" role="option">
      <span class="font-item-name" style="font-family:${t.family};font-weight:${t.weight}">${t.label}</span>
      <span class="font-item-badge">${t.group}</span>
    </div>`).join("");return`
    <div class="text-panel" id="editor-text-panel">
      <div class="text-input-row">
        <input type="text" id="text-input" class="text-input" maxlength="40" placeholder="Escribe tu título…" value="${Y.text}" autocomplete="off" />
        <button type="button" class="btn-text-add" id="btn-text-add" title="Añadir texto al arte">＋ Añadir</button>
      </div>

      <div class="font-select-field">
        <label class="font-select-label">Tipo de Caligrafía</label>
        <div class="font-dropdown-container" id="font-dropdown-container">
          <button type="button" class="font-dropdown-trigger" id="font-dropdown-trigger" aria-haspopup="listbox">
            <span class="font-trigger-text" id="font-trigger-text" style="font-family:'Anton', Impact, sans-serif">Anton</span>
            <span class="font-trigger-badge" id="font-trigger-badge">Bold</span>
            <span class="font-trigger-arrow">▾</span>
          </button>
          <div class="font-dropdown-menu" id="font-dropdown-menu" role="listbox" style="display:none;">
            ${e}
          </div>
        </div>
      </div>

      <div class="text-sliders">
        <label class="text-slider-row"><span>Tamaño</span>
          <input type="range" id="text-size" class="range-slider" min="4" max="45" step="1" value="${Y.sizePct}" style="--pct-ratio: ${((Y.sizePct-4)/41).toFixed(4)};" />
          <b id="text-size-val">${Y.sizePct}%</b></label>
        <label class="text-slider-row"><span>Curvatura</span>
          <input type="range" id="text-curve" class="range-slider" min="-100" max="100" step="1" value="${Y.curve}" style="--pct-ratio: ${((Y.curve+100)/200).toFixed(4)};" />
          <b id="text-curve-val" title="Clic para dejar recto">${Y.curve}%</b></label>
        <label class="text-slider-row"><span>Borde</span>
          <input type="range" id="text-stroke-w" class="range-slider" min="0" max="12" step="1" value="${Y.strokeW}" style="--pct-ratio: ${(Y.strokeW/12).toFixed(4)};" />
          <b id="text-stroke-val">${Y.strokeW}</b></label>
        <label class="text-slider-row"><span>Sombra</span>
          <input type="range" id="text-shadow" class="range-slider" min="0" max="100" step="1" value="${Y.shadow}" style="--pct-ratio: ${(Y.shadow/100).toFixed(4)};" />
          <b id="text-shadow-val">${Y.shadow}</b></label>
      </div>

      <div class="text-colors">
        <label class="color-field">Color <input type="color" id="text-fill" value="${Y.fill}" /></label>
        <label class="color-field">Contorno <input type="color" id="text-stroke" value="${Y.stroke}" /></label>
        <label class="color-field">Sombra <input type="color" id="text-shadow-color" value="${Y.shadowColor}" /></label>
      </div>

      <div class="text-canvas-margin-block">
        <div class="text-padding-header">
          <span>📐 Espacio exterior para texto fuera del arte</span>
        </div>
        <div class="quick-tools-grid" style="grid-template-columns: 1fr 1fr 1fr;">
          <button type="button" class="btn-tool-pill" id="btn-pad-top" title="Añade margen transparente arriba">⬆ + Arriba</button>
          <button type="button" class="btn-tool-pill" id="btn-pad-bottom" title="Añade margen transparente abajo">⬇ + Abajo</button>
          <button type="button" class="btn-tool-pill" id="btn-pad-sides" title="Añade margen a los lados">↔ + Lados</button>
        </div>
      </div>

      <div class="quick-tools-grid">
        <button type="button" class="btn-tool-pill active" id="btn-text-commit" disabled>✓ Fijar en el arte</button>
        <button type="button" class="btn-tool-pill" id="btn-text-discard" disabled>🗑 Quitar</button>
      </div>
      <p class="text-hint">Arrastra el texto para moverlo. Con los botones de arriba dale espacio para que quede por fuera.</p>
    </div>`}const Vi=[{id:"street",label:"Street Grayscale",hint:"Blanco y negro de alto contraste",swatch:"linear-gradient(135deg,#0b0b0b,#8a8a8a 55%,#f5f5f5)"},{id:"duotone",label:"Cyberpunk Duotone",hint:"Cian y magenta neón",swatch:"linear-gradient(135deg,#16002e,#ff2bd6 50%,#00f5ff)"},{id:"halftone",label:"Halftone DTF",hint:"Punteado serigráfico",swatch:"radial-gradient(circle,#111 38%,transparent 42%) 0 0/9px 9px, #f1ede4"},{id:"vintage",label:"Vintage Grain",hint:"Tono cálido gastado con grano",swatch:"linear-gradient(135deg,#3a2a1c,#b98d5a 55%,#efdcb6)"}],Le=(e,t,a)=>.299*e+.587*t+.114*a,ue=e=>e<0?0:e>255?255:e,ze=[[0,22,0,46],[.5,255,43,214],[1,0,245,255]];function Eo(e){const t=e<ze[1][0]?0:1,[a,i,s,n]=ze[t],[o,r,l,c]=ze[t+1],d=(e-a)/(o-a);return[i+(r-i)*d,s+(l-s)*d,n+(c-n)*d]}function So(e=1234567){let t=e>>>0;return()=>(t^=t<<13,t>>>=0,t^=t>>>17,t^=t<<5,t>>>=0,t/4294967296)}function wa(e,t){const a=e.getContext("2d",{willReadFrequently:!0}),i=a.getImageData(0,0,e.width,e.height),s=i.data;for(let n=0;n<s.length;n+=4)s[n+3]!==0&&t(s,n);a.putImageData(i,0,0)}function Mo(e){wa(e,(t,a)=>{const i=ue((Le(t[a],t[a+1],t[a+2])-128)*1.4+124);t[a]=t[a+1]=t[a+2]=i})}function Co(e){const t=Array.from({length:256},(a,i)=>Eo(i/255));wa(e,(a,i)=>{const s=t[Math.round(Le(a[i],a[i+1],a[i+2]))];a[i]=s[0],a[i+1]=s[1],a[i+2]=s[2]})}function Ao(e){const t=So();wa(e,(a,i)=>{const s=a[i],n=a[i+1],o=a[i+2],r=Le(s,n,o),l=(t()+t()+t()-1.5)*26;a[i]=ue((s*.6+r*.4)*.9+30+l),a[i+1]=ue((n*.6+r*.4)*.84+20+l),a[i+2]=ue((o*.6+r*.4)*.68+12+l)})}function Lo(e){const t=e.width,a=e.height,i=e.getContext("2d",{willReadFrequently:!0}),s=i.getImageData(0,0,t,a).data,n=Math.max(6,Math.round(Math.max(t,a)/110));i.clearRect(0,0,t,a);for(let o=0;o<a;o+=n)for(let r=0;r<t;r+=n){const l=Math.min(t,r+n),c=Math.min(a,o+n);let d=0,g=0,p=0,h=0,u=0;for(let w=o;w<c;w++)for(let b=r;b<l;b++){const x=(w*t+b)*4,E=s[x+3];d+=s[x]*E,g+=s[x+1]*E,p+=s[x+2]*E,h+=E,u++}if(h<255*u*.06)continue;const m=h/(255*u),f=[d/h,g/h,p/h],y=1-Le(...f)/255,v=n/2*1.08*Math.sqrt(Math.min(1,m*(.4+.6*y)));i.fillStyle=`rgb(${f[0]|0},${f[1]|0},${f[2]|0})`,i.beginPath(),i.arc((r+l)/2,(o+c)/2,Math.max(.6,v),0,Math.PI*2),i.fill()}}const ko={street:Mo,duotone:Co,halftone:Lo,vintage:Ao};function $o(e,t){const a=ko[t];return a&&a(e),e}function Ft(e,t,a,i,s,n=1){const o=((s-a)/(i-a)).toFixed(4);return`
    <label class="adj-row"><span>${t}</span>
      <input type="range" id="adj-${e}" class="range-slider" min="${a}" max="${i}" step="${n}" value="${s}" style="--pct-ratio: ${o};" />
      <b id="adj-${e}-val" title="Doble clic para restablecer">${s}</b></label>`}function To(){const e=Vi.map(t=>`
    <button type="button" class="adj-filter" data-style="${t.id}" title="${t.hint}">
      <span class="adj-filter-swatch" style="background:${t.swatch}"></span>
      <span class="adj-filter-text"><b>${t.label}</b><small>${t.hint}</small></span>
    </button>`).join("");return`
    <div class="adjust-panel" id="editor-adjust-panel">
      <div class="tool-detail-box adj-block">
        <div class="tool-group-title">🎚️ Tono &amp; Color <small class="adj-live">en vivo</small></div>
        ${Ft("brightness","Brillo",-100,100,0)}
        ${Ft("contrast","Contraste",-100,100,0)}
        ${Ft("saturation","Saturación",0,200,100)}
        ${Ft("sharpen","Nitidez",0,100,0)}
        <div class="quick-tools-grid">
          <button type="button" class="btn-tool-pill active" id="adj-apply-tonal" disabled>✓ Aplicar ajustes</button>
          <button type="button" class="btn-tool-pill" id="adj-reset-tonal" disabled>↺ Restablecer</button>
        </div>
      </div>

      <div class="tool-detail-box adj-block">
        <div class="tool-group-title">🔄 Transformar</div>
        ${Ft("rotation","Giro libre",-180,180,0,.5)}
        <div class="quick-tools-grid adj-grid-4">
          <button type="button" class="btn-tool-pill" id="adj-rot-ccw" title="Girar 90° a la izquierda">⟲ 90°</button>
          <button type="button" class="btn-tool-pill" id="adj-rot-cw" title="Girar 90° a la derecha">⟳ 90°</button>
          <button type="button" class="btn-tool-pill" id="adj-flip-x" title="Voltear horizontalmente">↔ Flip X</button>
          <button type="button" class="btn-tool-pill" id="adj-flip-y" title="Voltear verticalmente">↕ Flip Y</button>
        </div>
        <div class="quick-tools-grid">
          <button type="button" class="btn-tool-pill active" id="adj-apply-rot" disabled>✓ Aplicar giro</button>
          <button type="button" class="btn-tool-pill" id="adj-go-crop" title="Abre el recorte libre con guía de encuadre">✂️ Recorte libre</button>
        </div>
      </div>

      <div class="tool-detail-box adj-block">
        <div class="tool-group-title">🎨 Filtros Streetwear</div>
        <div class="adj-filters">${e}</div>
        <p class="text-hint">Cada filtro es un paso que se puede deshacer. Los píxeles transparentes no cambian.</p>
      </div>
    </div>`}function Io(){return`
    <div class="image-editor-dialog">
      <!-- Cabecera de la Ventana -->
      <div class="image-editor-header">
        <div class="editor-header-info">
          <span class="editor-eyebrow">ESTUDIO DE TRATAMIENTO DE IMAGEN</span>
          <h3 class="editor-title">Acondicionar Arte para Estampado</h3>
        </div>
        <div class="editor-header-actions">
          <button type="button" class="btn-editor-tour" id="btn-editor-tour" title="Tour guiado de 6 pasos">💡 ¿Cómo funciona? / Tour</button>
          <button type="button" class="editor-close-btn" id="btn-close-editor" title="Cerrar ventana">✕</button>
        </div>
      </div>

      <!-- Cuerpo Principal en 2 Columnas Limpias -->
      <div class="image-editor-body">
        <!-- Columna Izquierda: Lienzo Amplio y Controles de Zoom -->
        <div class="editor-preview-column">
          <!-- Barra superior flotante de vista y zoom -->
          <div class="editor-viewport-nav">
            <div class="viewport-nav-group">
              <button type="button" class="btn-zoom-ctrl" id="btn-zoom-out" title="Alejar">−</button>
              <span class="zoom-level-badge" id="zoom-level-badge">100%</span>
              <button type="button" class="btn-zoom-ctrl" id="btn-zoom-in" title="Acercar">+</button>
              <button type="button" class="btn-zoom-ctrl" id="btn-zoom-fit" title="Ajustar a pantalla">📐 Ajustar</button>
            </div>
            <!-- Solo en pantallas táctiles (imageEditorTouch.css): Mover/zoom sin borrar vs herramienta de edición -->
            <div class="viewport-nav-group touch-mode-group" id="touch-mode-group" role="group" aria-label="Modo táctil">
              <button type="button" class="btn-zoom-ctrl btn-touch-mode" id="btn-touch-move" title="Mover y hacer zoom sin borrar">🖐️ Mover</button>
              <button type="button" class="btn-zoom-ctrl btn-touch-mode active" id="btn-touch-edit" title="Editar con la herramienta activa">🪄 Varita</button>
            </div>
            <div class="viewport-nav-group">
              <button type="button" class="btn-zoom-ctrl btn-preview-toggle active" data-stage-bg="shirt" id="btn-bg-shirt">
                👕 Prenda
              </button>
              <button type="button" class="btn-zoom-ctrl btn-preview-toggle" data-stage-bg="checkers" id="btn-bg-checkers">
                🏁 Transparente
              </button>
            </div>
          </div>

          <!-- Viewport Interactivo -->
          <div class="editor-viewport" id="editor-viewport" data-stage-bg="shirt" data-active-tool="auto">
            <div class="editor-canvas-container" id="editor-canvas-wrap">
              <canvas id="editor-canvas"></canvas>
            </div>
            <div class="brush-cursor-ring" id="brush-cursor-ring"></div>
          </div>

          <!-- Barra inferior del lienzo: Deshacer y Estado -->
          <div class="editor-stage-bottom-bar">
            <button type="button" class="btn-undo-action" id="btn-undo-step" disabled title="Deshacer (Ctrl+Z)">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 7v6h6M3 13a9 9 0 1 0 2.5-6.3L3 13"/></svg>
              <span>Deshacer (<b id="undo-counter">0</b>)</span>
            </button>
            <div class="editor-dpi-wrap">
              <span class="dpi-badge dpi-optimal" id="editor-dpi-badge" role="status"><span id="editor-dpi-label">Calculando DPI…</span></span>
              <span class="editor-preview-badge" id="editor-meta-badge">Listo</span>
              <span class="editor-dpi-note" id="editor-dpi-note"></span>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: pestañas + acciones finales fijas -->
        <div class="editor-tools-column">
          <div class="editor-tabs" role="tablist">
            <button type="button" class="editor-tab active" id="tab-bg" data-tab="bg" role="tab">🎨 Fondo &amp; Retoque</button>
            <button type="button" class="editor-tab" id="tab-adjust" data-tab="adjust" role="tab">🎛️ Ajustes</button>
            <button type="button" class="editor-tab" id="tab-text" data-tab="text" role="tab">🔤 Textos</button>
          </div>

          <div class="editor-tab-panels">
            <!-- Pestaña 1: Fondo y retoque -->
            <div class="editor-tab-panel active" id="panel-bg">
              <div class="hero-autoclean-card" id="editor-hero-card">
                <button type="button" class="btn-hero-autoclean" id="btn-hero-auto" style="width: 100%;">✨ Quitar Fondo en 1 Clic</button>
                <div class="hero-autoclean-sub">Detecta automáticamente el fondo, afina 1&nbsp;px el contorno y elimina halos</div>
              </div>

              <div id="editor-manual-block">
                <div class="tool-section-compact">
                  <div class="tool-group-title">🛠️ Retoque &amp; Recorte</div>
                  <div class="quick-tools-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                    <button type="button" class="btn-tool-pill active" id="btn-tool-wand">🪄 Varita</button>
                    <button type="button" class="btn-tool-pill" id="btn-tool-brush">🧹 Goma</button>
                    <button type="button" class="btn-tool-pill" id="btn-tool-crop">✂️ Recorte Libre</button>
                  </div>
                </div>

                <div id="wand-options-panel" class="tool-detail-box">
                  <div class="slider-group-field">
                    <div class="slider-info"><span>Sensibilidad de borrado</span><span id="tol-val">30%</span></div>
                    <input type="range" id="tolerance-slider" min="5" max="75" step="1" value="30" class="range-slider" style="--pct-ratio: 0.3571;" />
                  </div>
                  <div class="quick-tools-grid" style="margin-top: 6px; grid-template-columns: 1fr 1fr 1fr;">
                    <button type="button" class="btn-tool-pill active" id="btn-mode-connected">📍 Zona</button>
                    <button type="button" class="btn-mode-global btn-tool-pill" id="btn-mode-global">🌐 Todo</button>
                    <button type="button" class="btn-tool-pill" id="btn-mode-viewport" title="Solo borra en la pantalla visible">👁️ En Vista</button>
                  </div>
                  <button type="button" class="btn-tool-pill full-width" id="btn-clean-screen-border" style="margin-top: 6px; justify-content: center; gap: 6px; font-weight: 600;" title="Borra el borde negro o halo oscuro visible en este encuadre">
                    <span>🧹 Limpiar Borde en Pantalla</span>
                  </button>
                </div>

                <div id="brush-options-panel" class="tool-detail-box" style="display: none;">
                  <div class="slider-group-field">
                    <div class="slider-info"><span>Grosor de la goma</span><span id="brush-size-val">20px</span></div>
                    <input type="range" id="brush-size-slider" min="4" max="80" step="2" value="20" class="range-slider" style="--pct-ratio: 0.2105;" />
                  </div>
                  <div class="brush-presets-row">
                    <button type="button" class="btn-brush-preset" data-brush-size="8">Fino</button>
                    <button type="button" class="btn-brush-preset active" data-brush-size="20">Medio</button>
                    <button type="button" class="btn-brush-preset" data-brush-size="45">Grueso</button>
                  </div>
                </div>

                <div id="crop-options-panel" class="tool-detail-box" style="display: none;">
                  <div class="quick-tools-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 6px;">
                    <button type="button" class="btn-tool-pill active" id="btn-crop-mode-rect">⬛ Rectángulo</button>
                    <button type="button" class="btn-tool-pill" id="btn-crop-mode-lasso">➰ Lazo Libre</button>
                  </div>

                  <p id="crop-mode-hint" style="font-size: 0.71rem; color: var(--text-secondary); margin: 0 0 6px 0; line-height: 1.35;">
                    Arrastra un recuadro sobre la imagen para seleccionar el área deseada.
                  </p>

                  <button type="button" class="btn-tool-pill full-width" id="btn-crop-autotrim" style="margin-bottom: 8px; justify-content: center; gap: 6px; font-weight: 600;" title="Encoge el lienzo automáticamente eliminando todo el espacio vacío transparente">
                    <span>📐 Recortar Sobrantes</span>
                    <span style="font-size: 0.64rem; opacity: 0.75;">(Auto-ajustar)</span>
                  </button>

                  <div class="quick-tools-grid" style="grid-template-columns: 1fr 1fr;">
                    <button type="button" class="btn-tool-pill active" id="btn-apply-crop" style="border-color: #00f0ff; color: #00f0ff;" disabled>✓ Aplicar</button>
                    <button type="button" class="btn-tool-pill" id="btn-cancel-crop">✕ Cancelar</button>
                  </div>
                </div>
              </div>

              <!-- Asistente de Prompt para IA (fondos limpios y contrastantes) -->
              <div class="ai-prompt-card">
                <div class="ai-prompt-header" id="btn-toggle-ai-card">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span>💡 Prompt para IA</span>
                    <span class="chroma-badge-pill" id="ai-chroma-badge">🎨 Auto</span>
                  </div>
                  <span class="ai-toggle-icon" id="ai-toggle-arrow">▾</span>
                </div>
                <div class="ai-prompt-body" id="ai-prompt-body" style="display: none;">
                  <div class="ai-prompt-tabs">
                    <button type="button" class="btn-prompt-lang active" data-lang="en">Midjourney / Gemini</button>
                    <button type="button" class="btn-prompt-lang" data-lang="es">ChatGPT</button>
                  </div>
                  <textarea readonly class="ai-prompt-text" id="ai-prompt-input" rows="3"></textarea>
                  <button type="button" class="btn-copy-prompt" id="btn-copy-prompt">📋 Copiar Prompt</button>
                </div>
              </div>
            </div>

            <!-- Pestaña 2: Ajustes de tono, transformaciones y filtros -->
            <div class="editor-tab-panel" id="panel-adjust">${To()}</div>

            <!-- Pestaña 3: Textos y caligrafías -->
            <div class="editor-tab-panel" id="panel-text">${xo()}</div>
          </div>

          <!-- 4. Acciones Finales -->
          <div class="editor-actions-stack">
            <div class="editor-save-grid" role="group" aria-label="Guardar el arte">
              <button type="button" class="btn-editor-save" id="btn-replace-editor" title="Sobrescribe el arte actual con estos cambios">💾 Reemplazar Imagen</button>
              <button type="button" class="btn-editor-save" id="btn-copy-editor" title="Guarda una copia nueva en tu Bóveda sin tocar el original">➕ Guardar como Copia</button>
            </div>
            <button type="button" class="btn-editor-download" id="btn-download-editor" title="PNG transparente a 300 DPI, sin pasar por la camiseta 3D">📥 Descargar Imagen</button>
            <button type="button" class="btn-apply-editor full-width" id="btn-apply-editor">
              Aplicar a Camiseta →
            </button>
            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn-cancel-editor" id="btn-cancel-editor" style="flex: 1;">Cancelar</button>
              <button type="button" class="btn-reset-clean" id="btn-reset-editor" title="Restablecer original">↺ Original</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}const Do=448,Po=40;class Oo{constructor(t,a,i,s=()=>!0){this.engine=t,this.viewport=a,this.isAllowed=s,this.enabled=!0,this.pending=null,this.raf=0,this.lastKey="",this.cache=null,this.onPaint=null,this.onClear=null,this.overlay=document.createElement("canvas"),this.overlay.className="wand-hover-overlay",this.octx=this.overlay.getContext("2d"),i.appendChild(this.overlay)}setEnabled(t){this.enabled=t,t||this.clear()}clear(){var t;this.raf&&cancelAnimationFrame(this.raf),this.raf=0,this.pending=null,this.lastKey="",this.overlay.style.opacity="0",(t=this.onClear)==null||t.call(this)}move(t){!this.enabled||this.engine.activeTool!=="wand"||!this.isAllowed()||(this.pending={clientX:t.clientX,clientY:t.clientY},this.raf||(this.raf=requestAnimationFrame(()=>{var a;this.raf=0,this.paint(),(a=this.onPaint)==null||a.call(this)})))}flush(t){var a;!this.enabled||this.engine.activeTool!=="wand"||!this.isAllowed()||(this.raf&&cancelAnimationFrame(this.raf),this.raf=0,this.pending={clientX:t.clientX,clientY:t.clientY},this.paint(),(a=this.onPaint)==null||a.call(this))}prepare(){const{canvas:t,revision:a}=this.engine;if(this.cache&&this.cache.rev===a&&this.cache.w0===t.width&&this.cache.h0===t.height)return this.cache;const i=Math.min(1,Do/Math.max(t.width,t.height)),s=Math.max(1,Math.round(t.width*i)),n=Math.max(1,Math.round(t.height*i)),o=document.createElement("canvas");o.width=s,o.height=n;const r=o.getContext("2d",{willReadFrequently:!0});return r.imageSmoothingQuality="high",r.drawImage(t,0,0,s,n),this.cache={rev:a,k:i,w:s,h:n,w0:t.width,h0:t.height,base:r.getImageData(0,0,s,n)},this.cache}paint(){const t=this.pending;if(!t)return;const{canvas:a,settings:i}=this.engine,{x:s,y:n}=this.viewport.getCanvasCoords(t);if(s<0||n<0||s>=a.width||n>=a.height){this.overlay.style.opacity="0",this.lastKey="";return}const o=this.prepare(),r=Math.min(o.w-1,Math.floor(s*o.k)),l=Math.min(o.h-1,Math.floor(n*o.k)),c=`${o.rev}|${r},${l}|${i.tolerance}|${i.contiguous}`;if(c===this.lastKey)return;this.lastKey=c;const d=new ImageData(new Uint8ClampedArray(o.base.data),o.w,o.h);if(!Ze(d,r,l,{tolerance:i.tolerance,feather:2,choke:0,contiguous:i.contiguous}).modified){this.overlay.style.opacity="0";return}const p=this.octx.createImageData(o.w,o.h),h=o.base.data,u=d.data,m=p.data;for(let f=3;f<h.length;f+=4){const y=h[f]-u[f];y>Po&&(m[f-3]=255,m[f-2]=45,m[f-1]=85,m[f]=Math.min(150,y*.6))}(this.overlay.width!==o.w||this.overlay.height!==o.h)&&(this.overlay.width=o.w,this.overlay.height=o.h),this.octx.putImageData(p,0,0),this.overlay.style.opacity="1"}}function Ro(e,t){const a=e("#font-dropdown-trigger"),i=e("#font-dropdown-menu"),s=e("#font-trigger-text"),n=e("#font-trigger-badge");a==null||a.addEventListener("click",o=>{o.stopPropagation(),i.style.display=i.style.display==="block"?"none":"block"}),i==null||i.addEventListener("click",o=>{const r=o.target.closest(".font-dropdown-item");if(!r)return;i.querySelectorAll(".font-dropdown-item").forEach(c=>c.classList.toggle("active",c===r));const l=ya(r.dataset.font);s&&(s.textContent=l.label,s.style.fontFamily=l.family),n&&(n.textContent=l.group),i.style.display="none",t()}),document.addEventListener("click",o=>{i&&i.style.display==="block"&&!o.target.closest("#font-dropdown-container")&&(i.style.display="none")})}class _o{constructor(t){this.ed=t,this.layer=null,this.active=!1,this.drag=null,this.raf=0,this.q=a=>t.backdrop.querySelector(a),this.overlay=document.createElement("canvas"),this.overlay.className="text-layer-overlay",this.octx=this.overlay.getContext("2d"),t.wrap.appendChild(this.overlay),this.bind()}setActive(t){this.active=t,this.overlay.classList.toggle("is-active",t)}hasDraft(){return!!this.layer}reset(){this.layer=null;const t=this.q("#text-input");t&&(t.value=Y.text),this.refreshButtons(),this.draw()}create(){const t=s=>this.q(s).value,a=this.q(".font-dropdown-item.active"),i=(a==null?void 0:a.dataset.font)||Y.fontId;this.layer={...Y,...this.layer||{},text:t("#text-input")||Y.text,fontId:i,sizePct:+t("#text-size"),curve:+t("#text-curve"),strokeW:+t("#text-stroke-w"),shadow:+t("#text-shadow"),fill:t("#text-fill"),stroke:t("#text-stroke"),shadowColor:t("#text-shadow-color")},this.loadFont(),this.refreshButtons(),this.render()}loadFont(){var a;const t=ya(this.layer.fontId);(a=document.fonts)==null||a.load(`${t.weight} 40px ${t.family}`,this.layer.text).then(()=>this.render()).catch(()=>{})}refreshButtons(){const t=this.q("#btn-text-commit"),a=this.q("#btn-text-discard");t&&(t.disabled=!this.layer),a&&(a.disabled=!this.layer)}render(){this.raf||(this.raf=requestAnimationFrame(()=>{this.raf=0,this.draw()}))}draw(){const{canvas:t}=this.ed,{width:a,height:i}=t;if((this.overlay.width!==a||this.overlay.height!==i)&&(this.overlay.width=a,this.overlay.height=i),this.octx.clearRect(0,0,a,i),!this.layer)return;const s=_e(this.octx,this.layer,a,i);if(!s)return;const n=Math.max(3,a/250),o=n*3;this.octx.save(),this.octx.strokeStyle="#00f0ff",this.octx.lineWidth=n,this.octx.setLineDash([n*4,n*3]),this.octx.strokeRect(s.x0-o,s.y0-o,s.x1-s.x0+o*2,s.y1-s.y0+o*2),this.octx.restore()}commit(){if(!this.layer)return!1;const{canvas:t}=this.ed,a=document.createElement("canvas");a.width=t.width,a.height=t.height;const i=a.getContext("2d"),s=_e(i,this.layer,t.width,t.height);if(s){const o=s.y0<0?Math.ceil(-s.y0+15):0,r=s.y1>t.height?Math.ceil(s.y1-t.height+15):0,l=s.x0<0?Math.ceil(-s.x0+15):0,c=s.x1>t.width?Math.ceil(s.x1-t.width+15):0;if(o>0||r>0||l>0||c>0){const d=t.width,g=t.height,p=this.ed.engine.expandCanvas({top:o,bottom:r,left:l,right:c});if(p){const h=this.layer.x*d+l,u=this.layer.y*g+o;this.layer.x=h/p.width,this.layer.y=u/p.height}}}const n=this.layer;return this.ed.engine.drawOnto((o,r)=>_e(o,n,r.width,r.height)),this.layer=null,this.refreshButtons(),this.draw(),this.ed.updateStatus("Texto fijado en el arte"),!0}discard(){this.layer=null,this.refreshButtons(),this.draw()}bind(){var o,r,l,c,d,g,p,h,u,m,f,y;const t=this.q,a=()=>{this.layer&&this.create()},i=(v,w)=>{const b=t(v);b&&(b.textContent=w)};(o=t("#text-input"))==null||o.addEventListener("input",a),(r=t("#btn-text-add"))==null||r.addEventListener("click",()=>{var v;this.layer=null,this.create(),(v=t("#text-input"))==null||v.focus()}),Ro(t,()=>this.create()),(l=t("#text-size"))==null||l.addEventListener("input",v=>{i("#text-size-val",`${v.target.value}%`),a()}),(c=t("#text-curve"))==null||c.addEventListener("input",v=>{i("#text-curve-val",`${v.target.value}%`),a()}),(d=t("#text-curve-val"))==null||d.addEventListener("click",()=>{const v=t("#text-curve");v&&(v.value=0,bt(v)),i("#text-curve-val","0%"),a()}),(g=t("#text-stroke-w"))==null||g.addEventListener("input",v=>{i("#text-stroke-val",v.target.value),a()}),(p=t("#text-shadow"))==null||p.addEventListener("input",v=>{i("#text-shadow-val",v.target.value),a()}),["#text-fill","#text-stroke","#text-shadow-color"].forEach(v=>{var w;return(w=t(v))==null?void 0:w.addEventListener("input",a)}),(h=t("#btn-text-commit"))==null||h.addEventListener("click",()=>this.commit()),(u=t("#btn-text-discard"))==null||u.addEventListener("click",()=>this.discard()),(m=t("#btn-pad-top"))==null||m.addEventListener("click",()=>{const v=Math.round(this.ed.canvas.height*.22),w=this.ed.engine.expandCanvas({top:v});w&&(this.layer||this.create(),this.layer.y=v*.5/w.height,this.draw(),this.ed.updateStatus("Espacio superior añadido para títulos"))}),(f=t("#btn-pad-bottom"))==null||f.addEventListener("click",()=>{const v=Math.round(this.ed.canvas.height*.22),w=this.ed.canvas.height,b=this.ed.engine.expandCanvas({bottom:v});b&&(this.layer||this.create(),this.layer.y=(w+v*.5)/b.height,this.draw(),this.ed.updateStatus("Espacio inferior añadido para subtítulos"))}),(y=t("#btn-pad-sides"))==null||y.addEventListener("click",()=>{const v=Math.round(this.ed.canvas.width*.15);this.ed.engine.expandCanvas({left:v,right:v})&&(this.layer||this.create(),this.draw(),this.ed.updateStatus("Margen lateral añadido"))});const s=this.overlay;s.addEventListener("pointerdown",v=>{if(!this.active||this.ed.viewport.shouldPan(v))return;const w=this.frac(v),b=!this.layer;b&&this.create(),this.drag=b?{dx:0,dy:0}:{dx:this.layer.x-w.x,dy:this.layer.y-w.y},s.setPointerCapture(v.pointerId),this.move(w),v.preventDefault()}),s.addEventListener("pointermove",v=>{this.drag&&this.move(this.frac(v))});const n=()=>{this.drag=null};s.addEventListener("pointerup",n),s.addEventListener("pointercancel",n)}frac(t){const{x:a,y:i}=this.ed.viewport.getCanvasCoords(t),{width:s,height:n}=this.ed.canvas;return{x:a/s,y:i/n}}move(t){!this.layer||!this.drag||(this.layer.x=Math.min(1.3,Math.max(-.3,t.x+this.drag.dx)),this.layer.y=Math.min(1.3,Math.max(-.3,t.y+this.drag.dy)),this.render())}}class zo{constructor(t,a,i,s=()=>{}){this.engine=t,this.viewport=a,this.onCropChange=s,this.isActive=!1,this.isDragging=!1,this.mode="rect",this.rect=null,this.lassoPoints=null,this.startPt=null,this.overlay=document.createElement("canvas"),this.overlay.className="crop-overlay",this.overlay.style.position="absolute",this.overlay.style.inset="0",this.overlay.style.width="100%",this.overlay.style.height="100%",this.overlay.style.pointerEvents="none",this.overlay.style.zIndex="3",this.octx=this.overlay.getContext("2d"),i.appendChild(this.overlay),this.bindEvents()}setMode(t){this.mode=t,this.clear(),this.onCropChange(!1)}autoTrim(){const t=this.engine.autoCrop();return this.clear(),this.viewport.zoomFit(),t}getHasValidSelection(){return this.mode==="rect"?!!(this.rect&&this.rect.w>=10&&this.rect.h>=10):this.mode==="lasso"?!!(this.lassoPoints&&this.lassoPoints.length>=3):!1}bindEvents(){const t=this.viewport.viewportEl;t&&(t.addEventListener("pointerdown",a=>{if(!this.isActive||a.button!==0||this.viewport.shouldPan(a))return;const i=this.viewport.getCanvasCoords(a),s=this.engine.canvas.width,n=this.engine.canvas.height;i.x<0||i.y<0||i.x>s||i.y>n||(this.isDragging=!0,this.startPt=i,this.mode==="rect"?this.rect={x:i.x,y:i.y,w:0,h:0}:this.lassoPoints=[{x:i.x,y:i.y}],this.render(),a.stopPropagation())}),window.addEventListener("pointermove",a=>{if(!this.isActive||!this.isDragging||!this.startPt)return;const i=this.viewport.getCanvasCoords(a),s=this.engine.canvas.width,n=this.engine.canvas.height,o=Math.max(0,Math.min(s,i.x)),r=Math.max(0,Math.min(n,i.y));if(this.mode==="rect"){const l=Math.min(this.startPt.x,o),c=Math.min(this.startPt.y,r),d=Math.abs(o-this.startPt.x),g=Math.abs(r-this.startPt.y);this.rect={x:l,y:c,w:d,h:g}}else{const l=this.lassoPoints[this.lassoPoints.length-1];(!l||Math.hypot(o-l.x,r-l.y)>=3)&&this.lassoPoints.push({x:o,y:r})}this.render()}),window.addEventListener("pointerup",()=>{this.isDragging&&(this.isDragging=!1,this.mode==="rect"&&this.rect&&(this.rect.w<10||this.rect.h<10)?this.rect=null:this.mode==="lasso"&&this.lassoPoints&&this.lassoPoints.length<3&&(this.lassoPoints=null),this.render(),this.onCropChange(this.getHasValidSelection()))}))}setActive(t){this.isActive=t,this.overlay.style.display=t?"block":"none",t?this.render():this.clear()}clear(){this.rect=null,this.lassoPoints=null,this.startPt=null,this.isDragging=!1,this.octx.clearRect(0,0,this.overlay.width,this.overlay.height)}render(){const{canvas:t}=this.engine;(this.overlay.width!==t.width||this.overlay.height!==t.height)&&(this.overlay.width=t.width,this.overlay.height=t.height);const a=this.octx,i=t.width,s=t.height;if(a.clearRect(0,0,i,s),!!this.isActive){if(this.mode==="rect"&&this.rect&&this.rect.w>=4&&this.rect.h>=4){const{x:n,y:o,w:r,h:l}=this.rect;a.fillStyle="rgba(0, 0, 0, 0.55)",a.fillRect(0,0,i,o),a.fillRect(0,o+l,i,s-(o+l)),a.fillRect(0,o,n,l),a.fillRect(n+r,o,i-(n+r),l),a.strokeStyle="#00f0ff",a.lineWidth=Math.max(2,Math.round(i/400)),a.strokeRect(n,o,r,l),a.strokeStyle="rgba(255, 255, 255, 0.35)",a.lineWidth=1,a.beginPath(),a.moveTo(n+r/3,o),a.lineTo(n+r/3,o+l),a.moveTo(n+2*r/3,o),a.lineTo(n+2*r/3,o+l),a.moveTo(n,o+l/3),a.lineTo(n+r,o+l/3),a.moveTo(n,o+2*l/3),a.lineTo(n+r,o+2*l/3),a.stroke();const c=`${Math.round(r)} × ${Math.round(l)} px`;this.drawBadge(a,c,n+8,o+8,"#ffffff","#00f0ff")}else if(this.mode==="lasso"&&this.lassoPoints&&this.lassoPoints.length>=2){const n=this.lassoPoints;a.fillStyle="rgba(0, 0, 0, 0.55)",a.beginPath(),a.rect(0,0,i,s),a.moveTo(n[0].x,n[0].y);for(let o=1;o<n.length;o++)a.lineTo(n[o].x,n[o].y);a.closePath(),a.fill("evenodd"),a.strokeStyle="#00f0ff",a.lineWidth=Math.max(2,Math.round(i/400)),a.beginPath(),a.moveTo(n[0].x,n[0].y);for(let o=1;o<n.length;o++)a.lineTo(n[o].x,n[o].y);if(this.isDragging||a.closePath(),a.stroke(),!this.isDragging&&n.length>=3){const o=n.reduce((l,c)=>l+c.x,0)/n.length,r=n.reduce((l,c)=>l+c.y,0)/n.length;this.drawBadge(a,"✨ AISLAR SILUETA",o-50,r,"#00f0ff","#00f0ff")}}}}drawBadge(t,a,i,s,n,o){const r=Math.max(12,Math.round(this.engine.canvas.width/48));t.font=`700 ${r}px system-ui, sans-serif`;const l=t.measureText(a).width,c=10,d=5,g=Math.max(8,Math.min(this.engine.canvas.width-l-24,i)),p=Math.max(8,Math.min(this.engine.canvas.height-r-18,s));t.fillStyle="rgba(10, 14, 22, 0.85)",t.beginPath(),t.roundRect?t.roundRect(g,p,l+c*2,r+d*2,6):t.rect(g,p,l+c*2,r+d*2),t.fill(),t.strokeStyle=o,t.lineWidth=1.2,t.stroke(),t.fillStyle=n,t.fillText(a,g+c,p+r+d-2)}apply(){if(!this.getHasValidSelection())return!1;if(this.mode==="rect"){const t=this.engine.crop(this.rect);return this.clear(),t}if(this.mode==="lasso"){const{canvas:t,ctx:a}=this.engine,i=t.width,s=t.height,n=this.lassoPoints;this.engine.pushUndo(),this.engine.lastAction=null;const o=document.createElement("canvas");o.width=i,o.height=s;const r=o.getContext("2d");r.beginPath(),r.moveTo(n[0].x,n[0].y);for(let c=1;c<n.length;c++)r.lineTo(n[c].x,n[c].y);r.closePath(),r.fillStyle="#ffffff",r.fill(),a.save(),a.globalCompositeOperation="destination-in",a.drawImage(o,0,0),a.restore();const l=Ci(t);return t.width=l.width,t.height=l.height,a.clearRect(0,0,l.width,l.height),a.drawImage(l,0,0),this.clear(),this.engine.touch(),!0}return!1}}function Fo(e){const{q:t,engine:a,viewport:i,canvas:s,viewportEl:n,hover:o,updateStatus:r,isOpen:l,backdrop:c}=e,d=t("#btn-tool-wand"),g=t("#btn-tool-brush"),p=t("#btn-tool-crop"),h=t("#wand-options-panel"),u=t("#brush-options-panel"),m=t("#crop-options-panel"),f=t("#btn-apply-crop"),y=t("#btn-cancel-crop"),v=t("#btn-crop-mode-rect"),w=t("#btn-crop-mode-lasso"),b=t("#crop-mode-hint"),x=t("#btn-crop-autotrim"),E=t("#btn-mode-connected"),S=t("#btn-mode-global"),M=t("#btn-mode-viewport"),A=t("#btn-clean-screen-border"),$=t("#tolerance-slider"),z=t("#tol-val"),B=t("#brush-size-slider"),J=t("#brush-size-val");let it=!1,st="connected";const D=new zo(a,i,c.querySelector("#editor-canvas-wrap"),T=>{f&&(f.disabled=!T)}),q={rect:"Arrastra un recuadro sobre la imagen para seleccionar el área deseada.",lasso:"Dibuja a mano alzada rodeando el elemento que deseas aislar."},j=T=>{D.setMode(T),v==null||v.classList.toggle("active",T==="rect"),w==null||w.classList.toggle("active",T==="lasso"),b&&(b.textContent=q[T])};v==null||v.addEventListener("click",()=>j("rect")),w==null||w.addEventListener("click",()=>j("lasso")),x==null||x.addEventListener("click",()=>{D.autoTrim(),r("📐 Lienzo ajustado sin sobrantes"),R("¡Lienzo ajustado al dibujo sin sobrantes!","success")}),A==null||A.addEventListener("click",()=>{const T=i.getVisibleCanvasRect(),F=a.cleanVisibleEdges(T);F&&F.modified?(r(`🧹 Limpiados ${F.cleanedCount} px de borde`),R(`¡Borde limpiado en pantalla! (${F.cleanedCount} px)`,"success")):R("No se detectaron bordes oscuros en este encuadre","info")});const nt={wand:[d,h],brush:[g,u],crop:[p,m]};function et(T){a.activeTool=T,n.setAttribute("data-active-tool",T);for(const[F,[at,ee]]of Object.entries(nt))at==null||at.classList.toggle("active",T===F),ee&&(ee.style.display=T===F?"block":"none");D.setActive(T==="crop"),i.hideRing(),o.clear()}Object.entries(nt).forEach(([T,[F]])=>F==null?void 0:F.addEventListener("click",()=>et(T))),f==null||f.addEventListener("click",()=>{D.apply()&&(r("✂️ Recorte libre aplicado"),i.zoomFit(),et("wand"),R("¡Arte aislado con éxito!","success"))}),y==null||y.addEventListener("click",()=>{D.clear(),et("wand")});const k=T=>{a.brush.radius=T,B&&(B.value=T,bt(B)),J&&(J.textContent=`${T}px`)};B==null||B.addEventListener("input",T=>k(parseInt(T.target.value,10))),e.backdrop.querySelectorAll(".btn-brush-preset").forEach(T=>{T.addEventListener("click",()=>{e.backdrop.querySelectorAll(".btn-brush-preset").forEach(F=>F.classList.toggle("active",F===T)),k(parseInt(T.getAttribute("data-brush-size"),10))})});let O=0;$==null||$.addEventListener("input",T=>{if(a.settings.tolerance=parseInt(T.target.value,10),z&&(z.textContent=`${a.settings.tolerance}%`),o.clear(),a.lastAction){if(O)return;O=requestAnimationFrame(()=>{O=0,a.previewAction()&&r("Vista previa • suelta para afinar a calidad completa")})}}),$==null||$.addEventListener("change",()=>{O&&(cancelAnimationFrame(O),O=0),a.lastAction&&(a.rerunLastAction(),r())});const L=T=>{var at;st=T;const F=T!=="global";a.settings.contiguous=F,E==null||E.classList.toggle("active",T==="connected"),S==null||S.classList.toggle("active",T==="global"),M==null||M.classList.toggle("active",T==="viewport"),o.clear(),((at=a.lastAction)==null?void 0:at.type)==="pixel"&&(a.lastAction.contiguous=F,a.lastAction.bounds=T==="viewport"?i.getVisibleCanvasRect():null,a.rerunLastAction(),r())};Object.entries({connected:E,global:S,viewport:M}).forEach(([T,F])=>F==null?void 0:F.addEventListener("click",()=>L(T)));const P=(T,F)=>{const at=st==="viewport"?i.getVisibleCanvasRect():null;a.eraseAtPixel(T,F,{bounds:at}).success&&r()};s.addEventListener("pointerdown",T=>{if(T.pointerType==="touch"||!l()||e.getTab()!=="bg"||i.shouldPan(T)||a.activeTool==="crop")return;const{x:F,y:at}=i.getCanvasCoords(T);a.activeTool==="brush"?(it=!0,a.brush.start(F,at)):a.activeTool==="wand"&&(o.clear(),P(F,at))}),window.addEventListener("pointermove",T=>{var F;if(!(!l()||T.pointerType==="touch"))if(i.updateRing(T,a.brush.radius),it&&a.activeTool==="brush"){const at=((F=T.getCoalescedEvents)==null?void 0:F.call(T))??[];for(const ee of at.length?at:[T]){const{x:Gs,y:Ys}=i.getCanvasCoords(ee);a.brush.to(Gs,Ys)}}else!i.isPanning&&!i.isSpacePressed&&a.activeTool==="wand"&&o.move(T)});const U=()=>{it&&(it=!1,a.brush.end(),r())};["pointerup","pointercancel"].forEach(T=>window.addEventListener(T,U)),n.addEventListener("pointerleave",T=>{T.pointerType!=="touch"&&(i.hideRing(),o.clear())});function ot(T,F){T.classList.add("is-busy"),r("⏳ Procesando…"),requestAnimationFrame(()=>setTimeout(()=>{try{F()}finally{T.classList.remove("is-busy")}},0))}const gt=t("#btn-hero-auto");return gt==null||gt.addEventListener("click",()=>ot(gt,()=>{if(a.autoErase().transparent){r("El fondo ya es transparente");return}r("✨ Fondo removido • borde afinado 1 px, sin halos"),R("¡Fondo eliminado con borde limpio!","success")})),{setActiveTool:et,eraseWandAt:P,stopBrush:()=>{it=!1,a.brush.end()},resetControls(){a.settings.tolerance=30,$&&($.value=30,bt($)),z&&(z.textContent="30%"),L("connected"),k(20),e.backdrop.querySelectorAll(".btn-brush-preset").forEach(T=>T.classList.toggle("active",T.dataset.brushSize==="20")),j("rect"),D.clear()}}}const ct=104,qo=66,Ct=6;class Bo{constructor(t,a,i,s){this.viewportEl=t,this.engine=a,this.viewport=i,this.hover=s,this.pt=null,this.raf=0,this.dpr=Math.min(2,window.devicePixelRatio||1),this.el=document.createElement("canvas"),this.el.className="touch-loupe",this.el.width=this.el.height=Math.round(ct*this.dpr),this.el.setAttribute("aria-hidden","true"),this.ctx=this.el.getContext("2d"),t.appendChild(this.el)}show(t,a){this.pt={clientX:t,clientY:a},this.el.classList.add("on"),this.place(),this.schedule()}hide(){this.pt=null,this.el.classList.remove("on")}refresh(){this.pt&&this.schedule()}schedule(){this.raf||(this.raf=requestAnimationFrame(()=>{this.raf=0,this.pt&&this.draw()}))}place(){const t=this.viewportEl.getBoundingClientRect(),a=ct/2,i=this.pt.clientX-t.left,s=this.pt.clientY-t.top;let n=i,o=s-qo;o<a+Ct&&(o=Math.max(a+Ct,s),n=i<t.width/2?i+a+34:i-a-34),n=Math.min(t.width-a-Ct,Math.max(a+Ct,n)),o=Math.min(t.height-a-Ct,Math.max(a+Ct,o)),this.el.style.transform=`translate3d(${n-a}px, ${o-a}px, 0)`}paintStage(){const{ctx:t}=this,a=this.viewportEl.dataset.stageBg!=="checkers";if(t.fillStyle=a?this.viewportEl.style.backgroundColor||"#1a1a24":"#e2e8f0",t.fillRect(0,0,ct,ct),!a){t.fillStyle="#94a3b8";for(let i=0;i<ct;i+=10)for(let s=i/10%2?0:10;s<ct;s+=20)t.fillRect(s,i,10,10)}}draw(){var m;const{canvas:t,brush:a}=this.engine,{ctx:i,dpr:s}=this,n=t.getBoundingClientRect();if(!n.width||!t.width)return;const o=n.width/t.width,r=Math.min(10,Math.max(3,o*2.2)),l=ct/r,{x:c,y:d}=this.viewport.getCanvasCoords(this.pt),g=c-l/2,p=d-l/2;i.setTransform(s,0,0,s,0,0),this.paintStage(),i.imageSmoothingEnabled=r<4,i.drawImage(t,g,p,l,l,0,0,ct,ct);const h=(m=this.hover)==null?void 0:m.overlay;if(h&&h.style.opacity==="1"&&this.engine.activeTool==="wand"){const f=h.width/t.width;i.drawImage(h,g*f,p*f,l*f,l*f,0,0,ct,ct)}const u=ct/2;i.lineWidth=1.5,this.engine.activeTool==="brush"?(i.strokeStyle="#00f0ff",i.beginPath(),i.arc(u,u,Math.min(u-3,a.radius*r),0,Math.PI*2),i.stroke()):(i.strokeStyle="rgba(255, 255, 255, 0.95)",i.shadowColor="rgba(0, 0, 0, 0.8)",i.shadowBlur=2,i.beginPath(),i.moveTo(u-10,u),i.lineTo(u-3,u),i.moveTo(u+3,u),i.lineTo(u+10,u),i.moveTo(u,u-10),i.lineTo(u,u-3),i.moveTo(u,u+3),i.lineTo(u,u+10),i.stroke(),i.shadowBlur=0)}}const No=90,Uo=5,Ho=50,jo={wand:"🪄 Varita",brush:"🧹 Goma",crop:"✂️ Recorte"};function Vo(e,t){const{q:a,engine:i,viewport:s,viewportEl:n,hover:o,updateStatus:r}=e,l=new Bo(n,i,s,o),c=a("#btn-touch-move"),d=a("#btn-touch-edit"),g=new Map;let p="edit",h=null,u=0,m=null,f=null,y=null,v=null,w=0,b=0,x=null;const E=document.createElement("div");E.className="touch-confirm-bar",E.hidden=!0,E.innerHTML='<button type="button" class="touch-confirm-ok">✓ Borrar</button><button type="button" class="touch-confirm-cancel" aria-label="Cancelar">✕</button>',n.appendChild(E);const S=()=>{v=null,E.hidden=!0};o.onPaint=()=>l.refresh(),o.onClear=S;const M=()=>e.getTab()==="bg",A=()=>i.activeTool,$=()=>A()==="wand"||A()==="brush",z=L=>s.getCanvasCoords({clientX:L.x,clientY:L.y}),B=L=>({x:L.clientX,y:L.clientY});function J(L){p=L,c==null||c.classList.toggle("active",p==="move"),d==null||d.classList.toggle("active",p==="edit"),n.dataset.touchMode=p,st(),S(),o.clear()}c==null||c.addEventListener("click",()=>J("move")),d==null||d.addEventListener("click",()=>J("edit"));const it=()=>{d&&(d.textContent=jo[A()]||"✏️ Editar"),st()};new MutationObserver(it).observe(n,{attributes:!0,attributeFilter:["data-active-tool"]});function st(){clearTimeout(u),q(),h==="brush"&&(i.brush.end(),r()),h==="aim"&&o.clear(),l.hide(),h!=="pinch"&&(h=null)}const D=()=>{w=0,b=performance.now(),x&&o.move({clientX:x.x,clientY:x.y})},q=()=>{clearTimeout(w),w=0,x=null};function j(L){l.show(L.x,L.y),x=L;const P=Ho-(performance.now()-b);P<=0?(clearTimeout(w),D()):w||(w=setTimeout(D,P))}function nt(L){if(h!=="brush-wait")return;h="brush";const P=z(L);i.brush.start(P.x,P.y),l.show(L.x,L.y),r("🧹 Borrando · la lupa muestra el área bajo tu dedo")}function et(){st(),s.stopAnimation();const[L,P]=[...g.values()],U=n.getBoundingClientRect();h="pinch",y={d0:Math.hypot(L.x-P.x,L.y-P.y)||1,z0:s.zoom,px0:s.panX,py0:s.panY,cx0:(L.x+P.x)/2-U.left-U.width/2,cy0:(L.y+P.y)/2-U.top-U.height/2}}function k(){const[L,P]=[...g.values()],U=n.getBoundingClientRect(),ot=Math.min(ja[1],Math.max(ja[0],y.z0*(Math.hypot(L.x-P.x,L.y-P.y)/y.d0))),gt=(L.x+P.x)/2-U.left-U.width/2,T=(L.y+P.y)/2-U.top-U.height/2;s.moveTo(ot,gt-ot*((y.cx0-y.px0)/y.z0),T-ot*((y.cy0-y.py0)/y.z0),!0)}n.addEventListener("pointerdown",L=>{var U;if(L.pointerType!=="touch"||!e.isOpen()||!M()||L.target.closest(".touch-confirm-bar"))return;if(e.backdrop.classList.add("has-touch"),(U=n.setPointerCapture)==null||U.call(n,L.pointerId),g.set(L.pointerId,B(L)),g.size>=2){et();return}if(A()==="crop"){h="ignore";return}S();const P=B(L);m=P,p==="move"||!$()?(h="pan",s.stopAnimation(),f={x:P.x-s.panX,y:P.y-s.panY}):A()==="wand"?(h="aim",j(P),r("👆 Apunta con la lupa · suelta y pulsa ✓ Borrar")):(h="brush-wait",u=setTimeout(()=>nt(g.values().next().value||P),No))}),n.addEventListener("pointermove",L=>{var U;if(L.pointerType!=="touch"||!g.has(L.pointerId))return;const P=B(L);if(g.set(L.pointerId,P),h==="pinch")k();else if(h==="pan")s.moveTo(s.zoom,P.x-f.x,P.y-f.y,!0);else if(h==="aim")j(P);else if(h==="brush-wait"&&Math.hypot(P.x-m.x,P.y-m.y)>Uo)clearTimeout(u),nt(P);else if(h==="brush"){for(const ot of((U=L.getCoalescedEvents)==null?void 0:U.call(L))||[L]){const gt=z(B(ot));i.brush.to(gt.x,gt.y)}l.show(P.x,P.y)}});function O(L){if(L.pointerType!=="touch"||!g.has(L.pointerId))return;const P=g.get(L.pointerId);if(g.delete(L.pointerId),h==="pinch"){g.size<2&&(h=g.size?"ignore":null);return}if(g.size)return;const U=h;if(h=null,clearTimeout(u),l.hide(),U==="aim"){if(q(),L.type!=="pointercancel"&&o.flush({clientX:P.x,clientY:P.y}),L.type==="pointercancel"||o.overlay.style.opacity!=="1"){o.clear(),r();return}const ot=z(P);v={x:ot.x,y:ot.y},E.hidden=!1,r("Vista previa en rojo · ✓ Borrar para confirmar")}else if(U==="brush-wait"){const ot=z(P);i.brush.start(ot.x,ot.y),i.brush.end(),r()}else U==="brush"&&(i.brush.end(),r())}return window.addEventListener("pointerup",O),window.addEventListener("pointercancel",O),E.querySelector(".touch-confirm-ok").addEventListener("click",()=>{const L=v;S(),o.clear(),L&&t.eraseWandAt(L.x,L.y)}),E.querySelector(".touch-confirm-cancel").addEventListener("click",()=>{o.clear(),r()}),{reset(){g.clear(),st(),h=null,S(),o.clear(),J("edit")}}}const Ga="shirtStudio.imageEditorTour.v1",ie=6,qt=300,Gi=768,At=[{target:"#editor-viewport",tab:"bg",place:"right",title:"Lienzo de Trabajo",text:"Aquí ves tu arte sobre el color de la prenda (👕 Prenda) o sobre una cuadrícula transparente (🏁). Rueda del ratón = zoom · barra espaciadora + arrastrar = mover.",touchText:"Pellizca con 2 dedos para zoom y desliza para mover el arte. Cambia el fondo para ver cómo luce sobre tu camiseta."},{target:"#editor-hero-card",tab:"bg",place:"left",title:"Quitar Fondo en 1 Clic",text:"Pulsa ✨ Quitar Fondo en 1 Clic: la detección inteligente encuentra el fondo (del color que sea, incluido el verde croma), lo elimina y afina el borde sin dejar halos."},{target:"#editor-manual-block",tab:"bg",place:"left",title:"Retoque Manual",text:"La 🪄 Varita borra la zona que tocas (o todo ese color) y te marca en rojo qué se va a borrar antes del clic. La 🧹 Goma sirve para los detalles finos.",touchText:"Apunta con el dedo: una lupa flota sobre él para que lo veas todo. Con la 🪄 Varita, al soltar se tiñe en rojo lo que se borra y confirmas con ✓ Borrar. 🖐️ Mover desplaza el arte sin borrar."},{target:"#panel-adjust",tab:"adjust",place:"left",title:"Ajustes, Giro & Filtros",text:"Brillo, contraste, saturación y nitidez con vista previa en vivo; giro libre de 360°, volteos y filtros streetwear (Street, Duotone, Halftone DTF y Vintage). Todo se puede deshacer."},{target:"#panel-text",tab:"text",place:"left",title:"Textos & Caligrafías",text:"Agrega títulos, elige tipografías urbanas (cursivas, góticas, graffiti y bold), cúrvalos en arco y arrástralos sobre el lienzo."},{target:".editor-actions-stack",tab:"text",place:"left",title:"Aplicar, Guardar o Descargar",text:"Aplicar a Camiseta proyecta el arte en 3D. Con 💾 Reemplazar, ➕ Copia y 📥 Descargar (PNG 300 DPI) lo conservas sin salir del editor."}],Go=()=>{var e;return window.innerWidth<=Gi||!!((e=window.matchMedia)!=null&&e.call(window,"(pointer: coarse)").matches)},Yo=()=>{var e;return!!((e=window.matchMedia)!=null&&e.call(window,"(prefers-reduced-motion: reduce)").matches)},Ya={seen(){try{return localStorage.getItem(Ga)==="1"}catch{return!1}},mark(){try{localStorage.setItem(Ga,"1")}catch{}}};function Xo({backdrop:e,switchTab:t}){const a=document.createElement("div");a.className="editor-tour",a.hidden=!0,a.innerHTML=`
    <div class="tour-spot"></div>
    <div class="tour-card" role="dialog" aria-live="polite">
      <button type="button" class="tour-x" aria-label="Cerrar tour">✕</button>
      <div class="tour-count"></div><h4 class="tour-title"></h4><p class="tour-text"></p>
      <div class="tour-dots"></div>
      <div class="tour-nav">
        <button type="button" class="tour-skip">Omitir</button><span class="tour-spacer"></span>
        <button type="button" class="tour-back">Atrás</button>
        <button type="button" class="tour-next">Siguiente</button>
      </div>
    </div>`,e.appendChild(a);const i=b=>a.querySelector(b),s=i(".tour-spot"),n=i(".tour-card");let o=0,r=0,l=0,c=0;const d=()=>window.innerWidth<=Gi;function g(b,x){if(d()){n.style.left="",n.style.top="";return}const E=n.offsetHeight,S=window.innerWidth,M=window.innerHeight;let A,$;b.place==="right"&&x.right+qt+28<=S?(A=x.right+16,$=x.top+(x.height-E)/2):b.place==="right"?(A=x.left+(x.width-qt)/2,$=x.bottom-E-16):(A=x.left-qt-16,$=x.top+(x.height-E)/2,A<12&&(A=Math.min(S-qt-12,x.right+16))),n.style.left=`${Math.max(12,Math.min(S-qt-12,A))}px`,n.style.top=`${Math.max(12,Math.min(M-E-12,$))}px`}function p(b){const x=b.getBoundingClientRect();return Object.assign(s.style,{left:`${x.left-ie}px`,top:`${x.top-ie}px`,width:`${x.width+ie*2}px`,height:`${x.height+ie*2}px`}),`${Math.round(x.left)}|${Math.round(x.top)}|${Math.round(x.width)}|${Math.round(x.height)}`}function h(b,x){cancelAnimationFrame(l);const E=performance.now();let S="",M=0;const A=()=>{if(x!==r||a.hidden)return;const $=p(b);M=$===S?M+1:0,S=$,M<10||performance.now()-E<350?l=requestAnimationFrame(A):g(At[o],b.getBoundingClientRect())};A()}function u(b){const x=window.innerHeight-n.offsetHeight-80,E=b.getBoundingClientRect().height>x*.8;b.scrollIntoView({behavior:Yo()?"auto":"smooth",block:E?"start":"center"})}function m(){const b=At[o],x=d(),E=++r;c=window.innerWidth,a.classList.toggle("is-dock",x),e.classList.toggle("tour-dock-open",x&&!a.hidden),t(b.tab),requestAnimationFrame(()=>{if(E!==r)return;const S=e.querySelector(b.target);S&&(i(".tour-count").textContent=`Paso ${o+1} de ${At.length}`,i(".tour-title").textContent=b.title,i(".tour-text").textContent=Go()&&b.touchText||b.text,i(".tour-dots").innerHTML=At.map((M,A)=>`<i class="${A===o?"on":""}"></i>`).join(""),i(".tour-back").disabled=o===0,i(".tour-next").textContent=o===At.length-1?"¡Listo!":"Siguiente",g(b,S.getBoundingClientRect()),x?(u(S),requestAnimationFrame(()=>{E===r&&h(S,E)})):p(S))})}const f=()=>{(window.innerWidth!==c||!d())&&m()};function y(){a.hidden||(a.hidden=!0,r++,cancelAnimationFrame(l),e.classList.remove("tour-dock-open"),Ya.mark(),window.removeEventListener("keydown",w,!0),window.removeEventListener("resize",f),t("bg"))}const v=b=>{const x=o+b;if(x>=At.length){y();return}o=Math.max(0,x),m()};function w(b){b.key==="Escape"?(b.stopPropagation(),y()):b.key==="ArrowRight"||b.key==="Enter"?(b.preventDefault(),v(1)):b.key==="ArrowLeft"&&(b.preventDefault(),v(-1))}return i(".tour-next").addEventListener("click",()=>v(1)),i(".tour-back").addEventListener("click",()=>v(-1)),i(".tour-skip").addEventListener("click",y),i(".tour-x").addEventListener("click",y),{shouldAutoStart:()=>!Ya.seen(),start(){o=0,a.hidden=!1,window.addEventListener("keydown",w,!0),window.addEventListener("resize",f),m()},stop:y}}const Et=[{id:"green",name:"Verde Croma",nameEn:"solid chroma green",hex:"#00FF00",r:0,g:255,b:0},{id:"magenta",name:"Magenta Croma",nameEn:"solid magenta pink",hex:"#FF00FF",r:255,g:0,b:255},{id:"blue",name:"Azul Croma",nameEn:"solid chroma blue",hex:"#0047FF",r:0,g:71,b:255},{id:"cyan",name:"Cyan Croma",nameEn:"solid bright cyan",hex:"#00FFFF",r:0,g:255,b:255},{id:"yellow",name:"Amarillo Croma",nameEn:"solid bright yellow",hex:"#FFFF00",r:255,g:255,b:0}];function Wo(e,t,a,i,s,n){const o=e-i,r=t-s,l=a-n;return o*o+r*r+l*l}function Zo(e){if(!e||!e.data)return Et[0];const t=e.data,a=t.length,i=Math.max(1,Math.floor(a/4/3e3))*4,s=Et.map(()=>1/0);for(let r=0;r<a;r+=i){if(t[r+3]<30)continue;const l=t[r],c=t[r+1],d=t[r+2];for(let g=0;g<Et.length;g++){const p=Et[g],h=Wo(l,c,d,p.r,p.g,p.b);h<s[g]&&(s[g]=h)}}let n=0,o=-1;for(let r=0;r<Et.length;r++)s[r]>o&&(o=s[r],n=r);return Et[n]}function Qo(e,t="es"){const a=e||Et[0];return t==="en"?`STRICT PREPRESS RULE: Do NOT modify, redraw, or change the original subject in any way (must remain 100% identical). Use ONLY ONE single flat solid background color: ${a.nameEn} (${a.hex}). It is mandatory to use exclusively this single background color because it is NOT present in the character or anywhere in the artwork. The background must be completely flat and uniform, zero shadows, zero reflections, zero gradients, with razor-sharp cutout sticker edges for DTF printing.`:`REGLA ESTRICTA DE PREPRENSA: No modifiques, alteres ni redibujes ningún detalle del personaje o ilustración (la figura debe quedar 100% idéntica al original). Utiliza ÚNICAMENTE un solo color plano de fondo: ${a.name} (${a.hex}). Es mandatorio usar exclusivamente este color de fondo porque NO existe en el personaje ni en ningún elemento del diseño. El fondo debe ser 100% uniforme, plano, sin degradados, sin sombras y con bordes limpios y nítidos tipo calcomanía/sticker para calado perfecto DTF.`}function Jo(e){const t=d=>e.querySelector(d),a=t("#btn-toggle-ai-card"),i=t("#ai-prompt-body"),s=t("#ai-toggle-arrow"),n=t("#btn-copy-prompt"),o=t("#ai-prompt-input");let r=null,l="en";function c(){if(!r)return;o&&(o.value=Qo(r,l));const d=t("#ai-chroma-badge");d&&(d.textContent=r.name,d.style.color=r.hex==="#FFFFFF"?"#e2e8f0":r.hex,d.style.borderColor=r.hex)}return a==null||a.addEventListener("click",()=>{const d=i.style.display==="none";i.style.display=d?"flex":"none",s.textContent=d?"▴":"▾"}),e.querySelectorAll(".btn-prompt-lang").forEach(d=>{d.addEventListener("click",()=>{e.querySelectorAll(".btn-prompt-lang").forEach(g=>g.classList.remove("active")),d.classList.add("active"),l=d.getAttribute("data-lang")||"en",c()})}),n==null||n.addEventListener("click",async()=>{if(o)try{await navigator.clipboard.writeText(o.value),n.textContent="¡Copiado! ✓",R("Prompt copiado al portapapeles","success"),setTimeout(()=>{n.textContent="📋 Copiar Prompt"},1800)}catch{o.select(),document.execCommand("copy"),R("Prompt copiado","success")}}),{analyzeImage(d){r=Zo(d),c()}}}const Kt=300,ve=Kt/2.54;function ke(e,t){return!e||!t||t<=0?0:Math.round(e/(t/2.54))}function Yi(e){return e>=240?{level:"optimal",label:`${Math.min(e,Kt)} DPI • Óptimo DTF`,badgeClass:"dpi-optimal",icon:"🟢",summary:"Calidad perfecta de impresión textil: nitidez máxima para DTF."}:e>=150?{level:"good",label:`${e} DPI • Alta Calidad`,badgeClass:"dpi-optimal",icon:"🟢",summary:"Excelente resolución textil: nítida y perfectamente definida en la prenda."}:{level:"low",label:`${e} DPI • Calidad Baja (Remuestreado a 300 DPI para impresión)`,badgeClass:"dpi-low",icon:"⚠️",summary:`Resolución base de ${e} DPI. El motor remasteriza y escala a 300 DPI con Lanczos-3 al exportar, pero los detalles finos no se pueden inventar: usa una imagen más grande si puedes.`}}const Ko=e=>e===0?1:Math.abs(e)>=3?0:3*Math.sin(Math.PI*e)*Math.sin(Math.PI*e/3)/(Math.PI*Math.PI*e*e);function Xa(e,t){const a=t/e,i=Math.max(1,1/a),s=3*i,n=[];for(let o=0;o<t;o++){const r=(o+.5)/a-.5,l=Math.max(0,Math.ceil(r-s)),c=Math.min(e-1,Math.floor(r+s)),d=[];let g=0;for(let p=l;p<=c;p++){const h=Ko((p-r)/i);d.push(h),g+=h}n.push({s0:l,w:g!==0?d.map(p=>p/g):[1]})}return n}function Xi(e,t,a){const i=e.naturalWidth||e.width,s=e.naturalHeight||e.height;if(i*s>4e6||t*a>4e6){const m=document.createElement("canvas");m.width=t,m.height=a;const f=m.getContext("2d");return f.imageSmoothingEnabled=!0,f.imageSmoothingQuality="high",f.drawImage(e,0,0,t,a),m}const n=document.createElement("canvas");n.width=i,n.height=s;const o=n.getContext("2d",{willReadFrequently:!0});o.drawImage(e,0,0);const r=o.getImageData(0,0,i,s).data,l=Xa(i,t),c=Xa(s,a),d=new Uint8ClampedArray(t*s*4);for(let m=0;m<s;m++){const f=m*i,y=m*t;for(let v=0;v<t;v++){const{s0:w,w:b}=l[v];let x=0,E=0,S=0,M=0;for(let $=0;$<b.length;$++){const z=(f+w+$)*4,B=b[$];x+=r[z]*B,E+=r[z+1]*B,S+=r[z+2]*B,M+=r[z+3]*B}const A=(y+v)*4;d[A]=x,d[A+1]=E,d[A+2]=S,d[A+3]=M}}const g=document.createElement("canvas");g.width=t,g.height=a;const p=g.getContext("2d",{willReadFrequently:!0}),h=p.createImageData(t,a),u=h.data;for(let m=0;m<a;m++){const{s0:f,w:y}=c[m],v=m*t;for(let w=0;w<t;w++){let b=0,x=0,E=0,S=0;for(let A=0;A<y.length;A++){const $=((f+A)*t+w)*4,z=y[A];b+=d[$]*z,x+=d[$+1]*z,E+=d[$+2]*z,S+=d[$+3]*z}const M=(v+w)*4;u[M]=b,u[M+1]=x,u[M+2]=E,u[M+3]=S}}return p.putImageData(h,0,0),g}function Wi(e,t=.96,a=1){const i=e.getContext("2d"),s=e.width,n=e.height,o=i.getImageData(0,0,s,n),r=o.data,l=Math.ceil(a*3),c=[];let d=0;for(let p=-l;p<=l;p++){const h=Math.exp(-p*p/(2*a*a));c.push(h),d+=h}for(let p=0;p<c.length;p++)c[p]/=d;const g=new Uint8ClampedArray(r.length);for(let p=0;p<n;p++){const h=p*s;for(let u=0;u<s;u++){let m=0,f=0,y=0;for(let w=-l;w<=l;w++){const b=(h+Math.min(s-1,Math.max(0,u+w)))*4,x=c[w+l];m+=r[b]*x,f+=r[b+1]*x,y+=r[b+2]*x}const v=(h+u)*4;g[v]=m,g[v+1]=f,g[v+2]=y}}for(let p=0;p<n;p++){const h=p*s;for(let u=0;u<s;u++){let m=0,f=0,y=0;for(let E=-l;E<=l;E++){const S=(Math.min(n-1,Math.max(0,p+E))*s+u)*4,M=c[E+l];m+=g[S]*M,f+=g[S+1]*M,y+=g[S+2]*M}const v=(h+u)*4;if(r[v+3]<20)continue;const w=r[v]-m,b=r[v+1]-f,x=r[v+2]-y;Math.abs(w)>2&&(r[v]=Math.max(0,Math.min(255,r[v]+t*w))),Math.abs(b)>2&&(r[v+1]=Math.max(0,Math.min(255,r[v+1]+t*b))),Math.abs(x)>2&&(r[v+2]=Math.max(0,Math.min(255,r[v+2]+t*x)))}}i.putImageData(o,0,0)}function tr(e,t,a){const i=Math.max(1,Math.round(t*ve)),s=Math.max(1,Math.round(a*ve)),n=e.naturalWidth||e.width||1,o=Xi(e,i,s),r=i/n,l=Math.min(2,Math.max(.8,r*.45));return Wi(o,.96,l),o}const Zi=new Uint32Array(256);for(let e=0;e<256;e++){let t=e;for(let a=0;a<8;a++)t=t&1?3988292384^t>>>1:t>>>1;Zi[e]=t>>>0}function er(e,t,a){let i=4294967295;for(let s=t;s<t+a;s++)i=Zi[(i^e[s])&255]^i>>>8;return(i^4294967295)>>>0}function Qi(e,t=Kt){if(e[0]!==137||e[1]!==80||e[2]!==78||e[3]!==71)return null;const a=Math.round(t*39.37007874),i=new Uint8Array(21),s=new DataView(i.buffer);s.setUint32(0,9),i.set([112,72,89,115],4),s.setUint32(8,a),s.setUint32(12,a),i[16]=1,s.setUint32(17,er(i,4,13));const n=new Uint8Array(e.length+21);return n.set(e.subarray(0,33),0),n.set(i,33),n.set(e.subarray(33),54),n}function ar(e,t=Kt){const a=e.indexOf(",");if(a===-1)return e;const i=atob(e.slice(a+1)),s=new Uint8Array(i.length);for(let r=0;r<i.length;r++)s[r]=i.charCodeAt(r);const n=Qi(s,t);if(!n)return e;let o="";for(let r=0;r<n.length;r+=8192)o+=String.fromCharCode.apply(null,n.subarray(r,r+8192));return"data:image/png;base64,"+btoa(o)}const vt=Object.freeze({brightness:0,contrast:0,saturation:100,sharpen:0}),ta=e=>!e||e.brightness===0&&e.contrast===0&&e.saturation===100&&!e.sharpen,ir=e=>Math.min(2.5,Math.max(.7,e/1200));function Wa(e,t){if(ta(t))return e;const{brightness:a=0,contrast:i=0,saturation:s=100,sharpen:n=0}=t,o=e.width,r=e.height,l=e.getContext("2d",{willReadFrequently:!0});if(a!==0||i!==0||s!==100){const c=l.getImageData(0,0,o,r),d=c.data,g=1+a/100,p=1+i/100,h=s/100,u=.213+.787*h,m=.715-.715*h,f=.072-.072*h,y=.213-.213*h,v=.715+.285*h,w=.072-.072*h,b=.213-.213*h,x=.715-.715*h,E=.072+.928*h;for(let S=0;S<d.length;S+=4){if(d[S+3]===0)continue;let M=d[S]*g,A=d[S+1]*g,$=d[S+2]*g;if(p!==1&&(M=(M-127.5)*p+127.5,A=(A-127.5)*p+127.5,$=($-127.5)*p+127.5),h!==1){M=Math.max(0,Math.min(255,M)),A=Math.max(0,Math.min(255,A)),$=Math.max(0,Math.min(255,$));const z=u*M+m*A+f*$,B=y*M+v*A+w*$,J=b*M+x*A+E*$;M=z,A=B,$=J}d[S]=M<0?0:M>255?255:M,d[S+1]=A<0?0:A>255?255:A,d[S+2]=$<0?0:$>255?255:$}l.putImageData(c,0,0)}return n>0&&Wi(e,n/100*1.6,ir(o)),e}const Ji=(e,t)=>{const a=document.createElement("canvas");return a.width=Math.max(1,Math.round(e)),a.height=Math.max(1,Math.round(t)),a};function sr(e,t,a){const i=a*Math.PI/180,s=Math.abs(Math.cos(i)),n=Math.abs(Math.sin(i)),o=r=>Math.abs(r-Math.round(r))<1e-6?Math.round(r):Math.ceil(r);return{w:o(e*s+t*n),h:o(e*n+t*s)}}function nr(e,t){const a=(t%360+360)%360;if(a===0)return e;const{w:i,h:s}=sr(e.width,e.height,a),n=Ji(i,s),o=n.getContext("2d");return o.imageSmoothingEnabled=!0,o.imageSmoothingQuality="high",o.translate(n.width/2,n.height/2),o.rotate(a*Math.PI/180),o.drawImage(e,-e.width/2,-e.height/2),n}function Za(e,t){const a=Ji(e.width,e.height),i=a.getContext("2d");return t==="x"?(i.translate(a.width,0),i.scale(-1,1)):(i.translate(0,a.height),i.scale(1,-1)),i.drawImage(e,0,0),a}const or=900,Qa={brightness:e=>e>0?`+${e}`:`${e}`,contrast:e=>e>0?`+${e}`:`${e}`,saturation:e=>`${e}%`,sharpen:e=>`${e}`};function rr(e){var $,z,B,J,it,st,D,q,j,nt,et;const{q:t,engine:a,canvas:i,wrap:s,viewport:n}=e,o={...vt};let r=null,l=0,c=null,d=0;const g=document.createElement("canvas");g.className="adjust-preview-overlay",s.appendChild(g);const p=k=>t(`#adj-${k}`),h=(k,O)=>{const L=t(`#adj-${k}-val`);L&&(L.textContent=O)},u=(k,O)=>k.forEach(L=>{const P=t(L);P&&(P.disabled=!O)});function m(k){r&&r!==k&&M(),r=k,u(["#adj-apply-tonal","#adj-reset-tonal"],k==="tonal"),u(["#adj-apply-rot"],k==="rotate")}function f(){if(c&&c.revision===a.revision)return c;const k=Math.min(1,or/Math.max(i.width,i.height)),O=document.createElement("canvas");O.width=Math.max(1,Math.round(i.width*k)),O.height=Math.max(1,Math.round(i.height*k));const L=O.getContext("2d",{willReadFrequently:!0});return L.imageSmoothingQuality="high",L.drawImage(i,0,0,O.width,O.height),c={revision:a.revision,data:L.getImageData(0,0,O.width,O.height)},c}function y(){d=0;const{data:k}=f();(g.width!==k.width||g.height!==k.height)&&(g.width=k.width,g.height=k.height),g.getContext("2d",{willReadFrequently:!0}).putImageData(k,0,0),Wa(g,o),s.classList.add("is-adjust-preview")}function v(k,O){if(m("tonal"),o[k]=O,h(k,Qa[k](O)),ta(o)){w(),u(["#adj-apply-tonal","#adj-reset-tonal"],!0);return}d||(d=requestAnimationFrame(y))}function w(){d&&(cancelAnimationFrame(d),d=0),s.classList.remove("is-adjust-preview")}function b(){Object.assign(o,vt);for(const k of Object.keys(vt)){const O=p(k);O&&(O.value=vt[k],bt(O)),h(k,Qa[k](vt[k]))}w()}function x(k){l=k,i.style.transform=k?`rotate(${k}deg)`:"",h("rotation",`${k}°`);const O=p("rotation");O&&(O.value=k,bt(O))}function E(k){a.pushUndo(),a.lastAction=null,a.commit(k.getContext("2d").getImageData(0,0,k.width,k.height)),n.zoomFit(),e.updateStatus()}function S(k){k&&(E(nr(i,k)),e.updateStatus(`🔄 Girado ${k}°`))}function M(){const k=r;if(r=null,u(["#adj-apply-tonal","#adj-reset-tonal","#adj-apply-rot"],!1),k==="tonal")ta(o)||a.drawOnto((O,L)=>Wa(L,o)),b(),e.updateStatus("🎚️ Ajustes de tono aplicados");else if(k==="rotate"){const O=l;x(0),S(O)}return!!k}function A(){const k=r;return r=null,u(["#adj-apply-tonal","#adj-reset-tonal","#adj-apply-rot"],!1),b(),x(0),!!k}return Object.keys(vt).forEach(k=>{var O,L;(O=p(k))==null||O.addEventListener("input",P=>v(k,+P.target.value)),(L=t(`#adj-${k}-val`))==null||L.addEventListener("dblclick",()=>{const P=p(k);P&&(P.value=vt[k],bt(P),v(k,vt[k]))})}),($=t("#adj-apply-tonal"))==null||$.addEventListener("click",M),(z=t("#adj-reset-tonal"))==null||z.addEventListener("click",A),(B=p("rotation"))==null||B.addEventListener("input",k=>{m("rotate"),x(+k.target.value),u(["#adj-apply-rot"],!0)}),(J=t("#adj-rotation-val"))==null||J.addEventListener("dblclick",()=>{x(0)}),(it=t("#adj-apply-rot"))==null||it.addEventListener("click",M),(st=t("#adj-rot-ccw"))==null||st.addEventListener("click",()=>{M(),S(-90)}),(D=t("#adj-rot-cw"))==null||D.addEventListener("click",()=>{M(),S(90)}),(q=t("#adj-flip-x"))==null||q.addEventListener("click",()=>{M(),E(Za(i,"x")),e.updateStatus("↔ Volteo horizontal")}),(j=t("#adj-flip-y"))==null||j.addEventListener("click",()=>{M(),E(Za(i,"y")),e.updateStatus("↕ Volteo vertical")}),(nt=t("#adj-go-crop"))==null||nt.addEventListener("click",()=>{var k;M(),(k=e.openCropTool)==null||k.call(e)}),(et=t(".adj-filters"))==null||et.addEventListener("click",k=>{const O=k.target.closest("[data-style]");if(!O||O.classList.contains("is-busy"))return;M();const L=Vi.find(P=>P.id===O.dataset.style);O.classList.add("is-busy"),e.updateStatus("⏳ Procesando…"),requestAnimationFrame(()=>setTimeout(()=>{try{a.drawOnto((P,U)=>$o(U,L.id)),e.updateStatus(`🎨 Filtro «${L.label}» aplicado`)}finally{O.classList.remove("is-busy")}},0))}),{commitPending:M,cancelPending:A,hasPending:()=>!!r,reset:()=>{A()}}}const Ki=e=>({w:e.naturalWidth||e.width||1,h:e.naturalHeight||e.height||1});function xa(e="front"){const t=Rt.map(s=>_t(e,s)),a=Math.max(...t.map(s=>s.maxW)),i=Math.max(...t.map(s=>s.maxH));return{wCm:a,hCm:i,w:Math.round(a*ve),h:Math.round(i*ve)}}function ts(e,t,a){return Math.min(1,a.w/e,a.h/t)}function lr(e,t,a){const i=document.createElement("canvas");i.width=t,i.height=a;const s=i.getContext("2d");return s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",s.drawImage(e,0,0,t,a),i}function Xt(e,t="front"){const a=Ki(e),i=xa(t),s=ts(a.w,a.h,i);if(s>=1)return{source:e,clamped:!1,from:a,to:a,max:i};const n={w:Math.max(1,Math.round(a.w*s)),h:Math.max(1,Math.round(a.h*s))};let o=e,r=a;for(;r.w>n.w*2||r.h>n.h*2;)r={w:Math.max(n.w,Math.ceil(r.w/2)),h:Math.max(n.h,Math.ceil(r.h/2))},o=lr(o,r.w,r.h);return{source:Xi(o,n.w,n.h),clamped:!0,from:a,to:n,max:i}}const es=(e,t,a)=>new Promise((i,s)=>{e.toBlob(n=>n?i(n):s(new Error("No se pudo codificar la imagen.")),t,a)});function cr(e){if(e instanceof HTMLCanvasElement)return e;const{w:t,h:a}=Ki(e),i=document.createElement("canvas");return i.width=t,i.height=a,i.getContext("2d").drawImage(e,0,0),i}async function dr(e,t=Kt){const a=await es(e,"image/png"),i=Qi(new Uint8Array(await a.arrayBuffer()),t);return i?new Blob([i],{type:"image/png"}):a}async function as(e,t="front",{opaque:a=!1}={}){const i=Xt(e,t),s=cr(i.source);return{blob:a?await es(s,"image/jpeg",.95):await dr(s),canvas:s,width:s.width,height:s.height,clamped:i.clamped,from:i.from}}function ur(e){return new Promise((t,a)=>{const i=new Image;i.onload=()=>t(i),i.onerror=()=>a(new Error("No se pudo preparar la imagen.")),i.src=e.toDataURL("image/png")})}function is({from:e,to:t},a){const i=s=>s.toLocaleString("es-CO");return`Imagen de ${i(e.w)}×${i(e.h)} px (≈${a} DPI) optimizada a ${i(t.w)}×${i(t.h)} px = 300 DPI reales para impresión.`}function hr(e){const t=e.q("#editor-dpi-badge"),a=e.q("#editor-dpi-label"),i=e.q("#editor-dpi-note");function s(){var g,p;const o=C.getState(),r=o.activeZone,l=(g=o.customizations)==null?void 0:g[r],c=(l==null?void 0:l.scale)??((p=Ae[r])==null?void 0:p.defaultScale)??1,d=e.canvas.width/Math.max(1,e.canvas.height);return ut(c,r,o.selectedSize,d).w}function n(){if(!t||!e.canvas.width)return null;const o=ke(e.canvas.width,s()),r=Yi(o);t.className=`dpi-badge ${r.badgeClass}`,t.dataset.level=r.level,a.textContent=`${r.icon} ${r.label}`;const l=C.getState().activeZone,c=ts(e.canvas.width,e.canvas.height,xa(l))<1;return t.title=c?`Tu arte tiene ${o} DPI efectivos: más de 300 no se nota en la tela. Se reducirá a 300 DPI al aplicar para ahorrar espacio.`:r.summary,i&&(i.textContent=c?"Se optimizará a 300 DPI al aplicar":""),{dpi:o,level:r.level,over:c}}return{update:n}}const pr=1024,mr=320,Ja=6e5,Ka=480;function Ot(e){return new Promise((t,a)=>{const i=new Image;i.crossOrigin="anonymous",i.onload=()=>t(i),i.onerror=()=>a(new Error("No se pudo leer la imagen.")),i.src=e})}function gr(e){return new Promise((t,a)=>{const i=new FileReader;i.onload=()=>t(i.result),i.onerror=()=>a(new Error("No se pudo leer el archivo.")),i.readAsDataURL(e)})}function fr(e,t){const a=e.naturalWidth||e.width||1024,i=e.naturalHeight||e.height||1024,s=Math.min(1,t/Math.max(a,i)),n=document.createElement("canvas");n.width=Math.max(1,Math.round(a*s)),n.height=Math.max(1,Math.round(i*s));const o=n.getContext("2d");return o.imageSmoothingQuality="high",o.drawImage(e,0,0,n.width,n.height),n}function ti(e,t,a){let i=t;for(;;){const s=fr(e,i);let n=a?s.toDataURL("image/png"):s.toDataURL("image/jpeg",.82);if(a&&n.length>Ja){const o=s.toDataURL("image/webp",.9);o.startsWith("data:image/webp")&&o.length<n.length&&(n=o)}if(n.length<=Ja||i<=Ka)return{url:n,width:s.width,height:s.height};i=Math.max(Ka,Math.round(i*.75))}}function vr(e){const t=e.naturalWidth||1024,a=e.naturalHeight||1024,i=xa("front"),s=Math.min(i.w/t,i.h/a),n=document.createElement("canvas");return n.width=Math.max(1,Math.round(t*s)),n.height=Math.max(1,Math.round(a*s)),n.getContext("2d").drawImage(e,0,0,n.width,n.height),n}async function $e(e,{alpha:t=!0,master:a=!1,opaque:i=!1,svg:s=!1}={}){const n=await Ot(e),o=s?vr(n):n,r=ti(o,pr,t),l=ti(o,mr,t),c={image:r.url,thumb:l.url,width:r.width,height:r.height};return a&&(c.master=await as(o,"front",{opaque:i})),c}async function br(e){if(!e||!e.type.startsWith("image/"))throw new Error("Selecciona una imagen válida (PNG, JPG, WebP o SVG).");if(e.size>12*1024*1024)throw new Error("La imagen supera 12 MB. Reduce su tamaño e inténtalo de nuevo.");const t=e.type==="image/jpeg";return $e(await gr(e),{alpha:!t,master:!0,opaque:t,svg:e.type==="image/svg+xml"})}function St(e,t="mi-camiseta-3d.png"){const a=document.createElement("a");a.href=e,a.download=t,document.body.appendChild(a),a.click(),document.body.removeChild(a)}const yr="https://wsp-x3j7.onrender.com/webhook/2fa",wr="KEY_SECRETA_JEICO_999",Lt=new Map;class Wt{static generateOtp(){return Math.floor(1e5+Math.random()*9e5).toString()}static async sendVerificationCode({telegramId:t,userName:a,userId:i,isActivation:s=!1}){if(!t||String(t).trim().length<5)throw new Error("Telegram ID inválido o no configurado.");const n=this.generateOtp(),o=Date.now()+5*60*1e3;Lt.set(i,{code:n,expiresAt:o,attempts:0,telegramId:String(t).trim()});const r={bot_token:wr,usuario:a||"Cliente 3D Studio",telegram_id:String(t).trim(),canal:"telegram",codigo:n,panel:"cliente",es_activacion_codigo:s};try{const l=new AbortController,c=setTimeout(()=>l.abort(),14e3),d=await fetch(yr,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),signal:l.signal});clearTimeout(c);const g=await d.json().catch(()=>({}));if(!d.ok||g.error)throw new Error(g.error||`Error ${d.status} al conectar con el bot de Telegram`);return{success:!0,expiresInSeconds:300,telegramId:String(t).trim()}}catch(l){throw console.error("[2FA Telegram Error]",l),l.name==="AbortError"?new Error("Tiempo de espera agotado al conectar con el bot."):l}}static verifyCode(t,a){const i=Lt.get(t);return i?Date.now()>i.expiresAt?(Lt.delete(t),{valid:!1,error:"El código ha expirado (límite 5 min). Solicita uno nuevo."}):(i.attempts++,i.attempts>4?(Lt.delete(t),{valid:!1,error:"Demasiados intentos fallidos. Solicita un nuevo código."}):String(a||"").trim()===i.code?(Lt.delete(t),{valid:!0}):{valid:!1,error:`Código incorrecto. Te quedan ${5-i.attempts} intentos.`}):{valid:!1,error:"No hay un código pendiente o ya ha expirado."}}static clearChallenge(t){Lt.delete(t)}}const ea=3,Te=20,xr=/^[a-z0-9](?:[a-z0-9_.]*[a-z0-9])?$/,ss=["admin","administrador","soporte","staff","moderador","oficial","official","comunidad","shirtstudio","shirt_studio","3dshirtstudio","atelier","equipo"];function be(e){return String(e??"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/^@+/,"").replace(/\s+/g,"_").replace(/[^a-z0-9_.]/g,"").replace(/[_.]{2,}/g,"_").replace(/^[_.]+|[_.]+$/g,"").slice(0,Te).replace(/[_.]+$/g,"")}const Mt=e=>e?`@${e}`:"";function ns(e,t=new Set){return e.length<ea?`El alias necesita al menos ${ea} caracteres (letras, números, _ o .).`:xr.test(e)?ss.includes(e)?"Ese alias está reservado. Elige otro.":t.has(e)?"Ese alias ya está en uso. Prueba con otro.":"":'Usa solo letras, números, "_" o "." y empieza y termina con letra o número.'}function aa(e,t=new Set){let a=be(String(e||"").split("@")[0]);a.length<ea&&(a=be(`${a}user`)||"user"),a=a.slice(0,Te-4);let i=a;for(let s=2;t.has(i)||ss.includes(i);s++)i=`${a}${s}`;return i}function Er(e){const t=new Set(e.map(s=>s.alias).filter(Boolean));let a=!1;return{users:e.map(s=>{if(s.alias)return s;const n=aa(s.email||s.name,t);return t.add(n),a=!0,{...s,alias:n}}),changed:a}}const ye=(e,t=null)=>new Set(e.filter(a=>a.id!==t&&a.alias).map(a=>a.alias)),Sr=["name","alias","phone","city","address","deliveryNotes"],Mr={name:80,alias:Te,phone:20,city:60,address:140,deliveryNotes:200};function Cr(e={}){const t={};for(const a of Sr)t[a]=a==="alias"?be(e[a]):String(e[a]??"").replace(/\s+/g," ").trim().slice(0,Mr[a]);return t}function Ar(e){const t={};if(e.name.length<3&&(t.name="Escribe tu nombre completo (mínimo 3 caracteres)."),e.phone){const a=e.phone.replace(/\D/g,"");(a.length<7||a.length>15||!/^\+?[\d\s()-]+$/.test(e.phone))&&(t.phone="Ingresa un celular válido, por ejemplo +57 300 123 4567.")}return e.city&&e.city.length<2&&(t.city="Escribe la ciudad o municipio."),t}const Zt="1.1.0",Lr="2026-10-08",kr="Términos de Servicio & Declaración de Propiedad Intelectual",$r="3D Shirt Studio es un servicio de personalización y manufactura textil bajo demanda (impresión DTF). Al cargar archivos en el Estudio 3D o confirmar un pedido, aceptas las siguientes condiciones.",Tr="Imprime únicamente diseños propios o con licencia. Eres el responsable de los archivos que cargas.",Ir="Acepto los Términos de Servicio y declaro la titularidad de los derechos de autor de mis imágenes.",Dr=[{id:"titularidad",title:"Declaración y Garantía de Titularidad del Usuario",tone:"warning",text:"El Usuario declara, garantiza y certifica bajo gravedad de juramento que es el único autor y titular patrimonial de las obras, imágenes, gráficos, marcas, logotipos y textos que carga en el Estudio 3D, o que cuenta con las licencias, autorizaciones expresas y derechos comerciales suficientes de los titulares legítimos para su fijación y reproducción en prendas textiles."},{id:"exclusion",title:"Exclusión Total de Responsabilidad de la Plataforma (Prestador Técnico)",tone:"warning",text:"3D Shirt Studio opera exclusivamente como un facilitador tecnológico y taller de manufactura bajo demanda automatizada. La plataforma NO realiza curaduría editorial, validación previa de autoría ni verificación de derechos sobre los archivos provistos. En consecuencia, la plataforma, sus administradores, socios y operarios quedan plenamente exentos de cualquier responsabilidad civil, comercial, administrativa o penal derivada de infracciones a leyes de propiedad intelectual, derechos de autor o marcas registradas cometidas por el Usuario."},{id:"indemnidad",title:"Cláusula de Indemnidad (Hold Harmless)",tone:"warning",text:"El Usuario se obliga expresamente a defender, indemnizar y mantener indemne a 3D Shirt Studio, a sus administradores, socios y operarios frente a cualquier reclamo, querella, demanda, requerimiento extrajudicial, sanción gubernamental o litigio promovido por terceros derivado directa o indirectamente de la impresión, comercialización o exhibición de los archivos cargados, asumiendo la totalidad de los costos legales, honorarios de abogados y eventuales indemnizaciones impuestas."},{id:"ilicitos",title:"Contenidos Ilícitos y Derecho de Rechazo Unilateral",tone:"danger",text:"Queda estrictamente prohibida la carga de material que incite al odio, violencia, discriminación, pornografía infantil, difamación, símbolos prohibidos por ley o marcas notorias utilizadas sin autorización. La plataforma se reserva el derecho unilateral e inapelable de anular cualquier orden y destruir impresiones que presuntamente vulneren estos principios, sin lugar a reembolso."},{id:"habeas-data",title:"Tratamiento de Datos Personales (Habeas Data)",tone:"info",text:"Los datos personales recopilados se usarán exclusivamente para la liquidación de órdenes, comunicación logística vía WhatsApp y despacho de prendas."}];function Pr(e,t,{termsAccepted:a,...i}={}){const s=e.findIndex(d=>d.id===t);if(s===-1)throw new Error("Usuario no encontrado.");const n=Cr(i),o=Ar(n);if(!n.alias)delete n.alias;else if(!o.alias){const d=ns(n.alias,ye(e,t));d&&(o.alias=d)}if(Object.keys(o).length)throw Object.assign(new Error(Object.values(o)[0]),{fields:o});const r=new Date().toISOString(),l={...e[s],...n,updatedAt:r};a&&l.termsVersion!==Zt&&(l.termsVersion=Zt,l.termsAcceptedAt=r);const c=e.slice();return c[s]=l,{users:c,user:l,aliasChanged:l.alias!==e[s].alias}}const Or="shirt_studio_vault_masters",ia="masters";let Fe=null;function Rr(){return Fe||(Fe=new Promise(e=>{if(typeof indexedDB>"u")return e(null);try{const t=indexedDB.open(Or,1);t.onupgradeneeded=()=>t.result.createObjectStore(ia,{keyPath:"id"}),t.onsuccess=()=>e(t.result),t.onerror=t.onblocked=()=>e(null)}catch{e(null)}})),Fe}async function Ea(e,t){const a=await Rr();return a?new Promise(i=>{try{const s=a.transaction(ia,e),n=t(s.objectStore(ia));s.oncomplete=()=>i({ok:!0,value:n.result??null}),s.onerror=s.onabort=()=>i({ok:!1,value:null})}catch{i({ok:!1,value:null})}}):{ok:!1,value:null}}async function _r(e,t,a={}){return(await Ea("readwrite",i=>i.put({id:e,blob:t,...a,savedAt:Date.now()}))).ok}async function os(e){var t;return((t=(await Ea("readonly",a=>a.get(e))).value)==null?void 0:t.blob)??null}async function Sa(e){return(await Ea("readwrite",t=>t.delete(e))).ok}const rs="shirt_user_vault_db",ei=5,qe=new Set,zr=()=>{try{window.dispatchEvent(new CustomEvent("vault:changed"))}catch{}};function xt(){try{const e=JSON.parse(localStorage.getItem(rs)||"[]");return Array.isArray(e)?e:[]}catch{return[]}}function Ie(e){try{return localStorage.setItem(rs,JSON.stringify(e)),zr(),!0}catch{return!1}}const Ma=()=>`VLT-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2,5).toUpperCase()}`,ls=(e,t)=>String(t.createdAt).localeCompare(String(e.createdAt));function sa(e){return xt().filter(t=>t.userId===e).sort(ls)}function De(e){const t=sa(e),a=t.filter(i=>i.type==="free").length;return{free:a,max:ei,left:ei-a,purchased:t.length-a}}function Ca(e){if(!(e!=null&&e.userId)||!e.image)return{ok:!1,error:"invalid"};const t=e.type==="purchased"?"purchased":"free";if(t==="free"&&De(e.userId).left<=0)return{ok:!1,error:"no_slots"};const a={id:Ma(),name:String(e.name||"Diseño sin título").slice(0,60),thumb:e.thumb||e.image,isPublic:!1,createdAt:new Date().toISOString(),...e,type:t};return Ie([a,...xt()])?{ok:!0,item:a}:{ok:!1,error:"storage_full"}}function cs(e,t){const a=xt(),i=a.findIndex(s=>s.id===e);return i===-1?{ok:!1}:(a[i]={...a[i],...t,id:e,userId:a[i].userId,type:a[i].type},Ie(a)?{ok:!0,item:a[i]}:{ok:!1,error:"storage_full"})}function Fr(e,t=""){const a=xt().find(s=>s.id===e);if(!a)return{ok:!1};const i=!a.isPublic;return cs(e,i&&t?{isPublic:i,authorAlias:t}:{isPublic:i})}function qr(e,t){const a=xt();return a.some(i=>i.userId===e&&i.authorAlias!==t)?Ie(a.map(i=>i.userId===e?{...i,authorAlias:t}:i)):!1}function Br(e){const t=xt(),a=t.find(i=>i.id===e);return a?a.type!=="free"?{ok:!1,error:"purchased_protected"}:Ie(t.filter(i=>i.id!==e))?(Sa(e),{ok:!0}):{ok:!1,error:"storage_full"}:{ok:!1,error:"not_found"}}function ds(){return xt().filter(e=>e.isPublic).sort(ls)}async function us(e){var i;const t=e==null?void 0:e.userId;if(!t||!e.screenshot||qe.has(e.id))return{ok:!1,skipped:!0};const a=xt().find(s=>s.type==="purchased"&&s.orderId===e.id&&s.userId===t);if(a)return{ok:!0,item:a,existed:!0};qe.add(e.id);try{const{image:s,thumb:n}=await $e(e.screenshot,{alpha:!1});return Ca({userId:t,type:"purchased",orderId:e.id,name:`Prenda Impresa #${e.id}`,ownerName:String(((i=e.customer)==null?void 0:i.name)||"").split(" ")[0],image:s,thumb:n})}catch{return{ok:!1,error:"invalid"}}finally{qe.delete(e.id)}}function Nr(e){try{const a=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),i=decodeURIComponent(atob(a).split("").map(s=>"%"+("00"+s.charCodeAt(0).toString(16)).slice(-2)).join(""));return JSON.parse(i)}catch{return null}}const ai="shirt_studio_users_v1",se="shirt_studio_session_v1";class Ur{constructor(){this.listeners=new Set,this.currentUser=this.loadSession(),this.migrateAliases()}migrateAliases(){const{users:t,changed:a}=Er(this.getUsers());a&&this.saveUsers(t);const i=this.currentUser&&t.find(s=>s.id===this.currentUser.id);if(i&&this.currentUser.alias!==i.alias){this.currentUser=this.sanitizeUser(i);try{localStorage.setItem(se,JSON.stringify(this.currentUser))}catch{}}}getUsers(){try{const t=localStorage.getItem(ai);return t?JSON.parse(t):[]}catch{return[]}}saveUsers(t){try{localStorage.setItem(ai,JSON.stringify(t))}catch{}}loadSession(){try{const t=localStorage.getItem(se);return t?JSON.parse(t):null}catch{return null}}setSession(t){this.currentUser=t,t?localStorage.setItem(se,JSON.stringify(t)):localStorage.removeItem(se),this.notify()}getCurrentUser(){return this.currentUser}isAuthenticated(){return!!this.currentUser}async register({name:t,email:a,password:i,telegramId:s=""}){const n=String(a||"").trim().toLowerCase(),o=String(t||"").trim(),r=String(i||"").trim(),l=String(s||"").trim();if(!n||!r)throw new Error("Email y contraseña requeridos.");if(r.length<6)throw new Error("La contraseña debe tener al menos 6 caracteres.");const c=this.getUsers();if(c.find(p=>p.email===n))throw new Error("Ya existe una cuenta con este correo.");const d={id:"usr_"+Date.now()+"_"+Math.random().toString(36).substring(2,6),name:o||n.split("@")[0],alias:aa(n,ye(c)),email:n,password:r,telegramId:l,twoFactorEnabled:!!l,provider:"local",createdAt:new Date().toISOString()};c.push(d),this.saveUsers(c);const g=this.sanitizeUser(d);return this.setSession(g),g}async login({email:t,password:a}){const i=String(t||"").trim().toLowerCase(),s=String(a||"").trim(),o=this.getUsers().find(r=>r.email===i&&r.password===s);if(!o)throw new Error("Credenciales incorrectas. Verifica tu email y contraseña.");return this.finishLogin(o)}async finishLogin(t){if(t.twoFactorEnabled&&t.telegramId)return await Wt.sendVerificationCode({telegramId:t.telegramId,userName:t.name,userId:t.id}),{requires2fa:!0,userId:t.id,telegramId:t.telegramId,user:this.sanitizeUser(t)};const a=this.sanitizeUser(t);return this.setSession(a),{requires2fa:!1,user:a}}complete2faLogin(t,a){const i=Wt.verifyCode(t,a);if(!i.valid)throw new Error(i.error);const n=this.getUsers().find(r=>r.id===t);if(!n)throw new Error("Usuario no encontrado.");const o=this.sanitizeUser(n);return this.setSession(o),o}async loginWithGoogle(t){let a=null;if(typeof t=="string"?a=Nr(t):a=t,!a||!a.email)throw new Error("No se pudo obtener el perfil de Google.");const i=this.getUsers();let s=i.find(n=>n.email===a.email.toLowerCase());return s||(s={id:"usr_g_"+Date.now(),name:a.name||a.email.split("@")[0],alias:aa(a.email,ye(i)),email:a.email.toLowerCase(),picture:a.picture||null,provider:"google",telegramId:"",twoFactorEnabled:!1,createdAt:new Date().toISOString()},i.push(s),this.saveUsers(i)),this.finishLogin(s)}async update2faSettings({enabled:t,telegramId:a}){if(!this.currentUser)throw new Error("Debes iniciar sesión.");const i=this.getUsers(),s=i.findIndex(o=>o.id===this.currentUser.id);if(s===-1)throw new Error("Usuario no encontrado.");i[s].twoFactorEnabled=!!t,a!==void 0&&(i[s].telegramId=String(a).trim()),this.saveUsers(i);const n=this.sanitizeUser(i[s]);return this.setSession(n),n}updateUserProfile(t={}){if(!this.currentUser)throw new Error("Debes iniciar sesión.");const{users:a,user:i,aliasChanged:s}=Pr(this.getUsers(),this.currentUser.id,t);this.saveUsers(a),s&&qr(i.id,i.alias);const n=this.sanitizeUser(i);return this.setSession(n),n}logout(){this.setSession(null)}sanitizeUser(t){if(!t)return null;const{password:a,...i}=t;return i}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>{try{t(this.currentUser)}catch(a){console.error(a)}})}}const _=new Ur,ii=e=>String(e||"diseno").replace(/[^\w-]+/g,"_").replace(/^_+|_+$/g,"")||"diseno";async function Aa(e,t){return t!=null&&t.blob?await _r(e,t.blob,{width:t.width,height:t.height})?{hasMaster:!0,masterW:t.width,masterH:t.height,masterBytes:t.blob.size,masterType:t.blob.type}:{hasMaster:!1}:{hasMaster:!1}}async function si(e){if(e.hasMaster){const t=await os(e.id);if(t){const a=URL.createObjectURL(t);try{return await Ot(a)}finally{setTimeout(()=>URL.revokeObjectURL(a),3e4)}}}return Ot(e.image)}async function Hr(e){const t=e.hasMaster?await os(e.id):null;if(t){const i=URL.createObjectURL(t),s=t.type==="image/jpeg"?"jpg":"png";return St(i,`${ii(e.name)}_300DPI.${s}`),setTimeout(()=>URL.revokeObjectURL(i),3e4),{kind:"master",bytes:t.size}}const a=(e.image.match(/^data:image\/(\w+)/)||[])[1]||"png";return St(e.image,`${ii(e.name)}.${a}`),{kind:"preview"}}const ne={no_session:"Inicia sesión para guardar copias en tu Bóveda.",no_slots:"Bóveda llena: elimina un diseño gratuito para liberar un cupo.",storage_full:"El navegador no tiene espacio. Elimina diseños o pedidos antiguos e inténtalo de nuevo.",invalid:"No se pudo guardar el diseño."},jr=60,ni=" (copia)";function Vr(e){return(String(e||"Diseño").replace(/\s*\(copia\)$/i,"").trim()||"Diseño").slice(0,jr-ni.length)+ni}function oi(){const e=_.getCurrentUser();return e?De(e.id).left:null}async function ri(e,t){const a=await $e(t,{master:!0}),i=await Aa(e,a.master),s=cs(e,{image:a.image,thumb:a.thumb,...i});return s.ok?{ok:!0,item:s.item}:{ok:!1,error:s.error||"invalid"}}async function Gr(e,t){const a=_.getCurrentUser();if(!a)return{ok:!1,error:"no_session"};if(De(a.id).left<=0)return{ok:!1,error:"no_slots"};const i=await $e(e,{master:!0}),s=Ma(),n=await Aa(s,i.master),o=Ca({id:s,userId:a.id,type:"free",name:Vr(t),authorAlias:a.alias,ownerName:String(a.name||"").split(" ")[0],image:i.image,thumb:i.thumb,...n});return o.ok||Sa(s),o}const Yr=e=>String(e||"diseno").replace(/[^\w-]+/g,"_").replace(/^_+|_+$/g,"")||"diseno";function Xr(e,{adjust:t,getName:a,getContext:i}){const s=e.q("#btn-replace-editor"),n=e.q("#btn-copy-editor"),o=e.q("#btn-download-editor"),r=e.q(".editor-save-grid"),l=new Set;function c(){t.commitPending(),e.textLayer.commit();const p=Xt(e.canvas,C.getState().activeZone);return p.clamped?p.source:e.canvas}async function d(p,h){if(!l.has(p)){l.add(p),p.classList.add("is-busy"),p.setAttribute("aria-busy","true");try{await h()}catch(u){console.error("[EditorSave]",u),R("No se pudo completar la acción. Inténtalo de nuevo.","error")}finally{l.delete(p),p.classList.remove("is-busy"),p.removeAttribute("aria-busy")}}}s==null||s.addEventListener("click",()=>d(s,async()=>{const p=i();if(!p.onReplace)return;const h=c().toDataURL("image/png"),u=await p.onReplace(h,await Ot(h),a());R((u==null?void 0:u.ok)===!1?ne[u.error]||ne.invalid:(u==null?void 0:u.message)||"Imagen reemplazada.",(u==null?void 0:u.ok)===!1?"error":"success",4200)})),n==null||n.addEventListener("click",()=>d(n,async()=>{const p=await Gr(c().toDataURL("image/png"),a());if(!p.ok)return R(ne[p.error]||ne.invalid,"error",4500);g();const h=oi();R(`Copia guardada en tu Bóveda${h===null?"":` (${h} ${h===1?"cupo libre":"cupos libres"})`}.`,"success",4200)})),o==null||o.addEventListener("click",()=>d(o,async()=>{const p=await as(c(),C.getState().activeZone),h=URL.createObjectURL(p.blob);St(h,`${Yr(a())}_300DPI.png`),setTimeout(()=>URL.revokeObjectURL(h),3e4),R(`PNG transparente a 300 DPI descargado (${p.width}×${p.height} px).`,"success",4200)}));function g(){const p=!!i().onReplace;s&&(s.hidden=!p),r&&(r.dataset.solo=String(!p));const h=oi();if(!n)return;const u=h!==null&&h<=0;n.disabled=u,n.title=u?"Bóveda llena (5/5): elimina un diseño gratuito para liberar un cupo":h===null?"Inicia sesión para guardar una copia en tu Bóveda":`Guarda una copia nueva en tu Bóveda sin tocar el original (${h} ${h===1?"cupo libre":"cupos libres"})`}return{refresh:g}}let oe=null;function La(){if(oe)return oe;const e=document.createElement("div");return e.className="image-editor-modal-backdrop",e.id="image-editor-backdrop",e.innerHTML=Io(),document.body.appendChild(e),oe=Wr(e),oe}function Wr(e){var $,z,B,J,it,st;const t=D=>e.querySelector(D),a=t("#editor-canvas"),i=t("#editor-canvas-wrap"),s=t("#editor-viewport"),n=t("#editor-meta-badge"),o=t("#btn-undo-step"),r=t("#undo-counter"),l=t("#btn-bg-shirt"),c=t("#btn-bg-checkers"),d={backdrop:e,q:t,canvas:a,wrap:i,viewportEl:s,tab:"bg"};d.getTab=()=>d.tab,d.isOpen=()=>e.classList.contains("open"),d.engine=new fo(a,{maxUndo:15}),d.viewport=new bo(s,i,a,t("#brush-cursor-ring"),t("#zoom-level-badge"),{getActiveTool:()=>d.tab==="text"?"text":d.engine.activeTool});const{engine:g,viewport:p}=d;d.updateStatus=(D=null)=>{var j;const q=g.getUndoCount();o&&(o.disabled=q===0),r&&(r.textContent=q),n.textContent=D||`${a.width} × ${a.height} px • ${q} retoques`,(j=d.dpiBadge)==null||j.update()};const{updateStatus:h}=d;d.hover=new Oo(g,p,i,()=>d.tab==="bg"),d.textLayer=new _o(d);const u=Fo(d);d.touch=Vo(d,u);const m=Jo(e);d.openCropTool=()=>{y("bg"),u.setActiveTool("crop")};const f=rr(d);d.dpiBadge=hr(d);function y(D){d.tab==="adjust"&&D!=="adjust"&&f.commitPending(),d.tab=D,e.querySelectorAll(".editor-tab").forEach(q=>q.classList.toggle("active",q.dataset.tab===D)),e.querySelectorAll(".editor-tab-panel").forEach(q=>q.classList.toggle("active",q.id===`panel-${D}`)),s.setAttribute("data-tab",D),d.textLayer.setActive(D==="text"),p.hideRing(),d.hover.clear(),wt(e)}e.querySelectorAll(".editor-tab").forEach(D=>D.addEventListener("click",()=>y(D.dataset.tab)));const v=Xo({backdrop:e,switchTab:y});($=t("#btn-editor-tour"))==null||$.addEventListener("click",()=>v.start()),(z=t("#btn-zoom-in"))==null||z.addEventListener("click",()=>p.zoomIn()),(B=t("#btn-zoom-out"))==null||B.addEventListener("click",()=>p.zoomOut()),(J=t("#btn-zoom-fit"))==null||J.addEventListener("click",()=>p.zoomFit());function w(D){var et;const q=D==="shirt",j=C.getState(),nt=j.selectedSilhouette==="mug";l==null||l.classList.toggle("active",q),c==null||c.classList.toggle("active",!q),l&&(l.innerHTML=nt?"☕ Vaso":"👕 Prenda"),s.setAttribute("data-stage-bg",D),s.style.backgroundColor=q?nt?"#f8fafc":((et=j.selectedColor)==null?void 0:et.hex)||"#1a1a24":""}l==null||l.addEventListener("click",()=>w("shirt")),c==null||c.addEventListener("click",()=>w("checkers"));const b=()=>{if(f.cancelPending()){h();return}g.undo()&&(d.textLayer.draw(),p.zoomFit(),h())};o==null||o.addEventListener("click",b),(it=t("#btn-reset-editor"))==null||it.addEventListener("click",()=>{f.cancelPending(),g.reset(),d.textLayer.reset(),p.zoomFit(),h()}),window.addEventListener("keydown",D=>{!d.isOpen()||!(D.ctrlKey||D.metaKey)||D.key.toLowerCase()!=="z"||/INPUT|TEXTAREA/.test(D.target.tagName)||(D.preventDefault(),b())});let x="diseno",E=null,S={};const M=Xr(d,{adjust:f,getName:()=>x,getContext:()=>S});function A(){var D,q;v.stop(),u.stopBrush(),d.touch.reset(),f.cancelPending(),d.textLayer.discard(),d.hover.clear(),p.resetPan(),p.hideRing(),e.classList.remove("open"),(q=(D=window.engine)==null?void 0:D.resumeRender)==null||q.call(D)}return[t("#btn-close-editor"),t("#btn-cancel-editor")].forEach(D=>D==null?void 0:D.addEventListener("click",A)),(st=t("#btn-apply-editor"))==null||st.addEventListener("click",()=>{f.commitPending(),d.textLayer.commit();const D=Xt(a,C.getState().activeZone);D.clamped&&R(is(D,ke(D.from.w,D.max.wCm)),"info",6e3);const q=(D.clamped?D.source:a).toDataURL("image/png"),j=new Image;j.onload=()=>{E&&E(q,j,x),A()},j.src=q}),{open(D,q,j,nt={}){var O,L;x=q,E=j,S=nt||{};const et=C.getState().selectedSilhouette==="mug",k=t("#btn-apply-editor");k&&(k.textContent=et?"Aplicar al Vaso →":"Aplicar a Camiseta →"),M.refresh(),f.reset(),g.setRawImage(Xt(D,C.getState().activeZone).source),d.textLayer.reset(),w("shirt"),y("bg"),u.resetControls(),u.setActiveTool("wand");try{m.analyzeImage(g.getImageData())}catch(P){console.warn("No se pudo analizar croma:",P)}h(),wt(e),e.classList.add("open"),(L=(O=window.engine)==null?void 0:O.pauseRender)==null||L.call(O),setTimeout(()=>p.zoomFit(!0),60),setTimeout(()=>p.zoomFit(),280),v.shouldAutoStart()&&setTimeout(()=>{d.isOpen()&&v.start()},700)}}}function I(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const hs="shirt_reported_content",Zr=200,na=500,oa=10,ps=[{id:"illicit",icon:"🚫",label:"Material ilícito / Pornografía / CSAM",hint:"Tolerancia cero. Se oculta de inmediato.",zero:!0},{id:"copyright",icon:"⚖️",label:"Infracción de Derechos de Autor o Marcas Registradas",hint:"Arte o marca usados sin autorización."},{id:"hate",icon:"🛑",label:"Discurso de Odio, Racismo o Discriminación",hint:"Ataca a personas por su origen, género, religión u otra condición."},{id:"violence",icon:"⚠️",label:"Violencia o Contenido Explícito",hint:"Violencia gráfica o imágenes explícitas."},{id:"other",icon:"📝",label:"Otro motivo",hint:"Cuéntanos qué ocurre."}],ka=e=>ps.find(t=>t.id===e)||null,$a=new Set,ms=()=>{try{window.dispatchEvent(new CustomEvent("reports:changed"))}catch{}};let re={raw:null,list:[]};function gs(){try{const e=localStorage.getItem(hs)||"[]";if(e===re.raw)return re.list;const t=JSON.parse(e);return re={raw:e,list:Array.isArray(t)?t:[]},re.list}catch{return[]}}function Qr(e){try{return localStorage.setItem(hs,JSON.stringify(e.slice(0,Zr))),ms(),!0}catch{return!1}}const Jr=e=>String(e||"").replace(/^vault-/,"");function fs({category:e,details:t=""}={}){return ka(e)?e==="other"&&String(t).trim().length<oa?`Describe el motivo (mínimo ${oa} caracteres).`:"":"Elige un motivo para el reporte."}function Kr({designId:e,title:t="",authorAlias:a="",category:i,details:s="",reporterId:n=""}){const o=e?fs({category:i,details:s}):"Diseño no válido.";if(o)return{ok:!1,error:o};const r={id:`RPT-${Date.now().toString(36).toUpperCase()}`,designId:String(e),title:String(t).slice(0,80),authorAlias:String(a).replace(/^@+/,"").slice(0,24),category:i,details:String(s).trim().slice(0,na),reporterId:String(n||""),createdAt:new Date().toISOString()};return $a.delete(r.designId),Qr([r,...gs().filter(l=>l.designId!==r.designId)])?{ok:!0,report:r}:{ok:!1,error:"El navegador no tiene espacio para guardar el reporte."}}const Ta=e=>gs().find(t=>t.designId===e)||null,vs=e=>!!Ta(e)&&!$a.has(e);function bs(e){var a;const t=Ta(e);return!!t&&!((a=ka(t.category))!=null&&a.zero)}function tl(e){return bs(e)?($a.add(e),ms(),!0):!1}function el(e){const t=ka(e.category),a=Mt(e.authorAlias)||"@comunidad",i=[`🚩 REPORTE URGENTE: Diseño #${Jr(e.designId)} por ${a} - Motivo: ${t?t.label:e.category}`];return e.details&&i.push(`Detalle: ${e.details}`),`https://wa.me/${G.supportPhone.replace(/[^0-9]/g,"")}?text=${encodeURIComponent(i.join(`
`))}`}function al(e){const t=e.authorAlias?`por ${I(Mt(e.authorAlias))}`:e.ownerName?`por ${I(e.ownerName)}`:"Comunidad";return`
    <div class="author-design-card community-card" data-vault-id="${I(e.id)}">
      <div class="author-card-preview"><img class="community-img" src="${I(e.thumb||e.image)}" alt="${I(e.name)}" loading="lazy" decoding="async" /></div>
      <div class="author-card-footer">
        <div class="author-card-meta">
          <span class="author-card-name" title="${I(e.name)}">${I(e.name)}</span>
          <span class="author-card-cat">${t}</span>
        </div>
        <button type="button" class="btn-apply-author-preset"><span>Usar Arte</span></button>
      </div>
    </div>`}function il(e,t){const a=ds().filter(i=>!vs(`vault-${i.id}`));e.innerHTML=a.length?a.map(al).join(""):'<p class="community-empty">Aún no hay diseños públicos en este dispositivo. Publica uno desde <strong>Mi Bóveda de Diseños</strong> con el interruptor Público.</p>',e.onclick=async i=>{var l,c;const s=(l=i.target.closest(".community-card"))==null?void 0:l.dataset.vaultId,n=a.find(d=>d.id===s);if(!n)return;const o=await Ot(n.image),r=C.getState().activeZone;lt(r,{name:n.name,src:n.image,imageElement:o}),R(`¡"${n.name}" aplicado en ${((c=ht[r])==null?void 0:c.name)||r}!`,"success"),t()}}let W=null;const sl=["Todos","Streetwear","Cyberpunk","Retro","Minimal","Comunidad"];function ys(){if(W)return{open:()=>li()};W=document.createElement("div"),W.className="author-designs-modal-backdrop",W.id="author-designs-modal-backdrop",W.innerHTML=`
    <div class="author-designs-dialog">
      <div class="author-designs-header">
        <div class="author-header-texts">
          <div class="author-badge-row">
            <span class="author-modal-badge">COLECCIÓN ATELIER 240 GSM</span>
            <span class="author-modal-count">6 Estampados Exclusivos</span>
          </div>
          <h3 class="author-modal-title">Galería de Diseños de Autor</h3>
          <p class="author-modal-desc">Gráficos de autor en alta definición listos para estampar en tu prenda.</p>
        </div>
        <button type="button" class="author-modal-close" id="btn-close-author-modal" title="Cerrar ventana">✕</button>
      </div>

      <!-- Filtros Rápidos de Estilo -->
      <div class="author-filters-bar">
        ${sl.map((i,s)=>`
          <button type="button" class="author-filter-btn ${s===0?"active":""}" data-cat="${i}">
            ${i}
          </button>
        `).join("")}
      </div>

      <!-- Diseños públicos de la Bóveda de los usuarios -->
      <div class="author-designs-grid author-community" id="author-community-grid" hidden></div>

      <!-- Cuadrícula 3x2 Compacta de Alta Gama -->
      <div class="author-designs-grid" id="author-presets-grid">
        ${ft.map(i=>`
          <div class="author-design-card" data-preset-id="${i.id}" data-category="${i.category||"Streetwear"}">
            <div class="author-card-preview">
              <div class="author-svg-box">${i.svg}</div>
              <span class="author-active-badge">EN PRENDA</span>
            </div>
            <div class="author-card-footer">
              <div class="author-card-meta">
                <span class="author-card-name" title="${i.name}">${i.name}</span>
                <span class="author-card-cat">${i.category||"Streetwear"}</span>
              </div>
              <button type="button" class="btn-apply-author-preset" title="Aplicar a la camiseta">
                <span>Usar Arte</span>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `,document.body.appendChild(W);const e=W.querySelector("#btn-close-author-modal");e&&e.addEventListener("click",le),W.addEventListener("click",i=>{i.target===W&&le()});const t=W.querySelectorAll(".author-filter-btn"),a=W.querySelectorAll(".author-design-card");return t.forEach(i=>{i.addEventListener("click",()=>{t.forEach(r=>r.classList.remove("active")),i.classList.add("active");const s=i.getAttribute("data-cat"),n=s==="Comunidad";W.querySelector("#author-presets-grid").hidden=n;const o=W.querySelector("#author-community-grid");o.hidden=!n,n&&il(o,le),a.forEach(r=>{const l=r.getAttribute("data-category"),c=s==="Todos"||l.toLowerCase()===s.toLowerCase();r.style.display=c?"flex":"none"})})}),a.forEach(i=>{const s=i.querySelector(".btn-apply-author-preset"),n=()=>{const o=i.getAttribute("data-preset-id"),r=ft.find(d=>d.id===o);if(!r)return;const l=Me(r.svg),c=new Image;c.onload=()=>{const d=C.getState().activeZone,g=ht[d]||{name:d.toUpperCase()};lt(d,{name:r.name,src:l,imageElement:c}),R(`¡"${r.name}" aplicado en ${g.name}!`,"success"),le()},c.src=l};s&&s.addEventListener("click",o=>{o.stopPropagation(),n()}),i.addEventListener("click",n)}),{open:()=>li()}}function nl(){if(!W)return;const e=C.getState(),t=e.customizations[e.activeZone];W.querySelectorAll(".author-design-card").forEach(i=>{const s=i.getAttribute("data-preset-id"),n=ft.find(r=>r.id===s),o=t&&t.hasDecal&&n&&t.name===n.name;i.classList.toggle("is-active-on-shirt",!!o)})}function li(){W||ys(),nl(),W.classList.add("open")}function le(){W&&W.classList.remove("open")}function ol(e){function t(){const s=C.getState(),o=`
      <div class="control-card decal-upload-card">
        <div class="card-header-clean">
          <span class="card-eyebrow">ARTE Y ESTAMPADOS</span>
          <span class="zone-badge-tag">${(ht[s.activeZone]||{name:s.activeZone.toUpperCase()}).name}</span>
        </div>

        <!-- Área de Carga Satinada con Drag & Drop -->
        <div class="modern-dropzone" id="dropzone">
          <input type="file" id="file-input" accept="image/png, image/jpeg, image/webp, image/svg+xml" class="file-hidden-input" />
          <label for="file-input" class="modern-dropzone-label">
            <div class="dropzone-icon-box">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 4v12M8 8l4-4 4 4M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
              </svg>
            </div>
            <div class="dropzone-meta">
              <span class="dropzone-primary-text">Subir arte o pegar imagen</span>
              <span class="dropzone-secondary-text">PNG / JPG • Aplicación directa en tiempo real</span>
            </div>
          </label>
        </div>

        <!-- Botón para Abrir Galería de Diseños de Autor en Modal -->
        <div class="author-collection-cta">
          <div class="author-cta-texts">
            <div class="author-cta-badge-line">
              <span class="author-cta-dot"></span>
              <span class="author-cta-title">Diseños de Autor</span>
            </div>
            <span class="author-cta-desc">Colección Cápsula • 6 Artes Exclusivos</span>
          </div>
          <button type="button" class="btn-open-author-gallery" id="btn-open-author-gallery" title="Abrir catálogo completo de diseños de autor">
            <span>Ver Galería</span>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    `;e.innerHTML=o,i(e)}function a(s){if(!s)return;if(!s.type.startsWith("image/")){R("Selecciona un archivo de imagen válido (PNG, JPG o WebP)","error");return}const n=new FileReader;n.onload=o=>{const r=o.target.result,l=new Image;l.onload=async()=>{const c=s.name?s.name.replace(/\.[^/.]+$/,""):"Estampado",d=C.getState().activeZone;let g=l,p=r;try{const h=Xt(l,d);h.clamped&&(g=await ur(h.source),p=g.src,R(is(h,ke(h.from.w,h.max.wCm)),"info",6500))}catch(h){console.warn("[DecalUploader] No se pudo reducir a 300 DPI:",h)}lt(d,{name:c,src:p,imageElement:g}),R(`¡"${c}" cargado en ${d.toUpperCase()}!`,"success");try{La().open(g,c,(u,m,f)=>{const y=C.getState().activeZone;lt(y,{name:f||c,src:u,imageElement:m}),R("Estampado acondicionado y actualizado","success")},{onReplace:async(u,m,f)=>(lt(C.getState().activeZone,{name:f||c,src:u,imageElement:m}),{ok:!0,message:"Arte del lienzo reemplazado."})})}catch(h){console.error("Error al abrir editor automático:",h)}},l.src=r},n.readAsDataURL(s)}function i(s){const n=s.querySelector("#file-input"),o=s.querySelector("#dropzone"),r=s.querySelector("#btn-open-author-gallery");n&&n.addEventListener("change",l=>{a(l.target.files[0]),n.value=""}),o&&(o.addEventListener("dragover",l=>{l.preventDefault(),o.classList.add("is-dragover")}),o.addEventListener("dragleave",()=>{o.classList.remove("is-dragover")}),o.addEventListener("drop",l=>{l.preventDefault(),o.classList.remove("is-dragover"),l.dataTransfer.files&&l.dataTransfer.files.length>0&&a(l.dataTransfer.files[0])})),r&&r.addEventListener("click",()=>{ys().open()})}t(),window.addEventListener("paste",s=>{var o,r;const n=(r=s.clipboardData||((o=s.originalEvent)==null?void 0:o.clipboardData))==null?void 0:r.items;if(n){for(const l of n)if(l.kind==="file"&&l.type.startsWith("image/")){const c=l.getAsFile();a(c);break}}}),C.subscribe((s,n)=>{if(n==="activeZone"){const o=e.querySelector(".zone-badge-tag"),r=ht[s.activeZone]||{name:s.activeZone.toUpperCase()};o&&(o.textContent=r.name)}})}const ws={[rt.FIXED]:"Mismos centímetros en todas las tallas. En prendas más pequeñas el estampado se verá proporcionalmente más grande.",[rt.PROPORTIONAL]:"El estampado crece o se reduce con la prenda, conservando siempre la misma proporción visual."};function ci(e,t){e._sig!==t&&(e._sig=t,e.innerHTML=t)}const X=e=>String(Number(e.toFixed(1)));function xs(e,t){var p,h;const a=e.customizations[t];if(!a||!a.hasDecal)return null;const i=e.selectedSize,s=e.sizeMode,n=Fn(t,i,a.imageElement),o=qn(t,i),r=va(a,t,i),l=((p=a.imageElement)==null?void 0:p.naturalWidth)||((h=a.imageElement)==null?void 0:h.width)||0,c=ke(l,r.widthCm),d=Yi(c),g=a.lockAspect!==!1;return{decal:a,size:i,mode:s,range:n,heightRange:o,isLocked:g,aspect:a.customAspect||mt(a.imageElement),dims:r,effectiveDpi:c,dpiQuality:d,presets:Nn(t,n),table:Bn(a,t,Rt,s,i)}}function Es(e){return e.atLimit?"max":e.usage>=.85?"warn":"ok"}function Ss(e){return e.atLimit?`Límite de impresión alcanzado (${X(e.maxWidthCm)} × ${X(e.maxHeightCm)} cm)`:`${Math.round(e.usage*100)}% del área máxima · ${X(e.maxWidthCm)} × ${X(e.maxHeightCm)} cm`}function Ms(e){return e.presets.map(t=>`
    <button type="button" class="btn-cm-preset ${t.isMax?"is-max":""} ${Math.abs(e.dims.widthCm-t.cm)<.3?"active":""}" data-cm="${t.cm}" title="Ancho de ${X(t.cm)} cm">
      ${t.isMax?"Máx":`${t.label}<small>cm</small>`}
    </button>`).join("")}function Cs(e){return e.table.map(t=>`
    <button type="button" class="size-cell ${t.id===e.size.id?"active":""} ${t.reduced?"is-reduced":""}" data-size-id="${t.id}" role="listitem"
      title="${t.reduced?`Se reduce de ${X(t.requestedWidthCm)} cm al máximo de la talla`:`Ver en talla ${t.label}`}">
      <span class="size-cell-label">${t.label}</span>
      <span class="size-cell-dim">${X(t.widthCm)}×${X(t.heightCm)}</span>
    </button>`).join("")}function rl(e,t){const a=xs(e,t);if(!a)return"";const{dims:i,range:s,mode:n}=a,o=e.selectedSilhouette==="mug";return`
    <section class="size-panel" aria-label="Medida real de impresión">
      <div class="size-panel-head">
        <span class="card-eyebrow">MEDIDA REAL DE IMPRESIÓN</span>
        <div class="size-badge-cluster">
          <span class="size-badge" id="size-badge">${o?"Vaso 11 Oz":`Talla ${a.size.label}`}</span>
          <span class="dpi-badge ${a.dpiQuality.badgeClass}" id="dpi-badge" title="${a.dpiQuality.summary}">
            ${a.dpiQuality.icon} <span id="dpi-badge-label">${a.dpiQuality.label}</span>
          </span>
        </div>
      </div>

      <div class="size-readout">
        <div class="size-readout-main"><strong id="decal-cm-val">${X(i.widthCm)} × ${X(i.heightCm)}</strong><span class="size-unit">cm</span></div>
      </div>
      <div class="size-meter" id="size-meter" data-state="${Es(i)}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(i.usage*100)}">
        <span class="size-meter-fill" id="size-meter-fill" style="transform: scaleX(${i.usage.toFixed(3)})"></span>
      </div>
      <p class="size-meter-text" id="size-meter-text">${Ss(i)}</p>

      <div class="size-inputs">
        <div class="size-inputs-row">
          <div class="size-field">
            <label for="width-cm-input">Ancho</label>
            <div class="size-input-wrap">
              <button type="button" class="btn-step" data-axis="w" data-step="-0.5" aria-label="Reducir ancho 0,5 cm">−</button>
              <input type="number" id="width-cm-input" inputmode="decimal" step="0.5" min="${s.min}" max="${s.max}" value="${X(i.widthCm)}" />
              <button type="button" class="btn-step" data-axis="w" data-step="0.5" aria-label="Aumentar ancho 0,5 cm">+</button>
            </div>
          </div>
          <button type="button" class="btn-lock-aspect ${a.isLocked?"is-locked":"is-unlocked"}" id="btn-lock-aspect"
            title="${a.isLocked?"Proporción vinculada (clic para desbloquear y estirar libremente)":"Proporción libre (clic para vincular)"}"
            aria-label="${a.isLocked?"Desbloquear proporción":"Vincular proporción"}">
            ${a.isLocked?"🔗":"🔓"}
          </button>
          <div class="size-field">
            <label for="height-cm-input">Alto</label>
            <div class="size-input-wrap">
              <button type="button" class="btn-step" data-axis="h" data-step="-0.5" aria-label="Reducir alto 0,5 cm">−</button>
              <input type="number" id="height-cm-input" inputmode="decimal" step="0.5" min="${a.heightRange.min}" max="${a.heightRange.max}" value="${X(i.heightCm)}" />
              <button type="button" class="btn-step" data-axis="h" data-step="0.5" aria-label="Aumentar alto 0,5 cm">+</button>
            </div>
          </div>
        </div>
      </div>

      <div class="size-sliders">
        <div class="slider-field" id="width-slider-field">
          <div class="slider-field-head">
            <span id="width-slider-label">${a.isLocked&&!o?"Escala (proporcional)":"Barra de Ancho"}</span>
            <span class="slider-field-val" id="width-slider-val">${X(i.widthCm)} cm</span>
          </div>
          <input type="range" id="width-cm-slider" class="range-slider" min="${s.min}" max="${s.max}" step="0.1" value="${i.widthCm}" aria-label="Ancho del estampado en centímetros" />
        </div>

        <div class="slider-field ${a.isLocked&&!o?"is-hidden":""}" id="height-slider-field">
          <div class="slider-field-head">
            <span>Barra de Alto</span>
            <span class="slider-field-val" id="height-slider-val">${X(i.heightCm)} cm</span>
          </div>
          <input type="range" id="height-cm-slider" class="range-slider" min="${a.heightRange.min}" max="${a.heightRange.max}" step="0.1" value="${i.heightCm}" aria-label="Alto del estampado en centímetros" />
        </div>
      </div>
      <div class="size-presets" id="size-presets">${Ms(a)}</div>

      ${o?"":`
        <div class="size-mode" role="radiogroup" aria-label="Cómo escalar el estampado entre tallas">
          <button type="button" class="size-mode-btn ${n===rt.FIXED?"active":""}" data-mode="${rt.FIXED}" role="radio" aria-checked="${n===rt.FIXED}">📏 Medida fija</button>
          <button type="button" class="size-mode-btn ${n===rt.PROPORTIONAL?"active":""}" data-mode="${rt.PROPORTIONAL}" role="radio" aria-checked="${n===rt.PROPORTIONAL}">↔ Proporcional</button>
        </div>
        <p class="size-mode-hint" id="size-mode-hint">${ws[n]}</p>

        <div class="size-table-head">
          <span>Tu diseño en cada talla</span>
          <small>ancho × alto (cm)</small>
        </div>
        <div class="size-table" id="size-table" role="list">
          ${Cs(a)}
        </div>
      `}
    </section>`}function As(e,t,a,i=!1){const s=xs(t,a),n=e.querySelector(".size-panel");if(!s||!n)return;const{dims:o,range:r}=s,l=t.selectedSilhouette==="mug",c=A=>n.querySelector(A),d=A=>A&&(i||document.activeElement!==A);c("#decal-cm-val").textContent=`${X(o.widthCm)} × ${X(o.heightCm)}`;const g=c("#size-badge");g&&(g.textContent=l?"Vaso 11 Oz":`Talla ${s.size.label}`);const p=c("#dpi-badge");if(p){p.className=`dpi-badge ${s.dpiQuality.badgeClass}`,p.title=s.dpiQuality.summary;const A=c("#dpi-badge-label");A&&(A.textContent=s.dpiQuality.label)}const h=c("#size-meter");h.dataset.state=Es(o),h.setAttribute("aria-valuenow",Math.round(o.usage*100)),c("#size-meter-fill").style.transform=`scaleX(${o.usage.toFixed(3)})`,c("#size-meter-text").textContent=Ss(o);const u=c("#btn-lock-aspect");u&&(u.className=`btn-lock-aspect ${s.isLocked?"is-locked":"is-unlocked"}`,u.textContent=s.isLocked?"🔗":"🔓",u.title=s.isLocked?"Proporción vinculada (clic para desbloquear y poner medidas libres)":"Proporción libre (clic para vincular)");const m=c("#width-slider-label");m&&(m.textContent=s.isLocked&&!l?"Escala (proporcional)":"Barra de Ancho");const f=c("#height-slider-field");f&&f.classList.toggle("is-hidden",s.isLocked&&!l);const y=c("#width-cm-input"),v=c("#height-cm-input"),w=c("#width-cm-slider"),b=c("#height-cm-slider");y.min=r.min,y.max=r.max,v.min=s.heightRange.min,v.max=s.heightRange.max,w.min=r.min,w.max=r.max,b&&(b.min=s.heightRange.min,b.max=s.heightRange.max,d(b)&&(b.value=o.heightCm)),d(y)&&(y.value=X(o.widthCm)),d(v)&&(v.value=X(o.heightCm)),d(w)&&(w.value=o.widthCm);const x=c("#width-slider-val");x&&(x.textContent=`${X(o.widthCm)} cm`);const E=c("#height-slider-val");E&&(E.textContent=`${X(o.heightCm)} cm`),ci(c("#size-presets"),Ms(s));const S=c("#size-table");S&&ci(S,Cs(s));const M=c("#size-mode-hint");M&&(M.textContent=ws[s.mode]),n.querySelectorAll(".size-mode-btn").forEach(A=>{const $=A.dataset.mode===s.mode;A.classList.toggle("active",$),A.setAttribute("aria-checked",String($))})}function ll(e){return`
    <div class="control-card ready-zone-card">
      <div class="card-header-clean">
        <span class="card-eyebrow">PERSONALIZAR ${e.name.toUpperCase()}</span>
        <span class="zone-ready-badge">✨ LISTO</span>
      </div>
      <p class="ready-zone-hint">Elige un arte de la galería o sube tu logo/diseño para verlo en 3D.</p>
      <div class="quick-preset-actions">
        ${ft.slice(0,3).map(t=>`
          <button type="button" class="btn-quick-apply" data-preset-id="${t.id}">
            <span>${t.name.split(" ")[0]}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `}function Be(e,t,a,i){return`
    <div class="slider-field">
      <div class="slider-info">
        <label class="slider-name" for="${e}-slider">${t}</label>
        <span id="${e}-val" class="slider-val-badge">${a}</span>
      </div>
      <input type="range" id="${e}-slider" ${i} class="range-slider" />
    </div>`}function cl(e,t,a,i){return`
    <div class="control-card decal-active-panel">
      <div class="card-header-clean">
        <span class="card-eyebrow">AJUSTES DE TRANSFORMACIÓN</span>
        <button type="button" id="btn-remove-decal" class="btn-remove-luxury" title="Retirar estampado">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          <span>Quitar</span>
        </button>
      </div>

      <!-- Ficha del Diseño Activo -->
      <div class="active-decal-card">
        <div class="decal-meta-col">
          <div class="decal-title-line">
            <span class="decal-dot-glow"></span>
            <span class="decal-filename" title="${e.name}">${e.name}</span>
          </div>
          <div class="decal-tags-row">
            <span class="decal-pill-tag">DTF HD</span>
            <span class="decal-pill-dim">${t.name}</span>
          </div>
        </div>
      </div>

      ${rl(a,i)}

      <!-- Sliders de Precisión -->
      <div class="sliders-container">
        ${Be("rot","Rotación",`${Math.round(e.rotation)}°`,`min="0" max="360" step="1" value="${e.rotation}"`)}
        <div class="sliders-grid-2col">
          ${Be("posx","Posición X",e.offsetX.toFixed(2),`min="-2.0" max="2.0" step="0.02" value="${e.offsetX}"`)}
          ${Be("posy","Posición Y",e.offsetY.toFixed(2),`min="-2.0" max="2.0" step="0.02" value="${e.offsetY}"`)}
        </div>
      </div>

      <!-- Botón Principal: Abrir Editor HD -->
      <button type="button" id="btn-edit-decal" class="btn-editor-hero" title="Ajustes avanzados con gotero, filtros y recorte">
        <span class="btn-hero-icon">🎨</span>
        <span class="btn-hero-text">Abrir Editor HD &amp; Fondos</span>
      </button>

      <!-- Botón Único Secundario: Centrar Estampado -->
      <button type="button" id="btn-recenter" class="btn-recenter-luxury" title="Re-centrar diseño al eje de la prenda">
        <span class="btn-recenter-icon">🎯</span>
        <span>Centrar Estampado</span>
      </button>
    </div>
  `}function dl(e,t){const a=e.querySelector(".size-panel");if(!a)return;const i=a.querySelector("#width-cm-input"),s=a.querySelector("#height-cm-input"),n=a.querySelector("#width-cm-slider"),o=a.querySelector("#height-cm-slider"),r=()=>C.getState().customizations[t],l=()=>{var m,f;return((m=r())==null?void 0:m.customAspect)||mt((f=r())==null?void 0:f.imageElement)},c=()=>{var m;return((m=r())==null?void 0:m.lockAspect)!==!1},d=()=>parseFloat(i.value)||0,g=()=>parseFloat(s.value)||0,p=m=>{c()?Dt(t,{widthCm:m}):Dt(t,{widthCm:m,heightCm:g()})},h=m=>{const f=C.getState().selectedSilhouette==="mug";c()&&!f?p(m*l()):Dt(t,{heightCm:m,widthCm:d()})},u=()=>As(e,C.getState(),t,!0);n==null||n.addEventListener("input",()=>p(parseFloat(n.value))),o==null||o.addEventListener("input",()=>h(parseFloat(o.value))),i.addEventListener("input",()=>{const m=parseFloat(i.value);m>=parseFloat(i.min)&&m<=parseFloat(i.max)&&p(m)}),s.addEventListener("input",()=>{const m=parseFloat(s.value),f=parseFloat(s.min)||4,y=parseFloat(s.max)||60;m>=f&&m<=y&&h(m)}),[i,s].forEach((m,f)=>{m.addEventListener("change",()=>{const y=parseFloat(m.value);y>0&&(f===0?p:h)(y),u()}),m.addEventListener("keydown",y=>{y.key==="Enter"&&m.blur()})}),a.addEventListener("click",m=>{var y;const f=m.target.closest("button");if(!(!f||!a.contains(f))){if(f.id==="btn-lock-aspect"||f.closest("#btn-lock-aspect")){to(t);const v=((y=r())==null?void 0:y.lockAspect)!==!1;R(v?"Proporción vinculada":"Proporción libre: ahora puedes modificar alto y ancho por separado","info"),u();return}if(f.classList.contains("btn-step")){const v=parseFloat(f.dataset.step),w=f.dataset.axis==="h",b=w?g():d();(w?h:p)(b+v)}else if(f.classList.contains("btn-cm-preset"))p(parseFloat(f.dataset.cm));else if(f.classList.contains("size-mode-btn"))Qn(f.dataset.mode);else if(f.classList.contains("size-cell")){const v=f.dataset.sizeId,w=Rt.find(b=>b.id===v);w&&(qi(w),R(`Visualizando en Talla ${w.label}`,"info"))}}})}function ul(e){function t(){const n=C.getState(),o=n.activeZone,r=ht[o]||{name:"Esta Zona"},l=n.customizations[o];if(!l||!l.hasDecal){e.innerHTML=ll(r),a(e,o);return}e.innerHTML=cl(l,r,n,o),i(e,o),wt(e)}function a(n,o){n.querySelectorAll(".btn-quick-apply").forEach(l=>{l.addEventListener("click",()=>{const c=l.getAttribute("data-preset-id"),d=ft.find(h=>h.id===c);if(!d)return;const g=d.src||Me(d.svg),p=new Image;p.onload=()=>{lt(o,{name:d.name,src:g,imageElement:p}),R(`"${d.name}" aplicado`,"success")},p.src=g})})}function i(n,o){var l,c,d;const r={rotation:n.querySelector("#rot-slider"),offsetX:n.querySelector("#posx-slider"),offsetY:n.querySelector("#posy-slider")};dl(n,o),(l=n.querySelector("#btn-edit-decal"))==null||l.addEventListener("click",()=>{const g=C.getState().customizations[o];if(!g||!g.imageElement)return;La().open(g.imageElement,g.name||"estampado",(h,u,m)=>{lt(o,{...g,name:m,src:h,imageElement:u}),R("Fondo y filtros actualizados","success")})}),Object.entries(r).forEach(([g,p])=>{p==null||p.addEventListener("input",h=>Dt(o,{[g]:parseFloat(h.target.value)}))}),(c=n.querySelector("#btn-remove-decal"))==null||c.addEventListener("click",()=>{Kn(o),R("Estampado retirado","info")}),(d=n.querySelector("#btn-recenter"))==null||d.addEventListener("click",()=>{Dt(o,{offsetX:0,offsetY:0,rotation:0,scale:zn(o)}),R("Estampado centrado","success")})}function s(n){const o=n.activeZone,r=n.customizations[o];if(!r||!r.hasDecal)return;const l=[["#rot-slider","#rot-val",r.rotation,c=>`${Math.round(c)}°`],["#posx-slider","#posx-val",r.offsetX,c=>c.toFixed(2)],["#posy-slider","#posy-val",r.offsetY,c=>c.toFixed(2)]];for(const[c,d,g,p]of l){const h=e.querySelector(c),u=e.querySelector(d);h&&document.activeElement!==h&&(h.value=g),u&&(u.textContent=p(g))}As(e,n,o),wt(e)}Hi(),t(),C.subscribe((n,o)=>{o==="activeZone"||o==="silhouette"||o&&o.startsWith("decal:")?t():(o==="size"||o==="sizeMode"||o===`transform:${n.activeZone}`)&&s(n)})}function hl(e){const a=`
    <div class="view-switcher-bar modern-hud-dock">
      <!-- Grupo de Ángulos de Cámara -->
      <div class="view-buttons-group">
        ${[{id:"front",label:"Frente",icon:"👕"},{id:"back",label:"Espalda",icon:"🔙"},{id:"free",label:"Libre 360°",icon:"🔄"}].map(p=>`
          <button 
            type="button" 
            class="view-btn ${p.id==="front"?"active":""}" 
            data-view-id="${p.id}"
            title="Ver ${p.label}"
          >
            <span class="view-icon">${p.icon}</span>
            <span class="view-text">${p.label}</span>
          </button>
        `).join("")}
      </div>

      <div class="hud-divider"></div>

      <!-- Selector de Modo: 3D vs Plano (Mockup 2D) -->
      <div class="mode-buttons-group">
        <button type="button" class="mode-btn active" data-mode="3d" title="Modo 3D Interactivo 360°">
          <span class="mode-icon">🌐</span>
          <span class="mode-text">3D</span>
        </button>
        <button type="button" class="mode-btn" data-mode="flat" title="Modo Técnico Plano (Flat Lay)">
          <span class="mode-icon">📐</span>
          <span class="mode-text">Plano</span>
        </button>
      </div>

      <div class="hud-divider"></div>

      <!-- Toggle Partículas -->
      <button type="button" id="btn-particles" class="action-circle-btn" title="Activar partículas ambientales">
        <span class="particles-icon">✨</span>
      </button>

      <!-- Giro Automático -->
      <button type="button" id="btn-autorotate" class="action-circle-btn" title="Activar/Desactivar giro continuo">
        <span class="spin-icon">💫</span>
      </button>
    </div>
  `;e.innerHTML=a;const i=e.querySelectorAll(".view-btn");i.forEach(p=>{p.addEventListener("click",()=>{const h=p.getAttribute("data-view-id");We(h),ht[h]&&Bi(h)})});const s=e.querySelectorAll(".mode-btn");s.forEach(p=>{p.addEventListener("click",()=>{const h=p.getAttribute("data-mode");h==="flat"&&C.getState().selectedSilhouette==="mug"&&We("front"),eo(h)})});const n=e.querySelector("#btn-autorotate");n.addEventListener("click",()=>{Jn()});const o=e.querySelector("#btn-particles");let r=!1;o.addEventListener("click",()=>{r=!r,o.classList.toggle("active",r),o.title=r?"Desactivar partículas":"Activar partículas",window.engine&&window.engine.particles&&window.engine.particles.setVisible(r)});const l=e.querySelector(".view-buttons-group"),c=e.querySelectorAll(".hud-divider"),d=e.querySelector('.mode-btn[data-mode="3d"] .mode-text');function g(p){const h=p==="mug";l&&(l.style.display=h?"none":""),c.forEach(u=>{u.style.display=h?"none":""}),o&&(o.style.display=h?"none":""),n&&(n.style.display=h?"none":""),d&&(d.textContent=h?"360°":"3D")}g(C.getState().selectedSilhouette),C.subscribe((p,h)=>{h==="silhouette"&&g(p.selectedSilhouette),h==="view"&&i.forEach(u=>{u.classList.toggle("active",u.getAttribute("data-view-id")===p.activeView)}),h==="viewMode"&&s.forEach(u=>{u.classList.toggle("active",u.getAttribute("data-mode")===p.viewMode)}),h==="autoRotate"&&n.classList.toggle("active",p.isAutoRotate)})}function Ne(e){const t=e==="mug",a=document.querySelector(".sidebar-title"),i=document.querySelector(".fabric-tag");a&&(a.textContent=t?"Configuración de Taza / Vaso 11 Oz":"Configuración de Prenda"),i&&(i.textContent=t?"Cerámica AAA • Sublimación HD":"Heavyweight 240 GSM");const s=document.querySelector('.zone-tab-btn[data-zone="front"] .zone-title'),n=document.querySelector('.zone-tab-btn[data-zone="frontPocket"]'),o=document.querySelector('.zone-tab-btn[data-zone="back"]');s&&(s.textContent=t?"☕ Área de Estampado (Taza / Vaso 11 Oz)":"Frente Central"),n&&(n.style.display=t?"none":""),o&&(o.style.display=t?"none":""),document.querySelectorAll("[data-silhouette]").forEach(r=>{r.classList.toggle("active",r.getAttribute("data-silhouette")===e)})}function pl(e){if(!e)return;let t=C.getState().selectedSilhouette||"man";e.innerHTML=`
    <div class="silhouette-viewport-dock" id="silhouette-switcher-dock" role="group" aria-label="Selección de Producto 3D">
      <button 
        type="button" 
        class="btn-silhouette-top ${t==="man"?"active":""}" 
        data-silhouette="man"
        title="Camiseta Masculina Oversized Boxy Fit"
      >
        <span class="sil-icon">👕</span>
        <span class="sil-label">Hombre <span class="sil-fit">(Boxy)</span></span>
      </button>
      <button 
        type="button" 
        class="btn-silhouette-top ${t==="woman"?"active":""}" 
        data-silhouette="woman"
        title="Camiseta Femenina Slim Fit"
      >
        <span class="sil-icon">👚</span>
        <span class="sil-label">Mujer <span class="sil-fit">(Slim)</span></span>
      </button>
      <button 
        type="button" 
        class="btn-silhouette-top ${t==="mug"?"active":""}" 
        data-silhouette="mug"
        title="Taza / Mug Cerámico 11 Oz (Clásico y Mágico Termosensible)"
      >
        <span class="sil-icon">☕</span>
        <span class="sil-label">Taza / Vaso <span class="sil-fit">(11 Oz)</span></span>
      </button>
    </div>
  `;const a=document.querySelector(".sidebar-header");if(a&&!document.getElementById("sidebar-product-switcher")){const s=document.createElement("div");s.id="sidebar-product-switcher",s.className="sidebar-product-switcher",s.innerHTML=`
      <button type="button" class="sidebar-prod-btn ${t==="man"?"active":""}" data-silhouette="man">
        <span>👕</span><span>Hombre</span>
      </button>
      <button type="button" class="sidebar-prod-btn ${t==="woman"?"active":""}" data-silhouette="woman">
        <span>👚</span><span>Mujer</span>
      </button>
      <button type="button" class="sidebar-prod-btn ${t==="mug"?"active":""}" data-silhouette="mug">
        <span>☕</span><span>Taza / Vaso 11 Oz</span>
      </button>
    `,a.appendChild(s)}function i(s){!s||s===t||(t=s,Ne(s),Ni(s))}document.querySelectorAll("[data-silhouette]").forEach(s=>{s.addEventListener("click",()=>i(s.getAttribute("data-silhouette")))}),Ne(t),C.subscribe((s,n)=>{n==="silhouette"&&(t=s.selectedSilhouette,Ne(t))})}function ml(e,t){function a(){var h;const i=C.getState(),{pricing:s,selectedSilhouette:n,isMagicMug:o,customizations:r}=i,l=n==="mug",c=l?(h=r.front)!=null&&h.hasDecal?1:0:Object.values(r).filter(u=>u.hasDecal).length,g=`
      <div class="checkout-footer-dock">
        <!-- Fila de Precio y Acción Principal -->
        <div class="checkout-dock-main">
          <div class="dock-price-stack">
            <span class="dock-price-sub">${l?o?"Mug Mágico Termosensible ✨ · 11 Oz":"Vaso Cerámico 11 Oz · Sublimación HD":`${c} zona(s) con estampado DTF`}</span>
            <div class="dock-price-val">${K(s.total)}</div>
          </div>

          <button type="button" id="btn-checkout" class="btn-checkout-primary" title="Abrir checkout para confirmar pedido">
            <span>🛒 Confirmar Pedido</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    `;e.innerHTML=g;const p=e.querySelector("#btn-checkout");p&&t&&p.addEventListener("click",t)}a(),C.subscribe((i,s)=>{(s==="silhouette"||s==="magicMug"||s==="size"||s==="color"||s==="material"||s==="grammage"||s&&s.startsWith("decal:"))&&a()})}function gl(e){return`
    <div class="auth-tabs-header">
      <button class="auth-tab-btn ${e?"active":""}" data-tab="login">Iniciar Sesión</button>
      <button class="auth-tab-btn ${e?"":"active"}" data-tab="register">Crear Cuenta</button>
    </div>

    <form id="auth-main-form">
      ${e?"":`
        <div class="auth-form-group">
          <label class="auth-form-label">NOMBRE COMPLETO</label>
          <input type="text" class="auth-form-input" id="auth-name" placeholder="Tu nombre o alias" required />
        </div>
      `}

      <div class="auth-form-group">
        <label class="auth-form-label">CORREO ELECTRÓNICO</label>
        <input type="email" class="auth-form-input" id="auth-email" placeholder="ejemplo@correo.com" required />
      </div>

      <div class="auth-form-group">
        <label class="auth-form-label">CONTRASEÑA</label>
        <input type="password" class="auth-form-input" id="auth-password" placeholder="••••••••" required />
      </div>

      ${e?"":`
        <div class="auth-form-group">
          <label class="auth-form-label">TELEGRAM CHAT ID (2FA Opcional)</label>
          <input type="text" class="auth-form-input" id="auth-tg-id" placeholder="Ej: 7788892109" />
          <div class="auth-tg-helper">
            <span>Protege tu cuenta con 2FA</span>
            <a href="https://t.me/Notificaciones_inc_bot" target="_blank" rel="noopener">🤖 Obtener ID en Telegram</a>
          </div>
        </div>
      `}

      <div id="auth-error-msg" style="color: #f87171; font-size: 0.78rem; min-height: 1.2rem; margin-top: 4px;"></div>

      <button type="submit" class="btn-auth-submit" id="btn-auth-submit">
        ${e?"Ingresar a mi Cuenta":"Registrarme y Entrar"}
      </button>
    </form>

    <div class="auth-divider"><span>O CONTINUAR CON</span></div>

    <button type="button" class="btn-google-auth" id="btn-google-login">
      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
      Continuar con Google
    </button>
  `}function fl(){return`
    <div class="auth-2fa-screen">
      <div class="auth-2fa-icon">🛡️</div>
      <h3 class="auth-2fa-title">Verificación en Dos Pasos (2FA)</h3>
      <p class="auth-2fa-desc">
        Enviamos un código de 6 dígitos a tu bot de <strong>Telegram</strong> (@Notificaciones_inc_bot). Ingresa el código para confirmar tu identidad.
      </p>

      <form id="form-2fa-verify">
        <input type="text" maxlength="6" class="auth-form-input auth-otp-input" id="input-2fa-otp" placeholder="000000" autofocus required />
        <div class="auth-timer-tag" id="timer-2fa-countdown">Expira en: 05:00</div>
        <div id="auth-2fa-error" style="color: #f87171; font-size: 0.8rem; min-height: 1.4rem; margin-top: 8px;"></div>

        <button type="submit" class="btn-auth-submit" style="margin-top: 10px;">Verificar y Acceder</button>
        <button type="button" class="btn-dropdown-action" id="btn-resend-2fa" style="margin-top: 8px; width: 100%; text-align: center; color: #00f0ff;">
          ¿No llegó? Reenviar código
        </button>
      </form>
    </div>
  `}class vl{constructor(){this.currentView="login",this.active2faChallenge=null,this.timerInterval=null,this.createDom(),this.bindEvents(),this.initGoogleAuth()}createDom(){let t=document.getElementById("auth-modal-overlay");t||(t=document.createElement("div"),t.id="auth-modal-overlay",t.className="auth-modal-overlay",document.body.appendChild(t)),this.overlay=t,this.render()}render(){this.overlay.innerHTML=`
      <div class="auth-modal-card">
        <button class="auth-modal-close" id="btn-auth-close" title="Cerrar">&times;</button>
        ${this.currentView==="2fa"?fl():gl(this.currentView==="login")}
      </div>
    `,this.attachViewEvents()}bindEvents(){this.overlay.addEventListener("click",t=>{t.target===this.overlay&&this.close()})}attachViewEvents(){const t=this.overlay.querySelector("#btn-auth-close");t&&t.addEventListener("click",()=>this.close()),this.overlay.querySelectorAll(".auth-tab-btn").forEach(r=>{r.addEventListener("click",()=>{this.currentView=r.getAttribute("data-tab"),this.render()})});const i=this.overlay.querySelector("#auth-main-form");i&&i.addEventListener("submit",r=>this.handleFormSubmit(r));const s=this.overlay.querySelector("#btn-google-login");s&&s.addEventListener("click",()=>this.handleGoogleLogin());const n=this.overlay.querySelector("#form-2fa-verify");n&&n.addEventListener("submit",r=>this.handle2faSubmit(r));const o=this.overlay.querySelector("#btn-resend-2fa");o&&o.addEventListener("click",()=>this.handleResend2fa())}async handleFormSubmit(t){var n,o,r,l;t.preventDefault();const a=this.overlay.querySelector("#auth-error-msg");a&&(a.textContent="");const i=(n=this.overlay.querySelector("#auth-email"))==null?void 0:n.value,s=(o=this.overlay.querySelector("#auth-password"))==null?void 0:o.value;try{if(this.currentView==="login"){const c=await _.login({email:i,password:s});c.requires2fa?this.start2faChallenge(c):this.close()}else{const c=(r=this.overlay.querySelector("#auth-name"))==null?void 0:r.value,d=(l=this.overlay.querySelector("#auth-tg-id"))==null?void 0:l.value;await _.register({name:c,email:i,password:s,telegramId:d}),this.close()}}catch(c){a&&(a.textContent=c.message)}}handleGoogleLogin(){if(window.google&&window.google.accounts&&window.google.accounts.id)window.google.accounts.id.prompt();else{const t=prompt("Ingresa tu correo de Google para la prueba:","usuario.prueba@gmail.com");t&&_.loginWithGoogle({name:t.split("@")[0],email:t,picture:null}).then(a=>{a.requires2fa?this.start2faChallenge(a):this.close()}).catch(a=>alert(a.message))}}start2faChallenge(t){this.active2faChallenge=t,this.currentView="2fa",this.render(),this.startCountdown(300)}handle2faSubmit(t){var s;t.preventDefault();const a=this.overlay.querySelector("#auth-2fa-error");a&&(a.textContent="");const i=(s=this.overlay.querySelector("#input-2fa-otp"))==null?void 0:s.value;try{_.complete2faLogin(this.active2faChallenge.userId,i),this.stopCountdown(),this.close()}catch(n){a&&(a.textContent=n.message)}}async handleResend2fa(){const t=this.overlay.querySelector("#auth-2fa-error");t&&(t.textContent="Reenviando código a Telegram...");try{await Wt.sendVerificationCode({telegramId:this.active2faChallenge.telegramId,userName:this.active2faChallenge.user.name,userId:this.active2faChallenge.userId}),t&&(t.textContent="¡Código reenviado con éxito!"),this.startCountdown(300)}catch(a){t&&(t.textContent=a.message)}}startCountdown(t){this.stopCountdown();let a=t;const i=this.overlay.querySelector("#timer-2fa-countdown");this.timerInterval=setInterval(()=>{if(a--,i){const s=String(Math.floor(a/60)).padStart(2,"0"),n=String(a%60).padStart(2,"0");i.textContent=`Expira en: ${s}:${n}`}a<=0&&this.stopCountdown()},1e3)}stopCountdown(){this.timerInterval&&clearInterval(this.timerInterval),this.timerInterval=null}open(t="login"){this.currentView=t,this.render(),this.overlay.classList.add("open")}close(){this.stopCountdown(),this.overlay.classList.remove("open")}initGoogleAuth(){window.google&&window.google.accounts&&window.google.accounts.id.initialize({client_id:"TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com",callback:t=>{_.loginWithGoogle(t.credential).then(a=>{a.requires2fa?this.start2faChallenge(a):this.close()})}})}}const Qt=new vl,V=Object.freeze({PENDING_PAYMENT:"pending_payment",PROOF_SUBMITTED:"proof_submitted",PAID:"paid"}),ra=Object.freeze({[V.PENDING_PAYMENT]:{label:"Pendiente de Pago",tone:"pending",hint:"Paga con Nequi o Bancolombia y marca como pagado para iniciar la producción."},[V.PROOF_SUBMITTED]:{label:"En Validación",tone:"review",hint:"Tu pago entró en validación. En menos de 24 horas te notificaremos y validaremos tu pedido."},[V.PAID]:{label:"Pago Confirmado",tone:"paid",hint:"Pago validado. Tu pedido entra a producción."}}),Ls=Object.freeze([{id:"nequi",label:"Nequi",icon:"📱",fields:[{label:"Número Nequi",value:"",copy:!0},{label:"Titular",value:""}]},{id:"bancolombia",label:"Bancolombia",icon:"🏦",fields:[{label:"Tipo de cuenta",value:""},{label:"Número de cuenta",value:"",copy:!0},{label:"Titular",value:""},{label:"Documento",value:""}]}]);function ks(e){return Ls.find(t=>t.id===e)||null}function bl(e){return ra[e]||ra[V.PENDING_PAYMENT]}function yl(e){return((e==null?void 0:e.status)||V.PENDING_PAYMENT)!==V.PAID}const Ia="shirt_studio_saved_orders",wl=30;function Ue(e){const{screenshot:t,...a}=e;return a}function $s(e){const t=[a=>a,a=>a.map((i,s)=>s<3?i:Ue(i)),a=>a.map((i,s)=>s<1?i:Ue(i)),a=>a.map(Ue)];for(const a of t)try{return localStorage.setItem(Ia,JSON.stringify(a(e))),!0}catch{}return console.error("[OrderStorage] Sin cupo en localStorage para guardar los pedidos."),!1}function te(){try{const e=localStorage.getItem(Ia),t=e?JSON.parse(e):[];return Array.isArray(t)?t:[]}catch(e){return console.error("[OrderStorage] Error al leer pedidos locales:",e),[]}}function Ht(e){return te().find(t=>t.id===e)||null}function Pe(e){if(!e)return[];const t=String(e.email||"").toLowerCase();return te().filter(a=>{var s;const i=String(((s=a.customer)==null?void 0:s.email)||"").toLowerCase();return i?i===t:!a.userId})}function xl(e,t){var n,o;const a=Ht(e.id);if(a)return{ok:!0,order:a,existed:!0};const i={id:e.id,createdAt:new Date().toISOString(),status:V.PENDING_PAYMENT,paymentMethod:null,paymentProof:null,customer:{name:((n=e.customer)==null?void 0:n.name)||(t==null?void 0:t.name)||"",email:(t==null?void 0:t.email)||"",city:((o=e.customer)==null?void 0:o.city)||(t==null?void 0:t.city)||"",phone:(t==null?void 0:t.phone)||"",address:(t==null?void 0:t.address)||"",deliveryNotes:(t==null?void 0:t.deliveryNotes)||""},userId:(t==null?void 0:t.id)||null,garment:e.garment,decals:e.decals||[],pricing:e.pricing,driveUrl:null,screenshot:e.screenshot||null};return{ok:$s([i,...te()].slice(0,wl)),order:i}}function Gt(e,t){const a=te(),i=a.findIndex(s=>s.id===e);return i===-1?{ok:!1,order:null}:(a[i]={...a[i],...t,updatedAt:new Date().toISOString()},{ok:$s(a),order:a[i]})}function El(e){try{return localStorage.setItem(Ia,JSON.stringify(te().filter(t=>t.id!==e))),!0}catch(t){return console.error("[OrderStorage] Error al eliminar pedido:",t),!1}}const Q=(e,t=18)=>`<svg viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${e}</svg>`,Z={user:e=>Q('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"/>',e),box:e=>Q('<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',e),shield:e=>Q('<path d="M12 3l8 3v6c0 4.5-3.2 8.3-8 9-4.8-.7-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',e),scale:e=>Q('<path d="M12 3v18"/><path d="M6 21h12"/><path d="M5 7h14"/><path d="M5 7l-3 7a3 3 0 006 0L5 7z"/><path d="M19 7l-3 7a3 3 0 006 0l-3-7z"/>',e),logout:e=>Q('<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',e),chevron:e=>Q('<path d="M6 9l6 6 6-6"/>',e),check:e=>Q('<path d="M5 12.5l4.5 4.5L19 7.5"/>',e),cross:e=>Q('<path d="M6 6l12 12M18 6L6 18"/>',e),save:e=>Q('<path d="M5 3h11l4 4v13a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M8 3v5h7V3"/><path d="M8 21v-7h8v7"/>',e),shirt:e=>Q('<path d="M8 3L3 6l2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 01-8 0z"/>',e),palette:e=>Q('<path d="M12 3a9 9 0 100 18 2 2 0 002-2c0-1.2-.8-1.6-.8-2.6 0-1 .8-1.4 1.8-1.4H17a4 4 0 004-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',e),download:e=>Q('<path d="M12 4v11"/><path d="M7.5 11L12 15.5 16.5 11"/><path d="M4 19h16"/>',e),upload:e=>Q('<path d="M12 15V4"/><path d="M7.5 8L12 3.5 16.5 8"/><path d="M4 19h16"/>',e),trash:e=>Q('<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/>',e),lock:e=>Q('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',e),globe:e=>Q('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>',e),vault:e=>Q('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="3.5"/><path d="M12 8.5V6M12 18v-2.5M8.5 12H6M18 12h-2.5"/>',e),alert:e=>Q('<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5"/><path d="M12 18h.01"/>',e)},Sl="legal-terms-modal-overlay",Ml={warning:"alert",danger:"alert",info:"shield"};let H=null,Da=null,jt=null;function Cl(e,t){const a=e.tone||"info";return`
    <article class="legal-clause" data-tone="${a}" id="legal-${I(e.id)}">
      <header class="legal-clause-head">
        <span class="legal-clause-n">${String(t+1).padStart(2,"0")}</span>
        <h4 class="legal-clause-title">${I(e.title)}</h4>
        <span class="legal-clause-icon">${Z[Ml[a]](16)}</span>
      </header>
      <p class="legal-clause-text">${I(e.text)}</p>
    </article>`}function Al(){return`
    <div class="modal-card legal-modal-card" role="dialog" aria-modal="true" aria-labelledby="legal-terms-title">
      <div class="modal-header">
        <div class="legal-head">
          <span class="legal-head-icon">${Z.scale(22)}</span>
          <div class="modal-title-box">
            <span class="modal-badge">LEGAL · v${I(Zt)}</span>
            <h3 class="modal-title" id="legal-terms-title">${I(kr)}</h3>
          </div>
        </div>
        <button type="button" class="btn-close-modal" data-legal="close" aria-label="Cerrar">${Z.cross(16)}</button>
      </div>

      <div class="modal-body legal-body">
        <p class="legal-intro">${I($r)}</p>
        <div class="legal-callout" role="note">
          <span class="legal-callout-icon">${Z.alert(18)}</span>
          <strong>${I(Tr)}</strong>
        </div>
        ${Dr.map(Cl).join("")}
      </div>

      <div class="modal-footer legal-footer">
        <span class="legal-updated">Actualizado el ${I(Lr)}</span>
        <button type="button" class="legal-accept" data-legal="accept">${Z.check(16)}<span>Entendido y Acepto</span></button>
      </div>
    </div>`}function Ts(e){e.key==="Escape"&&he()}function Is(){return H||(H=document.createElement("div"),H.id=Sl,H.className="legal-overlay",H.setAttribute("aria-hidden","true"),H.innerHTML=Al(),document.body.appendChild(H),H.addEventListener("click",e=>{var a;if(e.target===H)return he();const t=(a=e.target.closest("[data-legal]"))==null?void 0:a.dataset.legal;if(t==="close"&&he(),t==="accept"){const i=Da;he(),i==null||i()}}),H)}function Ll(){const e=()=>Is();"requestIdleCallback"in window?window.requestIdleCallback(e,{timeout:2500}):setTimeout(e,400)}function Pa({onAccept:e}={}){Is(),Da=e||null,jt=document.activeElement,H.querySelector(".legal-body").scrollTop=0,H.setAttribute("aria-hidden","false"),H.classList.add("open"),document.addEventListener("keydown",Ts),H.querySelector(".legal-accept").focus({preventScroll:!0})}function he(){!H||!H.classList.contains("open")||(document.removeEventListener("keydown",Ts),H.classList.remove("open"),H.setAttribute("aria-hidden","true"),Da=null,jt!=null&&jt.isConnected&&jt.focus({preventScroll:!0}))}function kl(){return!!(H!=null&&H.classList.contains("open"))}const di="user-profile-overlay";function kt({id:e,label:t,value:a="",type:i="text",placeholder:s="",autocomplete:n="off",full:o=!1,extra:r="",hint:l=""}){return`
    <div class="pf-field${o?" pf-full":""}">
      <label for="pf-${e}">${t}</label>
      <input id="pf-${e}" name="${e}" type="${i}" class="pf-input" value="${I(a)}"
        placeholder="${I(s)}" autocomplete="${n}" aria-describedby="pf-${e}-msg" ${r} />
      <p class="pf-msg${l?" is-hint":""}" id="pf-${e}-msg" data-hint="${I(l)}">${l}</p>
    </div>`}function $l(e){const t=e.termsVersion===Zt;return`
    <form class="modal-card profile-modal-card" id="pf-form" role="dialog" aria-modal="true" aria-labelledby="pf-title" novalidate>
      <div class="modal-header">
        <div class="modal-title-box">
          <span class="modal-badge">MI CUENTA</span>
          <h3 class="modal-title" id="pf-title">Mi Perfil &amp; Datos de Envío</h3>
        </div>
        <button type="button" class="btn-close-modal" data-pf="cancel" aria-label="Cerrar">${Z.cross(16)}</button>
      </div>

      <div class="modal-body pf-body">
        <p class="pf-intro">Usaremos estos datos para liquidar tus pedidos y coordinar el despacho por WhatsApp.</p>
        <div class="pf-grid">
          ${kt({id:"name",label:"Nombre Completo",value:e.name,placeholder:"Ej. Carlos Mendoza",autocomplete:"name",full:!0,extra:'required maxlength="80"'})}
          ${kt({id:"alias",label:'Alias de Autor <span class="pf-opt">(público)</span>',value:e.alias,placeholder:"tu_alias",autocomplete:"nickname",full:!0,extra:`maxlength="${Te}" autocapitalize="none" spellcheck="false"`,hint:"Se muestra como @alias en tus diseños públicos del Lookbook. 3–20 caracteres: letras, números, _ o ."})}
          ${kt({id:"email",label:"Correo Electrónico",value:e.email,type:"email",full:!0,extra:'readonly aria-readonly="true"',hint:"Es tu llave de acceso y la de tus pedidos, por eso no se edita aquí."})}
          ${kt({id:"phone",label:"Celular / WhatsApp de Entrega",value:e.phone,type:"tel",placeholder:"+57 300 123 4567",autocomplete:"tel",extra:'inputmode="tel" maxlength="20"'})}
          ${kt({id:"city",label:"Ciudad / Municipio",value:e.city,placeholder:"Bogotá, Medellín, Cali…",autocomplete:"address-level2",extra:'maxlength="60"'})}
          ${kt({id:"address",label:"Dirección de Despacho",value:e.address,placeholder:"Calle 100 # 15-20, Apto 402",autocomplete:"street-address",full:!0,extra:'maxlength="140"'})}
          <div class="pf-field pf-full">
            <label for="pf-deliveryNotes">Notas de Entrega <span class="pf-opt">(opcional)</span></label>
            <textarea id="pf-deliveryNotes" name="deliveryNotes" class="pf-input pf-textarea" rows="2" maxlength="200"
              placeholder="Ej. Dejar en portería">${I(e.deliveryNotes)}</textarea>
          </div>
        </div>

        <div class="pf-consent">
          <label class="pf-check" for="pf-terms">
            <input type="checkbox" id="pf-terms" ${t?"checked":""} aria-describedby="pf-terms-msg" />
            <span class="pf-check-box" aria-hidden="true">${Z.check(14)}</span>
            <span class="pf-check-text">${I(Ir)}</span>
          </label>
          <button type="button" class="pf-link" data-pf="terms">${Z.scale(14)}<span>Leer Términos &amp; Propiedad Intelectual</span></button>
          <p class="pf-msg" id="pf-terms-msg" role="alert"></p>
        </div>
      </div>

      <div class="modal-footer pf-footer">
        <button type="button" class="btn-secondary pf-cancel" data-pf="cancel">Cancelar</button>
        <button type="submit" class="pf-save">${Z.save(16)}<span>Guardar Cambios</span></button>
      </div>
    </form>`}function Ds(){var o;const e=_.getCurrentUser();if(!e)return null;(o=document.getElementById(di))==null||o.remove();const t=document.createElement("div");t.id=di,t.className="modal-overlay profile-overlay",t.innerHTML=$l(e),document.body.appendChild(t);const a=t.querySelector("#pf-form"),i=r=>{r.key==="Escape"&&!kl()&&s()};function s(){document.removeEventListener("keydown",i),t.classList.remove("active"),setTimeout(()=>t.remove(),220)}function n(r){var c;a.querySelectorAll(".pf-input").forEach(d=>{const g=r[d.name];d.classList.toggle("is-invalid",!!g),d.setAttribute("aria-invalid",g?"true":"false");const p=a.querySelector(`#pf-${d.name}-msg`);p&&(p.textContent=g||p.dataset.hint||"",p.classList.toggle("is-hint",!g&&!!p.dataset.hint))}),a.querySelector("#pf-terms-msg").textContent=r.terms||"",a.querySelector(".pf-consent").classList.toggle("is-invalid",!!r.terms);const l=Object.keys(r)[0];l&&((c=a.querySelector(l==="terms"?"#pf-terms":`#pf-${l}`))==null||c.focus())}return a.addEventListener("submit",r=>{r.preventDefault();const l=Object.fromEntries(new FormData(a)),c=a.querySelector("#pf-terms").checked;if(!c)return n({terms:"Debes aceptar los Términos para guardar tus datos."});try{_.updateUserProfile({...l,termsAccepted:c})}catch(d){return n(d.fields||{name:d.message})}R("¡Datos personales actualizados con éxito!","success"),s()}),t.addEventListener("click",r=>{var c;if(r.target===t)return s();const l=(c=r.target.closest("[data-pf]"))==null?void 0:c.dataset.pf;l==="cancel"&&s(),l==="terms"&&Pa({onAccept:()=>{a.querySelector("#pf-terms").checked=!0,n({})}})}),a.addEventListener("input",r=>{const l=r.target;if(!l.matches(".pf-input.is-invalid"))return;l.classList.remove("is-invalid"),l.setAttribute("aria-invalid","false");const c=a.querySelector(`#pf-${l.name}-msg`);c&&(c.textContent=c.dataset.hint||"",c.classList.toggle("is-hint",!!c.dataset.hint))}),a.querySelector("#pf-alias").addEventListener("blur",r=>{const l=r.target;if(l.value=be(l.value),!l.value)return;const c=ns(l.value,ye(_.getUsers(),e.id)),d=a.querySelector("#pf-alias-msg");l.classList.toggle("is-invalid",!!c),l.setAttribute("aria-invalid",c?"true":"false"),d.textContent=c||d.dataset.hint,d.classList.toggle("is-hint",!c)}),a.querySelector("#pf-terms").addEventListener("change",()=>{a.querySelector("#pf-terms-msg").textContent="",a.querySelector(".pf-consent").classList.remove("is-invalid")}),document.addEventListener("keydown",i),requestAnimationFrame(()=>{var r;t.classList.add("active"),(r=a.querySelector("#pf-name"))==null||r.focus({preventScroll:!0})}),{close:s}}const Tl=e=>new Date(e).toLocaleDateString("es-CO",{day:"numeric",month:"short",year:"numeric"});function $t(e,t,a,i,s=""){return`<button type="button" class="vt-btn ${s}" data-action="${e}" data-id="${t}">${Z[a](15)}<span>${i}</span></button>`}function Il(e,t){const a=I(e.id),i=e.type==="free";return t?`<div class="vt-confirm" role="alert"><span>¿Eliminar y liberar el cupo?</span>
      ${$t("delete-yes",a,"check","Sí, eliminar","vt-btn-danger")}${$t("delete-no",a,"cross","No")}</div>`:`
    ${i?$t("stamp",a,"shirt","Estampar en 3D","vt-btn-primary"):""}
    ${i?$t("edit",a,"palette","Editar Arte"):""}
    ${$t("download",a,"download","Descargar HD")}
    ${i?$t("delete",a,"trash","Eliminar","vt-btn-ghost-danger"):""}`}const Dl=e=>e>=1048576?`${(e/1048576).toFixed(1)} MB`:`${Math.max(1,Math.round(e/1024))} KB`;function Pl(e){return e.hasMaster?`<span class="vt-spec" title="Archivo máster que descarga «Descargar HD»">HD ${e.masterW}×${e.masterH} px · 300 DPI · ${Dl(e.masterBytes||0)}</span>`:""}function Ol(e,t,a,i,s){const n=I(e.id),o=e.type==="free",r=o?`Gratis (${t}/${a})`:"Impreso";return`
    <article class="vt-card${o?"":" is-purchased"}" data-id="${n}">
      <div class="vt-thumb">
        <img src="${I(e.thumb||e.image)}" alt="${I(e.name)}" loading="lazy" decoding="async" />
        <span class="vt-badge ${o?"is-free":"is-printed"}">${o?"":Z.shirt(12)}${r}</span>
      </div>
      <div class="vt-meta">
        <h4 class="vt-name" title="${I(e.name)}">${I(e.name)}</h4>
        <span class="vt-date">${I(Tl(e.createdAt))} · <b class="vt-author">${I(Mt(e.authorAlias||s))}</b></span>
        ${Pl(e)}
      </div>
      <button type="button" class="vt-privacy${e.isPublic?" is-public":""}" role="switch" aria-checked="${!!e.isPublic}"
        data-action="privacy" data-id="${n}" title="${e.isPublic?"Visible en la galería comunitaria":"Solo tú puedes verlo"}">
        ${Z[e.isPublic?"globe":"lock"](15)}<span>${e.isPublic?"Público":"Privado"}</span><i class="vt-switch" aria-hidden="true"></i>
      </button>
      <div class="vt-actions">${Il(e,i)}</div>
    </article>`}function Rl({items:e,usage:t,confirmId:a,busy:i,alias:s=""}){const n=t.left<=0,o=e.filter(c=>c.type==="free").reverse(),r=Array.from({length:t.max},(c,d)=>`<i class="${d<t.free?"is-used":""}"></i>`).join(""),l=e.map(c=>Ol(c,o.indexOf(c)+1,t.max,a===c.id,s)).join("");return`
    <div class="modal-card vault-modal-card" role="dialog" aria-modal="true" aria-labelledby="vt-title">
      <div class="modal-header">
        <div class="modal-title-box">
          <span class="modal-badge">ATELIER SAFE VAULT</span>
          <h3 class="modal-title" id="vt-title">Mi Bóveda de Diseños</h3>
        </div>
        <button type="button" class="btn-close-modal" data-action="close" aria-label="Cerrar">${Z.cross(16)}</button>
      </div>
      <div class="vt-quota">
        <div class="vt-quota-text">
          <strong>Cupo de la Bóveda: ${t.free} / ${t.max} gratuitos utilizados</strong>
          <span>(+ ${t.purchased} ${t.purchased===1?"prenda impresa":"prendas impresas"}, sin límite)</span>
        </div>
        <div class="vt-pips" aria-hidden="true">${r}</div>
        <label class="vt-upload${n||i?" is-disabled":""}" for="vt-file">${Z.upload(16)}<span>${i?"Procesando…":"Subir diseño"}</span></label>
        <input type="file" id="vt-file" class="vt-file" accept="image/png,image/jpeg,image/webp,image/svg+xml" ${n||i?"disabled":""} />
      </div>
      <p class="vt-note" id="vt-note" role="status">${n?"Bóveda llena: elimina un diseño gratuito para liberar un cupo.":"Guarda logos e ilustraciones sin imprimir ni pagar. Privados por defecto."}</p>
      <div class="modal-body vt-body">
        ${e.length?`<div class="vt-grid">${l}</div>`:`
          <div class="vt-empty">${Z.vault(44)}<h4>Tu bóveda está vacía</h4>
            <p>Sube un logo o ilustración, o confirma un pedido: tus prendas impresas se archivan aquí solas.</p></div>`}
      </div>
    </div>`}const _l={googleDriveWebhookUrl:"https://script.google.com/macros/s/AKfycbwixHbpoJH0MulyLlL1SPU50V-85Y4wPdlfPag7FDnpH-U33G3FS43HO6BCovvzpBmF/exec"};async function Oa(e,t=2e4){var i;const a=(i=_l.googleDriveWebhookUrl)==null?void 0:i.trim();if(!a)return{success:!1,reason:"unconfigured"};try{const s=new AbortController,n=setTimeout(()=>s.abort(),t),o=await fetch(a,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(e),signal:s.signal});clearTimeout(n);const r=await o.json();return{success:r.status==="success",...r}}catch(s){return console.warn("[DriveUploader] Error de conexión con Webhook:",s),{success:!1,reason:"network_error",error:s.message}}}async function zl(e){const t={action:"create_order",...e},a=await Oa(t);return a.success?{success:!0,fileUrl:a.fileUrl||null,mockupUrl:a.mockupUrl||null,sheetUrl:a.sheetUrl||null,pendingCount:a.pendingCount,message:a.message||"Pedido guardado en Google Drive"}:a.code==="LIMIT_REACHED"?{success:!1,reason:"limit_reached",code:"LIMIT_REACHED",pendingCount:a.pendingCount,message:a.message}:{success:!1,reason:a.reason||"server_error",details:a}}async function Fl(e){const t={action:"upload_vault",...e},a=await Oa(t);return a.success?{success:!0,fileUrl:a.fileUrl||null,fileId:a.fileId||null,message:a.message||"Diseño sincronizado en la Bóveda de Google Drive"}:{success:!1,reason:a.reason||"server_error",details:a}}async function ui(e){const t={action:"mark_paid",...e},a=await Oa(t);return a.success?{success:!0,newStatus:a.newStatus||"proof_submitted",proofUrl:a.proofUrl||null,message:a.message||"Pago registrado en la nube"}:{success:!1,reason:a.reason||"server_error",details:a}}const hi="vault-modal-overlay",pi={no_slots:"Bóveda llena: elimina un diseño gratuito para liberar un cupo.",storage_full:"El navegador no tiene espacio. Elimina diseños o pedidos antiguos e inténtalo de nuevo."};function Ps({router:e=null}={}){var y;if(!_.getCurrentUser())return null;(y=document.getElementById(hi))==null||y.remove();const t={confirmId:null,busy:!1},a=document.createElement("div");a.id=hi,a.className="modal-overlay vault-overlay",document.body.appendChild(a);const i=()=>_.getCurrentUser(),s=v=>{var w;return sa((w=i())==null?void 0:w.id).find(b=>b.id===v)},n=v=>{v.key==="Escape"&&o()};function o(){document.removeEventListener("keydown",n),l(),a.classList.remove("active"),setTimeout(()=>a.remove(),220)}function r(){var x;const v=i();if(!v)return o();const w=((x=a.querySelector(".vt-body"))==null?void 0:x.scrollTop)||0;a.innerHTML=Rl({items:sa(v.id),usage:De(v.id),confirmId:t.confirmId,busy:t.busy,alias:v.alias});const b=a.querySelector(".vt-body");b&&(b.scrollTop=w)}const l=_.subscribe(r),c=()=>{var v;e&&!e.isStudioOpen&&((v=e.openStudio)==null||v.call(e))},d=(v,w="error")=>R(v,w,4500);async function g(v){var w;if(!(!v||t.busy)){t.busy=!0,r();try{const b=await br(v),x=Ma(),E=await Aa(x,b.master),S=Ca({id:x,userId:i().id,type:"free",name:v.name.replace(/\.[^/.]+$/,""),authorAlias:i().alias,ownerName:String(i().name||"").split(" ")[0],image:b.image,thumb:b.thumb,...E});S.ok?(Fl({designId:x,designName:v.name.replace(/\.[^/.]+$/,""),userAlias:i().alias,userEmail:i().email,userId:i().id,image:b.image,dimensions:`${E.masterW||b.width||0}x${E.masterH||b.height||0}`,isPublic:!1}).catch(M=>console.warn("[VaultCloud] Sync diferido:",M)),(w=b.master)!=null&&w.clamped?d(`Guardado a 300 DPI reales: reducimos tu imagen de ${b.master.from.w}×${b.master.from.h} px a ${E.masterW}×${E.masterH} px.`,"success"):d(E.hasMaster?"Diseño guardado en tu bóveda a 300 DPI (privado).":"Diseño guardado (copia reducida: tu navegador no permite archivos grandes).",E.hasMaster?"success":"info")):(Sa(x),d(pi[S.error]||"No se pudo guardar el diseño."))}catch(b){d(b.message)}t.busy=!1,r()}}async function p(v){var x;const w=await si(v),b=C.getState().activeZone;lt(b,{name:v.name,src:v.image,imageElement:w}),d(`¡"${v.name}" aplicado en ${((x=ht[b])==null?void 0:x.name)||b}!`,"success"),o(),c()}async function h(v){const w=await si(v);o(),La().open(w,v.name,async(b,x,E)=>{lt(C.getState().activeZone,{name:E||v.name,src:b,imageElement:x}),c();try{await ri(v.id,b)}catch{}d("Arte retocado y actualizado en tu bóveda.","success")},{onReplace:async b=>{const x=await ri(v.id,b);return x.ok?{ok:!0,message:"Arte reemplazado en tu Bóveda (máster 300 DPI actualizado)."}:x}})}function u(v){if(!v.isPublic&&i().termsVersion!==Zt){d("Para publicar un diseño acepta los Términos y declara su titularidad en tu perfil."),o(),Ds();return}const b=Fr(v.id,i().alias);if(!b.ok)return d(pi.storage_full);d(b.item.isPublic?"Ahora es público: aparece en la galería comunitaria.":"Ahora es privado.","info"),r()}const m={close:o,stamp:v=>p(v),edit:v=>h(v),privacy:u,download:async v=>{const w=await Hr(v);w.kind==="master"?d(`Descargando el máster a 300 DPI (${(w.bytes/1048576).toFixed(1)} MB).`,"success"):d("Tu navegador ya no tiene el archivo máster: se descargó la copia reducida.","info")},delete:v=>{t.confirmId=v.id,r()},"delete-no":()=>{t.confirmId=null,r()},"delete-yes":v=>{t.confirmId=null;const w=Br(v.id);d(w.ok?"Diseño eliminado. Cupo liberado.":"No se pudo eliminar este diseño.",w.ok?"success":"error"),r()}};a.addEventListener("click",v=>{var x;if(v.target===a)return o();const w=v.target.closest("[data-action]");if(!w)return;const b=w.dataset.id?s(w.dataset.id):null;w.dataset.id&&!b||(x=m[w.dataset.action])==null||x.call(m,b)}),a.addEventListener("change",v=>{v.target.id==="vt-file"&&(g(v.target.files[0]),v.target.value="")}),a.addEventListener("dragover",v=>v.preventDefault()),a.addEventListener("drop",v=>{v.preventDefault(),v.target.closest(".vault-modal-card")&&g(v.dataTransfer.files[0])}),document.addEventListener("keydown",n);const f=i();return Pe(f).filter(v=>{var w;return v.userId===f.id||((w=v.customer)==null?void 0:w.email)===f.email}).forEach(v=>{us({...v,userId:f.id}).then(w=>{w.ok&&!w.existed&&a.isConnected&&r()})}),r(),requestAnimationFrame(()=>a.classList.add("active")),{close:o}}const pe="Comunidad";function ql(){return ds().map(e=>({id:`vault-${e.id}`,community:!0,title:e.name,category:pe,badge:"COMUNIDAD",tagColor:"#06b6d4",imageSrc:e.image,thumb:e.thumb||e.image,authorAlias:e.authorAlias||"",createdAt:e.createdAt||"",author:e.authorAlias?Mt(e.authorAlias):"@comunidad",visibility:"Público",description:"Diseño compartido por la comunidad. Pruébalo en tu camiseta con un clic."}))}const Bl=e=>e.community?`${e.title} • por ${e.author}`:e.title;function Nl(e){return`
    <div class="card-reported-veil" role="status">
      <span class="veil-title">🚩 Contenido reportado</span>
      <small>Oculto preventivamente mientras se revisa.</small>
      ${bs(e)?`<button type="button" class="btn-reveal-reported" data-drop-id="${I(e)}">Mostrar de todos modos</button>`:""}
    </div>`}function Ul(e){if(e.thumb)return e.thumb;const t=e.imageSrc||"";return t.includes("lh3.googleusercontent.com/d/")&&!t.includes("=s")?`${t}=s220-rw`:t.includes("/assets/drops/")?t.replace("/assets/drops/","/assets/drops/thumbs/").replace(".png",".webp"):t}function Os(e){const t=ft.find(c=>c.id===e.decalPresetId),a=I(e.id),i=I(Bl(e)),s=vs(e.id),n=!!Ta(e.id),o=Ul(e),r=e.imageSrc?`<img src="${I(o)}" alt="${i}" class="card-artwork-png" width="155" height="155" loading="lazy" decoding="async" />`:t?`<div class="card-artwork-svg">${t.svg}</div>`:"",l=e.community?"👕 Estampar en 3D":"🚀 Probar en Estudio 3D";return`
    <div class="lookbook-card${e.community?" is-community":""}${s?" is-reported":""}" data-drop-id="${a}">
      <div class="card-visual-wrapper">
        <span class="card-badge" style="border-color: ${e.tagColor}; color: ${e.tagColor};">${I(e.badge)}</span>
        <span class="card-author-chip">${I(e.author||"@comunidad")}</span>
        <div class="card-artwork-frame">
          <div class="card-artwork-ambient" style="background: radial-gradient(circle, ${e.tagColor}40 0%, transparent 70%);"></div>
          <div class="card-artwork-container">${r}</div>
        </div>
        ${s?Nl(e.id):""}
      </div>
      <div class="card-content-box">
        <div class="card-meta-line">
          <span class="card-category">${I(e.category)}</span>
          <span class="card-visibility-pill">${I(e.visibility||"Público")}</span>
        </div>
        <h3 class="card-title">${i}</h3>
        <p class="card-desc">${I(e.description)}</p>
        <button type="button" class="btn-load-preset" data-drop-id="${a}"${s?" disabled":""}>
          <span>${l}</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <button type="button" class="btn-report-design" data-drop-id="${a}"${n?" disabled":""}
          title="${n?"Ya reportaste este diseño":"Avisar de contenido indebido"}">${n?"🚩 Reportado":"🚩 Reportar"}</button>
      </div>
    </div>`}const la=[{id:"skeleton-savage",title:"Bone Savage • Muscle Skull",category:"Streetwear",shirtColor:"#111215",badge:"DROP DESTACADO",tagColor:"#ea580c",thumb:"https://lh3.googleusercontent.com/d/15nQGYKZFfLBV6lHtJFrQFVKIHXkrrevM=s220-rw",imageSrc:"https://lh3.googleusercontent.com/d/15nQGYKZFfLBV6lHtJFrQFVKIHXkrrevM",driveFileId:"15nQGYKZFfLBV6lHtJFrQFVKIHXkrrevM",author:"@skull_atelier",visibility:"Público",description:"Ilustración anatómica visceral en alto contraste lista para estampado DTF frontal."},{id:"goku-saiyan",title:"Son Goku • Super Saiyan Aura",category:"Anime",shirtColor:"#874438",badge:"ANIME SPECIAL",tagColor:"#eab308",thumb:"https://lh3.googleusercontent.com/d/1IN07QjaMZNDkYD6Gvapuz6o8M_xPfz2N=s220-rw",imageSrc:"https://lh3.googleusercontent.com/d/1IN07QjaMZNDkYD6Gvapuz6o8M_xPfz2N",driveFileId:"1IN07QjaMZNDkYD6Gvapuz6o8M_xPfz2N",author:"@dbz_crew",visibility:"Público",description:"Ilustración anime de poder y aura dorada Super Saiyan en impresión textil HD."},{id:"rick-morty-portal",title:"Multiverse Portal • Streetwear",category:"Series & Pop",shirtColor:"#111215",badge:"CULT DROP",tagColor:"#22c55e",thumb:"https://lh3.googleusercontent.com/d/15R9LqVE4bGMq_cCDkDmLHIsQOMu_tbqv=s220-rw",imageSrc:"https://lh3.googleusercontent.com/d/15R9LqVE4bGMq_cCDkDmLHIsQOMu_tbqv",driveFileId:"15R9LqVE4bGMq_cCDkDmLHIsQOMu_tbqv",author:"@portal_lab",visibility:"Público",description:"Rick y Morty urbanos con portal interdimensional en gradientes neón Ultra HD."},{id:"cyber-oni",title:"Neo-Tokyo • Mecha Oni Mask",category:"Cyberpunk",shirtColor:"#3d434f",badge:"CYBER SPECIAL",tagColor:"#f43f5e",thumb:"https://lh3.googleusercontent.com/d/13C2axodIDclMhEbkw5LRdXtE5zs2NncK=s220-rw",imageSrc:"https://lh3.googleusercontent.com/d/13C2axodIDclMhEbkw5LRdXtE5zs2NncK",driveFileId:"13C2axodIDclMhEbkw5LRdXtE5zs2NncK",author:"@tokyo_forge",visibility:"Público",description:"Máscara samurai cibernética con circuitos carmesí y cian para prendas streetwear oscuras."},{id:"vintage-wolf",title:"Gentleman Wolf • Top Hat",category:"Streetwear",shirtColor:"#874438",badge:"VINTAGE DROP",tagColor:"#a855f7",thumb:"https://lh3.googleusercontent.com/d/1iz1wslhD_wU3mTwD-BcTxGZuTgOAEYYb=s220-rw",imageSrc:"https://lh3.googleusercontent.com/d/1iz1wslhD_wU3mTwD-BcTxGZuTgOAEYYb",driveFileId:"1iz1wslhD_wU3mTwD-BcTxGZuTgOAEYYb",author:"@lupus_tailor",visibility:"Público",description:"Lobo gentleman musculoso con sombrero de copa en estética vintage urbana limpia."},{id:"shadow-mage",title:"Shadow Mage • Mystic Hood",category:"Fantasy",shirtColor:"#111215",badge:"DARK FANTASY",tagColor:"#38bdf8",thumb:"https://lh3.googleusercontent.com/d/1WVP0Z4YqUTzYcS1UccQiTprPNqRJxZgk=s220-rw",imageSrc:"https://lh3.googleusercontent.com/d/1WVP0Z4YqUTzYcS1UccQiTprPNqRJxZgk",driveFileId:"1WVP0Z4YqUTzYcS1UccQiTprPNqRJxZgk",author:"@arcane_roots",visibility:"Público",description:"Mago sombrío 3D con ojos luminosos dorados y túnica de cuero artesanal con cuernos."},{id:"samurai-sun",title:"Blood Sun • Ronin Armor",category:"Streetwear",shirtColor:"#111215",badge:"RONIN SPECIAL",tagColor:"#ef4444",thumb:"https://lh3.googleusercontent.com/d/1l-bt9KgnlKoei8DrDovaLOMajC656IyF=s220-rw",imageSrc:"https://lh3.googleusercontent.com/d/1l-bt9KgnlKoei8DrDovaLOMajC656IyF",driveFileId:"1l-bt9KgnlKoei8DrDovaLOMajC656IyF",author:"@kyoto_rebel",visibility:"Público",description:"Guerrero samurai dorado con katana frente al sol naciente escarlata en salpicadura."},{id:"kenshin-blade",title:"Battōjutsu • Crimson Blade",category:"Anime",shirtColor:"#874438",badge:"ANIME ICON",tagColor:"#f97316",thumb:"https://lh3.googleusercontent.com/d/1LphRsriTTPelA-wXkW7LmAaZwyqqBQl0=s220-rw",imageSrc:"https://lh3.googleusercontent.com/d/1LphRsriTTPelA-wXkW7LmAaZwyqqBQl0",driveFileId:"1LphRsriTTPelA-wXkW7LmAaZwyqqBQl0",author:"@shogun_draw",visibility:"Público",description:"Espadachín legendario en postura battōjutsu con kimono carmesí y katana desenfundada."},{id:"spiderman-leap",title:"Web Crawler • Dynamic Leap",category:"Series & Pop",shirtColor:"#3d434f",badge:"HERO DROP",tagColor:"#0ea5e9",thumb:"https://lh3.googleusercontent.com/d/1w8MZ6bV-OTbNj2DLJVn6uqckSIItHaBU=s220-rw",imageSrc:"https://lh3.googleusercontent.com/d/1w8MZ6bV-OTbNj2DLJVn6uqckSIItHaBU",driveFileId:"1w8MZ6bV-OTbNj2DLJVn6uqckSIItHaBU",author:"@queens_vault",visibility:"Público",description:"Spider-Man en salto acrobático con perspectiva frontal de alto dinamismo."},{id:"ironman-repulsor",title:"Arc Repulsor • Gold & Red",category:"Series & Pop",shirtColor:"#111215",badge:"MECHA HERO",tagColor:"#eab308",thumb:"https://lh3.googleusercontent.com/d/1jxdj8FY0VMQJIKTFw5WQFmZcWBMvYO1Z=s220-rw",imageSrc:"https://lh3.googleusercontent.com/d/1jxdj8FY0VMQJIKTFw5WQFmZcWBMvYO1Z",driveFileId:"1jxdj8FY0VMQJIKTFw5WQFmZcWBMvYO1Z",author:"@stark_lab",visibility:"Público",description:"Armadura biónica con pulso repulsor cargado en pose de impacto lista para DTF."},{id:"musashi-ink",title:"Musashi • Sumi-e Brush",category:"Streetwear",shirtColor:"#ede9e0",badge:"INK ART",tagColor:"#64748b",thumb:"https://lh3.googleusercontent.com/d/16HUimWYBaa5CUnblbpikOrtZOaZvMJrU=s220-rw",imageSrc:"https://lh3.googleusercontent.com/d/16HUimWYBaa5CUnblbpikOrtZOaZvMJrU",driveFileId:"16HUimWYBaa5CUnblbpikOrtZOaZvMJrU",author:"@vagabond_ink",visibility:"Público",description:"Silueta samurai en caligrafía sumi-e japonesa con doble katana de alta elegancia."},{id:"astronaut-cosmic",title:"Deep Cosmos • Spaceman",category:"Streetwear",shirtColor:"#111215",badge:"COSMIC VIBE",tagColor:"#06b6d4",thumb:"https://lh3.googleusercontent.com/d/1dKJXvpMOgE6izwuU7fI3dckyUYmIFHzg=s220-rw",imageSrc:"https://lh3.googleusercontent.com/d/1dKJXvpMOgE6izwuU7fI3dckyUYmIFHzg",driveFileId:"1dKJXvpMOgE6izwuU7fI3dckyUYmIFHzg",author:"@orbit_studios",visibility:"Público",description:"Astronauta retro con visor de cristal cian y traje de exploración profunda."}],He={},je="shirt_studio_jwt_token",Hl=(typeof window<"u"&&window.__API_BASE_URL__||typeof import.meta<"u"&&(He==null?void 0:He.VITE_API_URL)||(typeof window<"u"&&window.location.hostname==="localhost"?"":"https://api-camisas.onrender.com")).replace(/\/$/,""),jl={getToken(){try{return localStorage.getItem(je)||null}catch{return null}},setToken(e){try{e?localStorage.setItem(je,e):localStorage.removeItem(je)}catch{}},async request(e,t={}){const a={"Content-Type":"application/json",...t.headers||{}},i=this.getToken();i&&(a.Authorization=`Bearer ${i}`);const s=e.startsWith("http")?e:`${Hl}${e}`,n=await fetch(s,{...t,headers:a}),o=await n.json().catch(()=>null);if(!n.ok){const r=(o==null?void 0:o.error)||`Error HTTP ${n.status}`,l=new Error(r);throw l.status=n.status,l.data=o,l}return o},async register({email:e,password:t,displayName:a}){const i=await this.request("/api/auth/register",{method:"POST",body:JSON.stringify({email:e,password:t,displayName:a})});return i!=null&&i.token&&this.setToken(i.token),i},async login({email:e,password:t}){const a=await this.request("/api/auth/login",{method:"POST",body:JSON.stringify({email:e,password:t})});return a!=null&&a.token&&this.setToken(a.token),a},async getMe(){return this.request("/api/auth/me")},logout(){this.setToken(null)},async saveDesign(e){return this.request("/api/designs",{method:"POST",body:JSON.stringify(e)})},async getMyDesigns({q:e=""}={}){const t=e?`?q=${encodeURIComponent(e)}`:"";return this.request(`/api/designs${t}`)},async getDesignById(e){return this.request(`/api/designs/${e}`)},async deleteDesign(e){return this.request(`/api/designs/${e}`,{method:"DELETE"})},async getGallery({limit:e=20,offset:t=0,sort:a="recent",q:i="",gender:s=""}={}){const n=new URLSearchParams({limit:e,offset:t,sort:a});return i&&n.set("q",i),s&&n.set("gender",s),this.request(`/api/gallery?${n.toString()}`)},async toggleLike(e){return this.request(`/api/gallery/${e}/like`,{method:"POST"})},async registerDriveAsset(e){return this.request("/api/upload-link",{method:"POST",body:JSON.stringify(e)})},async getMyDriveAssets(){return this.request("/api/upload-link/my-assets")},async getUnlinkedAssets(){return this.request("/api/admin/unlinked-assets")},async getAssetsComparison(){return this.request("/api/admin/assets-comparison")},async purgeAssetRecord(e){return this.request(`/api/admin/purge-asset-record/${e}`,{method:"DELETE"})}},Rs=4;let ca=[];function Vl(e){return e?e.includes("lh3.googleusercontent.com/d/")&&!e.includes("=s")?`${e}=s220-rw`:e:""}async function Gl(){try{const e=await jl.getGallery({limit:50,sort:"recent"});if(e&&Array.isArray(e.designs)&&e.designs.length>0){const t=e.designs.map(a=>{const i=la.findIndex(n=>n.imageSrc===a.previewImageUrl||n.title===a.title),s=i!==-1?la[i]:null;return{id:`db-${a.id}`,title:a.title,category:(s==null?void 0:s.category)||"Streetwear",shirtColor:a.shirtColor||(s==null?void 0:s.shirtColor)||"#111215",badge:(s==null?void 0:s.badge)||"DROP DESTACADO",tagColor:(s==null?void 0:s.tagColor)||"#00f0ff",imageSrc:a.previewImageUrl,thumb:(s==null?void 0:s.thumb)||Vl(a.previewImageUrl),author:(s==null?void 0:s.author)||(a.authorName?`@${a.authorName}`:"@imprnt_lab"),visibility:"Público",likesCount:a.likesCount,description:(s==null?void 0:s.description)||"Diseño exclusivo listo para estampar en DTF Ultra HD.",_orderIdx:i!==-1?i:-1}});t.sort((a,i)=>a._orderIdx===-1&&i._orderIdx===-1?0:a._orderIdx===-1?-1:i._orderIdx===-1?1:a._orderIdx-i._orderIdx),ca=t,window.dispatchEvent(new CustomEvent("vault:changed"))}}catch(e){console.warn("[Gallery] Usando catálogo oficial de Google Drive:",e.message)}}typeof window<"u"&&setTimeout(Gl,150);const we=()=>{const e=ca.length>0?ca:la;return[...ql(),...e]},Yl=(e=Rs)=>{const t=we();return typeof e=="number"?t.slice(0,e):t},_s=e=>we().find(t=>String(t.id)===String(e)),mi="report-content-modal",Xl=e=>`
  <label class="rp-opt${e.zero?" is-zero":""}" data-cat="${e.id}">
    <input type="radio" name="rp-category" value="${e.id}" />
    <span class="rp-icon" aria-hidden="true">${e.icon}</span>
    <span class="rp-text"><b>${I(e.label)}</b><small>${I(e.hint)}</small></span>
  </label>`;function Wl(e){const t=Mt(String(e.authorAlias||e.author||"").replace(/^@+/,""))||"@comunidad";return`
    <div class="modal-card report-card" role="dialog" aria-modal="true" aria-labelledby="rp-title">
      <div class="modal-header">
        <div class="modal-title-box">
          <span class="modal-badge">MODERACIÓN DE CONTENIDO</span>
          <h3 class="modal-title" id="rp-title">🚩 Reportar este diseño</h3>
        </div>
        <button type="button" class="btn-close-modal" data-rp="close" aria-label="Cerrar">✕</button>
      </div>
      <div class="modal-body rp-body">
        <p class="rp-target">Diseño: <strong>${I(e.title)}</strong> · por <b>${I(t)}</b></p>
        <div class="rp-options" role="radiogroup" aria-label="Motivo del reporte">${ps.map(Xl).join("")}</div>
        <label class="rp-details" for="rp-details">
          <span id="rp-details-label">Descripción (opcional)</span>
          <textarea id="rp-details" maxlength="${na}" rows="3" placeholder="Añade contexto que ayude a revisar el diseño…"></textarea>
          <small class="rp-count"><span id="rp-count">0</span>/${na}</small>
        </label>
        <p class="rp-error" id="rp-error" role="alert" hidden></p>
        <p class="rp-note">El diseño se oculta para ti de inmediato. Para que el equipo lo revise más rápido, puedes avisar también por WhatsApp.</p>
      </div>
      <div class="modal-footer rp-footer">
        <button type="button" class="btn-secondary" data-rp="close">Cancelar</button>
        <button type="button" class="rp-submit" data-rp="submit">Enviar reporte</button>
        <button type="button" class="rp-whatsapp" data-rp="whatsapp">💬 Reportar y avisar por WhatsApp</button>
      </div>
    </div>`}function Zl(e,{onDone:t}={}){var h;if(!(e!=null&&e.id))return null;(h=document.getElementById(mi))==null||h.remove();const a=document.activeElement,i=document.createElement("div");i.id=mi,i.className="modal-overlay report-overlay",i.innerHTML=Wl(e),document.body.appendChild(i);const s=u=>i.querySelector(u),n={category:""},o=s("#rp-details"),r=s("#rp-error");function l(){var u;document.removeEventListener("keydown",c,!0),i.classList.remove("active"),setTimeout(()=>i.remove(),200),a!=null&&a.isConnected&&((u=a.focus)==null||u.call(a))}function c(u){if(u.key==="Escape")u.stopPropagation(),l();else if(u.key==="Tab"){const m=[...i.querySelectorAll("input, textarea, button")].filter(v=>!v.disabled&&v.offsetParent!==null);if(!m.length)return;const f=m[0],y=m[m.length-1];u.shiftKey&&(document.activeElement===f||!i.contains(document.activeElement))?(u.preventDefault(),y.focus()):!u.shiftKey&&document.activeElement===y&&(u.preventDefault(),f.focus())}}function d(u){n.category=u,i.querySelectorAll(".rp-opt").forEach(m=>m.classList.toggle("is-selected",m.dataset.cat===u)),s("#rp-details-label").textContent=u==="other"?`Descripción (obligatoria, mín. ${oa} caracteres)`:"Descripción (opcional)",g("")}function g(u){r.hidden=!u,r.textContent=u}function p(u){var v;const m={category:n.category,details:o.value},f=fs(m);if(f){g(f),(n.category?o:s(".rp-opt input")).focus();return}const y=Kr({designId:e.id,title:e.title,authorAlias:e.authorAlias||e.author||"",reporterId:(v=_.getCurrentUser())==null?void 0:v.id,...m});if(!y.ok){g(y.error);return}u&&window.open(el(y.report),"_blank","noopener,noreferrer"),R("Reporte enviado. El diseño quedó oculto para ti mientras se revisa.","success",4500),l(),t==null||t(y.report)}return i.addEventListener("change",u=>{u.target.name==="rp-category"&&d(u.target.value)}),i.addEventListener("input",u=>{u.target===o&&(s("#rp-count").textContent=String(o.value.length),g(""))}),i.addEventListener("click",u=>{var f;if(u.target===i)return l();const m=(f=u.target.closest("[data-rp]"))==null?void 0:f.dataset.rp;m==="close"?l():m==="submit"?p(!1):m==="whatsapp"&&p(!0)}),document.addEventListener("keydown",c,!0),requestAnimationFrame(()=>{var u;i.classList.add("active"),(u=s(".rp-opt input"))==null||u.focus()}),{close:l}}function Ql(e){if(e.shirtColor){const t=Pt.find(a=>a.hex.toLowerCase()===e.shirtColor.toLowerCase());t&&ge(t)}if(e.imageSrc)Ot(e.imageSrc).then(t=>lt("front",{name:e.title,src:e.imageSrc,imageElement:t})).catch(()=>{});else if(e.decalPresetId){const t=ft.find(a=>a.id===e.decalPresetId);if(t){const a=Me(t.svg),i=new Image;i.onload=()=>lt("front",{name:t.name,src:a,imageElement:i}),i.src=a}}window.location.hash="#estudio"}function zs(e,t){e.addEventListener("click",a=>{const i=a.target.closest(".btn-load-preset, .btn-report-design, .btn-reveal-reported");if(!i||i.disabled||!e.contains(i))return;a.preventDefault();const s=t(i.getAttribute("data-drop-id"));s&&(i.classList.contains("btn-load-preset")?Ql(s):i.classList.contains("btn-report-design")?Zl(s):tl(s.id))})}const Jl={isStudioOpen:!1,openStudio(){window.location.hash="#estudio"}};function Kl(e){if(!e)return;function t(){var n;const s=Yl(Rs);e.innerHTML=`
      <section class="lookbook-section" id="trabajos">
        <div class="landing-container">
          <div class="section-header-box">
            <span class="section-eyebrow">BIBLIOTECA COMUNITARIA & DROPS DTF</span>
            <h2 class="section-title">Explora Estilos y Tendencias</h2>
            <p class="section-description">
              Diseños listos para estampar en DTF Ultra HD. Elige cualquier drop de la biblioteca abierta, pruébalo en el Estudio 3D o sube tu diseño gratis (Público o Privado).
            </p>
          </div>

          <div class="lookbook-toolbar-row">
            <span class="lookbook-latest-label">🔥 Diseños Destacados Listos para Estampar</span>
            <button type="button" class="btn-community-upload" id="btn-community-drop" title="Sube tu arte y compártelo o úsalo privado">
              <span>✨ Subir a Biblioteca</span>
              <span class="btn-drop-subtag">(Público / Privado)</span>
            </button>
          </div>

          <div class="lookbook-grid has-gallery-cta">${s.map(Os).join("")}</div>

          <div class="lookbook-gallery-cta">
            <a href="#galeria" class="btn-gallery-cta" data-action="open-gallery">Ver Más Diseños →</a>
          </div>
        </div>
      </section>
    `,(n=e.querySelector("#btn-community-drop"))==null||n.addEventListener("click",()=>{if(!_.isAuthenticated()){Qt.open("login");return}Ps({router:Jl})})}zs(e,_s),t();let a=0;const i=()=>{clearTimeout(a),a=setTimeout(t,60)};window.addEventListener("vault:changed",i),window.addEventListener("reports:changed",i),window.addEventListener("storage",s=>{(!s.key||s.key==="shirt_user_vault_db"||s.key==="shirt_reported_content")&&i()})}function xe(e,t=!1){document.documentElement.setAttribute("data-theme",e),document.body.setAttribute("data-theme",e),localStorage.setItem("shirt_studio_theme",e),localStorage.setItem("theme",e),window.dispatchEvent(new CustomEvent("themechange",{detail:{theme:e}}));const a=e==="dark",i=a?`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>`:`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>`;document.querySelectorAll(".btn-theme-toggle").forEach(s=>{s.innerHTML=i,s.setAttribute("title",a?"Cambiar a Modo Claro":"Cambiar a Modo Oscuro")}),t&&R(e==="dark"?"Modo Oscuro activado 🌙":"Modo Claro activado ☀️","info")}function tc(){const e=localStorage.getItem("shirt_studio_theme")||localStorage.getItem("theme")||"dark";xe(e,!1),document.addEventListener("click",t=>{if(t.target.closest(".btn-theme-toggle")){const s=(document.documentElement.getAttribute("data-theme")||"dark")==="dark"?"light":"dark";xe(s,!0)}})}const Fs="shirt_feedback_inbox",ec=20,ac=[{id:"sugerencia",icon:"💡",label:"Sugerencia"},{id:"queja",icon:"⚠️",label:"Queja / Reclamo"},{id:"felicitacion",icon:"⭐",label:"Felicitación"},{id:"consulta",icon:"❓",label:"Consulta"}],qs=["","Deficiente","Regular","Bueno","Muy Bueno","¡Excelente!"];function ic(){try{const e=JSON.parse(localStorage.getItem(Fs)||"[]");return Array.isArray(e)?e:[]}catch{return[]}}function sc(e){const t={...e,id:`FB-${Date.now().toString(36).toUpperCase()}`,createdAt:new Date().toISOString()},a=[t,...ic()].slice(0,ec),i=[a,a.map((s,n)=>n===0?s:{...s,attachment:""}),a.map(s=>({...s,attachment:""})),a.slice(0,5).map(s=>({...s,attachment:""}))];for(const s of i)try{return localStorage.setItem(Fs,JSON.stringify(s)),t}catch{}return null}const nc=10*1024*1024,oc=1280,rc=.78;function lc(e){return e?e.type.startsWith("image/")?e.size>nc?{ok:!1,error:"La imagen supera los 10 MB. Sube un pantallazo más liviano."}:{ok:!0}:{ok:!1,error:"El comprobante debe ser una imagen (JPG, PNG o WEBP)."}:{ok:!1,error:"No seleccionaste ningún archivo."}}function cc(e){return new Promise((t,a)=>{const i=new FileReader;i.onload=()=>t(i.result),i.onerror=()=>a(new Error("No se pudo leer la imagen.")),i.readAsDataURL(e)})}function dc(e){return new Promise((t,a)=>{const i=new Image;i.onload=()=>t(i),i.onerror=()=>a(new Error("El archivo no es una imagen válida.")),i.src=e})}async function Bs(e){const t=lc(e);if(!t.ok)throw new Error(t.error);const a=await dc(await cc(e)),i=Math.min(1,oc/Math.max(a.naturalWidth,a.naturalHeight)),s=document.createElement("canvas");s.width=Math.max(1,Math.round(a.naturalWidth*i)),s.height=Math.max(1,Math.round(a.naturalHeight*i));const n=s.getContext("2d");return n.fillStyle="#ffffff",n.fillRect(0,0,s.width,s.height),n.drawImage(a,0,0,s.width,s.height),s.toDataURL("image/jpeg",rc)}function uc(){return`
    <div class="form-field-group">
      <label class="form-field-label">Captura de pantalla <span class="fb-optional">(Opcional)</span></label>
      <div class="fb-drop" id="fb-drop" tabindex="0" role="button" aria-label="Adjuntar captura de pantalla">
        <input type="file" id="fb-file" accept="image/*" hidden>
        <div class="fb-drop-empty" id="fb-drop-empty">
          <span class="fb-drop-icon">🖼️</span>
          <span><strong>Arrastra una captura</strong> o toca para elegirla</span>
        </div>
        <div class="fb-drop-preview" id="fb-drop-preview" hidden>
          <img id="fb-drop-img" alt="Vista previa de la captura adjunta">
          <span class="fb-drop-name" id="fb-drop-name"></span>
          <button type="button" class="fb-drop-remove" id="fb-drop-remove" aria-label="Quitar captura">✕</button>
        </div>
      </div>
    </div>`}function hc(e){const t=l=>e.querySelector(l),a=t("#fb-drop"),i=t("#fb-file"),s={dataUrl:"",name:""},n=()=>{const l=!!s.dataUrl;t("#fb-drop-empty").hidden=l,t("#fb-drop-preview").hidden=!l,a.classList.toggle("has-file",l),l&&(t("#fb-drop-img").src=s.dataUrl,t("#fb-drop-name").textContent=s.name)},o=()=>{s.dataUrl="",s.name="",i.value="",n()};async function r(l){if(l)try{s.dataUrl=await Bs(l),s.name=l.name||"captura.jpg",n()}catch(c){R(c.message||"No se pudo adjuntar la imagen.","error")}}return a.addEventListener("click",l=>{if(l.target.closest("#fb-drop-remove")){l.stopPropagation(),o();return}i.click()}),a.addEventListener("keydown",l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),i.click())}),i.addEventListener("click",l=>l.stopPropagation()),i.addEventListener("change",()=>r(i.files[0])),["dragenter","dragover"].forEach(l=>a.addEventListener(l,c=>{c.preventDefault(),a.classList.add("is-over")})),["dragleave","drop"].forEach(l=>a.addEventListener(l,c=>{c.preventDefault(),a.classList.remove("is-over")})),a.addEventListener("drop",l=>{var c,d;return r((d=(c=l.dataTransfer)==null?void 0:c.files)==null?void 0:d[0])}),{get:()=>s.dataUrl?{...s}:null,clear:o}}const pc=`
  <div class="section-header-box">
    <span class="section-eyebrow">ATENCIÓN & MEJORA CONTINUA</span>
    <h2 class="section-title">Buzón de Sugerencias & Retroalimentación</h2>
    <p class="section-description">
      Tu voz impulsa cada corte y estampado. Comparte tus sugerencias, dudas o quejas para seguir perfeccionando nuestras prendas y servicio.
    </p>
  </div>`,mc=e=>[1,2,3,4,5].map(t=>`
  <button type="button" class="rating-star-btn ${t<=e?"active":""}" data-star="${t}" aria-label="${t} de 5">★</button>`).join("");function gc({type:e,rating:t}){return`
    <section class="feedback-section" id="sugerencias" aria-label="Buzón de Quejas y Sugerencias">
      <div class="landing-container">
        ${pc}
        <div class="feedback-card-wrapper">
          <div class="fb-account" id="fb-account"></div>
          <div class="feedback-types-nav">
            ${ac.map(a=>`
              <button type="button" class="feedback-type-btn ${e===a.id?"active":""}" data-type="${a.id}">
                <span>${a.icon}</span><span>${a.label}</span>
              </button>`).join("")}
          </div>
          <form class="feedback-form-grid" id="feedback-form" novalidate>
            <div class="form-row-dual">
              <div class="form-field-group">
                <label class="form-field-label" for="fb-name">Nombre o Apodo *</label>
                <input type="text" class="form-field-input" id="fb-name" placeholder="Tu nombre" autocomplete="name" maxlength="80">
              </div>
              <div class="form-field-group">
                <label class="form-field-label" for="fb-contact">Email o Celular *</label>
                <input type="text" class="form-field-input" id="fb-contact" placeholder="Ej: usuario@correo.com o +57 300 123 4567" autocomplete="email" maxlength="80">
              </div>
            </div>
            <div class="form-row-dual">
              <div class="form-field-group" id="fb-order-group">
                <label class="form-field-label" for="fb-order">Pedido <span class="fb-optional">(Opcional)</span></label>
                <input type="text" class="form-field-input" id="fb-order" placeholder="Ej: ORD-1A2B o 'Sin pedido aún'" maxlength="30">
              </div>
              <div class="form-field-group">
                <label class="form-field-label">Calificación</label>
                <div class="star-rating-box" id="star-box">
                  ${mc(t)}
                  <span class="rating-label-hint" id="rating-hint">${qs[t]}</span>
                </div>
              </div>
            </div>
            <div class="form-field-group">
              <label class="form-field-label" for="fb-message">Mensaje o Detalle *</label>
              <textarea class="form-field-textarea" id="fb-message" rows="4" maxlength="1200" placeholder="Escribe aquí tu sugerencia, queja o mensaje con el mayor detalle posible..."></textarea>
            </div>
            ${uc()}
            <p class="fb-error" id="fb-error" role="alert" hidden></p>
            <div class="feedback-actions-row">
              <button type="submit" class="btn-submit-feedback"><span>📨 Enviar Mensaje al Soporte</span></button>
            </div>
            <p class="fb-note">Tu reporte o sugerencia se envía directamente a nuestro sistema para ser gestionado por el equipo de soporte.</p>
          </form>
        </div>
      </div>
    </section>`}function fc({entry:e,saved:t}){const a=t?"Tu mensaje ha sido registrado exitosamente en nuestro sistema de atención. Nuestro equipo de soporte lo revisará en el panel administrativo.":"Tu reporte ha sido procesado y registrado para revisión por el equipo técnico.",i=e.attachmentName?`<p class="fb-success-shot">🖼️ Archivo adjunto: <strong>${I(e.attachmentName)}</strong> vinculado al reporte.</p>`:"";return`
    <section class="feedback-section" id="sugerencias">
      <div class="landing-container">
        <div class="feedback-card-wrapper">
          <div class="feedback-success-state">
            <div class="feedback-success-icon fb-pop"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path class="fb-check" d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <h3 class="feedback-success-title">¡Mensaje Enviado con Éxito!</h3>
            <p class="feedback-success-desc">${I(a)}</p>
            ${i}
            <button type="button" class="fb-link-btn" id="btn-reset-feedback">Enviar otro comentario</button>
          </div>
        </div>
      </div>
    </section>`}const vc=`<label class="form-field-label" for="fb-order">Pedido <span class="fb-optional">(Opcional)</span></label>
  <input type="text" class="form-field-input" id="fb-order" placeholder="Ej: ORD-1A2B o 'Sin pedido aún'" maxlength="30">`;function bc(e){if(!e)return;const t={type:"sugerencia",rating:5,entry:null,saved:!1};let a=null;const i=h=>e.querySelector(h);function s(h,u){if(!h)return;const m=h.dataset.touched!=="1";u&&m&&!h.value&&(h.value=u,h.dataset.auto="1"),!u&&h.dataset.auto==="1"&&m&&(h.value="",h.dataset.auto="")}function n(h){const u=i("#fb-account");u&&(u.innerHTML=h?`<span class="fb-chip">👤 Sesión iniciada${h.alias?` · <strong>${I(Mt(h.alias))}</strong>`:""}</span><span class="fb-account-hint">Tus datos se completaron solos</span>`:'<span class="fb-account-hint">¿Ya tienes cuenta? Inicia sesión y completamos tus datos y pedidos.</span><button type="button" class="fb-link-btn" data-action="login">Iniciar sesión</button>')}function o(h){var w;const u=i("#fb-order-group");if(!u)return;const m=h?Pe(h):[],f=((w=i("#fb-order"))==null?void 0:w.value)||"";if(!m.length){u.querySelector("select")&&(u.innerHTML=vc);return}const y=m.map(b=>{var E;const x=((E=ra[b.status])==null?void 0:E.label)||"";return`<option value="${I(b.id)}">#${I(b.id)}${x?` · ${I(x)}`:""}</option>`}).join("");u.innerHTML=`<label class="form-field-label" for="fb-order">¿Sobre qué pedido? <span class="fb-optional">(Opcional)</span></label>
      <select class="form-field-input fb-select" id="fb-order"><option value="">Sin pedido asociado</option>${y}</select>`;const v=i("#fb-order");f&&[...v.options].some(b=>b.value===f)&&(v.value=f)}function r(h=_.getCurrentUser()){n(h),s(i("#fb-name"),(h==null?void 0:h.name)||""),s(i("#fb-contact"),(h==null?void 0:h.email)||""),o(h)}function l(){var m;const h=_.getCurrentUser(),u=a==null?void 0:a.get();return{type:t.type,rating:t.rating,name:i("#fb-name").value.trim(),contact:i("#fb-contact").value.trim(),alias:(h==null?void 0:h.alias)||"",order:(((m=i("#fb-order"))==null?void 0:m.value)||"").trim().replace(/^#/,""),message:i("#fb-message").value.trim(),attachment:(u==null?void 0:u.dataUrl)||"",attachmentName:(u==null?void 0:u.name)||""}}function c(h){const u={};return h.name.length<2&&(u["fb-name"]="Escribe tu nombre o apodo."),h.contact.length<5&&(u["fb-contact"]="Déjanos un correo o teléfono para responderte."),h.message.length<10&&(u["fb-message"]="Cuéntanos un poco más (mínimo 10 caracteres)."),u}function d(h){var f;e.querySelectorAll(".is-invalid").forEach(y=>y.classList.remove("is-invalid"));const u=Object.keys(h),m=i("#fb-error");return m.hidden=!u.length,m.textContent=u.length?h[u[0]]:"",u.forEach(y=>{var v;return(v=i(`#${y}`))==null?void 0:v.classList.add("is-invalid")}),u.length&&((f=i(`#${u[0]}`))==null||f.focus()),!u.length}function g(){if(t.entry){e.innerHTML=fc({entry:t.entry,saved:t.saved});return}e.innerHTML=gc({type:t.type,rating:t.rating}),a=hc(e),r()}function p(h,u=!1){e.querySelectorAll(".rating-star-btn").forEach(f=>{const y=Number(f.dataset.star)<=h;u?f.classList.toggle("hovered",y):(f.classList.toggle("active",y),f.classList.remove("hovered"))});const m=i("#rating-hint");m&&(m.textContent=qs[h])}e.addEventListener("click",h=>{const u=h.target.closest(".feedback-type-btn");if(u){t.type=u.dataset.type,e.querySelectorAll(".feedback-type-btn").forEach(f=>f.classList.toggle("active",f===u));return}const m=h.target.closest(".rating-star-btn");if(m){t.rating=Number(m.dataset.star),p(t.rating);return}if(h.target.closest('[data-action="login"]')){Qt.open("login");return}h.target.closest("#btn-reset-feedback")&&(t.entry=null,t.rating=5,g())}),e.addEventListener("mouseover",h=>{const u=h.target.closest(".rating-star-btn");u&&p(Number(u.dataset.star),!0)}),e.addEventListener("mouseout",h=>{h.target.closest(".rating-star-btn")&&p(t.rating)}),e.addEventListener("input",h=>{var u;h.target.matches("#fb-name, #fb-contact")&&(h.target.dataset.touched="1",h.target.dataset.auto=""),(u=h.target.classList)==null||u.remove("is-invalid")}),e.addEventListener("submit",h=>{var m,f;h.preventDefault();const u=l();d(c(u))&&(t.saved=!!sc(u),t.entry=u,g(),(f=(m=i(".feedback-success-state"))==null?void 0:m.scrollIntoView)==null||f.call(m,{block:"center",behavior:"smooth"}))}),_.subscribe(h=>{t.entry||r(h)}),window.addEventListener("storage",()=>{t.entry||r()}),g()}const Ee="shirt_pending_order_draft",yc=24*60*60*1e3,wc={front:"Frente Central",frontPocket:"Logo Pecho",back:"Espalda"};let Yt=null;function Ra(e){return wc[e]||e}function _a(e){const t=Object.entries(e.customizations).find(([,o])=>o.hasDecal);if(!t)return null;const[a,i]=t,s=va(i,a,e.selectedSize),n=`${a}_${i.name}_${e.selectedSize.id}_${s.widthCm}_${s.heightCm}`;return{zoneId:a,zone:i,dims:s,key:n}}function xc({orderId:e,state:t,screenshot:a,customer:i}){var h;const{selectedColor:s,selectedSize:n,selectedSilhouette:o,selectedMaterial:r,selectedGrammage:l,pricing:c,isMagicMug:d}=t,g=o==="mug",p=Object.entries(t.customizations).filter(([u,m])=>m.hasDecal&&(!g||u==="front")).map(([u,m])=>{const f=va(m,u,n);return{zone:u,zoneName:g?"Vaso 11 Oz (Frontal / Envolvente)":Ra(u),name:m.name,widthCm:g?+(9.5*(m.scale||1)).toFixed(1):f.widthCm,heightCm:g?+(8.5*(m.scale||1)).toFixed(1):f.heightCm}});return{version:1,id:e,createdAt:new Date().toISOString(),customer:{name:i.name,city:i.city},garment:g?{silhouette:d?"Mug Mágico 11 Oz Termosensible":"Vaso Cerámico 11 Oz",size:"11 Oz",sizeName:"Capacidad 325 ml",dimensionsCm:"9.5x8.2",color:d?"Negro Termosensible (Revela con calor)":s.name,colorHex:d?"#121318":s.hex,material:d?"Cerámica Termosensible Mágica":"Cerámica AAA Sublimación HD",grammage:"325 ml"}:{silhouette:o==="woman"?"Mujer (Slim Fit)":"Hombre (Boxy Fit)",size:n.label,sizeName:n.name,dimensionsCm:`${n.lengthCm}x${n.widthCm}`,color:s.name,colorHex:s.hex,material:r==="poliester"?"Poliéster Dry-Fit":"Algodón 100% Peinado",grammage:`${l||"240"} GSM`},decals:p,pricing:{total:c.total,formatted:K(c.total)},artKey:((h=_a(t))==null?void 0:h.key)||null,screenshot:a||null}}function Ec(e){Yt=e;try{return localStorage.setItem(Ee,JSON.stringify(e)),!0}catch{try{const{screenshot:a,...i}=e;return localStorage.setItem(Ee,JSON.stringify({...i,screenshotOmitted:!0})),!0}catch(a){return console.warn("[OrderDraft] Sin cupo en localStorage:",a),!1}}}function Sc(){let e=null;try{e=JSON.parse(localStorage.getItem(Ee))}catch{}return Yt&&(!e||Yt.id===e.id)&&(e=Yt),!e||!e.id||!e.garment||!e.pricing?null:Date.now()-Date.parse(e.createdAt)>yc?(za(),null):e}function za(){Yt=null;try{localStorage.removeItem(Ee)}catch{}}function da(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Bt(e,t,a=""){return`
    <div class="receipt-row ${a}">
      <span class="receipt-label">${e}</span>
      <span class="receipt-dots" aria-hidden="true"></span>
      <span class="receipt-amount">${t}</span>
    </div>`}function Mc({orderId:e,state:t,selectedSize:a,selectedGrammage:i,extraZones:s,sizeAddon:n,basePrice:o,grammageModifier:r}){if(t.selectedSilhouette==="mug")return`
      <div class="atelier-receipt" role="group" aria-label="Desglose de precio">
        <div class="receipt-head">
          <span class="receipt-title">Atelier Receipt</span>
          <span class="receipt-id">#${da(e)}</span>
        </div>
        ${Bt("Vaso Cerámico 11 Oz · Sublimación HD",K(G.baseMugPrice))}
        ${t.isMagicMug?Bt("Acabado Mágico Termosensible (Calor)",`+${K(G.magicMugAddon)}`):""}
        <div class="receipt-tear" aria-hidden="true"></div>
        <div class="receipt-total">
          <span class="receipt-total-label">Total a pagar</span>
          <strong class="checkout-total-val" id="checkout-total-val">${K(t.pricing.total)}</strong>
        </div>
        <p class="receipt-note">Pagas por Nequi o Bancolombia después de confirmar.</p>
      </div>`;const c=s.map(([d,g])=>Bt(`Estampado · ${Ra(d)}`,`+${K(g)}`)).join("");return`
    <div class="atelier-receipt" role="group" aria-label="Desglose de precio">
      <div class="receipt-head">
        <span class="receipt-title">Atelier Receipt</span>
        <span class="receipt-id">#${da(e)}</span>
      </div>
      ${Bt(`Camiseta base · Talla ${a.label}`,K(o+n))}
      ${r!==0?Bt(`Ajuste gramaje · ${i} GSM`,`${r>0?"+":"−"}${K(Math.abs(r))}`):""}
      ${c}
      <div class="receipt-tear" aria-hidden="true"></div>
      <div class="receipt-total">
        <span class="receipt-total-label">Total a pagar</span>
        <strong class="checkout-total-val" id="checkout-total-val">${K(t.pricing.total)}</strong>
      </div>
      <p class="receipt-note">Pagas por Nequi o Bancolombia después de confirmar.</p>
    </div>`}function Cc({orderId:e,state:t,screenshotDataUrl:a,activeDecals:i,authUser:s}){const{selectedColor:n,selectedSize:o,selectedSilhouette:r,selectedMaterial:l,selectedGrammage:c,pricing:d,isMagicMug:g}=t,p=r==="mug",h=p?g?"Mug Mágico 11 Oz ✨":"Vaso Cerámico 11 Oz ☕":r==="woman"?"Mujer (Slim Fit)":"Hombre (Boxy Fit)",u=l==="algodon"?ce.filter(E=>E.id==="180"||E.id==="240"):ce.filter(E=>E.id==="120"||E.id==="180"),m=d.basePrice||G.baseShirtPrice,f=G.sizeAddons[o.id]||0,y=ce.find(E=>E.id===c),v=y?y.priceModifier:0,w=Object.entries(t.customizations).filter(([E,S])=>S&&S.hasDecal&&(G.zonePrices[E]||0)>0).map(([E])=>[E,G.zonePrices[E]]),b=s?`Pedido a nombre de <strong>${da(s.email)}</strong>`:"Al confirmar te pediremos iniciar sesión o registrarte. Tu diseño queda guardado.",x=p?`
    <div class="checkout-field-section">
      <div class="section-label-row">
        <span class="checkout-field-title">1. Tipo de Acabado Cerámico (11 Oz · 325 ml)</span>
        <span class="checkout-field-hint">Alto 9.5 cm • Diámetro 8.2 cm</span>
      </div>
      <div class="checkout-materials-row">
        <button type="button" class="btn-checkout-mat btn-checkout-mug-mode ${g?"":"active"}" aria-pressed="${!g}" data-magic-mug="false">
          <span class="mat-icon">☕</span>
          <div class="mat-info-text">
            <strong class="mat-name">Cerámica Clásica AAA</strong>
            <small class="mat-desc">Sublimación HD siempre visible (${K(G.baseMugPrice)})</small>
          </div>
        </button>
        <button type="button" class="btn-checkout-mat btn-checkout-mug-mode ${g?"active":""}" aria-pressed="${g}" data-magic-mug="true">
          <span class="mat-icon">✨</span>
          <div class="mat-info-text">
            <strong class="mat-name">Mug Mágico Termosensible</strong>
            <small class="mat-desc">Negro en frío · Revela con calor (+${K(G.magicMugAddon)})</small>
          </div>
        </button>
      </div>
    </div>
  `:`
    <div class="checkout-field-section">
      <div class="section-label-row">
        <span class="checkout-field-title">1. Elige tu Talla</span>
        <span class="checkout-field-hint" id="size-dimensions-hint">Largo ${o.lengthCm} cm • Pecho ${o.widthCm} cm</span>
      </div>
      <div class="checkout-sizes-grid">
        ${Rt.map(E=>{const S=E.id===o.id,M=G.sizeAddons[E.id]||0;return`
            <button type="button" class="btn-checkout-size ${S?"active":""}" aria-pressed="${S}" data-size-id="${E.id}">
              <span class="size-letter">${E.label}</span>
              <span class="size-sub">${E.lengthCm}x${E.widthCm}cm</span>
              ${M>0?`<span class="size-addon-badge">+${K(M)}</span>`:""}
            </button>`}).join("")}
      </div>
    </div>

    <div class="checkout-field-section">
      <span class="checkout-field-title">2. Tipo de Material Textil</span>
      <div class="checkout-materials-row">
        ${Xn.map(E=>`
          <button type="button" class="btn-checkout-mat ${E.id===l?"active":""}" aria-pressed="${E.id===l}" data-mat-id="${E.id}">
            <span class="mat-icon">${E.icon}</span>
            <div class="mat-info-text">
              <strong class="mat-name">${E.name}</strong>
              <small class="mat-desc">${E.badge}</small>
            </div>
          </button>`).join("")}
      </div>
    </div>

    <div class="checkout-field-section">
      <span class="checkout-field-title">3. Gramaje del Tejido</span>
      <div class="checkout-grammages-row">
        ${u.map(E=>{const S=E.id===c,M=E.priceModifier>0?`(+${K(E.priceModifier)})`:E.priceModifier<0?`(${K(E.priceModifier)})`:"(Incluido)";return`
            <button type="button" class="btn-checkout-gram ${S?"active":""}" aria-pressed="${S}" data-gram-id="${E.id}">
              <strong class="gram-title">${E.label} • ${E.title}</strong>
              <span class="gram-mod">${M}</span>
            </button>`}).join("")}
      </div>
    </div>
  `;return`
    <div class="modal-card checkout-modal-card">
      <div class="modal-header">
        <div class="modal-title-box">
          <span class="modal-badge">CHECKOUT ATELIER</span>
          <h3 class="modal-title">Confirmar y Personalizar Pedido</h3>
        </div>
        <button type="button" class="btn-close-modal" id="btn-close-modal" title="Cerrar">✕</button>
      </div>

      <div class="modal-body checkout-modal-body">
        <!-- Columna Izquierda: Vista Previa y Descargas -->
        <div class="checkout-preview-col">
          <div class="modal-preview-box">
            <img src="${a}" alt="Producto 3D Personalizado" class="modal-preview-img" />
            <div class="checkout-preview-actions">
              <button type="button" id="btn-download-preview" class="btn-download-tag">📥 Mockup 3D</button>
              ${i.length>0?`
                <button type="button" id="btn-download-300dpi" class="btn-download-tag btn-download-dpi" title="Generar y descargar archivo listo para impresión a 300 DPI">
                  🖨️ Arte 300 DPI
                </button>`:""}
            </div>
          </div>

          <div class="checkout-garment-summary">
            <div class="summary-chip-item"><span class="chip-label">Producto</span><strong>${h}</strong></div>
            <div class="summary-chip-item">
              <span class="chip-label">Color</span>
              <span class="color-dot-inline" style="background:${p&&g?"#121318":n.hex};"></span>
              <strong>${p&&g?"Negro Termosensible":n.name}</strong>
            </div>
            <div class="summary-chip-item">
              <span class="chip-label">Estampados</span>
              <strong>${i.map(([E])=>E.toUpperCase()).join(", ")||"Sin estampado"}</strong>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Configuración de Prenda & Validación de Precio -->
        <div class="checkout-config-col">
          ${x}

          ${Mc({orderId:e,state:t,selectedSize:o,selectedGrammage:c,extraZones:w,sizeAddon:f,basePrice:m,grammageModifier:v})}

          <div class="checkout-field-section">
            <span class="checkout-field-title">${p?"2.":"4."} Datos de Entrega</span>
            <div class="checkout-contact-grid">
              <div class="input-field">
                <label for="cust-name">Nombre y Apellido</label>
                <input type="text" id="cust-name" placeholder="Ej. Carlos Mendoza" class="text-input" autocomplete="name" aria-required="true" />
              </div>
              <div class="input-field">
                <label for="cust-city">Ciudad de Envío</label>
                <input type="text" id="cust-city" placeholder="Ej. Bogotá / Medellín / Cali" class="text-input" autocomplete="address-level2" aria-required="true" />
              </div>
            </div>
            <p class="checkout-form-error" id="checkout-form-error" role="alert"></p>
          </div>
        </div>
      </div>

      <div class="modal-footer checkout-modal-footer">
        <p class="checkout-footer-note" id="checkout-auth-hint">${b}</p>
        <div class="checkout-footer-actions">
          <button type="button" id="btn-cancel" class="btn-secondary">Volver al Editor</button>
          <button type="button" id="btn-confirm-order" class="btn-confirm-primary"><span>✓ Confirmar Pedido</span></button>
        </div>
      </div>
    </div>
  `}function Ns(e){let t=null,a="";return async function(){const s=_a(C.getState());if(!s)return null;if(t&&a===s.key)return t;if(!s.zone.imageElement)return null;await new Promise(n=>setTimeout(n,30));try{const{zoneId:n,zone:o,dims:r}=s,l=tr(o.imageElement,r.widthCm,r.heightCm);return t={png:ar(l.toDataURL("image/png"),300),fileName:`PEDIDO_${e}_${n}_${r.widthCm}x${r.heightCm}cm_300DPI.png`,dims:r},a=s.key,t}catch(n){return console.warn("[Art300] Error generando 300 DPI:",n),null}}}const ua="order-auth-gate-overlay";function Tt(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Us(){const e=document.getElementById(ua);e&&(e.classList.remove("active"),setTimeout(()=>e.remove(),250))}function Ac(e){var i;(i=document.getElementById(ua))==null||i.remove();const t=document.createElement("div");t.id=ua,t.className="modal-overlay order-gate-overlay",t.innerHTML=`
    <div class="order-gate-card" role="dialog" aria-modal="true" aria-labelledby="og-title">
      <div class="og-lock" aria-hidden="true">🔐</div>
      <span class="og-eyebrow">Último paso</span>
      <h3 class="og-title" id="og-title">Inicia sesión o regístrate para continuar tu pedido</h3>
      <p class="og-sub">Guardamos tu diseño en este dispositivo. En cuanto ingreses, lo retomamos automáticamente y lo verás en <strong>Mis Pedidos</strong> listo para pagar.</p>

      <div class="og-summary">
        ${e.screenshot?`<img class="og-thumb" src="${e.screenshot}" alt="Tu diseño" />`:'<div class="og-thumb og-thumb-empty">👕</div>'}
        <div class="og-summary-text">
          <span class="og-order-id">#${Tt(e.id)}</span>
          <strong>${Tt(e.garment.silhouette)} · Talla ${Tt(e.garment.size)}</strong>
          <span class="og-muted">${Tt(e.garment.color)} · ${Tt(e.garment.material)}</span>
        </div>
        <span class="og-total">${Tt(e.pricing.formatted)}</span>
      </div>

      <div class="og-actions">
        <button type="button" class="og-btn og-btn-primary" id="og-login">Iniciar sesión</button>
        <button type="button" class="og-btn og-btn-ghost" id="og-register">Crear cuenta</button>
      </div>
      <button type="button" class="og-back" id="og-cancel">Volver al checkout</button>
    </div>
  `,document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("active"));const a=()=>{za(),Us()};t.querySelector("#og-login").addEventListener("click",()=>Qt.open("login")),t.querySelector("#og-register").addEventListener("click",()=>Qt.open("register")),t.querySelector("#og-cancel").addEventListener("click",a),t.addEventListener("click",s=>{s.target===t&&a()})}function Lc(e,t=""){var o,r,l,c,d;const a=G.supportPhone.replace(/[^0-9]/g,""),i=e.garment||{},s=e.driveUrl?`☁️ *Arte DTF 300 DPI:* ${e.driveUrl}
`:e.hasLocalFile?`📦 *Arte DTF 300 DPI:* lo adjunto en este chat.
`:"",n=`💳 *COMPROBANTE DE PAGO*
📋 *Orden:* #${e.id}
👕 *Prenda:* ${i.silhouette||"Camiseta"} • Talla ${i.size||""} • ${i.color||""}
💰 *Total:* ${((o=e.pricing)==null?void 0:o.formatted)||""}
${t?`🏦 *Pagué por:* ${t}
`:""}${(r=e.customer)!=null&&r.name?`👤 *Cliente:* ${e.customer.name}
`:""}${(l=e.customer)!=null&&l.city?`📍 *Ciudad:* ${e.customer.city}
`:""}${(c=e.customer)!=null&&c.address?`🏠 *Dirección:* ${e.customer.address}
`:""}${(d=e.customer)!=null&&d.phone?`📱 *Celular:* ${e.customer.phone}
`:""}${s}-----------------------------------------
_Adjunto el pantallazo del comprobante en este chat para su validación._`;return`https://wa.me/${a}?text=${encodeURIComponent(n)}`}const yt=Object.freeze([{id:"validation",label:"Validación de Pago",short:"El pago está siendo validado",desc:"Revisando tu transferencia en menos de 24 horas.",icon:"⏳"},{id:"printing",label:"Impresión Textil",short:"Tu estampado está siendo impreso",desc:"Inyección de tinta DTF a 300 DPI en alta fidelidad.",icon:"🖨️"},{id:"pressing",label:"Estampado & Curado",short:"Se estampó tu camiseta",desc:"Fijación por termo-fijado y curado térmico.",icon:"👕"},{id:"packing",label:"Empaque Atelier",short:"Se está empacando el pedido",desc:"Control de calidad y embalaje streetwear exclusivo.",icon:"📦"},{id:"shipped",label:"En Camino",short:"El pedido ya salió",desc:"En ruta de transporte con guía de despacho.",icon:"🚚"},{id:"delivered",label:"Entregado",short:"¡Pedido entregado con éxito!",desc:"Prenda recibida y lista para vestir.",icon:"✨"}]);function Hs(e){const t=yt.findIndex(a=>a.id===e);return t===-1?0:t}function kc(e){return yt.find(t=>t.id===e)||yt[0]}function $c(e){const t=Hs(e);return t<yt.length-1?yt[t+1].id:yt[0].id}function Ve(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Tc(e){const t=e.stage||"validation",a=Hs(t),i=Ve(e.id);return`
    <div class="mp-timeline" data-timeline-id="${i}">
      <div class="mp-timeline-header">
        <div class="mp-timeline-title">
          <span class="mp-timeline-live-dot"></span>
          <span>Rastreo del Pedido en Vivo</span>
        </div>
        <button type="button" class="mp-sim-btn" data-action="advance-stage" data-id="${i}" title="Simular avance al siguiente paso">
          Simular paso siguiente ⏩
        </button>
      </div>

      <div class="mp-timeline-stepper">
        ${yt.map((s,n)=>{const o=n<a,r=n===a;return`
            <div class="mp-timeline-step ${o?"is-done":r?"is-current":"is-upcoming"}">
              <div class="mp-step-indicator">
                <span class="mp-step-node">
                  ${o?"✓":s.icon}
                </span>
                ${n<yt.length-1?'<span class="mp-step-line"></span>':""}
              </div>
              <div class="mp-step-content">
                <div class="mp-step-label-row">
                  <span class="mp-step-label">${Ve(s.short)}</span>
                  ${r?'<span class="mp-step-badge">En curso</span>':o?'<span class="mp-step-badge done">Listo</span>':""}
                </div>
                <p class="mp-step-desc">${Ve(s.desc)}</p>
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `}function N(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Ic(e){const t=new Date(e);return Number.isNaN(t.getTime())?"":`${t.toLocaleDateString("es-CO",{day:"2-digit",month:"short",year:"numeric"})} · ${t.toLocaleTimeString("es-CO",{hour:"2-digit",minute:"2-digit"})}`}function Dc(e){const t=e.fields.map(a=>`
    <div class="mp-field">
      <span class="mp-field-label">${N(a.label)}</span>
      ${a.value?`<span class="mp-field-value">${N(a.value)}</span>
           ${a.copy?`<button type="button" class="mp-copy" data-action="copy" data-copy="${N(a.value)}" title="Copiar">Copiar</button>`:""}`:'<span class="mp-field-empty">Pídelo por WhatsApp</span>'}
    </div>`).join("");return`<div class="mp-bank"><div class="mp-bank-title">${e.icon} ${N(e.label)}</div>${t}</div>`}function Pc(e,t){var c,d;const a=N(e.id),i=t.methods[e.id]||e.paymentMethod||"nequi",s=ks(i),n=t.pending[e.id],o=(c=e.paymentProof)==null?void 0:c.image,r=n||o;return`
    <div class="mp-pay">
      ${e.status===V.PROOF_SUBMITTED?`
        <div class="mp-validation-banner">
          <div class="mp-validation-icon">⏳</div>
          <div class="mp-validation-text">
            <strong>Pago en proceso de validación</strong>
            <p>Tu pago fue recibido y entró en validación. En <strong>menos de 24 horas</strong> lo verificaremos y te notificaremos. Si deseas, puedes adjuntar tu comprobante abajo o enviarlo por WhatsApp.</p>
          </div>
        </div>
      `:""}

      <div class="mp-step"><span class="mp-step-n">1</span> Elige cómo transferir ${N(((d=e.pricing)==null?void 0:d.formatted)||"")}</div>
      <div class="mp-methods" role="tablist">
        ${Ls.map(g=>`
          <button type="button" role="tab" aria-selected="${g.id===i}" class="mp-method ${g.id===i?"active":""}"
            data-action="select-method" data-id="${a}" data-method="${g.id}">${g.icon} ${N(g.label)}</button>`).join("")}
      </div>
      ${s?Dc(s):'<p class="mp-hint">Selecciona Nequi o Bancolombia para ver los datos de transferencia.</p>'}

      <div class="mp-step"><span class="mp-step-n">2</span> Comprobante de transferencia (Opcional)</div>
      <label class="mp-drop ${r?"has-preview":""}" for="proof-${a}" data-drop-id="${a}">
        <input type="file" class="mp-file-input" id="proof-${a}" data-id="${a}" accept="image/*" hidden />
        ${r?`<img src="${r}" alt="Comprobante" class="mp-proof-img" /><span class="mp-drop-cta">${n?"Cambiar imagen":"Reemplazar comprobante"}</span>`:'<span class="mp-drop-icon" aria-hidden="true">🧾</span><span class="mp-drop-cta">Toca para subir el pantallazo (opcional)</span><span class="mp-drop-sub">JPG, PNG o WEBP · máx. 10 MB</span>'}
      </label>

      <div class="mp-pay-actions">
        <button type="button" class="mp-btn mp-btn-primary" data-action="mark-paid" data-id="${a}">
          ✓ Marcar como pagado
        </button>
        <button type="button" class="mp-btn mp-btn-wa" data-action="send-whatsapp" data-id="${a}">
          📲 Enviar por WhatsApp
        </button>
      </div>
      <p class="mp-hint">Al marcar como pagado, tu pedido entra en validación y se te notificará en menos de 24 horas.</p>
    </div>`}function Oc(e,t){var l,c;const a=N(e.id),i=bl(e.status),s=e.garment||{},n=yl(e),o=t.expandedId===e.id,r=(e.decals||[]).map(d=>`
    <li><span class="mp-zone">${N(d.zoneName||Ra(d.zone))}</span> ${N(d.name||"Diseño")} → <strong>${N(d.widthCm)} × ${N(d.heightCm)} cm</strong></li>`).join("");return`
    <article class="mp-card ${t.highlightId===e.id?"is-highlight":""}" data-order-id="${a}">
      <div class="mp-card-main">
        ${e.screenshot?`<img class="mp-thumb" src="${e.screenshot}" alt="Diseño del pedido ${a}" />`:'<div class="mp-thumb mp-thumb-empty">👕</div>'}
        <div class="mp-info">
          <div class="mp-head">
            <span class="mp-id">#${a}</span>
            <span class="mp-status" data-tone="${i.tone}">${N(i.label)}</span>
          </div>
          <div class="mp-title">${N(s.silhouette||"Camiseta")} · Talla <strong>${N(s.size||"")}</strong></div>
          <div class="mp-meta">
            <span>${N(s.color||"")}</span><span>${N(s.material||"")} ${N(s.grammage||"")}</span>
            <span class="mp-date">${N(Ic(e.createdAt))}</span>
          </div>
          <div class="mp-total">${N(((l=e.pricing)==null?void 0:l.formatted)||"")}</div>
        </div>
      </div>

      ${r?`<ul class="mp-decals">${r}</ul>`:""}
      ${(c=e.customer)!=null&&c.name?`<div class="mp-customer">👤 ${N(e.customer.name)}${e.customer.city?` · ${N(e.customer.city)}`:""}</div>`:""}
      <p class="mp-status-hint" data-tone="${i.tone}">${N(i.hint)}</p>

      ${e.status===V.PROOF_SUBMITTED||e.status===V.PAID||e.stage?Tc(e):""}

      ${n&&o?Pc(e,t):""}

      <div class="mp-actions">
        ${n?`<button type="button" class="mp-btn mp-btn-primary" data-action="toggle-pay" data-id="${a}">
          ${o?"Ocultar datos de pago":e.status===V.PROOF_SUBMITTED?"🔍 Ver estado de pago":"💳 Pagar ahora"}</button>`:""}
        ${e.screenshot?`<button type="button" class="mp-btn mp-btn-ghost" data-action="download-photo" data-id="${a}">📥 Foto HD</button>`:""}
        ${e.driveUrl?`<a class="mp-btn mp-btn-ghost" href="${N(e.driveUrl)}" target="_blank" rel="noopener">☁️ Arte 300 DPI</a>`:""}
        ${e.status===V.PENDING_PAYMENT||!e.status?`<button type="button" class="mp-btn mp-btn-danger" data-action="delete" data-id="${a}">🗑️ Eliminar</button>`:""}
      </div>
    </article>`}function Rc(e){return e?`<div class="mp-empty"><div class="mp-empty-icon">📋</div><h4>Aún no tienes pedidos</h4>
       <p>Cuando confirmes un pedido en el estudio 3D aparecerá aquí, listo para pagar.</p></div>`:`<div class="mp-empty"><div class="mp-empty-icon">🔐</div><h4>Inicia sesión para ver tus pedidos</h4>
       <p>Tus pedidos y pagos están asociados a tu cuenta.</p>
       <button type="button" class="mp-btn mp-btn-primary" data-action="login">Iniciar sesión</button></div>`}function _c({orders:e,user:t,ui:a}){return`
    <div class="modal-card orders-modal-card">
      <div class="modal-header">
        <div class="modal-title-box">
          <span class="modal-badge">${t?N(t.email):"Panel del cliente"}</span>
          <h3 class="modal-title">📦 Mis Pedidos${t?` (${e.length})`:""}</h3>
        </div>
        <button type="button" class="btn-close-modal" data-action="close" title="Cerrar">✕</button>
      </div>
      <div class="modal-body mp-body">
        ${e.length?e.map(i=>Oc(i,a)).join(""):Rc(t)}
      </div>
      <div class="modal-footer mp-footer">
        <button type="button" class="btn-secondary" data-action="close">Cerrar</button>
      </div>
    </div>`}const gi="saved-orders-modal-overlay";function Se({highlightId:e=null,expandPayment:t=!1}={}){var h;(h=document.getElementById(gi))==null||h.remove();const a={expandedId:t?e:null,highlightId:e,methods:{},pending:{}};let i=!!e;const s=document.createElement("div");s.id=gi,s.className="modal-overlay",document.body.appendChild(s);const n=_.subscribe(()=>r());function o(){n(),s.classList.remove("active"),setTimeout(()=>s.remove(),200)}function r(){var y,v;const u=((y=s.querySelector(".mp-body"))==null?void 0:y.scrollTop)||0,m=_.getCurrentUser();s.innerHTML=_c({orders:Pe(m),user:m,ui:a});const f=s.querySelector(".mp-body");i?(i=!1,(v=s.querySelector(".mp-card.is-highlight"))==null||v.scrollIntoView({block:"nearest"})):f&&(f.scrollTop=u),a.highlightId=null}async function l(u,m){if(m)try{a.pending[u]=await Bs(m),a.expandedId=u,r()}catch(f){R(f.message,"error",4500)}}function c(u){var w,b;const m=Ht(u);if(!m)return;const f=a.methods[u]||(m==null?void 0:m.paymentMethod)||"nequi",y=a.pending[u]||((w=m==null?void 0:m.paymentProof)==null?void 0:w.image)||null,{ok:v}=Gt(u,{status:V.PROOF_SUBMITTED,stage:"validation",paymentMethod:f,paymentProof:{channel:y?"web":"direct_claim",image:y,submittedAt:new Date().toISOString()}});if(!v)return R("No se pudo actualizar el estado. Intenta de nuevo.","error",4500);ui({orderId:u,status:V.PROOF_SUBMITTED,paymentMethod:f,proofImage:y,customerEmail:(b=m.customer)==null?void 0:b.email,notes:`Canal: ${y?"web":"direct_claim"}`}).catch(x=>console.warn("[PaymentCloud] Sync diferido:",x)),delete a.pending[u],a.expandedId=null,R("¡Pago reportado! Tu pedido entró en validación. En menos de 24 horas te notificaremos.","success",6e3),r()}function d(u){const m=Ht(u);if(!m)return;const f=m.stage||"validation",y=$c(f),v=kc(y);Gt(u,{stage:y,status:y==="delivered"?V.PAID:m.status||V.PROOF_SUBMITTED}),R(`Paso actualizado: "${v.short}"`,"info",3e3),r()}function g(u){var v,w,b;const m=Ht(u);if(!m)return;const f=a.methods[u]||m.paymentMethod||null;window.open(Lc(m,((v=ks(f))==null?void 0:v.label)||""),"_blank","noopener");const y=new Date().toISOString();Gt(u,{paymentMethod:f,stage:m.stage||"validation",status:m.status===V.PAID?V.PAID:V.PROOF_SUBMITTED,paymentProof:(w=m.paymentProof)!=null&&w.image?{...m.paymentProof,whatsappSentAt:y}:{channel:"whatsapp",image:null,submittedAt:y}}),ui({orderId:u,status:V.PROOF_SUBMITTED,paymentMethod:f,customerEmail:(b=m.customer)==null?void 0:b.email,notes:"Notificado vía WhatsApp"}).catch(x=>console.warn("[PaymentCloud] Sync diferido:",x)),R("Abrimos WhatsApp: adjunta tu comprobante. Tu pedido entró en validación.","info",5500),r()}const p={close:o,login:()=>Qt.open("login"),"toggle-pay":u=>{a.expandedId=a.expandedId===u?null:u,r()},"select-method":(u,m)=>{a.methods[u]=m.dataset.method,r()},"mark-paid":c,"submit-proof":c,"advance-stage":d,"send-whatsapp":g,copy:(u,m)=>{var f;(f=navigator.clipboard)==null||f.writeText(m.dataset.copy).then(()=>R("Copiado al portapapeles","success",1800),()=>R("No se pudo copiar. Selecciónalo manualmente.","error"))},"download-photo":u=>{var f;const m=Ht(u);m!=null&&m.screenshot&&St(m.screenshot,`pedido-${m.id}-talla-${(f=m.garment)==null?void 0:f.size}.png`)},delete:u=>{confirm(`¿Eliminar pedido ${u}?`)&&(El(u),r())}};s.addEventListener("click",u=>{if(u.target===s)return o();const m=u.target.closest("[data-action]");m&&p[m.dataset.action]&&p[m.dataset.action](m.dataset.id,m)}),s.addEventListener("change",u=>{u.target.matches(".mp-file-input")&&l(u.target.dataset.id,u.target.files[0])}),s.addEventListener("dragover",u=>{u.target.closest(".mp-drop")&&u.preventDefault()}),s.addEventListener("drop",u=>{const m=u.target.closest(".mp-drop");m&&(u.preventDefault(),l(m.dataset.dropId,u.dataTransfer.files[0]))}),r(),requestAnimationFrame(()=>s.classList.add("active"))}let Ge=!1;function fi(){const e=document.getElementById("order-modal-overlay");e&&(e.classList.remove("active"),setTimeout(()=>e.remove(),250))}async function zc(e,t){var r,l,c;const a=_a(C.getState());if(!a||a.key!==t.artKey)return;const i=await Ns(e.id)();if(!i)return;const s=_.getCurrentUser(),n=t.garment,o=await zl({orderId:e.id,customerName:((r=e.customer)==null?void 0:r.name)||(s==null?void 0:s.name),customerEmail:((l=e.customer)==null?void 0:l.email)||(s==null?void 0:s.email),customerCity:((c=e.customer)==null?void 0:c.city)||(s==null?void 0:s.city),userId:s==null?void 0:s.id,userAlias:s==null?void 0:s.alias,garment:`${n.silhouette} • ${n.material}`,size:n.size,color:`${n.color} (${n.colorHex})`,dimensions:t.decals.map(d=>`${d.zone}: ${d.widthCm}x${d.heightCm} cm`).join(" | "),total:t.pricing.formatted,screenshot:e.screenshot||null,image300Dpi:i.png});o.success&&o.fileUrl?Gt(e.id,{driveUrl:o.fileUrl}):o.code==="LIMIT_REACHED"?R(o.message,"warning",7e3):(St(i.png,i.fileName),Gt(e.id,{hasLocalFile:!0}),R("Descargamos tu arte 300 DPI. Adjúntalo al enviar tu comprobante por WhatsApp.","info",5e3))}async function js(e,{fromResume:t=!1}={}){if(Ge)return null;Ge=!0;try{const a=_.getCurrentUser();if(!a)return null;if(Pe(a).filter(r=>r.status===V.PENDING_PAYMENT).length>=2)return fi(),Se({expandPayment:!0}),R("Límite alcanzado: Tienes 2 pedidos pendientes de pago. Por favor marca como pagado uno anterior antes de generar uno nuevo.","warning",7e3),null;const{ok:s,order:n,existed:o}=xl(e,a);return s?(us(n),za(),Us(),fi(),Se({highlightId:n.id,expandPayment:!0}),R(t?`Retomamos tu pedido #${n.id}. Ya puedes pagarlo.`:`Pedido #${n.id} registrado · Pendiente de pago`,"success",4500),o||zc(n,e).catch(r=>console.warn("[CheckoutFlow] Arte 300 DPI:",r)),n):(R("No hay espacio para guardar el pedido en este dispositivo. Elimina pedidos antiguos e inténtalo de nuevo.","error",6e3),null)}finally{Ge=!1}}async function Fc(e){if(Ec(e)||R("No pudimos guardar el borrador en el navegador. No cierres la página mientras inicias sesión.","error",5e3),!_.isAuthenticated())return Ac(e),{status:"auth_required"};const t=await js(e);return{status:t?"created":"failed",order:t}}function qc(){let e=_.isAuthenticated();const t=()=>{const a=Sc();a&&_.isAuthenticated()&&js(a,{fromResume:!0})};_.subscribe(a=>{const i=!!a;!e&&i&&setTimeout(t,0),e=i}),e&&setTimeout(t,800)}function Bc(e){var p,h,u;(p=document.getElementById("order-modal-overlay"))==null||p.remove();const t=`ORD-${Date.now().toString(36).toUpperCase()}`;let a=((h=_.getCurrentUser())==null?void 0:h.name)||"",i=((u=_.getCurrentUser())==null?void 0:u.city)||"";const s=Ns(t),n=document.createElement("div");n.id="order-modal-overlay",n.className="modal-overlay checkout-modal-overlay";function o(){n.classList.remove("active"),setTimeout(()=>n.remove(),250)}function r(){const m=C.getState(),f=Object.entries(m.customizations).filter(([w,b])=>b.hasDecal?m.selectedSilhouette==="mug"?w==="front":!0:!1);n.innerHTML=Cc({orderId:t,state:m,screenshotDataUrl:e,activeDecals:f,authUser:_.getCurrentUser()});const y=n.querySelector("#cust-name"),v=n.querySelector("#cust-city");y&&a&&(y.value=a),v&&i&&(v.value=i),g()}function l(){var v;const m=[["#cust-name","tu nombre y apellido"],["#cust-city","la ciudad de envío"]],f=m.filter(([w])=>{var b;return!((b=n.querySelector(w))!=null&&b.value.trim())});m.forEach(([w])=>{const b=n.querySelector(w);b==null||b.classList.toggle("is-invalid",!b.value.trim())});const y=n.querySelector("#checkout-form-error");return f.length?(y&&(y.textContent=`Completa ${f.map(w=>w[1]).join(" y ")} para continuar.`),(v=n.querySelector(f[0][0]))==null||v.focus(),!1):(y&&(y.textContent=""),!0)}async function c(m){if(!l())return;const f=m.innerHTML;m.disabled=!0,m.innerHTML="<span>⏳ Registrando pedido…</span>";try{const y=xc({orderId:t,state:C.getState(),screenshot:e,customer:{name:a.trim(),city:i.trim()}});await Fc(y)}finally{m.disabled=!1,m.innerHTML=f}}function d(m,f,y){n.querySelectorAll(m).forEach(v=>{v.addEventListener("click",()=>{y(v.getAttribute(f)),r()})})}function g(){var y,v,w;(y=n.querySelector("#btn-close-modal"))==null||y.addEventListener("click",o),(v=n.querySelector("#btn-cancel"))==null||v.addEventListener("click",o),[["#cust-name",b=>{a=b}],["#cust-city",b=>{i=b}]].forEach(([b,x])=>{var E;(E=n.querySelector(b))==null||E.addEventListener("input",S=>{x(S.target.value),S.target.classList.remove("is-invalid")})}),d(".btn-checkout-size","data-size-id",b=>{const x=Rt.find(E=>E.id===b);x&&qi(x)}),d(".btn-checkout-mug-mode","data-magic-mug",b=>{Ui(b==="true")}),d(".btn-checkout-mat:not(.btn-checkout-mug-mode)","data-mat-id",b=>{ao(b);const x=C.getState().selectedGrammage;(b==="algodon"&&x==="120"||b==="poliester"&&x==="240")&&Na("180")}),d(".btn-checkout-gram","data-gram-id",Na),(w=n.querySelector("#btn-download-preview"))==null||w.addEventListener("click",()=>{const b=C.getState().selectedSilhouette==="mug";St(e,`${b?"mug-11oz":"camiseta-3d"}-${Date.now()}.png`)});const m=n.querySelector("#btn-download-300dpi");m==null||m.addEventListener("click",async()=>{const b=m.innerHTML;m.disabled=!0,m.innerHTML="⏳ Procesando 300 DPI...";try{const x=await s();x&&St(x.png,x.fileName)}finally{m.disabled=!1,m.innerHTML=b}});const f=n.querySelector("#btn-confirm-order");f==null||f.addEventListener("click",()=>c(f))}n.addEventListener("click",m=>{m.target===n&&o()}),document.body.appendChild(n),r(),requestAnimationFrame(()=>n.classList.add("active"))}class Nc{constructor(t){this.mount=t||document.body,this.container=null,this.createDom()}createDom(){const t=document.getElementById("studio-cyber-loader");t&&t.remove();const a=typeof localStorage<"u"&&localStorage.getItem("shirt_preferred_loader")||"cyberscan";let i="./assets/loader/loader_cyber_scan.jpg",s="orbit-theme",n="CLO3D CAD // ORBITAL SCANNER",o="COTTON 240 GSM",r="ESCANEO DE PRENDA EN TIEMPO REAL",l="Iniciando escáner fotogramétrico 360°...";a==="hologram"?(i="./assets/loader/loader_hologram.jpg",s="",n="ATELIER 3D // CYBER-TECH v3.0",o="MESH: DRACO 240G",r="INICIALIZANDO ESTUDIO 3D",l="Conectando aceleración de hardware WebGL..."):a==="luxury"&&(i="./assets/loader/loader_luxury_faceted.jpg",s="gold-theme",n="HAUTE COUTURE // ATELIER GOLD",o="PARIS EDITION",r="ATELIER DE ALTA COSTURA",l="Preparando entorno de diseño de lujo...");const c=document.createElement("div");c.id="studio-cyber-loader",c.className="studio-cyber-loader",c.innerHTML=`
      <div class="loader-backdrop">
        <div class="loader-grid-overlay"></div>
        <div class="loader-ambient-glow loader-ambient-primary"></div>
        <div class="loader-ambient-glow loader-ambient-secondary"></div>
      </div>

      <div class="loader-content-box">
        <div class="loader-hud-corner corner-tl"></div>
        <div class="loader-hud-corner corner-tr"></div>
        <div class="loader-hud-corner corner-bl"></div>
        <div class="loader-hud-corner corner-br"></div>

        <div class="loader-top-meta">
          <span class="loader-meta-chip">
            <span class="loader-chip-dot"></span>
            ${n}
          </span>
          <span class="loader-meta-coord" id="loader-coord-display">${o}</span>
        </div>

        <div class="loader-hologram-stage ${s}">
          <div class="loader-hologram-scanner"></div>
          <div class="loader-hologram-scanner-inner"></div>
          <div class="loader-scanline-laser"></div>
          <img src="${i}" width="136" height="136" loading="eager" alt="Atelier 3D Garment" class="hologram-asset-img" />
        </div>

        <div class="loader-info-group">
          <h2 class="loader-headline">${r}</h2>
          <div class="loader-status-stream" id="loader-status-msg">
            ${l}
          </div>
        </div>

        <!-- 4 Fases de Carga Interactiva -->
        <div class="loader-phases-grid">
          <div class="phase-pill active" id="phase-1"><span class="phase-idx">01</span> WebGL</div>
          <div class="phase-pill" id="phase-2"><span class="phase-idx">02</span> Malla CLO3D</div>
          <div class="phase-pill" id="phase-3"><span class="phase-idx">03</span> Texturas DTF</div>
          <div class="phase-pill" id="phase-4"><span class="phase-idx">04</span> Atelier Listo</div>
        </div>

        <div class="loader-progress-module">
          <div class="loader-progress-track">
            <div class="loader-progress-bar" id="loader-progress-fill">
              <span class="progress-bar-head"></span>
            </div>
          </div>
          <div class="loader-progress-footer">
            <span class="loader-specs-tag">PBR COTTON • UV MAP 2048x2048</span>
            <span class="loader-number-readout" id="loader-percent-num">0%</span>
          </div>
        </div>
      </div>
    `,this.container=c,this.mount.appendChild(c)}async play(t=1200){return new Promise(a=>{this.container.classList.remove("hidden"),this.container.classList.add("visible");const i=this.container.querySelector("#loader-progress-fill"),s=this.container.querySelector("#loader-percent-num"),n=this.container.querySelector("#loader-status-msg"),o=this.container.querySelector("#loader-coord-display"),r=[this.container.querySelector("#phase-1"),this.container.querySelector("#phase-2"),this.container.querySelector("#phase-3"),this.container.querySelector("#phase-4")],l=[{pct:20,phase:0,msg:"Iniciando escáner fotogramétrico 360°...",coord:"RADAR: ACTIVO"},{pct:50,phase:1,msg:"Mapeando grosor de hilo y caída de tela...",coord:"TELA: 240 GSM"},{pct:78,phase:2,msg:"Indexando zonas DTF de alta resolución...",coord:"ZONAS: F/B/M"},{pct:95,phase:3,msg:"Alineando coordenadas UV con la malla...",coord:"UV: 100%"},{pct:100,phase:3,msg:"¡Escaneo completado! Abriendo Atelier 3D...",coord:"READY: 100%"}],c=performance.now(),d=g=>{const p=g-c,h=Math.min(p/t,1),u=Math.floor(h*100);i&&(i.style.width=`${u}%`),s&&(s.textContent=`${u}%`);for(let m=l.length-1;m>=0;m--)if(u>=l[m].pct){n&&n.textContent!==l[m].msg&&(n.textContent=l[m].msg),o&&l[m].coord&&(o.textContent=l[m].coord),r.forEach((f,y)=>{f&&(f.classList.toggle("active",y<=l[m].phase),f.classList.toggle("current",y===l[m].phase))});break}h<1?requestAnimationFrame(d):setTimeout(()=>{this.container.classList.add("fade-out"),setTimeout(()=>{this.container.classList.remove("visible","fade-out"),this.container.classList.add("hidden"),a()},360)},180)};requestAnimationFrame(d)})}hide(){this.container&&(this.container.classList.remove("visible","fade-out"),this.container.classList.add("hidden"))}}const ha=()=>document.documentElement;function Uc(e,t=!0){var a;if(!e.isGalleryOpen){e.isStudioOpen&&e.closeStudio(!1),e.isAuthOpen&&e.closeAuth(!1),e.isAboutOpen&&e.closeAbout(!1),e.isGalleryOpen=!0,e.landingScrollY=window.scrollY,ha().classList.add("route-gallery"),ha().classList.remove("route-studio","route-auth","route-about");try{sessionStorage.setItem("shirt_current_view","gallery"),sessionStorage.removeItem("shirt_auth_tab")}catch{}t&&window.location.hash.toLowerCase()!=="#galeria"&&history.pushState(null,"","#galeria"),(a=e.galleryController)==null||a.open(),e.landingView&&(e.landingView.style.display="none"),e.galleryView&&(e.galleryView.style.display="flex",e.galleryView.scrollTop=0,window.scrollTo(0,0))}}function Hc(e,t=!0){var a;if(e.isGalleryOpen){e.isGalleryOpen=!1,ha().classList.remove("route-gallery");try{sessionStorage.removeItem("shirt_current_view")}catch{}t&&history.pushState(null,"",window.location.pathname),(a=e.galleryController)==null||a.close(),e.galleryView&&(e.galleryView.style.display="none"),!e.isStudioOpen&&!e.isAuthOpen&&e.landingView&&(e.landingView.style.display="block",window.scrollTo(0,e.landingScrollY||0)),window.dispatchEvent(new Event("resize"))}}const pa=()=>document.documentElement;function jc(e,t=!0){var a;if(!e.isAboutOpen){e.isStudioOpen&&e.closeStudio(!1),e.isAuthOpen&&e.closeAuth(!1),e.isGalleryOpen&&e.closeGallery(!1),e.isAboutOpen=!0,e.landingScrollY=window.scrollY,pa().classList.add("route-about"),pa().classList.remove("route-studio","route-auth","route-gallery");try{sessionStorage.setItem("shirt_current_view","about"),sessionStorage.removeItem("shirt_auth_tab")}catch{}t&&window.location.hash.toLowerCase()!=="#conocenos"&&history.pushState(null,"","#conocenos"),(a=e.aboutController)==null||a.open(),e.landingView&&(e.landingView.style.display="none"),e.aboutView&&(e.aboutView.style.display="flex",e.aboutView.scrollTop=0,window.scrollTo(0,0))}}function Vc(e,t=!0){var a;if(e.isAboutOpen){e.isAboutOpen=!1,pa().classList.remove("route-about");try{sessionStorage.removeItem("shirt_current_view")}catch{}t&&history.pushState(null,"",window.location.pathname),(a=e.aboutController)==null||a.close(),e.aboutView&&(e.aboutView.style.display="none"),!e.isStudioOpen&&!e.isAuthOpen&&!e.isGalleryOpen&&e.landingView&&(e.landingView.style.display="block",window.scrollTo(0,e.landingScrollY||0)),window.dispatchEvent(new Event("resize"))}}function Gc(e){document.addEventListener("click",t=>{var s;const a=t.target.closest('[data-action="open-studio"], a[href="#estudio"], a[href="#disenar"]');if(a&&!((s=a.getAttribute("href"))!=null&&s.includes("studio.html"))&&a.getAttribute("target")!=="_blank"){t.preventDefault(),e.openStudio();return}if(t.target.closest('[data-action="open-gallery"], a[href="#galeria"]')){t.preventDefault(),e.openGallery();return}if(t.target.closest('[data-action="open-about"], a[href="#conocenos"], a[href="#nosotros"]')){t.preventDefault(),e.openAbout();return}const i=t.target.closest('[data-action="open-auth"], a[href="#cuenta"], a[href="#login"], a[href="#registro"]');i&&(t.preventDefault(),e.openAuth(i.getAttribute("data-tab")||"login"))})}class Yc{constructor({engine:t,loader:a}){this.engine=t,this.loader=a,this.landingView=document.getElementById("landing-view"),this.studioView=document.getElementById("studio-view"),this.authView=document.getElementById("auth-view"),this.galleryView=document.getElementById("gallery-view"),this.aboutView=document.getElementById("about-view"),this.authController=null,this.galleryController=null,this.aboutController=null,this.isStudioOpen=!1,this.isAuthOpen=!1,this.isGalleryOpen=!1,this.isAboutOpen=!1,this.landingScrollY=0,this.initEvents()}setAuthController(t){this.authController=t}setGalleryController(t){this.galleryController=t}setAboutController(t){this.aboutController=t}openGallery(t=!0){Uc(this,t)}closeGallery(t=!0){Hc(this,t)}openAbout(t=!0){jc(this,t)}closeAbout(t=!0){Vc(this,t)}initEvents(){window.addEventListener("hashchange",()=>{const a=window.location.hash.toLowerCase();a==="#galeria"?this.openGallery(!1):a==="#conocenos"||a==="#nosotros"?this.openAbout(!1):a==="#estudio"||a==="#disenar"?(this.isAuthOpen&&this.closeAuth(!1),this.openStudio()):a==="#cuenta"||a==="#login"||a==="#registro"?(this.isStudioOpen&&this.closeStudio(!1),this.openAuth(a==="#registro"?"register":"login")):(a===""||a==="#"||a==="#hero")&&(this.isStudioOpen&&this.closeStudio(),this.isAuthOpen&&this.closeAuth(),this.isGalleryOpen&&this.closeGallery(!1),this.isAboutOpen&&this.closeAbout(!1))}),Gc(this);const t=document.getElementById("btn-back-to-store");t&&t.addEventListener("click",()=>this.closeStudio()),window.addEventListener("keydown",a=>{if(a.key==="Escape"){if(document.querySelector(".modal-overlay.active, .image-editor-modal.active"))return;this.isAuthOpen?this.closeAuth():this.isGalleryOpen?this.closeGallery():this.isAboutOpen?this.closeAbout():this.isStudioOpen&&this.closeStudio()}})}checkInitialRoute(){var o;const t=(window.location.hash||"").toLowerCase();let a=null,i=null;try{a=sessionStorage.getItem("shirt_current_view"),i=sessionStorage.getItem("shirt_auth_tab")}catch{}if(t.includes("galeria")){this.openGallery(!1);return}if(t.includes("conocenos")||t.includes("nosotros")){this.openAbout(!1);return}const s=t.includes("login")||t.includes("registro")||t.includes("cuenta")||a==="auth",n=t.includes("estudio")||t.includes("disenar")||a==="studio"||document.documentElement.classList.contains("route-studio");if(s){const r=t.includes("registro")||i==="register"?"register":"login";this.openAuth(r,!1)}else n?this.openStudio(!1):a==="gallery"?this.openGallery(!1):a==="about"&&this.openAbout(!1);!this.isStudioOpen&&((o=this.engine)!=null&&o.sceneManager)&&this.engine.sceneManager.stopLoop()}async openStudio(t=!0){var a,i,s;if(!this.isStudioOpen){this.isAuthOpen&&this.closeAuth(!1),this.isStudioOpen=!0,this.isGalleryOpen&&this.closeGallery(!1),this.isAboutOpen&&this.closeAbout(!1),document.documentElement.classList.add("route-studio"),document.documentElement.classList.remove("route-auth");try{sessionStorage.setItem("shirt_current_view","studio"),sessionStorage.removeItem("shirt_auth_tab")}catch{}if(window.location.hash!=="#estudio"&&history.pushState(null,"","#estudio"),t&&this.loader&&await this.loader.play(1350),this.landingView&&(this.landingView.style.display="none"),this.studioView){this.studioView.style.display="flex";const n=this.studioView.querySelector(".studio-fullscreen-workspace");n&&(n.scrollTop=0),window.scrollTo(0,0)}(a=this.engine)!=null&&a.sceneManager&&this.engine.cameraManager&&this.engine.sceneManager.startLoop(this.engine.cameraManager.camera),(s=(i=this.engine)==null?void 0:i.setStudioVisible)==null||s.call(i,!0),setTimeout(()=>{window.dispatchEvent(new Event("resize")),this.engine&&this.engine.sceneManager&&this.engine.sceneManager.handleResize()},60)}}closeStudio(t=!0){var a,i,s;if(this.isStudioOpen){this.isStudioOpen=!1,(a=this.engine)!=null&&a.sceneManager&&this.engine.sceneManager.stopLoop(),document.documentElement.classList.remove("route-studio");try{sessionStorage.removeItem("shirt_current_view")}catch{}t&&history.pushState(null,"",window.location.pathname),this.studioView&&(this.studioView.style.display="none"),(s=(i=this.engine)==null?void 0:i.setStudioVisible)==null||s.call(i,!1),!this.isAuthOpen&&this.landingView&&(this.landingView.style.display="block"),window.dispatchEvent(new Event("resize"))}}openAuth(t="login",a=!0){var i,s;this.isStudioOpen&&this.closeStudio(!1),this.isAuthOpen=!0,this.isGalleryOpen&&this.closeGallery(!1),this.isAboutOpen&&this.closeAbout(!1),document.documentElement.classList.add("route-auth"),document.documentElement.classList.remove("route-studio");try{sessionStorage.setItem("shirt_current_view","auth"),sessionStorage.setItem("shirt_auth_tab",t)}catch{}a&&!window.location.hash.includes(t)&&history.pushState(null,"",`#${t}`),this.authController&&(this.authController.switchTab(t),(s=(i=this.authController).startParticles)==null||s.call(i)),this.landingView&&(this.landingView.style.display="none"),this.authView&&(this.authView.style.display="flex",window.scrollTo(0,0),requestAnimationFrame(()=>{this.authView.classList.add("active")}))}closeAuth(t=!0){var a,i;if(this.isAuthOpen){this.isAuthOpen=!1,document.documentElement.classList.remove("route-auth");try{sessionStorage.removeItem("shirt_current_view"),sessionStorage.removeItem("shirt_auth_tab")}catch{}t&&history.pushState(null,"",window.location.pathname),this.authView&&((i=(a=this.authController)==null?void 0:a.stopParticles)==null||i.call(a),this.authView.classList.remove("active"),setTimeout(()=>{this.isAuthOpen||(this.authView.style.display="none")},260)),!this.isStudioOpen&&this.landingView&&(this.landingView.style.display="block")}}}const zt=12,Vs=(e,t=zt)=>Math.max(1,Math.ceil(e/t)),vi=(e,t,a=zt)=>Math.min(Vs(t,a),Math.max(1,Math.floor(Number(e))||1));function Xc(e,t,a=zt){return t<=0?{from:0,to:0}:{from:(e-1)*a+1,to:Math.min(t,e*a)}}const Wc=(e,t,a=zt)=>e.slice((t-1)*a,t*a);function Zc(e,t){if(t<=7)return Array.from({length:t},(n,o)=>o+1);const i=[...new Set([1,t,e-1,e,e+1])].filter(n=>n>=1&&n<=t).sort((n,o)=>n-o),s=[];return i.forEach((n,o)=>{o&&n-i[o-1]>1&&s.push("…"),s.push(n)}),s}const Qc='<span aria-hidden="true">←</span>',Jc='<span aria-hidden="true">→</span>';function Kc(e,t,a=zt){const i=Vs(t,a),{from:s,to:n}=Xc(e,t,a),o=Zc(e,i).map(r=>r==="…"?'<span class="page-gap" aria-hidden="true">…</span>':`<button type="button" class="page-btn page-num${r===e?" active":""}" data-page="${r}"
        aria-label="Página ${r}"${r===e?' aria-current="page"':""}>${r}</button>`).join("");return`
    <div class="page-controls">
      <button type="button" class="page-btn page-step" data-page="${e-1}" aria-label="Página anterior"${e<=1?" disabled":""}>${Qc} Anterior</button>
      <div class="page-numbers">${o}</div>
      <button type="button" class="page-btn page-step" data-page="${e+1}" aria-label="Página siguiente"${e>=i?" disabled":""}>Siguiente ${Jc}</button>
    </div>
    <p class="page-info" aria-live="polite">Mostrando registros ${s}–${n} de ${t} diseños</p>`}const td=140,bi=e=>String(e??"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim();function ed(e){const t=new Map;e.forEach(i=>t.set(i.category,(t.get(i.category)||0)+1));const a=[...t.keys()].filter(i=>i!==pe);return t.has(pe)&&a.push(pe),a.map(i=>({name:i,count:t.get(i)}))}function ad(e,{q:t="",cat:a="all",sort:i="recent"}={}){const s=bi(t);let n=e.filter(o=>(a==="all"||o.category===a)&&(!s||bi(`${o.title} ${o.category} ${o.author} ${o.description}`).includes(s)));return i==="az"&&(n=[...n].sort((o,r)=>o.title.localeCompare(r.title,"es",{sensitivity:"base"}))),n}const id='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',sd=()=>`
  <header class="studio-app-topbar gallery-topbar">
    <div class="topbar-left-group">
      <button type="button" class="btn-back-to-store" data-gallery="back" title="Volver a la tienda">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span>Volver a la Tienda</span>
      </button>
      <div class="gallery-brand brand-kinetic"><span class="brand-title" style="font-size: 0.95rem;">IMPRNT</span><span class="brand-lab-cyan" style="font-size: 0.74rem;">[LAB]</span><span class="gallery-badge" style="margin-left: 6px;">GALERÍA</span></div>
    </div>
    <button type="button" class="btn-theme-toggle" title="Cambiar tema" aria-label="Cambiar tema"></button>
  </header>
  <main class="gallery-main">
    <div class="gallery-head">
      <span class="section-eyebrow">BIBLIOTECA COMPLETA</span>
      <h1 class="gallery-title">Galería de Diseños</h1>
      <p class="gallery-lead">Todos los drops oficiales y los diseños públicos de la comunidad. Pruébalos en tu camiseta con un clic.</p>
    </div>
    <div class="gallery-controls">
      <label class="gallery-search">${id}
        <input type="search" id="gallery-search" placeholder="Buscar por nombre, estilo o @alias…" aria-label="Buscar diseños" autocomplete="off" />
      </label>
      <label class="gallery-sort"><span>Orden</span>
        <select id="gallery-sort" aria-label="Ordenar diseños"><option value="recent">Más recientes</option><option value="az">Nombre A–Z</option></select>
      </label>
    </div>
    <div class="gallery-filters" id="gallery-filters" role="group" aria-label="Filtrar por categoría"></div>
    <p class="gallery-count" id="gallery-count" aria-live="polite"></p>
    <div class="lookbook-grid gallery-grid" id="gallery-grid"></div>
    <p class="gallery-empty" id="gallery-empty" role="status" hidden>No encontramos diseños con esos filtros. Prueba con otra búsqueda o categoría.</p>
    <nav class="gallery-pagination" id="gallery-pagination" aria-label="Paginación de la galería" hidden></nav>
  </main>`;function nd(e,t){const a={q:"",cat:"all",sort:"recent",page:1,list:[]};let i=!1,s=!1,n=0;const o=f=>e.querySelector(f);function r(f){const y=ed(f);a.cat!=="all"&&!y.some(w=>w.name===a.cat)&&(a.cat="all");const v=(w,b,x)=>`<button type="button" class="filter-pill-btn${a.cat===w?" active":""}"
      data-cat="${I(w)}" aria-pressed="${a.cat===w}">${I(b)} <span class="pill-count">${x}</span></button>`;o("#gallery-filters").innerHTML=v("all","Ver Todos",f.length)+y.map(w=>v(w.name,w.name,w.count)).join("")}function l(){const f=we().length,y=a.list.length;o("#gallery-count").textContent=`${y} ${y===1?"diseño":"diseños"}${y===f?"":` (${f} en total)`}`,o("#gallery-empty").hidden=y>0}function c(){const f=o("#gallery-pagination");f.hidden=a.list.length<=zt,f.innerHTML=f.hidden?"":Kc(a.page,a.list.length)}function d(){a.page=vi(a.page,a.list.length),o("#gallery-grid").innerHTML=Wc(a.list,a.page).map(Os).join(""),l(),c()}function g(f=1){const y=we();r(y),a.list=ad(y,a),a.page=f,d()}function p(f){var v;const y=vi(f,a.list.length);y!==a.page&&(a.page=y,d(),e.scrollTop=0,(v=o("#gallery-pagination .page-num.active"))==null||v.focus({preventScroll:!0}))}function h(){e.innerHTML=sd(),i=!0,o("#gallery-search").addEventListener("input",f=>{clearTimeout(n),n=setTimeout(()=>{a.q=f.target.value,g()},td)}),o("#gallery-sort").addEventListener("change",f=>{a.sort=f.target.value,g()}),o("#gallery-filters").addEventListener("click",f=>{const y=f.target.closest("[data-cat]");y&&(a.cat=y.dataset.cat,g())}),e.addEventListener("click",f=>{var y;f.target.closest('[data-gallery="back"]')&&((y=t==null?void 0:t.closeGallery)==null||y.call(t))}),o("#gallery-pagination").addEventListener("click",f=>{const y=f.target.closest("[data-page]");y&&!y.disabled&&p(Number(y.dataset.page))}),zs(e,_s)}let u=0;const m=()=>{s&&(clearTimeout(u),u=setTimeout(()=>g(a.page),60))};return window.addEventListener("vault:changed",m),window.addEventListener("reports:changed",m),window.addEventListener("storage",f=>{(!f.key||f.key==="shirt_user_vault_db"||f.key==="shirt_reported_content")&&m()}),{open(){i||h(),s=!0,g(),xe(document.documentElement.getAttribute("data-theme")||"dark",!1),e.scrollTop=0},close(){s=!1}}}function od(e){if(!e)return;let t="man",a="black";const i=[{key:"black",name:"Negro Grafito",hex:"#121214"},{key:"white",name:"Blanco Puro",hex:"#ffffff"},{key:"carbon",name:"Gris Carbón",hex:"#2b2a33"},{key:"green",name:"Verde Bosque",hex:"#203328"},{key:"navy",name:"Azul Marino",hex:"#1e293b"}],s=ft[0],n="data:image/svg+xml;utf8,"+encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <linearGradient id="mugBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#1e222d"/>
          <stop offset="35%" stop-color="#2e3444"/>
          <stop offset="75%" stop-color="#141720"/>
          <stop offset="100%" stop-color="#0b0d13"/>
        </linearGradient>
        <linearGradient id="mugRim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
        <radialGradient id="heatGlow" cx="50%" cy="65%" r="48%">
          <stop offset="0%" stop-color="#ff5722" stop-opacity="0.38"/>
          <stop offset="100%" stop-color="#ff5722" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="190" cy="220" r="150" fill="url(#heatGlow)"/>
      <!-- Asa derecha -->
      <path d="M 272 135 C 342 135, 342 285, 272 285" fill="none" stroke="#181b24" stroke-width="26" stroke-linecap="round"/>
      <path d="M 272 135 C 332 135, 332 285, 272 285" fill="none" stroke="#2d3343" stroke-width="8" stroke-linecap="round"/>
      <!-- Cuerpo cilíndrico 11 Oz -->
      <rect x="95" y="92" width="185" height="228" rx="18" fill="url(#mugBody)" stroke="rgba(255,87,34,0.45)" stroke-width="2"/>
      <!-- Boca interior de porcelana blanca -->
      <ellipse cx="187.5" cy="94" rx="91" ry="18" fill="url(#mugRim)" stroke="#334155" stroke-width="2"/>
      <!-- Onda termosensible -->
      <path d="M 96 235 Q 142 222, 188 235 T 279 232 L 279 304 Q 279 318, 264 318 L 111 318 Q 96 318, 96 304 Z" fill="rgba(255,87,34,0.18)"/>
      <path d="M 96 235 Q 142 222, 188 235 T 279 232" fill="none" stroke="#ff6d3a" stroke-width="3"/>
    </svg>
  `);function o(g,p){return g==="mug"?n:tt(`assets/showcase/shirt_${g}_${p}.webp`)}function r(){return t==="mug"?"TAZA 11 OZ • CLÁSICA & MÁGICA":t==="man"?"HOMBRE • BOXY FIT OVERSIZE":"MUJER • SLIM FIT ENTALLADO"}function l(){return t==="mug"?"✨ REVELA CON CALOR":t==="man"?"★ CORTE STREETWEAR":"★ SILUETA FEMENINA"}function c(){e.innerHTML=`
      <div class="hero-showcase-wrapper">
        <div class="hero-showcase-stage" id="hero-stage-card">
          <!-- Barra Superior del Showcase -->
          <div class="stage-header-row">
            <div class="stage-top-badge">
              <span class="stage-live-dot"></span>
              <span id="showcase-badge-title">${r()}</span>
            </div>
            <div class="stage-tech-tag" id="showcase-tech-tag">${l()}</div>
          </div>

          <!-- Selector Rápido de Producto (Hombre / Mujer / Taza 11 Oz) -->
          <div class="showcase-controls-stack">
            <div class="showcase-gender-bar" role="group" aria-label="Selección de producto">
              <button type="button" class="gender-btn ${t==="man"?"active":""}" data-gender="man">
                <span>👕 Hombre</span>
              </button>
              <button type="button" class="gender-btn ${t==="woman"?"active":""}" data-gender="woman">
                <span>👚 Mujer</span>
              </button>
              <button type="button" class="gender-btn ${t==="mug"?"active":""}" data-gender="mug">
                <span>☕ Taza 11 Oz</span>
              </button>
            </div>
          </div>

          <!-- Prenda / Taza 3D Renderizada con Logo Oficial -->
          <div class="showcase-shirt-container">
            <img 
              id="hero-shirt-img" 
              src="${o(t,a)}" 
              alt="Producto Oficial IMPRNT [LAB]"
              class="showcase-shirt-render"
              loading="eager"
            />

            <!-- Logo Oficial de la Empresa -->
            <div class="showcase-shirt-art brand-logo-art" title="${(s==null?void 0:s.name)||"IMPRNT [LAB]"}">
              ${s!=null&&s.src?`<img src="${s.src}" alt="${s.name}" style="width:100%;height:100%;object-fit:contain;" />`:s?s.svg:""}
            </div>
          </div>

          <!-- Selector de Colores en Tiempo Real -->
          <div class="showcase-color-bar" title="Cambiar color base">
            ${i.map(g=>`
              <button 
                type="button" 
                class="showcase-color-btn ${a===g.key?"active":""}" 
                data-key="${g.key}" 
                data-hex="${g.hex}" 
                style="background-color: ${g.hex};" 
                title="${g.name}">
              </button>
            `).join("")}
          </div>

          <!-- Botón de Acción Directo al Estudio 3D -->
          <button type="button" class="showcase-action-btn" data-action="open-studio">
            <span id="showcase-cta-label">Personalizar en Estudio 3D</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    `,d()}function d(){const g=e.querySelector("#hero-stage-card"),p=e.querySelector("#hero-shirt-img"),h=e.querySelector("#showcase-badge-title"),u=e.querySelector("#showcase-tech-tag"),m=e.querySelector("#showcase-cta-label"),f=e.querySelectorAll(".showcase-color-btn"),y=e.querySelectorAll(".gender-btn");function v(){h&&(h.textContent=r()),u&&(u.textContent=l()),m&&(m.textContent=t==="mug"?"☕ Personalizar Taza 11 Oz en 3D":"Personalizar en Estudio 3D")}y.forEach(b=>{b.addEventListener("click",()=>{const x=b.getAttribute("data-gender");t=x,Ni(x),y.forEach(E=>E.classList.toggle("active",E===b)),v(),w()})}),f.forEach(b=>{b.addEventListener("click",()=>{const x=b.getAttribute("data-key"),E=b.getAttribute("data-hex");a=x,f.forEach(M=>M.classList.toggle("active",M===b)),w();const S=Pt.find(M=>M.hex.toLowerCase()===E.toLowerCase());S&&ge(S)})});function w(){if(!p)return;const b=o(t,a);p.style.opacity="0.6",p.src=b,p.onload=()=>{p.style.opacity="1"}}g&&(g.addEventListener("mousemove",b=>{const x=g.getBoundingClientRect(),E=b.clientX-x.left-x.width/2,M=(b.clientY-x.top-x.height/2)/x.height*-8,A=E/x.width*8;g.style.transform=`perspective(800px) rotateX(${M.toFixed(2)}deg) rotateY(${A.toFixed(2)}deg)`}),g.addEventListener("mouseleave",()=>{g.style.transform="perspective(800px) rotateX(0deg) rotateY(0deg)"}))}c()}function It(e,t,a,{id:i="",extra:s="",danger:n=!1}={}){return`
    <button type="button" class="btn-dropdown-action um-item${n?" btn-dropdown-logout um-danger":""}"
      role="menuitem" data-action="${e}"${i?` id="${i}"`:""}>
      <span class="um-item-icon">${Z[t](18)}</span>
      <span class="um-item-label">${a}</span>${s}
    </button>`}function rd(e,t){const a=I(e.name||e.email),i=I(e.email),s=I(Mt(e.alias)),n=I((e.name||e.email||"U").trim().charAt(0).toUpperCase()),o=!!e.twoFactorEnabled,r=!e.phone||!e.address,l=c=>e.picture?`<img src="${I(e.picture)}" alt="" class="${c}" referrerpolicy="no-referrer" />`:`<div class="${c}">${n}</div>`;return`
    <div class="nav-user-chip" id="btn-toggle-user-menu" role="button" tabindex="0"
      aria-haspopup="menu" aria-expanded="${t}" aria-controls="user-profile-dropdown">
      ${l("nav-user-avatar")}
      <span class="nav-user-name">${a}</span>${s?`<span class="nav-user-alias">${s}</span>`:""}
      <span class="nav-user-caret">${Z.chevron(14)}</span>
    </div>

    <div class="nav-user-dropdown ${t?"open":""}" id="user-profile-dropdown" role="menu" aria-label="Menú de cuenta">
      <div class="dropdown-user-header">
        ${l("um-avatar")}
        <div class="um-identity">
          <div class="um-name">${a}</div>${s?`<div class="um-alias">${s}</div>`:""}
          <div class="dropdown-email">${i}</div>
        </div>
      </div>

      <div class="dropdown-2fa-badge">
        <div class="um-2fa-text">
          <span class="um-2fa-title">Seguridad 2FA Telegram</span>
          <span class="um-2fa-sub">${e.telegramId?"ID: "+I(e.telegramId):"Sin vincular"}</span>
        </div>
        <span class="badge-2fa-status ${o?"status-active":"status-inactive"}">
          ${o?Z.check(12)+"ACTIVO":Z.cross(12)+"INACTIVO"}
        </span>
      </div>

      <div class="um-list">
        ${It("open-profile","user","Mi Perfil &amp; Datos de Envío",{extra:r?'<span class="um-pill">Completar</span>':""})}
        ${It("open-vault","vault","Mi Bóveda de Diseños")}
        ${It("open-orders","box","Mis Pedidos",{id:"btn-dropdown-orders"})}
        ${It("toggle-2fa","shield",o?"Desactivar 2FA Telegram":"Configurar 2FA Telegram",{id:"btn-toggle-2fa"})}
        ${It("open-terms","scale","Términos &amp; Propiedad Intelectual")}
      </div>
      <div class="um-sep" role="separator"></div>
      ${It("logout","logout","Cerrar Sesión",{id:"btn-logout",danger:!0})}
    </div>`}class ld{constructor(t,a=null){this.mount=t,this.router=a,this.isOpen=!1,this.init()}setRouter(t){this.router=t}init(){this.render(),Ll(),_.subscribe(()=>this.render()),document.addEventListener("click",t=>{this.mount.contains(t.target)||this.closeDropdown()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&this.isOpen&&this.closeDropdown()})}render(){const t=_.getCurrentUser();this.mount.innerHTML="";const a=document.createElement("div");if(a.className="nav-auth-container",!t)a.innerHTML=`
        <button class="btn-nav-login" id="btn-open-login" title="Iniciar sesión o registrarte">
          <svg class="nav-login-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"/></svg>
          <span class="nav-login-label">Iniciar Sesión</span>
        </button>
      `,a.querySelector("#btn-open-login").addEventListener("click",()=>{this.router?this.router.openAuth("login"):window.location.hash="#login"});else{a.innerHTML=rd(t,this.isOpen);const i=a.querySelector("#btn-toggle-user-menu"),s=o=>{var r;o.stopPropagation(),this.isOpen=!this.isOpen,this.render(),o.type==="keydown"&&((r=this.mount.querySelector("#btn-toggle-user-menu"))==null||r.focus())};i.addEventListener("click",s),i.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),s(o))});const n={"open-profile":()=>{this.closeDropdown(),Ds()},"open-vault":()=>{this.closeDropdown(),Ps({router:this.router})},"open-orders":()=>{this.closeDropdown(),Se()},"toggle-2fa":()=>this.handleToggle2fa(t),"open-terms":()=>{this.closeDropdown(),Pa()},logout:()=>{_.logout(),this.closeDropdown()}};a.querySelector("#user-profile-dropdown").addEventListener("click",o=>{var l;const r=(l=o.target.closest("[data-action]"))==null?void 0:l.dataset.action;r&&n[r]&&n[r]()})}this.mount.appendChild(a)}async handleToggle2fa(t){if(t.twoFactorEnabled)confirm("¿Deseas desactivar la verificación en dos pasos (2FA)?")&&(await _.update2faSettings({enabled:!1}),alert("2FA Desactivado."));else{const a=prompt(`Ingresa tu Chat ID de Telegram para vincular tu cuenta.
(Escribe /start en @Notificaciones_inc_bot para obtenerlo):`,t.telegramId||"");if(a&&a.trim().length>=5)try{await Wt.sendVerificationCode({telegramId:a.trim(),userName:t.name,userId:t.id,isActivation:!0});const i=prompt(`¡Código enviado a tu Telegram!
Ingresa los 6 dígitos para confirmar la activación:`),s=Wt.verifyCode(t.id,i);s.valid?(await _.update2faSettings({enabled:!0,telegramId:a.trim()}),alert("¡Excelente! 2FA activado con éxito con tu Telegram.")):alert(s.error||"Código incorrecto. No se pudo activar.")}catch(i){alert("Error conectando con Telegram: "+i.message)}}this.closeDropdown()}closeDropdown(){this.isOpen=!1;const t=this.mount.querySelector("#user-profile-dropdown");t&&t.classList.remove("open")}}function cd(e,t=null){return new ld(e,t)}const yi='<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>',wi='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';function dd(){return`
    <!-- Controles Superiores Flotantes (Sin Barra Horizontal) -->
    <button type="button" class="btn-floating-back" id="btn-auth-back-store" title="Volver a la tienda">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      <span>Volver a la Tienda</span>
    </button>
    <div class="floating-theme-wrap">
      <button type="button" class="btn-floating-theme btn-theme-toggle" id="btn-auth-theme-toggle" title="Cambiar tema"></button>
    </div>

    <main class="auth-main-container">
      <div class="sliding-box" id="sliding-auth-card">
        <!-- Columna Formulario 1: Iniciar Sesión (Izquierda) -->
        <div class="form-container sign-in-container">
          <canvas class="auth-particles-bg" id="auth-particles-signin"></canvas>
          <div class="form-content-wrap" id="signin-form-box">
            <h1 class="auth-form-title">Bienvenido de Nuevo</h1>
            <p class="auth-form-subtitle">Ingresa para continuar personalizando y gestionando tus pedidos.</p>

            <button type="button" class="btn-google-row" id="btn-login-google">
              ${yi}
              <span>Continuar con Google</span>
            </button>

            <div class="divider-line"><span>o con tu correo</span></div>
            <div id="login-alert-box" class="auth-alert"></div>

            <form id="form-auth-login">
              <div class="field-group">
                <label class="field-label"><span>Correo electrónico</span></label>
                <div class="input-icon-wrap">
                  <svg class="field-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input type="email" id="login-email" class="input-styled with-icon" placeholder="tu@correo.com" required autocomplete="email" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">
                  <span>Contraseña</span>
                  <a href="#" id="link-forgot-pass" class="link-subtle">¿Olvidaste tu contraseña?</a>
                </label>
                <div class="input-icon-wrap">
                  <svg class="field-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type="password" id="login-password" class="input-styled with-icon with-toggle" placeholder="••••••••" required autocomplete="current-password" />
                  <button type="button" class="btn-toggle-pass" data-target="login-password" title="Ver contraseña">👁️</button>
                </div>
              </div>
              <button type="submit" class="btn-primary-gradient" id="btn-submit-login">
                <span>Entrar a Diseñar</span>
                ${wi}
              </button>
            </form>
            <p class="mobile-auth-switch">¿No tienes cuenta? <a href="#" id="link-mob-signup">Crear cuenta</a></p>
          </div>

          <!-- Desafío 2FA Telegram -->
          <div id="auth-2fa-wrapper" class="auth-2fa-container form-content-wrap">
            <div class="otp-badge-icon">🛡️</div>
            <h2 class="auth-form-title">Verificación 2FA</h2>
            <p class="auth-form-subtitle">Ingresa los 6 dígitos enviados a tu Telegram <strong>@Notificaciones_inc_bot</strong>.</p>
            <input type="text" id="auth-otp-input" class="input-styled auth-otp-input" maxlength="6" placeholder="000000" autocomplete="one-time-code" />
            <button type="button" class="btn-primary-gradient" id="btn-verify-otp">Verificar Código →</button>
            <button type="button" id="btn-cancel-otp" class="btn-link-subtle">← Volver al inicio de sesión</button>
          </div>
        </div>

        <!-- Columna Formulario 2: Crear Cuenta (Derecha) -->
        <div class="form-container sign-up-container">
          <canvas class="auth-particles-bg" id="auth-particles-signup"></canvas>
          <div class="form-content-wrap">
            <h1 class="auth-form-title">Crear mi Cuenta</h1>
            <p class="auth-form-subtitle">Personaliza en 3D desde 1 unidad con algodón 240g.</p>

            <button type="button" class="btn-google-row" id="btn-register-google">
              ${yi}
              <span>Registrarme con Google</span>
            </button>

            <div class="divider-line"><span>o con tu correo</span></div>
            <div id="reg-alert-box" class="auth-alert"></div>

            <form id="form-auth-register">
              <div class="field-group">
                <label class="field-label"><span>Nombre completo</span></label>
                <div class="input-icon-wrap">
                  <svg class="field-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input type="text" id="reg-name" class="input-styled with-icon" placeholder="Ej. Camila Silva" required autocomplete="name" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label"><span>Correo electrónico</span></label>
                <div class="input-icon-wrap">
                  <svg class="field-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input type="email" id="reg-email" class="input-styled with-icon" placeholder="tu@correo.com" required autocomplete="email" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label"><span>Contraseña</span></label>
                <div class="input-icon-wrap">
                  <svg class="field-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type="password" id="reg-password" class="input-styled with-icon with-toggle" placeholder="Mínimo 6 caracteres" required minlength="6" autocomplete="new-password" />
                  <button type="button" class="btn-toggle-pass" data-target="reg-password" title="Ver contraseña">👁️</button>
                </div>
              </div>
              <div class="field-group">
                <label class="field-label"><span>Telegram Chat ID (Opcional)</span></label>
                <div class="input-icon-wrap">
                  <svg class="field-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  <input type="text" id="reg-telegram" class="input-styled with-icon" placeholder="Ej. 123456789 (/start en @Notificaciones_inc_bot)" />
                </div>
                <span class="field-helper">💡 Activa 2FA gratis y avisos de despacho directos.</span>
              </div>
              <button type="submit" class="btn-primary-gradient" id="btn-submit-reg">
                <span>Crear Cuenta y Comenzar</span>
                ${wi}
              </button>
            </form>
            <p class="mobile-auth-switch">¿Ya tienes cuenta? <a href="#" id="link-mob-signin">Iniciar sesión</a></p>
          </div>
        </div>

        <!-- Columna Gráfica: Overlay Deslizante con Imagen de Fondo y Parallax -->
        <div class="overlay-container">
          <div class="overlay">
            <!-- Panel Izquierdo (Modo Registro activo -> muestra "¿Ya tienes cuenta?") -->
            <div class="overlay-panel overlay-left">
              <div class="overlay-content-wrap">
                <span class="overlay-badge">✦ MIEMBRO ATELIER</span>
                <h2 class="overlay-title">¿Ya tienes cuenta?</h2>
                <p class="overlay-desc">Inicia sesión para retomar tus proyectos 3D, consultar tus pedidos y acceder a precios VIP de taller.</p>
                <div class="overlay-feature-tags">
                  <span class="overlay-tag">🎨 Diseños Guardados</span>
                  <span class="overlay-tag">🛡️ 2FA Telegram</span>
                  <span class="overlay-tag">⚡ Pedidos 1-Clic</span>
                </div>
                <button type="button" class="btn-ghost-pill" id="btn-slide-to-signin">Iniciar Sesión</button>
              </div>
            </div>

            <!-- Panel Derecho (Modo Login activo -> muestra "¡Hola, Diseñador!") -->
            <div class="overlay-panel overlay-right">
              <div class="overlay-content-wrap">
                <span class="overlay-badge">✦ COMUNIDAD EXCLUSIVA</span>
                <h2 class="overlay-title">¡Hola, Diseñador!</h2>
                <p class="overlay-desc">Crea tu cuenta gratis para personalizar camisetas Heavyweight de 240g con estampados DTF Ultra HD desde 1 unidad.</p>
                <div class="overlay-feature-tags">
                  <span class="overlay-tag">🧵 Algodón 240 GSM</span>
                  <span class="overlay-tag">✨ DTF Ultra HD</span>
                  <span class="overlay-tag">📦 Despacho Express</span>
                </div>
                <button type="button" class="btn-ghost-pill" id="btn-slide-to-signup">Crear Cuenta</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `}class xi{constructor(t){this.canvas=t,this.ctx=t==null?void 0:t.getContext("2d"),this.particles=[],this.numParticles=36,this.animId=null,this.mouse={x:-1e3,y:-1e3,radius:90},this.isRunning=!1,this.ctx&&this.init()}init(){this.resize(),this.createParticles(),this.initEvents()}initEvents(){var t,a;window.addEventListener("resize",()=>this.resize()),window.addEventListener("themechange",()=>this.createParticles()),(t=this.canvas.parentElement)==null||t.addEventListener("mousemove",i=>{const s=this.canvas.getBoundingClientRect();this.mouse.x=i.clientX-s.left,this.mouse.y=i.clientY-s.top}),(a=this.canvas.parentElement)==null||a.addEventListener("mouseleave",()=>{this.mouse.x=-1e3,this.mouse.y=-1e3})}resize(){var i;if(!this.canvas||!this.ctx)return;const t=((i=this.canvas.parentElement)==null?void 0:i.getBoundingClientRect())||{width:500,height:800},a=Math.min(window.devicePixelRatio||1,2);this.canvas.width=t.width*a,this.canvas.height=t.height*a,this.ctx.scale(a,a),this.width=t.width,this.height=t.height}createParticles(){this.particles=[];const t=["rgba(0, 240, 255, ","rgba(168, 85, 247, ","rgba(255, 87, 34, ","rgba(255, 255, 255, "],a=["rgba(99, 102, 241, ","rgba(255, 87, 34, ","rgba(71, 85, 105, ","rgba(148, 163, 184, "],s=document.documentElement.getAttribute("data-theme")==="light"?a:t;for(let n=0;n<this.numParticles;n++)this.particles.push({x:Math.random()*(this.width||500),y:Math.random()*(this.height||800),vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,radius:Math.random()*2+.8,colorPrefix:s[Math.floor(Math.random()*s.length)],alpha:Math.random()*.5+.2,pulseSpeed:.015+Math.random()*.02,pulseVal:Math.random()*Math.PI})}start(){this.isRunning||(this.isRunning=!0,this.resize(),this.animate())}stop(){this.isRunning=!1,this.animId&&(cancelAnimationFrame(this.animId),this.animId=null)}animate(){if(!this.isRunning||!this.ctx)return;this.ctx.clearRect(0,0,this.width,this.height);const t=document.documentElement.getAttribute("data-theme")==="light",a=t?"rgba(99, 102, 241, ":"rgba(255, 255, 255, ";for(let i=0;i<this.particles.length;i++){const s=this.particles[i];s.x+=s.vx,s.y+=s.vy,s.x<0&&(s.x=this.width),s.x>this.width&&(s.x=0),s.y<0&&(s.y=this.height),s.y>this.height&&(s.y=0),s.pulseVal+=s.pulseSpeed;const n=s.alpha*(.6+.4*Math.sin(s.pulseVal)),o=this.mouse.x-s.x,r=this.mouse.y-s.y,l=Math.sqrt(o*o+r*r);if(l<this.mouse.radius){const c=(1-l/this.mouse.radius)*1.5;s.x-=o/l*c,s.y-=r/l*c}this.ctx.beginPath(),this.ctx.arc(s.x,s.y,s.radius,0,Math.PI*2),this.ctx.fillStyle=`${s.colorPrefix}${n})`,this.ctx.fill();for(let c=i+1;c<this.particles.length;c++){const d=this.particles[c],g=Math.hypot(s.x-d.x,s.y-d.y);if(g<85){const p=(1-g/85)*(t?.08:.05);this.ctx.beginPath(),this.ctx.moveTo(s.x,s.y),this.ctx.lineTo(d.x,d.y),this.ctx.strokeStyle=`${a}${p})`,this.ctx.lineWidth=.75,this.ctx.stroke()}}}this.animId=requestAnimationFrame(()=>this.animate())}}class ud{constructor(t,a){this.mount=t,this.router=a,this.currentTab="login",this.pending2faUser=null,this.particlesSignin=null,this.particlesSignup=null,this.render(),this.initParticles(),this.initEvents()}render(){this.mount.innerHTML=dd()}initParticles(){var i;const t=this.mount.querySelector("#auth-particles-signin"),a=this.mount.querySelector("#auth-particles-signup");t&&(this.particlesSignin=new xi(t)),a&&(this.particlesSignup=new xi(a)),(i=this.particlesSignin)==null||i.start()}initEvents(){var a,i,s,n,o,r,l,c,d,g,p,h,u;(a=this.mount.querySelector("#btn-slide-to-signup"))==null||a.addEventListener("click",()=>this.switchTab("register")),(i=this.mount.querySelector("#btn-slide-to-signin"))==null||i.addEventListener("click",()=>this.switchTab("login")),(s=this.mount.querySelector("#link-mob-signup"))==null||s.addEventListener("click",m=>{m.preventDefault(),this.switchTab("register")}),(n=this.mount.querySelector("#link-mob-signin"))==null||n.addEventListener("click",m=>{m.preventDefault(),this.switchTab("login")}),(o=this.mount.querySelector("#btn-auth-back-store"))==null||o.addEventListener("click",()=>{var m;return(m=this.router)==null?void 0:m.closeAuth()}),(r=this.mount.querySelector("#link-forgot-pass"))==null||r.addEventListener("click",m=>m.preventDefault()),this.mount.querySelectorAll(".btn-toggle-pass").forEach(m=>{m.addEventListener("click",()=>{const f=this.mount.querySelector(`#${m.dataset.target}`);if(!f)return;const y=f.type==="password";f.type=y?"text":"password",m.textContent=y?"🔒":"👁️"})});const t=()=>{var m;_.loginWithGoogle({name:"Diseñador Studio",email:"designer.studio@gmail.com",picture:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}),R("¡Bienvenido! Sesión iniciada con Google"),(m=this.router)==null||m.closeAuth()};(l=this.mount.querySelector("#btn-login-google"))==null||l.addEventListener("click",t),(c=this.mount.querySelector("#btn-register-google"))==null||c.addEventListener("click",t),(d=this.mount.querySelector("#form-auth-login"))==null||d.addEventListener("submit",async m=>{var v;m.preventDefault(),this.clearAlert("login");const f=this.mount.querySelector("#login-email").value.trim(),y=this.mount.querySelector("#login-password").value;try{const w=await _.login({email:f,password:y});w.requires2fa?this.start2faChallenge(w):(R("¡Sesión iniciada con éxito!"),(v=this.router)==null||v.closeAuth())}catch(w){this.showAlert(w.message||"Credenciales inválidas","login")}}),(g=this.mount.querySelector("#form-auth-register"))==null||g.addEventListener("submit",async m=>{var b;m.preventDefault(),this.clearAlert("reg");const f=this.mount.querySelector("#reg-name").value.trim(),y=this.mount.querySelector("#reg-email").value.trim(),v=this.mount.querySelector("#reg-password").value,w=this.mount.querySelector("#reg-telegram").value.trim();try{await _.register({name:f,email:y,password:v,telegramId:w}),R("¡Cuenta creada con éxito! Bienvenido al Atelier"),(b=this.router)==null||b.closeAuth()}catch(x){this.showAlert(x.message||"Error al registrar usuario","reg")}}),(p=this.mount.querySelector("#btn-verify-otp"))==null||p.addEventListener("click",()=>this.handleOtpVerify()),(h=this.mount.querySelector("#auth-otp-input"))==null||h.addEventListener("keydown",m=>{m.key==="Enter"&&this.handleOtpVerify()}),(u=this.mount.querySelector("#btn-cancel-otp"))==null||u.addEventListener("click",()=>this.exit2faChallenge()),this.updateThemeIcon(),window.addEventListener("themechange",()=>this.updateThemeIcon())}switchTab(t){var i,s,n;this.currentTab=t,(i=this.mount.querySelector("#sliding-auth-card"))==null||i.classList.toggle("right-panel-active",t==="register");try{sessionStorage.setItem("shirt_auth_tab",t)}catch{}const a=t==="register"?"#registro":"#login";window.location.hash!==a&&history.replaceState(null,"",a),t==="register"?(s=this.particlesSignup)==null||s.start():(n=this.particlesSignin)==null||n.start()}startParticles(){var t,a;(t=this.particlesSignin)==null||t.start(),(a=this.particlesSignup)==null||a.start()}stopParticles(){var t,a;(t=this.particlesSignin)==null||t.stop(),(a=this.particlesSignup)==null||a.stop()}start2faChallenge(t){this.pending2faChallenge=t,this.mount.querySelector("#signin-form-box").style.display="none",this.mount.querySelector("#auth-2fa-wrapper").classList.add("active"),setTimeout(()=>{var a;return(a=this.mount.querySelector("#auth-otp-input"))==null?void 0:a.focus()},80)}exit2faChallenge(){this.pending2faChallenge=null,this.mount.querySelector("#signin-form-box").style.display="flex",this.mount.querySelector("#auth-2fa-wrapper").classList.remove("active")}async handleOtpVerify(){var a;if(!this.pending2faChallenge)return;const t=this.mount.querySelector("#auth-otp-input").value.trim();try{await _.complete2faLogin(this.pending2faChallenge.userId,t),R("¡Verificación 2FA correcta! Bienvenido"),this.exit2faChallenge(),(a=this.router)==null||a.closeAuth()}catch(i){alert(i.message||"Código incorrecto")}}showAlert(t,a){const i=this.mount.querySelector(`#${a}-alert-box`);i&&(i.textContent=t,i.className="auth-alert error")}clearAlert(t){const a=this.mount.querySelector(`#${t}-alert-box`);a&&(a.textContent="",a.className="auth-alert")}updateThemeIcon(){const t=(document.documentElement.getAttribute("data-theme")||"dark")==="dark",a=this.mount.querySelector("#btn-auth-theme-toggle");a&&(a.innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">${t?'<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>':'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'}</svg>`,a.setAttribute("title",t?"Cambiar a Modo Claro":"Cambiar a Modo Oscuro"))}}function hd(e){if(!e)return;const t=[{id:"cotton",badge:"240 GSM Heavyweight",image:tt("assets/features/feature_cotton.webp"),alt:"Macro fotografía de tejido cerrado de algodón 240g",icon:"🧵",title:"Algodón 100% Peinado",desc:"Tejido cerrado con caída pesada estructurada (180g y 240g) y cuello rib cerrado de 3 cm indeformable.",tags:["Caída Pesada","Cuello Rib 3cm"]},{id:"microfiber",badge:"Dry-Fit Performance",image:tt("assets/features/feature_microfiber.webp"),alt:"Deportista en carrera con camiseta de microfibra dry-fit transpirable",icon:"⚡",title:"Poliéster Dry-Fit (120g/180g)",desc:"Microfibra deportiva transpirable ultra liviana de secado rápido, elasticidad mecánica y frescura para alto rendimiento.",tags:["Microfibra Pro","Secado Rápido"]},{id:"dtf_drops",badge:"Microgotas 1200 DPI",image:tt("assets/features/feature_dtf_drops.webp"),alt:"Cabezal de impresión DTF proyectando microgotas de tinta textil",icon:"🎨",title:"Cero Límite de Colores",desc:"Impresión digital con microgotas de tinta textil. Reproduce gradientes fotográficos, ilustraciones complejas y tipografías ultra finas.",tags:["Full Color HD","Gradientes Vivos"]},{id:"durability",badge:"Curado Térmico 160°C",image:tt("assets/features/feature_durability.webp"),alt:"Prueba de elasticidad y termocurado de poliamida DTF",icon:"🛡️",title:"+60 Lavados Intactos",desc:"Poliamida elástica de curado térmico. El estampado se estira con la tela y resiste lavadoras sin cuartearse ni perder tono.",tags:["Anti-Cuarteo","Elongación Máxima"]}];e.innerHTML=`
    <section class="features-section" id="calidad">
      <div class="landing-container">
        <div class="section-header-box">
          <span class="section-eyebrow">TECNOLOGÍA & MATERIALES TEXTILES</span>
          <h2 class="section-title">Algodón, Poliéster y DTF de Grado Superior</h2>
          <p class="section-description">Prendas confeccionadas en múltiples gramajes y fibras técnicas con impresión digital directa al film curada a 160°C.</p>
        </div>
        <div class="features-grid">
          ${t.map(a=>`
            <article class="feature-card" data-feature="${a.id}">
              <div class="feature-card-media">
                <img src="${a.image}" alt="${a.alt}" class="feature-card-img" width="400" height="250" loading="lazy" decoding="async" />
                <div class="feature-card-overlay"></div>
                <span class="feature-badge">${a.badge}</span>
              </div>
              <div class="feature-card-body">
                <div class="feature-title-row">
                  <span class="feature-mini-icon">${a.icon}</span>
                  <h3 class="feature-title">${a.title}</h3>
                </div>
                <p class="feature-description">${a.desc}</p>
                <div class="feature-tags-row">
                  ${a.tags.map(i=>`<span class="feature-pill-tag">${i}</span>`).join("")}
                </div>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `}const pd="La Nueva Era del ",md="Streetwear On-Demand & Prototipado 3D",gd="En <strong>IMPRNT [LAB]</strong> fusionamos computación gráfica WebGL en tiempo real, inteligencia artificial y confección textil de alto gramaje para transformar cómo creas y vistes tu propia marca.",fd=[{id:"identity",icon:"🏛️",tag:"IDENTIDAD",title:"¿Quiénes Somos?",desc:"Somos un laboratorio colombiano de manufactura textil bajo demanda y prototipado 3D en tiempo real. Eliminamos la incertidumbre de la estampación tradicional permitiendo a cualquier creador o marca visualizar sus prendas en 360° antes de cortar una sola yarda de tela.",chips:["Algodón Heavyweight 240 GSM","Corte Boxy Streetwear","Desde 1 Unidad"],img:{src:tt("assets/about/about_identity.webp"),alt:"Identidad IMPRNT [LAB]"}},{id:"mision",icon:"🎯",tag:"MISIÓN",title:"Nuestra Misión",desc:"Democratizar la moda de autor y el streetwear de lujo accesible. Ponemos herramientas de diseño industrial y estampación textil DTF Ultra HD sin tacto plástico (+60 lavadas) en manos de artistas, marcas emergentes y apasionados de la moda, sin pedidos mínimos y con cero desperdicio textil.",chips:["Cero Tacto Plástico","300 DPI de Alta Fidelidad","+60 Lavadas Garantizadas"],img:{src:tt("assets/about/about_mision.webp"),alt:"Misión IMPRNT [LAB]"}},{id:"vision",icon:"🚀",tag:"VISIÓN",title:"Nuestra Visión",desc:"Consolidarnos como el atelier digital y micro-factoría inteligente de referencia en Latinoamérica. Visualizamos un ecosistema donde la inteligencia artificial y la computación en el navegador potencian la creatividad humana con confección local, ética y trazable.",chips:["Atelier Digital 2026","IA + Confección Local","Envíos a Todo el País"],img:{src:tt("assets/about/about_vision.webp"),alt:"Visión IMPRNT [LAB]"}},{id:"licencia",icon:"⚖️",tag:"CUMPLIMIENTO & LICENCIAS",title:"Transparencia y Derechos de Autor",legal:!0,desc:"En estricto compromiso con la transparencia y el uso ético de tecnologías generativas, la silueta textil femenina fue generada con asistencia de IA en <strong>Meshy.ai</strong> (modalidad gratuita). Su topología tridimensional, retopología, alineación de costuras, mapeo UV y optimización de renderizado fueron modelados y calibrados por nuestro equipo técnico para ejecución fluida en WebGL a 60 FPS. 100% transparente y legal.",chips:["Generador 3D Meshy.ai","Topología & UV Calibrados","100% Transparente & Legal"],img:{src:tt("assets/about/about_licencia.webp"),alt:"Transparencia Silueta 3D Meshy.ai y Calibración UV"}}],vd=tt("assets/new_brand_logo_nav.webp"),bd="Ilustración en camino",yd=({src:e,alt:t})=>`
  <div class="about-card-image-box" data-label="${bd}">
    <img src="${tt(e)}" alt="${t}" class="about-card-img" loading="lazy" decoding="async"
      onload="this.parentElement.classList.add('is-ready')"
      onerror="this.parentElement.classList.add('is-loading')" />
  </div>`,wd=e=>`
  <article class="about-card${e.legal?" about-card--legal":""}" data-card="${e.id}">
    ${yd(e.img)}
    <div class="about-card-body">
      <div class="about-card-badge-row">
        <div class="about-card-icon" aria-hidden="true">${e.icon}</div>
        <span class="about-tag-pill">${e.tag}</span>
      </div>
      <h2 class="about-card-title">${e.title}</h2>
      <p class="about-card-desc">${e.desc}</p>
      <div class="about-chips-list">${e.chips.map(t=>`<span class="about-chip">${t}</span>`).join("")}</div>
    </div>
  </article>`,xd=()=>`
  <header class="studio-app-topbar about-topbar">
    <div class="topbar-left-group">
      <button type="button" class="btn-back-to-store" data-about="back" title="Volver a la tienda">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span>Volver a la Tienda</span>
      </button>
      <div class="about-brand brand-kinetic">
        <img src="${vd}" alt="IMPRNT [LAB]" class="about-brand-logo" width="24" height="24" style="filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.45));" />
        <span class="brand-title" style="font-size: 0.95rem;">IMPRNT</span>
        <span class="brand-lab-cyan" style="font-size: 0.74rem;">[LAB]</span>
      </div>
    </div>
    <button type="button" class="btn-theme-toggle" title="Cambiar tema" aria-label="Cambiar tema"></button>
  </header>
  <main class="about-main" aria-labelledby="about-title">
    <section class="about-hero">
      <span class="section-eyebrow">ATELIER DIGITAL & MANIFIESTO</span>
      <h1 class="about-title" id="about-title">${pd}<span class="about-title-glow">${md.replace("On-Demand",'<span class="about-nowrap">On-Demand</span>')}</span></h1>
      <p class="about-lead">${gd}</p>
    </section>
    <div class="about-grid">${fd.map(wd).join("")}</div>
    <div class="about-cta-row">
      <button type="button" class="btn-hero-primary" data-action="open-studio"><span>🚀 Diseña tu Estilo en 3D</span></button>
      <a href="#galeria" class="btn-hero-secondary about-cta-secondary" data-action="open-gallery"><span>✨ Ver Galería de Diseños</span></a>
    </div>
  </main>`;class Ed{constructor(t,a){this.mount=t,this.router=a,this.built=!1}build(){this.mount.innerHTML=xd(),this.mount.addEventListener("click",t=>{var a,i;t.target.closest('[data-about="back"]')&&((i=(a=this.router)==null?void 0:a.closeAbout)==null||i.call(a))}),this.built=!0}open(){this.built||this.build(),xe(document.documentElement.getAttribute("data-theme")||"dark",!1),this.mount.scrollTop=0}close(){}}function Ei(){console.log("[Main] Inicializando IMPRNT [LAB] Atelier 3D..."),Hi(),tc();const e=document.getElementById("hero-showcase-mount");e&&od(e);const t=document.getElementById("lookbook-mount");t&&Kl(t);const a=document.getElementById("features-mount");a&&hd(a);const i=document.getElementById("feedback-mount");i&&bc(i);const s=document.getElementById("studio-loader-mount"),n=new Nc(s),o=document.getElementById("canvas-container");let r=null;o&&(r=new oo(o),window.engine=r),window.store=C;const l=new Yc({engine:r,loader:n}),c=document.getElementById("auth-view");if(c){const M=new ud(c,l);l.setAuthController(M)}const d=document.getElementById("gallery-view");d&&l.setGalleryController(nd(d,l));const g=document.getElementById("about-view");g&&l.setAboutController(new Ed(g,l));const p=document.getElementById("nav-auth-mount");p&&cd(p,l),qc(),l.checkInitialRoute();const h=document.getElementById("color-picker-mount");h&&uo(h);const u=document.getElementById("decal-uploader-mount");u&&ol(u);const m=document.getElementById("decal-controls-mount");m&&ul(m);const f=document.getElementById("view-switcher-mount");f&&hl(f);const y=document.getElementById("silhouette-switcher-mount");y&&pl(y);const v=document.getElementById("pricing-bar-mount");v&&ml(v,()=>{const M=r?r.captureScreenshot():null;Bc(M)});const w=document.getElementById("btn-orders-history");w&&w.addEventListener("click",()=>{Se()});const b=document.querySelectorAll(".zone-tab-btn");b.forEach(M=>{M.addEventListener("click",()=>{const A=M.getAttribute("data-zone");Bi(A),We(A)})}),C.subscribe((M,A)=>{A==="activeZone"&&b.forEach($=>{$.classList.toggle("active",$.getAttribute("data-zone")===M.activeZone)})});const x=sessionStorage.getItem("shirt_lab_exported_art");if(x){sessionStorage.removeItem("shirt_lab_exported_art");const M=new Image;M.onload=()=>{lt("front",{name:"Diseño Personalizado Lab",src:x,imageElement:M})},M.src=x}else{const M=ft[0];if(M){const A=M.src||Me(M.svg),$=new Image;$.onload=()=>{lt("front",{name:M.name,src:A,imageElement:$})},$.src=A}}const E=document.getElementById("btn-mobile-menu"),S=document.getElementById("mobile-nav-drawer");if(E&&S){const M=E.querySelector(".icon-menu-open"),A=E.querySelector(".icon-menu-close");E.addEventListener("click",()=>{const $=S.classList.toggle("active");M&&A&&(M.style.display=$?"none":"block",A.style.display=$?"block":"none")}),S.querySelectorAll("a, button").forEach($=>{$.addEventListener("click",()=>{S.classList.remove("active"),M&&A&&(M.style.display="block",A.style.display="none")})})}document.querySelectorAll("#btn-footer-terms, #btn-footer-terms-bottom").forEach(M=>{M.addEventListener("click",A=>{A.preventDefault(),Pa()})})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ei):Ei();
