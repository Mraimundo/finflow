import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { toastEmitter } from "../lib/toast-event";
import type { ToastPayload, ToastType } from "../lib/toast-event";

export interface Toast extends ToastPayload {
  id: number;
  showIcon: boolean;
  timestamp: number;
}

export function useToast() {
  const [notifications, setNotifications] = useState<Toast[]>([]);
  const nextIdRef = useRef(1);

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string, duration?: number) => {
      const id = nextIdRef.current++;
      const timestamp = Date.now();

      const newToast: Toast = {
        id,
        type,
        title,
        message,
        showIcon: true,
        duration,
        timestamp,
      };

      setNotifications((prev) => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    const timerIds: number[] = [];

    notifications.forEach((toast) => {
      if (toast.duration && toast.duration > 0) {
        const timerId = window.setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);

        timerIds.push(timerId);
      }
    });

    return () => {
      timerIds.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [notifications, removeToast]);

  useEffect(() => {
    const unsubscribe = toastEmitter.subscribe((payload: ToastPayload) => {
      addToast(payload.type, payload.title, payload.message, payload.duration);
    });

    return unsubscribe;
  }, [addToast]);

  const toastActions = useMemo(
    () => ({
      success: (title: string, message?: string, duration: number = 3000) =>
        addToast("success", title, message, duration),
      error: (title: string, message?: string, duration: number = 4000) =>
        addToast("error", title, message, duration),
      warning: (title: string, message?: string, duration: number = 4000) =>
        addToast("warning", title, message, duration),
      info: (title: string, message?: string, duration: number = 3500) =>
        addToast("info", title, message, duration),
      loading: (title: string, message?: string) =>
        addToast("loading", title, message, 0),
    }),
    [addToast]
  );

  return {
    notifications,
    removeToast,
    clearAllToasts,
    ...toastActions,
  };
}
