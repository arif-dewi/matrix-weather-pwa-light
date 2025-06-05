import { useEffect } from 'react';
import { MatrixScene } from '@/components/matrix/MatrixScene';
import { WeatherSetup } from '@/components/weather/WeatherSetup';
import { WeatherDisplay } from '@/components/weather/WeatherDisplay';
import { useWeatherStore } from '@/stores/weatherStore';

function App() {
  const { isSetupVisible } = useWeatherStore();

  return (
    <div className="min-h-screen bg-black text-matrix-green font-mono overflow-hidden relative">
      <MatrixScene />
      <WeatherSetup />
      <WeatherDisplay />
    </div>
  );
}

export default App;