// ABOUTME: Test setup file for configuring global test environment
// ABOUTME: Provides necessary setup for Vue component testing with vitest
import { vi } from 'vitest'

// Mock requestAnimationFrame for testing
global.requestAnimationFrame = vi.fn(cb => {
  setTimeout(cb, 16)
  return 1
})

// Mock cancelAnimationFrame for testing
global.cancelAnimationFrame = vi.fn()