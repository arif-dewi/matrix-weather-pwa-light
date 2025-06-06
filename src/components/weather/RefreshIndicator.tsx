import {useMemo} from "react";
import {formatDistanceToNow} from "date-fns";

interface RefreshIndicatorProps {
  isRefetching: boolean;
  lastUpdate: Date | null;
}

export function RefreshIndicator({ isRefetching, lastUpdate }: RefreshIndicatorProps) {
  const timeAgo = useMemo(() => {
    if (!lastUpdate) return null;
    try {
      return formatDistanceToNow(lastUpdate, { addSuffix: true });
    } catch {
      return null;
    }
  }, [lastUpdate]);

  if (!timeAgo && !isRefetching) return null;

  return (
    <div className="weather-refresh-indicator mt-4 px-4">
      <div className="flex items-center justify-center gap-2 text-xs opacity-60">
        {isRefetching && (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
            <span>Updating...</span>
          </>
        )}
        {!isRefetching && timeAgo && (
          <span>Updated {timeAgo}</span>
        )}
      </div>
    </div>
  );
}
