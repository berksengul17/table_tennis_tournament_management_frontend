import {
  flexRender,
  getCoreRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { updateParticipant } from "../../api/participantAgeCategoryApi";
import {
  ParticipantAgeCategoryDTO,
  TableEditedRows,
  TableOptionsMeta,
} from "../../type";
import TableColumn from "../TableColumn";
import styles from "./index.module.css";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    editedRows: TableEditedRows;
    setEditedRows: React.Dispatch<React.SetStateAction<TableEditedRows>>;
    updateRow: (rowIndex: number, revert: boolean) => void;
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    type: string;
    onChange?: (e: any) => void;
    options?: TableOptionsMeta[];
  }
}

const fallbackData: any[] = [];

type TableProps<T> = {
  data: T[];
  columns: any[];
  setData?: React.Dispatch<React.SetStateAction<T[]>>;
};

function Table<T>({ data, columns, setData }: TableProps<T>) {
  const [originalData, setOriginalData] = useState<T[]>([]);
  const [editedRows, setEditedRows] = useState({});

  const table = useReactTable({
    data: data ?? fallbackData,
    columns: columns,
    defaultColumn: TableColumn<T>(),
    getCoreRowModel: getCoreRowModel(),
    state: { columnVisibility: { edit: setData !== undefined } },
    meta: {
      editedRows,
      setEditedRows,
      updateRow: async (rowIndex: number, revert: boolean) => {
        if (revert) {
          setData?.((prev) => {
            console.log(originalData[rowIndex]);
            if (!originalData[rowIndex]) return prev;
            return prev.map((row, index) => {
              return index === rowIndex ? originalData[rowIndex] : row;
            });
          });
        } else {
          await updateParticipant(data[rowIndex] as ParticipantAgeCategoryDTO);
          // setOriginalData((prev) =>
          //   prev.map((row, index) =>
          //     index === rowIndex ? data[rowIndex] : row
          //   )
          // );
        }
      },
      updateData: (rowIndex, columnId, value) => {
        setData?.((old) =>
          old.map((row, index) => {
            if (index == rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }

            return row;
          })
        );
      },
    },
  });

  useEffect(() => {
    if (originalData.length === 0) {
      setOriginalData([...data]);
    }
  }, [data]);

  return (
    <>
      <table className={styles.usersTable}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`${styles.usersTableCell} ${styles.tableHeader}`}
                >
                  <div>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={styles.usersTableCell}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Table;
