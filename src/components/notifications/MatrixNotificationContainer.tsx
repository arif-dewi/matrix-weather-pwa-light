import { MatrixNotification } from './MatrixNotification';
import { useNotificationStore } from "@/stores/notificationStore";

export function MatrixNotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-0 right-0 z-[10000] pointer-events-none">
      <div className="flex flex-col gap-3 p-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <MatrixNotification
              notification={notification}
              onRemove={removeNotification}
            />
          </div>
        ))}
      </div>
    </div>
  );
}