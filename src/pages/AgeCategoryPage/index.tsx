import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { getParticipants } from "../../api/participantAgeCategoryApi";
import AgeCategoryTabs from "../../components/AgeCategoryTabs";
import CategoryTabs from "../../components/CategoryTabs";
import Table from "../../components/Table";
import TableEditCell from "../../components/TableEditCell";
import { ParticipantAgeCategoryDTO } from "../../type";
import styles from "./index.module.css";
import { downloadAgeCategoriesPdf } from "../../api/documentApi";
import { useAuth } from "../../context/AuthProvider";

const columnHelper = createColumnHelper<ParticipantAgeCategoryDTO>();

function AgeCategoryPage({
  setShowGroups,
}: {
  setShowGroups: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [participants, setParticipants] = useState<ParticipantAgeCategoryDTO[]>(
    []
  );
  const [categoryActiveTab, setCategoryActiveTab] = useState<number>(0);
  const [ageActiveTab, setAgeActiveTab] = useState<number>(0);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "rowNumber",
        header: "No",
        cell: (info) => info.row.index + 1, // Row numbers start from 1
        meta: {
          type: "text",
        },
      }),
      columnHelper.accessor(
        (row) => {
          const names = (row.firstName + " " + row.lastName).split(" ");
          return names
            .map((name) => name.slice(0, 1).toUpperCase() + name.slice(1))
            .join(" ");
        },
        {
          header: "Ad-Soyad",
          meta: {
            type: "text",
          },
        }
      ),
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
          options: () => [
            { value: "0", label: "Erkek" },
            { value: "1", label: "Kadın" },
          ],
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
      // columnHelper.accessor("category", {
      //   header: "Kategorisi",
      //   meta: {
      //     type: "select",
      //     options: categories.map((category, index) => ({
      //       value: index.toString(),
      //       label: category,
      //     })),
      //   },
      // }),
      // columnHelper.accessor("age", {
      //   header: "Yaş",
      //   meta: {
      //     type: "select",
      //     options: ageList.map((age, index) => ({
      //       value: index.toString(),
      //       label: age,
      //     })),
      //   },
      // }),
      columnHelper.accessor(
        (row) => {
          const names = row.pairName.split(" ");
          return names
            .map((name) => name.slice(0, 1).toUpperCase() + name.slice(1))
            .join(" ");
        },
        {
          header: "Eşi",
          meta: {
            type: "text",
          },
        }
      ),
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
    []
  );

  const downloadPdf = async () => {
    await downloadAgeCategoriesPdf();
  };

  // useEffect(() => {
  //   // fetch participants
  //   (async () => {
  //     let categories = await getAgeCategories();
  //     if (categories.length == 0) {
  //       categories = await createAgeCategories();
  //     }

  //     setAgeCategories(categories);
  //   })();

  //   return () => {
  //     setAgeCategories([]);
  //   };
  // }, []);

  useEffect(() => {
    (async () => {
      setParticipants(await getParticipants(categoryActiveTab, ageActiveTab));
    })();
  }, [categoryActiveTab, ageActiveTab]);

  return (
    <div className={styles.container}>
      <CategoryTabs
        activeTab={categoryActiveTab}
        setActiveTab={setCategoryActiveTab}
      />
      <AgeCategoryTabs
        activeTab={ageActiveTab}
        setActiveTab={setAgeActiveTab}
      />
      {participants && (
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <p>Toplam Katılımcı Sayısı: {participants.length}</p>
            <div className={styles.buttonContainer}>
              <button onClick={downloadPdf}>Yaş Kategorileri PDF İndir</button>
              <button onClick={() => setShowGroups(true)}>Gruplara Ayır</button>
            </div>
          </div>
          <Table<ParticipantAgeCategoryDTO>
            columns={columns}
            data={participants}
            setData={setParticipants}
          />
        </div>
      )}
    </div>
  );
}

export default AgeCategoryPage;
