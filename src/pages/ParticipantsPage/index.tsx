import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { getParticipants } from "../../api/playerApi";
import { Player } from "../../type";
import styles from "./index.module.css";

const convertIntToAgeCategory = (intCategory: number) => {
  switch (intCategory) {
    case 0:
      return "40-49";
    case 1:
      return "50-59";
    case 2:
      return "60-69";
    case 3:
      return "70+";
  }
};

const fallbackData: Player[] = [];

const columnHelper = createColumnHelper<Player>();

function ParticipantsPage() {
  const [participants, setParticipants] = useState<Player[]>([]);
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "No.",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("firstName", {
        header: "Ad",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("lastName", {
        header: "Soyad",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("gender", {
        header: "Cinsiyet",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("birthDate", {
        header: "Doğum Tarihi",
        cell: (info) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString("en-GB");
        },
      }),
      columnHelper.accessor("phoneNumber", {
        header: "Telefon Numarası",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("city", {
        header: "Katıldığı Şehir",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("ageCategory", {
        header: "Yaş Kategorisi",
        cell: (info) => convertIntToAgeCategory(info.getValue()),
      }),
      columnHelper.accessor("rating", {
        header: "Puan",
        cell: (info) => info.getValue(),
      }),
    ],
    []
  );
  const table = useReactTable({
    data: participants ?? fallbackData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    (async () => {
      try {
        setParticipants(await getParticipants());
      } catch (error) {
        console.error("Failed to load participants:", error);
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Katılımcılar</h1>
      <>
        <span style={{ marginBottom: "2rem" }}>
          Toplam katılımcı sayısı: {participants.length}
        </span>
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
    </div>
  );
}

export default ParticipantsPage;
