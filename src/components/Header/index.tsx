import logo from "../../assets/images/logo1.png";
import styles from "./index.module.css";
import { HeaderLink } from "../HeaderLink";

const Header = () => (
  <nav className={styles.navbar}>
    <div className={styles.logoContainer}>
      <img src={logo} alt="logo" className={styles.logo} />
      <p className={styles.logoText}>AB Sportif ve Organizasyon Hizmetleri</p>
    </div>
    <ul className={styles.navbarLinks}>
      <li>
        <HeaderLink to="/" text="Anasayfaa" />
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

export default Header;
