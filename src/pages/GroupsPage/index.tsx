import React, { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  createGroupsForAgeCategory,
  getAllGroups,
  saveGroups,
} from "../../api/groupApi";
import AgeCategoryTabs from "../../components/AgeCategoryTabs";
import { useAuth } from "../../context/AuthProvider";
import { AGE_CATEGORY, Group } from "../../type";
import GroupCard from "./components/GroupCard";
import NewGroupDropArea from "./components/NewGroupDropArea";
import styles from "./index.module.css";

const CustomTabPanel = ({
  value,
  index,
  children,
}: { value: number; index: number } & React.PropsWithChildren<{}>) => {
  return <div style={{ width: "50%" }}>{value === index && children}</div>;
};

const GroupsPage: React.FC = () => {
  const { isAdminDashboard } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    // Fetch participants
    (async () => {
      let groups = await getAllGroups();

      if (isAdminDashboard && groups.length === 0) {
        for (let i = 0; i < Object.keys(AGE_CATEGORY).length; i++) {
          groups = groups.concat(await createGroupsForAgeCategory(i));
        }
      }

      setGroups(groups);
    })();
  }, [isAdminDashboard]);

  useEffect(() => {
    console.log("Groups updated:", groups);
  }, [groups]);

  const moveParticipant = useCallback(
    (participantId: string, fromGroup: Group, toGroup: Group) => {
      if (fromGroup.id === toGroup.id) {
        return; // If the participant is dropped back into their original group or the user is not admin, do nothing
      }

      setGroups((prevGroups) => {
        const newGroups = prevGroups
          .map((group) => {
            if (group.id === fromGroup.id) {
              if (!group.participants) {
                return group;
              }
              return {
                ...group,
                participants: group.participants
                  .filter((p) => p && p.id !== participantId)
                  .filter(Boolean),
              };
            }
            if (group.id === toGroup.id) {
              const participant = fromGroup.participants.find(
                (p) => p && p.id === participantId
              );
              if (participant) {
                return {
                  ...group,
                  participants: [...group.participants, participant].filter(
                    Boolean
                  ),
                };
              }
            }
            return group;
          })
          .filter((group) => group.participants.length > 0);
        return newGroups;
      });
    },
    [isAdminDashboard]
  );

  const moveParticipantInGroup = useCallback(
    (groupId: number, dragIndex: number, hoverIndex: number) => {
      setGroups((prevGroups) => {
        const group = prevGroups.find((group) => group.id === groupId);
        if (group) {
          const participants = [...group.participants];
          const [draggedParticipant] = participants.splice(dragIndex, 1);
          participants.splice(hoverIndex, 0, draggedParticipant);

          return prevGroups.map((g) =>
            g.id === groupId
              ? { ...g, participants: participants.filter(Boolean) }
              : g
          );
        }
        return prevGroups;
      });
    },
    [isAdminDashboard]
  );

  const createNewGroup = useCallback(
    (item: { id: string; group: Group; index: number }) => {
      setGroups((prevGroups) => {
        // Check if item and necessary properties are defined
        if (!item || !item.group || !item.group.participants || !item.id) {
          console.error("Item or its properties are undefined:", item);
          return prevGroups;
        }

        const participant = item.group.participants.find(
          (p) => p && p.id === item.id
        );

        // Check if participant is defined
        if (!participant) {
          console.error("Participant not found in group:", item.id, item.group);
          return prevGroups;
        }

        // Remove participant from the original group
        const updatedGroups = prevGroups.map((group) =>
          group.id === item.group.id
            ? {
                ...group,
                participants: group.participants
                  .filter((p) => p && p.id !== item.id)
                  .filter(Boolean),
              }
            : group
        );

        // Create new group with the participant
        const newGroup: Group = {
          id: prevGroups[prevGroups.length - 1].id + 1, // Or use a better ID generation strategy
          ageCategory: item.group.ageCategory,
          participants: [participant],
        };

        return [...updatedGroups, newGroup];
      });
    },
    [isAdminDashboard]
  );

  const handleSave = async () => {
    console.log("Saving groups:", groups);
    setGroups(await saveGroups(groups));
  };

  if (groups.length === 0) {
    return <p className={styles.noGroup}>Gruplar henüz oluşturulmadı.</p>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        <AgeCategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {Object.keys(AGE_CATEGORY).map((_, index) => (
          <CustomTabPanel key={index} value={activeTab} index={index}>
            <div className={styles.header}>
              <p>
                Toplam Katılımcı Sayısı:{" "}
                {groups
                  .filter((group) => group.ageCategory === index)
                  .reduce(
                    (acc, group) => acc + (group.participants?.length ?? 0),
                    0
                  )}
              </p>
              {isAdminDashboard && (
                <button onClick={handleSave}>Değişiklikleri Kaydet</button>
              )}
            </div>
            <div className={styles.groupContainer}>
              {groups
                .filter((group) => group.ageCategory === index)
                .map(
                  (group, index) =>
                    group &&
                    group.id && (
                      <GroupCard
                        key={group.id}
                        group={group}
                        ordinal={index + 1}
                        moveParticipant={
                          isAdminDashboard ? moveParticipant : undefined
                        }
                        moveParticipantInGroup={
                          isAdminDashboard ? moveParticipantInGroup : undefined
                        }
                      />
                    )
                )}
              {isAdminDashboard && (
                <NewGroupDropArea createNewGroup={createNewGroup} />
              )}
            </div>
          </CustomTabPanel>
        ))}
      </div>
    </DndProvider>
  );
};

export default GroupsPage;
