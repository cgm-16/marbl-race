// ABOUTME: Integration tests for main App component
// ABOUTME: Tests component integration and state management flow
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

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