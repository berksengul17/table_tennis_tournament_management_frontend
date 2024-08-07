import { NavLink } from "react-router-dom";
import styles from "./index.module.css";

export const HeaderLink = ({ to, text }: { to: string; text: string }) => {
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
