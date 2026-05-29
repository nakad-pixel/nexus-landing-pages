/**
 * Nexus 3D — Shared Three.js floating geometry background
 * Usage: <script src="../../shared/three-bg.js"></script>
 * Requires Three.js r128 loaded before this script.
 * Expects <canvas id="bg-canvas"> in the DOM.
 */
(function initNexusBg() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);
  camera.position.z = 30;

  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const goldLight = new THREE.PointLight(0xc9a96e, 2, 60);
  goldLight.position.set(10, 10, 10);
  scene.add(goldLight);
  scene.add(new THREE.PointLight(0x334466, 1.5, 60));

  const meshes = [];
  const GM = new THREE.MeshStandardMaterial({ color: 0xc9a96e, metalness: 0.9, roughness: 0.2 });
  const WM = new THREE.MeshBasicMaterial({ color: 0xc9a96e, wireframe: true, transparent: true, opacity: 0.15 });
  const DM = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 });

  function add(geo, mat, x, y, z) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    scene.add(m);
    meshes.push({ m, sx: 0.001 + Math.random() * 0.001, sy: 0.001 + Math.random() * 0.001 });
  }

  add(new THREE.BoxGeometry(3, 3, 3),         GM, -14,  6, -5);
  add(new THREE.BoxGeometry(2, 2, 2),         WM,  16, -3, -8);
  add(new THREE.BoxGeometry(1.5, 5, 1.5),     DM,   8, 10,-12);
  add(new THREE.IcosahedronGeometry(2.5, 1),  WM,  -5, -6, -8);
  add(new THREE.IcosahedronGeometry(1.5, 0),  GM,  12,  8, -6);
  add(new THREE.IcosahedronGeometry(3.5, 2),  WM, -18,  2,-14);
  add(new THREE.TorusGeometry(4, 0.15, 16, 60), WM, 2,  4,-10);
  add(new THREE.TorusGeometry(2, 0.08, 16, 60), GM,-8,-10, -5);

  const pGeo = new THREE.BufferGeometry();
  const pp = new Float32Array(2400);
  for (let i = 0; i < 800; i++) {
    pp[i*3]   = (Math.random()-0.5)*80;
    pp[i*3+1] = (Math.random()-0.5)*60;
    pp[i*3+2] = (Math.random()-0.5)*40-10;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xc9a96e, size: 0.06, transparent: true, opacity: 0.4 })));

  let mx = 0, my = 0, sy = 0;
  addEventListener('mousemove', e => { mx = (e.clientX/innerWidth-0.5)*2; my = (e.clientY/innerHeight-0.5)*2; });
  addEventListener('scroll', () => { sy = scrollY; });
  addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  const clk = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    const t = clk.getElapsedTime();
    camera.position.x += (mx*2 - camera.position.x)*0.03;
    camera.position.y += (-my   - camera.position.y)*0.03 - sy*0.008;
    camera.lookAt(0, -sy*0.005, 0);
    goldLight.position.x = Math.sin(t*0.4)*12;
    goldLight.position.y = Math.cos(t*0.3)*8;
    meshes.forEach((o,i) => {
      o.m.rotation.x += o.sx;
      o.m.rotation.y += o.sy;
      o.m.position.y += Math.sin(t*0.4+i)*0.003;
    });
    renderer.render(scene, camera);
  })();
})();
