import { MatrixNotification, NotificationData } from './MatrixNotification';

interface MatrixNotificationContainerProps {
  notifications: NotificationData[];
  onRemove: (id: string) => void;
}

export function MatrixNotificationContainer({ notifications, onRemove }: MatrixNotificationContainerProps) {
  return (
    <div className="fixed top-0 right-0 z-[10000] pointer-events-none">
      <div className="flex flex-col gap-3 p-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
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