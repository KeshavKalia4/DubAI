import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { StudentLayout } from "./layouts/StudentLayout";
import { LandingPage } from "./pages/LandingPage";
import { StudentHome } from "./pages/student/StudentHome";
import { StudentChat } from "./pages/student/StudentChat";
import { StudentEventDetail } from "./pages/student/StudentEventDetail";
import { Dashboard } from "./pages/Dashboard";
import { Events } from "./pages/Events";
import { EventDetails } from "./pages/EventDetails";
import { Attendees } from "./pages/Attendees";
import { Studio } from "./pages/Studio";
import { ComparativeAnalytics } from "./pages/ComparativeAnalytics";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      {
        index: true,
        element: <StudentHome />,
      },
      {
        path: "chat",
        element: <StudentChat />,
      },
      {
        path: "events/:eventId",
        element: <StudentEventDetail />,
      },
    ],
  },
  {
    path: "/contributor",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "events/:eventId",
        element: <EventDetails />,
      },
      {
        path: "attendees",
        element: <Attendees />,
      },
      {
        path: "studio",
        element: <Studio />,
      },
      {
        path: "analytics/comparative",
        element: <ComparativeAnalytics />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
