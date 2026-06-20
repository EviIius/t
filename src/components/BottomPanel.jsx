import { useRef, useEffect } from 'react'
import { useStore } from '../store/useStore.js'
import { AGENT_DEFS } from '../data/initial.js'
import styles from './BottomPanel.module.css'

const AGENT_COLOR_MAP = Object.fromEntries(AGENT_DEFS.map(a => [a.id, a.color]))

const LEVEL_STYLE = {
  INFO:    { color: '#89b4fa', label: '[INFO]   ' },
  SUCCESS: { color: '#a6e3a1', label: '[SUCCESS]' },
  WARN:    { color: '#f9e2af', label: '[WARN]   ' },
  ERROR:   { color: '#f38ba8', label: '[ERROR]  ' },
  IDLE:    { color: '#585b70', label: '[IDLE]   ' },
}

const TABS = ['TERMINAL', 'OUTPUT', 'EVENT LOG', 'PROBLEMS']

export function BottomPanel() {
  const logs = useStore(s => s.logs)
  const agents = useStore(s => s.agents)
  const bottomTab = useStore(s => s.bottomTab)
  const setBottomTab = useStore(s => s.setBottomTab)
  const selectedAgentId = useStore(s => s.selectedAgentId)
  const logEndRef = useRef()

  const problemCount = logs.filter(l => l.level === 'ERROR' || l.level === 'WARN').length
  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0]
  const agentColor = activeAgent ? AGENT_COLOR_MAP[activeAgent.id] : '#89b4fa'

  return (
    <div className={styles.root}>
      <div className={styles.tabBar}>
        <div className={styles.tabs}>
          {TABS.map(tab => {
            const tabKey = tab.toLowerCase().replace(' ', '_')
            const isActive = bottomTab === tabKey
            return (
              <button
                key={tab}
                className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                onClick={() => setBottomTab(tabKey)}
              >
                {tab}
                {tab === 'PROBLEMS' && problemCount > 0 && (
                  <span className={styles.badge}>{Math.min(problemCount, 99)}</span>
                )}
              </button>
            )
          })}
        </div>

        <div className={styles.controls}>
          {activeAgent && (
            <div className={styles.agentPill}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: agentColor, display: 'inline-block', marginRight: 5 }} />
              <span style={{ color: agentColor }}>{activeAgent.name}</span>
              <span style={{ color: '#45475a', margin: '0 4px' }}>›</span>
            </div>
          )}
          <button className={styles.iconBtn} title="New terminal">+</button>
          <button className={styles.iconBtn} title="Split terminal">⧉</button>
          <button className={styles.iconBtn} title="Clear">⊠</button>
          <button className={styles.iconBtn} title="More">···</button>
        </div>
      </div>

      <div className={styles.content}>
        {bottomTab === 'terminal' && (
          <div className={styles.terminal}>
            {[...logs].reverse().slice(0, 80).map(log => {
              const lvl = LEVEL_STYLE[log.level] || LEVEL_STYLE.INFO
              const agentColor = AGENT_COLOR_MAP[log.agentId] || '#a6adc8'
              return (
                <div key={log.id} className={styles.logLine}>
                  <span className={styles.logTime}>{log.time}</span>
                  <span className={styles.logDot} style={{ color: agentColor }}>●</span>
                  <span className={styles.logAgent} style={{ color: agentColor }}>{log.agentId}</span>
                  <span className={styles.logLevel} style={{ color: lvl.color }}>{lvl.label}</span>
                  <span className={styles.logMsg}>{log.message}</span>
                </div>
              )
            })}
            <div ref={logEndRef} />
          </div>
        )}

        {bottomTab === 'output' && (
          <div className={styles.terminal}>
            <div className={styles.logLine}>
              <span className={styles.logMsg} style={{ color: '#585b70' }}>Watching for file changes...</span>
            </div>
          </div>
        )}

        {bottomTab === 'event_log' && (
          <div className={styles.terminal}>
            {[...logs].reverse().filter(l => l.level !== 'IDLE').map(log => {
              const lvl = LEVEL_STYLE[log.level] || LEVEL_STYLE.INFO
              const agentColor = AGENT_COLOR_MAP[log.agentId] || '#a6adc8'
              return (
                <div key={log.id} className={styles.logLine}>
                  <span className={styles.logTime}>{log.time}</span>
                  <span style={{ color: agentColor, marginRight: 8 }}>EVT</span>
                  <span className={styles.logMsg}>{log.message}</span>
                </div>
              )
            })}
          </div>
        )}

        {bottomTab === 'problems' && (
          <div className={styles.terminal}>
            {logs.filter(l => l.level === 'WARN' || l.level === 'ERROR').map(log => {
              const lvl = LEVEL_STYLE[log.level] || LEVEL_STYLE.INFO
              const agentColor = AGENT_COLOR_MAP[log.agentId] || '#a6adc8'
              return (
                <div key={log.id} className={styles.logLine}>
                  <span style={{ color: lvl.color, marginRight: 8 }}>
                    {log.level === 'ERROR' ? '✖' : '⚠'}
                  </span>
                  <span className={styles.logMsg}>{log.message}</span>
                  <span style={{ color: '#585b70', marginLeft: 'auto', paddingRight: 12 }}>
                    {log.agentId}
                  </span>
                </div>
              )
            })}
            {logs.filter(l => l.level === 'WARN' || l.level === 'ERROR').length === 0 && (
              <div className={styles.logLine}>
                <span className={styles.logMsg} style={{ color: '#585b70' }}>No problems detected.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
