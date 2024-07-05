import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Group, Player } from "../../../../type";

type GroupMemberProps = {
  participant: Player;
  group: Group;
  index: number;
  moveParticipantInGroup: (
    groupId: number,
    dragIndex: number,
    hoverIndex: number
  ) => void;
};

const GroupMember: React.FC<GroupMemberProps> = ({
  participant,
  group,
  index,
  moveParticipantInGroup,
}) => {
  const ref = useRef<HTMLParagraphElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "participant",
    item: { id: participant.id, group, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "participant",
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

export default GroupMember;
