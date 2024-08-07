import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Admin } from "../type";
import { loginAdmin } from "../api/adminApi";

type AuthContextProps = {
  admin: Admin | null;
  isAdminDashboard: boolean;
  setAdminDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const storedAdmin = localStorage.getItem("admin");
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });
  const [isAdminDashboard, setAdminDashboard] = useState<boolean>(false);

  const login = (username: string, password: string): boolean => {
    let success = false;
    loginAdmin(username, password).then((adminData) => {
      if (adminData) {
        setAdmin(adminData);
        localStorage.setItem("admin", JSON.stringify(adminData));
        success = true;
      }
    });
    return success;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  const value = { admin, isAdminDashboard, setAdminDashboard, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
