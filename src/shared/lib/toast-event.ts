export type ToastType = "success" | "error" | "info" | "warning" | "loading";

export interface ToastPayload {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

type ToastListener = (payload: ToastPayload) => void;

class ToastEventEmitter {
  private listeners: Set<ToastListener> = new Set();

  emit(payload: ToastPayload): void {
    this.listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (error) {
        console.error("Error in toast listener:", error);
      }
    });
  }

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  unsubscribe(listener: ToastListener): void {
    this.listeners.delete(listener);
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const toastEmitter = new ToastEventEmitter();
