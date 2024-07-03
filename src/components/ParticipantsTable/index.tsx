import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { getParticipants } from "../../api/playerApi";
import { AGE_CATEGORY, Player } from "../../type";
import Table from "../Table";
import styles from "./index.module.css";

const columnHelper = createColumnHelper<Player>();

function ParticipantsTable() {
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
          const date = new Date(info.getValue() as string);
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
        cell: (info) => Object.values(AGE_CATEGORY)[info.getValue()],
      }),
      columnHelper.accessor("rating", {
        header: "Puan",
        cell: (info) => info.getValue(),
      }),
    ],
    []
  );

  useEffect(() => {
    // fetch participants
    (async () => {
      setParticipants(await getParticipants());
    })();
  }, []);

  return (
    participants && (
      <>
        <div className={styles.header}>
          <h1>Katılımcılar</h1>
          <h3>Katılımcı Sayısı: {participants.length}</h3>
        </div>
        <Table<Player> columns={columns} data={participants} />;
      </>
    )
  );
}

export default ParticipantsTable;
