import { Row, Table } from "@tanstack/react-table";
import { MouseEvent } from "react";
import styles from "./index.module.css";
import { Identifiable } from "../../type";

function TableEditCell<T extends Identifiable>({
  row,
  table,
  onPressEdit,
  onDone,
}: {
  row: Row<T>;
  table: Table<T>;
  onPressEdit?: (rowId: string) => void;
  onDone?: (rowId: string) => void;
}) {
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

  return (
    <div className={styles.btnContainer}>
      {meta?.editedRows[row.id] ? (
        <>
          <button
            name="done"
            className={styles.editCellBtn}
            onClick={(e) => {
              setEditedRows(e);
              onDone?.(row.id);
            }}
          >
            ✔
          </button>
          <button
            name="cancel"
            className={styles.editCellBtn}
            onClick={(e) => {
              setEditedRows(e);
              onDone?.(row.id);
            }}
          >
            X
          </button>
        </>
      ) : (
        <>
          <button
            name="edit"
            className={styles.editCellBtn}
            onClick={(e) => {
              setEditedRows(e);
              onPressEdit?.(row.id);
            }}
          >
            ✐
          </button>
          <button
            name="remove"
            className={styles.editCellBtn}
            onClick={() => meta?.removeRow(parseInt(row.id))}
          >
            🚫
          </button>
        </>
      )}
    </div>
  );
}

export default TableEditCell;
