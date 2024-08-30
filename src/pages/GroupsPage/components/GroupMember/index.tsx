import { useEffect, useMemo, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useAuth } from "../../../../context/AuthProvider";
import { Group, Participant } from "../../../../type";
import { getParticipant } from "../../../../api/participantAgeCategoryApi";

type GroupMemberProps = {
  participant: Participant;
  group: Group;
  index: number;
  moveParticipantInGroup?: (
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
  const { isAdminDashboard } = useAuth();
  const ref = useRef<HTMLParagraphElement>(null);
  const [pairName, setPairName] = useState<string>("");
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

      moveParticipantInGroup?.(group.id!, dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  useEffect(() => {
    const fetchPairName = async () => {
      const participantAgeCategory = await getParticipant(participant.id);
      const fetchedName = participantAgeCategory?.pairName
        ?.split(" ")
        .map((name) => name.slice(0, 1).toUpperCase() + name.slice(1))
        .join(" ");

      setPairName(fetchedName ?? "");
    };

    fetchPairName();
  }, [participant.id]);

  const name = useMemo(() => {
    const names = (participant?.firstName + " " + participant?.lastName).split(
      " "
    );
    return names
      .map((name) => name.slice(0, 1).toUpperCase() + name.slice(1))
      .join(" ");
  }, [participant?.firstName, participant?.lastName]);

  return (
    <>
      {participant && (
        <p
          ref={isAdminDashboard ? ref : null}
          style={{ opacity: isDragging ? 0.5 : 1 }}
        >
          {pairName.length > 0 ? (
            <span>
              {name} - {pairName}
            </span>
          ) : (
            <span>
              {name} - {participant.rating} - {participant.city}
            </span>
          )}
        </p>
      )}
    </>
  );
};

export default GroupMember;
