import {
  Match,
  SingleEliminationBracket,
  SVGViewer,
} from "@g-loot/react-tournament-brackets";
import { useEffect, useState } from "react";
import {
  createWinnersBracket,
  getNextSeedId,
  getWinnersBracket,
} from "../../api/bracketApi";
import { getSeedParticipants } from "../../api/seedParticipantApi";
import AgeCategoryTabs from "../../components/AgeCategoryTabs";
import CategoryTabs from "../../components/CategoryTabs";
import { BracketProvider, useBracket } from "../../context/BracketProvider";
import { GLootParticipant, GLootSeed } from "../../type";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Bracket from "./components/Bracket";
import html2canvas from "html2canvas";

const BracketPageContent = () => {
  const { bracket, setBracket } = useBracket();
  const [matches, setMatches] = useState<GLootSeed[]>([]);
  const [categoryActiveTab, setCategoryActiveTab] = useState<number>(0);
  const [ageActiveTab, setAgeActiveTab] = useState<number>(0);

  useEffect(() => {
    console.log("useEffect with static values triggered");

    (async () => {
      let bracketData = await getWinnersBracket(0, 0); // Use static values
      if (bracket == null) {
        bracketData = await createWinnersBracket(0, 0); // Use static values
      }
      setBracket(bracketData!);
    })();
    console.log("bracket", bracket);
  }, []);

  useEffect(() => {
    (async () => {
      console.log("getting");

      let bracketData = await getWinnersBracket(
        categoryActiveTab,
        ageActiveTab
      );

      if (bracketData === null) {
        console.log("inside if");

        bracketData = await createWinnersBracket(
          categoryActiveTab,
          ageActiveTab
        );
      }

      setBracket(bracketData!);
      console.log("bracket", bracketData);
    })();
  }, [categoryActiveTab, ageActiveTab]);

  // useEffect(() => {
  //   setMatches(createMatches());
  // }, [bracket]);

  // useEffect(() => {
  //   console.log("matches", matches);
  // }, [matches]);

  // const createMatches = (): GLootSeed[] => {
  //   const matches: GLootSeed[] = [];
  //   if (bracket) {
  //     bracket.rounds?.map((round, index) => {
  //       round.seeds.map(async (seed) => {
  //         const seedParticipants = await getSeedParticipants(seed.id);
  //         const nextRoundSeedIndex = await getNextSeedId(seed.id);
  //         const p1 = seedParticipants.find((sp) => sp.pindex === 0);
  //         const p2 = seedParticipants.find((sp) => sp.pindex === 1);
  //         console.log(bracket.rounds[index + 1].seeds[nextRoundSeedIndex]);

  //         const match: GLootSeed = {
  //           id: seed.id,
  //           name: "Round " + (index + 1),
  //           nextMatchId:
  //             index + 1 >= bracket.rounds.length
  //               ? null
  //               : bracket.rounds[index + 1].seeds[nextRoundSeedIndex]?.id,
  //           tournamentRoundText: `${index + 1}`,
  //           state: "DONE",
  //           participants: [
  //             p1 && p1.participant
  //               ? {
  //                   id: p1.id,
  //                   resultText: p1.score ? p1.score.toString() : "",
  //                   isWinner: p1.score && p1.score === 3 ? true : false,
  //                   status: "PLAYED",
  //                   name: `${p1.participant.firstName} ${p1.participant.lastName}`,
  //                 }
  //               : ({} as GLootParticipant),
  //             p2 && p2.participant
  //               ? {
  //                   id: p2.id,
  //                   resultText: p2.score ? p2.score.toString() : "",
  //                   isWinner: p2.score && p2.score === 3 ? true : false,
  //                   status: "PLAYED",
  //                   name: `${p2.participant.firstName} ${p2.participant.lastName}`,
  //                 }
  //               : ({} as GLootParticipant),
  //           ],
  //         };
  //         matches.push(match);
  //       });
  //     });
  //   }
  //   return matches;
  // };

  // if (bracket === null) {
  //   return (
  //     <div className={styles.noBracket}>
  //       <img src={noDataImg} />
  //       <p>Fikstürler henüz oluşturulmadı.</p>;
  //     </div>
  //   );
  // }

  const handleImageDownload = async () => {
    const element = document.getElementById("print")!,
      canvas = await html2canvas(element),
      data = canvas.toDataURL("image/jpg"),
      link = document.createElement("a");

    link.href = data;
    link.download = "downloaded-image.jpg";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        paddingBottom: "2rem",
      }}
    >
      <CategoryTabs
        activeTab={categoryActiveTab}
        setActiveTab={setCategoryActiveTab}
      />
      <AgeCategoryTabs
        activeTab={ageActiveTab}
        setActiveTab={setAgeActiveTab}
      />
      {/* {matches.length > 0 && (
        <SingleEliminationBracket
          matches={matches}
          matchComponent={Match}
          svgWrapper={({ children, ...props }: { children: any }) => (
            <SVGViewer width={500} height={500} {...props}>
              {children}
            </SVGViewer>
          )}
        />
      )} */}
      <button
        type="button"
        onClick={handleImageDownload}
        style={{ marginLeft: "auto", marginRight: "20rem" }}
      >
        Ağacı İndir
      </button>
      <TransformWrapper panning={{ excluded: ["input"] }}>
        <TransformComponent
          wrapperStyle={{ border: "1px solid black", marginTop: "2rem" }}
        >
          {bracket == null ? <p>Fikstür henüz oluşturulmadı</p> : <Bracket />}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

const BracketPage = () => (
  <BracketProvider>
    <BracketPageContent />
  </BracketProvider>
);

export default BracketPage;
