import { Match as TMatch } from "../../type";
import Match from "../Match";
import styles from "./index.module.css";

function GroupMatch({
  ordinal,
  groupMatches,
}: {
  ordinal: number;
  groupMatches: TMatch[];
}) {
  return (
    <div className={styles.groupMatches}>
      <div className={styles.header}>
        <p>{ordinal}. grup</p>
        <p>{groupMatches[0].table.name}</p>
      </div>
      <div className={styles.card}>
        {groupMatches.map((match) => (
          <Match key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}

export default GroupMatch;
