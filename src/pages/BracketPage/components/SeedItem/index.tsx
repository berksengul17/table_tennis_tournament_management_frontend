import React from "react";
import { Participant } from "../../../../type";
import styles from "./index.module.css";

type SeedItemProps = {
  participant: Participant;
  scoreIndex: number;
  scores: string[];
  setScores: React.Dispatch<React.SetStateAction<string[]>>;
};

function SeedItem({
  participant,
  scoreIndex,
  scores,
  setScores,
}: SeedItemProps) {
  const onScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // change any non-digit character to empty string
    setScores((prevScores) => {
      prevScores[scoreIndex] = e.target.value.replace(/\D/g, "");
      return [...prevScores];
    });
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
        value={scores[scoreIndex]}
        onChange={onScoreChange}
      />
    </div>
  );
}

export default SeedItem;
