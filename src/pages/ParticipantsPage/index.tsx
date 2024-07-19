import { createColumnHelper } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { getParticipants } from "../../api/playerApi";
import Table from "../../components/Table";
import { useAuth } from "../../context/AuthProvider";
import { AGE_CATEGORY, Player } from "../../type";
import styles from "./index.module.css";

const columnHelper = createColumnHelper<Player>();

function ParticipantsPage({
  setShowAgeCategoryTable,
}: {
  setShowAgeCategoryTable?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { isAdminDashboard } = useAuth();
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
        cell: (info) => Object.values(AGE_CATEGORY)[info.getValue().category],
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
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Katılımcılar</h1>
            <h3>Katılımcı Sayısı: {participants.length}</h3>
          </div>
          {isAdminDashboard && (
            <button
              onClick={() => setShowAgeCategoryTable?.(true)}
              className={styles.categoryButton}
            >
              Yaş Kategorilerine Ayır
            </button>
          )}
        </div>
        <Table<Player> columns={columns} data={participants} />
      </div>
    )
  );
}

export default ParticipantsPage;
