import { Bracket, IRoundProps } from "@pawix/react-brackets";

const rounds: IRoundProps[] = [
  {
    title: "Round one",
    seeds: [
      {
        id: 1,
        date: new Date().toDateString(),
        teams: [{ name: "Team A" }, { name: "Team B" }],
      },
      {
        id: 2,
        date: new Date().toDateString(),
        teams: [{ name: "Team C" }],
      },
    ],
  },
  {
    title: "",
    seeds: [
      {
        id: 3,
        date: new Date().toDateString(),
        teams: [{ name: "Team A" }],
      },
    ],
  },
];

function BracketPage() {
  return <Bracket rounds={rounds} />;
}

export default BracketPage;
