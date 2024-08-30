import { useEffect, useState } from "react";
import { advanceToNextRound } from "../../../../api/bracketApi";
import { useBracket } from "../../../../context/BracketProvider";
import { Participant, SeedParticipant } from "../../../../type";
import SeedItem from "../SeedItem";
import styles from "./index.module.css";
import { saveScores } from "../../../../api/seedParticipantApi";

function Seed({
  seedParticipants,
  roundId,
}: {
  seedParticipants: SeedParticipant[];
  roundId: number;
}) {
  const { bracket, setBracket, isFinal } = useBracket();
  const [scores, setScores] = useState<string[]>([]);

  const getParticipant = (pIndex: number): Participant | null => {
    if (seedParticipants) {
      const seedParticipant = seedParticipants.find(
        (sp) => sp.pindex === pIndex
      );

      return seedParticipant ? seedParticipant.participant : null;
    }

    return null;
  };

  useEffect(() => {
    console.log("change 1");

    (async () => {
      if (scores.length === 2 && !scores.includes("")) {
        const index = scores.findIndex((score) => score === "3");
        if (index !== -1) {
          saveScores(seedParticipants[0].seed.id, scores[0], scores[1]);
          if (!isFinal(roundId)) {
            const updatedBracket = await advanceToNextRound(
              seedParticipants[index].participant.id,
              bracket.id,
              roundId
            );

            setBracket(updatedBracket);
          }
        }
      }
    })();
  }, [scores]);

  useEffect(() => {
    const newScores = [
      seedParticipants[0] && seedParticipants[0].score !== null
        ? seedParticipants[0].score.toString()
        : "",
      seedParticipants[1] && seedParticipants[1].score !== null
        ? seedParticipants[1].score.toString()
        : "",
    ];

    // Only update scores if they are different
    if (newScores[0] !== scores[0] || newScores[1] !== scores[1]) {
      setScores(newScores);
    }
  }, [seedParticipants]);

  return (
    <div className={styles.seedContainer}>
      <div className={styles.seed}>
        <SeedItem
          participant={getParticipant(0)}
          scoreIndex={0}
          scores={scores}
          setScores={setScores}
        />
        <div className={styles.line}></div>
        <SeedItem
          participant={getParticipant(1)}
          scoreIndex={1}
          scores={scores}
          setScores={setScores}
        />
      </div>
    </div>
  );
}

export default Seed;
