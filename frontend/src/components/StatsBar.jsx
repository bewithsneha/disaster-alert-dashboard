import React from 'react';
import { Activity, AlertTriangle, Flame, CloudRain, Mountain, Wind } from 'lucide-react';

const typeIcons = {
  quake: { icon: Activity, color: 'var(--severity-medium)' },
  wildfire: { icon: Flame, color: '#f97316' },
  weather: { icon: CloudRain, color: 'var(--accent-cyan)' },
  flood: { icon: CloudRain, color: 'var(--accent-blue)' },
  storm: { icon: Wind, color: '#8b5cf6' },
  volcano: { icon: Mountain, color: 'var(--severity-high)' },
};

const StatsBar = ({ alerts, loading }) => {
  if (loading) {
    return (
      <div className="stats-bar">
        {[1, 2, 3, 4].map(i => <div key={i} className="skeleton skeleton-stat" />)}
      </div>
    );
  }

  const highCount = alerts.filter(a => a.severity === 'high').length;
  const typeCounts = {};
  alerts.forEach(a => { typeCounts[a.type] = (typeCounts[a.type] || 0) + 1; });

  const topTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <Activity size={18} color="var(--accent-blue)" />
        <div>
          <div className="stat-value">{alerts.length}</div>
          <div className="stat-label">Active</div>
        </div>
      </div>

      <div className="stat-card">
        <AlertTriangle size={18} color="var(--severity-high)" />
        <div>
          <div className="stat-value">{highCount}</div>
          <div className="stat-label">High</div>
        </div>
      </div>

      {topTypes.map(([type, count]) => {
        const cfg = typeIcons[type] || { icon: Activity, color: 'var(--text-secondary)' };
        const Icon = cfg.icon;
        return (
          <div className="stat-card" key={type}>
            <Icon size={16} color={cfg.color} />
            <div>
              <div className="stat-value">{count}</div>
              <div className="stat-label">{type}</div>
            </div>
          </div>
        );
      })}

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <div className="pulse-dot" />
        Live
      </div>
    </div>
  );
};

export default StatsBar;
