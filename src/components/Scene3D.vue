<!-- ABOUTME: Component for rendering the 3D marble race scene -->
<!-- ABOUTME: Manages Three.js scene, physics simulation, and marble visualization -->
<template>
  <div ref="sceneContainer" class="scene-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useScene3D } from '../composables/useScene3D'
import type { Marble } from '../types/marble'

interface Props {
  marbles: Marble[]
  raceStarted: boolean
  raceFinished: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  raceFinish: [winnerIndex: number]
}>()

const sceneContainer = ref<HTMLDivElement | null>(null)
const { 
  isInitialized, 
  raceActive, 
  initializeScene, 
  startRace, 
  resetRace, 
  destroy 
} = useScene3D()

const handleRaceFinish = (winnerIndex: number) => {
  emit('raceFinish', winnerIndex)
}

onMounted(() => {
  if (sceneContainer.value && props.marbles.length > 0) {
    initializeScene(sceneContainer.value as unknown as HTMLElement, props.marbles, handleRaceFinish)
  }
})

onUnmounted(() => {
  destroy()
})

// Watch for race state changes
watch(() => props.raceStarted, (newValue, oldValue) => {
  if (newValue && !oldValue && isInitialized.value) {
    startRace()
  }
})

watch(() => props.raceFinished, (newValue, oldValue) => {
  if (newValue && !oldValue && isInitialized.value) {
    // Race finished externally, reset if needed
    if (raceActive.value) {
      resetRace()
    }
  }
})

// Watch for marble changes and reinitialize scene
watch(() => props.marbles, (newMarbles) => {
  if (sceneContainer.value && newMarbles.length > 0 && !raceActive.value) {
    destroy()
    initializeScene(sceneContainer.value as unknown as HTMLElement, newMarbles, handleRaceFinish)
  }
}, { deep: true })
</script>

<style scoped>
.scene-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}
</style>