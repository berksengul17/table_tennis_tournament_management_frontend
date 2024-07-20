import { Bracket, IRoundProps } from "@pawix/react-brackets";
import { useEffect, useState } from "react";
import { createWinnersBracket } from "../../api/bracketApi";
import { Player } from "../../type";

interface Seed {
  id: number;
  participants: Player[];
}

interface Round {
  id: number;
  seeds: Seed[];
}

export interface TournamentData {
  id: number;
  rounds: Round[];
}

function BracketPage() {
  const [rounds, setRounds] = useState<IRoundProps[]>([]);

  const transformDataToRounds = (data: TournamentData): IRoundProps[] => {
    return data.rounds.map((round) => ({
      title: `Round ${round.id}`,
      seeds: round.seeds.map((seed) => ({
        id: seed.id,
        date: new Date().toDateString(),
        teams: seed.participants.map((participant) => ({
          name: `${participant.firstName} ${participant.lastName}`,
        })),
      })),
    }));
  };

  useEffect(() => {
    (async () => {
      const response = await createWinnersBracket(0);
      console.log("bracket", response);
      setRounds(transformDataToRounds(response));
    })();
  }, []);

  return <Bracket rounds={rounds} />;
}

export default BracketPage;

// const rounds: IRoundProps[] = [
//   {
//     title: "Round one",
//     seeds: [
//       {
//         id: 1,
//         date: new Date().toDateString(),
//         teams: [{ name: "Team A" }, { name: "Team B" }],
//       },
//       {
//         id: 2,
//         date: new Date().toDateString(),
//         teams: [{ name: "Team C" }],
//       },
//     ],
//   },
//   {
//     title: "",
//     seeds: [
//       {
//         id: 3,
//         date: new Date().toDateString(),
//         teams: [{ name: "Team A" }],
//       },
//     ],
//   },
// ];

// function BracketPage() {
//   return <Bracket rounds={rounds} />;
// }

// export default BracketPage;
