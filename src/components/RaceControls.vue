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
  gap: 12px;
  padding: 24px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.control-button {
  padding: 14px 28px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.start-button {
  background-color: #4CAF50;
  color: white;
}

.start-button:hover:not(:disabled) {
  background-color: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
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
  background-color: #d32f2f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}
</style>