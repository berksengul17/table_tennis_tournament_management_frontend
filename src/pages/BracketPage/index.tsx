// TODO: lines array ini koordinatlara göre sırala
// yoksa rastgele sırada birleştirince bozuluyor
// TODO: final maçı çizgisine tıklanabilir bir şekilde
// buna nasıl bir kontrol yaparım bilmiyorum
import { useRef, useEffect, useState, Fragment } from "react";
import { IBracket, RoundSeedResponse } from "../../type";
import {
  connectSeeds,
  createWinnersBracket,
  getParticipantCount,
  getWinnersBracket,
} from "../../api/bracketApi";
import CategoryTabs from "../../components/CategoryTabs";
import AgeCategoryTabs from "../../components/AgeCategoryTabs";
import { getSeedParticipants } from "../../api/seedParticipantApi";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

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

const LineDiv = ({
  pos,
  line,
  isBye,
  isHorizontal,
  handleLineClick,
}: {
  pos?: BracketPos;
  line: Line;
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
    console.log(score.length);
  }, [score]);

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");

    if (value.length === 0) {
      setScore("-");
    } else if (value.length === 1) {
      setScore(`${value}-`);
    } else if (value.length === 2) {
      setScore(`${value[0]}-${value[1]}`);
    }
  };

  return (
    <>
      {isHorizontal && pos && (
        <>
          <input
            value={participant}
            onChange={(e) => setParticipant(e.target.value)}
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
  const [containerHeight, setContainerHeight] = useState(0);
  const [startLine, setStartLine] = useState<BracketPos | null>(null);
  const [tempLine, setTempLine] = useState<Coordinate | null>(null);
  const [lines, setLines] = useState<Line[][]>([]);

  const handleLineClick = async (pos: BracketPos, event: React.MouseEvent) => {
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
      if (
        pos.column !== startLine.column ||
        (pos.column === startLine.column &&
          pos.row !== startLine.row + 1 &&
          pos.row !== startLine.row - 1)
      )
        return;

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
            roundId: roundSeedResponse.roundId,
            seedId: roundSeedResponse.seedId,
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

  const processBracket = async (bracket: IBracket) => {
    const processedLines: Array<Array<Line>> = [];

    const rounds = bracket.rounds;
    for (let roundIndex = 0; roundIndex < rounds.length; roundIndex++) {
      const lines: Line[] = [];
      const nextRoundLines: Line[] = [];
      const seeds = rounds[roundIndex].seeds;
      const numOfParticipants = await getParticipantCount(bracket.id);

      let spaceBetweenSeeds =
        roundIndex === 0
          ? Math.round(containerHeight / (numOfParticipants + 1))
          : 0;

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

          const x1 = 30 + roundIndex * LINE_WIDTH; // Example calculation for x1
          const x2 = x1 + LINE_WIDTH;
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
          y2 = lines[len - 1].y2 + 5;
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
  }, [bracket]);

  useEffect(() => {
    const initBracket = async () => {
      let b = await getWinnersBracket(categoryActiveTab, ageActiveTab);
      if (b === null) {
        b = await createWinnersBracket(categoryActiveTab, ageActiveTab);
      }

      setBracket(b);
    };

    initBracket();
  }, [categoryActiveTab, ageActiveTab]);

  useEffect(() => {
    if (startLine !== null) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [startLine]);

  useEffect(() => {
    console.log("LINES", lines);
  }, [lines]);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
      <TransformWrapper
        initialScale={1}
        panning={{ excluded: ["input", "line"] }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginLeft: "auto",
            marginRight: "4rem",
          }}
        >
          <button>Kaydet</button>
          <button>Yenile</button>
        </div>
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%" }}
          contentStyle={{ width: "100%", height: "100%" }}
        >
          <div
            ref={containerRef}
            style={{
              position: "relative",
              flex: "1",
              overflow: "hidden",
              width: "100%",
            }}
            onClick={(event) => resetTempLine(event)}
          >
            {renderRounds()}
            <svg
              ref={svgRef}
              width="100%"
              height={containerHeight}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
                pointerEvents: "none",
              }}
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
