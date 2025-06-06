export const LoadingFallback = ()=> {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center">
      <div className="bg-black/90 border-2 border-green-500 rounded-xl p-8 text-center backdrop-blur-sm">
        <div className="text-xl font-bold mb-4 tracking-wider animate-pulse">
          INITIALIZING MATRIX...
        </div>
        <div className="text-sm opacity-70">
          Loading weather systems
        </div>
      </div>
    </div>
  );
}
