<!-- ABOUTME: Component for configuring marble names and colors -->
<!-- ABOUTME: Provides UI for adding, removing, and editing marble properties -->
<template>
  <div class="marble-config">
    <div
      v-for="(marble, index) in marbles"
      :key="index"
      class="marble-item"
    >
      <input
        :data-testid="`marble-name-${index}`"
        :value="marble.name"
        @input="updateMarbleName(index, $event)"
        placeholder="Marble Name"
        class="marble-name"
      />
      <input
        :data-testid="`marble-color-${index}`"
        :value="marble.color"
        @input="updateMarbleColor(index, $event)"
        type="color"
        class="marble-color"
      />
      <button
        v-if="canRemoveMarble"
        :data-testid="`remove-marble-${index}`"
        @click="$emit('removeMarble', index)"
        class="remove-button"
      >
        Remove
      </button>
    </div>
    <button
      data-testid="add-marble"
      @click="$emit('addMarble')"
      :disabled="!canAddMarble"
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
}

interface Emits {
  addMarble: []
  removeMarble: [index: number]
  updateMarble: [index: number, marble: Marble]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

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
  gap: 10px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  min-width: 250px;
}

.marble-item {
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

.marble-color {
  width: 50px;
  height: 35px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-button {
  padding: 8px 12px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-button:hover {
  background-color: #cc0000;
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