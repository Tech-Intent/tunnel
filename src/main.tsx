import * as THREE from "three";
import "./index.css";
import {
  BokehPass,
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";
import createTunnel from "./components/tunnel";
import createNameTitle from "./components/nameCard";
import createCardSystem from "./components/cardsSystem";
// Create the scene
const scene = new THREE.Scene();

scene.background = new THREE.Color(0xa0e0ff);

// Create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the camera
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-6, 2.25, 2.6);

renderer.domElement.addEventListener("click", () => {
  renderer.domElement.requestPointerLock();
});

document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement === renderer.domElement) {
    document.addEventListener("mousemove", onMouseMove, false);
  } else {
    document.removeEventListener("mousemove", onMouseMove, false);
  }
});

let yaw = (-50 * Math.PI) / 180;
let pitch = 0;
function onMouseMove(event: { movementX: number; movementY: number }) {
  const sensitivity = 0.002;
  yaw -= event.movementX * sensitivity;
  pitch -= event.movementY * sensitivity;

  const pitchLimit = Math.PI / 2 - 0.01;
  pitch = Math.max(-pitchLimit, Math.min(pitchLimit, pitch));
}

function updateCameraRotation() {
  const euler = new THREE.Euler(pitch, yaw, 0, "YXZ");
  camera.quaternion.setFromEuler(euler);
}
const keys: Record<string, boolean> = {};
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (e.code === "ControlLeft") {
  }
});
document.addEventListener("keyup", (e) => (keys[e.code] = false));

function updateCameraPosition(delta: number) {
  const speed = 5; // units per second
  const direction = new THREE.Vector3();

  if (keys["KeyW"]) direction.z -= 10;
  if (keys["KeyS"]) direction.z += 10;
  if (keys["KeyA"]) direction.x -= 10;
  if (keys["KeyD"]) direction.x += 10;

  if (direction.lengthSq() > 0) {
    direction.normalize();
    direction.applyQuaternion(camera.quaternion);
    camera.position.addScaledVector(direction, speed * delta);
    camera.position.setY(2.25);
    if (camera.position.z > 2.7) camera.position.setZ(2.7);
    if (camera.position.z < -2.7) camera.position.setZ(-2.7);
    if (camera.position.x > 65) camera.position.setX(65);
    if (camera.position.x < -6) camera.position.setX(-6);
  }
}

createTunnel(scene);
createNameTitle(scene);
const cardArray = createCardSystem(scene, camera);

// Add a light to the scene for better visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft, global light
scene.add(ambientLight);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.42,
  0.7,
  0.3
);
composer.addPass(bloomPass);
// Bokeh/DOF settings
const bokehPass = new BokehPass(scene, camera, {
  focus: 8.0, // distance to focus point
  aperture: 0.0003, // smaller = more DOF blur
  maxblur: 10, // intensity of blur
});

composer.addPass(bokehPass); // Animation loop

let lastTime = performance.now();

const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    onSpacePress();
  }
});

function onSpacePress() {
  raycaster.setFromCamera(center, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    intersects.map((obj) => {
      const clickedObject = obj.object;

      if (clickedObject.name === "GitHubCard") {
        window.open("https://github.com/Tech-Intent", "_blank");
      } else if (clickedObject.name === "LinkedInCard") {
        window.open(
          "https://linkedin.com/in/nguyen-van-mao-ba9959361",
          "_blank"
        );
      } else if (clickedObject.name === "GmailCard")
        window.open(
          "https://mail.google.com/mail/?view=cm&fs=1&to=vanmaonguyen60@gmail.com",
          "_blank"
        );
    });
  }
}

window.addEventListener(
  "keydown",
  (event) => {
    if (event.code === "Space") onSpacePress();
  },
  false
);

function animate() {
  const now = performance.now();
  const delta = (now - lastTime) / 1000;
  lastTime = now;

  requestAnimationFrame(animate);

  updateCameraRotation();
  updateCameraPosition(delta);

  cardArray.cards.map((card) => {
    card.animateDetail(delta);
  });
  // renderer.render(scene, camera);

  composer.render();
}

// Start the animation
animate();
