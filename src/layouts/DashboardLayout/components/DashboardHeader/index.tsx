import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/images/logo.png"; // Adjust the path as necessary
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
      <div className={styles.logoContainer}>
        <img src={logo} alt="logo" className={styles.logo} />
        <p className={styles.logoText}>AB Sportif ve Organizasyon Hizmetleri</p>
      </div>
      <div className={styles.userInfo}>
        <span className={styles.adminName}>{admin!.name}</span>
        <button onClick={handleLogout} className={styles.btn}>
          Çıkış
        </button>
      </div>
    </div>
  );
}

export default DashboardHeader;
