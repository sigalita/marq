import type { AgentCard as AgentCardType, UrgencyLevel } from '../types/agent';
import { getUrgency } from '../types/agent';
import { formatTimeInState } from '../utils/timeUtils';

interface SplitViewProps {
  agents: AgentCardType[];
}

const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  blocked: 'Blocked',
  attention: 'Attention',
  working: 'Working',
  done: 'Done',
};

export function SplitView({ agents }: SplitViewProps) {
  // Sort by duration (longest first)
  const sorted = [...agents].sort(
    (a, b) => new Date(a.agentStatusChanged).getTime() - new Date(b.agentStatusChanged).getTime()
  );

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
