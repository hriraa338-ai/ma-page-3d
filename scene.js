import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const container = document.getElementById('model-container');
const loader = document.getElementById('loader');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(32, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 2.2, 8.6);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const key = new THREE.DirectionalLight(0xffffff, 2.2);
key.position.set(4, 6, 5);
scene.add(key);

const rim = new THREE.DirectionalLight(0x0a84ff, 1.4);
rim.position.set(-5, 2, -4);
scene.add(rim);

const fill = new THREE.PointLight(0xbf5af2, 1.2, 20);
fill.position.set(-3, -2, 3);
scene.add(fill);

const group = new THREE.Group();
scene.add(group);

let caseMaterial, lidMaterial;

function buildCase(color = 0xf5f5f7) {
  caseMaterial = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.18,
    metalness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });
  lidMaterial = caseMaterial;

  // Base of the case
  const baseGeo = new RoundedBoxGeometry(2.6, 1.0, 1.9, 6, 0.45);
  const base = new THREE.Mesh(baseGeo, caseMaterial);
  base.position.y = -0.4;
  group.add(base);

  // Lid (hinged open)
  const lidGeo = new RoundedBoxGeometry(2.6, 1.0, 1.9, 6, 0.45);
  const lid = new THREE.Mesh(lidGeo, lidMaterial);
  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 0.1, -0.95);
  lid.position.set(0, 0, 0.95);
  lidPivot.add(lid);
  lidPivot.rotation.x = -1.95; // open angle
  group.add(lidPivot);

  // status LED
  const led = new THREE.Mesh(
    new THREE.CircleGeometry(0.035, 16),
    new THREE.MeshBasicMaterial({ color: 0x30d158 })
  );
  led.position.set(0, -0.05, 0.96);
  group.add(led);

  // Earbud builder
  function buildEarbud() {
    const bud = new THREE.Group();
    const earMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.25, clearcoat: 0.8 });
    const tipMat = new THREE.MeshPhysicalMaterial({ color: 0xe8e8ea, roughness: 0.4 });
    const stemMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.25, clearcoat: 0.8 });
    const micMat = new THREE.MeshStandardMaterial({ color: 0x2c2c2e, roughness: 0.6 });

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 24), earMat);
    head.scale.set(1, 0.95, 1.1);
    bud.add(head);

    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 20), tipMat);
    tip.position.set(0, -0.02, 0.22);
    tip.scale.set(0.9, 0.9, 0.7);
    bud.add(tip);

    const stem = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.55, 8, 16), stemMat);
    stem.position.set(0, -0.42, 0.04);
    stem.rotation.x = 0.18;
    bud.add(stem);

    const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.18, 16), micMat);
    mic.position.set(0, -0.62, 0.08);
    mic.rotation.x = 0.18;
    bud.add(mic);

    return bud;
  }

  const budLeft = buildEarbud();
  budLeft.position.set(-0.55, 0.45, 0.55);
  budLeft.rotation.set(0.3, 0.15, 0.1);
  group.add(budLeft);

  const budRight = buildEarbud();
  budRight.position.set(0.45, 0.45, 0.6);
  budRight.rotation.set(0.3, -0.15, -0.1);
  group.add(budRight);

  group.userData.lidPivot = lidPivot;
  group.userData.budLeft = budLeft;
  group.userData.budRight = budRight;
}

buildCase();

loader.style.display = 'none';

group.rotation.set(0, -0.4, 0);
group.scale.setScalar(1.1);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.enableZoom = false;
controls.minPolarAngle = Math.PI / 3.2;
controls.maxPolarAngle = Math.PI / 1.7;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.4;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

function onResize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', onResize);

// stop auto-rotate on user interaction, resume after idle
let idleTimer;
controls.addEventListener('start', () => {
  controls.autoRotate = false;
  clearTimeout(idleTimer);
});
controls.addEventListener('end', () => {
  idleTimer = setTimeout(() => (controls.autoRotate = true), 3000);
});

// expose color change for swatches
window.setCaseColor = function (hex) {
  if (caseMaterial) caseMaterial.color.set(hex);
};
