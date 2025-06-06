// src/App.tsx
import { MatrixScene } from '@/components/matrix/MatrixScene';
import { WeatherSetup } from '@/components/weather/WeatherSetup';
import { WeatherDisplay } from '@/components/weather/WeatherDisplay';
import { MatrixNotificationContainer } from '@/components/notifications/MatrixNotification';
import { ConnectionStatusBadge } from '@/components/status/ConnectionStatusBadge.tsx';
import { useNotificationStore } from '@/stores/notificationStore';

const App = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="min-h-screen bg-black text-matrix-green font-mono overflow-hidden relative">
      <MatrixScene />
      <WeatherSetup />
      <WeatherDisplay />
      <ConnectionStatusBadge />

      <MatrixNotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

export default App;