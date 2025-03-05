<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";

const sceneRef = ref<HTMLDivElement | null>(null);
const marbles = reactive<any>([]);
const world = new CANNON.World();
const marbleBodies = ref<CANNON.Body[]>([]);
const marbleMeshes = ref<THREE.Mesh[]>([]);
let raceStarted = ref(false);

function addMarble() {
  if (marbles.length < 10) {
    marbles.push({ name: "", color: "#ff0000" });
  }
}

function removeMarble(index : number) {
  if (marbles.length > 1) {
    marbles.splice(index, 1);
  }
}

function setupScene() {
  if (!sceneRef.value) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  sceneRef.value.appendChild(renderer.domElement);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5).normalize();
  scene.add(light);

  // Physics world
  world.gravity.set(0, -9.81, 0);

  // Racetrack (inclined plane)
  const trackGeometry = new THREE.PlaneGeometry(20, 50);
  const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x006600 });
  const trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
  trackMesh.rotation.x = -Math.PI / 2.2; // Slightly inclined for downhill effect
  scene.add(trackMesh);

  const trackBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
  trackBody.quaternion.setFromEuler(-Math.PI / 2.2, 0, 0);
  world.addBody(trackBody);

  // Guardrails
  const railMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const railGeometry = new THREE.BoxGeometry(1, 1, 50);

  const leftRailMesh = new THREE.Mesh(railGeometry, railMaterial);
  leftRailMesh.position.set(-10.5, 0.5, 0);
  scene.add(leftRailMesh);

  const rightRailMesh = new THREE.Mesh(railGeometry, railMaterial);
  rightRailMesh.position.set(10.5, 0.5, 0);
  scene.add(rightRailMesh);

  const leftRailBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 25)),
  });
  leftRailBody.position.set(-10.5, 0.5, 0);
  world.addBody(leftRailBody);

  const rightRailBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 25)),
  });
  rightRailBody.position.set(10.5, 0.5, 0);
  world.addBody(rightRailBody);

  // Create Marbles
  marbles.forEach((marble : any, index : number) => {
    const body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(0.5),
      type: CANNON.Body.STATIC,
    });
    body.position.set((index - 5) * 2, 10, -22);
    world.addBody(body);
    marbleBodies.value.push(body);

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: marble.color });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    marbleMeshes.value.push(mesh);
  });

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 10, 15);
  controls.update();

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    world.step(1 / 60);
    marbleMeshes.value.forEach((mesh, index) => {
      mesh.position.copy(marbleBodies.value[index].position);
    });
    renderer.render(scene, camera);
  }
  animate();
}

function startRace() {
  raceStarted.value = true;
  marbleBodies.value.forEach((body) => {
    body.type = CANNON.Body.DYNAMIC;
    body.velocity.set(0, 0, 5);
  });
}

function resetRace() {
  raceStarted.value = false;
  marbleBodies.value.forEach((body, index) => {
    body.type = CANNON.Body.STATIC;
    body.position.set((index - 5) * 2, 10, -22);
    body.velocity.set(0, 0, 0);
  });
}

onMounted(() => {
  for (let i = 0; i < 5; i++) {
    addMarble();
  }
  setupScene();
});
</script>

<template>
  <div>
    <div v-for="(marble, index) in marbles" :key="index">
      <input v-model="marble.name" placeholder="Marble Name" />
      <input v-model="marble.color" type="color" />
      <button @click="removeMarble(index)" v-if="marbles.length > 1">
        Remove
      </button>
    </div>
    <button @click="addMarble" v-if="marbles.length < 10">Add Marble</button>
    <button @click="startRace">Start Race</button>
    <button @click="resetRace">Reset Race</button>
    <div ref="sceneRef" style="width: 100vw; height: 100vh"></div>
  </div>
</template>

<style scoped>
.TODO {
  --width: 300px;
  position: absolute;
  width: var(--width);
  top: 10vh;
  left: calc(50vw - var(--width) / 2);
  color: azure;
  text-align: center;
}
</style>
