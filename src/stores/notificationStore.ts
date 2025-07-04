// src/stores/notificationStore.ts
import { create } from 'zustand';
import type { NotificationData, NotificationType } from '@/components/notifications/MatrixNotification';
import {NOTIFICATION_CONFIG} from "@/constants/weather";

interface NotificationState {
  notifications: NotificationData[];
  addNotification: (message: string, type: NotificationType, duration?: number) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const RADIX = 36;

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (message: string, type: NotificationType, duration = NOTIFICATION_CONFIG.DURATION.NORMAL) => {
    const notification: NotificationData = {
      id: Date.now().toString() + Math.random().toString(RADIX).substr(2, 9),
      message,
      type,
      duration
    };

    set((state) => ({
      notifications: [...state.notifications, notification]
    }));
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
  }
}));

// Helper hook for easier usage
export function useMatrixNotifications() {
  const { addNotification, removeNotification, clearAllNotifications } = useNotificationStore();

  return {
    showSuccess: (message: string, duration?: number) => addNotification(message, 'success', duration),
    showInfo: (message: string, duration?: number) => addNotification(message, 'info', duration),
    showError: (message: string, duration?: number) => addNotification(message, 'error', duration),
    removeNotification,
    clearAll: clearAllNotifications
  };
}