import { useEffect, useState } from "react";
import {
  distributeToTables,
  getCategorizedParticipants,
  getParticipants,
} from "../../api/playerApi";
import Participant from "../../components/Participant";
import { useAuth } from "../../context/AuthProvider";
import { Player } from "../../type";
import styles from "./index.module.css";

const convertIntToAgeCategory = (intCategory: number) => {
  switch (intCategory) {
    case 0:
      return "40-49";
    case 1:
      return "50-59";
    case 2:
      return "60-69";
    case 3:
      return "70+";
  }
};

function ManageParticipantsPage() {
  const { admin } = useAuth();
  const [participants, setParticipants] = useState<Player[]>([]);
  const [distributedParticipants, setDistributedParticipants] = useState<
    { table: Player[]; ageCategory: string }[]
  >([]);
  const [showDistributed, setShowDistributed] = useState(false);
  const [totalTables, setTotalTables] = useState(12); // Default number of tables

  useEffect(() => {
    (async () => {
      try {
        const categorized = await getCategorizedParticipants();
        if (Object.keys(categorized).length > 0) {
          const distributed = await distributeToTables(totalTables);
          setDistributedParticipants(
            flattenDistributedParticipants(distributed)
          );
          setShowDistributed(true);
        } else {
          const participants = await getParticipants();
          setParticipants(participants);
        }
      } catch (error) {
        console.error("Failed to load participants:", error);
      }
    })();
  }, [totalTables]);

  const handleDistribute = async () => {
    try {
      const distributed = await distributeToTables(totalTables);
      setDistributedParticipants(flattenDistributedParticipants(distributed));
      setShowDistributed(true);
    } catch (error) {
      console.error("Failed to distribute participants:", error);
    }
  };

  const flattenDistributedParticipants = (distributed: {
    [key: string]: Player[][];
  }) => {
    return Object.entries(distributed).flatMap(([ageCategory, tables]) =>
      tables.map((table) => ({ ageCategory, table }))
    );
  };

  return (
    <div className={styles.container}>
      <h1>Katılımcılar</h1>
      {!showDistributed ? (
        <>
          <span style={{ marginBottom: "2rem" }}>
            Toplam katılımcı sayısı: {participants.length}
          </span>
          {participants.map((item) => (
            <Participant key={item.id} item={item} />
          ))}
        </>
      ) : (
        <div className={styles.grid}>
          {distributedParticipants.map(({ ageCategory, table }, index) => (
            <div key={index} className={styles.table}>
              <h3>
                Masa {index + 1} ({convertIntToAgeCategory(Number(ageCategory))}
                )
              </h3>
              {table.map((participant) => (
                <div key={participant.id} style={{ marginBottom: "0.5rem" }}>
                  {participant.firstName} {participant.lastName}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <label>
          Toplam Masa Sayısı:
          <input
            type="number"
            value={totalTables}
            onChange={(e) => setTotalTables(Number(e.target.value))}
            min="1"
          />
        </label>
        <button onClick={handleDistribute} style={{ marginLeft: "1rem" }}>
          Yaş Gruplarına Ayır
        </button>
      </div>
    </div>
  );
}

export default ManageParticipantsPage;
