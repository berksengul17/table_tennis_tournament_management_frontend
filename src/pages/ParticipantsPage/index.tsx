import { createColumnHelper } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { getAgeListByCategoryAndGender } from "../../api/ageCategoryApi";
import { getParticipants } from "../../api/participantAgeCategoryApi";
import Table from "../../components/Table";
import TableEditCell from "../../components/TableEditCell";
import { useAgeCategory } from "../../context/AgeCategoryProvider";
import { useAuth } from "../../context/AuthProvider";
import { ParticipantAgeCategoryDTO } from "../../type";
import styles from "./index.module.css";

const columnHelper = createColumnHelper<ParticipantAgeCategoryDTO>();

const genderOptions = [
  { value: "0", label: "Erkek", categories: ["Erkek", "Karışık"] },
  { value: "1", label: "Kadın", categories: ["Kadın", "Karışık"] },
];

function ParticipantsPage({
  setShowAgeCategoryTable,
}: {
  setShowAgeCategoryTable?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { isAdminDashboard } = useAuth();
  const { categories } = useAgeCategory();
  const [ageList, setAgeList] = useState<string[]>([]);
  const [participants, setParticipants] = useState<ParticipantAgeCategoryDTO[]>(
    []
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
        header: "Ad-Soyad",
        meta: {
          type: "text",
        },
      }),
      columnHelper.accessor("email", {
        header: "Email",
        meta: {
          type: "text",
        },
      }),
      columnHelper.accessor("gender", {
        header: "Cinsiyet",
        meta: {
          type: "select",
          options: genderOptions,
        },
      }),
      columnHelper.accessor("birthDate", {
        header: "Doğum Tarihi",
        meta: {
          type: "date",
        },
      }),
      columnHelper.accessor("phoneNumber", {
        header: "Telefon Numarası",
        meta: {
          type: "text",
        },
      }),
      columnHelper.accessor("city", {
        header: "Katıldığı Şehir",
        meta: {
          type: "text",
        },
      }),
      columnHelper.accessor("category", {
        header: "Kategorisi",
        meta: {
          type: "select",
          options: categories.map((category, index) => ({
            value: index.toString(),
            label: category,
          })),
        },
      }),
      columnHelper.accessor("age", {
        header: "Yaş",
        meta: {
          type: "select",
          options: ageList.map((age, index) => ({
            value: index.toString(),
            label: age,
          })),
        },
      }),
      columnHelper.accessor("pairName", {
        header: "Eşi",
        meta: {
          type: "text",
        },
      }),
      columnHelper.accessor("rating", {
        header: "Puan",
        meta: {
          type: "number",
        },
      }),
      columnHelper.display({
        id: "edit",
        cell: ({ row, table }) => (
          <TableEditCell<ParticipantAgeCategoryDTO> row={row} table={table} />
        ),
      }),
    ],
    [categories, ageList]
  );

  useEffect(() => {
    // fetch participants
    (async () => {
      setParticipants(await getParticipants());
      setAgeList(await getAgeListByCategoryAndGender());
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
          setData={isAdminDashboard ? setParticipants : undefined}
        />
      </div>
    )
  );
}

export default ParticipantsPage;
