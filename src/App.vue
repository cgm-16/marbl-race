<!-- ABOUTME: Main application component for marble racing game -->
<!-- ABOUTME: Orchestrates UI components and manages application state -->
<script setup lang="ts">
import { onMounted } from 'vue'
import MarbleConfig from './components/MarbleConfig.vue'
import RaceControls from './components/RaceControls.vue'
import Scene3D from './components/Scene3D.vue'
import { useMarbles } from './composables/useMarbles'
import { useRace } from './composables/useRace'

const { marbles, addMarble, removeMarble, canAddMarble, canRemoveMarble } = useMarbles()
const { raceState, startRace, resetRace, raceStatus } = useRace()

const handleUpdateMarble = (index: number, updatedMarble: any) => {
  marbles.value[index] = updatedMarble
}

const handleStartRace = () => {
  startRace()
  // TODO: Start physics simulation
}

const handleResetRace = () => {
  resetRace()
  // TODO: Reset physics simulation
}

const handleRaceFinish = (winnerIndex: number) => {
  const winner = marbles.value[winnerIndex]
  alert(`${winner.name} wins the race!`)
  // The race state will be managed by useRace composable in the future
}

onMounted(() => {
  // Initialize with 5 default marbles
  for (let i = 0; i < 5; i++) {
    addMarble()
  }
})
</script>

<template>
  <div class="app">
    <MarbleConfig
      :marbles="marbles"
      :can-add-marble="canAddMarble"
      :can-remove-marble="canRemoveMarble"
      @add-marble="addMarble"
      @remove-marble="removeMarble"
      @update-marble="handleUpdateMarble"
    />
    
    <RaceControls
      :race-status="raceStatus"
      @start-race="handleStartRace"
      @reset-race="handleResetRace"
    />
    
    <Scene3D
      :marbles="marbles"
      :race-started="raceState.started"
      :race-finished="raceState.finished"
      @race-finish="handleRaceFinish"
    />
  </div>
</template>

<style scoped>
.app {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>