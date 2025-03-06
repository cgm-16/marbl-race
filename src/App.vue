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
const nameLabels = ref<THREE.Sprite[]>([]);
const raceStarted = ref(false);
const raceFinished = ref(false);
const camera = ref<THREE.PerspectiveCamera | null>(null);

function addMarble() {
  if (marbles.length < 10) {
    marbles.push({ name: `Marble ${marbles.length + 1}`, color: "#ff0000" });
  }
}

function removeMarble(index: number) {
  if (marbles.length > 1) {
    marbles.splice(index, 1);
  }
}

function setupScene() {
  if (!sceneRef.value) return;

  const scene = new THREE.Scene();
  camera.value = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  sceneRef.value.appendChild(renderer.domElement);

  if (!camera.value) return;

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5).normalize();
  scene.add(light);

  // Physics world
  world.gravity.set(0, -9.81, 0);

  // Racetrack (inclined plane)
  const trackGeometry = new THREE.PlaneGeometry(40, 400);
  const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x006600 });
  const trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
  trackMesh.rotation.x = -Math.PI / 2.2;
  scene.add(trackMesh);

  const trackBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
  trackBody.quaternion.setFromEuler(-Math.PI / 2.2, 0, 0);
  world.addBody(trackBody);

  // Guardrails
  const guardrails = [];
  const railHeight = 500;
  const railThickness = 5;
  const railMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });

  const leftRailGeometry = new THREE.BoxGeometry(
    railThickness,
    railHeight,
    400
  );
  const leftRailMesh = new THREE.Mesh(leftRailGeometry, railMaterial);
  leftRailMesh.position.set(-20, 0, 0);
  scene.add(leftRailMesh);

  const rightRailGeometry = new THREE.BoxGeometry(
    railThickness,
    railHeight,
    400
  );
  const rightRailMesh = new THREE.Mesh(rightRailGeometry, railMaterial);
  rightRailMesh.position.set(20, 0, 0);
  scene.add(rightRailMesh);

  const leftRailBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(
      new CANNON.Vec3(railThickness / 2, railHeight / 2, 400)
    ),
  });
  leftRailBody.position.set(-20, 0, 0);
  world.addBody(leftRailBody);

  const rightRailBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(
      new CANNON.Vec3(railThickness / 2, railHeight / 2, 400)
    ),
  });
  rightRailBody.position.set(20, 0, 0);
  world.addBody(rightRailBody);

  guardrails.push(
    { mesh: leftRailMesh, body: leftRailBody },
    { mesh: rightRailMesh, body: rightRailBody }
  );

  // Finish Line
  const finishLineZ = 180;

  // Obstacles (pegs and hills)
  const obstacles = [];
  for (let i = 0; i < 100; i++) {
    const pegGeometry = new THREE.CylinderGeometry(1, 2, 50, 32);
    const pegMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const pegMesh = new THREE.Mesh(pegGeometry, pegMaterial);
    pegMesh.position.set(
      (Math.random() - 0.5) * 40,
      1,
      Math.random() * 400 - 200
    );
    scene.add(pegMesh);

    const pegBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Cylinder(1, 2, 50, 32),
    });
    pegBody.position.copy(new CANNON.Vec3(...pegMesh.position.toArray()));
    world.addBody(pegBody);
    obstacles.push({ mesh: pegMesh, body: pegBody });
  }

  // Create Marbles
  marbles.forEach((marble: { color: any; name: string }, index: number) => {
    const body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(0.5),
      type: CANNON.Body.STATIC,
    });
    body.position.set((index - 5) * 2, 50, -200);
    world.addBody(body);
    marbleBodies.value.push(body);

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: marble.color });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    marbleMeshes.value.push(mesh);

    // Name Label
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.font = "48px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(marble.name, 20, 40);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 1, 1);
    scene.add(sprite);
    nameLabels.value.push(sprite);
  });

  // Controls
  const controls = new OrbitControls(camera.value, renderer.domElement);
  camera.value.position.set(0, 10, 15);
  controls.update();

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    world.step(1 / 60);

    let leadMarble = marbleMeshes.value[0];
    marbleMeshes.value.forEach((mesh, index) => {
      mesh.position.copy(marbleBodies.value[index].position);
      nameLabels.value[index].position.set(
        mesh.position.x,
        mesh.position.y + 1,
        mesh.position.z
      );

      if (mesh.position.z > leadMarble.position.z) {
        leadMarble = mesh;
      }

      if (
        raceStarted.value &&
        !raceFinished.value &&
        mesh.position.z >= finishLineZ
      ) {
        raceFinished.value = true;
        alert(`${marbles[index].name} wins the race!`);
      }
    });

    if (raceStarted.value && leadMarble && camera.value) {
      camera.value.position.lerp(
        new THREE.Vector3(
          leadMarble.position.x,
          leadMarble.position.y + 5,
          leadMarble.position.z - 10
        ),
        0.05
      );
      camera.value.lookAt(leadMarble.position);
    }

    renderer.render(scene, camera.value!);
  }
  animate();
}

function startRace() {
  raceStarted.value = true;
  raceFinished.value = false;
  marbleBodies.value.forEach((body) => {
    body.type = CANNON.Body.DYNAMIC;
    body.velocity.set(0, 0, 5);
  });
}

function resetRace() {
  raceStarted.value = false;
  raceFinished.value = false;
  marbleBodies.value.forEach((body, index) => {
    body.type = CANNON.Body.STATIC;
    body.position.set((index - 5) * 2, 50, -200);
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
