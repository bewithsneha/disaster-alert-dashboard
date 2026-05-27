import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import Sidebar from '../components/Sidebar';
import NotificationQueue from '../components/NotificationQueue';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';
import SearchBar from '../components/SearchBar';
import StatsBar from '../components/StatsBar';
import AlertDetailModal from '../components/AlertDetailModal';

const SOCKET_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000/api/alerts';

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: 'all', severity: 'all', country: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/');
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  // Fetch alerts when filters change
  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL, {
          params: { ...filters, search: searchQuery },
          withCredentials: true
        });
        setAlerts(response.data);
      } catch (error) {
        if (error.response?.status === 401) navigate('/');
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [filters, navigate]);

  // Client-side search filtering
  const filteredAlerts = searchQuery
    ? alerts.filter(a =>
        a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.country?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : alerts;

  // Socket connection (once)
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on('new_alert', (alert) => {
      setAlerts(prev => {
        if (!prev.find(a => a.id === alert.id)) return [alert, ...prev];
        return prev;
      });
      setNotifications(prev => [...prev, alert].slice(-5));
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== alert.id));
      }, 8000);
    });
    return () => socket.disconnect();
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="app-container">
      <Sidebar
        alerts={filteredAlerts}
        filters={filters}
        onFilterChange={handleFilterChange}
        onAlertClick={setSelectedAlert}
        loading={loading}
        collapsed={sidebarCollapsed}
      />

      <button
        className={`sidebar-toggle${sidebarCollapsed ? ' collapsed' : ''}`}
        onClick={() => setSidebarCollapsed(prev => !prev)}
        title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
      >
        {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="map-container">
        <div className="dashboard-header glass-panel">
          <StatsBar alerts={filteredAlerts} loading={loading} />

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('Search alerts...')}
          />

          <div className="header-actions">
            <LanguageSwitcher />
            <ThemeToggle />
            <div className="user-badge">
              <Shield size={14} /> {localStorage.getItem('username')}
            </div>
            <button className="icon-btn" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <MapComponent alerts={filteredAlerts} onAlertClick={setSelectedAlert} />
          <NotificationQueue notifications={notifications} onDismiss={dismissNotification} />
        </div>
      </div>

      {selectedAlert && (
        <AlertDetailModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}
    </div>
  );
};

export default Dashboard;
