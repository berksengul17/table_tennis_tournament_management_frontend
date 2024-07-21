import { IRound } from "../../../../type";
import Round from "../Round";

function Bracket({ rounds }: { rounds: IRound[] }) {
  if (!rounds) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "5rem" }}>
      {rounds &&
        rounds.map((round, index) => (
          <Round
            key={round.id}
            title={`Round ${index + 1}`}
            seeds={round.seeds}
          />
        ))}
    </div>
  );
}

export default Bracket;
