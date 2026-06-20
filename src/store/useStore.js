import { create } from 'zustand'
import { AGENT_DEFS, LOCATIONS, TASK_POOL } from '../data/initial.js'

const LOG_COLORS = {
  INFO:    '#89b4fa',
  SUCCESS: '#a6e3a1',
  WARN:    '#f9e2af',
  ERROR:   '#f38ba8',
  IDLE:    '#585b70',
}

function getTime() {
  return new Date().toLocaleTimeString('en-US', { hour12: false })
}

function getRandomTask(agentId) {
  const pool = TASK_POOL.filter(t => t.type !== 'idle')
  return pool[Math.floor(Math.random() * pool.length)]
}

const initialAgentStates = AGENT_DEFS.map((def, i) => {
  const startTask = TASK_POOL[i] || TASK_POOL[0]
  const loc = LOCATIONS[startTask.locationId] || LOCATIONS.center
  return {
    ...def,
    position: [...loc.position],
    targetPosition: [...loc.position],
    facingY: loc.facingY,
    locationId: startTask.locationId,
    task: startTask,
    state: startTask.type === 'idle' ? 'idle' : 'working',
    stateTimer: Math.random() * 8 + 6,
    progress: def.progress,
    moveProgress: 0,
    bobOffset: Math.random() * Math.PI * 2,
  }
})

export const useStore = create((set, get) => ({
  agents: initialAgentStates,
  logs: [
    { id: 1, time: '10:46:22', agentId: 'blue-agent',   level: 'INFO',    message: 'Loaded work items from Kanban Wall: VGRK_17DPS' },
    { id: 2, time: '10:46:22', agentId: 'green-agent',  level: 'SUCCESS', message: 'Synced 24 cards across 4 columns' },
    { id: 3, time: '10:46:23', agentId: 'orange-agent', level: 'INFO',    message: 'Revise queue: 3 items waiting' },
    { id: 4, time: '10:46:24', agentId: 'purple-agent', level: 'INFO',    message: 'Card #12 blocked: awaiting review' },
    { id: 5, time: '10:46:25', agentId: 'yellow-agent', level: 'SUCCESS', message: 'Column mapping validated' },
    { id: 6, time: '10:46:26', agentId: 'red-agent',    level: 'IDLE',    message: 'No active tasks' },
  ],
  nextLogId: 7,
  selectedAgentId: 'blue-agent',
  commandOpen: false,
  bottomTab: 'terminal',
  sidebarExpanded: { agents: true, workflows: true, environments: false, assets: false, configs: false },

  selectAgent: (id) => set({ selectedAgentId: id }),
  setCommandOpen: (open) => set({ commandOpen: open }),
  setBottomTab: (tab) => set({ bottomTab: tab }),
  toggleFolder: (id) => set(state => ({
    sidebarExpanded: { ...state.sidebarExpanded, [id]: !state.sidebarExpanded[id] }
  })),

  addLog: (agentId, level, message) => set(state => {
    const log = { id: state.nextLogId, time: getTime(), agentId, level, message }
    return {
      logs: [log, ...state.logs].slice(0, 120),
      nextLogId: state.nextLogId + 1,
    }
  }),

  tick: (delta) => set(state => {
    const agents = state.agents.map(agent => {
      let { stateTimer, state: agentState, progress, position, targetPosition, locationId, task, moveProgress } = agent

      stateTimer -= delta

      if (agentState === 'moving') {
        moveProgress = Math.min(1, moveProgress + delta * 1.4)
        const p = easeInOut(moveProgress)
        const newPos = [
          lerp(agent._fromPos[0], targetPosition[0], p),
          lerp(agent._fromPos[1], targetPosition[1], p),
          lerp(agent._fromPos[2], targetPosition[2], p),
        ]
        if (moveProgress >= 1) {
          return { ...agent, position: [...targetPosition], moveProgress: 1, state: 'working', stateTimer: Math.random() * 12 + 8, progress: 0 }
        }
        return { ...agent, position: newPos, moveProgress }
      }

      if (agentState === 'working') {
        progress = Math.min(100, progress + delta * (4 + Math.random() * 2))
        if (stateTimer <= 0 || progress >= 100) {
          return { ...agent, progress: 100, stateTimer: 0, state: 'transitioning' }
        }
        return { ...agent, progress, stateTimer }
      }

      if (agentState === 'transitioning') {
        return { ...agent, state: 'idle', stateTimer: Math.random() * 3 + 1 }
      }

      if (agentState === 'idle' && stateTimer <= 0) {
        const newTask = getRandomTask(agent.id)
        const newLoc = LOCATIONS[newTask.locationId]
        if (!newLoc) return { ...agent, stateTimer: 3 }
        return {
          ...agent,
          task: newTask,
          locationId: newTask.locationId,
          targetPosition: [...newLoc.position],
          _fromPos: [...agent.position],
          facingY: newLoc.facingY,
          state: 'moving',
          moveProgress: 0,
          stateTimer: 999,
          progress: 0,
        }
      }

      return { ...agent, stateTimer }
    })

    return { agents }
  }),

  tickLogs: () => {
    const state = get()
    const agent = state.agents[Math.floor(Math.random() * state.agents.length)]
    if (!agent) return

    const messages = {
      compute:  ['INFO',    ['Processing batch job', 'Compiling dependency graph', 'Cache hit: 94%', 'Running linter checks', 'Resolving merge conflicts']],
      review:   ['INFO',    ['Scanning PR diff', 'Flagging code smell in line 142', 'Review queued', 'Approving changeset', 'Requesting changes']],
      plan:     ['INFO',    ['Drafting sprint goals', 'Estimating story points', 'Updating roadmap', 'Identifying blockers', 'Syncing with PM agent']],
      secure:   ['WARN',   ['Unusual access pattern detected', 'Rotating credentials', 'Token refreshed', 'Scanning for vulnerabilities']],
      idle:     ['IDLE',   ['Awaiting assignment', 'Standby mode', 'No active tasks']],
      monitor:  ['INFO',   ['Monitoring ingress events', 'Gate sensor active', 'Logging access', 'Scanning badge IDs']],
    }

    const taskType = agent.task?.type || 'idle'
    const [level, msgs] = messages[taskType] || messages.idle
    const message = msgs[Math.floor(Math.random() * msgs.length)]
    state.addLog(agent.id, level, message)
  },
}))

function lerp(a, b, t) { return a + (b - a) * t }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
