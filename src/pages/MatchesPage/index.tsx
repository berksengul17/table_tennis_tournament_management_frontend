import { useEffect, useState } from "react";
import {
  downloadAllGroupTableTimePdf,
  downloadGroupTableTimePdf,
} from "../../api/documentApi";
import { createMatches, getMatches } from "../../api/matchApi";
import AgeCategoryTabs from "../../components/AgeCategoryTabs";
import CategoryTabs from "../../components/CategoryTabs";
import GroupMatch from "../../components/GroupMatch";
import { Match } from "../../type";
import styles from "./index.module.css";

function MatchesPage() {
  const [allGroupMatches, setAllGroupMatches] = useState<Match[][]>([]);
  const [categoryActiveTab, setCategoryActiveTab] = useState<number>(0);
  const [ageActiveTab, setAgeActiveTab] = useState<number>(0);

  useEffect(() => {
    (async () => {
      let matches = await getMatches(categoryActiveTab, ageActiveTab);
      if (matches.flat().length === 0) {
        matches = await createMatches(categoryActiveTab, ageActiveTab);
      }

      console.log("MATCHES", matches);

      setAllGroupMatches(matches);
    })();
  }, [categoryActiveTab, ageActiveTab]);

  const recreateMatches = async () => {
    setAllGroupMatches(
      await createMatches(categoryActiveTab, ageActiveTab, true)
    );
  };

  const downloadAllGroupTableTime = async () => {
    await downloadAllGroupTableTimePdf(true);
  };

  const downloadMatchScores = async () => {
    await downloadGroupTableTimePdf(categoryActiveTab, ageActiveTab, true);
  };

  return (
    <div className={styles.container}>
      <CategoryTabs
        activeTab={categoryActiveTab}
        setActiveTab={setCategoryActiveTab}
      />
      <AgeCategoryTabs
        activeTab={ageActiveTab}
        setActiveTab={setAgeActiveTab}
      />
      <div style={{ width: "80%" }}>
        <div className={styles.header}>
          <button onClick={recreateMatches} style={{ marginRight: "10px" }}>
            Yenile
          </button>
          <button
            onClick={downloadAllGroupTableTime}
            style={{ marginRight: "10px" }}
          >
            Tüm Gruplar Masa Yerleşmeleri PDF İndir
          </button>
          <button onClick={downloadMatchScores}>Maç Sonuçları PDF İndir</button>
        </div>
        <div className={styles.groupMatchesContainer}>
          {allGroupMatches.map((groupMatches, index) => (
            <GroupMatch
              key={index}
              ordinal={index + 1}
              groupMatches={groupMatches}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MatchesPage;
