import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import {
  createAgeCategories,
  getAgeCategories,
} from "../../api/ageCategoryApi";
import { getParticipants } from "../../api/participantAgeCategoryApi";
import AgeCategoryTabs from "../../components/AgeCategoryTabs";
import CategoryTabs from "../../components/CategoryTabs";
import Table from "../../components/Table";
import TableEditCell from "../../components/TableEditCell";
import { useAgeCategory } from "../../context/AgeCategoryProvider";
import { AgeCategory, ParticipantAgeCategoryDTO } from "../../type";
import styles from "./index.module.css";

const columnHelper = createColumnHelper<ParticipantAgeCategoryDTO>();

function AgeCategoryPage({
  setShowGroups,
}: {
  setShowGroups: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { categories, ageList } = useAgeCategory();
  const [participants, setParticipants] = useState<ParticipantAgeCategoryDTO[]>(
    []
  );
  const [ageCategories, setAgeCategories] = useState<AgeCategory[]>([]);
  const [categoryActiveTab, setCategoryActiveTab] = useState<number>(0);
  const [ageActiveTab, setAgeActiveTab] = useState<number>(0);

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
          options: [
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
        cell: TableEditCell<ParticipantAgeCategoryDTO>,
      }),
    ],
    []
  );

  useEffect(() => {
    // fetch participants
    (async () => {
      let categories = await getAgeCategories();
      if (categories.length == 0) {
        categories = await createAgeCategories();
      }

      setAgeCategories(categories);
    })();

    return () => {
      setAgeCategories([]);
    };
  }, []);

  useEffect(() => {
    console.log(categoryActiveTab, ageActiveTab);

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
            <button onClick={() => setShowGroups(true)}>Gruplara Ayır</button>
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
