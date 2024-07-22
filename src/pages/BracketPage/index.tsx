// TODO component olabilir
const CustomTabPanel = ({
  value,
  index,
  children,
}: { value: number; index: number } & PropsWithChildren) => {
  return <>{value === index && children}</>;
};

import { PropsWithChildren } from "react";
import AgeCategoryTabs from "../../components/AgeCategoryTabs";
import { BracketProvider, useBracket } from "../../context/BracketProvider";
import Bracket from "./components/Bracket";

const BracketPageContent = () => {
  const { activeBracket, setActiveBracket } = useBracket();

  return (
    <>
      <AgeCategoryTabs
        activeTab={activeBracket}
        setActiveTab={setActiveBracket}
      />
      <Bracket />
    </>
  );
};

const BracketPage = () => (
  <BracketProvider>
    <BracketPageContent />
  </BracketProvider>
);

export default BracketPage;
