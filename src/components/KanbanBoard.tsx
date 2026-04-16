import type { AgentCard as AgentCardType, UrgencyLevel } from '../types/agent';
import { getUrgency } from '../types/agent';
import type { SortKey, ViewMode } from './FilterBar';
import { AgentCard } from './AgentCard';

interface KanbanBoardProps {
  agents: AgentCardType[];
  sort: SortKey;
  viewMode: ViewMode;
  visibleColumns: Record<UrgencyLevel, boolean>;
}

const URGENCY_WEIGHT: Record<UrgencyLevel, number> = {
  blocked: 0,
  attention: 1,
  stale: 2,
  running: 3,
  completed: 4,
};

function sortAgents(agents: AgentCardType[], sortKey: SortKey): AgentCardType[] {
  const sorted = [...agents];
  switch (sortKey) {
    case 'status':
      return sorted.sort((a, b) => {
        const cmp = URGENCY_WEIGHT[getUrgency(a.agentStatus)] - URGENCY_WEIGHT[getUrgency(b.agentStatus)];
        if (cmp !== 0) return cmp;
        return new Date(a.agentStatusChanged).getTime() - new Date(b.agentStatusChanged).getTime();
      });
    case 'duration':
      return sorted.sort((a, b) =>
        new Date(a.agentStatusChanged).getTime() - new Date(b.agentStatusChanged).getTime()
      );
    case 'newest':
      return sorted.sort((a, b) =>
        new Date(b.agentStatusChanged).getTime() - new Date(a.agentStatusChanged).getTime()
      );
    case 'az':
      return sorted.sort((a, b) => a.projectName.localeCompare(b.projectName));
    case 'priority':
      return sorted.sort((a, b) =>
        (URGENCY_WEIGHT[getUrgency(a.agentStatus)] ?? 99) - (URGENCY_WEIGHT[getUrgency(b.agentStatus)] ?? 99)
      );
  }
}

const COLUMNS: { urgency: UrgencyLevel; title: string }[] = [
  { urgency: 'blocked', title: 'Blocked' },
  { urgency: 'attention', title: 'Needs Attention' },
  { urgency: 'stale', title: 'Stale' },
  { urgency: 'running', title: 'Running' },
  { urgency: 'completed', title: 'Completed' },
];

export function KanbanBoard({ agents, sort, viewMode, visibleColumns }: KanbanBoardProps) {
  const visibleCols = COLUMNS.filter(({ urgency }) => visibleColumns[urgency]);

  return (
    <div className={`kanban-board view-${viewMode}`}>
      {visibleCols.map(({ urgency, title }) => {
        const columnAgents = agents.filter((a) => getUrgency(a.agentStatus) === urgency);
        const sorted = sortAgents(columnAgents, sort);
        return (
          <div key={urgency} className={`kanban-column column-${urgency}`}>
            <div className="column-header">
              <span className={`column-dot dot-${urgency}`} />
              <h2 className="column-title">{title}</h2>
              <span className={`column-count count-${urgency}`}>{columnAgents.length}</span>
            </div>
            <div className="column-cards">
              {sorted.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
