import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/pages/HomePage";
import { TroubleshootPage } from "@/pages/TroubleshootPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { KnowledgeBasePage } from "@/pages/KnowledgeBasePage";
import { ChatPage } from "@/pages/ChatPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { CustomAiPage } from "@/pages/CustomAiPage"; 


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
        { path: "chat", element: <ChatPage /> },
        { path: "history", element: <HistoryPage /> },
        { path: "analytics", element: <AnalyticsPage /> },
        { path: "knowledge-base", element: <KnowledgeBasePage /> },
        { path: "custom-ai", element: <CustomAiPage /> },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ],
  {
    basename: "/troubleshoot-assistant",
  }
);