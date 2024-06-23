import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import NotFoundPage from "./pages/NotFoundPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import RegisterPage from "./pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RegisterPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/participants",
    element: <ParticipantsPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
