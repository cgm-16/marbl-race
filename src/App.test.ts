// ABOUTME: Integration tests for main App component
// ABOUTME: Tests component integration and state management flow
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

// Mock Three.js and CANNON to prevent WebGL context errors
vi.mock('three', () => ({
  Scene: vi.fn(() => ({ add: vi.fn() })),
  PerspectiveCamera: vi.fn(() => ({ 
    position: { set: vi.fn(), lerp: vi.fn() },
    lookAt: vi.fn()
  })),
  WebGLRenderer: vi.fn(() => {
    // Mock WebGL context to prevent gl.getExtension errors
    const mockCanvas = document.createElement('canvas')
    const mockGL = {
      getExtension: vi.fn(() => null),
      getParameter: vi.fn(() => 'WebGL 1.0'),
      createShader: vi.fn(),
      shaderSource: vi.fn(),
      compileShader: vi.fn(),
      createProgram: vi.fn(),
      attachShader: vi.fn(),
      linkProgram: vi.fn(),
      useProgram: vi.fn(),
      getShaderParameter: vi.fn(() => true),
      getProgramParameter: vi.fn(() => true),
      createBuffer: vi.fn(),
      bindBuffer: vi.fn(),
      bufferData: vi.fn(),
      createTexture: vi.fn(),
      bindTexture: vi.fn(),
      texImage2D: vi.fn(),
      texParameteri: vi.fn(),
      generateMipmap: vi.fn(),
      enable: vi.fn(),
      disable: vi.fn(),
      depthFunc: vi.fn(),
      clear: vi.fn(),
      clearColor: vi.fn(),
      clearDepth: vi.fn(),
      viewport: vi.fn(),
      drawElements: vi.fn(),
      drawArrays: vi.fn()
    }
    mockCanvas.getContext = vi.fn((contextId: string) => {
      if (contextId === 'webgl' || contextId === 'webgl2') {
        return mockGL
      }
      return null
    }) as any
    
    return { 
      setSize: vi.fn(),
      render: vi.fn(),
      dispose: vi.fn(),
      domElement: mockCanvas
    }
  }),
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

describe('App (Refactored)', () => {
  it('should mount without errors', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })

  it('should render all child components', () => {
    const wrapper = mount(App)
    
    // Check that components are rendered
    expect(wrapper.findComponent({ name: 'MarbleConfig' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'RaceControls' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'Scene3D' }).exists()).toBe(true)
  })

  it('should initialize with 5 marbles', async () => {
    const wrapper = mount(App)
    
    // Wait for component to mount and initialize
    await wrapper.vm.$nextTick()
    
    const marbleConfig = wrapper.findComponent({ name: 'MarbleConfig' })
    expect(marbleConfig.props('marbles')).toHaveLength(5)
  })

  it('should start with race status ready', () => {
    const wrapper = mount(App)
    
    const raceControls = wrapper.findComponent({ name: 'RaceControls' })
    expect(raceControls.props('raceStatus')).toBe('ready')
  })

  it('should pass correct props to Scene3D', () => {
    const wrapper = mount(App)
    
    const scene3D = wrapper.findComponent({ name: 'Scene3D' })
    expect(scene3D.props('raceStarted')).toBe(false)
    expect(scene3D.props('raceFinished')).toBe(false)
    expect(Array.isArray(scene3D.props('marbles'))).toBe(true)
  })
})