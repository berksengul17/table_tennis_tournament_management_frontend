import { ColumnFiltersState, createColumnHelper } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { getAgeListByCategoryAndGender } from "../../api/ageCategoryApi";
import { getParticipants } from "../../api/participantAgeCategoryApi";
import Table from "../../components/Table";
import TableEditCell from "../../components/TableEditCell";
import { useAgeCategory } from "../../context/AgeCategoryProvider";
import { useAuth } from "../../context/AuthProvider";
import { Option, ParticipantAgeCategoryDTO } from "../../type";
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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [participants, setParticipants] = useState<ParticipantAgeCategoryDTO[]>(
    []
  );
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [ageListOptions, setAgeListOptions] = useState<Option[]>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor(
        (row) =>
          `${
            row.firstName.slice(0, 1).toUpperCase() + row.firstName.slice(1)
          } ${row.lastName.slice(0, 1).toUpperCase() + row.lastName.slice(1)}`,
        {
          header: "Ad-Soyad",
          filterFn: "includesString",
          meta: {
            type: "text",
            filterVariant: "text",
          },
        }
      ),
      columnHelper.accessor("email", {
        header: "Email",
        filterFn: "includesString",
        meta: {
          type: "text",
          filterVariant: "text",
        },
      }),
      columnHelper.accessor("gender", {
        header: "Cinsiyet",
        filterFn: (row, id, value) => {
          if (value === "all") {
            return true;
          }

          const genderFilter = genderOptions.find(
            (option) => option.value === value
          );
          if (!genderFilter) return false;

          return genderFilter.label.includes(row.getValue(id));
        },
        meta: {
          type: "select",
          filterVariant: "select",
          options: genderOptions,
        },
      }),
      columnHelper.accessor("birthDate", {
        header: "Doğum Tarihi",
        filterFn: (row, id, value) => {
          const date: string = row.getValue(id);
          const [start, end] = value;
          if ((start || end) && !date) return false;

          const dateObj = new Date(date);
          const startDate = new Date(start);
          const endDate = new Date(end);

          if (start && !end) {
            return dateObj.getTime() >= startDate.getTime();
          } else if (!start && end) {
            return dateObj.getTime() <= endDate.getTime();
          } else if (start && end) {
            return (
              dateObj.getTime() >= startDate.getTime() &&
              dateObj.getTime() <= endDate.getTime()
            );
          } else return true;
        },
        meta: {
          type: "date",
          filterVariant: "date",
        },
      }),
      columnHelper.accessor("phoneNumber", {
        header: "Telefon Numarası",
        filterFn: "includesString",
        meta: {
          type: "text",
          filterVariant: "text",
        },
      }),
      columnHelper.accessor("city", {
        header: "Katıldığı Şehir",
        filterFn: "includesString",
        meta: {
          type: "text",
          filterVariant: "text",
        },
      }),
      columnHelper.accessor("category", {
        header: "Kategorisi",
        filterFn: (row, id, value) => {
          if (value === "all") {
            return true;
          }

          const categoryFilter = categoryOptions.find(
            (option) => option.value === value
          );
          if (!categoryFilter) return false;

          return categoryFilter.label.includes(row.getValue(id));
        },
        meta: {
          type: "select",
          filterVariant: "select",
          options: categoryOptions,
        },
      }),
      columnHelper.accessor("age", {
        header: "Yaş",
        filterFn: (row, id, value) => {
          if (value === "all") {
            return true;
          }

          const ageFilter = ageListOptions.find(
            (option) => option.value === value
          );
          if (!ageFilter) return false;

          return ageFilter.label.includes(row.getValue(id));
        },
        meta: {
          type: "select",
          filterVariant: "select",
          options: ageListOptions,
        },
      }),
      columnHelper.accessor("pairName", {
        header: "Eşi",
        filterFn: "includesString",
        meta: {
          type: "text",
          filterVariant: "text",
        },
      }),
      columnHelper.accessor("rating", {
        header: "Puan",
        filterFn: "inNumberRange",
        meta: {
          type: "number",
          filterVariant: "range",
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

  useEffect(() => {
    setCategoryOptions(
      categories.map((category, index) => ({
        value: index.toString(),
        label: category,
      }))
    );
  }, [categories]);

  useEffect(() => {
    setAgeListOptions(
      ageList.map((age, index) => ({
        value: index.toString(),
        label: age,
      }))
    );
  }, [ageList]);

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
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          data={participants}
          setData={isAdminDashboard ? setParticipants : undefined}
        />
      </div>
    )
  );
}

export default ParticipantsPage;
