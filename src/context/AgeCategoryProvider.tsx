import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAllCategories } from "../api/ageCategoryApi";

type AgeCategoryProps = {
  categories: string[];
  ageList: string[];
  setAgeList: React.Dispatch<React.SetStateAction<string[]>>;
};

const AgeCategoryContext = createContext<AgeCategoryProps | undefined>(
  undefined
);

export const AgeCategoryProvider = ({ children }: PropsWithChildren) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [ageList, setAgeList] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const categories = await getAllCategories();
      setCategories(categories);
    })();
  }, []);

  return (
    <AgeCategoryContext.Provider value={{ categories, ageList, setAgeList }}>
      {children}
    </AgeCategoryContext.Provider>
  );
};

export const useAgeCategory = () => {
  const context = useContext(AgeCategoryContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
