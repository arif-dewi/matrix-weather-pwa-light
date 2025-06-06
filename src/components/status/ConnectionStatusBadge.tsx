// src/components/status/ConnectionStatusBadge.tsx
import { useState, useEffect } from 'react';
import { getStatusConfig } from './helper';

interface ConnectionStatusBadgeProps {
  className?: string;
}

const CHANGE_STATUS_DELAY = 150; // ms

export function ConnectionStatusBadge({ className = '' }: ConnectionStatusBadgeProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const changeStatus = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsOnline(navigator.onLine);
        setIsTransitioning(false);
      }, CHANGE_STATUS_DELAY);
    }

    window.addEventListener('online', changeStatus);
    window.addEventListener('offline', changeStatus);

    return () => {
      window.removeEventListener('online', changeStatus);
      window.removeEventListener('offline', changeStatus);
    };
  }, []);

  const config = getStatusConfig(isOnline);

  return (
    <div
      className={`fixed top-4 right-4 z-40 ${className}`}
      style={{
        transform: 'translateY(0)',
        transition: 'transform 0.3s ease-out'
      }}
    >
      <div className={`connection-status-badge ${config.badgeClass} ${isTransitioning ? 'transitioning' : ''}`}>
        <div className={`connection-status-icon ${config.iconClass}`}>
          {config.icon}
        </div>
        <div className="connection-status-text">
          <div className={`connection-status-label ${config.labelClass}`}>
            {config.label}
          </div>
          <div className={`connection-status-description ${config.descriptionClass}`}>
            {config.description}
          </div>
        </div>
      </div>
    </div>
  );
}
