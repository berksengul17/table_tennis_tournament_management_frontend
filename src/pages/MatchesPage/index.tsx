import { useEffect, useState } from "react";
import { Match } from "../../type";
import { createMatches, getMatches } from "../../api/matchApi";
import AgeCategoryTabs from "../../components/AgeCategoryTabs";
import CategoryTabs from "../../components/CategoryTabs";
import styles from "./index.module.css";

function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [categoryActiveTab, setCategoryActiveTab] = useState<number>(0);
  const [ageActiveTab, setAgeActiveTab] = useState<number>(0);

  useEffect(() => {
    (async () => {
      let matches = await getMatches(categoryActiveTab, ageActiveTab);
      if (matches[0].length === 0) {
        matches = await createMatches(categoryActiveTab, ageActiveTab);
      }

      console.log("MATCHES", matches);

      setMatches(matches.flat());
    })();
  }, [categoryActiveTab, ageActiveTab]);

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
      {matches.length > 0 &&
        matches?.map(
          (match) =>
            match && (
              <div key={match.id}>
                {match.p1.firstName} VS {match.p2.firstName} {match.startTime} -{" "}
                {match.endTime}
              </div>
            )
        )}
    </div>
  );
}

export default MatchesPage;
