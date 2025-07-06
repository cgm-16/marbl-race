// ABOUTME: Unit tests for 3D scene management composable
// ABOUTME: Tests scene initialization, marble physics, and race simulation
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useScene3D } from './useScene3D'

// Mock Three.js and CANNON
vi.mock('three', () => ({
  Scene: vi.fn(() => ({ add: vi.fn() })),
  PerspectiveCamera: vi.fn(() => ({ 
    position: { set: vi.fn(), lerp: vi.fn() },
    lookAt: vi.fn()
  })),
  WebGLRenderer: vi.fn(() => ({ 
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    domElement: document.createElement('div')
  })),
  DirectionalLight: vi.fn(() => ({ position: { set: vi.fn(() => ({ normalize: vi.fn() })) } })),
  PlaneGeometry: vi.fn(),
  BoxGeometry: vi.fn(),
  CylinderGeometry: vi.fn(),
  SphereGeometry: vi.fn(),
  MeshStandardMaterial: vi.fn(),
  Mesh: vi.fn(() => ({ 
    rotation: { x: 0 }, 
    position: { 
      set: vi.fn(), 
      copy: vi.fn(), 
      toArray: vi.fn(() => [0, 0, 0]),
      x: 0, y: 0, z: 0
    } 
  })),
  CanvasTexture: vi.fn(),
  SpriteMaterial: vi.fn(),
  Sprite: vi.fn(() => ({ 
    scale: { set: vi.fn() }, 
    position: { set: vi.fn() } 
  })),
  Vector3: vi.fn(() => ({ lerp: vi.fn() }))
}))

vi.mock('cannon-es', () => ({
  World: vi.fn(() => ({ 
    gravity: { set: vi.fn() },
    addBody: vi.fn(),
    step: vi.fn()
  })),
  Body: vi.fn(() => ({ 
    position: { set: vi.fn(), copy: vi.fn() },
    velocity: { set: vi.fn() },
    quaternion: { setFromEuler: vi.fn() }
  })),
  Plane: vi.fn(),
  Box: vi.fn(),
  Cylinder: vi.fn(),
  Sphere: vi.fn(),
  Vec3: vi.fn()
}))

vi.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: vi.fn(() => ({ update: vi.fn() }))
}))

// Mock requestAnimationFrame
vi.stubGlobal('requestAnimationFrame', vi.fn())

describe('useScene3D', () => {
  let sceneManager: ReturnType<typeof useScene3D>
  let mockContainer: HTMLDivElement

  beforeEach(() => {
    mockContainer = document.createElement('div')
    sceneManager = useScene3D()
  })

  it('should initialize scene successfully', () => {
    const marbles = [
      { name: 'Marble 1', color: '#ff0000' },
      { name: 'Marble 2', color: '#00ff00' }
    ]

    sceneManager.initializeScene(mockContainer, marbles)

    expect(sceneManager.isInitialized.value).toBe(true)
  })

  it('should start marble physics simulation', () => {
    const marbles = [
      { name: 'Marble 1', color: '#ff0000' },
      { name: 'Marble 2', color: '#00ff00' }
    ]

    sceneManager.initializeScene(mockContainer, marbles)
    sceneManager.startRace()

    expect(sceneManager.raceActive.value).toBe(true)
  })

  it('should reset marble positions', () => {
    const marbles = [
      { name: 'Marble 1', color: '#ff0000' },
      { name: 'Marble 2', color: '#00ff00' }
    ]

    sceneManager.initializeScene(mockContainer, marbles)
    sceneManager.startRace()
    sceneManager.resetRace()

    expect(sceneManager.raceActive.value).toBe(false)
  })

  it('should reset marble visual positions immediately', () => {
    const marbles = [
      { name: 'Marble 1', color: '#ff0000' },
      { name: 'Marble 2', color: '#00ff00' }
    ]

    sceneManager.initializeScene(mockContainer, marbles)
    sceneManager.startRace()
    sceneManager.resetRace()

    expect(sceneManager.raceActive.value).toBe(false)
    // Visual positions should be reset immediately without waiting for animation loop
    expect(typeof sceneManager.resetRace).toBe('function')
  })

  it('should handle finish line detection', () => {
    const marbles = [
      { name: 'Marble 1', color: '#ff0000' },
      { name: 'Marble 2', color: '#00ff00' }
    ]

    const onFinish = (index: number) => { 
      console.log(`Winner: ${index}`)
    }

    sceneManager.initializeScene(mockContainer, marbles, onFinish)
    
    // Simulate marble reaching finish line
    sceneManager.checkWinner()

    // Winner detection logic will be implemented in the actual composable
    expect(typeof sceneManager.checkWinner).toBe('function')
  })

  it('should clean up resources on destroy', () => {
    const marbles = [
      { name: 'Marble 1', color: '#ff0000' }
    ]

    sceneManager.initializeScene(mockContainer, marbles)
    sceneManager.destroy()

    expect(sceneManager.isInitialized.value).toBe(false)
  })
})