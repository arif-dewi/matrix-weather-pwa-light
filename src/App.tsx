// src/App.tsx
import { Suspense } from 'react';
import { QueryProvider } from '@/providers/QueryProvider';
import { MatrixScene } from '@/components/matrix/MatrixScene';
import { WeatherSetup } from '@/components/weather/WeatherSetup';
import { WeatherDisplay } from '@/components/weather/WeatherDisplay';
import { MatrixNotificationContainer } from '@/components/notifications/MatrixNotificationContainer';
import { ConnectionStatusBadge } from '@/components/status/ConnectionStatusBadge';
import { useNotificationStore } from '@/stores/notificationStore';
import { LoadingFallback } from '@/components/shared/LoadingFallback';

const App = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <QueryProvider>
      <Suspense fallback={<LoadingFallback />}>
        <div className="min-h-screen bg-black text-green-500 font-mono overflow-hidden relative">
          <MatrixScene />
          <WeatherSetup />
          <WeatherDisplay />
          <ConnectionStatusBadge />

          <MatrixNotificationContainer
            notifications={notifications}
            onRemove={removeNotification}
          />
        </div>
      </Suspense>
    </QueryProvider>
  );
};

export default App;