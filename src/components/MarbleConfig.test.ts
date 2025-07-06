// ABOUTME: Component tests for marble configuration UI
// ABOUTME: Tests marble list rendering, add/remove functionality, and input binding
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MarbleConfig from './MarbleConfig.vue'

describe('MarbleConfig', () => {
  it('should render marble list', () => {
    const wrapper = mount(MarbleConfig, {
      props: {
        marbles: [
          { name: 'Marble 1', color: '#ff0000' },
          { name: 'Marble 2', color: '#00ff00' }
        ],
        canAddMarble: true,
        canRemoveMarble: true,
        raceStarted: false
      }
    })

    const nameInput1 = wrapper.find('[data-testid="marble-name-0"]') as any
    const nameInput2 = wrapper.find('[data-testid="marble-name-1"]') as any
    
    expect(nameInput1.element.value).toBe('Marble 1')
    expect(nameInput2.element.value).toBe('Marble 2')
  })

  it('should emit add marble event', async () => {
    const wrapper = mount(MarbleConfig, {
      props: {
        marbles: [],
        canAddMarble: true,
        canRemoveMarble: false,
        raceStarted: false
      }
    })

    await wrapper.find('[data-testid="add-marble"]').trigger('click')

    expect(wrapper.emitted('addMarble')).toHaveLength(1)
  })

  it('should emit remove marble event', async () => {
    const wrapper = mount(MarbleConfig, {
      props: {
        marbles: [
          { name: 'Marble 1', color: '#ff0000' },
          { name: 'Marble 2', color: '#00ff00' }
        ],
        canAddMarble: true,
        canRemoveMarble: true,
        raceStarted: false
      }
    })

    await wrapper.find('[data-testid="remove-marble-0"]').trigger('click')

    expect(wrapper.emitted('removeMarble')).toHaveLength(1)
    expect(wrapper.emitted('removeMarble')?.[0]).toEqual([0])
  })

  it('should emit marble update event', async () => {
    const wrapper = mount(MarbleConfig, {
      props: {
        marbles: [
          { name: 'Marble 1', color: '#ff0000' }
        ],
        canAddMarble: true,
        canRemoveMarble: false,
        raceStarted: false
      }
    })

    const nameInput = wrapper.find('[data-testid="marble-name-0"]')
    await nameInput.setValue('New Name')

    expect(wrapper.emitted('updateMarble')).toHaveLength(1)
    expect(wrapper.emitted('updateMarble')?.[0]).toEqual([0, { name: 'New Name', color: '#ff0000' }])
  })

  it('should disable add button when cannot add marble', () => {
    const wrapper = mount(MarbleConfig, {
      props: {
        marbles: [],
        canAddMarble: false,
        canRemoveMarble: false,
        raceStarted: false
      }
    })

    const addButton = wrapper.find('[data-testid="add-marble"]')
    expect(addButton.attributes('disabled')).toBeDefined()
  })

  it('should hide remove button when cannot remove marble', () => {
    const wrapper = mount(MarbleConfig, {
      props: {
        marbles: [
          { name: 'Marble 1', color: '#ff0000' }
        ],
        canAddMarble: true,
        canRemoveMarble: false,
        raceStarted: false
      }
    })

    const removeButton = wrapper.find('[data-testid="remove-marble-0"]')
    expect(removeButton.exists()).toBe(false)
  })

  it('should show race active notice when race is started', () => {
    const wrapper = mount(MarbleConfig, {
      props: {
        marbles: [
          { name: 'Marble 1', color: '#ff0000' }
        ],
        canAddMarble: true,
        canRemoveMarble: true,
        raceStarted: true
      }
    })

    const raceNotice = wrapper.find('.race-active-notice')
    expect(raceNotice.exists()).toBe(true)
    expect(raceNotice.text()).toContain('Race Active')
  })

  it('should disable all inputs when race is started', () => {
    const wrapper = mount(MarbleConfig, {
      props: {
        marbles: [
          { name: 'Marble 1', color: '#ff0000' }
        ],
        canAddMarble: true,
        canRemoveMarble: true,
        raceStarted: true
      }
    })

    const nameInput = wrapper.find('[data-testid="marble-name-0"]')
    const colorInput = wrapper.find('[data-testid="marble-color-0"]')
    const removeButton = wrapper.find('[data-testid="remove-marble-0"]')
    const addButton = wrapper.find('[data-testid="add-marble"]')

    expect(nameInput.attributes('disabled')).toBeDefined()
    expect(colorInput.attributes('disabled')).toBeDefined()
    expect(removeButton.attributes('disabled')).toBeDefined()
    expect(addButton.attributes('disabled')).toBeDefined()
  })

  it('should display marble preview with correct color and name', () => {
    const wrapper = mount(MarbleConfig, {
      props: {
        marbles: [
          { name: 'Red Marble', color: '#ff0000' }
        ],
        canAddMarble: true,
        canRemoveMarble: true,
        raceStarted: false
      }
    })

    const marblePreview = wrapper.find('.marble-preview')
    const marbleSphere = wrapper.find('.marble-sphere')
    const marbleLabel = wrapper.find('.marble-label')

    expect(marblePreview.exists()).toBe(true)
    expect(marbleSphere.attributes('style')).toContain('background-color: rgb(255, 0, 0)')
    expect(marbleLabel.text()).toBe('Red Marble')
  })

  it('should display fallback name when marble name is empty', () => {
    const wrapper = mount(MarbleConfig, {
      props: {
        marbles: [
          { name: '', color: '#ff0000' }
        ],
        canAddMarble: true,
        canRemoveMarble: true,
        raceStarted: false
      }
    })

    const marbleLabel = wrapper.find('.marble-label')
    expect(marbleLabel.text()).toBe('Marble 1')
  })
})