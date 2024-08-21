import { useDrop } from "react-dnd";
import { Group, GroupTableTime, Table, Time } from "../../../../type";
import GroupMember from "../GroupMember";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { getTableTime } from "../../../../api/tableTimeApi";

type GroupCardProps = {
  group: Group;
  groupTableTime?: GroupTableTime;
  ordinal: number;
  tableOptions: Table[];
  timeOptions: Time[];
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
  tableOptions,
  timeOptions,
  moveParticipant,
  moveParticipantInGroup,
}) => {
  const [selectedTable, setSelectedTable] = useState<Table>();
  const [selectedTime, setSelectedTime] = useState<Time>();
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

  useEffect(() => {
    setSelectedTable(groupTableTime?.tableTime.table);
    setSelectedTime(groupTableTime?.tableTime.time);
  }, [groupTableTime]);

  useEffect(() => {
    if (
      groupTableTime &&
      selectedTable &&
      selectedTime &&
      (groupTableTime.tableTime.table.id !== selectedTable.id ||
        groupTableTime.tableTime.time.id !== selectedTime.id)
    ) {
      (async () => {
        groupTableTime.tableTime = await getTableTime(
          selectedTable.id,
          selectedTime.id
        );
      })();
    }
  }, [selectedTable, selectedTime]);

  const onChangeTable = (e: any) => {
    setSelectedTable(
      tableOptions.find((table) => table.id === Number(e.target.value))
    );
  };

  const onChangeTime = (e: any) => {
    setSelectedTime(
      timeOptions.find((time) => time.id === Number(e.target.value))
    );
  };

  return (
    <div ref={drop} className={styles.group}>
      <div style={{ display: "flex", gap: "2rem" }}>
        <p>{ordinal}. grup</p>
        {groupTableTime && (
          <>
            <select
              name="tables"
              id="tables"
              value={selectedTable?.id}
              onChange={onChangeTable}
            >
              {tableOptions.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name}
                </option>
              ))}
            </select>
            <select
              name="times"
              id="times"
              value={selectedTime?.id}
              onChange={onChangeTime}
            >
              {timeOptions.map((time) => (
                <option key={time.id} value={time.id}>
                  {time.startTime} - {time.endTime}
                </option>
              ))}
            </select>
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
