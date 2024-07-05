import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  createGroupsForAgeCategory,
  getAllGroups,
} from "../../../../api/groupApi";
import { AGE_CATEGORY, Group } from "../../../../type";
import GroupCard from "../GroupCard";
import NewGroupDropArea from "../NewGroupDropArea";
import styles from "./index.module.css";

const CustomTabPanel = ({
  value,
  index,
  children,
}: { value: number; index: number } & React.PropsWithChildren<{}>) => {
  return <>{value === index && children}</>;
};

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  const renderTabs = () => {
    const tabs = [];

    for (let i = 0; i < Object.keys(AGE_CATEGORY).length; i++) {
      tabs.push(<Tab key={i} label={Object.values(AGE_CATEGORY)[i]} />);
    }

    return (
      <Tabs value={activeTab} onChange={(_e, newTab) => setActiveTab(newTab)}>
        {tabs}
      </Tabs>
    );
  };

  useEffect(() => {
    // Fetch participants
    (async () => {
      let groups = await getAllGroups();

      if (groups.length === 0) {
        for (let i = 0; i < Object.keys(AGE_CATEGORY).length; i++) {
          groups = groups.concat(await createGroupsForAgeCategory(i));
        }
      }

      setGroups(groups);
    })();
  }, []);

  useEffect(() => {
    console.log("groups use effect", groups);
  }, [groups]);

  const moveParticipant = useCallback(
    (participantId: string, fromGroup: Group, toGroup: Group) => {
      if (fromGroup.id === toGroup.id) {
        return; // If the participant is dropped back into their original group, do nothing
      }

      setGroups((prevGroups) => {
        const newGroups = prevGroups
          .map((group) => {
            if (group.id === fromGroup.id) {
              return {
                ...group,
                participants: group.participants.filter(
                  (p) => p.id !== participantId
                ),
              };
            }
            if (group.id === toGroup.id) {
              const participant = fromGroup.participants.find(
                (p) => p.id === participantId
              );
              if (participant) {
                return {
                  ...group,
                  participants: [...group.participants, participant],
                };
              }
            }
            return group;
          })
          .filter((group) => group.participants.length > 0);
        return newGroups;
      });
    },
    []
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
            g.id === groupId ? { ...g, participants } : g
          );
        }
        return prevGroups;
      });
    },
    []
  );

  const createNewGroup = useCallback(
    (item: { id: string; group: Group; index: number }) => {
      setGroups((prevGroups) => {
        const participant = item.group.participants.find(
          (p) => p.id === item.id
        );
        if (!participant) {
          return prevGroups;
        }

        // Remove participant from the original group
        const updatedGroups = prevGroups.map((group) =>
          group.id === item.group.id
            ? {
                ...group,
                participants: group.participants.filter(
                  (p) => p.id !== item.id
                ),
              }
            : group
        );

        // Create new group with the participant
        const newGroup: Group = {
          id: prevGroups.length + 1, // Or use a better ID generation strategy
          ageCategory: item.group.ageCategory,
          participants: [participant],
        };

        return [...updatedGroups, newGroup];
      });
    },
    []
  );

  return (
    <DndProvider backend={HTML5Backend}>
      {renderTabs()}
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
          </div>
          <div className={styles.groupContainer}>
            {groups
              .filter((group) => group.ageCategory === index)
              .map((group, index) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  ordinal={index + 1}
                  moveParticipant={moveParticipant}
                  moveParticipantInGroup={moveParticipantInGroup}
                />
              ))}
            <NewGroupDropArea createNewGroup={createNewGroup} />
          </div>
        </CustomTabPanel>
      ))}
    </DndProvider>
  );
};

export default Groups;
