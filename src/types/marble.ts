// ABOUTME: Type definitions for marble racing game objects
// ABOUTME: Defines interfaces for marble data, race state, and game configuration
export interface Marble {
  name: string
  color: string
}

import type * as CANNON from 'cannon-es'
import type * as THREE from 'three'

export interface MarblePhysics {
  body: CANNON.Body
  mesh: THREE.Mesh
  label: THREE.Sprite
}

export interface RaceState {
  started: boolean
  finished: boolean
  winnerIndex: number | null
}