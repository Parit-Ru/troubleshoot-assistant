import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/pages/HomePage";
import { TroubleshootPage } from "@/pages/TroubleshootPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { KnowledgeBasePage } from "@/pages/KnowledgeBasePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

/**
 * Full route table per the approved Frontend Technical Specification (§2).
 * Login/Register render standalone (no sidebar). Every other route is a
 * child of AppShell, so they all share the Sidebar + Navbar automatically.
 * No auth guard yet — added once Zustand + auth state exist (Phase 2/6).
 */
export const router = createBrowserRouter(
  [
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    {
      path: "/",
      element: <AppShell />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "troubleshoot", element: <TroubleshootPage /> },
        { path: "troubleshoot/:sessionId", element: <TroubleshootPage /> },
        { path: "history", element: <HistoryPage /> },
        { path: "analytics", element: <AnalyticsPage /> },
        { path: "knowledge-base", element: <KnowledgeBasePage /> },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ],
  {
    basename: "/troubleshoot-assistant",
  }
);