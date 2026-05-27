import React, { useState } from 'react';
import { X, MapPin, Clock, Copy, Check, ExternalLink } from 'lucide-react';

const timeAgo = (dateStr) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const AlertDetailModal = ({ alert, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!alert) return null;

  const date = new Date(alert.timestamp);
  const coords = `${alert.lat?.toFixed(4)}, ${alert.lng?.toFixed(4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(coords);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{alert.title}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-badges">
          <span className="modal-badge type">{alert.type}</span>
          <span className={`modal-badge severity-${alert.severity}`}>
            {alert.severity} severity
          </span>
        </div>

        <div className="modal-details">
          <div className="modal-detail-row">
            <MapPin size={16} />
            <span className="modal-detail-label">Location</span>
            <span>{alert.country || 'Unknown'}</span>
          </div>

          <div className="modal-detail-row">
            <ExternalLink size={16} />
            <span className="modal-detail-label">Coords</span>
            <span>{coords}</span>
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>

          <div className="modal-detail-row">
            <Clock size={16} />
            <span className="modal-detail-label">Time</span>
            <span>
              {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              <span className="relative-time" style={{ marginLeft: '8px' }}>({timeAgo(alert.timestamp)})</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailModal;
