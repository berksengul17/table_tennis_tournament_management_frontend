import { useState } from "react";
import AgeCategoryPage from "../AgeCategoryPage";
import GroupsPage from "../GroupsPage";
import ParticipantsPage from "../ParticipantsPage";
import MatchesPage from "../MatchesPage";

function ManageParticipantsPage() {
  const [showAgeCategoryTable, setShowAgeCategoryTable] =
    useState<boolean>(false);
  const [showGroups, setShowGroups] = useState<boolean>(false);
  const [showMatches, setShowMatches] = useState<boolean>(false);

  return (
    <>
      {showAgeCategoryTable ? (
        showGroups ? (
          showMatches ? (
            <MatchesPage />
          ) : (
            <GroupsPage setShowMatches={setShowMatches} />
          )
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
