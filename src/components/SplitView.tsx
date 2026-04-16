import type { AgentCard as AgentCardType, UrgencyLevel } from '../types/agent';
import { getUrgency } from '../types/agent';
import { formatTimeInState } from '../utils/timeUtils';

interface SplitViewProps {
  agents: AgentCardType[];
}

const URGENCY_WEIGHT: Record<UrgencyLevel, number> = {
  blocked: 0,
  attention: 1,
  stale: 2,
  running: 3,
  completed: 4,
};

const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  blocked: 'Blocked',
  attention: 'Attention',
  stale: 'Stale',
  running: 'Running',
  completed: 'Completed',
};

export function SplitView({ agents }: SplitViewProps) {
  const sorted = [...agents].sort((a, b) => {
    const cmp = URGENCY_WEIGHT[getUrgency(a.agentStatus)] - URGENCY_WEIGHT[getUrgency(b.agentStatus)];
    if (cmp !== 0) return cmp;
    return new Date(a.agentStatusChanged).getTime() - new Date(b.agentStatusChanged).getTime();
  });

  return (
    <div className="split-grid" style={{ '--card-count': sorted.length } as React.CSSProperties}>
      {sorted.map((agent) => {
        const urgency = getUrgency(agent.agentStatus);
        const timeStr = formatTimeInState(agent.agentStatusChanged);
        const jiraUrl = `https://amplitude.atlassian.net/browse/${agent.jiraKey}`;

        return (
          <div key={agent.id} className={`split-card split-${urgency}`}>
            <div className="split-card-header">
              <a href={jiraUrl} className="split-jira" target="_blank" rel="noreferrer">
                {agent.jiraKey}
              </a>
              <span className={`priority-badge priority-${agent.priority.toLowerCase()}`}>
                {agent.priority}
              </span>
              <span className={`split-status split-status-${urgency}`}>
                {URGENCY_LABELS[urgency]}
              </span>
            </div>

            <a href={jiraUrl} className="split-title" target="_blank" rel="noreferrer">
              {agent.projectName}
            </a>

            <p className="split-summary">{agent.agentSummary}</p>

            <div className="split-footer">
              <span className={`time-in-state time-${urgency}`}>{timeStr}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
