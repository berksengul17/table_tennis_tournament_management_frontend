import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useState } from "react";
import { useAgeCategory } from "../../context/AgeCategoryProvider";

// TODO BE VE CATEGORYTABS I TEK BİR COMPONENT YAP LİSTEYİ PROP OLARAK VER
const AgeTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { ageList } = useAgeCategory();
  const [tabs, setTabs] = useState<JSX.Element[]>([]);
  useEffect(() => {
    console.log("ageList", ageList);

    setTabs([]);
    for (let i = 0; i < ageList.length; i++) {
      setTabs((prevTabs) => [
        ...prevTabs,
        <Tab
          key={i}
          label={ageList[i]}
          style={{ display: ageList[i] === "" ? "none" : "block" }}
        />,
      ]);
    }
  }, [ageList]);

  return (
    <Tabs value={activeTab} onChange={(_e, newTab) => setActiveTab(newTab)}>
      {tabs}
    </Tabs>
  );
};

export default AgeTabs;
