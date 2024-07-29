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
import { AgeCategory, ParticipantAgeCategoryDTO } from "../../type";
import styles from "./index.module.css";

const columnHelper = createColumnHelper<ParticipantAgeCategoryDTO>();

function AgeCategoryPage({
  setShowGroups,
}: {
  setShowGroups: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
    </div>
  );
}

export default AgeCategoryPage;
