"use client";

import { analytics } from "@aksorn-uat/analyticlog-node-sdk";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const INGESTION_URL =
  "https://uat-analyticlogapi.aksorn.com/analytics/api/v1/ingest";
const CLIENT_ID = "eb8dc547-9b11-45da-9208-8912512c198a";
const API_KEY = "0FefzFIGyti38U0RE3hKWs3rwV5kh7PPsSrueYQk";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    analytics.init({
      client: {
        clientId: CLIENT_ID,
        apiKey: API_KEY,
      },
      ingestionUrl: INGESTION_URL,
      debug: true,
    });

    void analytics.sessionStart({
      contents: { source: "app-init" },
    });
  }, []);

  useEffect(() => {
    void analytics.pageView({
      contents: {
        source: "route-change",
        path: pathname,
        query: typeof window !== "undefined" ? window.location.search : "",
      },
    });
  }, [pathname]);

  return <>{children}</>;
}
