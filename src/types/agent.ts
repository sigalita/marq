export type AgentStatusBlocked =
  | 'Awaiting Permission'
  | 'Asking Question'
  | 'Errored'
  | 'Context Exhausted'
  | 'Rate Limited';

export type AgentStatusAttention =
  | 'PR Ready for Review'
  | 'CI Failing'
  | 'PR Feedback Received'
  | 'Merge Conflict'
  | 'Scope Uncertainty'
  | 'Dependency Blocked';

export type AgentStatusStale = 'Stale';

export type AgentStatusRunning = 'Running';

export type AgentStatusCompleted = 'Completed' | 'Idle' | 'Queued';

export type AgentStatus =
  | AgentStatusBlocked
  | AgentStatusAttention
  | AgentStatusStale
  | AgentStatusRunning
  | AgentStatusCompleted;

export type UnblockAction =
  | 'Approve Permission'
  | 'Answer Question'
  | 'Review PR'
  | 'Address PR Feedback'
  | 'Resolve Merge Conflict'
  | 'Diagnose Error'
  | 'Continue Session'
  | 'Validate Approach'
  | 'Unblock Dependency'
  | 'None';

export type UrgencyLevel = 'blocked' | 'attention' | 'stale' | 'running' | 'completed';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface AgentCard {
  id: string;
  jiraKey: string;
  projectName: string;
  agentStatus: AgentStatus;
  unblockAction: UnblockAction;
  agentSummary: string;
  blockingDetail: string;
  claudeThreadLink: string;
  prLink: string;
  agentStatusChanged: string;
  priority: Priority;
}

export const BLOCKED_STATUSES: AgentStatus[] = [
  'Awaiting Permission',
  'Asking Question',
  'Errored',
  'Context Exhausted',
  'Rate Limited',
];

export const ATTENTION_STATUSES: AgentStatus[] = [
  'PR Ready for Review',
  'CI Failing',
  'PR Feedback Received',
  'Merge Conflict',
  'Scope Uncertainty',
  'Dependency Blocked',
];

export const STALE_STATUSES: AgentStatus[] = ['Stale'];

export const RUNNING_STATUSES: AgentStatus[] = ['Running'];

export const COMPLETED_STATUSES: AgentStatus[] = ['Completed', 'Idle', 'Queued'];

export function getUrgency(status: AgentStatus): UrgencyLevel {
  if (BLOCKED_STATUSES.includes(status)) return 'blocked';
  if (ATTENTION_STATUSES.includes(status)) return 'attention';
  if (STALE_STATUSES.includes(status)) return 'stale';
  if (RUNNING_STATUSES.includes(status)) return 'running';
  return 'completed';
}
