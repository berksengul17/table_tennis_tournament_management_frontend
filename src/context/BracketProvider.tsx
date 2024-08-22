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
  bracket: IBracket;
  setBracket: React.Dispatch<React.SetStateAction<IBracket>>;
  isFinal: (roundId: number) => boolean;
};

const BracketContext = createContext<BracketContextProps | undefined>(
  undefined
);

export const BracketProvider = ({ children }: PropsWithChildren) => {
  const [bracket, setBracket] = useState<IBracket>({} as IBracket);

  const isFinal = (roundId: number): boolean => {
    const rounds = bracket.rounds;
    if (rounds[rounds.length - 1].id === roundId) {
      return true;
    }

    return false;
  };

  return (
    <BracketContext.Provider
      value={{
        bracket,
        setBracket,
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
