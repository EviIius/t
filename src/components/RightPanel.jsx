import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import { useStore } from '../store/useStore.js'
import { AGENT_DEFS, LOCATIONS } from '../data/initial.js'
import styles from './RightPanel.module.css'

const AGENT_COLOR_MAP = Object.fromEntries(AGENT_DEFS.map(a => [a.id, a.color]))

const STATUS_LABELS = {
  working:       { label: 'In Progress', color: '#89b4fa' },
  moving:        { label: 'Moving',      color: '#f9e2af' },
  idle:          { label: 'Idle',        color: '#585b70' },
  transitioning: { label: 'Finishing',   color: '#a6e3a1' },
}

function MiniMapDots({ agents }) {
  return agents.map(agent => {
    const [x, , z] = agent.position
    const color = AGENT_COLOR_MAP[agent.id] || '#89b4fa'
    const px = ((x + 7) / 14) * 100
    const py = ((z + 6) / 12) * 100
    return (
      <div
        key={agent.id}
        style={{
          position: 'absolute',
          left: `${px}%`,
          top: `${py}%`,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: color,
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 6px ${color}`,
          transition: 'left 0.3s, top 0.3s',
        }}
        title={agent.name}
      />
    )
  })
}

function SystemOverview() {
  const agents = useStore(s => s.agents)
  const activeCount = agents.filter(a => a.state !== 'idle').length

  return (
    <div className={styles.systemCard}>
      <div className={styles.cardHeader}>
        <span>System Overview</span>
        <button className={styles.iconBtn}>···</button>
      </div>

      {/* Mini spatial map */}
      <div className={styles.miniMap}>
        <MiniMapDots agents={agents} />
        {/* Room outline */}
        <div className={styles.roomOutline} />
        {/* Location labels */}
        <div style={{ position: 'absolute', left: '10%', top: '15%', fontSize: 7, color: '#45475a' }}>Vault</div>
        <div style={{ position: 'absolute', left: '35%', top: '10%', fontSize: 7, color: '#45475a' }}>Kanban</div>
        <div style={{ position: 'absolute', left: '45%', top: '50%', fontSize: 7, color: '#45475a' }}>Desk</div>
        <div style={{ position: 'absolute', left: '8%', top: '70%', fontSize: 7, color: '#45475a' }}>Lounge</div>
        <div style={{ position: 'absolute', left: '78%', top: '50%', fontSize: 7, color: '#45475a' }}>Gate</div>
      </div>

      <div className={styles.statRow}>
        <span className={styles.statLabel}>
          <span style={{ color: '#4ACD8C', marginRight: 6 }}>●</span>
          {activeCount} Agents Active
        </span>
        <div className={styles.zoomRow}>
          <button className={styles.zoomBtn}>−</button>
          <span>100%</span>
          <button className={styles.zoomBtn}>+</button>
        </div>
      </div>
    </div>
  )
}

function AgentCard({ agent }) {
  const color = AGENT_COLOR_MAP[agent.id] || '#89b4fa'
  const stateInfo = STATUS_LABELS[agent.state] || STATUS_LABELS.idle
  const loc = agent.locationId ? LOCATIONS[agent.locationId] : null

  return (
    <div className={styles.agentCard} style={{ borderColor: `${color}44` }}>
      <div className={styles.agentHeader}>
        <span style={{ color }} className={styles.agentName}>
          <span className={styles.agentDot} style={{ background: color }} />
          {agent.name}
        </span>
      </div>

      <div className={styles.taskRow}>
        <span className={styles.taskLabel}>Task</span>
        <span className={styles.taskValue}>{agent.task?.label ?? 'Idle'}</span>
      </div>

      {agent.task?.type !== 'idle' && (
        <>
          <div className={styles.taskRow}>
            <span className={styles.taskLabel}>Branch</span>
            <span className={styles.taskValue} style={{ color: '#89b4fa', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
              {agent.branch ?? 'no branch'}
            </span>
          </div>
          <div className={styles.taskRow}>
            <span className={styles.taskLabel}>Location</span>
            <span className={styles.taskValue}>{loc?.label ?? '—'}</span>
          </div>
          <div className={styles.taskRow}>
            <span className={styles.taskLabel}>Status</span>
            <span
              className={styles.statusPill}
              style={{ background: `${stateInfo.color}22`, color: stateInfo.color, border: `1px solid ${stateInfo.color}55` }}
            >
              {stateInfo.label}
            </span>
          </div>
          <div className={styles.progressRow}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${agent.progress}%`, background: color }}
              />
            </div>
            <span className={styles.progressPct}>{Math.round(agent.progress)}%</span>
          </div>
        </>
      )}

      {agent.task?.type === 'idle' && (
        <div className={styles.taskRow}>
          <span style={{ color: '#585b70', fontSize: 11 }}>No active tasks</span>
        </div>
      )}
    </div>
  )
}

export function RightPanel() {
  const agents = useStore(s => s.agents)
  const selectedId = useStore(s => s.selectedAgentId)
  const selectedAgent = agents.find(a => a.id === selectedId) || agents[0]

  return (
    <div className={styles.root}>
      <SystemOverview />

      <div className={styles.divider} />

      {/* Selected agent detail */}
      {selectedAgent && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Agent Details</div>
          <AgentCard agent={selectedAgent} />
        </div>
      )}

      {/* All agents roster */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>All Agents</div>
        <div className={styles.agentList}>
          {agents.map(agent => {
            const color = AGENT_COLOR_MAP[agent.id] || '#89b4fa'
            const stateInfo = STATUS_LABELS[agent.state] || STATUS_LABELS.idle
            return (
              <div key={agent.id} className={styles.agentRow}>
                <span style={{ color, fontSize: 9, lineHeight: 2 }}>●</span>
                <span className={styles.agentRowName}>{agent.name}</span>
                <span style={{ color: stateInfo.color, fontSize: 10, marginLeft: 'auto' }}>
                  {stateInfo.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
