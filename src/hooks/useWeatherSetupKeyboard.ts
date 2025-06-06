// src/hooks/useWeatherSetupKeyboard.ts
import { useEffect } from 'react';

export const useWeatherSetupKeyboard = (
  showSetup: boolean,
  updateFormState: (updates: any) => void,
  handleFetchWeather: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showSetup) return;

      if (event.key === 'Enter') {
        event.preventDefault();
        handleFetchWeather();
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        updateFormState({ showSetup: false });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSetup, updateFormState, handleFetchWeather]);
};
