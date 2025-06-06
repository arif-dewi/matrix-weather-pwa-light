// src/components/status/ConnectionStatusBadge.tsx
import { useState, useEffect } from 'react';

interface ConnectionStatusBadgeProps {
  className?: string;
}

export function ConnectionStatusBadge({ className = '' }: ConnectionStatusBadgeProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsOnline(true);
        setIsTransitioning(false);
      }, 150);
    };

    const handleOffline = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsOnline(false);
        setIsTransitioning(false);
      }, 150);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusConfig = () => {
    if (isOnline) {
      return {
        icon: '🟢',
        label: 'ONLINE',
        description: 'Live data',
        badgeClass: 'connection-status-badge-online',
        iconClass: 'connection-status-icon-online',
        labelClass: 'connection-status-label-online',
        descriptionClass: 'connection-status-description-online'
      };
    } else {
      return {
        icon: '🔴',
        label: 'OFFLINE',
        description: 'Cached data',
        badgeClass: 'connection-status-badge-offline',
        iconClass: 'connection-status-icon-offline',
        labelClass: 'connection-status-label-offline',
        descriptionClass: 'connection-status-description-offline'
      };
    }
  };

  const config = getStatusConfig();

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
