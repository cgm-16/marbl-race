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
        canRemoveMarble: true
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
        canRemoveMarble: false
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
        canRemoveMarble: true
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
        canRemoveMarble: false
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
        canRemoveMarble: false
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
        canRemoveMarble: false
      }
    })

    const removeButton = wrapper.find('[data-testid="remove-marble-0"]')
    expect(removeButton.exists()).toBe(false)
  })
})