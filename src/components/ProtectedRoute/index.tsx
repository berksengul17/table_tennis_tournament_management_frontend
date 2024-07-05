import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

function ProtectedRoute({ children }: PropsWithChildren) {
  const { admin, isAdminDashboard, setAdminDashboard } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (admin === null) {
      navigate("/");
    } else {
      setAdminDashboard(true);
    }

    return () => setAdminDashboard(false);
  }, [admin, isAdminDashboard, navigate]);

  return children;
}

export default ProtectedRoute;
