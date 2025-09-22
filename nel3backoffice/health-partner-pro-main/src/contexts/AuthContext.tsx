import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type UserRole = "nel3" | "hospital";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signInAsNel3: () => void;
  signInAsHospital: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "hp_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: AuthUser = JSON.parse(raw);
        setUser(parsed);
      }
    } catch {}
  }, []);

  const persist = useCallback((u: AuthUser | null) => {
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const signInAsNel3 = useCallback(() => {
    const u: AuthUser = {
      id: "u_nel3",
      name: "NEL3 Admin",
      email: "admin@nel3.com",
      role: "nel3",
    };
    setUser(u);
    persist(u);
  }, [persist]);

  const signInAsHospital = useCallback(() => {
    const u: AuthUser = {
      id: "u_hospital_1",
      name: "Hospital São Lucas",
      email: "contato@saolucas.com.br",
      role: "hospital",
    };
    setUser(u);
    persist(u);
  }, [persist]);

  const signOut = useCallback(() => {
    setUser(null);
    persist(null);
  }, [persist]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    signInAsNel3,
    signInAsHospital,
    signOut,
  }), [user, signInAsNel3, signInAsHospital, signOut]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}




