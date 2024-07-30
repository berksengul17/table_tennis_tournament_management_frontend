import { Row, Table } from "@tanstack/react-table";
import { MouseEvent } from "react";
import styles from "./index.module.css";

function TableEditCell<T>({ row, table }: { row: Row<T>; table: Table<T> }) {
  const meta = table.options.meta;

  const setEditedRows = (e: MouseEvent<HTMLButtonElement>) => {
    const elName = e.currentTarget.name;

    meta?.setEditedRows((old) => ({
      ...old,
      [row.id]: !old[row.id],
    }));

    if (elName !== "edit") {
      meta?.updateRow(row.index, elName === "cancel");
    }
  };

  return meta?.editedRows[row.id] ? (
    <div className={styles.btnContainer}>
      <button
        name="done"
        className={styles.editCellBtn}
        onClick={setEditedRows}
      >
        ✔
      </button>
      <button
        name="cancel"
        className={styles.editCellBtn}
        onClick={setEditedRows}
      >
        X
      </button>
    </div>
  ) : (
    <button name="edit" className={styles.editCellBtn} onClick={setEditedRows}>
      ✐
    </button>
  );
}

export default TableEditCell;
