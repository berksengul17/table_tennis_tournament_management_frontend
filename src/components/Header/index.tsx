import { useState } from "react";
import logo from "../../assets/images/logo1.png";
import styles from "./index.module.css";
import { HeaderLink } from "../HeaderLink";
import bars from "../../assets/images/bars-solid.svg";
import close from "../../assets/images/xmark-solid.svg";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.headerContainer}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="logo" className={styles.logo} />
          <p className={styles.logoText}>
            AB Sportif ve Organizasyon Hizmetleri
          </p>
        </div>
        <div className={styles.hamburger} onClick={toggleDrawer}>
          {drawerOpen ? (
            <img src={close} style={{ width: "15px" }} />
          ) : (
            <img src={bars} style={{ width: "15px" }} />
          )}
        </div>
      </div>
      <ul className={`${styles.navbarLinks} ${drawerOpen ? styles.open : ""}`}>
        <li>
          <HeaderLink to="/" text="Anasayfa" />
        </li>
        <li>
          <HeaderLink to="/register" text="Kayıt" />
        </li>
        <li>
          <HeaderLink to="/participants" text="Katılımcılar" />
        </li>
        <li>
          <HeaderLink to="/groups" text="Gruplar" />
        </li>
        <li>
          <HeaderLink to="/bracket" text="Fikstür" />
        </li>
      </ul>
    </nav>
  );
};

export default Header;
