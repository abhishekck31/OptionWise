"use client";

import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import { Toast as RadixToast } from "radix-ui";
import { cn } from "@/lib/cn";

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "error";
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

/** Mount once near the root. Undo actions, save confirmations, etc. use this rather
 * than a one-off inline banner (SPEC.md "UI / UX": "undo for every destructive
 * action"). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { ...toast, id }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <RadixToast.Root
            key={toast.id}
            duration={5000}
            onOpenChange={(open) => {
              if (!open) dismiss(toast.id);
            }}
            className={cn(
              "toast-root rounded-lg border p-4 shadow-lg",
              toast.variant === "error" ? "border-error/30 bg-error-surface" : "border-ink/10 bg-card",
            )}
          >
            <RadixToast.Title
              className={cn("text-sm font-semibold", toast.variant === "error" ? "text-error-text" : "text-ink")}
            >
              {toast.title}
            </RadixToast.Title>
            {toast.description ? (
              <RadixToast.Description className="mt-1 text-sm text-ink/70">
                {toast.description}
              </RadixToast.Description>
            ) : null}
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 outline-none" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
