export const ErrorFallback = ({ error }: { error: unknown }) => (  <div className="min-h-screen bg-black text-red-500 font-mono flex items-center justify-center p-8">
    <div className="bg-black/90 border-2 border-red-500 rounded-xl p-8 text-center max-w-md">
      <div className="text-2xl font-bold mb-4">⚠️ FATAL ERROR</div>
      <div className="text-red-400 mb-4">Failed to initialize Matrix Weather</div>
      <div className="text-sm text-red-300 mb-6 font-mono bg-red-900/20 p-3 rounded">
        {error instanceof Error ? error.message : 'Unknown error'}
      </div>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-800 border border-red-500 text-red-100 px-6 py-2 rounded hover:bg-red-700 transition-colors"
      >
        🔄 RELOAD
      </button>
    </div>
  </div>
)