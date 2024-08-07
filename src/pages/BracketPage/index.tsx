import AgeCategoryTabs from "../../components/AgeCategoryTabs";
import { BracketProvider, useBracket } from "../../context/BracketProvider";
import Bracket from "./components/Bracket";
import noDataImg from "../../assets/images/ban-solid.svg";
import styles from "./index.module.css";

const BracketPageContent = () => {
  const { brackets, activeBracket, setActiveBracket } = useBracket();

  if (
    brackets.length == 0 ||
    Object.keys(brackets[activeBracket]).length == 0
  ) {
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
