import { NavLink } from "react-router-dom";
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
  <nav>
    <ul className={styles.navbar}>
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
