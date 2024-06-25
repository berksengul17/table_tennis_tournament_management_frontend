import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import "./index.css";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLoginPage from "./pages/AdminLoginPage";
import Homepage from "./pages/Homepage/index.tsx";
import ManageParticipantsPage from "./pages/ManageParticipantsPage/index.tsx";
import NotFoundPage from "./pages/NotFoundPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import RegisterPage from "./pages/RegisterPage/index.tsx";

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
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
