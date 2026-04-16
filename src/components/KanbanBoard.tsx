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

const PRIORITY_ORDER: Record<string, number> = {
  'Awaiting Permission': 0,
  'Errored': 1,
  'Asking Question': 2,
  'Context Exhausted': 3,
  'Rate Limited': 4,
  'CI Failing': 0,
  'PR Ready for Review': 1,
  'Merge Conflict': 2,
  'PR Feedback Received': 3,
  'Scope Uncertainty': 4,
  'Dependency Blocked': 5,
  'Actively Working': 0,
  'Completed': 0,
  'Idle': 1,
  'Queued': 2,
};

function sortAgents(agents: AgentCardType[], sortKey: SortKey): AgentCardType[] {
  const sorted = [...agents];
  switch (sortKey) {
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
        (PRIORITY_ORDER[a.agentStatus] ?? 99) - (PRIORITY_ORDER[b.agentStatus] ?? 99)
      );
  }
}

const COLUMNS: { urgency: UrgencyLevel; title: string }[] = [
  { urgency: 'blocked', title: 'Blocked' },
  { urgency: 'attention', title: 'Needs Attention' },
  { urgency: 'working', title: 'Working' },
  { urgency: 'done', title: 'Done' },
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
