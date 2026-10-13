import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service";
import { accountService } from "../services/account.service";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [loading, setLoading] = useState(true);

  const saveUser = (u) => {
    setUser(u);
    u ? localStorage.setItem("user", JSON.stringify(u)) : localStorage.removeItem("user");
  };

  // Backend me /me route nahi hai, isliye refresh pe protected route se session verify karte hain
  useEffect(() => {
    const expire = () => saveUser(null);
    window.addEventListener("auth:expired", expire);

    if (user) {
      accountService.getAll().catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    return () => window.removeEventListener("auth:expired", expire);
    // eslint-disable-next-line
  }, []);

  const login = async (form) => saveUser((await authService.login(form)).data.user);
  const register = async (form) => saveUser((await authService.register(form)).data.user);
  const logout = async () => {
    try { await authService.logout(); } finally { saveUser(null); }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
