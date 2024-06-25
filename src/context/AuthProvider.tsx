import { PropsWithChildren, createContext, useContext, useState } from "react";

type Admin = {
  id: string;
  name: string;
};

type AuthContextProps = {
  admin: Admin | null;
  login: (username: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const storedAdmin = localStorage.getItem("admin");
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });

  const login = (username: string, password: string) => {
    if (username === "admin" && password === "admin") {
      const adminData = { id: "1", name: "Admin" };
      setAdmin(adminData);
      localStorage.setItem("admin", JSON.stringify(adminData));
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  const value = { admin, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
