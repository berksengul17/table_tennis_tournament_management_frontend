import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useState } from "react";
import { getAgeListByCategoryAndGender } from "../../api/ageCategoryApi";
import { useAgeCategory } from "../../context/AgeCategoryProvider";

function CategoryTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { categories, setAgeList } = useAgeCategory();
  const [tabs, setTabs] = useState<JSX.Element[]>([]);

  useEffect(() => {
    setTabs([]);
    for (let i = 0; i < categories.length; i++) {
      setTabs((prevTabs) => [
        ...prevTabs,
        <Tab key={i} label={categories[i]} sx={{ textTransform: "none" }} />,
      ]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setAgeList(await getAgeListByCategoryAndGender(activeTab));
    })();
  }, [activeTab]);

  return (
    <Tabs value={activeTab} onChange={(_e, newTab) => setActiveTab(newTab)}>
      {tabs}
    </Tabs>
  );
}

export default CategoryTabs;
