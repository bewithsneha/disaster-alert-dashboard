import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, Clock, X } from 'lucide-react';

const NotificationQueue = ({ notifications, onDismiss }) => {
  return (
    <div className="notification-queue">
      <AnimatePresence>
        {notifications.slice(0, 3).map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 120, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 120, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            style={{
              background: 'var(--panel-bg-solid)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-color)',
              borderLeft: `4px solid var(--severity-${notif.severity})`,
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              width: '340px',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => onDismiss(notif.id)}
            whileHover={{ scale: 1.02 }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onDismiss(notif.id); }}
              style={{
                position: 'absolute', top: '8px', right: '8px',
                background: 'none', border: 'none', color: 'var(--text-secondary)',
                cursor: 'pointer', padding: '2px', display: 'flex', borderRadius: '50%',
              }}
            >
              <X size={14} />
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                backgroundColor: `var(--severity-${notif.severity})`,
                padding: '8px', borderRadius: '50%', flexShrink: 0,
                boxShadow: `0 0 12px var(--severity-${notif.severity})`,
              }}>
                <AlertTriangle size={18} color="white" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.9rem', fontWeight: '600', marginBottom: '6px',
                  color: 'var(--text-heading)', lineHeight: 1.3,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {notif.title}
                </div>

                <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {notif.country || 'Unknown'}
                  </span>
                  <span style={{
                    background: 'var(--accent-blue-glow)', color: 'var(--accent-blue)',
                    padding: '1px 8px', borderRadius: '8px', textTransform: 'capitalize',
                    fontSize: '0.72rem', fontWeight: 500,
                  }}>
                    {notif.type}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationQueue;
