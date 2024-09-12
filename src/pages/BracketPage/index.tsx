// TODO: lines array ini koordinatlara göre sırala
// yoksa rastgele sırada birleştirince bozuluyor
// TODO: final maçı çizgisine tıklanabilir bir şekilde
// buna nasıl bir kontrol yaparım bilmiyorum
import jsPDF from "jspdf";
import { Fragment, useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { getAgeCategory } from "../../api/ageCategoryApi";
import {
  connectSeeds,
  createLosersBracket,
  createWinnersBracket,
  getLosersBracket,
  getWinnersBracket,
  refreshBracket,
} from "../../api/bracketApi";
import {
  getSeedParticipants,
  saveParticipantName,
  saveScores,
} from "../../api/seedParticipantApi";
import AgeCategoryTabs from "../../components/AgeCategoryTabs";
import BracketTabs from "../../components/BracketTabs";
import CategoryTabs from "../../components/CategoryTabs";
import { setOpenAsFont } from "../../set-font";
import { IBracket, RoundSeedResponse } from "../../type";
import { getName } from "../../utils";
import styles from "./index.module.css";

type Line = {
  roundId?: number;
  seedId?: number;
  prevSeedId?: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type Coordinate = { x: number; y: number };

type BracketPos = { row: number; column: number };

const LINE_WIDTH = 150;

function greatestSmallerPowerOf2(num: number) {
  let power = 1;

  // Keep multiplying by 2 until it exceeds the number
  while (power * 2 <= num) {
    power *= 2;
  }

  return power;
}

function splitBracket(bracket: IBracket) {
  const firstBracket: IBracket = {
    id: bracket.id,
    bracketType: bracket.bracketType,
    ageCategory: bracket.ageCategory,
    rounds: [],
  };

  const secondBracket: IBracket = {
    id: bracket.id,
    bracketType: bracket.bracketType,
    ageCategory: bracket.ageCategory,
    rounds: [],
  };

  for (const round of bracket.rounds) {
    const halfwayPoint = Math.ceil(round.seeds.length / 2);
    const firstHalf = round.seeds.slice(0, halfwayPoint);
    const secondHalf = round.seeds.slice(halfwayPoint);

    // Exit if secondHalf is empty
    if (secondHalf.length === 0) {
      break; // Exits the function, stopping further processing
    }

    firstBracket.rounds.push({
      id: round.id,
      seeds: firstHalf,
    });

    secondBracket.rounds.push({
      id: round.id,
      seeds: secondHalf,
    });
  }

  return { firstBracket, secondBracket };
}

async function drawBracket(
  pdf: jsPDF,
  pdfBracketLines: Line[][],
  page: number
) {
  pdf.setPage(page);
}

const LineDiv = ({
  pos,
  line,
  pIndex,
  isBye,
  isHorizontal,
  handleLineClick,
}: {
  pos?: BracketPos;
  line: Line;
  pIndex: number;
  isBye?: boolean;
  isHorizontal: boolean;
  handleLineClick?: (pos: BracketPos, event: React.MouseEvent) => void;
}) => {
  const [participant, setParticipant] = useState<string>("");
  const [score, setScore] = useState<string>("-");

  const width = Math.abs(line.x2 - line.x1);
  const height = Math.abs(line.y2 - line.y1);
  const top = Math.min(line.y1, line.y2);
  const left = Math.min(line.x1, line.x2);

  useEffect(() => {
    const fetchSeedParticipant = async () => {
      if (line.seedId) {
        const seedParticipants = await getSeedParticipants(line.seedId);
        if (seedParticipants[pIndex].participant) {
          const participantName = getName(seedParticipants[pIndex].participant);
          console.log("fetch", pIndex, participantName);

          if (line.prevSeedId) {
            const prevSeedParticipants = await getSeedParticipants(
              line.prevSeedId
            );
            const p1 = prevSeedParticipants.filter(
              (sp) => getName(sp.participant) === participantName
            )[0];
            const p2 = prevSeedParticipants.filter(
              (sp) => getName(sp.participant) !== participantName
            )[0];
            setScore(`${p1?.score}-${p2?.score}`);
          }
          setParticipant(participantName);
        } else {
          setParticipant("");
        }
      }
    };

    fetchSeedParticipant();
  }, [line]);

  // isim boş işe null yap participant id i
  const saveParticipant = async () => {
    if (!participant || participant.length === 0) return;
    const newName = await saveParticipantName(
      line.seedId!,
      pIndex,
      participant ?? ""
    );
    setParticipant(newName);
    if (score.length === 3) {
      updateScores(newName, score[0], score[2]);
    }
  };

  const updateScores = async (
    participant: string,
    p1Score: string,
    p2Score: string
  ) => {
    if (line.prevSeedId) {
      const prevSeedParticipants = await getSeedParticipants(line.prevSeedId);
      // TODO sadece isim yerine participant ın
      // kendisi tutulabilir burda da id kullanırım o zaman
      const prevSeedParticipant = prevSeedParticipants.filter(
        (sp) => getName(sp.participant) === participant
      )[0];
      const prevPIndex = prevSeedParticipant.pindex;
      await saveScores(
        line.prevSeedId!,
        prevPIndex === 0 ? p1Score : p2Score,
        prevPIndex === 0 ? p2Score : p1Score
      );
    }
  };

  const handleScoreChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");

    if (value.length === 0) {
      setScore("-");
    } else if (value.length === 1) {
      setScore(`${value}-`);
    } else if (value.length === 2) {
      setScore(`${value[0]}-${value[1]}`);
      updateScores(participant, value[0], value[1]);
    }
  };

  return (
    <>
      {isHorizontal && pos && (
        <>
          <input
            value={participant}
            onChange={(e) => setParticipant(e.target.value)}
            onBlur={saveParticipant}
            type="text"
            style={{
              position: "absolute",
              top: `${top - 25}px`,
              left: `${left + 10}px`,
              width: "100px",
              zIndex: 2, // Ensure the input is above the lines
            }}
          />
          {line.prevSeedId && !isBye && (
            <input
              value={score}
              onChange={handleScoreChange}
              maxLength={3}
              type="text"
              style={{
                position: "absolute",
                top: `${top - 25}px`,
                left: `${left + 115}px`,
                width: "30px",
                zIndex: 2, // Ensure the input is above the lines
                textAlign: "center",
              }}
            />
          )}
        </>
      )}
      <div
        className="line"
        style={{
          position: "absolute",
          top: `${top}px`,
          left: `${left}px`,
          width: isHorizontal ? `${width}px` : "5px",
          height: isHorizontal ? "5px" : `${height}px`,
          backgroundColor: "black",
          zIndex: 1, // Ensure the line is behind the inputs
          cursor: handleLineClick && isHorizontal ? "pointer" : "default",
        }}
        onClick={(event) =>
          isHorizontal && pos && handleLineClick?.(pos, event)
        }
      />
    </>
  );
};

const BracketPage = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bracket, setBracket] = useState<IBracket>({} as IBracket);
  const [categoryActiveTab, setCategoryActiveTab] = useState<number>(0);
  const [ageActiveTab, setAgeActiveTab] = useState<number>(0);
  const [bracketActiveTab, setBracketActiveTab] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [startLine, setStartLine] = useState<BracketPos | null>(null);
  const [tempLine, setTempLine] = useState<Coordinate | null>(null);
  const [lines, setLines] = useState<Line[][]>([]);
  const [bracketHeight, setBracketHeight] = useState(0);

  const handleLineClick = async (pos: BracketPos, event: React.MouseEvent) => {
    console.log("line clicked");

    //event.stopPropagation();
    const rect = containerRef.current!.getBoundingClientRect();

    if (startLine === null) {
      // Start a new line
      setStartLine(pos);
      setTempLine({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    } else {
      console.log("else", pos, startLine);

      if (
        pos.column !== startLine.column ||
        (pos.column === startLine.column &&
          pos.row !== startLine.row + 1 &&
          pos.row !== startLine.row - 1)
      )
        return;

      console.log("after if");

      const startLineData = getLine(lines, startLine.row, startLine.column);
      const currPosData = getLine(lines, pos.row, pos.column);

      const x = startLineData.x2;
      let y1 = startLineData.y2;
      let y2 = currPosData.y2;

      if (y1 > y2) y1 += 5;
      else y2 += 5;

      let nextLineY = (y1 + y2) / 2;

      let roundSeedResponse: RoundSeedResponse;

      if (startLineData.seedId && currPosData.seedId) {
        roundSeedResponse = await connectSeeds(
          startLineData.seedId,
          currPosData.seedId
        );

        if (startLineData.seedId < currPosData.seedId) {
          currPosData.seedId = startLineData.seedId;
        } else {
          startLineData.seedId = currPosData.seedId;
        }
      }

      setLines((prevLines) => {
        const newLines = [...prevLines];
        newLines[pos.column + 1] = [
          ...(newLines[pos.column + 1] || []),
          { x1: x, y1: y1, x2: x, y2: y2 },
          {
            roundId: roundSeedResponse?.roundId,
            seedId: roundSeedResponse?.seedId,
            prevSeedId: roundSeedResponse?.prevSeedId,
            x1: x,
            y1: nextLineY,
            x2: x + LINE_WIDTH,
            y2: nextLineY,
          },
        ];
        return newLines;
      });

      setStartLine(null);
      setTempLine(null);
    }
  };

  const handleBye = async (pos: BracketPos) => {
    const line = getLine(lines, pos.row, pos.column);
    let roundSeedResponse: RoundSeedResponse;
    if (line.seedId) {
      roundSeedResponse = await connectSeeds(line.seedId);
    }
    setLines((prevLines) => {
      const newLines = [...prevLines];
      newLines[pos.column + 1] = [
        ...(newLines[pos.column + 1] || []),
        {
          roundId: roundSeedResponse?.roundId,
          seedId: roundSeedResponse?.seedId,
          prevSeedId: roundSeedResponse?.prevSeedId,
          x1: line.x2,
          y1: line.y2,
          x2: line.x2 + LINE_WIDTH,
          y2: line.y2,
        },
      ];
      return newLines;
    });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (startLine === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTempLine({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const resetTempLine = (event: React.MouseEvent) => {
    if (
      startLine !== null &&
      tempLine !== null &&
      !(event.target as HTMLElement).classList.contains("line")
    ) {
      setStartLine(null);
      setTempLine(null);
    }
  };

  const renderRounds = () => {
    return lines.map((roundLines, colIndex) => {
      const currPos = { row: 0, column: colIndex };
      return (
        <Fragment key={colIndex}>
          {roundLines.map((line, rowIndex) => {
            const isLineHorizontal = isHorizontal(line);
            return (
              <LineDiv
                key={rowIndex}
                pos={
                  isLineHorizontal
                    ? { row: currPos.row++, column: currPos.column }
                    : undefined
                }
                line={line}
                pIndex={
                  rowIndex >= 1 &&
                  roundLines[rowIndex - 1].seedId === line.seedId
                    ? 1
                    : 0
                }
                isBye={
                  colIndex !== 0
                    ? isBye(lines[colIndex - 1], line.prevSeedId)
                    : undefined
                }
                isHorizontal={isLineHorizontal}
                handleLineClick={
                  isClickable(lines, colIndex + 1, line.seedId)
                    ? handleLineClick
                    : undefined
                }
              />
            );
          })}
        </Fragment>
      );
    });
  };

  const renderTempLine = () => {
    const initialLine = getLine(lines, startLine!.row, startLine!.column);

    return (
      <>
        <line
          x1={initialLine.x2} // Start from the right end of the clicked line
          y1={initialLine.y2}
          x2={tempLine!.x}
          y2={tempLine!.y}
          stroke="gray"
          strokeWidth="5"
        />
        <circle
          cx={initialLine.x2 + LINE_WIDTH}
          cy={initialLine.y2}
          r={5}
          strokeWidth="1"
          fill="gray"
          cursor="pointer"
          style={{ pointerEvents: "auto" }}
          onClick={() => handleBye(startLine!)}
        />
      </>
    );
  };

  const processBracket = async (
    bracket: IBracket,
    space: number = 50,
    lineWidth: number = LINE_WIDTH,
    lineThickness: number = 5
  ) => {
    const processedLines: Array<Array<Line>> = [];

    const rounds = bracket.rounds;
    for (let roundIndex = 0; roundIndex < rounds.length; roundIndex++) {
      const lines: Line[] = [];
      const nextRoundLines: Line[] = [];
      const seeds = rounds[roundIndex].seeds;

      let spaceBetweenSeeds = roundIndex === 0 ? space : 0;

      for (let seedIndex = 0; seedIndex < seeds.length; seedIndex++) {
        const seedParticipants = await getSeedParticipants(seeds[seedIndex].id);

        for (let i = 0; i < seedParticipants.length; i++) {
          let y1;
          if (roundIndex !== 0) {
            const prevSeeds = processedLines[roundIndex - 1].filter(
              (line) => line.seedId === seedParticipants[i].prevSeed.id
            );

            y1 =
              prevSeeds.length === 1
                ? prevSeeds[0].y2
                : (prevSeeds[0].y2 + prevSeeds[1].y2) / 2;
          } else {
            y1 = spaceBetweenSeeds;
            if (lines[lines.length - 1]) {
              y1 += lines[lines.length - 1].y1;
            }
          }

          const x1 = 30 + roundIndex * lineWidth; // Example calculation for x1
          const x2 = x1 + lineWidth;
          const y2 = y1; // Horizontal line for seeds in the same round

          lines.push({
            roundId: rounds[roundIndex].id,
            seedId: seeds[seedIndex].id,
            prevSeedId: seedParticipants[i].prevSeed?.id ?? undefined,
            x1,
            y1,
            x2,
            y2,
          });
        }

        let x1, y1, x2, y2;
        const len = lines.length;
        if (seedParticipants.length === 2) {
          x1 = lines[len - 2].x2;
          y1 = lines[len - 2].y2;
          x2 = lines[len - 1].x2;
          y2 = lines[len - 1].y2 + lineThickness;
          nextRoundLines.push({ x1, y1, x2, y2 });
        }
      }
      if (!processedLines[roundIndex]) {
        processedLines.splice(roundIndex, 0, []);
      }

      if (!processedLines[roundIndex + 1]) {
        processedLines.splice(roundIndex + 1, 0, []);
      }

      processedLines[roundIndex].push(...lines);
      processedLines[roundIndex + 1].push(...nextRoundLines);
    }

    return processedLines;
  };

  const isHorizontal = (line: Line) => line.y1 === line.y2;

  const isBye = (round: Line[], prevSeedId: number | undefined) => {
    return round.filter((line) => line.seedId === prevSeedId).length === 1;
  };

  const isClickable = (
    rounds: Line[][],
    roundId: number,
    prevSeedId: number | undefined
  ) => {
    if (!rounds[roundId]) {
      return true;
    }

    return (
      rounds[roundId].filter((line) => line.prevSeedId === prevSeedId)
        .length === 0
    );
  };

  const getLine = (lines: Line[][], row: number, column: number) => {
    return lines[column].filter((line) => isHorizontal(line))[row];
  };

  const handleSave = async () => {
    let bracketData;
    if (bracketActiveTab === 0)
      bracketData = await getWinnersBracket(categoryActiveTab, ageActiveTab);
    else if (bracketActiveTab === 1)
      bracketData = await getLosersBracket(categoryActiveTab, ageActiveTab);

    if (bracketData) setBracket(bracketData);
  };

  const handleRefresh = async () => {
    setBracket(await refreshBracket(bracket.id));
  };

  // TODO SONRAKİ SAYFAYA GEÇİŞİ DÜŞÜN
  const handleDownload = async () => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: "a4", // [1000, 1950]
    });

    const width = pdf.internal.pageSize.getWidth();
    const marginX = 35;
    const lineWidth = (width - marginX) / (lines.length - 1);

    const { firstBracket, secondBracket } = splitBracket(bracket);
    const firstBracketLines = await processBracket(
      firstBracket,
      20,
      lineWidth,
      1
    );

    const secondBracketLines = await processBracket(
      secondBracket,
      20,
      lineWidth,
      1
    );

    setOpenAsFont(pdf);
    pdf.setLineWidth(2);

    const ageCategoryString = await getAgeCategory(
      categoryActiveTab,
      ageActiveTab
    );
    const title = `${ageCategoryString} ${
      bracketActiveTab === 0 ? "Final" : "Consolation"
    }`;

    pdf.setFontSize(20);
    pdf.text(title, width / 2, 20, {
      align: "center",
    });

    pdf.setFontSize(12);

    for (
      let roundIndex = 0;
      roundIndex < firstBracketLines.length;
      roundIndex++
    ) {
      for (let i = 0; i < firstBracketLines[roundIndex].length; i++) {
        const line = firstBracketLines[roundIndex][i];
        let name = "";
        let p1, p2;
        if (line.seedId) {
          const pIndex =
            i >= 1 &&
            firstBracketLines[roundIndex][i - 1].seedId === line.seedId
              ? 1
              : 0;
          const seedParticipants = await getSeedParticipants(line.seedId);
          if (seedParticipants[pIndex].participant) {
            name = getName(seedParticipants[pIndex].participant);
            if (line.prevSeedId) {
              const prevSeedParticipants = await getSeedParticipants(
                line.prevSeedId
              );
              p1 = prevSeedParticipants.filter(
                (sp) => getName(sp.participant) === name
              )[0];
              p2 = prevSeedParticipants.filter(
                (sp) => getName(sp.participant) !== name
              )[0];
            }
          }
        }

        let y1 = line.y1;
        let y2 = line.y2;

        let textY = y2 - 5;

        pdf.text(name, line.x1 + 10, textY);

        if (p1 && p2) {
          pdf.text(`${p1.score}-${p2.score}`, line.x2 - 20, textY);
        }

        pdf.line(line.x1, y1, line.x2, y2);
      }
    }

    pdf.addPage();

    for (
      let roundIndex = 0;
      roundIndex < secondBracketLines.length;
      roundIndex++
    ) {
      for (let i = 0; i < secondBracketLines[roundIndex].length; i++) {
        const line = secondBracketLines[roundIndex][i];
        let name = "";
        let p1, p2;
        if (line.seedId) {
          const pIndex =
            i >= 1 &&
            secondBracketLines[roundIndex][i - 1].seedId === line.seedId
              ? 1
              : 0;
          const seedParticipants = await getSeedParticipants(line.seedId);
          if (seedParticipants[pIndex].participant) {
            name = getName(seedParticipants[pIndex].participant);
            if (line.prevSeedId) {
              const prevSeedParticipants = await getSeedParticipants(
                line.prevSeedId
              );
              p1 = prevSeedParticipants.filter(
                (sp) => getName(sp.participant) === name
              )[0];
              p2 = prevSeedParticipants.filter(
                (sp) => getName(sp.participant) !== name
              )[0];
            }
          }
        }

        let y1 = line.y1;
        let y2 = line.y2;

        let textY = y2 - 5;

        pdf.text(name, line.x1 + 10, textY);

        if (p1 && p2) {
          pdf.text(`${p1.score}-${p2.score}`, line.x2 - 20, textY);
        }

        pdf.line(line.x1, y1, line.x2, y2);
      }
    }

    pdf.setLanguage("tr");
    pdf.save("ağaç.pdf");
  };

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.offsetHeight);
      }
    }, 500);
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

  useEffect(() => {
    const processNewBracket = async () => {
      const lines = await processBracket(bracket);
      setLines(lines);
    };

    if (Object.keys(bracket).length !== 0) {
      processNewBracket();
    }
  }, [bracket, containerHeight]);

  useEffect(() => {
    const initBracket = async () => {
      let b =
        bracketActiveTab === 0
          ? await getWinnersBracket(categoryActiveTab, ageActiveTab)
          : await getLosersBracket(categoryActiveTab, ageActiveTab);
      if (b === null) {
        b =
          bracketActiveTab === 0
            ? await createWinnersBracket(categoryActiveTab, ageActiveTab)
            : await createLosersBracket(categoryActiveTab, ageActiveTab);
      }

      setBracket(b);
    };

    initBracket();
  }, [categoryActiveTab, ageActiveTab, bracketActiveTab]);

  useEffect(() => {
    if (startLine !== null) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [startLine]);

  useEffect(() => {
    if (lines.length > 0) {
      setBracketHeight((lines[0].length + 1) * 50);
    }
  }, [lines]);

  return (
    <div className={styles.bracketContainer}>
      <CategoryTabs
        activeTab={categoryActiveTab}
        setActiveTab={setCategoryActiveTab}
      />
      <div className={styles.tabContainer}>
        <AgeCategoryTabs
          activeTab={ageActiveTab}
          setActiveTab={setAgeActiveTab}
        />
        <BracketTabs
          activeTab={bracketActiveTab}
          setActiveTab={setBracketActiveTab}
        />
      </div>
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        panning={{ excluded: ["input", "line"] }}
      >
        <div className={styles.buttonContainer}>
          <button onClick={handleSave}>Kaydet</button>
          <button onClick={handleRefresh}>Yenile</button>
          <button onClick={handleDownload}>Agacı İndir</button>
        </div>
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: bracketHeight,
            marginRight: "auto",
          }}
          contentStyle={{
            width: "100%",
            height: bracketHeight,
          }}
        >
          <div
            ref={containerRef}
            className={styles.bracket}
            onClick={(event) => resetTempLine(event)}
          >
            {renderRounds()}
            <svg
              ref={svgRef}
              width="100%"
              height={containerHeight}
              className={styles.svg}
            >
              {startLine !== null && tempLine && renderTempLine()}
            </svg>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default BracketPage;
