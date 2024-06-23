import { useEffect, useState } from "react";
import {
  categorizeParticipants,
  getCategorizedParticipants,
  getParticipants,
} from "../../api/playerApi";
import { Player } from "../../type";
import Participant from "./components/Participant";
import styles from "./index.module.css";

function ParticipantsPage() {
  const [participants, setParticipants] = useState<Player[]>([]);
  const [categorizedParticipants, setCategorizedParticipants] = useState<{
    [key: string]: Player[];
  }>({});
  const [showCategorized, setShowCategorized] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const categorized = await getCategorizedParticipants();
        if (Object.keys(categorized).length > 0) {
          setCategorizedParticipants(categorized);
          setShowCategorized(true);
        } else {
          const participants = await getParticipants();
          setParticipants(participants);
        }
      } catch (error) {
        console.error("Failed to load participants:", error);
      }
    })();
  }, []);

  const handleCategorize = async () => {
    try {
      const categorized = await categorizeParticipants();
      setCategorizedParticipants(categorized);
      setShowCategorized(true);
    } catch (error) {
      console.error("Failed to categorize participants:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Kaydolan Oyuncular</h1>
      {!showCategorized ? (
        <>
          {participants.map((item) => (
            <Participant key={item.id} item={item} />
          ))}
        </>
      ) : (
        Object.entries(categorizedParticipants).map(([category, players]) => (
          <div key={category}>
            <h2>{category}</h2>
            {players.map((item) => (
              <Participant key={item.id} item={item} />
            ))}
          </div>
        ))
      )}
      <button onClick={handleCategorize}>Yaş Gruplarına Ayır</button>
    </div>
  );
}

export default ParticipantsPage;
