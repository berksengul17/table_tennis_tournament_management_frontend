import { useEffect, useState } from "react";
import { useBracket } from "../../../../context/BracketProvider";
import { IRound } from "../../../../type";
import Round from "../Round";
import styles from "./index.module.css";

function Bracket() {
  const { brackets, activeBracket } = useBracket();
  const [rounds, setRounds] = useState<IRound[]>([]);

  useEffect(() => {
    console.log("brackets[activeBracket]", brackets[activeBracket]);
    if (brackets[activeBracket]) {
      console.log("brackets", brackets[activeBracket]);
      setRounds(brackets[activeBracket].rounds);
    }
  }, [brackets, activeBracket]);

  return (
    <div className={styles.bracket}>
      {rounds && rounds.map((round) => <Round key={round.id} round={round} />)}
    </div>
  );
}

export default Bracket;
