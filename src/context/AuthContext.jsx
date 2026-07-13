import { createContext, useContext, useState, useEffect } from "react";
import bcrypt from "bcryptjs";

const AuthContext = createContext();

const USERS_KEY = "library_users";
const SESSION_KEY = "library_session";

function getUsers() {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      setUser(JSON.parse(session));
    }
    setLoading(false);
  }, []);

  const signup = (username, password) => {
    const users = getUsers();
    if (users.find((u) => u.username === username)) {
      return { success: false, error: "Username already exists" };
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = { username, password: hashedPassword };
    users.push(newUser);
    saveUsers(users);
    const sessionUser = { username };
    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return { success: true };
  };

  const login = (username, password) => {
    const users = getUsers();
    const found = users.find((u) => u.username === username);
    if (!found) {
      return { success: false, error: "Invalid username or password" };
    }
    const valid = bcrypt.compareSync(password, found.password);
    if (!valid) {
      return { success: false, error: "Invalid username or password" };
    }
    const sessionUser = { username };
    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
