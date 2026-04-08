import React, { createContext, useContext, useState, useEffect } from "react";
import { type UserRole } from "./data"; // "student" | "admin_officer" | "sso" | "manager" | "director"

export type AppRole = "student" | "staff" | "admin";

export interface UserAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: AppRole;
}

interface AuthContextType {
  currentUser: UserAccount | null;
  users: UserAccount[];
  login: (email: string, pass: string) => boolean;
  register: (firstName: string, lastName: string, email: string, pass: string, role: AppRole) => boolean;
  logout: () => void;
}

const MOCK_USERS: UserAccount[] = [
  { id: "STU-001", firstName: "Alex", lastName: "Johnson", email: "student@uni.edu.vn", password: "password", role: "student" },
  { id: "STF-001", firstName: "Sarah", lastName: "Webb", email: "staff@uni.edu.vn", password: "password", role: "staff" },
  { id: "MGR-001", firstName: "Admin", lastName: "Director", email: "admin@uni.edu.vn", password: "password", role: "admin" },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem("unilink-users");
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem("unilink-auth");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("unilink-users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("unilink-auth", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("unilink-auth");
    }
  }, [currentUser]);

  const login = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (firstName: string, lastName: string, email: string, pass: string, role: AppRole) => {
    if (users.some(u => u.email === email)) return false;
    const prefix = role === "student" ? "STU" : role === "staff" ? "STF" : "MGR";
    const newUser: UserAccount = {
      id: `${prefix}-${Date.now()}`,
      firstName,
      lastName,
      email,
      password: pass,
      role,
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
