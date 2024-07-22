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
};

const BracketContext = createContext<BracketContextProps | undefined>(
  undefined
);

export const BracketProvider = ({ children }: PropsWithChildren) => {
  const [brackets, setBrackets] = useState<IBracket[]>([]);
  const [activeBracket, setActiveBracket] = useState<number>(0);

  useEffect(() => {
    console.log("useeffect");
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
      value={{ brackets, activeBracket, setBrackets, setActiveBracket }}
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
