import { Table } from "@tanstack/react-table";

function TablePagination<T>({ table }: { table: Table<T> }) {
  return (
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
      <div style={{ marginTop: "1rem" }}>
        <span>
          <div>Sayfa</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </strong>
        </span>
        <span>
          {" "}
          | Şu sayfaya git:
          <input
            type="number"
            min={0}
            defaultValue={table.getState().pagination.pageIndex + 1}
            style={{ margin: "0 1rem" }}
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
              {pageSize} adet göster
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TablePagination;
