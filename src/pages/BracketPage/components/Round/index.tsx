import { useEffect, useState } from "react";
import { getSeedParticipants } from "../../../../api/seedParticipantApi";
import { IRound, SeedParticipant } from "../../../../type";
import Seed from "../Seed";
import styles from "./index.module.css";

function Round({ round }: { round: IRound }) {
  const [seedParticipantsBySeedId, setSeedParticipantsBySeedId] = useState<{
    [key: number]: SeedParticipant[];
  }>({});

  useEffect(() => {
    const fetchParticipants = async () => {
      const seedParticipantsData: { [key: number]: SeedParticipant[] } = {};
      for (const seed of round.seeds) {
        const seedParticipants = await getSeedParticipants(seed.id);
        seedParticipantsData[seed.id] = seedParticipants;
      }

      setSeedParticipantsBySeedId(seedParticipantsData);
    };

    fetchParticipants();
  }, [round.seeds]);

  return (
    <div className={styles.round}>
      {round.seeds.map((seed) => (
        <Seed
          key={seed.id}
          seedParticipants={seedParticipantsBySeedId[seed.id] || []}
          roundId={round.id}
        />
      ))}
    </div>
  );
}

export default Round;
