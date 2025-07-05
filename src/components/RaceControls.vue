<!-- ABOUTME: Component for race control buttons (start and reset) -->
<!-- ABOUTME: Provides UI controls for race state management with dynamic button states -->
<template>
  <div class="race-controls">
    <button
      data-testid="start-race"
      @click="$emit('startRace')"
      :disabled="raceStatus !== 'ready'"
      class="control-button start-button"
    >
      {{ startButtonText }}
    </button>
    <button
      data-testid="reset-race"
      @click="$emit('resetRace')"
      class="control-button reset-button"
    >
      Reset Race
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  raceStatus: 'ready' | 'running' | 'finished'
}

const props = defineProps<Props>()
defineEmits<{
  startRace: []
  resetRace: []
}>()

const startButtonText = computed(() => {
  switch (props.raceStatus) {
    case 'ready':
      return 'Start Race'
    case 'running':
      return 'Racing...'
    case 'finished':
      return 'Race Finished'
    default:
      return 'Start Race'
  }
})
</script>

<style scoped>
.race-controls {
  display: flex;
  gap: 10px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
}

.control-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.start-button {
  background-color: #4CAF50;
  color: white;
}

.start-button:hover:not(:disabled) {
  background-color: #45a049;
}

.start-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.reset-button {
  background-color: #f44336;
  color: white;
}

.reset-button:hover {
  background-color: #da190b;
}
</style>