import { useRef, useEffect, useState, Fragment } from "react";

const BracketPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [startLineIndex, setStartLineIndex] = useState<number | null>(null);
  const [tempLine, setTempLine] = useState<{ x: number; y: number } | null>(
    null
  );
  const [lines, setLines] = useState<
    Array<{ x1: number; y1: number; x2: number; y2: number }>
  >([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const numOfLines = 12;

  const handleMouseDown = (lineIndex: number, event: React.MouseEvent) => {
    if (svgRef.current) {
      setStartLineIndex(lineIndex);
      setTempLine(null);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (startLineIndex === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTempLine({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (startLineIndex === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate the Y position for the start line and the end line
    const startY = (containerHeight / (numOfLines + 1)) * (startLineIndex + 1);

    // Check if the mouse is released over another line
    for (let i = 0; i < numOfLines; i++) {
      const lineY = (containerHeight / (numOfLines + 1)) * (i + 1);
      if (Math.abs(mouseY - lineY) < 5) {
        setLines((prevLines) => [
          ...prevLines,
          { x1: 150, y1: startY, x2: 150, y2: lineY },
        ]);
        break;
      }
    }

    setStartLineIndex(null);
    setTempLine(null);

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const inputsAndLines = Array.from({ length: numOfLines }, (_, i) => {
    const yPosition = (containerHeight / (numOfLines + 1)) * (i + 1);
    return (
      <Fragment key={i}>
        <input
          type="text"
          placeholder={`Input ${i + 1}`}
          style={{
            position: "absolute",
            top: `${yPosition - 30}px`,
            left: "30px",
            width: "120px",
            zIndex: 2, // Ensure the input is above the SVG
          }}
        />
        <div
          style={{
            position: "absolute",
            top: `${yPosition}px`,
            left: "30px",
            width: "120px",
            height: "5px",
            backgroundColor: "black",
            cursor: "pointer",
            zIndex: 2, // Ensure the line is above the SVG
          }}
          onMouseDown={(event) => handleMouseDown(i, event)}
        />
      </Fragment>
    );
  });

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, [containerRef.current]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ display: "flex", flex: 1 }}>
      <div
        ref={containerRef}
        style={{ position: "relative", flex: "1", overflow: "hidden" }}
      >
        {inputsAndLines}
        <svg
          ref={svgRef}
          width="100%"
          height={containerHeight}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1, // Ensure the SVG is behind the inputs and lines
            pointerEvents: "none", // Allows clicks to pass through the SVG
          }}
        >
          {lines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="blue"
              strokeWidth="2"
            />
          ))}
          {startLineIndex !== null && tempLine && (
            <line
              x1={150} // Start from the right end of the clicked line
              y1={(containerHeight / (numOfLines + 1)) * (startLineIndex + 1)}
              x2={tempLine.x}
              y2={tempLine.y}
              stroke="gray"
              strokeWidth="2"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

export default BracketPage;

// import { useEffect, useRef } from "react";

// const BracketPage = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const drawLines = (ctx: CanvasRenderingContext2D, numOfLines: number) => {
//     for (let i = 0; i < numOfLines; i++) {
//       console.log(i);
//       ctx.beginPath(); // Start a new path
//       ctx.moveTo(30, 20 + 10 * i); // Move the pen to (30, 50)
//       ctx.lineTo(150, 20 + 10 * i); // Draw a line to (150, 100)
//       ctx.stroke(); // Render the path
//     }
//   };

//   useEffect(() => {
//     if (canvasRef.current) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         // Set canvas height based on the number of lines
//         const numOfLines = 12; // Adjust the number of lines as needed
//         const lineHeight = 10;
//         const initialOffset = 20; // Adjust the initial offset as needed
//         canvas.height = initialOffset + lineHeight * numOfLines;
//         console.log("canvas height", canvas.height);

//         drawLines(ctx, 12);
//       }
//     }
//   }, []);

//   return <canvas ref={canvasRef} style={{ width: "100%" }} />;
// };

// export default BracketPage;
// import {
//   Match,
//   SingleEliminationBracket,
//   SVGViewer,
// } from "@g-loot/react-tournament-brackets";
// import { useEffect, useState } from "react";
// import {
//   createWinnersBracket,
//   getNextSeedId,
//   getWinnersBracket,
// } from "../../api/bracketApi";
// import { getSeedParticipants } from "../../api/seedParticipantApi";
// import AgeCategoryTabs from "../../components/AgeCategoryTabs";
// import CategoryTabs from "../../components/CategoryTabs";
// import { BracketProvider, useBracket } from "../../context/BracketProvider";
// import { GLootParticipant, GLootSeed } from "../../type";
// import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
// import Bracket from "./components/Bracket";
// import html2canvas from "html2canvas";

// const BracketPageContent = () => {
//   const { bracket, setBracket } = useBracket();
//   const [matches, setMatches] = useState<GLootSeed[]>([]);
//   const [categoryActiveTab, setCategoryActiveTab] = useState<number>(0);
//   const [ageActiveTab, setAgeActiveTab] = useState<number>(0);

//   useEffect(() => {
//     (async () => {
//       let bracketData = await getWinnersBracket(0, 0); // Use static values
//       if (bracket == null) {
//         bracketData = await createWinnersBracket(0, 0); // Use static values
//       }
//       setBracket(bracketData!);
//     })();
//     console.log("bracket", bracket);
//   }, []);

//   useEffect(() => {
//     (async () => {
//       console.log("getting");

//       let bracketData = await getWinnersBracket(
//         categoryActiveTab,
//         ageActiveTab
//       );

//       if (bracketData === null) {
//         console.log("inside if");

//         bracketData = await createWinnersBracket(
//           categoryActiveTab,
//           ageActiveTab
//         );
//       }
//       console.log("got bracket data", bracketData);

//       setBracket(bracketData!);
//     })();
//   }, [categoryActiveTab, ageActiveTab]);

//   // useEffect(() => {
//   //   setMatches(createMatches());
//   // }, [bracket]);

//   // useEffect(() => {
//   //   console.log("matches", matches);
//   // }, [matches]);

//   // const createMatches = (): GLootSeed[] => {
//   //   const matches: GLootSeed[] = [];
//   //   if (bracket) {
//   //     bracket.rounds?.map((round, index) => {
//   //       round.seeds.map(async (seed) => {
//   //         const seedParticipants = await getSeedParticipants(seed.id);
//   //         const nextRoundSeedIndex = await getNextSeedId(seed.id);
//   //         const p1 = seedParticipants.find((sp) => sp.pindex === 0);
//   //         const p2 = seedParticipants.find((sp) => sp.pindex === 1);
//   //         console.log(bracket.rounds[index + 1].seeds[nextRoundSeedIndex]);

//   //         const match: GLootSeed = {
//   //           id: seed.id,
//   //           name: "Round " + (index + 1),
//   //           nextMatchId:
//   //             index + 1 >= bracket.rounds.length
//   //               ? null
//   //               : bracket.rounds[index + 1].seeds[nextRoundSeedIndex]?.id,
//   //           tournamentRoundText: `${index + 1}`,
//   //           state: "DONE",
//   //           participants: [
//   //             p1 && p1.participant
//   //               ? {
//   //                   id: p1.id,
//   //                   resultText: p1.score ? p1.score.toString() : "",
//   //                   isWinner: p1.score && p1.score === 3 ? true : false,
//   //                   status: "PLAYED",
//   //                   name: `${p1.participant.firstName} ${p1.participant.lastName}`,
//   //                 }
//   //               : ({} as GLootParticipant),
//   //             p2 && p2.participant
//   //               ? {
//   //                   id: p2.id,
//   //                   resultText: p2.score ? p2.score.toString() : "",
//   //                   isWinner: p2.score && p2.score === 3 ? true : false,
//   //                   status: "PLAYED",
//   //                   name: `${p2.participant.firstName} ${p2.participant.lastName}`,
//   //                 }
//   //               : ({} as GLootParticipant),
//   //           ],
//   //         };
//   //         matches.push(match);
//   //       });
//   //     });
//   //   }
//   //   return matches;
//   // };

//   // if (bracket === null) {
//   //   return (
//   //     <div className={styles.noBracket}>
//   //       <img src={noDataImg} />
//   //       <p>Fikstürler henüz oluşturulmadı.</p>;
//   //     </div>
//   //   );
//   // }

//   const handleImageDownload = async () => {
//     const element = document.getElementById("print")!,
//       canvas = await html2canvas(element),
//       data = canvas.toDataURL("image/jpg"),
//       link = document.createElement("a");

//     link.href = data;
//     link.download = "downloaded-image.jpg";

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         paddingBottom: "2rem",
//       }}
//     >
//       <CategoryTabs
//         activeTab={categoryActiveTab}
//         setActiveTab={setCategoryActiveTab}
//       />
//       <AgeCategoryTabs
//         activeTab={ageActiveTab}
//         setActiveTab={setAgeActiveTab}
//       />
//       {/* {matches.length > 0 && (
//         <SingleEliminationBracket
//           matches={matches}
//           matchComponent={Match}
//           svgWrapper={({ children, ...props }: { children: any }) => (
//             <SVGViewer width={500} height={500} {...props}>
//               {children}
//             </SVGViewer>
//           )}
//         />
//       )} */}
//       <button
//         type="button"
//         onClick={handleImageDownload}
//         style={{ marginLeft: "auto", marginRight: "20rem" }}
//       >
//         Ağacı İndir
//       </button>

//       {bracket == null ? <p>Fikstür henüz oluşturulmadı</p> : <Bracket />}
//     </div>
//   );
// };

// const BracketPage = () => (
//   <BracketProvider>
//     <BracketPageContent />
//   </BracketProvider>
// );

// export default BracketPage;
