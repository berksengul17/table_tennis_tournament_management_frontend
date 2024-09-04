import { Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";

const BRACKET_TYPES = ["Final", "Consolation"];

function BracketTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [tabs, setTabs] = useState<JSX.Element[]>([]);
  useEffect(() => {
    setTabs([]);
    for (let i = 0; i < BRACKET_TYPES.length; i++) {
      setTabs((prevTabs) => [
        ...prevTabs,
        <Tab key={i} label={BRACKET_TYPES[i]} sx={{ textTransform: "none" }} />,
      ]);
    }
  }, []);

  return (
    <Tabs value={activeTab} onChange={(_e, newTab) => setActiveTab(newTab)}>
      {tabs}
    </Tabs>
  );
}

export default BracketTabs;
