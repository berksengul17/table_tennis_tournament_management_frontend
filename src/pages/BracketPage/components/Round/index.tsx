import { ISeed } from "../../../../type";
import Seed from "../Seed";
import styles from "./index.module.css";

function Round({ title, seeds }: { title: string; seeds: ISeed[] }) {
  return (
    <>
      <h2 style={{ marginBottom: "5rem", fontWeight: "bold" }}>{title}</h2>
      <div className={styles.round}>
        {seeds.map((seed) => (
          <Seed key={seed.id} participants={seed.participants} />
        ))}
      </div>
    </>
  );
}

export default Round;
