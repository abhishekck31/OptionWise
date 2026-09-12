"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

export type ToastTone = "success" | "neutral" | "accent";

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  /** Shows a toast. It clears itself after a couple of seconds. */
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DISMISS_AFTER = 2500;

/** The toast is a white card; only the left edge carries the colour. */
const EDGE: Record<ToastTone, string> = {
  success: "#10B981",
  neutral: "#9B9B9B",
  accent: "#CC3D2E",
};

/**
 * Bottom-right notifications, without a library.
 *
 * Each toast owns its own timer so a second one arriving does not cut the
 * first one short, and every timer is cleared on unmount.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (message: string, tone: ToastTone = "accent") => {
      const id = nextId.current++;
      setToasts((current) => [...current.slice(-2), { id, message, tone }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), DISMISS_AFTER)
      );
    },
    [dismiss]
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="print-hide pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-2"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {toasts.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => dismiss(item.id)}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ borderLeftColor: EDGE[item.tone] }}
              className="pointer-events-auto rounded-xl border border-[#E5E0D8] border-l-4 bg-white px-4 py-3 text-sm font-medium text-[#1A1A1A] shadow-lg"
            >
              {item.message}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Shows a toast from anywhere under the provider.
 *
 * Outside one it is a no-op rather than a crash, so a component can be
 * rendered in isolation — a test, a story — without the chrome around it.
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  const fallback = useMemo<ToastContextValue>(() => ({ toast: () => {} }), []);
  return context ?? fallback;
}

export default ToastProvider;
