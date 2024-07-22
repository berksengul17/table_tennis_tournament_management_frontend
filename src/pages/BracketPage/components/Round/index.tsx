import { IRound } from "../../../../type";
import Seed from "../Seed";
import styles from "./index.module.css";

function Round({ round }: { round: IRound }) {
  return (
    <div className={styles.round}>
      {round.seeds.map((seed) => (
        <Seed
          key={seed.id}
          participants={seed.participants}
          roundId={round.id}
        />
      ))}
    </div>
  );
}

export default Round;
