// ABOUTME: Component tests for race control buttons
// ABOUTME: Tests start race and reset race functionality and button states
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceControls from './RaceControls.vue'

describe('RaceControls', () => {
  it('should render start and reset buttons', () => {
    const wrapper = mount(RaceControls, {
      props: {
        raceStatus: 'ready'
      }
    })

    expect(wrapper.find('[data-testid="start-race"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="reset-race"]').exists()).toBe(true)
  })

  it('should emit start race event', async () => {
    const wrapper = mount(RaceControls, {
      props: {
        raceStatus: 'ready'
      }
    })

    await wrapper.find('[data-testid="start-race"]').trigger('click')

    expect(wrapper.emitted('startRace')).toHaveLength(1)
  })

  it('should emit reset race event', async () => {
    const wrapper = mount(RaceControls, {
      props: {
        raceStatus: 'finished'
      }
    })

    await wrapper.find('[data-testid="reset-race"]').trigger('click')

    expect(wrapper.emitted('resetRace')).toHaveLength(1)
  })

  it('should disable start button when race is running', () => {
    const wrapper = mount(RaceControls, {
      props: {
        raceStatus: 'running'
      }
    })

    const startButton = wrapper.find('[data-testid="start-race"]')
    expect(startButton.attributes('disabled')).toBeDefined()
  })

  it('should disable start button when race is finished', () => {
    const wrapper = mount(RaceControls, {
      props: {
        raceStatus: 'finished'
      }
    })

    const startButton = wrapper.find('[data-testid="start-race"]')
    expect(startButton.attributes('disabled')).toBeDefined()
  })

  it('should show correct button text based on race status', () => {
    const readyWrapper = mount(RaceControls, {
      props: { raceStatus: 'ready' }
    })
    expect(readyWrapper.find('[data-testid="start-race"]').text()).toBe('Start Race')

    const runningWrapper = mount(RaceControls, {
      props: { raceStatus: 'running' }
    })
    expect(runningWrapper.find('[data-testid="start-race"]').text()).toBe('Racing...')

    const finishedWrapper = mount(RaceControls, {
      props: { raceStatus: 'finished' }
    })
    expect(finishedWrapper.find('[data-testid="start-race"]').text()).toBe('Race Finished')
  })
})