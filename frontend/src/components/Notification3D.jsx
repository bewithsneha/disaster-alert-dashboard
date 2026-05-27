import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Notification3D = ({ notification, onClose }) => {
  const { t } = useTranslation();
  
  if (!notification) return null;

  const date = new Date(notification.timestamp);
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = date.toLocaleDateString();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100, rotateX: 45, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, rotateX: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, rotateX: -45, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(30, 30, 30, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderLeft: `4px solid var(--severity-${notification.severity})`,
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          zIndex: 1000,
          width: '350px',
          perspective: '1000px',
          cursor: 'pointer'
        }}
        onClick={onClose}
        whileHover={{ scale: 1.05, rotateY: -5 }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
          <div style={{ 
            backgroundColor: `var(--severity-${notification.severity})`, 
            padding: '10px', 
            borderRadius: '50%',
            boxShadow: `0 0 15px var(--severity-${notification.severity})`
          }}>
            <AlertTriangle size={24} color="white" />
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '8px', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {notification.title}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="var(--accent-blue)" />
                <span>{notification.country}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="var(--severity-medium)" />
                <span>{t('Occurred at')} {timeString} on {dateString}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  padding: '2px 8px', 
                  borderRadius: '10px', 
                  fontSize: '0.75rem',
                  textTransform: 'uppercase'
                }}>
                  {t(notification.type.charAt(0).toUpperCase() + notification.type.slice(1))}
                </span>
                <span style={{ 
                  color: `var(--severity-${notification.severity})`, 
                  fontWeight: 'bold', 
                  fontSize: '0.75rem',
                  textTransform: 'uppercase'
                }}>
                  {t(notification.severity.charAt(0).toUpperCase() + notification.severity.slice(1))} {t('Severity')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification3D;
