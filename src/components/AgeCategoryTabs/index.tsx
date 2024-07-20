import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { SetStateAction, useEffect, useState } from "react";
import { AGE_CATEGORY } from "../../type";

const AgeCategoryTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: React.Dispatch<SetStateAction<number>>;
}) => {
  const [tabs, setTabs] = useState<JSX.Element[]>([]);

  useEffect(() => {
    for (let i = 0; i < Object.keys(AGE_CATEGORY).length; i++) {
      setTabs((prevTabs) => [
        ...prevTabs,
        <Tab key={i} label={Object.values(AGE_CATEGORY)[i]} />,
      ]);
    }
  }, []);

  return (
    <Tabs value={activeTab} onChange={(_e, newTab) => setActiveTab(newTab)}>
      {tabs}
    </Tabs>
  );
};

export default AgeCategoryTabs;
