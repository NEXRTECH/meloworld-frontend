// components/Tabs.tsx
"use client";

import * as React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = RadixTabs.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof RadixTabs.List>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.List>
>(({ className, ...props }, ref) => (
  <RadixTabs.List
    ref={ref}
    className={cn(
      "inline-flex w-full items-center justify-start border-b border-gray-200 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = RadixTabs.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>
>(({ className, ...props }, ref) => (
  <RadixTabs.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-4 py-2 -mb-px",
      "text-sm font-medium",
      "border-b-2 border-transparent",
      "transform duration-200 ease-in-out transition-all",
      "hover:scale-105",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
      "data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:border-primary",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = RadixTabs.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Content>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(({ className, ...props }, ref) => (
  <RadixTabs.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = RadixTabs.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
