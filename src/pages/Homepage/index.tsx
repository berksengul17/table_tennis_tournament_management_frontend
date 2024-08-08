import { useNavigate } from "react-router-dom";
import img from "../../assets/images/afiş.png";
import styles from "./index.module.css";

function Homepage() {
  const navigate = useNavigate();

  return (
    <div className={styles.homepage}>
      <button
        className={styles.registerBtn}
        onClick={() => navigate("/register")}
      >
        Kayıt Ol!
      </button>
      <img
        src={img}
        alt="Afiş"
        style={{
          maxWidth: "80%",
        }}
      />
    </div>
  );
}

export default Homepage;
