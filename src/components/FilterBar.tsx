import { useState, useRef, useEffect } from 'react';
import type { AgentCard as AgentCardType, UrgencyLevel } from '../types/agent';
import { getUrgency } from '../types/agent';

export type FilterValue = 'all' | UrgencyLevel;
export type SortKey = 'az' | 'newest' | 'duration' | 'priority';
export type ViewMode = 'horizontal' | 'vertical' | 'table' | 'split';

interface FilterBarProps {
  agents: AgentCardType[];
  sort: SortKey;
  onSort: (value: SortKey) => void;
  viewMode: ViewMode;
  onViewMode: (mode: ViewMode) => void;
  visibleColumns: Record<UrgencyLevel, boolean>;
  onToggleColumn: (col: UrgencyLevel) => void;
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'duration', label: 'Duration' },
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A-Z' },
  { value: 'priority', label: 'Priority' },
];

const COLUMN_OPTIONS: { value: UrgencyLevel; label: string }[] = [
  { value: 'blocked', label: 'Blocked' },
  { value: 'attention', label: 'Needs Attention' },
  { value: 'working', label: 'Working' },
  { value: 'done', label: 'Done' },
];

export function FilterBar({
  agents,
  sort, onSort,
  viewMode, onViewMode,
  visibleColumns, onToggleColumn,
}: FilterBarProps) {
  const [colDropdownOpen, setColDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setColDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const visibleCount = Object.values(visibleColumns).filter(Boolean).length;
  const blocked = agents.filter((a) => getUrgency(a.agentStatus) === 'blocked').length;
  const attention = agents.filter((a) => getUrgency(a.agentStatus) === 'attention').length;
  const working = agents.filter((a) => getUrgency(a.agentStatus) === 'working').length;
  const done = agents.filter((a) => getUrgency(a.agentStatus) === 'done').length;

  return (
    <header className="unified-bar">
      {/* Left: brand + stats */}
      <div className="bar-left">
        <div className="topbar-brand">
          <span className="topbar-logo">MARQ</span>
          <span className="topbar-subtitle">Agent Dashboard</span>
        </div>
        <div className="bar-divider" />
        <div className="bar-stats">
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
      </div>

      {/* Right: sort + view + columns */}
      <div className="bar-right">
        <div className="bar-controls">
          {/* Sort */}
          <div className="control-group">
            <span className="control-label">Sort</span>
            <select
              className="control-select"
              value={sort}
              onChange={(e) => onSort(e.target.value as SortKey)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* View toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn${viewMode === 'horizontal' ? ' active' : ''}`}
              onClick={() => onViewMode('horizontal')}
              title="Columns"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="2" width="3.5" height="12" rx="1" fill="currentColor"/>
                <rect x="6.25" y="2" width="3.5" height="12" rx="1" fill="currentColor" opacity="0.5"/>
                <rect x="11.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" opacity="0.3"/>
              </svg>
            </button>
            <button
              className={`view-btn${viewMode === 'vertical' ? ' active' : ''}`}
              onClick={() => onViewMode('vertical')}
              title="Rows"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="14" height="3.5" rx="1" fill="currentColor"/>
                <rect x="1" y="6.25" width="14" height="3.5" rx="1" fill="currentColor" opacity="0.5"/>
                <rect x="1" y="11.5" width="14" height="3.5" rx="1" fill="currentColor" opacity="0.3"/>
              </svg>
            </button>
            <button
              className={`view-btn${viewMode === 'table' ? ' active' : ''}`}
              onClick={() => onViewMode('table')}
              title="Table"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="14" height="2" rx="0.5" fill="currentColor"/>
                <rect x="1" y="4.5" width="6" height="1.5" rx="0.5" fill="currentColor" opacity="0.5"/>
                <rect x="8.5" y="4.5" width="6.5" height="1.5" rx="0.5" fill="currentColor" opacity="0.3"/>
                <rect x="1" y="7.5" width="6" height="1.5" rx="0.5" fill="currentColor" opacity="0.5"/>
                <rect x="8.5" y="7.5" width="6.5" height="1.5" rx="0.5" fill="currentColor" opacity="0.3"/>
                <rect x="1" y="10.5" width="6" height="1.5" rx="0.5" fill="currentColor" opacity="0.5"/>
                <rect x="8.5" y="10.5" width="6.5" height="1.5" rx="0.5" fill="currentColor" opacity="0.3"/>
                <rect x="1" y="13.5" width="6" height="1.5" rx="0.5" fill="currentColor" opacity="0.5"/>
                <rect x="8.5" y="13.5" width="6.5" height="1.5" rx="0.5" fill="currentColor" opacity="0.3"/>
              </svg>
            </button>
            <button
              className={`view-btn${viewMode === 'split' ? ' active' : ''}`}
              onClick={() => onViewMode('split')}
              title="Split"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="14" height="6.5" rx="1" fill="currentColor"/>
                <rect x="1" y="9" width="14" height="6" rx="1" fill="currentColor" opacity="0.4"/>
              </svg>
            </button>
          </div>

          {/* Column visibility */}
          <div className="column-dropdown-wrapper" ref={dropdownRef}>
            <button
              className="control-btn"
              onClick={() => setColDropdownOpen(!colDropdownOpen)}
            >
              Columns
              <span className="control-badge">{visibleCount}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ marginLeft: 2 }}>
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {colDropdownOpen && (
              <div className="column-dropdown">
                {COLUMN_OPTIONS.map(({ value, label }) => (
                  <label key={value} className="column-checkbox">
                    <input
                      type="checkbox"
                      checked={visibleColumns[value]}
                      onChange={() => onToggleColumn(value)}
                    />
                    <span className={`checkbox-dot dot-${value}`} />
                    {label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
