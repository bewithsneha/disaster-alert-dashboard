import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock } from 'lucide-react';

const timeAgo = (dateStr) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const highlightText = (text, query) => {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <span key={i} className="highlight-match">{part}</span>
      : part
  );
};

const AlertHistoryItem = ({ alert, onClick, searchQuery }) => {
  const { t } = useTranslation();
  const date = new Date(alert.timestamp);
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`alert-item severity-${alert.severity}`} onClick={onClick}>
      <div className="alert-title">
        {searchQuery ? highlightText(alert.title, searchQuery) : alert.title}
      </div>
      
      <div className="alert-meta" style={{ marginBottom: '6px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={13} /> {alert.country}
        </span>
        <span className="alert-type">
          {t(alert.type.charAt(0).toUpperCase() + alert.type.slice(1))}
        </span>
      </div>
      
      <div className="alert-meta">
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={13} /> {timeString}
          <span className="relative-time">· {timeAgo(alert.timestamp)}</span>
        </span>
        <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>
          {t(alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1))}
        </span>
      </div>
    </div>
  );
};

export default AlertHistoryItem;
