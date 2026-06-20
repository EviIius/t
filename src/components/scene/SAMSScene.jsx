import { useEffect, useRef, useLayoutEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { useStore } from '../../store/useStore.js'
import { Room } from './Room.jsx'
import { AgentMesh } from './AgentMesh.jsx'

function SimulationLoop() {
  const tick = useStore(s => s.tick)
  const tickLogs = useStore(s => s.tickLogs)
  const lastTimeRef = useRef(performance.now())
  const logTimerRef = useRef(0)

  useEffect(() => {
    let animId

    const loop = () => {
      const now = performance.now()
      const delta = Math.min((now - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = now

      tick(delta)
      logTimerRef.current += delta
      if (logTimerRef.current > 3.5 + Math.random() * 2) {
        tickLogs()
        logTimerRef.current = 0
      }

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [tick, tickLogs])

  return null
}

// Explicitly call lookAt so the orthographic camera faces the scene
function CameraSetup() {
  const { camera } = useThree()
  useLayoutEffect(() => {
    camera.lookAt(0, 0, 0)
    camera.updateMatrixWorld()
  }, [camera])
  return null
}

function SceneContents() {
  const agents = useStore(s => s.agents)
  const selectAgent = useStore(s => s.selectAgent)

  return (
    <>
      <color attach="background" args={['#eceaf4']} />

      <CameraSetup />

      {/* Camera controls: scroll to zoom, drag to orbit, right-click to pan */}
      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.07}
        enableZoom
        enableRotate
        enablePan
        minZoom={22}
        maxZoom={160}
        minPolarAngle={Math.PI / 10}
        maxPolarAngle={Math.PI / 2.1}
        panSpeed={0.7}
        rotateSpeed={0.55}
        zoomSpeed={0.9}
      />

      {/* Lighting */}
      <ambientLight intensity={0.6} color="#f0f0ff" />
      <directionalLight
        position={[8, 12, 8]}
        intensity={1.4}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={60}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.001}
      />
      <directionalLight position={[-6, 6, -6]} intensity={0.3} color="#b0c0ff" />
      <directionalLight position={[0, 8, -10]} intensity={0.2} color="#f0e8ff" />

      <Room />

      {agents.map(agent => (
        <AgentMesh key={agent.id} agent={agent} />
      ))}

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.25}
        scale={18}
        blur={2.5}
        far={1}
        color="#000044"
      />

      {/* Invisible plane for click-to-deselect */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onClick={() => selectAgent(null)}
        visible={false}
      >
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial />
      </mesh>
    </>
  )
}

export function SAMSScene() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <SimulationLoop />

      {/* Control hint */}
      <div style={{
        position: 'absolute', bottom: 10, right: 10, zIndex: 10,
        display: 'flex', gap: 6, pointerEvents: 'none',
      }}>
        {[
          { icon: '⟳', label: 'Drag to orbit' },
          { icon: '⤢', label: 'Scroll to zoom' },
          { icon: '✥', label: 'Right-drag to pan' },
        ].map(h => (
          <div key={h.label} style={{
            background: 'rgba(17,17,27,0.72)', border: '1px solid #31324466',
            borderRadius: 5, padding: '3px 8px', fontSize: 10,
            color: '#585b70', display: 'flex', alignItems: 'center', gap: 4,
            backdropFilter: 'blur(4px)',
          }}>
            <span style={{ color: '#89b4fa' }}>{h.icon}</span> {h.label}
          </div>
        ))}
      </div>

      <Canvas
        shadows
        orthographic
        camera={{ position: [10, 10, 10], zoom: 62, near: -100, far: 1000 }}
        gl={{ antialias: true, alpha: false }}
      >
        <SceneContents />
      </Canvas>
    </div>
  )
}
