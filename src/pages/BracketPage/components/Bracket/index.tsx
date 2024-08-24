import { useEffect, useState } from "react";
import { useBracket } from "../../../../context/BracketProvider";
import { IRound } from "../../../../type";
import Round from "../Round";
import styles from "./index.module.css";

function Bracket() {
  const { bracket } = useBracket();
  const [rounds, setRounds] = useState<IRound[]>([]);

  useEffect(() => {
    if (bracket) {
      setRounds(bracket.rounds);
    }
  }, [bracket]);

  return (
    <div className={styles.bracket} id="print">
      {rounds && rounds.map((round) => <Round key={round.id} round={round} />)}
    </div>
  );
}

export default Bracket;
