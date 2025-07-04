import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Raycaster, Vector3 } from 'three';
const scene = new THREE.Scene();
const loader = new GLTFLoader();
let mixer;
const clock = new THREE.Clock();
let groundMesh = null;
let carModel = null;

let groundMesh1 = null;
const groundLoader = new GLTFLoader();
groundLoader.load('public/invasion.glb', (gltf) => {
  groundMesh1 = gltf.scene;
  groundMesh1.position.set(0, 0, 0);
  groundMesh1.scale.set(1, 1, 1);
  groundMesh1.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(groundMesh1);
});
let isc = null;
const c = new GLTFLoader();
c.load('public/c.glb', (gltf) => {
   isc = gltf.scene;
  isc.position.set(10, 4, 10);
  isc.scale.set(0.09, 0.09, 0.09);
  isc.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(isc);
});
let platform1 = null;
const platform = new GLTFLoader();
platform.load(
  'public/stone_platform.glb',
  (gltf) => {
     platform1 = gltf.scene;
    platform1.position.set(10, 0, 10);
    platform1.scale.set(0.009, 0.009, 0.009);
    platform1.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(platform1);
  },
  undefined,
  (error) => {
    console.error('เกิดข้อผิดพลาดตอนโหลด platform.glb:', error);
  }
);
const treeloder = new GLTFLoader();
treeloder.load('public/real_tree_models.glb', (gltf) => {
  const tree = gltf.scene;
  tree.position.set(0, 5, 0);
  tree.scale.set(0.2, 0.2, 0.2);
  tree.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = false;
    }
  });
  scene.add(tree)
    if (gltf.animations && gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(tree);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
  }
}, undefined, (error) => {
  console.error('เกิดข้อผิดพลาดตอนโหลดรถ:', error);
});

const truckLoader = new GLTFLoader();
truckLoader.load('public/low-poly_truck_car_drifter.glb', (gltf) => {
  const truck = gltf.scene;
  truck.position.set(55.18, 68, 21.85);
  truck.scale.set(0.010, 0.010, 0.010);
  truck.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = false;
    }
  });
  scene.add(truck);
  carModel = truck;
  if (gltf.animations && gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(truck);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
  }
}, undefined, (error) => {
  console.error('เกิดข้อผิดพลาดตอนโหลดรถ:', error);
});

const move = { forward: false, backward: false, left: false, right: false };
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w') move.forward = true;
  if (e.key === 'ArrowDown' || e.key === 's') move.backward = true;
  if (e.key === 'ArrowLeft' || e.key === 'a') move.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd') move.right = true;
});
window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w') move.forward = false;
  if (e.key === 'ArrowDown' || e.key === 's') move.backward = false;
  if (e.key === 'ArrowLeft' || e.key === 'a') move.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd') move.right = false;
});
const raycaster = new Raycaster();
const down = new Vector3(0, -1, 0);
function updateCarOnGround() {
  if (!carModel || !groundMesh1) return;
  const origin = carModel.position.clone();
  origin.y = 100;
  raycaster.set(origin, down);
  const intersects = raycaster.intersectObject(groundMesh1, true);
  if (intersects.length > 0) {
    carModel.position.y = intersects[0].point.y + 0.3;
  }
}

const pointLight = new THREE.PointLight(0xffffff, 2, 200);
pointLight.position.set(2, 10, 2);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 20, 5);
directionalLight.castShadow = true;

directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 100;

directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;

scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  500
);

const canvas = document.getElementById('threejs');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.zIndex = '0';

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
});

let carAngle = 0;
const turnSpeed = 0.05;
const moveSpeed = 0.1;

let cameraFollow = true;
window.addEventListener('keydown', (e) => {
  if (e.key === 'c' || e.key === 'C') {
    cameraFollow = !cameraFollow;
    document.body.style.cursor = 'default'; // เปลี่ยน cursor กลับเป็นปกติ
    // เมื่อเปลี่ยนโหมด ให้ controls.target เป็นรถทันที (ถ้ากล้องตามรถ)
    if (cameraFollow && carModel) {
      controls.target.copy(carModel.position);
      document.body.style.cursor = 'none';
    }
  }
});

const renderloop = () => {
  if (mixer) {
    const delta = clock.getDelta();
    mixer.update(delta);
  }
  if (carModel) {
    if (move.left) carAngle += turnSpeed;
    if (move.right) carAngle -= turnSpeed;

    if (move.forward && cameraFollow) {
      carModel.position.x -= Math.sin(carAngle) * moveSpeed;
      carModel.position.z -= Math.cos(carAngle) * moveSpeed;
    }
    if (move.backward && cameraFollow) {
      carModel.position.x += Math.sin(carAngle) * moveSpeed;
      carModel.position.z += Math.cos(carAngle) * moveSpeed;
    }
if (move.forward && !cameraFollow || move.backward && !cameraFollow ) {
  showPopup("กรุณากด C เพื่อกลับสู่โหมดขับรถ");
}
if(isc){
  isc.rotation.y += 0.01
}

if(platform1 && carModel) {
  const distance = carModel.position.distanceTo(platform1.position);
  if (distance < 2) { // ปรับค่าตามขนาด platform
  console.log("รถอยู่บนแพลตฟอร์ม");
  }
}
console.log(
  `Car Position: x=${carModel.position.x.toFixed(2)}, y=${carModel.position.y.toFixed(2)}, z=${carModel.position.z.toFixed(2)}`
);
// --- Popup แจ้งเตือนทางขวา ---
function showPopup(message) {
  let popup = document.getElementById('popup-alert');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'popup-alert';
    popup.style.position = 'fixed';
    popup.style.top = '32px';
    popup.style.right = '32px';
    popup.style.background = 'rgba(30,30,30,0.95)';
    popup.style.color = '#fff';
    popup.style.padding = '16px 28px';
    popup.style.borderRadius = '12px';
    popup.style.fontSize = '1.1rem';
    popup.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
    popup.style.zIndex = '9999';
    popup.style.opacity = '0';
    popup.style.transition = 'opacity 0.3s';
    document.body.appendChild(popup);
  }
  popup.textContent = message;
  popup.style.opacity = '1';
  clearTimeout(popup._timeout);
  popup._timeout = setTimeout(() => {
    popup.style.opacity = '0';
  }, 2000);
}
    carModel.rotation.y = carAngle + Math.PI / 2;

    if (cameraFollow) {
      const camOffset = new THREE.Vector3(
        Math.sin(carAngle) * 10,
        9,
        Math.cos(carAngle) * 10
      );
      camera.position.copy(carModel.position).add(camOffset);
      camera.lookAt(carModel.position);
      controls.target.copy(carModel.position);
    }
  }
  updateCarOnGround();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(renderloop);
};
renderloop();

scene.background = new THREE.Color('#FFDD99');

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const fontLoader = new FontLoader();
fontLoader.load('public/fonts/helvetiker_regular.typeface.json', function(font) {
  const textGeo = new TextGeometry("Hello I'm Nattamon", {
    font: font,
    size: 2, // ขนาดเล็กลงอีก
    height: 10, // บางลง
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    color: 0x00bfff, // เปลี่ยนเป็นสีที่ต้องการ เช่น ฟ้า
    bevelSegments: 3
  });
  const textff = new TextGeometry("My skills", {
    font: font,
    size: 2, // ขนาดเล็กลงอีก
    height: 0.1, // บางลง
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    color: 0x00bfff, // เปลี่ยนเป็นสีที่ต้องการ เช่น ฟ้า
    bevelSegments: 3
  });
  
  function createGradientTexture(colorTop, colorBottom) {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(1, 0, 0, size);
    gradient.addColorStop(0, colorTop);
    gradient.addColorStop(1, colorBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  const gradientTexture = createGradientTexture('#f10808', '#e5f108');
  const textMat = new THREE.MeshStandardMaterial({
    // map: gradientTexture,
    metalness: 0.5,
    roughness: 0.3
  });
  const text2 = new THREE.Mesh(textff, textMat);
  const textMesh = new THREE.Mesh(textGeo, textMat);
  text2.position.set(10, 2, 10); // ปรับให้ลอยเหนือพื้นเล็กน้อย
  text2.castShadow = true;

  text2.scale.set(1, 1, 0.01); // บีบความลึก Z ไม่ให้ยืด
  textMesh.position.set(-5, 0.06, 0); // ปรับให้ลอยเหนือพื้นเล็กน้อย
  textMesh.castShadow = true;
  textMesh.scale.set(1, 1, 0.01); // บีบความลึก Z ไม่ให้ยืด
  scene.add(textMesh);
  scene.add(text2);
});
