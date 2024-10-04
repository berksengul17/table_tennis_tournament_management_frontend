import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { AgeCategoryProvider } from "./context/AgeCategoryProvider.tsx";
import { AuthProvider } from "./context/AuthProvider";
import "./index.css";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLoginPage from "./pages/AdminLoginPage";
import BracketPage from "./pages/BracketPage/index.tsx";
import GroupsPage from "./pages/GroupsPage/index.tsx";
import Homepage from "./pages/Homepage/index.tsx";
import ManageParticipantsPage from "./pages/ManageParticipantsPage/index.tsx";
import NotFoundPage from "./pages/NotFoundPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import RegisterPage from "./pages/RegisterPage/index.tsx";
import SettingsPage from "./pages/SettingsPage/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "participants",
        element: <ParticipantsPage />,
      },
      {
        path: "groups",
        element: <GroupsPage />,
      },
      {
        path: "bracket",
        element: <BracketPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <AdminLoginPage />,
      },
      {
        path: "manage-participants",
        element: (
          <ProtectedRoute>
            <ManageParticipantsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // {
  //   path: "/dashboard",
  //   element: <AdminLoginPage />,
  // },
  // {
  //   path: "/dashboard/manage-participants",
  //   element: (
  //     <ProtectedRoute>
  //       <ParticipantsPage />
  //     </ProtectedRoute>
  //   ),
  // },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AgeCategoryProvider>
      <RouterProvider router={router} />
    </AgeCategoryProvider>
  </AuthProvider>
);
