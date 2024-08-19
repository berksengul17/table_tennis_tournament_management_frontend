import { useDrop } from "react-dnd";
import { Group, GroupTableTime } from "../../../../type";
import GroupMember from "../GroupMember";
import styles from "./index.module.css";

type GroupCardProps = {
  group: Group;
  groupTableTime?: GroupTableTime;
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
  groupTableTime,
  ordinal,
  moveParticipant,
  moveParticipantInGroup,
}) => {
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

  const { tableTime } = groupTableTime || {};
  const { table = { name: "" }, time = { startTime: "", endTime: "" } } =
    tableTime || {};

  return (
    <div ref={drop} className={styles.group}>
      <div style={{ display: "flex", gap: "2rem" }}>
        <p>{ordinal}. grup</p>
        {groupTableTime && (
          <>
            <p>{table.name}</p>
            <p>
              {time.startTime} - {time.endTime}
            </p>
          </>
        )}
      </div>

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
