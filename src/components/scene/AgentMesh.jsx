import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore.js'

// ── Blob-style agent character ──────────────────────────────────────────────

function Eye({ position, color, blinkRef }) {
  const whiteRef = useRef()
  const pupilRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Blink: squish the eye vertically every ~4s
    const blinkCycle = (t % 4.2)
    const blink = blinkCycle < 0.12 ? Math.max(0.1, 1 - blinkCycle / 0.06) : 1
    if (whiteRef.current) whiteRef.current.scale.y = blink
    if (pupilRef.current) pupilRef.current.scale.y = blink
  })

  return (
    <group position={position}>
      {/* Sclera (white) */}
      <mesh ref={whiteRef} scale={[1, 1.15, 0.55]}>
        <sphereGeometry args={[0.085, 14, 14]} />
        <meshStandardMaterial color="#f8f8ff" roughness={0.1} metalness={0.0} />
      </mesh>
      {/* Iris */}
      <mesh position={[0, 0, 0.04]} scale={[1, 1.15, 0.4]}>
        <sphereGeometry args={[0.052, 10, 10]} />
        <meshStandardMaterial color={color} roughness={0.15} />
      </mesh>
      {/* Pupil */}
      <mesh ref={pupilRef} position={[0, 0, 0.07]} scale={[1, 1.15, 0.3]}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshStandardMaterial color="#0a0a14" />
      </mesh>
      {/* Catchlight */}
      <mesh position={[0.025, 0.028, 0.085]} scale={[1, 1, 0.2]}>
        <sphereGeometry args={[0.016, 6, 6]} />
        <meshStandardMaterial color="white" roughness={0.0} />
      </mesh>
    </group>
  )
}

function AgentBody({ color, colorDark, eyeColor, state, bobOffset }) {
  const groupRef = useRef()
  const bodyRef = useRef()
  const headRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const leftFootRef = useRef()
  const rightFootRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const bob = Math.sin(t * 2.2 + bobOffset)
    const sway = Math.sin(t * 4.8 + bobOffset)
    const nod = Math.sin(t * 1.3 + bobOffset + 1.0)

    if (state === 'moving') {
      if (groupRef.current) {
        groupRef.current.position.y = Math.abs(Math.sin(t * 8 + bobOffset)) * 0.06
        groupRef.current.rotation.z = sway * 0.08
      }
      if (leftFootRef.current)  leftFootRef.current.rotation.x = Math.sin(t * 10 + bobOffset) * 0.5
      if (rightFootRef.current) rightFootRef.current.rotation.x = -Math.sin(t * 10 + bobOffset) * 0.5
      if (leftArmRef.current)   leftArmRef.current.rotation.x = -Math.sin(t * 10 + bobOffset) * 0.4
      if (rightArmRef.current)  rightArmRef.current.rotation.x = Math.sin(t * 10 + bobOffset) * 0.4
    } else if (state === 'working') {
      if (groupRef.current) {
        groupRef.current.position.y = bob * 0.012
        groupRef.current.rotation.z = 0
      }
      if (headRef.current) {
        headRef.current.rotation.x = -0.15 + nod * 0.06
        headRef.current.rotation.y = Math.sin(t * 0.7 + bobOffset) * 0.1
      }
      if (leftArmRef.current)  leftArmRef.current.rotation.x = -0.4 + nod * 0.15
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.4 - nod * 0.15
    } else {
      // Idle: gentle float + look around
      if (groupRef.current) {
        groupRef.current.position.y = bob * 0.022
        groupRef.current.rotation.z = bob * 0.025
      }
      if (headRef.current) {
        headRef.current.rotation.x = 0
        headRef.current.rotation.y = Math.sin(t * 0.5 + bobOffset) * 0.25
      }
      if (leftArmRef.current)  leftArmRef.current.rotation.x = Math.sin(t * 1.2 + bobOffset) * 0.1
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t * 1.2 + bobOffset) * 0.1
    }
  })

  const bodyMat = <meshStandardMaterial color={color} roughness={0.45} metalness={0.04} />
  const darkMat = <meshStandardMaterial color={colorDark} roughness={0.5} metalness={0.02} />

  return (
    <group ref={groupRef}>
      {/* Main body blob — two overlapping spheres for seamless pear shape */}
      <mesh ref={bodyRef} position={[0, 0.32, 0]} scale={[1.0, 1.18, 0.92]} castShadow>
        <sphereGeometry args={[0.27, 22, 22]} />
        {bodyMat}
      </mesh>
      <mesh position={[0, 0.56, 0.0]} scale={[0.88, 0.88, 0.84]} castShadow>
        <sphereGeometry args={[0.24, 20, 20]} />
        {bodyMat}
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.70, 0.02]}>
        <mesh castShadow scale={[0.92, 0.95, 0.88]}>
          <sphereGeometry args={[0.215, 20, 20]} />
          {bodyMat}
        </mesh>

        {/* Eyes */}
        <Eye position={[-0.095, 0.02, 0.17]} color={eyeColor} />
        <Eye position={[ 0.095, 0.02, 0.17]} color={eyeColor} />

        {/* Small nose dot */}
        <mesh position={[0, -0.04, 0.205]}>
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshStandardMaterial color={colorDark} roughness={0.6} />
        </mesh>
      </group>

      {/* Left arm — stubby nub */}
      <group ref={leftArmRef} position={[-0.3, 0.4, 0]} rotation={[0, 0, 0.6]}>
        <mesh castShadow scale={[0.75, 1, 0.75]}>
          <capsuleGeometry args={[0.08, 0.1, 6, 10]} />
          {darkMat}
        </mesh>
        {/* Hand nub */}
        <mesh position={[0, -0.12, 0]} castShadow>
          <sphereGeometry args={[0.065, 8, 8]} />
          {darkMat}
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[0.3, 0.4, 0]} rotation={[0, 0, -0.6]}>
        <mesh castShadow scale={[0.75, 1, 0.75]}>
          <capsuleGeometry args={[0.08, 0.1, 6, 10]} />
          {darkMat}
        </mesh>
        <mesh position={[0, -0.12, 0]} castShadow>
          <sphereGeometry args={[0.065, 8, 8]} />
          {darkMat}
        </mesh>
      </group>

      {/* Left foot */}
      <group ref={leftFootRef} position={[-0.11, 0.09, 0.04]}>
        <mesh castShadow scale={[1, 0.6, 1.3]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          {darkMat}
        </mesh>
      </group>

      {/* Right foot */}
      <group ref={rightFootRef} position={[0.11, 0.09, 0.04]}>
        <mesh castShadow scale={[1, 0.6, 1.3]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          {darkMat}
        </mesh>
      </group>
    </group>
  )
}

// ── Selection ring pulse ─────────────────────────────────────────────────────

function SelectionRing({ color }) {
  const ringRef = useRef()
  useFrame(({ clock }) => {
    if (!ringRef.current) return
    const pulse = 0.88 + Math.sin(clock.getElapsedTime() * 3.5) * 0.12
    ringRef.current.scale.set(pulse, 1, pulse)
    ringRef.current.material.opacity = 0.45 + Math.sin(clock.getElapsedTime() * 3.5) * 0.2
  })
  return (
    <mesh ref={ringRef} position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.36, 0.46, 36]} />
      <meshBasicMaterial color={color} transparent opacity={0.55} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ── Main AgentMesh export ────────────────────────────────────────────────────

export function AgentMesh({ agent }) {
  const groupRef = useRef()
  const selectAgent = useStore(s => s.selectAgent)
  const selectedId = useStore(s => s.selectedAgentId)
  const isSelected = selectedId === agent.id

  useFrame(() => {
    if (!groupRef.current) return
    const [tx, , tz] = agent.position
    groupRef.current.position.set(tx, 0, tz)

    const target = agent.facingY ?? 0
    const current = groupRef.current.rotation.y
    const diff = ((target - current + Math.PI) % (Math.PI * 2)) - Math.PI
    groupRef.current.rotation.y += diff * 0.07
  })

  const taskLabel = agent.task?.label ?? 'Idle'
  const statusColor =
    agent.state === 'idle'         ? '#585b70' :
    agent.state === 'moving'       ? '#f9e2af' :
    agent.state === 'working'      ? '#a6e3a1' : '#89b4fa'

  return (
    <group
      ref={groupRef}
      onClick={e => { e.stopPropagation(); selectAgent(agent.id) }}
    >
      <AgentBody
        color={agent.color}
        colorDark={agent.colorDark}
        eyeColor={agent.eyeColor}
        state={agent.state}
        bobOffset={agent.bobOffset}
      />

      {isSelected && <SelectionRing color={agent.color} />}

      {/* Floating label */}
      <Html position={[0, 1.4, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(17,17,27,0.90)',
          border: `1px solid ${isSelected ? agent.color : '#313244'}`,
          borderRadius: 8,
          padding: '4px 10px',
          fontFamily: 'JetBrains Mono, monospace',
          color: agent.color,
          whiteSpace: 'nowrap',
          boxShadow: isSelected ? `0 0 14px ${agent.color}44` : '0 2px 8px rgba(0,0,0,0.4)',
          lineHeight: 1.5,
          userSelect: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor, display: 'inline-block', flexShrink: 0 }} />
            {agent.name}
          </div>
          <div style={{ color: '#a6adc8', fontSize: 9.5, marginTop: 1 }}>{taskLabel}</div>
        </div>
      </Html>
    </group>
  )
}
