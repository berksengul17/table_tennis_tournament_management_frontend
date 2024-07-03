import { useState } from "react";
import AgeCategoryTable from "../../components/AgeCategoryTable";
import Groups from "../../components/Groups";
import ParticipantsTable from "../../components/ParticipantsTable";
import styles from "./index.module.css";

function ManageParticipantsPage() {
  const [showAgeCategoryTable, setShowAgeCategoryTable] =
    useState<boolean>(false);
  const [showGroups, setShowGroups] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      {showAgeCategoryTable ? (
        showGroups ? (
          <Groups />
        ) : (
          <>
            <button
              onClick={() => setShowGroups(true)}
              style={{ marginBottom: "1rem" }}
            >
              Gruplara Ayır
            </button>
            <AgeCategoryTable />
          </>
        )
      ) : (
        <>
          <button
            onClick={() => setShowAgeCategoryTable(true)}
            style={{ marginBottom: "1rem" }}
          >
            Yaş Kategorilerine Ayır
          </button>
          <ParticipantsTable />
        </>
      )}
    </div>
  );
}

export default ManageParticipantsPage;
