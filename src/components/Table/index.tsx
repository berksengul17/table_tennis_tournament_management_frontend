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
import { updateParticipant } from "../../api/participantAgeCategoryApi";
import { ParticipantAgeCategoryDTO, TableEditedRows, Option } from "../../type";
import TableColumn from "../TableColumn";
import styles from "./index.module.css";
import TableFilter from "../TableFilter";

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
};

function Table<T>({
  data,
  columns,
  columnFilters,
  setColumnFilters,
  setData,
}: TableProps<T>) {
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
      </table>
      <div>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span>
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span>
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Table;
