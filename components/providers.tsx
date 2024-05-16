"use client";

import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import PlausibleProvider from "next-plausible";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PlausibleProvider
      domain={"geschenkidee.io"}
      trackOutboundLinks
      trackLocalhost
      taggedEvents
      scriptProps={{
        src: "/stats/js/script.js",
        // @ts-ignore
        "data-api": "/stats/api/event",
      }}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </PlausibleProvider>
  );
}
