import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'

// ── Shared material helpers ────────────────────────────────────────────────

const Wood = ({ children, color = '#b8895a', roughness = 0.75, ...props }) => (
  <mesh castShadow receiveShadow {...props}>
    {children}
    <meshStandardMaterial color={color} roughness={roughness} metalness={0.0} />
  </mesh>
)

const Metal = ({ children, color = '#8a8a9a', roughness = 0.18, metalness = 0.8, ...props }) => (
  <mesh castShadow receiveShadow {...props}>
    {children}
    <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
  </mesh>
)

const Soft = ({ children, color = '#2a3a5c', roughness = 0.92, ...props }) => (
  <mesh castShadow receiveShadow {...props}>
    {children}
    <meshStandardMaterial color={color} roughness={roughness} metalness={0.0} />
  </mesh>
)

// ── Desk ───────────────────────────────────────────────────────────────────

export function Desk({ position = [0, 0, 0], label = 'Desk 01', active = false }) {
  const screenRef = useRef()

  useFrame(({ clock }) => {
    if (screenRef.current && active) {
      screenRef.current.material.emissiveIntensity = 0.55 + Math.sin(clock.getElapsedTime() * 1.5) * 0.08
    }
  })

  return (
    <group position={position}>
      {/* Tabletop – rounded slab */}
      <RoundedBox args={[1.45, 0.07, 0.82]} radius={0.025} smoothness={4} position={[0, 0.745, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#c4905e" roughness={0.72} metalness={0.0} />
      </RoundedBox>

      {/* Drawer unit */}
      <RoundedBox args={[0.42, 0.62, 0.72]} radius={0.02} smoothness={4} position={[-0.44, 0.35, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#b8855a" roughness={0.78} metalness={0.0} />
      </RoundedBox>
      {/* Drawer handles */}
      {[0.18, -0.05, -0.28].map((y, i) => (
        <Metal key={i} position={[-0.22, 0.35 + y, 0.365]} color="#c0b8a8" roughness={0.3} metalness={0.6}>
          <boxGeometry args={[0.14, 0.025, 0.018]} />
        </Metal>
      ))}

      {/* Right legs */}
      {[[0.6, -0.34], [0.6, 0.34]].map(([x, z], i) => (
        <RoundedBox key={i} args={[0.055, 0.74, 0.055]} radius={0.015} smoothness={4} position={[x, 0.37, z]} castShadow>
          <meshStandardMaterial color="#a87848" roughness={0.7} />
        </RoundedBox>
      ))}

      {/* Monitor arm */}
      <Metal position={[0.15, 0.8, -0.26]} color="#303040" roughness={0.3} metalness={0.7}>
        <boxGeometry args={[0.05, 0.08, 0.14]} />
      </Metal>
      <Metal position={[0.15, 0.88, -0.27]} color="#252535" roughness={0.2} metalness={0.6}>
        <boxGeometry args={[0.04, 0.32, 0.04]} />
      </Metal>

      {/* Monitor casing */}
      <RoundedBox args={[0.74, 0.44, 0.055]} radius={0.016} smoothness={4} position={[0.15, 1.08, -0.3]} castShadow>
        <meshStandardMaterial color="#1a1a2a" roughness={0.3} metalness={0.4} />
      </RoundedBox>

      {/* Screen glow */}
      <mesh ref={screenRef} position={[0.15, 1.08, -0.27]}>
        <boxGeometry args={[0.66, 0.36, 0.01]} />
        <meshStandardMaterial
          color="#0d2a4a"
          emissive="#1a5aaa"
          emissiveIntensity={active ? 0.55 : 0.18}
          transparent
          opacity={0.97}
        />
      </mesh>

      {/* Fake code lines on screen */}
      {active && [0.1, 0.06, 0.02, -0.02, -0.06, -0.1].map((y, i) => (
        <mesh key={i} position={[0.15 - 0.08 + (i % 2) * 0.04, 1.08 + y, -0.265]}>
          <boxGeometry args={[0.18 + Math.sin(i * 2.1) * 0.12, 0.008, 0.001]} />
          <meshBasicMaterial color={['#4af', '#a6e3a1', '#cba6f7', '#f9e2af', '#4af', '#a6e3a1'][i]} />
        </mesh>
      ))}

      {/* Keyboard */}
      <RoundedBox args={[0.56, 0.022, 0.2]} radius={0.01} smoothness={3} position={[0.1, 0.79, 0.04]} castShadow>
        <meshStandardMaterial color="#252535" roughness={0.6} metalness={0.2} />
      </RoundedBox>

      {/* Mouse */}
      <RoundedBox args={[0.1, 0.022, 0.145]} radius={0.02} smoothness={4} position={[0.46, 0.79, 0.04]} castShadow>
        <meshStandardMaterial color="#252535" roughness={0.6} metalness={0.2} />
      </RoundedBox>

      {/* Mousepad */}
      <mesh position={[0.44, 0.782, 0.04]} receiveShadow>
        <boxGeometry args={[0.28, 0.004, 0.22]} />
        <meshStandardMaterial color="#181828" roughness={0.95} />
      </mesh>

      {/* Small plant or items on desk */}
      <mesh position={[-0.56, 0.84, 0.28]} castShadow>
        <cylinderGeometry args={[0.04, 0.055, 0.1, 8]} />
        <meshStandardMaterial color="#7B3F00" roughness={0.9} />
      </mesh>
      <mesh position={[-0.56, 0.93, 0.28]} castShadow>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.85} />
      </mesh>

      {/* Label */}
      <Html position={[0, 1.58, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: active ? 'rgba(74,158,255,0.12)' : 'rgba(17,17,27,0.75)',
          border: `1px solid ${active ? '#4A9EFF88' : '#31324488'}`,
          borderRadius: 6, padding: '3px 9px', fontSize: 10,
          color: active ? '#89b4fa' : '#585b70', whiteSpace: 'nowrap',
          backdropFilter: 'blur(4px)',
        }}>
          {label}{active && <span style={{ color: '#a6e3a1', marginLeft: 5 }}>● Active: Compute</span>}
        </div>
      </Html>
    </group>
  )
}

// ── Whiteboard ─────────────────────────────────────────────────────────────

export function Whiteboard({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Outer frame */}
      <RoundedBox args={[1.92, 1.46, 0.06]} radius={0.02} smoothness={4} position={[0, 1.1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#4a4a5a" roughness={0.5} metalness={0.3} />
      </RoundedBox>

      {/* Board surface */}
      <mesh position={[0, 1.1, 0.04]} receiveShadow>
        <boxGeometry args={[1.78, 1.32, 0.02]} />
        <meshStandardMaterial color="#f6f6fa" roughness={0.95} />
      </mesh>

      {/* Writing lines */}
      {[
        { pos: [-0.45, 1.36, 0.07], size: [0.62, 0.038, 0.01], color: '#4A9EFF' },
        { pos: [ 0.22, 1.36, 0.07], size: [0.28, 0.038, 0.01], color: '#cba6f7' },
        { pos: [-0.52, 1.19, 0.07], size: [0.48, 0.026, 0.01], color: '#a6adc8' },
        { pos: [-0.08, 1.19, 0.07], size: [0.38, 0.026, 0.01], color: '#a6adc8' },
        { pos: [-0.28, 1.04, 0.07], size: [0.78, 0.026, 0.01], color: '#4ACD8C' },
        { pos: [-0.50, 0.88, 0.07], size: [0.28, 0.026, 0.01], color: '#f9e2af' },
        { pos: [ 0.08, 0.88, 0.07], size: [0.48, 0.026, 0.01], color: '#f9e2af' },
        // Arrow/diagram box
        { pos: [ 0.55, 1.22, 0.07], size: [0.4, 0.3, 0.01], color: '#4A9EFF', transparent: true, opacity: 0.12 },
      ].map((l, i) => (
        <mesh key={i} position={l.pos}>
          <boxGeometry args={l.size} />
          <meshBasicMaterial color={l.color} transparent opacity={l.opacity ?? 1} />
        </mesh>
      ))}

      {/* Stand legs */}
      <Metal position={[-0.7, 0.22, 0.01]} color="#555565" roughness={0.4} metalness={0.6}>
        <boxGeometry args={[0.04, 0.65, 0.04]} />
      </Metal>
      <Metal position={[ 0.7, 0.22, 0.01]} color="#555565" roughness={0.4} metalness={0.6}>
        <boxGeometry args={[0.04, 0.65, 0.04]} />
      </Metal>
      {/* Foot bars */}
      <Metal position={[-0.7, -0.04, 0.15]} color="#555565">
        <boxGeometry args={[0.04, 0.04, 0.34]} />
      </Metal>
      <Metal position={[ 0.7, -0.04, 0.15]} color="#555565">
        <boxGeometry args={[0.04, 0.04, 0.34]} />
      </Metal>

      {/* Marker tray */}
      <Metal position={[0, 0.47, 0.06]} color="#4a4a5a" roughness={0.4}>
        <boxGeometry args={[1.78, 0.06, 0.09]} />
      </Metal>
      {/* Coloured markers */}
      {[['#f38ba8', -0.6], ['#4A9EFF', -0.4], ['#4ACD8C', -0.2], ['#f9e2af', 0.0], ['#cba6f7', 0.2]].map(([c, x], i) => (
        <mesh key={i} position={[x, 0.52, 0.07]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.16, 6]} />
          <meshStandardMaterial color={c} roughness={0.6} />
        </mesh>
      ))}

      <Html position={[0, 2.15, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(17,17,27,0.82)', border: '1px solid #f9e2af44',
          borderRadius: 6, padding: '3px 9px', fontSize: 10, color: '#f9e2af', whiteSpace: 'nowrap',
        }}>
          Whiteboard · Ideas & Planning
        </div>
      </Html>
    </group>
  )
}

// ── Kanban Wall ─────────────────────────────────────────────────────────────

const CARDS = [
  { col: 0, row: 0, color: '#4A9EFF', label: 'Design auth' },
  { col: 0, row: 1, color: '#a6adc8', label: 'API review' },
  { col: 0, row: 2, color: '#cba6f7', label: 'Deploy plan' },
  { col: 1, row: 0, color: '#f9e2af', label: 'Write tests' },
  { col: 1, row: 1, color: '#4A9EFF', label: 'Build image' },
  { col: 1, row: 2, color: '#4ACD8C', label: 'Stage QA'   },
  { col: 2, row: 0, color: '#f38ba8', label: 'PR #12 ⛔'  },
  { col: 2, row: 1, color: '#f9e2af', label: 'PR #14'     },
  { col: 2, row: 2, color: '#4A9EFF', label: 'PR #18'     },
  { col: 3, row: 0, color: '#4ACD8C', label: 'v1.4 Live'  },
  { col: 3, row: 1, color: '#4ACD8C', label: 'API v2 ✓'  },
]

export function KanbanWall({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Backing board */}
      <RoundedBox args={[4.6, 2.5, 0.06]} radius={0.02} smoothness={3} position={[0, 1.1, 0]} receiveShadow>
        <meshStandardMaterial color="#1e1e30" roughness={0.95} />
      </RoundedBox>

      {/* Column headers */}
      {[
        { label: 'Backlog',     color: '#3a3a50', x: -1.5 },
        { label: 'In Progress', color: '#1a3a5c', x: -0.5 },
        { label: 'Review',      color: '#2a1a4c', x:  0.5 },
        { label: 'Done',        color: '#0a3a1a', x:  1.5 },
      ].map((h, i) => (
        <group key={i} position={[h.x, 1.98, 0.06]}>
          <RoundedBox args={[0.88, 0.18, 0.04]} radius={0.03} smoothness={3}>
            <meshStandardMaterial color={h.color} roughness={0.9} />
          </RoundedBox>
        </group>
      ))}

      {/* Column dividers */}
      {[-1.0, 0.0, 1.0].map((x, i) => (
        <mesh key={i} position={[x, 1.1, 0.06]}>
          <boxGeometry args={[0.012, 2.2, 0.01]} />
          <meshBasicMaterial color="#313244" />
        </mesh>
      ))}

      {/* Sticky note cards */}
      {CARDS.map((c, i) => (
        <group key={i} position={[-1.5 + c.col * 1.0, 1.72 - c.row * 0.49, 0.08]}>
          <RoundedBox args={[0.82, 0.4, 0.025]} radius={0.018} smoothness={3} castShadow>
            <meshStandardMaterial color={c.color} roughness={0.85} />
          </RoundedBox>
          {/* Text lines */}
          <mesh position={[0, 0.05, 0.02]}>
            <boxGeometry args={[0.52, 0.025, 0.01]} />
            <meshBasicMaterial color="rgba(0,0,0,0.25)" />
          </mesh>
          <mesh position={[0, -0.03, 0.02]}>
            <boxGeometry args={[0.36, 0.018, 0.01]} />
            <meshBasicMaterial color="rgba(0,0,0,0.18)" />
          </mesh>
        </group>
      ))}

      <Html position={[0, 2.75, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(17,17,27,0.88)', border: '1px solid #a6e3a166',
          borderRadius: 6, padding: '3px 9px', fontSize: 10, color: '#a6e3a1', whiteSpace: 'nowrap',
        }}>
          Kanban Wall · Work Items · <span style={{ color: '#4ACD8C' }}>● Active</span>
        </div>
      </Html>
    </group>
  )
}

// ── Vault ───────────────────────────────────────────────────────────────────

export function Vault({ position = [0, 0, 0] }) {
  const wheelRef = useRef()
  useFrame(({ clock }) => {
    if (wheelRef.current) wheelRef.current.rotation.z = clock.getElapsedTime() * 0.15
  })

  return (
    <group position={position}>
      {/* Body */}
      <RoundedBox args={[1.45, 1.7, 1.15]} radius={0.04} smoothness={4} position={[0, 0.85, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#6a6a7a" roughness={0.25} metalness={0.75} />
      </RoundedBox>

      {/* Door panel (inset) */}
      <RoundedBox args={[1.22, 1.5, 0.06]} radius={0.025} smoothness={4} position={[0, 0.85, 0.6]} castShadow>
        <meshStandardMaterial color="#7a7a8a" roughness={0.2} metalness={0.8} />
      </RoundedBox>

      {/* Door inner recess */}
      <RoundedBox args={[1.06, 1.34, 0.04]} radius={0.02} smoothness={4} position={[0, 0.85, 0.64]}>
        <meshStandardMaterial color="#5a5a6a" roughness={0.3} metalness={0.7} />
      </RoundedBox>

      {/* Wheel */}
      <group ref={wheelRef} position={[0, 0.88, 0.69]}>
        <mesh>
          <torusGeometry args={[0.26, 0.04, 10, 28]} />
          <meshStandardMaterial color="#c8c8d8" roughness={0.1} metalness={0.95} />
        </mesh>
        {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((a, i) => (
          <mesh key={i} rotation={[0, 0, a]}>
            <boxGeometry args={[0.52, 0.03, 0.03]} />
            <meshStandardMaterial color="#b0b0c0" roughness={0.15} metalness={0.9} />
          </mesh>
        ))}
        {/* Center hub */}
        <mesh>
          <cylinderGeometry args={[0.055, 0.055, 0.06, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#d0d0e0" roughness={0.1} metalness={0.95} />
        </mesh>
      </group>

      {/* Lever handle */}
      <group position={[0.36, 0.78, 0.72]}>
        <Metal position={[0, 0.08, 0]} color="#a8a8b8" roughness={0.2} metalness={0.85}>
          <boxGeometry args={[0.05, 0.2, 0.05]} />
        </Metal>
        <Metal position={[0.06, 0.18, 0]} color="#a8a8b8" roughness={0.2} metalness={0.85}>
          <boxGeometry args={[0.12, 0.04, 0.04]} />
        </Metal>
      </group>

      {/* Hinges */}
      {[[0.82], [-0.82]].map(([x], i) => (
        <group key={i}>
          <Metal position={[-0.57, 0.85 + x * 0.4, 0.64]} color="#777" roughness={0.3} metalness={0.7}>
            <boxGeometry args={[0.065, 0.18, 0.07]} />
          </Metal>
        </group>
      ))}

      {/* Status LED */}
      <mesh position={[0.46, 1.25, 0.69]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial color="#4ACD8C" emissive="#4ACD8C" emissiveIntensity={2.0} />
      </mesh>

      <Html position={[0, 2.1, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(17,17,27,0.85)', border: '1px solid #fab38788',
          borderRadius: 6, padding: '3px 9px', fontSize: 10, color: '#fab387', whiteSpace: 'nowrap',
        }}>
          Vault · Secure Storage
        </div>
      </Html>
    </group>
  )
}

// ── Lounge ──────────────────────────────────────────────────────────────────

export function Lounge({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Sofa base */}
      <RoundedBox args={[2.15, 0.42, 0.88]} radius={0.06} smoothness={5} position={[0, 0.22, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#263252" roughness={0.92} metalness={0.0} />
      </RoundedBox>

      {/* Sofa back */}
      <RoundedBox args={[2.15, 0.65, 0.22]} radius={0.06} smoothness={5} position={[0, 0.65, -0.35]} castShadow>
        <meshStandardMaterial color="#263252" roughness={0.92} />
      </RoundedBox>

      {/* Seat cushions */}
      {[-0.68, 0, 0.68].map((x, i) => (
        <RoundedBox key={i} args={[0.64, 0.14, 0.72]} radius={0.05} smoothness={4} position={[x, 0.5, 0.04]} castShadow>
          <meshStandardMaterial color="#2e3e62" roughness={0.94} />
        </RoundedBox>
      ))}

      {/* Back cushions */}
      {[-0.68, 0, 0.68].map((x, i) => (
        <RoundedBox key={i} args={[0.62, 0.48, 0.18]} radius={0.05} smoothness={4} position={[x, 0.63, -0.3]} castShadow>
          <meshStandardMaterial color="#2e3e62" roughness={0.94} />
        </RoundedBox>
      ))}

      {/* Armrests */}
      {[-1.04, 1.04].map((x, i) => (
        <RoundedBox key={i} args={[0.15, 0.54, 0.88]} radius={0.05} smoothness={4} position={[x, 0.43, 0]} castShadow>
          <meshStandardMaterial color="#1e2842" roughness={0.9} />
        </RoundedBox>
      ))}

      {/* Legs */}
      {[[-0.9, -0.3], [-0.9, 0.3], [0.9, -0.3], [0.9, 0.3]].map(([x, z], i) => (
        <Metal key={i} position={[x, 0.06, z]} color="#555">
          <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
        </Metal>
      ))}

      {/* Coffee table */}
      <group position={[0, 0, 0.88]}>
        <RoundedBox args={[1.05, 0.06, 0.6]} radius={0.015} smoothness={4} position={[0, 0.28, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#c4905e" roughness={0.72} metalness={0.0} />
        </RoundedBox>
        {[[-0.42, -0.24], [-0.42, 0.24], [0.42, -0.24], [0.42, 0.24]].map(([x, z], i) => (
          <Metal key={i} position={[x, 0.14, z]} color="#666" roughness={0.3} metalness={0.7}>
            <cylinderGeometry args={[0.025, 0.025, 0.28, 8]} />
          </Metal>
        ))}
        {/* Coffee cup on table */}
        <mesh position={[0.28, 0.36, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.042, 0.1, 10]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
        </mesh>
        <mesh position={[0.28, 0.415, 0]} castShadow>
          <cylinderGeometry args={[0.048, 0.048, 0.02, 10]} />
          <meshStandardMaterial color="#3a1a00" roughness={0.2} />
        </mesh>
        {/* Laptop on table */}
        <RoundedBox args={[0.4, 0.018, 0.28]} radius={0.008} smoothness={3} position={[-0.2, 0.32, 0]} castShadow>
          <meshStandardMaterial color="#1e1e2e" roughness={0.3} metalness={0.5} />
        </RoundedBox>
      </group>

      <Html position={[0, 1.5, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(17,17,27,0.78)', border: '1px solid #31324466',
          borderRadius: 6, padding: '3px 9px', fontSize: 10, color: '#585b70', whiteSpace: 'nowrap',
        }}>
          Lounge · Idle
        </div>
      </Html>
    </group>
  )
}

// ── Security Gate ────────────────────────────────────────────────────────────

export function SecurityGate({ position = [0, 0, 0] }) {
  const beamRef = useRef()
  useFrame(({ clock }) => {
    if (beamRef.current) {
      beamRef.current.material.opacity = 0.15 + Math.sin(clock.getElapsedTime() * 2) * 0.08
    }
  })

  return (
    <group position={position}>
      {/* Pillars */}
      {[-0.38, 0.38].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <RoundedBox args={[0.18, 1.85, 0.18]} radius={0.025} smoothness={4} position={[0, 0.925, 0]} castShadow>
            <meshStandardMaterial color="#1e1e30" roughness={0.3} metalness={0.4} />
          </RoundedBox>
          {/* Accent strip */}
          <mesh position={[x > 0 ? -0.085 : 0.085, 0.925, 0]}>
            <boxGeometry args={[0.01, 1.7, 0.12]} />
            <meshStandardMaterial color="#4A9EFF" emissive="#2a6aac" emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Top bar */}
      <RoundedBox args={[0.94, 0.1, 0.18]} radius={0.02} smoothness={4} position={[0, 1.87, 0]} castShadow>
        <meshStandardMaterial color="#252538" roughness={0.3} metalness={0.5} />
      </RoundedBox>

      {/* Scanner panel */}
      <RoundedBox args={[0.12, 0.26, 0.06]} radius={0.01} smoothness={3} position={[-0.38, 1.1, 0.1]}>
        <meshStandardMaterial color="#141420" roughness={0.2} metalness={0.3} />
      </RoundedBox>
      <mesh position={[-0.38, 1.1, 0.14]}>
        <boxGeometry args={[0.08, 0.2, 0.01]} />
        <meshStandardMaterial color="#4A9EFF" emissive="#2a6aac" emissiveIntensity={1.2} />
      </mesh>

      {/* Beam between pillars */}
      <mesh ref={beamRef} position={[0, 1.0, 0]}>
        <boxGeometry args={[0.76, 1.3, 0.01]} />
        <meshStandardMaterial color="#4A9EFF" transparent opacity={0.18} side={2} />
      </mesh>

      {/* Status light */}
      <mesh position={[0, 1.94, 0]}>
        <sphereGeometry args={[0.038, 10, 10]} />
        <meshStandardMaterial color="#4ACD8C" emissive="#4ACD8C" emissiveIntensity={2.5} />
      </mesh>

      {/* Gate bar */}
      <group position={[0, 0, 0]}>
        <Metal position={[0.12, 1.0, 0.08]} color="#f9e2af" roughness={0.3} metalness={0.6}>
          <cylinderGeometry args={[0.022, 0.022, 0.56, 8]} rotation={[0, 0, Math.PI / 2]} />
        </Metal>
      </group>

      <Html position={[0, 2.3, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(17,17,27,0.85)', border: '1px solid #cba6f766',
          borderRadius: 6, padding: '3px 9px', fontSize: 10, color: '#cba6f7', whiteSpace: 'nowrap',
        }}>
          Security Gate · Access Control
        </div>
      </Html>
    </group>
  )
}

// ── Plant ───────────────────────────────────────────────────────────────────

export function Plant({ position = [0, 0, 0], size = 1.0 }) {
  const leaveRef = useRef()
  useFrame(({ clock }) => {
    if (leaveRef.current) {
      const t = clock.getElapsedTime()
      leaveRef.current.rotation.y = Math.sin(t * 0.4 + position[0]) * 0.06
    }
  })

  return (
    <group position={position} scale={size}>
      {/* Pot */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.10, 0.32, 10]} />
        <meshStandardMaterial color="#8B4513" roughness={0.85} metalness={0.0} />
      </mesh>
      {/* Pot rim */}
      <mesh position={[0, 0.345, 0]}>
        <torusGeometry args={[0.14, 0.022, 6, 16]} />
        <meshStandardMaterial color="#7a3a10" roughness={0.8} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.34, 0]} receiveShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.02, 10]} />
        <meshStandardMaterial color="#3a2010" roughness={1.0} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.028, 0.38, 6]} />
        <meshStandardMaterial color="#2d6a1a" roughness={0.85} />
      </mesh>
      {/* Leaves cluster */}
      <group ref={leaveRef} position={[0, 0.7, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.26, 10, 10]} />
          <meshStandardMaterial color="#228B22" roughness={0.8} />
        </mesh>
        <mesh position={[0.18, 0.08, 0.1]} castShadow>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial color="#2d9e2d" roughness={0.78} />
        </mesh>
        <mesh position={[-0.16, 0.06, -0.08]} castShadow>
          <sphereGeometry args={[0.16, 8, 8]} />
          <meshStandardMaterial color="#1e7a1e" roughness={0.82} />
        </mesh>
        <mesh position={[0.04, 0.22, -0.1]} castShadow>
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshStandardMaterial color="#28a228" roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

// ── Area Rug ─────────────────────────────────────────────────────────────────

export function AreaRug({ position = [0, 0.005, 0] }) {
  return (
    <group position={position}>
      <mesh receiveShadow>
        <boxGeometry args={[2.6, 0.012, 1.9]} />
        <meshStandardMaterial color="#1e2e50" roughness={0.98} />
      </mesh>
      {/* Border pattern */}
      <mesh position={[0, 0.007, 0]}>
        <boxGeometry args={[2.5, 0.004, 1.8]} />
        <meshStandardMaterial color="#253860" roughness={0.98} />
      </mesh>
    </group>
  )
}
