import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function createStudio(container, onAction) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.domElement.setAttribute('aria-label', 'Rin 的三维工作室，可拖动旋转；使用下方场景按钮也可访问所有内容');
  renderer.domElement.setAttribute('role', 'img');
  container.prepend(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.minPolarAngle = 0.9;
  controls.maxPolarAngle = 1.36;
  controls.minAzimuthAngle = -0.65;
  controls.maxAzimuthAngle = 1.08;
  controls.target.set(0, 1.45, 0);
  camera.position.set(7.6, 7, 13.5);
  controls.update();
  const initialCamera = camera.position.clone();
  const initialTarget = controls.target.clone();
  const hemi = new THREE.HemisphereLight(0xfff9ed, 0xb2bba9, 2.6);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffebcf, 4.5);
  sun.position.set(-3, 9, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 8, bottom: -6 });
  sun.shadow.normalBias = 0.025;
  sun.shadow.bias = -0.0002;
  sun.shadow.radius = 4;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xd7e7ff, 1.5);
  fill.position.set(5, 5, -4);
  scene.add(fill);
  const studio = new THREE.Group();
  scene.add(studio);
  const materials = {};
  const mat = (color, roughness = 0.75, metalness = 0) => {
    const key = `${color}-${roughness}-${metalness}`;
    return materials[key] ||= new THREE.MeshStandardMaterial({ color, roughness, metalness });
  };
  function mesh(geometry, material, position = [0, 0, 0], parent = studio) {
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(...position);
    obj.castShadow = true;
    obj.receiveShadow = true;
    parent.add(obj);
    return obj;
  }
  function box(size, color, position, radius = 0.06, parent = studio) {
    return mesh(new RoundedBoxGeometry(...size, 3, radius), mat(color), position, parent);
  }
  function sphere(size, color, position, parent = studio) {
    const obj = mesh(new THREE.SphereGeometry(1, 32, 24), mat(color), position, parent);
    obj.scale.set(...size);
    return obj;
  }
  function cylinder(top, bottom, height, color, position, parent = studio) {
    return mesh(new THREE.CylinderGeometry(top, bottom, height, 48), mat(color), position, parent);
  }
  function rod(from, to, radius, color, parent = studio) {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
    const obj = cylinder(radius, radius, a.distanceTo(b), color, a.clone().add(b).multiplyScalar(0.5).toArray(), parent);
    obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
    return obj;
  }
  function labelTexture(text, bg, color, width = 768, height = 384) {
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `bold ${height * 0.22}px sans-serif`;
    text.split('\n').forEach((line, i, lines) => ctx.fillText(line, width / 2, height / 2 + (i - (lines.length - 1) / 2) * height * 0.32));
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
  const floor = box([7.5, 0.28, 5.25], '#c9b59b', [0, 0, 0], 0.16);
  box([7.42, 0.08, 5.18], '#eee4d2', [0, 0.18, 0], 0.1);
  for (let i = 0; i < 10; i++) box([0.012, 0.003, 4.9], '#dacdb6', [-3.3 + i * 0.73, 0.225, 0], 0.001);
  const rug = cylinder(1.9, 1.9, 0.035, '#b7bda4', [0.7, 0.25, 0.65]);
  rug.scale.z = 0.8;
  const rugBorder = mesh(new THREE.TorusGeometry(1.7, 0.013, 8, 100), mat('#e8e3cb'), [0.7, 0.273, 0.65]);
  rugBorder.rotation.x = Math.PI / 2; rugBorder.scale.y = 0.8;
  const ground = mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.11 }), [0, -0.17, 0], scene);
  ground.rotation.x = -Math.PI / 2; ground.castShadow = false;

  const desk = new THREE.Group(); desk.position.set(-1.3, 0.25, -0.72); studio.add(desk);
  box([3.4, 0.17, 1.65], '#b88251', [0, 1.55, 0], 0.07, desk);
  for (const x of [-1.4, 1.4]) for (const z of [-0.57, 0.57]) {
    rod([x, 0, z], [x * 0.92, 1.5, z * 0.8], 0.085, '#6d5140', desk);
  }
  box([0.5, 0.07, 0.4], '#484b43', [0.1, 1.69, -0.16], 0.04, desk);
  box([0.08, 0.48, 0.08], '#51544b', [0.1, 1.9, -0.27], 0.02, desk);
  const screenFrame = box([1.8, 1.16, 0.12], '#333c38', [0.1, 2.31, -0.27], 0.06, desk);
  const screen = mesh(new THREE.PlaneGeometry(1.65, 0.98), new THREE.MeshBasicMaterial({ map: labelTexture('好奇 · 思考\n让想法发生', '#263a32', '#eef1d0') }), [0.1, 2.33, -0.202], desk);
  screen.userData.action = 'projects'; screenFrame.userData.action = 'projects';
  box([1.1, 0.06, 0.36], '#efeadb', [0.05, 1.69, 0.48], 0.045, desk);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 11; c++) box([0.068, 0.02, 0.07], r === 2 && c > 2 && c < 7 ? '#a9b9a6' : '#d0cabb', [-0.4 + c * 0.09, 1.735, 0.39 + r * 0.1], 0.008, desk);
  sphere([0.12, 0.06, 0.18], '#efe7d7', [0.96, 1.73, 0.43], desk);
  cylinder(0.15, 0.13, 0.3, '#e87b47', [-1.2, 1.8, 0.32], desk);
  cylinder(0.127, 0.127, 0.009, '#553b2c', [-1.2, 1.956, 0.32], desk);
  const handle = mesh(new THREE.TorusGeometry(0.095, 0.027, 10, 24), mat('#e87b47'), [-1.05, 1.82, 0.32], desk);
  handle.rotation.y = Math.PI / 2;
  cylinder(0.24, 0.3, 0.09, '#455c4b', [-1.26, 1.69, -0.48], desk);
  rod([-1.26, 1.73, -0.48], [-1.26, 2.75, -0.48], 0.035, '#455c4b', desk);
  rod([-1.26, 2.75, -0.48], [-0.85, 2.93, -0.3], 0.035, '#455c4b', desk);
  const shade = cylinder(0.1, 0.28, 0.28, '#59715d', [-0.85, 2.85, -0.3], desk);
  shade.rotation.z = 0.25;

  const shelf = new THREE.Group(); shelf.position.set(2.82, 0.25, -1.1); studio.add(shelf);
  box([1.05, 1.14, 0.88], '#c59664', [0, 0.6, 0], 0.06, shelf);
  box([0.93, 0.39, 0.08], '#ae7848', [0, 0.85, 0.46], 0.03, shelf);
  box([0.93, 0.39, 0.08], '#ae7848', [0, 0.36, 0.46], 0.03, shelf);
  for (const y of [0.36, 0.85]) box([0.21, 0.04, 0.04], '#513e2d', [0, y, 0.515], 0.01, shelf);
  box([0.9, 0.08, 0.65], '#dc7950', [0.04, 1.22, 0], 0.02, shelf);
  const book = box([0.75, 0.13, 0.61], '#f3e9d5', [-0.04, 1.32, 0.07], 0.025, shelf);
  book.rotation.y = -0.14;
  box([0.27, 0.35, 0.22], '#4e5b45', [0.12, 1.54, -0.05], 0.03, shelf);
  const leafColors = ['#72875f', '#576e49', '#8a9b71'];
  function plant(x, z, scale = 1) {
    const p = new THREE.Group(); p.position.set(x, 0.25, z); p.scale.setScalar(scale); studio.add(p);
    cylinder(0.39, 0.29, 0.61, '#b76843', [0, 0.31, 0], p);
    cylinder(0.42, 0.41, 0.1, '#c17850', [0, 0.61, 0], p);
    cylinder(0.36, 0.36, 0.04, '#655342', [0, 0.66, 0], p);
    for (let i = 0; i < 9; i++) {
      const angle = i * 2.399;
      const y = 1.15 + (i % 4) * 0.25;
      const x = Math.cos(angle) * 0.35, z = Math.sin(angle) * 0.35;
      rod([0, 0.65, 0], [x, y, z], 0.018, '#65744d', p);
      const leaf = sphere([0.19, 0.43, 0.095], leafColors[i % 3], [x * 1.3, y + 0.13, z * 1.3], p);
      leaf.rotation.set(Math.sin(angle) * 0.7, angle, Math.cos(angle) * -0.6);
    }
    return p;
  }
  plant(-3.04, -1.7, 1.1);
  plant(3.1, 1.64, 0.62);
  const pinboard = new THREE.Group(); pinboard.position.set(1.36, 3.2, -1.92); studio.add(pinboard);
  box([1.68, 1.19, 0.13], '#95734f', [0, 0, 0], 0.04, pinboard);
  box([1.53, 1.04, 0.05], '#ccb18a', [0, 0, 0.09], 0.01, pinboard);
  const notes = [ [-0.4, 0.21, '#f0e7b3'], [0.27, 0.17, '#f2cbb3'], [-0.08, -0.28, '#ccd3b8'] ];
  notes.forEach(([x, y, color], i) => {
    const note = mesh(new THREE.PlaneGeometry(0.51, 0.37), new THREE.MeshBasicMaterial({ map: labelTexture(['观察', '试一试', '有用，也有趣'][i], color, '#5b5948') }), [x, y, 0.124], pinboard);
    note.rotation.z = [-0.12, 0.12, -0.07][i];
    sphere([0.025, 0.025, 0.019], '#ad5b36', [x, y + 0.145, 0.14], pinboard);
  });
  for (const x of [-0.62, 0.62]) rod([x, -2.87, -0.05], [x, 0.48, -0.05], 0.035, '#8d6d4c', pinboard);

  const stool = new THREE.Group(); stool.position.set(-2.16, 0.25, 1.26); studio.add(stool);
  cylinder(0.54, 0.54, 0.22, '#cb6d43', [0, 0.91, 0], stool);
  for (let i = 0; i < 3; i++) {
    const a = i * Math.PI * 2 / 3;
    rod([Math.cos(a) * 0.37, 0, Math.sin(a) * 0.37], [Math.cos(a) * 0.23, 0.88, Math.sin(a) * 0.23], 0.055, '#785a3f', stool);
  }
  const stack = new THREE.Group(); stack.position.set(-2.98, 0.29, 0.49); studio.add(stack);
  ['#707f69', '#d0ad7b', '#dd754e'].forEach((color, i) => {
    const b = box([0.64, 0.14, 0.8], color, [0, i * 0.15, 0], 0.02, stack); b.rotation.y = i * 0.13;
  });

  const character = new THREE.Group(); character.position.set(0.9, 0.27, 0.94); studio.add(character);
  const fallback = new THREE.Group(); character.add(fallback);
  sphere([0.43, 0.59, 0.33], '#30312e', [0, 2.77, -0.075], fallback);
  sphere([0.33, 0.38, 0.3], '#f2c6a6', [0, 2.79, 0.08], fallback);
  cylinder(0.25, 0.34, 0.72, '#f2ead5', [0, 2.09, 0], fallback);
  cylinder(0.34, 0.52, 0.49, '#777973', [0, 1.49, 0], fallback);
  [-1, 1].forEach(side => {
    rod([side * 0.18, 0.25, 0], [side * 0.18, 1.28, 0], 0.106, '#343632', fallback);
    sphere([0.14, 0.1, 0.25], '#282b29', [side * 0.18, 0.14, 0.1], fallback);
    rod([side * 0.35, 2.35, 0], [side * 0.49, 1.8, 0.03], 0.09, '#f2c6a6', fallback);
    const glasses = mesh(new THREE.TorusGeometry(0.13, 0.02, 8, 32), mat('#834b3d'), [side * 0.16, 2.82, 0.37], fallback);
    glasses.scale.y = 0.75;
    sphere([0.025, 0.038, 0.02], '#37332b', [side * 0.15, 2.82, 0.372], fallback);
  });
  rod([-0.035, 2.82, 0.37], [0.035, 2.82, 0.37], 0.014, '#834b3d', fallback);
  for (let i = 0; i < 4; i++) {
    const fringe = sphere([0.13, 0.25, 0.08], '#30312e', [-0.24 + i * 0.15, 3.05, 0.28], fallback);
    fringe.rotation.z = 0.2;
  }
  character.rotation.y = 0.16;
  let modelReady = false;
  const assetBase = `${import.meta.env.BASE_URL}assets/`;
  new GLTFLoader().load(`${assetBase}rin-avatar.glb`, gltf => {
    const model = gltf.scene;
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = 3.45 / size.y;
    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
    model.traverse(obj => {
      if (obj.isMesh) {
        obj.castShadow = true; obj.receiveShadow = true;
        obj.userData.action = 'about';
        if (obj.material) {
          obj.material.roughness = 0.9;
          obj.material.metalness = 0;
        }
      }
    });
    character.add(model); fallback.visible = false; modelReady = true;
    container.dataset.model = 'loaded';
    document.querySelector('[data-model-status]').textContent = '专属 3D 形象已就位';
  }, undefined, () => {
    container.dataset.model = 'fallback';
    document.querySelector('[data-model-status]').textContent = '轻量立体形象';
  });

  const sparks = new THREE.Group(); studio.add(sparks);
  for (let i = 0; i < 5; i++) {
    const sp = mesh(new THREE.OctahedronGeometry(0.07, 0), mat('#d78a3e'), [Math.cos(i * 1.6) * 2.8, 2.4 + (i % 3) * 0.45, Math.sin(i * 1.6) * 1.8], sparks);
    sp.userData.baseY = sp.position.y;
  }
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let down = { x: 0, y: 0 };
  renderer.domElement.addEventListener('pointerdown', event => { down = { x: event.clientX, y: event.clientY }; });
  renderer.domElement.addEventListener('pointerup', event => {
    if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(studio.children, true).find(hit => hit.object.userData.action);
    if (hit) onAction(hit.object.userData.action);
  });
  let waveStart = -20, night = false, visible = true;
  const clock = new THREE.Clock();
  let resetProgress = 1;
  let resetFrom;
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.fov = width < 500 ? 42 : 34;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize); observer.observe(container); resize();
  const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); visibility.observe(container);
  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    if (!visible || document.hidden) return;
    if (!reduced) {
      character.position.y = 0.27 + Math.sin(t * 1.6) * 0.017;
      sparks.children.forEach((sp, i) => { sp.position.y = sp.userData.baseY + Math.sin(t * 0.8 + i) * 0.08; sp.rotation.y = t * 0.4; });
      const wave = t - waveStart;
      character.rotation.z = wave < 1.8 ? Math.sin(wave * 12) * 0.065 * (1 - wave / 1.8) : 0;
      character.rotation.y = wave < 1.8 ? 0.16 + Math.sin(wave * 4) * 0.3 : 0.16;
    }
    if (resetProgress < 1) {
      resetProgress = Math.min(1, resetProgress + 0.035);
      camera.position.lerpVectors(resetFrom, initialCamera, 1 - Math.pow(1 - resetProgress, 3));
      controls.target.lerp(initialTarget, 0.12);
    }
    controls.update(); renderer.render(scene, camera);
  }
  animate();
  return {
    wave() { waveStart = clock.getElapsedTime(); },
    reset() { resetFrom = camera.position.clone(); resetProgress = 0; },
    setNight(value) {
      night = value;
      hemi.intensity = night ? 1.4 : 2.6;
      sun.intensity = night ? 1.4 : 4.5;
      sun.color.set(night ? '#f6b46e' : '#ffebcf');
      fill.intensity = night ? 2 : 1.5;
    },
    getState() { return { modelReady, night, camera: camera.position.toArray() }; },
    destroy() { cancelAnimationFrame(animationId); observer.disconnect(); visibility.disconnect(); controls.dispose(); renderer.dispose(); }
  };
}
