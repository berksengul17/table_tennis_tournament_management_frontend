import { useEffect, useState } from "react";
import { getParticipants } from "../../api/playerApi";
import Participant from "../../components/Participant";
import { Player } from "../../type";
import styles from "./index.module.css";

function ParticipantsPage() {
  const [participants, setParticipants] = useState<Player[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setParticipants(await getParticipants());
      } catch (error) {
        console.error("Failed to load participants:", error);
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Katılımcılar</h1>
      <>
        <span style={{ marginBottom: "2rem" }}>
          Toplam katılımcı sayısı: {participants.length}
        </span>
        {participants.map((item) => (
          <Participant key={item.id} item={item} />
        ))}
      </>
    </div>
  );
}

export default ParticipantsPage;
