import { Participant } from "../../../../type";
import SeedItem from "../SeedItem";
import styles from "./index.module.css";

function Seed({ participants }: { participants: Participant[] }) {
  return (
    participants.length > 1 && (
      <div className={styles.seed}>
        {participants.map((participant) => (
          <SeedItem key={participant.id} participant={participant} />
        ))}
      </div>
    )
  );
}

export default Seed;
