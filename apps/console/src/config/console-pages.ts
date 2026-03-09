export type ConsolePageId =
  | 'dashboard'
  | 'monitors'
  | 'monitorDetails'
  | 'incidents'
  | 'logs'
  | 'alerts'
  | 'statusPages'
  | 'settings';

export interface ConsoleSectionConfig {
  id: string;
  title: string;
  description?: string;
  items?: string[];
}

export interface ConsolePageConfig {
  id: ConsolePageId;
  path: string;
  title: string;
  description?: string;
  sections: ConsoleSectionConfig[];
}

export const consolePages: Record<ConsolePageId, ConsolePageConfig> = {
  dashboard: {
    id: 'dashboard',
    path: '/',
    title: 'Dashboard',
    description: 'Quick overview of monitors, incidents, and uptime.',
    sections: [
      {
        id: 'stats',
        title: 'Stats cards',
        items: [
          'Total monitors',
          'Monitors up',
          'Monitors down',
          'Active incidents',
        ],
      },
      {
        id: 'uptime',
        title: 'Uptime chart',
        items: ['Last 24h', 'Last 7 days'],
      },
      {
        id: 'response-time',
        title: 'Response time chart',
        description: 'Average latency of monitors.',
      },
      {
        id: 'recent-incidents',
        title: 'Recent incidents',
        description: 'Latest downtime events.',
      },
      {
        id: 'recent-checks',
        title: 'Recent checks',
        description: 'Latest monitor activity.',
      },
    ],
  },
  monitors: {
    id: 'monitors',
    path: '/monitors',
    title: 'Monitors',
    description: 'Manage the endpoints you are monitoring.',
    sections: [
      {
        id: 'table',
        title: 'Monitors table',
        items: [
          'Name',
          'URL',
          'Status',
          'Interval',
          'Response time',
          'Last checked',
          'Actions',
        ],
      },
      {
        id: 'actions',
        title: 'Monitor actions',
        items: [
          'Create monitor',
          'Pause / enable',
          'Edit monitor',
          'Delete monitor',
          'Filter by status',
          'Search',
        ],
      },
    ],
  },
  monitorDetails: {
    id: 'monitorDetails',
    path: '/monitors/$monitorId',
    title: 'Monitor details',
    description: 'Everything about one monitored endpoint.',
    sections: [
      {
        id: 'summary',
        title: 'Monitor summary',
        items: ['URL', 'Status', 'Interval', 'Last check', 'Response time'],
      },
      {
        id: 'uptime',
        title: 'Uptime graph',
        description: 'Shows uptime over time.',
      },
      {
        id: 'latency',
        title: 'Response time graph',
        description: 'Latency history.',
      },
      {
        id: 'checks',
        title: 'Check history',
        items: ['Status', 'Status code', 'Response time', 'Time'],
      },
      {
        id: 'incidents',
        title: 'Incident history',
        description: 'List of downtime events.',
      },
    ],
  },
  incidents: {
    id: 'incidents',
    path: '/incidents',
    title: 'Incidents',
    description: 'Downtime events across your monitors.',
    sections: [
      {
        id: 'table',
        title: 'Incidents table',
        items: ['Monitor', 'Status', 'Started', 'Resolved', 'Duration'],
      },
      {
        id: 'details',
        title: 'Incident details (per incident)',
        items: ['Timeline', 'Logs during failure', 'Resolution time'],
      },
    ],
  },
  logs: {
    id: 'logs',
    path: '/logs',
    title: 'Logs',
    description: 'Raw monitoring logs.',
    sections: [
      {
        id: 'table',
        title: 'Logs table',
        items: [
          'Monitor',
          'Status',
          'Status code',
          'Response time',
          'Timestamp',
          'Error',
        ],
      },
      {
        id: 'filters',
        title: 'Filters',
        items: ['Monitor', 'Status', 'Time range'],
      },
    ],
  },
  alerts: {
    id: 'alerts',
    path: '/alerts',
    title: 'Alerts',
    description: 'Configure downtime notifications.',
    sections: [
      {
        id: 'channels',
        title: 'Alert channels',
        items: ['Email', 'Slack', 'Webhook', 'Telegram'],
      },
      {
        id: 'rules',
        title: 'Alert settings',
        items: [
          'Notify when monitor goes down',
          'Notify when monitor recovers',
          'Alert delay',
        ],
      },
    ],
  },
  statusPages: {
    id: 'statusPages',
    path: '/status-pages',
    title: 'Status pages',
    description: 'Public uptime pages for your customers.',
    sections: [
      {
        id: 'features',
        title: 'Status page features',
        items: [
          'Public URL',
          'Choose monitors to show',
          'Incident history',
          'Uptime stats',
        ],
      },
    ],
  },
  settings: {
    id: 'settings',
    path: '/settings',
    title: 'Settings',
    description: 'Workspace, team, and API configuration.',
    sections: [
      {
        id: 'team',
        title: 'Team',
        items: ['Invite member', 'Roles'],
      },
      {
        id: 'api-keys',
        title: 'API keys',
        items: ['Generate API token'],
      },
      {
        id: 'workspace',
        title: 'Workspace settings',
        items: ['Project name', 'Timezone'],
      },
    ],
  },
};

