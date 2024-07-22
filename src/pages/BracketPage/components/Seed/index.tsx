import { useEffect, useState } from "react";
import { advanceToNextRound } from "../../../../api/bracketApi";
import { useBracket } from "../../../../context/BracketProvider";
import { Participant } from "../../../../type";
import SeedItem from "../SeedItem";
import styles from "./index.module.css";

function Seed({
  participants,
  roundId,
}: {
  participants: Participant[];
  roundId: number;
}) {
  const { brackets, setBrackets, activeBracket } = useBracket();
  const [scores, setScores] = useState<string[]>(["", ""]);

  useEffect(() => {
    (async () => {
      if (scores.length === 2 && !scores.includes("")) {
        const index = scores.findIndex((score) => score === "3");
        const updatedBracket = await advanceToNextRound(
          participants[index].id,
          brackets[activeBracket].id,
          roundId
        );
        console.log("updated bracket", updatedBracket);

        if (index !== -1)
          setBrackets((prevBrackets) => {
            const newBrackets = [...prevBrackets];
            newBrackets[activeBracket] = updatedBracket;
            return newBrackets;
          });
      }
    })();
  }, [scores]);

  return (
    participants && (
      <div className={styles.seed}>
        {participants.map((participant, index) => (
          <SeedItem
            key={participant.id}
            participant={participant}
            scoreIndex={index}
            scores={scores}
            setScores={setScores}
          />
        ))}
      </div>
    )
  );
}

export default Seed;
