<!-- ABOUTME: Component for configuring marble names and colors -->
<!-- ABOUTME: Provides UI for adding, removing, and editing marble properties with visual preview -->
<template>
  <div class="marble-config">
    <div v-if="raceStarted" class="race-active-notice">
      <strong>Race Active</strong> - Marble editing disabled
    </div>
    <div
      v-for="(marble, index) in marbles"
      :key="index"
      class="marble-item"
    >
      <div class="marble-preview">
        <div
          class="marble-sphere"
          :style="{ backgroundColor: marble.color }"
        ></div>
        <div class="marble-label">{{ marble.name || `Marble ${index + 1}` }}</div>
      </div>
      <div class="marble-controls">
        <input
          :data-testid="`marble-name-${index}`"
          :value="marble.name"
          @input="updateMarbleName(index, $event)"
          placeholder="Marble Name"
          class="marble-name"
          :disabled="raceStarted"
        />
        <input
          :data-testid="`marble-color-${index}`"
          :value="marble.color"
          @input="updateMarbleColor(index, $event)"
          type="color"
          class="marble-color"
          :disabled="raceStarted"
        />
        <button
          v-if="canRemoveMarble"
          :data-testid="`remove-marble-${index}`"
          @click="$emit('removeMarble', index)"
          class="remove-button"
          :disabled="raceStarted"
        >
          Remove
        </button>
      </div>
    </div>
    <button
      data-testid="add-marble"
      @click="$emit('addMarble')"
      :disabled="!canAddMarble || raceStarted"
      class="add-button"
    >
      Add Marble
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Marble } from '../types/marble'

interface Props {
  marbles: Marble[]
  canAddMarble: boolean
  canRemoveMarble: boolean
  raceStarted: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  addMarble: []
  removeMarble: [index: number]
  updateMarble: [index: number, marble: Marble]
}>()

const updateMarbleName = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const marble = { ...props.marbles[index], name: target.value }
  emit('updateMarble', index, marble)
}

const updateMarbleColor = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const marble = { ...props.marbles[index], color: target.value }
  emit('updateMarble', index, marble)
}
</script>

<style scoped>
.marble-config {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  min-width: 320px;
}

.race-active-notice {
  padding: 10px;
  background-color: rgba(255, 165, 0, 0.2);
  border: 2px solid #ff9800;
  border-radius: 6px;
  text-align: center;
  color: #e65100;
  font-size: 14px;
}

.marble-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.5);
}

.marble-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.marble-sphere {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.2);
  box-shadow: 
    inset -5px -5px 10px rgba(0, 0, 0, 0.2),
    inset 5px 5px 10px rgba(255, 255, 255, 0.3);
}

.marble-label {
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.marble-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.marble-name {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.marble-name:disabled {
  background-color: #f5f5f5;
  color: #666;
  cursor: not-allowed;
}

.marble-color {
  width: 50px;
  height: 35px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.marble-color:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.remove-button {
  padding: 8px 12px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-button:hover:not(:disabled) {
  background-color: #cc0000;
}

.remove-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.add-button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button:hover:not(:disabled) {
  background-color: #45a049;
}

.add-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>