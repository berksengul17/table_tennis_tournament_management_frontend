import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import RegisteredList from "./components/RegisteredList";
import "./index.css";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RegisterForm />,
    errorElement: <NotFound />,
  },
  {
    path: "/registered-list",
    element: <RegisteredList />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
