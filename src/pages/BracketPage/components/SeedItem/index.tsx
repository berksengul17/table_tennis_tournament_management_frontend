import React, { useEffect, useState } from "react";
import { Participant } from "../../../../type";
import styles from "./index.module.css";
import { getName } from "../../../../utils";

type SeedItemProps = {
  participant: Participant | null;
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
  const [name, setName] = useState<string>("");
  const onScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // change any non-digit character to empty string
    setScores((prevScores) => {
      prevScores[scoreIndex] = e.target.value.replace(/\D/g, "");
      return [...prevScores];
    });
  };

  useEffect(() => {
    if (participant !== null) setName(getName(participant));
    else setName("");
  }, [participant]);

  useEffect(() => {});

  return (
    <div className={styles.seedItem}>
      {/* {!participant ? null : ( */}
      <>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        {/* <span>
            {participant.firstName} {participant.lastName}
          </span> */}
        <input
          type="text"
          size={1}
          maxLength={1}
          value={scores[scoreIndex]}
          onChange={onScoreChange}
        />
      </>
      {/* )} */}
    </div>
  );
}

export default SeedItem;
