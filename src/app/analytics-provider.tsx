"use client";

import analytics from "@analytics-compliance/analytics-sdk";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const INGESTION_URL = "http://localhost:3021/analytics/api/v1/ingest";
const CLIENT_ID = "a1b2c3d4-5678-90ab-cdef-1234567890ab";
const CLIENT_NAME = "onlearn-web";
const API_KEY = "e3a15bc1-bd62-42c5-ae9a-d3a9efb6df7f";

export function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    analytics.init({
      client: {
        clientId: CLIENT_ID,
        clientName: CLIENT_NAME,
        apiKey: API_KEY,
      },
      endpoint: INGESTION_URL,
      debug: true,
    });

    analytics.eventSessionStart({
      content: { source: "app-init" },
    });
  }, []);

  useEffect(() => {
    const queryString =
      typeof window !== "undefined" ? window.location.search : "";

    analytics.pageView({
      source: "route-change",
      path: pathname,
      query: queryString,
    });
  }, [pathname]);

  return <>{children}</>;
}
