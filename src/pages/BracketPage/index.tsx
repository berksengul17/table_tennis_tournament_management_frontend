// import { Bracket, IRoundProps } from "@pawix/react-brackets";
// import { useEffect, useState } from "react";
// import { createWinnersBracket } from "../../api/bracketApi";
// import AgeCategoryTabs from "../../components/AgeCategoryTabs";
// import { Round, Seed, TournamentData } from "../../type";

// function BracketPage() {
//   const [rounds, setRounds] = useState<IRoundProps[]>([]);
//   const [activeTab, setActiveTab] = useState<number>(0);

//   const transformDataToRounds = (data: TournamentData): IRoundProps[] => {
//     return data.rounds.map((round: Round) => ({
//       title: `Round ${round.id}`,
//       seeds: round.seeds.map((seed: Seed) => ({
//         id: seed.id,
//         date: new Date().toDateString(),
//         teams: seed.participants.map((participant) => ({
//           name: `${participant.firstName} ${participant.lastName}`,
//         })),
//       })),
//     }));
//   };

//   useEffect(() => {
//     (async () => {
//       const response = await createWinnersBracket(activeTab);
//       setRounds(transformDataToRounds(response));
//     })();
//   }, [activeTab]);

//   return (
//     <>
//       <AgeCategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
//       <Bracket rounds={rounds} />
//     </>
//   );
// }

// export default BracketPage;

import { useEffect, useState } from "react";
import { createWinnersBracket } from "../../api/bracketApi";
import { IBracket } from "../../type";
import Bracket from "./components/Bracket";

function BracketPage() {
  const [bracket, setBracket] = useState<IBracket>({} as IBracket);

  useEffect(() => {
    (async () => {
      setBracket(await createWinnersBracket(0));
    })();
  }, []);

  useEffect(() => {
    console.log("bracket", bracket);
  }, [bracket]);

  return bracket && <Bracket rounds={bracket.rounds} />;
}

export default BracketPage;
