import { useState, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore.js'
import { AGENT_DEFS } from '../data/initial.js'
import styles from './CommandPalette.module.css'

const AGENT_COLOR_MAP = Object.fromEntries(AGENT_DEFS.map(a => [a.id, a.color]))

const COMMANDS = [
  { id: 'view-blue',   label: 'Focus: blue-agent',   type: 'agent',   agentId: 'blue-agent'   },
  { id: 'view-green',  label: 'Focus: green-agent',  type: 'agent',   agentId: 'green-agent'  },
  { id: 'view-orange', label: 'Focus: orange-agent', type: 'agent',   agentId: 'orange-agent' },
  { id: 'view-purple', label: 'Focus: purple-agent', type: 'agent',   agentId: 'purple-agent' },
  { id: 'view-red',    label: 'Focus: red-agent',    type: 'agent',   agentId: 'red-agent'    },
  { id: 'view-yellow', label: 'Focus: yellow-agent', type: 'agent',   agentId: 'yellow-agent' },
  { id: 'sams-overview',label: 'View: System Overview', type: 'view'  },
  { id: 'sams-logs',   label: 'View: Event Log',     type: 'view'     },
  { id: 'sams-probs',  label: 'View: Problems',      type: 'view'     },
]

export function CommandPalette() {
  const isOpen = useStore(s => s.commandOpen)
  const setCommandOpen = useStore(s => s.setCommandOpen)
  const selectAgent = useStore(s => s.selectAgent)
  const setBottomTab = useStore(s => s.setBottomTab)

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef()

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(!isOpen)
      }
      if (e.key === 'Escape') setCommandOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, setCommandOpen])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const execute = (cmd) => {
    if (cmd.type === 'agent') selectAgent(cmd.agentId)
    if (cmd.id === 'sams-logs') setBottomTab('event_log')
    if (cmd.id === 'sams-probs') setBottomTab('problems')
    setCommandOpen(false)
  }

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && filtered[selected]) execute(filtered[selected])
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={() => setCommandOpen(false)}>
      <div className={styles.palette} onClick={e => e.stopPropagation()}>
        <div className={styles.inputRow}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Type a command or search..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0) }}
            onKeyDown={handleKey}
          />
          <span className={styles.kbd}>⌘K</span>
        </div>
        <div className={styles.results}>
          {filtered.length === 0 && (
            <div className={styles.empty}>No results found</div>
          )}
          {filtered.map((cmd, i) => {
            const color = cmd.agentId ? AGENT_COLOR_MAP[cmd.agentId] : '#89b4fa'
            return (
              <div
                key={cmd.id}
                className={`${styles.result} ${i === selected ? styles.resultActive : ''}`}
                onMouseEnter={() => setSelected(i)}
                onClick={() => execute(cmd)}
              >
                <span style={{ color, marginRight: 10, fontSize: 12 }}>
                  {cmd.type === 'agent' ? '●' : cmd.type === 'view' ? '◈' : '⚡'}
                </span>
                <span className={styles.resultLabel}>{cmd.label}</span>
                <span className={styles.resultType}>{cmd.type}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
