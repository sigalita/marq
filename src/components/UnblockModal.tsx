import { useState } from 'react';
import type { AgentCard } from '../types/agent';
import { getUrgency } from '../types/agent';

interface UnblockModalProps {
  agent: AgentCard;
  onClose: () => void;
  onSubmit: (agentId: string, response: string) => void;
}

export function UnblockModal({ agent, onClose, onSubmit }: UnblockModalProps) {
  const [response, setResponse] = useState('');
  const urgency = getUrgency(agent.agentStatus);

  const handleSubmit = () => {
    onSubmit(agent.id, response);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <h2 className="modal-project">{agent.projectName}</h2>
            <button className="modal-close" onClick={onClose}>&#10005;</button>
          </div>
          <div className="modal-badges">
            <span className={`status-badge badge-${urgency}`}>
              <span className="badge-dot" />
              {agent.agentStatus}
            </span>
            <span className="modal-jira">{agent.jiraKey}</span>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h4 className="modal-label">Agent Summary</h4>
            <p className="modal-text">{agent.agentSummary}</p>
          </div>

          <div className="modal-section">
            <h4 className="modal-label">Blocking Detail</h4>
            <div className="modal-detail">
              {agent.blockingDetail.split('\n').map((line, i) => {
                if (line === '```') return null;
                if (line.startsWith('```')) return <div key={i} className="code-block-label">{line.replace('```', '')}</div>;
                if (line.startsWith('##')) return <h5 key={i} className="detail-heading">{line.replace(/^#+\s/, '')}</h5>;
                if (line.startsWith('- ')) return <li key={i}>{line.slice(2)}</li>;
                if (line.startsWith('**')) return <p key={i} className="detail-bold"><strong>{line.replace(/\*\*/g, '')}</strong></p>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="detail-line">{line}</p>;
              })}
            </div>
          </div>

          <div className="modal-links">
            {agent.claudeThreadLink && (
              <a href={agent.claudeThreadLink} className="modal-link-btn" target="_blank" rel="noreferrer">
                Open Thread
              </a>
            )}
            {agent.prLink && (
              <a href={agent.prLink} className="modal-link-btn" target="_blank" rel="noreferrer">
                Open PR
              </a>
            )}
          </div>

          <div className="modal-response">
            <h4 className="modal-label">Your Response</h4>
            <textarea
              className="response-textarea"
              placeholder="Type your instructions or response..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className={`submit-btn submit-${urgency}`} onClick={handleSubmit}>
            {agent.unblockAction}
          </button>
        </div>
      </div>
    </div>
  );
}
