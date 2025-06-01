"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
} from 'react-icons/fi';

// Toast positions
type ToastPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

// Toast variants
type ToastVariant = 'info' | 'success' | 'error' | 'warning';

// Define the options your toast accepts
interface ToastOptions {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number; // in ms
  variant?: ToastVariant;
  position?: ToastPosition;
}

// Context value exposed by the hook
interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // All toast items
  const [toasts, setToasts] = useState<(
    ToastOptions & { id: string; open: boolean }
  )[]>([]);
  // Current viewport position (last toast's position)
  const [viewportPosition, setViewportPosition] = useState<ToastPosition>('bottom-right');

  const toast = ({
    title,
    description,
    action,
    duration = 2000,
    variant = 'info',
    position = 'bottom-right',
  }: ToastOptions) => {
    const id = uuidv4();
    setToasts((prev) => [
      ...prev,
      { id, title, description, action, duration, variant, position, open: true },
    ]);
    setViewportPosition(position);
  };

  const handleOpenChange = (id: string, open: boolean) => {
    setToasts((prev) =>
      prev
        .map((t) => (t.id === id ? { ...t, open } : t))
        .filter((t) => t.open)
    );
  };

  // Tailwind classes per variant
  const variantStyles: Record<ToastVariant, string> = {
    info: 'bg-white',
    success: 'bg-green-700',
    error: 'bg-red-700',
    warning: 'bg-yellow-700',
  };

  // Icon per variant
  const variantIcons: Record<ToastVariant, React.FC<{ className?: string }>> = {
    info: FiInfo,
    success: FiCheckCircle,
    error: FiXCircle,
    warning: FiAlertTriangle,
  };

  // Map position to Tailwind classes
  const positionClasses: Record<ToastPosition, string> = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      <RadixToast.Provider swipeDirection="right">
        {children}

        {/* Render each toast */}
        {toasts.map(({ id, open, title, description, action, duration, variant }) => {
          const Icon = variantIcons[variant!];
          return (
            <RadixToast.Root
              key={id}
              open={open}
              onOpenChange={(open) => handleOpenChange(id, open)}
              duration={duration}
              className={`
                ${variantStyles[variant!]}
                shadow-lg rounded-lg p-4
                grid grid-cols-[auto,1fr] gap-3 items-start text-white
              `}
            >
              <Icon className="w-5 h-5 mt-1" />

              <div className="space-y-1">
                <RadixToast.Title className="font-semibold dark:text-gray-100">
                  {title}
                </RadixToast.Title>

                {description && (
                  <RadixToast.Description className="dark:text-gray-300 text-sm">
                    {description}
                  </RadixToast.Description>
                )}

                {action && (
                  <RadixToast.Action asChild altText={action.label}>
                    <button onClick={action.onClick} className=" font-medium">
                      {action.label}
                    </button>
                  </RadixToast.Action>
                )}
              </div>
            </RadixToast.Root>
          );
        })}

        {/* Single viewport, dynamic position based on last toast */}
        <RadixToast.Viewport
          className={`
            fixed ${positionClasses[viewportPosition]}
            flex flex-col gap-2 w-80 z-50 outline-none
          `}
        />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};