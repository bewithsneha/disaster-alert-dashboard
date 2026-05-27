import React from 'react';
import { useTranslation } from 'react-i18next';
import AlertHistoryItem from './AlertHistoryItem';
import SkeletonLoader from './SkeletonLoader';
import { Activity, Inbox } from 'lucide-react';

const Sidebar = ({ alerts, filters, onFilterChange, onAlertClick, loading, collapsed }) => {
  const { t } = useTranslation();

  return (
    <div className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-header">
        <Activity color="var(--accent-blue)" size={26} />
        <h1 className="brand-name" style={{ fontSize: '1.2rem' }}>TerraWatch</h1>
      </div>
      
      <div className="filters-section">
        <div className="filter-group">
          <label>{t('Type')}</label>
          <select 
            className="filter-select"
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
          >
            <option value="all">{t('All Types')}</option>
            <option value="quake">{t('Earthquake')}</option>
            <option value="flood">{t('Flood')}</option>
            <option value="storm">{t('Storm')}</option>
            <option value="wildfire">{t('Wildfire')}</option>
            <option value="weather">{t('Weather')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('Severity')}</label>
          <select 
            className="filter-select"
            value={filters.severity}
            onChange={(e) => onFilterChange('severity', e.target.value)}
          >
            <option value="all">{t('All Severities')}</option>
            <option value="high">{t('High')}</option>
            <option value="medium">{t('Medium')}</option>
            <option value="low">{t('Low')}</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>{t('Country')}</label>
          <input 
            type="text" 
            className="filter-input" 
            placeholder={t('e.g. Japan, USA')}
            value={filters.country}
            onChange={(e) => onFilterChange('country', e.target.value)}
          />
        </div>
      </div>
      
      <div className="history-header">
        <span>{t('Live Feed')} ({alerts.length})</span>
      </div>
      
      <div className="history-section">
        {loading ? (
          <SkeletonLoader count={6} />
        ) : alerts.length > 0 ? (
          alerts.map(alert => (
            <AlertHistoryItem 
              key={alert.id} 
              alert={alert} 
              onClick={() => onAlertClick && onAlertClick(alert)}
            />
          ))
        ) : (
          <div className="empty-state">
            <Inbox size={40} />
            <p>{t('No alerts found.')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
