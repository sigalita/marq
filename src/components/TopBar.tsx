import type { AgentCard } from '../types/agent';
import { getUrgency } from '../types/agent';

interface TopBarProps {
  agents: AgentCard[];
}

export function TopBar({ agents }: TopBarProps) {
  const blocked = agents.filter((a) => getUrgency(a.agentStatus) === 'blocked').length;
  const attention = agents.filter((a) => getUrgency(a.agentStatus) === 'attention').length;
  const working = agents.filter((a) => getUrgency(a.agentStatus) === 'working').length;
  const done = agents.filter((a) => getUrgency(a.agentStatus) === 'done').length;

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-logo">MARQ</span>
        <span className="topbar-subtitle">Agent Dashboard</span>
      </div>
      <div className="topbar-stats">
        {blocked > 0 && (
          <span className="stat stat-blocked">
            <span className="stat-dot dot-blocked" />
            {blocked} Blocked
          </span>
        )}
        {attention > 0 && (
          <span className="stat stat-attention">
            <span className="stat-dot dot-attention" />
            {attention} Need Attention
          </span>
        )}
        {working > 0 && (
          <span className="stat stat-working">
            <span className="stat-dot dot-working" />
            {working} Working
          </span>
        )}
        {done > 0 && (
          <span className="stat stat-done">
            <span className="stat-dot dot-done" />
            {done} Completed
          </span>
        )}
      </div>
    </header>
  );
}
