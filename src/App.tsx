// src/App.tsx
import { Suspense } from 'react';
import { QueryProvider } from '@/providers/QueryProvider';
import { WeatherSetup } from '@/components/weather/WeatherSetup';
import { WeatherDisplay } from '@/components/weather/WeatherDisplay';
import { MatrixNotificationContainer } from '@/components/notifications/MatrixNotificationContainer';
import { ConnectionStatusBadge } from '@/components/status/ConnectionStatusBadge';
import { LoadingFallback } from '@/components/shared/LoadingFallback';
import { MatrixScene } from "@/components/matrix/MatrixScene.tsx";

const App = () => {
  return (
    <QueryProvider>
      <Suspense fallback={<LoadingFallback />}>
        <div className="min-h-screen bg-black text-green-500 font-mono overflow-hidden relative">
          <MatrixScene />
          <WeatherSetup />
          <WeatherDisplay />
          <ConnectionStatusBadge />

          <MatrixNotificationContainer />
        </div>
      </Suspense>
    </QueryProvider>
  );
};

export default App;