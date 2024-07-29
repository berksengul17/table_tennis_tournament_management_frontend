import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const fallbackData: any[] = [];

type TableProps<T> = {
  data: T[];
  columns: any[];
  setData?: React.Dispatch<React.SetStateAction<T[]>>;
};

function Table<T>({ data, columns, setData }: TableProps<T>) {
  const defaultColumn: Partial<ColumnDef<T>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      console.log("default");

      return (
        <input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
        />
      );
    },
  };

  const table = useReactTable({
    data: data ?? fallbackData,
    columns: columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    meta: {
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
