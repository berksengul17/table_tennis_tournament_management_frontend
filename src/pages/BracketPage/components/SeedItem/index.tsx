import React, { useState } from "react";
import { Participant } from "../../../../type";
import styles from "./index.module.css";

function SeedItem({ participant }: { participant: Participant }) {
  const [score, setScore] = useState<string>("");

  const onScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // change any non-digit character to empty string
    setScore(e.target.value.replace(/\D/g, ""));
  };
  return (
    <div className={styles.seedItem}>
      <span>
        {participant.firstName} {participant.lastName}
      </span>
      <input
        type="text"
        size={1}
        maxLength={1}
        value={score}
        onChange={onScoreChange}
      />
    </div>
  );
}

export default SeedItem;
