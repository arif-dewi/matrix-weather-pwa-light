// src/hooks/useWeatherSetupForm.ts
import { useState, useCallback } from 'react';

export interface SetupFormState {
  showSetup: boolean;
  showManualLocation: boolean;
  cityName: string;
  latitude: string;
  longitude: string;
  isInitializing: boolean;
}

const INITIAL_FORM_STATE: SetupFormState = {
  showSetup: false,
  showManualLocation: false,
  cityName: '',
  latitude: '',
  longitude: '',
  isInitializing: false,
};

export const useWeatherSetupForm = () => {
  const [formState, setFormState] = useState<SetupFormState>(INITIAL_FORM_STATE);

  const updateFormState = useCallback((updates: Partial<SetupFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    formState,
    updateFormState,
    resetForm: () => setFormState(INITIAL_FORM_STATE),
  };
};
