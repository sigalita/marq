import type { AgentCard as AgentCardType, UrgencyLevel } from '../types/agent';
import { getUrgency } from '../types/agent';
import { formatTimeInState, getEscalationTier } from '../utils/timeUtils';

interface AgentCardProps {
  agent: AgentCardType;
}

const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  blocked: 'Blocked',
  attention: 'Attention',
  working: 'Working',
  done: 'Completed',
};

export function AgentCard({ agent }: AgentCardProps) {
  const urgency = getUrgency(agent.agentStatus);
  const timeStr = formatTimeInState(agent.agentStatusChanged);
  const escalation = (urgency === 'blocked' || urgency === 'attention')
    ? getEscalationTier(agent.agentStatusChanged)
    : 'none';
  const jiraUrl = `https://amplitude.atlassian.net/browse/${agent.jiraKey}`;

  return (
    <div
      className={`agent-card urgency-${urgency}${escalation !== 'none' ? ` escalation-${escalation}` : ''}`}
    >
      <div className="card-header">
        <a href={jiraUrl} className="card-jira" target="_blank" rel="noreferrer">
          {agent.jiraKey}
        </a>
        <span className={`priority-badge priority-${agent.priority.toLowerCase()}`}>
          {agent.priority}
        </span>
      </div>

      <a href={jiraUrl} className="card-title-link" target="_blank" rel="noreferrer">
        <h3 className="card-title">{agent.projectName}</h3>
      </a>
      <p className="card-summary">{agent.agentSummary}</p>

      <div className="card-meta">
        <span className={`time-in-state time-${urgency}`}>
          {URGENCY_LABELS[urgency]} {timeStr}
        </span>
      </div>
    </div>
  );
}
