import { useDrop } from "react-dnd";
import { Group } from "../../../../type";
import GroupMember from "../GroupMember";
import styles from "./index.module.css";

type GroupCardProps = {
  group: Group;
  ordinal: number;
  moveParticipant?: (
    participantId: string,
    fromGroup: Group,
    toGroup: Group
  ) => void;
  moveParticipantInGroup?: (
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
  console.log("rendering", group);

  const [{ isOver }, drop] = useDrop({
    accept: "participant",
    drop: (item: { id: string; group: Group }) => {
      if (item && item.id) {
        moveParticipant?.(item.id, item.group, group);
      }
    },
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
        {group.participants?.map(
          (participant, index) =>
            participant && (
              <GroupMember
                key={participant.id}
                participant={participant}
                group={group}
                index={index}
                moveParticipantInGroup={moveParticipantInGroup}
              />
            )
        )}
      </div>
    </div>
  );
};

export default GroupCard;
