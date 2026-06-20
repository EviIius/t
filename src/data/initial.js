export const AGENT_DEFS = [
  {
    id: 'blue-agent',
    name: 'blue-agent',
    color: '#4A9EFF',
    colorDark: '#1a6fd4',
    colorLight: '#a0cfff',
    eyeColor: '#89dceb',
    startLocation: 'desk1',
    branch: 'feature/kanban-sync',
    progress: 68,
  },
  {
    id: 'green-agent',
    name: 'green-agent',
    color: '#4ACD8C',
    colorDark: '#27a065',
    colorLight: '#8de8b8',
    eyeColor: '#a6e3a1',
    startLocation: 'kanban',
    branch: 'feat/data-sync',
    progress: 100,
  },
  {
    id: 'orange-agent',
    name: 'orange-agent',
    color: '#FF8C42',
    colorDark: '#c85f0f',
    colorLight: '#ffb87a',
    eyeColor: '#fab387',
    startLocation: 'kanban2',
    branch: 'fix/queue-revision',
    progress: 45,
  },
  {
    id: 'purple-agent',
    name: 'purple-agent',
    color: '#9B59B6',
    colorDark: '#6c3483',
    colorLight: '#c39bd3',
    eyeColor: '#cba6f7',
    startLocation: 'whiteboard',
    branch: 'review/card-12',
    progress: 30,
  },
  {
    id: 'red-agent',
    name: 'red-agent',
    color: '#E74C3C',
    colorDark: '#a93226',
    colorLight: '#f1948a',
    eyeColor: '#f38ba8',
    startLocation: 'lounge',
    branch: null,
    progress: 0,
  },
  {
    id: 'yellow-agent',
    name: 'yellow-agent',
    color: '#F1C40F',
    colorDark: '#b7950b',
    colorLight: '#f7dc6f',
    eyeColor: '#f9e2af',
    startLocation: 'kanban3',
    branch: 'feat/column-mapping',
    progress: 100,
  },
]

export const LOCATIONS = {
  desk1:     { id: 'desk1',    label: 'Desk 01',       position: [-0.5, 0, 0.2],  facingY: Math.PI,       taskType: 'compute'  },
  desk2:     { id: 'desk2',    label: 'Desk 02',       position: [1.8, 0, 0.2],   facingY: Math.PI,       taskType: 'compute'  },
  whiteboard:{ id: 'whiteboard',label:'Whiteboard',    position: [-4.2, 0, -1.5], facingY: Math.PI / 2,   taskType: 'plan'     },
  kanban:    { id: 'kanban',   label: 'Kanban Wall',   position: [-0.8, 0, -4.2], facingY: 0,             taskType: 'review'   },
  kanban2:   { id: 'kanban2',  label: 'Kanban Wall',   position: [0.8, 0, -4.2],  facingY: 0,             taskType: 'review'   },
  kanban3:   { id: 'kanban3',  label: 'Kanban Wall',   position: [2.2, 0, -4.2],  facingY: 0,             taskType: 'review'   },
  vault:     { id: 'vault',    label: 'Vault',         position: [-4.5, 0, -4.0], facingY: Math.PI / 2,   taskType: 'secure'   },
  lounge:    { id: 'lounge',   label: 'Lounge',        position: [-3.5, 0, 2.5],  facingY: -Math.PI / 4,  taskType: 'idle'     },
  gate:      { id: 'gate',     label: 'Security Gate', position: [4.8, 0, 0.5],   facingY: -Math.PI / 2,  taskType: 'monitor'  },
  center:    { id: 'center',   label: 'Floor',         position: [0, 0, 1.5],     facingY: 0,             taskType: 'idle'     },
}

export const TASK_POOL = [
  { id: 't1',  type: 'compute',  label: 'Sync work items',           detail: 'Loaded work items from Kanban Wall: VGRK_17DPS',      locationId: 'desk1'     },
  { id: 't2',  type: 'compute',  label: 'Run test suite',            detail: 'Executing 847 unit tests across 12 modules',           locationId: 'desk2'     },
  { id: 't3',  type: 'review',   label: 'Review PR #142',            detail: 'Synced 24 cards across 4 columns',                     locationId: 'kanban'    },
  { id: 't4',  type: 'review',   label: 'Validate column mapping',   detail: 'Column mapping validated — all 6 fields resolved',     locationId: 'kanban2'   },
  { id: 't5',  type: 'plan',     label: 'Architecture planning',     detail: 'Drafting multi-agent coordination protocol',           locationId: 'whiteboard'},
  { id: 't6',  type: 'plan',     label: 'Sprint planning session',   detail: 'Allocated 14 story points across 3 agents',            locationId: 'whiteboard'},
  { id: 't7',  type: 'secure',   label: 'Rotate access tokens',      detail: 'Vault credentials refreshed successfully',             locationId: 'vault'     },
  { id: 't8',  type: 'secure',   label: 'Audit permission matrix',   detail: 'Scanning 48 permission entries for anomalies',         locationId: 'vault'     },
  { id: 't9',  type: 'idle',     label: 'Standby',                   detail: 'No active tasks — awaiting assignment',                locationId: 'lounge'    },
  { id: 't10', type: 'monitor',  label: 'Gate inspection',           detail: 'Monitoring ingress/egress events',                     locationId: 'gate'      },
  { id: 't11', type: 'compute',  label: 'Revise queue',              detail: 'Revise queue: 3 items waiting',                        locationId: 'desk1'     },
  { id: 't12', type: 'review',   label: 'Card #12 blocked',          detail: 'Card #12 blocked: awaiting review from senior agent',  locationId: 'kanban3'   },
]

export const FILE_TREE = [
  {
    id: 'workspace', label: 'SAMS-WORKSPACE', type: 'root', expanded: true,
    children: [
      {
        id: 'agents', label: 'agents', type: 'folder', expanded: true,
        children: AGENT_DEFS.map(a => ({ id: a.id, label: a.name, type: 'agent', agentId: a.id, status: 'M' }))
      },
      {
        id: 'workflows', label: 'workflows', type: 'folder', expanded: true,
        children: [
          { id: 'wf1', label: 'onboarding.flow',  type: 'file', fileType: 'flow', status: 'ok'  },
          { id: 'wf2', label: 'code-review.flow', type: 'file', fileType: 'flow', status: 'warn'},
          { id: 'wf3', label: 'deploy.flow',      type: 'file', fileType: 'flow', status: 'ok'  },
        ]
      },
      {
        id: 'environments', label: 'environments', type: 'folder', expanded: false,
        children: [
          { id: 'env1', label: 'dev.env',     type: 'file', fileType: 'env', status: 'ok'   },
          { id: 'env2', label: 'staging.env', type: 'file', fileType: 'env', status: 'warn' },
          { id: 'env3', label: 'prod.env',    type: 'file', fileType: 'env', status: 'ok'   },
        ]
      },
      {
        id: 'assets', label: 'assets', type: 'folder', expanded: false,
        children: [
          { id: 'a1', label: 'architecture.spatial',  type: 'file', fileType: 'spatial', status: 'M' },
          { id: 'a2', label: 'office-layout.spatial', type: 'file', fileType: 'spatial', status: 'M' },
          { id: 'a3', label: 'furniture.spatial',     type: 'file', fileType: 'spatial', status: 'U' },
        ]
      },
      {
        id: 'configs', label: 'configs', type: 'folder', expanded: false,
        children: [
          { id: 'c1', label: 'sams.yaml',        type: 'file', fileType: 'yaml', status: 'M' },
          { id: 'c2', label: 'agents.yaml',      type: 'file', fileType: 'yaml', status: 'M' },
          { id: 'c3', label: 'permissions.yaml', type: 'file', fileType: 'yaml', status: 'U' },
        ]
      },
      { id: 'readme',    label: 'README.md',    type: 'file', fileType: 'md',   status: 'M' },
      { id: 'changelog', label: 'CHANGELOG.md', type: 'file', fileType: 'md',   status: 'M' },
      { id: 'license',   label: 'LICENSE',      type: 'file', fileType: 'text', status: 'U' },
    ]
  }
]
