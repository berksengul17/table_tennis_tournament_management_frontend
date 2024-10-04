import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { getImage } from "../../api/tournamentImgApi";

function Homepage() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string>();

  useEffect(() => {
    (async () => {
      const imageData = await getImage();
      const imageUrl = URL.createObjectURL(imageData);
      console.log("url", imageUrl);

      setImage(imageUrl);
    })();
  }, []);

  return (
    <div className={styles.homepage}>
      <button
        className={styles.registerBtn}
        onClick={() => navigate("/register")}
      >
        Kayıt Ol!
      </button>
      <img
        src={image}
        alt="Afiş"
        style={{
          maxWidth: "80%",
        }}
      />
    </div>
  );
}

export default Homepage;
