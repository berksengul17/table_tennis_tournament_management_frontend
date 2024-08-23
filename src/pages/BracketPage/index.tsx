import AgeCategoryTabs from "../../components/AgeCategoryTabs";
import { BracketProvider, useBracket } from "../../context/BracketProvider";
import Bracket from "./components/Bracket";
import noDataImg from "../../assets/images/ban-solid.svg";
import styles from "./index.module.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import CategoryTabs from "../../components/CategoryTabs";
import { useEffect, useState } from "react";
import { createWinnersBracket, getWinnersBracket } from "../../api/bracketApi";
import { IBracket } from "../../type";

const BracketPageContent = () => {
  const { bracket, setBracket } = useBracket();
  const [currBracket, setCurrBracket] = useState<IBracket>({} as IBracket);
  const [categoryActiveTab, setCategoryActiveTab] = useState<number>(0);
  const [ageActiveTab, setAgeActiveTab] = useState<number>(0);

  useEffect(() => {
    console.log("useEffect with static values triggered");

    (async () => {
      let bracketData = await getWinnersBracket(0, 0); // Use static values
      if (bracket == null) {
        bracketData = await createWinnersBracket(0, 0); // Use static values
      }
      setBracket(bracketData!);
    })();
    console.log("bracket", bracket);
  }, []);

  useEffect(() => {
    (async () => {
      console.log("getting");

      let bracketData = await getWinnersBracket(
        categoryActiveTab,
        ageActiveTab
      );

      if (bracketData === null) {
        console.log("inside if");

        bracketData = await createWinnersBracket(
          categoryActiveTab,
          ageActiveTab
        );
      }

      setBracket(bracketData!);
      console.log("bracket", bracketData);
    })();
  }, [categoryActiveTab, ageActiveTab]);

  useEffect(() => {
    setBracket(currBracket);
  }, [currBracket]);

  // if (bracket === null) {
  //   return (
  //     <div className={styles.noBracket}>
  //       <img src={noDataImg} />
  //       <p>Fikstürler henüz oluşturulmadı.</p>;
  //     </div>
  //   );
  // }

  return (
    <div
      style={{
        display: "flex",
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
      {bracket == null ? <p>Fikstür henüz oluşturulmadı</p> : <Bracket />}
      {/* <TransformWrapper panning={{ excluded: ["input"] }}>
        <TransformComponent wrapperStyle={{ border: "1px solid black" }}>
        </TransformComponent>
      </TransformWrapper> */}
    </div>
  );
};

const BracketPage = () => (
  <BracketProvider>
    <BracketPageContent />
  </BracketProvider>
);

export default BracketPage;
