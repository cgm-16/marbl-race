// ABOUTME: Unit tests for race state management composable
// ABOUTME: Tests race start, reset, finish, and winner determination logic
import { describe, it, expect, beforeEach } from 'vitest'
import { useRace } from './useRace'

describe('useRace', () => {
  let raceManager: ReturnType<typeof useRace>

  beforeEach(() => {
    raceManager = useRace()
  })

  it('should initialize with race not started', () => {
    expect(raceManager.raceState.value.started).toBe(false)
    expect(raceManager.raceState.value.finished).toBe(false)
    expect(raceManager.raceState.value.winnerIndex).toBeNull()
  })

  it('should start race', () => {
    raceManager.startRace()
    
    expect(raceManager.raceState.value.started).toBe(true)
    expect(raceManager.raceState.value.finished).toBe(false)
    expect(raceManager.raceState.value.winnerIndex).toBeNull()
  })

  it('should finish race with winner', () => {
    raceManager.startRace()
    raceManager.finishRace(2)
    
    expect(raceManager.raceState.value.started).toBe(true)
    expect(raceManager.raceState.value.finished).toBe(true)
    expect(raceManager.raceState.value.winnerIndex).toBe(2)
  })

  it('should reset race to initial state', () => {
    raceManager.startRace()
    raceManager.finishRace(1)
    
    raceManager.resetRace()
    
    expect(raceManager.raceState.value.started).toBe(false)
    expect(raceManager.raceState.value.finished).toBe(false)
    expect(raceManager.raceState.value.winnerIndex).toBeNull()
  })

  it('should not finish race if not started', () => {
    raceManager.finishRace(1)
    
    expect(raceManager.raceState.value.finished).toBe(false)
    expect(raceManager.raceState.value.winnerIndex).toBeNull()
  })

  it('should not finish race if already finished', () => {
    raceManager.startRace()
    raceManager.finishRace(1)
    raceManager.finishRace(2)
    
    expect(raceManager.raceState.value.winnerIndex).toBe(1)
  })

  it('should compute race status correctly', () => {
    expect(raceManager.raceStatus.value).toBe('ready')
    
    raceManager.startRace()
    expect(raceManager.raceStatus.value).toBe('running')
    
    raceManager.finishRace(0)
    expect(raceManager.raceStatus.value).toBe('finished')
    
    raceManager.resetRace()
    expect(raceManager.raceStatus.value).toBe('ready')
  })
})