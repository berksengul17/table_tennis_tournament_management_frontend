import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { createColumnHelper } from "@tanstack/react-table";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { createGroupsForAgeCategory, getAllGroups } from "../../api/groupApi";
import { AGE_CATEGORY, Group, Player } from "../../type";
import Table from "../Table";
import styles from "./index.module.css";

const CustomTabPanel = ({
  value,
  index,
  children,
}: { value: number; index: number } & PropsWithChildren) => {
  return <>{value === index && children}</>;
};

const columnHelper = createColumnHelper<Player>();

function GroupsTable() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const columns = useMemo(
    () => [
      columnHelper.accessor("firstName", {
        header: "Ad",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("lastName", {
        header: "Soyad",
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
    // fetch participants
    (async () => {
      let groups = await getAllGroups();

      if (groups.length == 0) {
        for (let i = 0; i < Object.keys(AGE_CATEGORY).length; i++) {
          groups = groups.concat(await createGroupsForAgeCategory(i));
        }
      }

      setGroups(groups);
    })();
  }, []);

  useEffect(() => {
    console.log("groups use effect", groups);
  }, [groups]);

  return (
    <div>
      {renderTabs()}
      {Object.keys(AGE_CATEGORY).map((_, index) => (
        <CustomTabPanel key={index} value={activeTab} index={index}>
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <p>
                Toplam Katılımcı Sayısı:{" "}
                {groups
                  .filter((group) => group.ageCategory === index)
                  .reduce(
                    (acc, group) => acc + (group.participants?.length ?? 0),
                    0
                  )}
              </p>
            </div>
          </div>
          <div className={styles.tables}>
            {groups
              .filter((group) => group.ageCategory === index)
              .map((group) => (
                <Table<Player>
                  key={group.id}
                  columns={columns}
                  data={group.participants}
                />
              ))}
          </div>
        </CustomTabPanel>
      ))}
    </div>
  );
}

export default GroupsTable;
