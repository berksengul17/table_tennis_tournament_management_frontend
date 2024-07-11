import { useDrop } from "react-dnd";
import { Group } from "../../../../type";
import styles from "./index.module.css";

type NewGroupDropAreaProps = {
  createNewGroup: (item: { id: string; group: Group; index: number }) => void;
};

const NewGroupDropArea: React.FC<NewGroupDropAreaProps> = ({
  createNewGroup,
}) => {
  const [, drop] = useDrop({
    accept: "participant",
    drop: (item: { id: string; group: Group; index: number }) => {
      if (item && item.id) {
        createNewGroup(item);
      }
    },
  });

  return (
    <div ref={drop} className={styles.newGroupContainer}>
      Yeni bir grup oluşturmak için buraya sürükleyin
    </div>
  );
};

export default NewGroupDropArea;
