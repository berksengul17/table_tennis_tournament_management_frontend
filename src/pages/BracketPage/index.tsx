import AgeCategoryTabs from "../../components/AgeCategoryTabs";
import { BracketProvider, useBracket } from "../../context/BracketProvider";
import Bracket from "./components/Bracket";
import noDataImg from "../../assets/images/ban-solid.svg";
import styles from "./index.module.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import CategoryTabs from "../../components/CategoryTabs";
import { useEffect, useState } from "react";
import { createWinnersBracket, getWinnersBracket } from "../../api/bracketApi";

const BracketPageContent = () => {
  const { bracket, setBracket } = useBracket();
  const [categoryActiveTab, setCategoryActiveTab] = useState<number>(0);
  const [ageActiveTab, setAgeActiveTab] = useState<number>(0);

  useEffect(() => {
    (async () => {
      let bracketData = await getWinnersBracket(
        categoryActiveTab,
        ageActiveTab
      );
      if (bracket == null) {
        bracketData = await createWinnersBracket(
          categoryActiveTab,
          ageActiveTab
        );
      }

      setBracket(bracketData!);
    })();
  }, [categoryActiveTab, ageActiveTab]);

  if (bracket === null) {
    return (
      <div className={styles.noBracket}>
        <img src={noDataImg} />
        <p>Fikstürler henüz oluşturulmadı.</p>;
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        maxHeight: "100%",
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
      <TransformWrapper panning={{ excluded: ["input"] }}>
        <TransformComponent wrapperStyle={{ border: "1px solid black" }}>
          <Bracket />
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
