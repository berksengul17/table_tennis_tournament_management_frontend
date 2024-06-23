import { useEffect, useState } from "react";
import { getParticipants } from "../../api/playerApi";
import { Player } from "../../type";
import Participant from "./components/Participant";
import styles from "./index.module.css";

function ParticipantsPage() {
  const [registeredList, setRegisteredList] = useState<Player[]>([]);

  useEffect(() => {
    (async () => {
      const participants = await getParticipants();
      setRegisteredList(participants);
    })();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Kaydolan Oyuncular</h1>
      {registeredList.map((item) => (
        <Participant key={item.id} item={item} />
      ))}
      <button>Yaş Gruplarına Ayır</button>
    </div>
  );
}

export default ParticipantsPage;
