import { Desk, Whiteboard, KanbanWall, Vault, Lounge, SecurityGate, Plant, AreaRug } from './Furniture.jsx'

export function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color="#e8e8ec" roughness={0.95} metalness={0.0} />
      </mesh>

      {/* Floor tiles grid overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[14, 12]} />
        <meshBasicMaterial color="#d8d8dc" transparent opacity={0.3} wireframe />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2.0, -6]} receiveShadow>
        <boxGeometry args={[14, 4.0, 0.12]} />
        <meshStandardMaterial color="#f0f0f4" roughness={0.95} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-7, 2.0, 0]} receiveShadow>
        <boxGeometry args={[0.12, 4.0, 12]} />
        <meshStandardMaterial color="#f0f0f4" roughness={0.95} />
      </mesh>

      {/* Right wall (partial - with gate opening) */}
      <mesh position={[7, 2.0, -2.5]} receiveShadow>
        <boxGeometry args={[0.12, 4.0, 7]} />
        <meshStandardMaterial color="#f0f0f4" roughness={0.95} />
      </mesh>
      <mesh position={[7, 3.2, 1.5]} receiveShadow>
        <boxGeometry args={[0.12, 1.6, 5]} />
        <meshStandardMaterial color="#f0f0f4" roughness={0.95} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 4.0, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color="#f5f5f8" roughness={1.0} />
      </mesh>

      {/* Ceiling lights */}
      {[[-2, 3.98, -2], [2, 3.98, -2], [-2, 3.98, 1.5], [2, 3.98, 1.5]].map((p, i) => (
        <group key={i} position={p}>
          <mesh>
            <boxGeometry args={[0.6, 0.05, 0.2]} />
            <meshStandardMaterial color="#e0e0ff" emissive="#a0a0ff" emissiveIntensity={0.3} />
          </mesh>
          <pointLight intensity={0.6} distance={4} color="#f0f0ff" castShadow={false} />
        </group>
      ))}

      {/* Baseboard (floor trim) */}
      <mesh position={[0, 0.04, -5.94]} receiveShadow>
        <boxGeometry args={[13.8, 0.08, 0.06]} />
        <meshStandardMaterial color="#d8d8e0" roughness={0.9} />
      </mesh>
      <mesh position={[-6.94, 0.04, 0]} receiveShadow>
        <boxGeometry args={[0.06, 0.08, 11.8]} />
        <meshStandardMaterial color="#d8d8e0" roughness={0.9} />
      </mesh>

      {/* ── Furniture ── */}

      {/* Vault - back left corner */}
      <Vault position={[-4.8, 0, -4.6]} />

      {/* Whiteboard - left wall */}
      <Whiteboard position={[-5.5, 0, -1.5]} />

      {/* Kanban wall - back wall center-right */}
      <KanbanWall position={[1.2, 0, -5.94]} />

      {/* Desks - center */}
      <Desk position={[-0.5, 0, 0.0]} label="Desk 01" active={true} />
      <Desk position={[1.8, 0, 0.0]}  label="Desk 02" active={false} />

      {/* Lounge - front left */}
      <Lounge position={[-3.5, 0, 2.8]} />

      {/* Security gate - right side */}
      <SecurityGate position={[5.5, 0, 0.8]} />

      {/* Plants */}
      <Plant position={[-6.2, 0, 3.5]} size={1.2} />
      <Plant position={[-6.2, 0, -0.5]} size={0.9} />
      <Plant position={[3.0, 0, 3.5]} size={1.0} />
      <Plant position={[6.2, 0, 3.5]} size={0.8} />

      {/* Area rug under lounge */}
      <AreaRug position={[-3.5, 0.005, 2.8]} />

      {/* Wall art / window frame on back wall */}
      <mesh position={[-2.5, 2.2, -5.91]}>
        <boxGeometry args={[2.0, 1.4, 0.04]} />
        <meshStandardMaterial color="#89b4fa" transparent opacity={0.15} />
      </mesh>
      <mesh position={[-2.5, 2.2, -5.89]}>
        <boxGeometry args={[2.1, 1.5, 0.02]} />
        <meshStandardMaterial color="#45475a" transparent opacity={0.6} />
      </mesh>

      {/* Partition between kanban and desk area */}
      <mesh position={[3.8, 0.9, -1.5]} receiveShadow>
        <boxGeometry args={[0.08, 1.8, 2.0]} />
        <meshStandardMaterial color="#d8d8e0" roughness={0.95} />
      </mesh>
    </group>
  )
}
