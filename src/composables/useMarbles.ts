// ABOUTME: Composable for managing marble collection and configuration
// ABOUTME: Provides reactive marble state, add/remove functionality, and validation
import { ref, computed } from 'vue'
import type { Marble } from '../types/marble'

export function useMarbles() {
  const marbles = ref<Marble[]>([])

  const addMarble = () => {
    if (marbles.value.length >= 10) return
    
    // Generate random color
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    
    marbles.value.push({
      name: `Marble ${marbles.value.length + 1}`,
      color: randomColor
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