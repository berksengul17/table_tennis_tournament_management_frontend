import { createColumnHelper } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { getParticipants } from "../../api/participantAgeCategoryApi";
import Table from "../../components/Table";
import { useAuth } from "../../context/AuthProvider";
import { ParticipantAgeCategoryDTO } from "../../type";
import styles from "./index.module.css";

const columnHelper = createColumnHelper<ParticipantAgeCategoryDTO>();

function ParticipantsPage({
  setShowAgeCategoryTable,
}: {
  setShowAgeCategoryTable?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { isAdminDashboard } = useAuth();
  const [participants, setParticipants] = useState<ParticipantAgeCategoryDTO[]>(
    []
  );
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
        header: "Ad-Soyad",
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
      columnHelper.accessor("category", {
        header: "Kategorisi",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("age", {
        header: "Yaş",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("pairName", {
        header: "Eşi",
        cell: (info) => info.getValue(),
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
        <Table<ParticipantAgeCategoryDTO>
          columns={columns}
          data={participants}
        />
      </div>
    )
  );
}

export default ParticipantsPage;
