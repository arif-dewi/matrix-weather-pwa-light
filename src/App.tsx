import { MatrixScene } from '@/components/matrix/MatrixScene';
import { WeatherSetup } from '@/components/weather/WeatherSetup';
import { WeatherDisplay } from '@/components/weather/WeatherDisplay';

const App = ()=> (
  <div className="min-h-screen bg-black text-matrix-green font-mono overflow-hidden relative">
    <MatrixScene />
    <WeatherSetup />
    <WeatherDisplay />
  </div>
);

export default App;