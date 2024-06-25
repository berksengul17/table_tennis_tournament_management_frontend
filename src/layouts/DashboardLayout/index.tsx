import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import DashboardHeader from "./components/DashboardHeader";

const DashboardLayout = () => {
  const { admin } = useAuth();

  return (
    <div style={{ height: "100%" }}>
      {admin && <DashboardHeader />}
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
