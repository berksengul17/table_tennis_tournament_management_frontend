import styles from "./index.module.css";
import { Match as TMatch } from "../../type";
import { useEffect, useState } from "react";
import { saveScores } from "../../api/matchApi";
import { getName } from "../../utils";

const ScoreInput = ({
  score,
  setScore,
}: {
  score: string;
  setScore: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <input
    className={styles.scoreInput}
    type="number"
    min={0}
    max={3}
    value={score}
    onChange={(e) => setScore(e.target.value)}
  />
);

function Match({ match }: { match: TMatch }) {
  const [p1Score, setP1Score] = useState<string>(match.p1Score.toString());
  const [p2Score, setP2Score] = useState<string>(match.p2Score.toString());

  useEffect(() => {
    const p1ScoreNum = Number(p1Score);
    const p2ScoreNum = Number(p2Score);

    // Check if either player has reached the maximum score of 3
    const isMatchOver = p1ScoreNum === 3 || p2ScoreNum === 3;

    if (
      isMatchOver &&
      (p1ScoreNum !== match.p1Score || p2ScoreNum !== match.p2Score)
    ) {
      match.p1Score = p1ScoreNum;
      match.p2Score = p2ScoreNum;

      (async () => {
        await saveScores(match);
      })();
    }
  }, [p1Score, p2Score, match]);

  return (
    <div className={styles.match}>
      <p>
        {match.startTime} - {match.endTime}
      </p>
      {/* TODO: İSİM AŞAĞI KAYINCA İSİM VE INPUT ARASINDA ÇOK FAZLA BOŞLUK OLUYOR */}
      <div className={styles.centerVertically}>
        <div className={styles.centerVertically}>
          {getName(match.p1)}
          <ScoreInput score={p1Score} setScore={setP1Score} />
        </div>
        ―
        <div className={styles.centerVertically}>
          <ScoreInput score={p2Score} setScore={setP2Score} />
          {getName(match.p2)}
        </div>
      </div>
    </div>
  );
}

export default Match;
