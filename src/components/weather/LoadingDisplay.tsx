export function LoadingDisplay() {
  return (
    <div className="loading-display">
      <div className="loading-card">
        <div className="loading-title">WEATHER MATRIX</div>
        <div className="loading-text">Initializing...</div>
        <div className="loading-text">LOADING DATA STREAM</div>
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
        </div>
      </div>
    </div>
  );
}
