import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { createWinnersBracket, getWinnersBracket } from "../api/bracketApi";
import { IBracket } from "../type";

type BracketContextProps = {
  brackets: IBracket[];
  activeBracket: number;
  setBrackets: React.Dispatch<React.SetStateAction<IBracket[]>>;
  setActiveBracket: React.Dispatch<React.SetStateAction<number>>;
  isFinal: (roundId: number) => boolean;
};

const BracketContext = createContext<BracketContextProps | undefined>(
  undefined
);

export const BracketProvider = ({ children }: PropsWithChildren) => {
  const [brackets, setBrackets] = useState<IBracket[]>([]);
  const [activeBracket, setActiveBracket] = useState<number>(0);

  const isFinal = (roundId: number): boolean => {
    const rounds = brackets[activeBracket].rounds;
    if (rounds[rounds.length - 1].id === roundId) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    (async () => {
      let bracket = await getWinnersBracket(activeBracket);
      if (bracket == null) {
        bracket = await createWinnersBracket(activeBracket);
      }

      console.log("bracket", bracket);

      setBrackets((prevBrackets) => {
        const newBrackets = [...prevBrackets];
        newBrackets[activeBracket] = bracket;
        return newBrackets;
      });
    })();
  }, [activeBracket]);

  return (
    <BracketContext.Provider
      value={{
        brackets,
        activeBracket,
        setBrackets,
        setActiveBracket,
        isFinal,
      }}
    >
      {children}
    </BracketContext.Provider>
  );
};

export const useBracket = () => {
  const context = useContext(BracketContext);

  if (context === undefined) {
    throw new Error("useBracket must be used within an BracketProvider");
  }

  return context;
};
