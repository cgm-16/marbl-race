// ABOUTME: Type definitions for marble racing game objects
// ABOUTME: Defines interfaces for marble data, race state, and game configuration
export interface Marble {
  name: string
  color: string
}

export interface MarblePhysics {
  body: any // CANNON.Body
  mesh: any // THREE.Mesh
  label: any // THREE.Sprite
}

export interface RaceState {
  started: boolean
  finished: boolean
  winnerIndex: number | null
}