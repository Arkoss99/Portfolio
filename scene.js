import * as THREE from 'three';
import { GLTFLoader } from './vendor/loaders/GLTFLoader.js';

export async function startScene(theme){
 const container=document.getElementById('model-surface');
 const light=theme==='studio', signal=theme==='signal';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches, dragging=false, lastX=0, lastY=0, frame=0, visible=true;
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.3;
 renderer.shadowMap.enabled=true;
 renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 container.append(renderer.domElement);
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(35,1,.1,100);
 const group=new THREE.Group();scene.add(group);
 const hemi=new THREE.HemisphereLight(0xfff1e4,light?0xa5ae94:0x55636a,2.3);scene.add(hemi);
 const key=new THREE.DirectionalLight(0xffe8d1,3.7);key.position.set(3,7,7);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-4;key.shadow.camera.right=4;key.shadow.camera.top=7;key.shadow.camera.bottom=-3;key.shadow.normalBias=.025;scene.add(key);
 const fill=new THREE.DirectionalLight(0xb6d8ff,1.8);fill.position.set(-4,4,4);scene.add(fill);
 const rim=new THREE.DirectionalLight(signal?0xffe2c0:0xffad78,3);rim.position.set(2,5,-4);scene.add(rim);
 const avatar=await new GLTFLoader().loadAsync(new URL('./assets/milan-avatar.glb',import.meta.url).href);
 avatar.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
 group.add(avatar.scene);
 group.rotation.y=-.32;
 const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.1,.13,80),new THREE.MeshStandardMaterial({color:light?0xc6dc95:signal?0x1b2a1f:0x323a34,roughness:.65,metalness:.12}));pedestal.position.y=-.03;pedestal.receiveShadow=true;scene.add(pedestal);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(12,12),new THREE.ShadowMaterial({opacity:light?.16:.24}));floor.rotation.x=-Math.PI/2;floor.position.y=-.1;floor.receiveShadow=true;scene.add(floor);
 const orbit=new THREE.Mesh(new THREE.TorusGeometry(2.25,.009,8,100),new THREE.MeshBasicMaterial({color:light?0xa5b680:signal?0xaa552f:0x545b50}));orbit.position.set(0,2.8,-.7);orbit.rotation.y=.16;scene.add(orbit);
 if(signal){const edges=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.25,5.9,1.5)),new THREE.LineBasicMaterial({color:0xba603c,transparent:true,opacity:.7}));edges.position.set(0,2.7,-.8);scene.add(edges);orbit.visible=false;}
 const pause=document.getElementById('model-pause');
 function updateButton(){pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Spustit animaci':'Pozastavit animaci');pause.setAttribute('aria-pressed',String(paused));}
 updateButton();
 let userY=-.32,userX=0;
 function draw(t=0){frame=0;if(!visible||document.hidden)return;
  group.rotation.y=userY+(!paused&&!dragging?Math.sin(t*.00022)*.12:0);group.rotation.x=userX;
  renderer.render(scene,camera);if(!paused&&!dragging)frame=requestAnimationFrame(draw);
 }
 function requestDraw(){if(!frame)frame=requestAnimationFrame(draw);}
 function resize(){const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;const distance=Math.max(10.5,8.7/camera.aspect);camera.position.set(.15,3.15,distance);camera.lookAt(0,2.65,0);camera.updateProjectionMatrix();requestDraw();}
 const ro=new ResizeObserver(resize);ro.observe(container);resize();
 pause.addEventListener('click',()=>{paused=!paused;updateButton();if(frame){cancelAnimationFrame(frame);frame=0;}requestDraw();});
 reduced.addEventListener('change',e=>{paused=e.matches;updateButton();requestDraw();});
 document.getElementById('model-reset').addEventListener('click',()=>{userY=-.32;userX=0;requestDraw();});
 document.getElementById('model-left').addEventListener('click',()=>{userY-=Math.PI/8;requestDraw();});
 document.getElementById('model-right').addEventListener('click',()=>{userY+=Math.PI/8;requestDraw();});
 container.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;dragging=true;lastX=e.clientX;lastY=e.clientY;container.setPointerCapture(e.pointerId);if(frame)cancelAnimationFrame(frame);frame=0;});
 container.addEventListener('pointermove',e=>{if(!dragging)return;userY+=(e.clientX-lastX)*.009;userX=THREE.MathUtils.clamp(userX+(e.clientY-lastY)*.003,-.14,.14);lastX=e.clientX;lastY=e.clientY;requestDraw();});
 const release=()=>{dragging=false;requestDraw();};container.addEventListener('pointerup',release);container.addEventListener('pointercancel',release);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)requestDraw();else if(frame){cancelAnimationFrame(frame);frame=0;}},{threshold:.05}).observe(container);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)requestDraw();});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();container.classList.remove('ready');document.querySelector('.model-hint').textContent='3D NÁHLED POZASTAVEN';});
 container.classList.add('ready');
 container.dataset.modelLoaded='true';
 container.setAttribute('aria-label','Stylizovaná 3D postava Milana v černé bomber bundě, cargo kalhotách a teniskách. Otáčení tažením.');
 document.querySelector('.model-hint').textContent='MILAN / OTÁČEJ TAŽENÍM NEBO ŠIPKAMI';
 requestDraw();
}
