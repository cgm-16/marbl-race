// ABOUTME: Unit tests for marble management composable
// ABOUTME: Tests marble creation, removal, and configuration logic
import { describe, it, expect, beforeEach } from 'vitest'
import { useMarbles } from './useMarbles'

describe('useMarbles', () => {
  let marbleManager: ReturnType<typeof useMarbles>

  beforeEach(() => {
    marbleManager = useMarbles()
  })

  it('should initialize with empty marbles array', () => {
    expect(marbleManager.marbles.value).toEqual([])
  })

  it('should add a marble with default properties', () => {
    marbleManager.addMarble()
    
    expect(marbleManager.marbles.value).toHaveLength(1)
    expect(marbleManager.marbles.value[0].name).toBe('Marble 1')
    expect(marbleManager.marbles.value[0].color).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('should add multiple marbles with incremented names', () => {
    marbleManager.addMarble()
    marbleManager.addMarble()
    marbleManager.addMarble()
    
    expect(marbleManager.marbles.value).toHaveLength(3)
    expect(marbleManager.marbles.value[0].name).toBe('Marble 1')
    expect(marbleManager.marbles.value[1].name).toBe('Marble 2')
    expect(marbleManager.marbles.value[2].name).toBe('Marble 3')
  })

  it('should not add more than 10 marbles', () => {
    // Add 10 marbles
    for (let i = 0; i < 10; i++) {
      marbleManager.addMarble()
    }
    
    expect(marbleManager.marbles.value).toHaveLength(10)
    
    // Try to add one more
    marbleManager.addMarble()
    
    expect(marbleManager.marbles.value).toHaveLength(10)
  })

  it('should remove a marble by index', () => {
    marbleManager.addMarble()
    marbleManager.addMarble()
    marbleManager.addMarble()
    
    marbleManager.removeMarble(1)
    
    expect(marbleManager.marbles.value).toHaveLength(2)
    expect(marbleManager.marbles.value[0].name).toBe('Marble 1')
    expect(marbleManager.marbles.value[1].name).toBe('Marble 3')
  })

  it('should not remove marble if only one remains', () => {
    marbleManager.addMarble()
    
    marbleManager.removeMarble(0)
    
    expect(marbleManager.marbles.value).toHaveLength(1)
  })

  it('should check if can add marble', () => {
    expect(marbleManager.canAddMarble.value).toBe(true)
    
    // Add 10 marbles
    for (let i = 0; i < 10; i++) {
      marbleManager.addMarble()
    }
    
    expect(marbleManager.canAddMarble.value).toBe(false)
  })

  it('should check if can remove marble', () => {
    marbleManager.addMarble()
    
    expect(marbleManager.canRemoveMarble.value).toBe(false)
    
    marbleManager.addMarble()
    
    expect(marbleManager.canRemoveMarble.value).toBe(true)
  })
})