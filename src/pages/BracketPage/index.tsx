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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2rem",
      }}
    >
      <AgeCategoryTabs
        activeTab={activeBracket}
        setActiveTab={setActiveBracket}
      />
      <Bracket />
    </div>
  );
};

const BracketPage = () => (
  <BracketProvider>
    <BracketPageContent />
  </BracketProvider>
);

export default BracketPage;
