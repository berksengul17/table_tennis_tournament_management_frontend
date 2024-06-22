import { Link } from "react-router-dom";
import styles from "./index.module.css";

function NotFound() {
  return (
    <div className={styles.container}>
      <span style={{ marginBottom: "2rem" }}>404 Not Found</span>
      <Link to="/">Home</Link>
    </div>
  );
}

export default NotFound;
