import { useState } from "react";
import AgeCategoryPage from "../AgeCategoryPage";
import GroupsPage from "../GroupsPage";
import ParticipantsPage from "../ParticipantsPage";

function ManageParticipantsPage() {
  const [showAgeCategoryTable, setShowAgeCategoryTable] =
    useState<boolean>(false);
  const [showGroups, setShowGroups] = useState<boolean>(false);

  return (
    <>
      {showAgeCategoryTable ? (
        showGroups ? (
          <GroupsPage />
        ) : (
          <AgeCategoryPage setShowGroups={setShowGroups} />
        )
      ) : (
        <ParticipantsPage setShowAgeCategoryTable={setShowAgeCategoryTable} />
      )}
    </>
  );
}

export default ManageParticipantsPage;
