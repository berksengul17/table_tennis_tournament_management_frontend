import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

function ProtectedRoute({ children }: PropsWithChildren) {
  const { admin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("admin", admin);

    if (admin === null) {
      navigate("/");
    }
  }, [admin, navigate]);

  return children;
}

export default ProtectedRoute;
