import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { TableEditedRows, Option, Identifiable } from "../../type";
import TableColumn from "../TableColumn";
import styles from "./index.module.css";
import TableFilter from "../TableFilter";
import TablePagination from "../TablePagination";
import { useAuth } from "../../context/AuthProvider";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    editedRows: TableEditedRows;
    setEditedRows: React.Dispatch<React.SetStateAction<TableEditedRows>>;
    addRow: () => void;
    removeRow: (rowIndex: number) => void;
    updateRow: (rowIndex: number, revert: boolean) => void;
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    type: string;
    onChange?: (e: any) => void;
    options?: Option[];
    filterVariant?: "text" | "range" | "select" | "date";
  }
}

const fallbackData: any[] = [];

type TableProps<T> = {
  data: T[];
  columns: any[];
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  setData?: React.Dispatch<React.SetStateAction<T[]>>;
  addRow?: () => void;
  updateRow?: (data: T) => void;
  removeRow?: (dataId: number) => void;
};

function Table<T extends Identifiable>({
  data,
  columns,
  columnFilters,
  setColumnFilters,
  setData,
  addRow,
  updateRow,
  removeRow,
}: TableProps<T>) {
  const { isAdminDashboard } = useAuth();
  const [originalData, setOriginalData] = useState<T[]>([]);
  const [editedRows, setEditedRows] = useState({});

  const table = useReactTable({
    data: data ?? fallbackData,
    columns: columns,
    filterFns: {},
    defaultColumn: TableColumn<T>(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
      columnVisibility: { edit: setData !== undefined },
    },
    onColumnFiltersChange: setColumnFilters,
    getRowId: (row) => {
      return row.id?.toString();
    },
    meta: {
      editedRows,
      setEditedRows,
      addRow: () => {
        addRow?.();
        const setFunc = (old: T[]) => [...old, {} as T];
        setData?.(setFunc);
        setOriginalData(setFunc);
      },
      removeRow: (dataId: number) => {
        removeRow?.(dataId);
      },
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
          console.log(data[rowIndex]);

          updateRow?.(data[rowIndex]);
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
    console.log("data", data);

    if (originalData.length === 0) {
      setOriginalData([...data]);
    }
  }, [data]);

  return (
    <div style={{ overflowX: "auto" }}>
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
                  {header.column.getCanFilter() ? (
                    <TableFilter column={header.column} />
                  ) : null}
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
        <tfoot>
          {isAdminDashboard && (
            <tr>
              <th>
                <button onClick={table.options.meta?.addRow}>Ekle</button>
              </th>
            </tr>
          )}
          <tr>
            <th>
              <TablePagination<T> table={table} />
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Table;
