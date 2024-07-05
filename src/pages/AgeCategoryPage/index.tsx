import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { createColumnHelper } from "@tanstack/react-table";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import {
  createAgeCategories,
  getAgeCategories,
} from "../../api/ageCategoryApi";
import Table from "../../components/Table";
import { AGE_CATEGORY, AgeCategory, Player } from "../../type";
import styles from "./index.module.css";

const CustomTabPanel = ({
  value,
  index,
  children,
}: { value: number; index: number } & PropsWithChildren) => {
  return <>{value === index && children}</>;
};

const columnHelper = createColumnHelper<Player>();

function AgeCategoryPage({
  setShowGroups,
}: {
  setShowGroups: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [ageCategories, setAgeCategories] = useState<AgeCategory[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
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

  const renderTabs = () => {
    const tabs = [];

    for (let i = 0; i < Object.keys(AGE_CATEGORY).length; i++) {
      tabs.push(<Tab key={i} label={Object.values(AGE_CATEGORY)[i]} />);
    }

    return (
      <Tabs value={activeTab} onChange={(_e, newTab) => setActiveTab(newTab)}>
        {tabs}
      </Tabs>
    );
  };

  useEffect(() => {
    console.log("age category use effect");
    // fetch participants
    (async () => {
      let categories = await getAgeCategories();
      console.log("categories", categories);
      if (categories.length == 0) {
        console.log("creating categories");
        categories = await createAgeCategories();
      }

      setAgeCategories(categories);
    })();

    return () => {
      setAgeCategories([]);
    };
  }, []);

  return (
    <div className={styles.container}>
      {renderTabs()}
      {Object.keys(AGE_CATEGORY).map((_, index) => (
        <CustomTabPanel key={index} value={activeTab} index={index}>
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <p>
                Toplam Katılımcı Sayısı:{" "}
                {ageCategories[index]
                  ? ageCategories[index].participants?.length ?? 0
                  : 0}
              </p>
              <button onClick={() => setShowGroups(true)}>Gruplara Ayır</button>
            </div>
            <Table<Player>
              columns={columns}
              data={ageCategories[index] && ageCategories[index].participants}
            />
          </div>
        </CustomTabPanel>
      ))}
    </div>
  );
}

export default AgeCategoryPage;
