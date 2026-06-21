import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   1. 3D SCENE — glowing icosahedron + wireframe + particles
   ============================================================ */
function initScene() {
  const canvas = document.getElementById('showcase-canvas');
  if (!canvas) return;

  const sizeOf = () => {
    const r = canvas.getBoundingClientRect();
    return { w: r.width || 1, h: r.height || 1 };
  };

  const scene = new THREE.Scene();
  const { w, h } = sizeOf();

  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Lights — three neon sources for a premium look
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const l1 = new THREE.PointLight(0x00e5ff, 60, 30); l1.position.set(5, 4, 5); scene.add(l1);
  const l2 = new THREE.PointLight(0xff2e97, 55, 30); l2.position.set(-5, -3, 4); scene.add(l2);
  const l3 = new THREE.PointLight(0xa855f7, 45, 30); l3.position.set(0, 5, -5); scene.add(l3);

  const group = new THREE.Group();
  scene.add(group);

  // Solid core
  const coreGeo = new THREE.IcosahedronGeometry(1.55, 1);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x0d0d18,
    roughness: 0.15,
    metalness: 0.6,
    clearcoat: 1,
    clearcoatRoughness: 0.2,
    emissive: new THREE.Color(0x00e5ff),
    emissiveIntensity: 0.05,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Neon wireframe shell
  const wireGeo = new THREE.IcosahedronGeometry(1.85, 1);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.35 });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  group.add(wire);

  // Particle halo
  const COUNT = reduceMotion ? 120 : 380;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const r = 2.4 + Math.random() * 2.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xa855f7, size: 0.045, transparent: true, opacity: 0.8, sizeAttenuation: true });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Controls — drag to rotate, auto-rotate when idle
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 1.1;

  let idleTimer;
  controls.addEventListener('start', () => { controls.autoRotate = false; clearTimeout(idleTimer); });
  controls.addEventListener('end', () => { idleTimer = setTimeout(() => (controls.autoRotate = !reduceMotion), 2500); });

  // Expose accent color hook for the studio switcher
  window.setShowcaseAccent = (hex) => {
    const c = new THREE.Color(hex);
    wireMat.color.copy(c);
    coreMat.emissive.copy(c);
    l1.color.copy(c);
  };

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    if (!reduceMotion) {
      wire.rotation.y = t * 0.15;
      wire.rotation.x = t * 0.08;
      particles.rotation.y = -t * 0.04;
      group.position.y = Math.sin(t * 0.8) * 0.08;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  function onResize() {
    const { w, h } = sizeOf();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener('resize', onResize);
}

/* ============================================================
   2. Scroll reveal (IntersectionObserver)
   ============================================================ */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  items.forEach((el) => io.observe(el));
}

/* ============================================================
   3. Animated counters
   ============================================================ */
function initCounters() {
  const nums = document.querySelectorAll('[data-count]');
  const run = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  nums.forEach((el) => io.observe(el));
}

/* ============================================================
   4. Tile cursor-follow glow
   ============================================================ */
function initTileGlow() {
  if (reduceMotion) return;
  document.querySelectorAll('.tile').forEach((tile) => {
    tile.addEventListener('pointermove', (e) => {
      const r = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', `${e.clientX - r.left}px`);
      tile.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ============================================================
   5. Studio color switcher
   ============================================================ */
function initSwitcher() {
  const swatches = document.querySelectorAll('.swatch[data-accent]');
  const preview = document.getElementById('preview');
  swatches.forEach((s) => {
    s.addEventListener('click', () => {
      const accent = s.dataset.accent;
      swatches.forEach((o) => o.setAttribute('aria-pressed', 'false'));
      s.setAttribute('aria-pressed', 'true');
      if (preview) preview.style.setProperty('--accent', accent);
      if (window.setShowcaseAccent) window.setShowcaseAccent(accent);
    });
  });
}

/* ============================================================
   6. Nav shadow on scroll
   ============================================================ */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================================
   7. Duplicate marquee content for a seamless loop
   ============================================================ */
function initMarquee() {
  const track = document.getElementById('marquee');
  if (track) track.innerHTML += track.innerHTML;
}

/* ---------- Boot ---------- */
initScene();
initReveal();
initCounters();
initTileGlow();
initSwitcher();
initNav();
initMarquee();
