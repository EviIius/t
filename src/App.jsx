import { useState } from 'react'
import { useStore } from './store/useStore.js'
import { Sidebar } from './components/Sidebar.jsx'
import { BottomPanel } from './components/BottomPanel.jsx'
import { RightPanel } from './components/RightPanel.jsx'
import { CommandPalette } from './components/CommandPalette.jsx'
import { SAMSScene } from './components/scene/SAMSScene.jsx'
import styles from './App.module.css'

function TitleBar() {
  const setCommandOpen = useStore(s => s.setCommandOpen)
  const agents = useStore(s => s.agents)
  const activeCount = agents.filter(a => a.state !== 'idle').length
  const problemCount = useStore(s => s.logs).filter(l => l.level === 'ERROR').length
  const warnCount = useStore(s => s.logs).filter(l => l.level === 'WARN').length

  return (
    <div className={styles.titleBar}>
      <div className={styles.titleLeft}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>S</div>
          <div className={styles.logoText}>
            <span className={styles.logoName}>SAMS</span>
            <span className={styles.logoSub}>Spatial Agentic Management System</span>
          </div>
        </div>
      </div>

      <button className={styles.commandBtn} onClick={() => setCommandOpen(true)}>
        <span className={styles.cmdIcon}>⌕</span>
        <span className={styles.cmdPlaceholder}>Type a command or search...</span>
        <span className={styles.cmdKbd}>⌘K</span>
      </button>

      <div className={styles.titleRight}>
        <button className={styles.titleBtn} title="Notifications">
          <span>⊟</span>
        </button>
        <button className={styles.titleBtn} title="Layout">
          <span>⊞</span>
        </button>
        <button className={styles.titleBtn} title="Share">
          <span>⬆</span>
        </button>
        <button className={styles.titleBtn} title="Settings">
          <span>⊗</span>
        </button>
      </div>
    </div>
  )
}

function StatusBar() {
  const agents = useStore(s => s.agents)
  const logs = useStore(s => s.logs)
  const errCount = logs.filter(l => l.level === 'ERROR').length
  const warnCount = logs.filter(l => l.level === 'WARN').length
  const activeCount = agents.filter(a => a.state !== 'idle').length

  return (
    <div className={styles.statusBar}>
      <div className={styles.statusLeft}>
        <span className={styles.statusItem}>
          <span style={{ color: '#89b4fa', marginRight: 4 }}>⑂</span>
          main*
        </span>
        <span className={styles.statusSep} />
        <span className={styles.statusItem} style={{ color: errCount > 0 ? '#f38ba8' : 'inherit' }}>
          ✖ {errCount}
        </span>
        <span className={styles.statusItem} style={{ color: warnCount > 0 ? '#f9e2af' : 'inherit' }}>
          ⚠ {warnCount}
        </span>
        <span className={styles.statusItem}>
          ⚡ 0
        </span>
      </div>

      <div className={styles.statusRight}>
        <span className={styles.statusItem} style={{ color: '#4ACD8C' }}>
          ● {activeCount} Agents Active
        </span>
        <span className={styles.statusSep} />
        <span className={styles.statusItem}>Spaces: 2</span>
        <span className={styles.statusItem}>UTF-8</span>
        <span className={styles.statusItem}>LF</span>
        <span className={styles.statusItem}>YAML</span>
        <span className={styles.statusItem} style={{ color: '#89b4fa' }}>SAMS: Connected</span>
      </div>
    </div>
  )
}

export default function App() {
  const [bottomHeight, setBottomHeight] = useState(185)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e) => {
    setIsDragging(true)
    const startY = e.clientY
    const startH = bottomHeight

    const onMove = (e) => {
      const newH = Math.max(80, Math.min(400, startH + (startY - e.clientY)))
      setBottomHeight(newH)
    }
    const onUp = () => {
      setIsDragging(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div className={styles.app}>
      <TitleBar />

      <div className={styles.body}>
        <Sidebar />

        <div className={styles.main}>
          <div className={styles.sceneArea} style={{ height: `calc(100% - ${bottomHeight}px - 5px)` }}>
            <SAMSScene />
          </div>

          <div
            className={`${styles.resizeHandle} ${isDragging ? styles.dragging : ''}`}
            onMouseDown={handleDragStart}
          />

          <div className={styles.bottomArea} style={{ height: bottomHeight }}>
            <BottomPanel />
          </div>
        </div>

        <RightPanel />
      </div>

      <StatusBar />
      <CommandPalette />
    </div>
  )
}
