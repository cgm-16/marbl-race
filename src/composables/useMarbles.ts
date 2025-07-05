// ABOUTME: Composable for managing marble collection and configuration
// ABOUTME: Provides reactive marble state, add/remove functionality, and validation
import { ref, computed } from 'vue'
import type { Marble } from '../types/marble'

export function useMarbles() {
  const marbles = ref<Marble[]>([])

  const addMarble = () => {
    if (marbles.value.length >= 10) return
    
    marbles.value.push({
      name: `Marble ${marbles.value.length + 1}`,
      color: '#ff0000'
    })
  }

  const removeMarble = (index: number) => {
    if (marbles.value.length <= 1) return
    
    marbles.value.splice(index, 1)
  }

  const canAddMarble = computed(() => marbles.value.length < 10)
  const canRemoveMarble = computed(() => marbles.value.length > 1)

  return {
    marbles,
    addMarble,
    removeMarble,
    canAddMarble,
    canRemoveMarble
  }
}