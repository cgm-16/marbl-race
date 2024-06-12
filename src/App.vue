<script setup lang="ts">

import { ref, onMounted } from 'vue';
import * as THREE from 'three';

const target = ref();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({
  color: 0x555555,
  specular: 0xffffff,
  shininess: 50
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const light = new THREE.DirectionalLight( 0xffffff );
light.position.set(0, 1, 1);
scene.add(light)

camera.position.z = 5;

window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

onMounted(() => {
  target.value.appendChild(renderer.domElement);
  animate();
});
</script>

<template>
  <div class="TODO">Page is being built...</div>
  <div ref="target"></div>
</template>

<style scoped>
  .TODO {
    --width: 300px;
    position: absolute;
    width: var(--width);
    top: 10vh;
    left: calc(50vw - var(--width)/2);
    color: azure;
    text-align: center;
  }
</style>