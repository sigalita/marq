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

export type AgentStatusInfo =
  | 'Actively Working'
  | 'Completed'
  | 'Idle'
  | 'Queued';

export type AgentStatus = AgentStatusBlocked | AgentStatusAttention | AgentStatusInfo;

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

export type UrgencyLevel = 'blocked' | 'attention' | 'working' | 'done';

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
  agentStatusChanged: string; // ISO datetime
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

export const WORKING_STATUSES: AgentStatus[] = ['Actively Working'];

export const DONE_STATUSES: AgentStatus[] = ['Completed', 'Idle', 'Queued'];

export function getUrgency(status: AgentStatus): UrgencyLevel {
  if (BLOCKED_STATUSES.includes(status)) return 'blocked';
  if (ATTENTION_STATUSES.includes(status)) return 'attention';
  if (WORKING_STATUSES.includes(status)) return 'working';
  return 'done';
}
