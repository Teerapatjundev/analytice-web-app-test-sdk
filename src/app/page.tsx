"use client";

import { analytics } from "@analytics-compliance/analytics-sdk";
import { useState } from "react";

type LogItem = {
  id: string;
  message: string;
  at: string;
};

const sampleContents = {
  item: {
    itemId: "f6a1a98b-721a-4d17-a26b-16ed55ded194",
    sku: "SKU-TH-M1-001",
    itemType: "ebook",
    nameTh: "คณิตศาสตร์ ม.1",
    nameEn: "Mathematics M.1",
    itemTitleId: "it_001",
    itemTitleNameTh: "คณิตศาสตร์",
    itemTitleNameEn: "Mathematics",
    itemTypeId: "itype_ebook",
    itemTypeNameTh: "หนังสือ",
    itemTypeNameEn: "Ebook",
    isLicense: "true",
    isNew: "false",
    isSample: "false",
    expiredAt: "2026-03-31T16:59:59.999Z",
  },
  assets: {
    assetId: "e9f5e4b8-8233-4092-956b-dbfe36c04af5",
    nameTh: "วิดีโอสอน จำนวนเต็ม",
    nameEn: "Integer Lesson Video",
    assetTypeNameTh: "Smart PPT",
    assetTypeNameEn: "Smart PPT",
    assetCategoryId: "f64bef8c-a6d2-4b25-b6a2-e3dc00040201",
    assetCategoryNameTh: "สื่อดาวน์โหลด",
    assetCategoryNameEn: "Download Media",
    assetSections: [
      {
        sectionId: "dbff378a-7895-4e08-901b-ce0024e76cb2",
        sectionNameTh: "หน่วยการเรียนรู้ที่ 3 วัสดุและการเกิดเสียง",
        sectionNameEn: "",
      },
      {
        sectionId: "a9b76d2e-aa3f-40af-94e7-a478ec8e729e",
        sectionNameTh: "หน่วยการเรียนรู้ที่ 4 หินและท้องฟ้า",
        sectionNameEn: "",
      },
    ],
    assetLists: [
      {
        listId: "c33b5101-15cf-4ed9-8fe7-b4248c29a0e1",
        listNameTh: "วัสดุ",
        listNameEn: "",
        descNameTh: "วัสดุ (ครูพี่เมย์ ปทิตตา ขำทัพ )",
        descNameEn: "",
        thumbnailPath: "",
        listPath: "https://youtu.be/KZ8TCRHJ-6o",
        timeHour: 0,
        timeMinute: 23,
        timeSecond: 0,
        sectionId: "dbff378a-7895-4e08-901b-ce0024e76cb2",
      },
    ],
  },
  subjectGroup: {
    subjectGroupId: "9d16bb25-2192-4ada-894d-a7b33c418fbf",
    subjectGroupNameTh: "คณิตศาสตร์",
    subjectGroupNameEn: "Mathematics Group",
    subject: {
      subjectId: "e44301f7-217b-4e65-be26-4b894f8a729e",
      subjectNameTh: "คณิตศาสตร์",
      subjectNameEn: "Mathematics",
    },
  },
  gradeLevel: {
    gradeLevelId: "b45a889e-dbb2-4bc8-bde4-fc6f6aa830ef",
    nameTh: "ม.1",
    nameEn: "Grade 7",
  },
  coupon: {
    couponCode: "AKSORN2026",
    code: "AKSORN2026",
    couponStatus: "valid",
    status: "valid",
  },
  teachingPlan: {
    teachingPlanId: "tp_001",
    teachingPlanName: "แผนการสอนบทที่ 1",
  },
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<"authenticated" | "anonymous">("anonymous");
  const [logs, setLogs] = useState<LogItem[]>([]);

  const [userId, setUserId] = useState("demo-user-001");
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("demo@example.com");

  const currentUser = analytics.getUser();
  const currentSession = analytics.getSession();

  function appendLog(message: string): void {
    setLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        message,
        at: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  }

  function handleLogin(): void {
    analytics.setUser({
      userId,
      userType,
      email,
      roles: ["USER"],
      schoolId: "school-demo-01",
      schoolNameTh: "โรงเรียนเดโม",
      provinceTh: "Bangkok",
      provinceEn: "Bangkok",
      districtTh: "คลองเตย",
      districtEn: "Khlong Toei",
      subDistrictTh: "คลองเตย",
      subDistrictEn: "Khlong Toei",
      postalCode: "10110",
    });
    analytics.eventLogin({ content: { method: "form-login-demo" } });
    analytics.eventSessionStart({ content: { source: "manual-login" } });
    setIsLoggedIn(true);
    setAuthMode("authenticated");
    appendLog(`Login as ${userId}`);
  }

  function handleLogout(): void {
    analytics.clearUser();
    analytics.clearSession();
    setIsLoggedIn(false);
    setAuthMode("anonymous");
    appendLog("Logout: user + session cleared");
  }

  function handleAnonymousMode(): void {
    analytics.clearUser();
    setIsLoggedIn(false);
    setAuthMode("anonymous");
    analytics.eventSessionStart({ content: { source: "anonymous-mode" } });
    appendLog("Switched to anonymous mode");
  }

  function fireAllEvents(): void {
    analytics.pageView({ source: "manual-trigger-demo" });
    analytics.eventSearched({ content: { keyword: "mathematics", resultCount: 8 } });
    analytics.eventDownloaded({
      content: { fileId: "pdf-001", fileType: "pdf", fileName: "sample.pdf" },
    });
    analytics.eventClicked({ content: { target: "cta-start", location: "top-nav" } });
    analytics.eventSubmitted({ content: { formName: "contact-form", status: "success" } });
    analytics.eventLogin({ content: { method: "replay-test" } });
    analytics.eventSessionStart({ content: { trigger: "replay-test" } });
    analytics.eventCustom("event.custom_demo", {
      content: { note: "custom event fired", timestamp: new Date().toISOString() },
    });
    appendLog("Fired all SDK events");
  }

  function sendSampleContentsPayload(): void {
    analytics.eventCustom("event.sample_contents_payload", {
      content: sampleContents,
    });
    appendLog("Sent sample contents payload");
  }

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif", maxWidth: 900, margin: "0 auto" }}>
      <h1>Analytics SDK Demo (Next.js + TypeScript)</h1>
      <p>Demo app for login/logout and testing every analytics event.</p>

      <section style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h2>SDK Status</h2>
        <p>Initialized: Yes</p>
        <p>Logged in: {isLoggedIn ? "Yes" : "No"}</p>
        <p>Mode: {authMode}</p>
        <p>Session: {currentSession.sessionId}</p>
        <p>User: {currentUser ? currentUser.userId : "anonymous"}</p>
      </section>

      <section style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h2>Login / Logout / Anonymous</h2>
        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="userId" />
          <input value={userType} onChange={(e) => setUserType(e.target.value)} placeholder="userType" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleAnonymousMode}>Use Anonymous</button>
          <button onClick={handleLogout}>Logout (clear user + session)</button>
        </div>
      </section>

      <section style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h2>Events</h2>
        <p style={{ marginTop: 0 }}>
          pageView is auto-sent on route change from layout provider.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => analytics.eventSearched({ content: { keyword: "science" } })}>eventSearched</button>
          <button onClick={() => analytics.eventDownloaded({ content: { fileId: "pdf-001" } })}>eventDownloaded</button>
          <button onClick={() => analytics.eventClicked({ content: { target: "demo-btn" } })}>eventClicked</button>
          <button onClick={() => analytics.eventSubmitted({ content: { formName: "register" } })}>eventSubmitted</button>
          <button onClick={() => analytics.eventLogin({ content: { method: "manual-button" } })}>eventLogin</button>
          <button onClick={() => analytics.eventSessionStart({ content: { trigger: "manual-button" } })}>
            eventSessionStart
          </button>
          <button onClick={() => analytics.eventCustom("event.custom_button", { content: { from: "button" } })}>
            eventCustom
          </button>
          <button onClick={sendSampleContentsPayload}>Send Sample Contents Payload</button>
          <button onClick={fireAllEvents}>Fire ALL Events</button>
        </div>
      </section>

      <section style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
        <h2>Action Logs</h2>
        {logs.length === 0 ? (
          <p>No logs yet.</p>
        ) : (
          <ul>
            {logs.map((item) => (
              <li key={item.id}>
                [{item.at}] {item.message}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
