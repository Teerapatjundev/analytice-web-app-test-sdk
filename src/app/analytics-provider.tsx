"use client";

import { analytics } from "@aksorn-uat/analyticlog-node-sdk";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const INGESTION_URL =
  "https://uat-analyticlogapi.aksorn.com/analytics/api/v1/ingest";
const CLIENT_ID = "a1b2c3d4-5678-90ab-cdef-1234567890ab";
const API_KEY = "e3a15bc1-bd62-42c5-ae9a-d3a9efb6df7f";

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
        query:
          typeof window !== "undefined" ? window.location.search : "",
      },
    });
  }, [pathname]);

  return <>{children}</>;
}
