import { useEffect, useState } from "react";
import { advanceToNextRound } from "../../../../api/bracketApi";
import { useBracket } from "../../../../context/BracketProvider";
import { Participant, SeedParticipant } from "../../../../type";
import SeedItem from "../SeedItem";
import styles from "./index.module.css";

function Seed({
  seedParticipants,
  roundId,
}: {
  seedParticipants: SeedParticipant[];
  roundId: number;
}) {
  const { bracket, setBracket, isFinal } = useBracket();
  const [scores, setScores] = useState<string[]>([
    seedParticipants[0] ? seedParticipants[0].score.toString() : "",
    seedParticipants[1] ? seedParticipants[1].score.toString() : "",
  ]);

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
    (async () => {
      if (scores.length === 2 && !scores.includes("")) {
        const index = scores.findIndex((score) => score === "3");
        if (!isFinal(roundId)) {
          const updatedBracket = await advanceToNextRound(
            seedParticipants[index].participant.id,
            bracket.id,
            roundId
          );

          if (index !== -1) setBracket(updatedBracket);
        }
      }
    })();
  }, [scores]);

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

// .seedContainer:nth-child(odd)::after,
// .seedContainer:nth-child(even)::after {
//   content: "";
//   position: absolute;
//   flex-grow: 1;
//   /* width: 50px;
//   height: calc(5.5rem + 2px); */
//   border-right: 1px solid black;
//   left: calc(100% + 25px);
//   transform: translateX(-50%);
// }

// .seedContainer:nth-child(odd)::before {
//   content: "";
//   position: absolute;
//   width: calc(10rem - 50px);
//   height: 1px;
//   border-bottom: 1px solid black;
//   left: calc(100% + calc(10rem - 50px) + 15px);
//   bottom: calc(0% - 30px - 0.5px);
//   transform: translateX(-50%);
// }

// .seedContainer:nth-child(odd)::after {
//   border-top: 1px solid black;
//   top: 50%;
// }

// .seedContainer:nth-child(even)::after {
//   border-bottom: 1px solid black;
//   /* TODO BAŞKA BİR ÇÖZÜM BUL */
//   bottom: calc(50% - 0.2px);
// }
