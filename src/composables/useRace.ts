// ABOUTME: Composable for managing race state and operations
// ABOUTME: Provides reactive race state, start/reset/finish functionality, and status computation
import { ref, computed } from 'vue'
import type { RaceState } from '../types/marble'

export function useRace() {
  const raceState = ref<RaceState>({
    started: false,
    finished: false,
    winnerIndex: null
  })

  const startRace = () => {
    raceState.value.started = true
    raceState.value.finished = false
    raceState.value.winnerIndex = null
  }

  const finishRace = (winnerIndex: number) => {
    if (!raceState.value.started || raceState.value.finished) return
    
    raceState.value.finished = true
    raceState.value.winnerIndex = winnerIndex
  }

  const resetRace = () => {
    raceState.value.started = false
    raceState.value.finished = false
    raceState.value.winnerIndex = null
  }

  const raceStatus = computed(() => {
    if (raceState.value.finished) return 'finished'
    if (raceState.value.started) return 'running'
    return 'ready'
  })

  return {
    raceState,
    startRace,
    finishRace,
    resetRace,
    raceStatus
  }
}