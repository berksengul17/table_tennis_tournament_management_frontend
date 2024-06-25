import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthProvider";
import styles from "./index.module.css";

function DashboardHeader() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/dashboard");
  };

  return (
    <div className={styles.container}>
      {admin!.name}
      <button onClick={handleLogout} className={styles.btn}>
        Çıkış
      </button>
    </div>
  );
}

export default DashboardHeader;
