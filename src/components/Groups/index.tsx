// import Tab from "@mui/material/Tab";
// import Tabs from "@mui/material/Tabs";
// import React, {
//   PropsWithChildren,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { createGroupsForAgeCategory, getAllGroups } from "../../api/groupApi";
// import { AGE_CATEGORY, Group, Player } from "../../type";
// import styles from "./index.module.css";

// type GroupCardProps = {
//   group: Group;
//   ordinal: number;
//   moveParticipant: (
//     participantId: string,
//     fromGroup: Group,
//     toGroup: Group
//   ) => void;
//   moveParticipantInGroup: (
//     groupId: number,
//     dragIndex: number,
//     hoverIndex: number
//   ) => void;
// };

// type ParticipantProps = {
//   participant: Player;
//   group: Group;
//   index: number;
//   moveParticipantInGroup: (
//     groupId: number,
//     dragIndex: number,
//     hoverIndex: number
//   ) => void;
// };

// const CustomTabPanel = ({
//   value,
//   index,
//   children,
// }: { value: number; index: number } & PropsWithChildren) => {
//   return <>{value === index && children}</>;
// };

// const Groups: React.FC = () => {
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [activeTab, setActiveTab] = useState<number>(0);

//   const renderTabs = () => {
//     const tabs = [];

//     for (let i = 0; i < Object.keys(AGE_CATEGORY).length; i++) {
//       tabs.push(<Tab key={i} label={Object.values(AGE_CATEGORY)[i]} />);
//     }

//     return (
//       <Tabs value={activeTab} onChange={(_e, newTab) => setActiveTab(newTab)}>
//         {tabs}
//       </Tabs>
//     );
//   };

//   useEffect(() => {
//     // fetch participants
//     (async () => {
//       let groups = await getAllGroups();

//       if (groups.length == 0) {
//         for (let i = 0; i < Object.keys(AGE_CATEGORY).length; i++) {
//           groups = groups.concat(await createGroupsForAgeCategory(i));
//         }
//       }

//       setGroups(groups);
//     })();
//   }, []);

//   useEffect(() => {
//     console.log("groups use effect", groups);
//   }, [groups]);

//   const moveParticipant = useCallback(
//     (participantId: string, fromGroup: Group, toGroup: Group) => {
//       if (fromGroup.id === toGroup.id) {
//         return; // If the participant is dropped back into their original group, do nothing
//       }

//       setGroups((prevGroups) => {
//         const newGroups = prevGroups.map((group) => {
//           if (group.id === fromGroup.id) {
//             return {
//               ...group,
//               participants: group.participants.filter(
//                 (p) => p.id !== participantId
//               ),
//             };
//           }
//           if (group.id === toGroup.id) {
//             const participant = fromGroup.participants.find(
//               (p) => p.id === participantId
//             );
//             if (participant) {
//               return {
//                 ...group,
//                 participants: [...group.participants, participant],
//               };
//             }
//           }
//           return group;
//         });
//         return newGroups;
//       });
//     },
//     []
//   );

//   const moveParticipantInGroup = useCallback(
//     (groupId: number, dragIndex: number, hoverIndex: number) => {
//       setGroups((prevGroups) => {
//         const group = prevGroups.find((group) => group.id === groupId);
//         if (group) {
//           const participants = [...group.participants];
//           const [draggedParticipant] = participants.splice(dragIndex, 1);
//           participants.splice(hoverIndex, 0, draggedParticipant);

//           return prevGroups.map((g) =>
//             g.id === groupId ? { ...g, participants } : g
//           );
//         }
//         return prevGroups;
//       });
//     },
//     []
//   );

//   return (
//     <DndProvider backend={HTML5Backend}>
//       {renderTabs()}
//       {Object.keys(AGE_CATEGORY).map((_, index) => (
//         <CustomTabPanel key={index} value={activeTab} index={index}>
//           <div className={styles.tableContainer}>
//             <div className={styles.tableHeader}>
//               <p>
//                 Toplam Katılımcı Sayısı:{" "}
//                 {groups
//                   .filter((group) => group.ageCategory === index)
//                   .reduce(
//                     (acc, group) => acc + (group.participants?.length ?? 0),
//                     0
//                   )}
//               </p>
//             </div>
//           </div>
//           <div className={styles.groupContainer}>
//             {groups
//               .filter((group) => group.ageCategory === index)
//               .map((group, index) => (
//                 <GroupCard
//                   key={group.id}
//                   group={group}
//                   ordinal={index + 1}
//                   moveParticipant={moveParticipant}
//                   moveParticipantInGroup={moveParticipantInGroup}
//                 />
//               ))}
//           </div>
//         </CustomTabPanel>
//       ))}
//     </DndProvider>
//   );
// };

// const GroupCard: React.FC<GroupCardProps> = ({
//   group,
//   ordinal,
//   moveParticipant,
//   moveParticipantInGroup,
// }) => {
//   const [{ isOver }, drop] = useDrop({
//     accept: "participant",
//     drop: (item: { id: string; group: Group }) =>
//       moveParticipant(item.id, item.group, group),
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   });

//   return (
//     <div ref={drop} className={styles.group}>
//       <p>{ordinal}. grup</p>
//       <div
//         className={styles.card}
//         style={{ backgroundColor: isOver ? "lightblue" : "white" }}
//       >
//         {group.participants && group.participants.length > 0 ? (
//           group.participants.map((participant, index) => (
//             <Participant
//               key={participant.id}
//               participant={participant}
//               group={group}
//               index={index}
//               moveParticipantInGroup={moveParticipantInGroup}
//             />
//           ))
//         ) : (
//           <p>Katılımcı yok</p>
//         )}
//       </div>
//     </div>
//   );
// };

// const Participant: React.FC<ParticipantProps> = ({
//   participant,
//   group,
//   index,
//   moveParticipantInGroup,
// }) => {
//   const ref = useRef<HTMLParagraphElement>(null);

//   if (!participant) {
//     return null;
//   }

//   const [{ isDragging }, drag] = useDrag({
//     type: "participant",
//     item: { id: participant.id, group, index },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   });

//   const [, drop] = useDrop({
//     accept: "participant",
//     hover: (item: { id: string; group: Group; index: number }, monitor) => {
//       if (!ref.current) {
//         return;
//       }
//       const dragIndex = item.index;
//       const hoverIndex = index;

//       if (dragIndex === hoverIndex) {
//         return;
//       }

//       const hoverBoundingRect = ref.current?.getBoundingClientRect();
//       const hoverMiddleY =
//         (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
//       const clientOffset = monitor.getClientOffset();
//       const hoverClientY =
//         (clientOffset as { y: number }).y - hoverBoundingRect.top;

//       if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
//         return;
//       }

//       if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
//         return;
//       }

//       moveParticipantInGroup(group.id, dragIndex, hoverIndex);
//       item.index = hoverIndex;
//     },
//   });

//   drag(drop(ref));

//   return (
//     <p ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
//       {participant.firstName} {participant.lastName} - {participant.rating}
//     </p>
//   );
// };

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createGroupsForAgeCategory, getAllGroups } from "../../api/groupApi";
import { AGE_CATEGORY, Group, Player } from "../../type";
import styles from "./index.module.css";

const CustomTabPanel = ({
  value,
  index,
  children,
}: { value: number; index: number } & React.PropsWithChildren<{}>) => {
  return <>{value === index && children}</>;
};

type GroupCardProps = {
  group: Group;
  ordinal: number;
  moveParticipant: (
    participantId: string,
    fromGroup: Group,
    toGroup: Group
  ) => void;
  moveParticipantInGroup: (
    groupId: number,
    dragIndex: number,
    hoverIndex: number
  ) => void;
};

type ParticipantProps = {
  participant: Player;
  group: Group;
  index: number;
  moveParticipantInGroup: (
    groupId: number,
    dragIndex: number,
    hoverIndex: number
  ) => void;
};

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  ordinal,
  moveParticipant,
  moveParticipantInGroup,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "x",
    drop: (item: { id: string; group: Group }) =>
      moveParticipant(item.id, item.group, group),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={styles.group}>
      <p>{ordinal}. grup</p>
      <div
        className={styles.card}
        style={{ backgroundColor: isOver ? "lightblue" : "white" }}
      >
        {group.participants?.map((participant, index) => (
          <Participant
            key={participant.id}
            participant={participant}
            group={group}
            index={index}
            moveParticipantInGroup={moveParticipantInGroup}
          />
        ))}
      </div>
    </div>
  );
};

const Participant: React.FC<ParticipantProps> = ({
  participant,
  group,
  index,
  moveParticipantInGroup,
}) => {
  const ref = useRef<HTMLParagraphElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "x",
    item: { id: participant.id, group, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "x",
    hover: (item: { id: string; group: Group; index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY =
        (clientOffset as { y: number }).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveParticipantInGroup(group.id, dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <p ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {participant.firstName} {participant.lastName} - {participant.rating}
    </p>
  );
};

type NewGroupDropAreaProps = {
  createNewGroup: (item: { id: string; group: Group; index: number }) => void;
};

const NewGroupDropArea: React.FC<NewGroupDropAreaProps> = ({
  createNewGroup,
}) => {
  const [, drop] = useDrop({
    accept: "x",
    drop: (item: { id: string; group: Group; index: number }) => {
      createNewGroup(item);
    },
  });

  return (
    <div
      ref={drop}
      style={{ border: "2px dashed gray", padding: "20px", margin: "20px" }}
    >
      Drop here to create a new group
    </div>
  );
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
        const newGroups = prevGroups.map((group) => {
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
        });
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
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
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
            <NewGroupDropArea createNewGroup={createNewGroup} />
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
          </div>
        </CustomTabPanel>
      ))}
    </DndProvider>
  );
};

export default Groups;
