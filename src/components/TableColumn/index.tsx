import { ColumnDef } from "@tanstack/react-table";
import { ChangeEvent, useEffect, useState } from "react";
import { TableOptionsMeta } from "../../type";
import styles from "./index.module.css";

const TableColumn = <T,>(): Partial<ColumnDef<T>> => ({
  cell: ({ getValue, row, column, table }) => {
    const initialValue: any = getValue();
    const columnMeta = column.columnDef.meta;
    const tableMeta = table.options.meta;
    const isNumberInput = columnMeta?.type === "number";
    const isEditable = tableMeta?.editedRows[row.id];

    const [value, setValue] = useState(initialValue);

    const onChange = (e: any) => {
      setValue(
        isNumberInput ? e.target.value.replace(/\D/g, "") : e.target.value
      );

      columnMeta?.onChange?.(e);
    };

    const onBlur = () => {
      tableMeta?.updateData(row.index, column.id, value);
    };

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setValue(e.target.value);
      tableMeta?.updateData(row.index, column.id, e.target.value);
      columnMeta?.onChange?.(e);
    };

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return isEditable ? (
      columnMeta?.type === "select" ? (
        <select
          className={styles.tableSelect}
          onChange={onSelectChange}
          value={initialValue}
        >
          {columnMeta?.options?.map((option: TableOptionsMeta) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : columnMeta?.type === "text" ? (
        <textarea
          className={styles.tableTextArea}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
        ></textarea>
      ) : (
        <input
          className={styles.tableInput}
          value={value as string}
          type={(isNumberInput ? "text" : columnMeta?.type) || "text"}
          min={isNumberInput ? 0 : undefined}
          onChange={onChange}
          onBlur={onBlur}
        />
      )
    ) : (
      value
    );
  },
});

export default TableColumn;
