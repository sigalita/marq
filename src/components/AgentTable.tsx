import { useState } from 'react';
import type { AgentCard as AgentCardType, Priority } from '../types/agent';
import { getUrgency } from '../types/agent';
import { formatTimeInState } from '../utils/timeUtils';

interface AgentTableProps {
  agents: AgentCardType[];
}

type TableSortKey = 'project' | 'jira' | 'priority' | 'duration';
type SortDir = 'asc' | 'desc';

const PRIORITY_WEIGHT: Record<Priority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

function compareAgents(a: AgentCardType, b: AgentCardType, key: TableSortKey, dir: SortDir): number {
  let cmp = 0;
  switch (key) {
    case 'project':
      cmp = a.projectName.localeCompare(b.projectName);
      break;
    case 'jira':
      cmp = a.jiraKey.localeCompare(b.jiraKey);
      break;
    case 'priority':
      cmp = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
      break;
    case 'duration':
      cmp = new Date(a.agentStatusChanged).getTime() - new Date(b.agentStatusChanged).getTime();
      break;
  }
  return dir === 'asc' ? cmp : -cmp;
}

export function AgentTable({ agents }: AgentTableProps) {
  const [sortKey, setSortKey] = useState<TableSortKey>('duration');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: TableSortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...agents].sort((a, b) => compareAgents(a, b, sortKey, sortDir));

  const columns: { key: TableSortKey; label: string }[] = [
    { key: 'project', label: 'Project' },
    { key: 'jira', label: 'Ticket' },
    { key: 'priority', label: 'Priority' },
    { key: 'duration', label: 'Time in State' },
  ];

  return (
    <div className="agent-table-wrapper">
      <table className="agent-table">
        <thead>
          <tr className="table-header-row">
            {columns.map(({ key, label }) => (
              <th
                key={key}
                className={`table-th${sortKey === key ? ' sorted' : ''}`}
                onClick={() => handleSort(key)}
              >
                {label}
                {sortKey === key && (
                  <span className="sort-arrow">{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((agent) => {
            const urgency = getUrgency(agent.agentStatus);
            const timeStr = formatTimeInState(agent.agentStatusChanged);
            const jiraUrl = `https://amplitude.atlassian.net/browse/${agent.jiraKey}`;

            return (
              <tr
                key={agent.id}
                className={`table-row row-${urgency}`}
              >
                <td className="table-td td-project">
                  <a href={jiraUrl} className="table-project-link" target="_blank" rel="noreferrer">
                    {agent.projectName}
                  </a>
                  <span className="table-summary">{agent.agentSummary}</span>
                </td>

                <td className="table-td td-jira">
                  <a href={jiraUrl} className="table-jira" target="_blank" rel="noreferrer">
                    {agent.jiraKey}
                  </a>
                </td>

                <td className="table-td td-priority">
                  <span className={`priority-badge priority-${agent.priority.toLowerCase()}`}>
                    {agent.priority}
                  </span>
                </td>

                <td className="table-td td-duration">
                  <span className={`time-in-state time-${urgency}`}>{timeStr}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
