import { ColumnFiltersState, createColumnHelper } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { getAgeListByCategoryAndGender } from "../../api/ageCategoryApi";
import {
  getParticipants,
  updateParticipant,
} from "../../api/participantAgeCategoryApi";
import Table from "../../components/Table";
import TableEditCell from "../../components/TableEditCell";
import { useAgeCategory } from "../../context/AgeCategoryProvider";
import { useAuth } from "../../context/AuthProvider";
import { Option, ParticipantAgeCategoryDTO } from "../../type";
import styles from "./index.module.css";
import { deleteParticipant, register } from "../../api/participantApi";
import { participantInputsDefaultValues } from "../../utils";

type EditedRow = {
  [key: string]: {
    selectedGender: string;
    selectedCategory: string;
  };
};

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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [participants, setParticipants] = useState<ParticipantAgeCategoryDTO[]>(
    []
  );
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [ageListOptions, setAgeListOptions] = useState<Option[]>([]);
  // const [selectedGender, setSelectedGender] = useState<string>("0");
  // const [selectedCategory, setSelectedCategory] = useState<string>("0");
  const [editedRows, setEditedRows] = useState<EditedRow[]>([]);
  const [rowAgeListOptions, setRowAgeListOptions] = useState<{
    [key: string]: Option[];
  }>({});

  const columns = useMemo(
    () => [
      columnHelper.accessor(
        (row) => {
          const names = (row.firstName + " " + row.lastName).split(" ");
          return names
            .map((name) => name.slice(0, 1).toUpperCase() + name.slice(1))
            .join(" ");
        },
        {
          id: "fullName",
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
          options: () => genderOptions,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>, rowId) => {
            setEditedRows((old) =>
              old.map((row) => {
                if (row[rowId]) {
                  return {
                    ...row,
                    [rowId]: { ...row[rowId], selectedGender: e.target.value },
                  };
                }
                return row;
              })
            );
          },
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
          options: (rowId) => {
            if (rowId !== undefined) {
              const editedRow = editedRows.find((row) => row[rowId]);
              if (editedRow !== undefined) {
                const selectedGender = editedRow[rowId].selectedGender;
                const gender = genderOptions.find(
                  (option) => option.value === selectedGender
                );
                const filteredCategories = categories.filter((category) =>
                  gender?.categories.some((gCategory) =>
                    category.includes(gCategory)
                  )
                );

                return filteredCategories.map((category, index) => ({
                  value: index.toString(),
                  label: category,
                }));
              }

              return [];
            }

            return categoryOptions;
          },
          onChange: (e, rowId) => {
            setEditedRows((old) =>
              old.map((row) => {
                if (row[rowId]) {
                  return {
                    ...row,
                    [rowId]: {
                      ...row[rowId],
                      selectedCategory: e.target.value,
                    },
                  };
                }
                return row;
              })
            );
          },
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
          options: (rowId) => {
            if (rowId !== undefined) {
              return rowAgeListOptions[rowId] || [];
            }

            return ageListOptions;
          },
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
          <TableEditCell<ParticipantAgeCategoryDTO>
            row={row}
            table={table}
            onPressEdit={(rowId) => {
              const selectedGender = genderOptions.find(
                (gender) => gender.label === row.original.gender
              )?.value;
              const selectedCategory = categoryOptions.find(
                (category) =>
                  category.label === row.original.category.toString()
              )?.value;
              setEditedRows((old) => [
                ...old,
                {
                  [rowId]: {
                    selectedGender: selectedGender ? selectedGender : "0",
                    selectedCategory: selectedCategory ? selectedCategory : "0",
                  },
                },
              ]);
            }}
            onDone={(rowId) => {
              setEditedRows((old) =>
                old.filter((row) => row[rowId] === undefined)
              );
            }}
          />
        ),
      }),
    ],
    [categories, editedRows, rowAgeListOptions, categoryOptions]
  );

  const addRow = async () => {
    const newParticipant = await register({
      ...participantInputsDefaultValues,
      rating: 0,
    });

    if (newParticipant != null) {
      setParticipants((old) => [newParticipant, ...old]);
    }
  };

  // TODO type tanımları nasıl daha iyi olabilirdi?
  const updateRow = async (
    participantAgeCategory: any & { fullName: string }
  ) => {
    let firstName = participantAgeCategory.firstName.trim();
    let lastName = participantAgeCategory.lastName.trim();
    if (participantAgeCategory.fullName) {
      participantAgeCategory.fullName = participantAgeCategory.fullName.trim();
      const names = participantAgeCategory.fullName.split(" ");
      firstName = names.slice(0, names.length - 1).join(" ");
      lastName = names[names.length - 1];
    }

    const updatedData: ParticipantAgeCategoryDTO = {
      ...participantAgeCategory,
      firstName,
      lastName,
    };

    const updatedParticipant = await updateParticipant(updatedData);

    if (updatedParticipant != null) {
      setParticipants((old) =>
        old.map((p) => (p.id === updatedData.id ? updatedParticipant : p))
      );
    }
  };

  const removeRow = async (participantId: number) => {
    await deleteParticipant(participantId);

    setParticipants((old) => [
      ...old.filter((participant) => participant.id !== participantId),
    ]);
  };

  useEffect(() => {
    (async () => {
      setParticipants(await getParticipants());
      const ageList = await getAgeListByCategoryAndGender();
      setAgeListOptions(
        ageList.map((age, index) => ({
          value: index.toString(),
          label: age,
        }))
      );
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
    const fetchAgeListOptions = async (
      rowId: string,
      selectedCategory: string,
      selectedGender: string
    ) => {
      const ageList = await getAgeListByCategoryAndGender(
        parseInt(selectedCategory),
        selectedGender
      );

      setRowAgeListOptions((prev) => ({
        ...prev,
        [rowId]: ageList.map((age, index) => ({
          value: index.toString(),
          label: age,
        })),
      }));
    };

    editedRows.forEach((editedRow) => {
      const rowId = Object.keys(editedRow)[0];
      const { selectedCategory, selectedGender } = editedRow[rowId];
      fetchAgeListOptions(rowId, selectedCategory, selectedGender);
    });
  }, [editedRows]);

  // useEffect(() => {
  //   if (selectedGender) {
  //     const gender = genderOptions.find(
  //       (option) => option.value === selectedGender
  //     );

  //     const filteredCategories = categories.filter((category) =>
  //       gender?.categories.some((gCategory) => category.includes(gCategory))
  //     );

  //     console.log(filteredCategories);

  //     setCategoryOptions(
  //       filteredCategories.map((category, index) => ({
  //         value: index.toString(),
  //         label: category,
  //       }))
  //     );
  //   }
  // }, [selectedGender, categories]);

  // useEffect(() => {
  //   if (categoryOptions.length > 0) {
  //     (async () => {
  //       const ageList = await getAgeListByCategoryAndGender(
  //         parseInt(selectedCategory),
  //         selectedGender
  //       );
  //       setAgeListOptions(
  //         ageList.map((age, index) => ({
  //           value: index.toString(),
  //           label: age,
  //         }))
  //       );
  //     })();
  //   }
  // }, [categoryOptions, selectedCategory]);

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
          addRow={isAdminDashboard ? addRow : undefined}
          updateRow={isAdminDashboard ? updateRow : undefined}
          removeRow={isAdminDashboard ? removeRow : undefined}
        />
      </div>
    )
  );
}

export default ParticipantsPage;
