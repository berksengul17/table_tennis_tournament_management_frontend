import { Column } from "@tanstack/react-table";
import DebouncedInput from "../DebouncedInput";
import styles from "./index.module.css";

function TableFilter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant, options } = column.columnDef.meta ?? {};

  // console.log("filter value", columnFilterValue);

  let extendedOptions;
  if (options) {
    extendedOptions = [{ value: "all", label: "Hepsi" }, ...options];
  }

  return filterVariant === "date" ? (
    <div>
      <div className={styles.rangeContainer}>
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="date"
          value={(columnFilterValue as [string, string])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [string, string]) => [value, old?.[1]])
          }
          placeholder={`Min`}
        />
        <DebouncedInput
          type="date"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max`}
        />
      </div>
    </div>
  ) : filterVariant === "range" ? (
    <div>
      <div className={styles.rangeContainer}>
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min`}
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max`}
        />
      </div>
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      {/* See faceted column filters example for dynamic select options */}
      {extendedOptions?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ) : filterVariant == "text" ? (
    <DebouncedInput
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
      className={styles.input}
    />
  ) : null;
}

export default TableFilter;
