<!-- ABOUTME: Component for configuring marble names and colors -->
<!-- ABOUTME: Provides UI for adding, removing, and editing marble properties with visual preview -->
<template>
  <div class="marble-config" :class="{ 'race-active': raceStarted }">
    <div v-if="raceStarted" class="race-active-notice">
      <strong>Race Active</strong> - Marble editing disabled
    </div>
    <div class="marble-list">

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
  gap: 16px;
  padding: 24px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  min-width: 340px;
  transition: opacity 0.3s ease-in-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.marble-config.race-active {
  opacity: 0.2;
}

.race-active-notice {
  padding: 12px;
  background-color: rgba(255, 165, 0, 0.1);
  border: 1px solid #ff9800;
  border-radius: 8px;
  text-align: center;
  color: #e65100;
  font-size: 14px;
  font-weight: 500;
}

.marble-list {
  height: 30vh;
  overflow-y: auto;
}

.marble-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
}

.marble-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
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
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.marble-name:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.marble-name:disabled {
  background-color: #f8f9fa;
  color: #666;
  cursor: not-allowed;
}

.marble-color {
  width: 50px;
  height: 38px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.marble-color:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.remove-button {
  padding: 10px 16px;
  background-color: #ff5252;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.remove-button:hover:not(:disabled) {
  background-color: #f44336;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 82, 82, 0.3);
}

.remove-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.add-button {
  padding: 12px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.add-button:hover:not(:disabled) {
  background-color: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.add-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>