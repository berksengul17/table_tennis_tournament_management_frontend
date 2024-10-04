import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/images/logo1.png"; // Adjust the path as necessary
import { useAuth } from "../../../../context/AuthProvider";
import styles from "./index.module.css";
import gear from "../../../../assets/images/gear-solid.svg";

function DashboardHeader() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleSettings = () => {
    navigate("/dashboard/settings");
  };

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
        <button onClick={handleSettings} className={styles.settingsBtn}>
          <img src={gear} alt="settings" className={styles.gear} />
        </button>
        <button onClick={handleLogout} className={styles.btn}>
          Çıkış
        </button>
      </div>
    </div>
  );
}

export default DashboardHeader;
