import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import styles from "./index.module.css";

const HeaderLink = ({ to, text }: { to: string; text: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive, isPending }) =>
        [
          isPending ? styles.pending : isActive ? styles.active : "",
          styles.link,
        ].join(" ")
      }
    >
      {text}
    </NavLink>
  );
};

const Header = () => (
  <nav className={styles.navbar}>
    <div className={styles.logoContainer}>
      <img src={logo} alt="logo" className={styles.logo} />
      <p className={styles.logoText}>AB Sportif ve Organizasyon Hizmetleri</p>
    </div>
    <ul className={styles.navbarLinks}>
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
    </ul>
  </nav>
);

export default Header;
