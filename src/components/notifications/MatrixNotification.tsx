// src/components/notifications/MatrixNotification.tsx
import { useState, useEffect } from 'react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationData {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface MatrixNotificationProps {
  notification: NotificationData;
  onRemove: (id: string) => void;
}

const ICON = {
  success: '✅',
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌'
};

const COLOR = {
  success: '#00ff00',
  info: '#00aaff',
  warning: '#ffaa00',
  error: '#ff4444'
};

function MatrixNotification({ notification, onRemove }: MatrixNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  const color = COLOR[notification.type];

  useEffect(() => {
    // Trigger slide-in animation
    const timer = setTimeout(() => setIsVisible(true), 10);

    // Auto-remove after duration
    const duration = notification.duration || 4000;
    const removeTimer = setTimeout(() => {
      handleRemove();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[10000] max-w-sm cursor-pointer transition-transform duration-300 ease-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
      onClick={handleRemove}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        border: `1px solid ${color}`,
        color: color,
        backdropFilter: 'blur(4px)',
        boxShadow: `0 0 20px ${color}40`
      }}
    >
      <div className="p-3 rounded font-mono text-sm">
        <div className="flex items-start gap-2">
          <span className="text-base flex-shrink-0">
            {ICON[notification.type]}
          </span>
          <span className="break-words">
            {notification.message}
          </span>
        </div>
      </div>
    </div>
  );
}

// Notification Container Component
interface MatrixNotificationContainerProps {
  notifications: NotificationData[];
  onRemove: (id: string) => void;
}

export function MatrixNotificationContainer({ notifications, onRemove }: MatrixNotificationContainerProps) {
  return (
    <div className="fixed top-0 right-0 z-[10000] pointer-events-none">
      <div className="flex flex-col gap-2 p-4">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="pointer-events-auto"
            style={{ marginTop: index * 60 }}
          >
            <MatrixNotification
              notification={notification}
              onRemove={onRemove}
            />
          </div>
        ))}
      </div>
    </div>
  );
}