import { ColumnDef } from "@tanstack/react-table";
import { ChangeEvent, useEffect, useState } from "react";
import { Option } from "../../type";
import styles from "./index.module.css";

const TableColumn = <T,>(): Partial<ColumnDef<T>> => ({
  cell: ({ getValue, row, column, table }) => {
    const columnMeta = column.columnDef.meta;
    const tableMeta = table.options.meta;
    const isNumberInput = columnMeta?.type === "number";
    const isEditable = tableMeta?.editedRows[row.id];

    let initialValue = getValue();
    if (columnMeta?.type === "select") {
      initialValue = columnMeta.options?.find(
        (option) => option.label === initialValue
      )?.value;
    }

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
      const label = columnMeta?.options?.find(
        (option) => option.value === e.target.value
      )?.label;

      tableMeta?.updateData(row.index, column.id, label);
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
          value={value as string}
        >
          {columnMeta?.options?.map((option: Option) => (
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
    ) : columnMeta?.type === "select" ? (
      columnMeta.options?.find((option) => option.value === value)?.label
    ) : (
      value
    );
  },
});

export default TableColumn;
