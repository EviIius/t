import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { FILE_TREE, AGENT_DEFS } from '../data/initial.js'
import styles from './Sidebar.module.css'

const AGENT_COLOR_MAP = Object.fromEntries(AGENT_DEFS.map(a => [a.id, a.color]))

const STATUS_BADGE = {
  M: { label: 'M', color: '#f9e2af' },
  U: { label: 'U', color: '#89b4fa' },
  ok:   null,
  warn: { label: '●', color: '#f9e2af' },
}

const FILE_ICONS = {
  flow:    { icon: '⬡', color: '#cba6f7' },
  env:     { icon: '⚙', color: '#f9e2af' },
  spatial: { icon: '◈', color: '#89dceb' },
  yaml:    { icon: '≡', color: '#a6e3a1' },
  md:      { icon: '📄', color: '#89b4fa' },
  text:    { icon: '📄', color: '#a6adc8' },
  agent:   { icon: '●', color: null },
  default: { icon: '◻', color: '#585b70' },
}

const NAV_ICONS = [
  { id: 'explorer', icon: '⊞', label: 'Explorer', active: true },
  { id: 'search',   icon: '⌕', label: 'Search' },
  { id: 'source',   icon: '⑂', label: 'Source Control' },
  { id: 'spatial',  icon: '⧉', label: 'Spatial CAD' },
  { id: 'ext',      icon: '⊟', label: 'Extensions' },
]

function TreeNode({ node, depth = 0 }) {
  const sidebarExpanded = useStore(s => s.sidebarExpanded)
  const toggleFolder = useStore(s => s.toggleFolder)
  const selectAgent = useStore(s => s.selectAgent)
  const selectedId = useStore(s => s.selectedAgentId)
  const agents = useStore(s => s.agents)

  const isExpanded = sidebarExpanded[node.id] ?? node.expanded ?? false

  const agentState = node.type === 'agent'
    ? agents.find(a => a.id === node.agentId)
    : null

  const handleClick = () => {
    if (node.type === 'folder' || node.type === 'root') {
      toggleFolder(node.id)
    } else if (node.type === 'agent') {
      selectAgent(node.agentId)
    }
  }

  const isSelected = node.type === 'agent' && selectedId === node.agentId
  const fileIcon = FILE_ICONS[node.fileType || node.type] || FILE_ICONS.default
  const iconColor = node.type === 'agent' ? AGENT_COLOR_MAP[node.agentId] : fileIcon.color
  const badge = STATUS_BADGE[node.status]

  return (
    <div>
      <div
        className={`${styles.treeNode} ${isSelected ? styles.selected : ''}`}
        style={{ paddingLeft: 12 + depth * 14 }}
        onClick={handleClick}
      >
        {(node.type === 'folder' || node.type === 'root') && (
          <span className={styles.chevron}>{isExpanded ? '▾' : '▸'}</span>
        )}
        {node.type === 'folder' && (
          <span style={{ color: '#f9e2af', marginRight: 5, fontSize: 11 }}>
            {isExpanded ? '📂' : '📁'}
          </span>
        )}
        {node.type !== 'folder' && node.type !== 'root' && (
          <span style={{ color: iconColor, marginRight: 5, fontSize: 11 }}>
            {fileIcon.icon}
          </span>
        )}

        <span className={styles.label} style={{ color: isSelected ? '#cdd6f4' : '#bac2de' }}>
          {node.label}
        </span>

        {agentState && (
          <span
            className={styles.agentDot}
            style={{
              background: agentState.state === 'idle' ? '#585b70' :
                          agentState.state === 'moving' ? '#f9e2af' : AGENT_COLOR_MAP[node.agentId],
            }}
          />
        )}

        {badge && (
          <span style={{ color: badge.color, fontSize: 10, marginLeft: 'auto', paddingRight: 8 }}>
            {badge.label}
          </span>
        )}
      </div>

      {(node.type === 'folder' || node.type === 'root') && isExpanded && node.children?.map(child => (
        <TreeNode key={child.id} node={child} depth={depth + (node.type === 'root' ? 0 : 1)} />
      ))}
    </div>
  )
}

export function Sidebar() {
  const [activeNav, setActiveNav] = useState('explorer')

  return (
    <div className={styles.root}>
      {/* Activity bar */}
      <div className={styles.activityBar}>
        <div className={styles.logoMark}>
          <div className={styles.logoIcon}>S</div>
        </div>
        {NAV_ICONS.map(nav => (
          <button
            key={nav.id}
            className={`${styles.navBtn} ${activeNav === nav.id ? styles.navActive : ''}`}
            onClick={() => setActiveNav(nav.id)}
            title={nav.label}
          >
            {nav.icon}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className={styles.navBtn} title="Settings" style={{ marginBottom: 8 }}>⚙</button>
      </div>

      {/* File tree panel */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span>EXPLORER</span>
          <button className={styles.headerBtn} title="More actions">···</button>
        </div>
        <div className={styles.tree}>
          {FILE_TREE.map(node => (
            <TreeNode key={node.id} node={node} depth={0} />
          ))}
        </div>

        {/* Outline section */}
        <div className={styles.sectionHeader} onClick={() => {}}>
          <span className={styles.chevron}>▸</span>
          <span>OUTLINE</span>
        </div>

        {/* Timeline section */}
        <div className={styles.sectionHeader} onClick={() => {}}>
          <span className={styles.chevron}>▸</span>
          <span>TIMELINE</span>
        </div>
      </div>
    </div>
  )
}
