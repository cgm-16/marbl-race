// ABOUTME: Composable for managing 3D scene, physics simulation, and marble rendering
// ABOUTME: Handles Three.js setup, CANNON physics, marble creation, and race simulation
import { ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as CANNON from 'cannon-es'
import type { Marble, MarblePhysics } from '../types/marble'

export function useScene3D() {
  const isInitialized = ref(false)
  const raceActive = ref(false)
  
  // Scene objects
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let renderer: THREE.WebGLRenderer | null = null
  let controls: OrbitControls | null = null
  let world: CANNON.World | null = null
  let animationId: number | null = null
  
  // Marble objects
  const marblePhysics = ref<MarblePhysics[]>([])
  const finishLineZ = 180
  
  // Callbacks
  let onRaceFinish: ((winnerIndex: number) => void) | null = null

  const initializeScene = (
    container: HTMLElement, 
    marbles: Marble[], 
    onFinish?: (winnerIndex: number) => void
  ) => {
    if (isInitialized.value) return
    
    onRaceFinish = onFinish || null
    
    // Create scene
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)
    
    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 5, 5).normalize()
    scene.add(light)
    
    // Initialize physics world
    world = new CANNON.World()
    world.gravity.set(0, -9.81, 0)
    
    // Create racetrack
    setupTrack()
    
    // Create obstacles
    setupObstacles()
    
    // Create marbles
    setupMarbles(marbles)
    
    // Setup camera controls
    controls = new OrbitControls(camera, renderer.domElement)
    camera.position.set(0, 10, 15)
    controls.update()
    
    // Start animation loop
    animate()
    
    isInitialized.value = true
  }

  const setupTrack = () => {
    if (!scene || !world) return
    
    // Racetrack (inclined plane)
    const trackGeometry = new THREE.PlaneGeometry(40, 400)
    const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x006600 })
    const trackMesh = new THREE.Mesh(trackGeometry, trackMaterial)
    trackMesh.rotation.x = -Math.PI / 2.2
    scene.add(trackMesh)
    
    const trackBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() })
    trackBody.quaternion.setFromEuler(-Math.PI / 2.2, 0, 0)
    world.addBody(trackBody)
    
    // Guardrails
    const railHeight = 500
    const railThickness = 5
    const railMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 })
    
    // Left rail
    const leftRailGeometry = new THREE.BoxGeometry(railThickness, railHeight, 400)
    const leftRailMesh = new THREE.Mesh(leftRailGeometry, railMaterial)
    leftRailMesh.position.set(-20, 0, 0)
    scene.add(leftRailMesh)
    
    const leftRailBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(railThickness / 2, railHeight / 2, 400))
    })
    leftRailBody.position.set(-20, 0, 0)
    world.addBody(leftRailBody)
    
    // Right rail
    const rightRailGeometry = new THREE.BoxGeometry(railThickness, railHeight, 400)
    const rightRailMesh = new THREE.Mesh(rightRailGeometry, railMaterial)
    rightRailMesh.position.set(20, 0, 0)
    scene.add(rightRailMesh)
    
    const rightRailBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(railThickness / 2, railHeight / 2, 400))
    })
    rightRailBody.position.set(20, 0, 0)
    world.addBody(rightRailBody)
  }

  const setupObstacles = () => {
    if (!scene || !world) return
    
    // Random obstacles (pegs)
    for (let i = 0; i < 100; i++) {
      const pegGeometry = new THREE.CylinderGeometry(1, 2, 50, 32)
      const pegMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
      const pegMesh = new THREE.Mesh(pegGeometry, pegMaterial)
      pegMesh.position.set(
        (Math.random() - 0.5) * 40,
        1,
        Math.random() * 400 - 200
      )
      scene.add(pegMesh)
      
      const pegBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Cylinder(1, 2, 50, 32)
      })
      const pos = pegMesh.position.toArray()
      pegBody.position.set(pos[0], pos[1], pos[2])
      world.addBody(pegBody)
    }
  }

  const setupMarbles = (marbles: Marble[]) => {
    if (!scene || !world) return
    
    marblePhysics.value = []
    
    marbles.forEach((marble, index) => {
      // Physics body
      const body = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Sphere(0.5),
        type: CANNON.Body.STATIC
      })
      body.position.set((index - 5) * 2, 50, -200)
      world!.addBody(body)
      
      // Visual mesh
      const geometry = new THREE.SphereGeometry(0.5, 32, 32)
      const material = new THREE.MeshStandardMaterial({ color: marble.color })
      const mesh = new THREE.Mesh(geometry, material)
      scene!.add(mesh)
      
      // Name label
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.font = '48px Arial'
        ctx.fillStyle = 'white'
        ctx.fillText(marble.name, 20, 40)
      }
      const texture = new THREE.CanvasTexture(canvas)
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.scale.set(2, 1, 1)
      scene!.add(sprite)
      
      marblePhysics.value.push({ body, mesh, label: sprite })
    })
  }

  const animate = () => {
    if (!renderer || !scene || !camera || !world) return
    
    animationId = requestAnimationFrame(animate)
    world.step(1 / 60)
    
    // Update marble positions
    let leadMarble: THREE.Mesh | null = null
    marblePhysics.value.forEach((marblePhysic) => {
      const { body, mesh, label } = marblePhysic
      const bodyPos = body.position as any
      mesh.position.set(bodyPos.x, bodyPos.y, bodyPos.z)
      label.position.set(
        mesh.position.x,
        mesh.position.y + 1,
        mesh.position.z
      )
      
      if (!leadMarble || (mesh.position.z > (leadMarble as THREE.Mesh).position.z)) {
        leadMarble = mesh as THREE.Mesh
      }
    })
    
    // Check for winner
    checkWinner()
    
    // Follow lead marble with camera
    if (raceActive.value && leadMarble && camera) {
      const leadMesh = leadMarble as THREE.Mesh
      const cameraPos = camera.position as any
      cameraPos.lerp(
        new THREE.Vector3(
          leadMesh.position.x,
          leadMesh.position.y + 5,
          leadMesh.position.z - 10
        ),
        0.05
      )
      if (camera.lookAt) {
        camera.lookAt(leadMesh.position)
      }
    }
    
    renderer.render(scene, camera)
  }

  const checkWinner = () => {
    if (!raceActive.value || !onRaceFinish) return
    
    marblePhysics.value.forEach((marblePhysic, index) => {
      if (marblePhysic.mesh.position.z >= finishLineZ) {
        raceActive.value = false
        onRaceFinish!(index)
      }
    })
  }

  const startRace = () => {
    if (!world) return
    
    raceActive.value = true
    marblePhysics.value.forEach(({ body }) => {
      body.type = CANNON.Body.DYNAMIC
      const vel = body.velocity as any
      vel.set(0, 0, 5)
    })
  }

  const resetRace = () => {
    raceActive.value = false
    marblePhysics.value.forEach(({ body }, marbleIndex) => {
      body.type = CANNON.Body.STATIC
      const pos = body.position as any
      pos.set((marbleIndex - 5) * 2, 50, -200)
      const vel = body.velocity as any
      vel.set(0, 0, 0)
    })
  }

  const destroy = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    
    if (renderer) {
      renderer.dispose()
    }
    
    isInitialized.value = false
    raceActive.value = false
  }

  return {
    isInitialized,
    raceActive,
    initializeScene,
    startRace,
    resetRace,
    checkWinner,
    destroy
  }
}