import { useState, useCallback } from 'react';
import { FilterBar } from './components/FilterBar';
import type { SortKey, ViewMode } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { AgentTable } from './components/AgentTable';
import { SplitView } from './components/SplitView';
import { mockAgents } from './data/mockAgents';
import type { AgentCard } from './types/agent';
import type { UrgencyLevel } from './types/agent';
import './App.css';

function App() {
  const [agents] = useState<AgentCard[]>(mockAgents);
  const [sort, setSort] = useState<SortKey>('duration');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [visibleColumns, setVisibleColumns] = useState<Record<UrgencyLevel, boolean>>({
    blocked: true,
    attention: true,
    working: true,
    done: true,
  });

  const toggleColumn = useCallback((col: UrgencyLevel) => {
    setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  }, []);

  return (
    <div className="app">
      <FilterBar
        agents={agents}
        sort={sort}
        onSort={setSort}
        viewMode={viewMode}
        onViewMode={setViewMode}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
      />
      {viewMode === 'table' && (
        <AgentTable agents={agents} />
      )}
      {viewMode === 'split' && (
        <SplitView agents={agents} />
      )}
      {(viewMode === 'horizontal' || viewMode === 'vertical') && (
        <KanbanBoard
          agents={agents}
          sort={sort}
          viewMode={viewMode}
          visibleColumns={visibleColumns}
        />
      )}
    </div>
  );
}

export default App;
