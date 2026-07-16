import { createContext, useContext, useState, useEffect, useCallback } from "react";
import bcrypt from "bcryptjs";

const AuthContext = createContext();

const USERS_KEY = "library_users";
const SESSION_KEY = "library_session";

const ROLES = {
  admin: "admin",
  librarian: "librarian",
  member: "member",
};

const ROLE_LABELS = {
  admin: "Administrator",
  librarian: "Librarian",
  member: "Member",
};

const ROLE_ICONS = {
  admin: "\uD83D\uDC51",
  librarian: "\uD83D\uDCDA",
  member: "\uD83D\uDC68\u200D\uD83C\uDF93",
};

const PERMISSIONS = {
  admin: [
    "books.view", "books.add", "books.edit", "books.delete",
    "members.view", "members.add", "members.edit", "members.delete",
    "borrowing.view", "borrowing.issue", "borrowing.return", "borrowing.manage",
    "categories.view", "categories.add", "categories.edit", "categories.delete",
    "reports.view", "reports.export",
    "fines.manage", "fines.view",
    "settings.manage",
    "users.view", "users.manage", "users.delete",
    "profile.view", "profile.edit",
  ],
  librarian: [
    "books.view", "books.add", "books.edit", "books.delete",
    "members.view", "members.add", "members.edit",
    "borrowing.view", "borrowing.issue", "borrowing.return",
    "fines.view", "reports.view",
    "profile.view", "profile.edit",
  ],
  member: [
    "books.view", "books.search", "books.filter",
    "borrowing.view", "borrowing.request", "borrowing.return",
    "fines.view",
    "profile.view", "profile.edit",
  ],
};

function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function seedDefaultAdmin() {
  const users = getUsers();
  const existing = users.find((u) => u.username === "admin");
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync("admin123", salt);
  if (existing) {
    if (existing.role !== ROLES.admin || !bcrypt.compareSync("admin123", existing.password)) {
      existing.role = ROLES.admin;
      existing.password = hashedPassword;
      saveUsers(users);
    }
  } else {
    users.push({
      username: "admin",
      password: hashedPassword,
      role: ROLES.admin,
      createdAt: new Date().toISOString(),
    });
    saveUsers(users);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdminSetup = useCallback(() => {
    return getUsers().some((u) => u.role === ROLES.admin);
  }, []);

  useEffect(() => {
    seedDefaultAdmin();
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const hasPermission = useCallback(
    (permission) => {
      if (!user) return false;
      return PERMISSIONS[user.role]?.includes(permission) ?? false;
    },
    [user]
  );

  const hasRole = useCallback(
    (roles) => {
      if (!user) return false;
      if (Array.isArray(roles)) return roles.includes(user.role);
      return user.role === roles;
    },
    [user]
  );

  const createAdmin = (username, password) => {
    const users = getUsers();
    if (users.some((u) => u.role === ROLES.admin)) {
      return { success: false, error: "Administrator already exists" };
    }
    if (users.find((u) => u.username === username)) {
      return { success: false, error: "Username already exists" };
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = {
      username,
      password: hashedPassword,
      role: ROLES.admin,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
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
    const sessionUser = { username: found.username, role: found.role };
    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return { success: true, role: found.role };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const getAllUsers = () => {
    return getUsers().map(({ password: _pw, ...rest }) => rest);
  };

  const addLibrarian = (username, password) => {
    const users = getUsers();
    if (users.find((u) => u.username === username)) {
      return { success: false, error: "Username already exists" };
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    users.push({
      username,
      password: hashedPassword,
      role: ROLES.librarian,
      createdAt: new Date().toISOString(),
    });
    saveUsers(users);
    return { success: true };
  };

  const addMember = (username, password) => {
    const users = getUsers();
    if (users.find((u) => u.username === username)) {
      return { success: false, error: "Username already exists" };
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    users.push({
      username,
      password: hashedPassword,
      role: ROLES.member,
      createdAt: new Date().toISOString(),
    });
    saveUsers(users);
    return { success: true };
  };

  const signup = (username, password, role) => {
    if (!Object.values(ROLES).includes(role) || role === ROLES.admin) {
      return { success: false, error: "Invalid role" };
    }
    if (username.length < 3) {
      return { success: false, error: "Username must be at least 3 characters" };
    }
    if (password.length < 4) {
      return { success: false, error: "Password must be at least 4 characters" };
    }
    const users = getUsers();
    if (users.find((u) => u.username === username)) {
      return { success: false, error: "Username already exists" };
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    users.push({
      username,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    });
    saveUsers(users);
    return { success: true };
  };

  const updateUserRole = (username, newRole) => {
    if (!Object.values(ROLES).includes(newRole)) {
      return { success: false, error: "Invalid role" };
    }
    const users = getUsers();
    const idx = users.findIndex((u) => u.username === username);
    if (idx === -1) {
      return { success: false, error: "User not found" };
    }
    if (users[idx].role === ROLES.admin && newRole !== ROLES.admin) {
      const adminCount = users.filter((u) => u.role === ROLES.admin).length;
      if (adminCount <= 1) {
        return { success: false, error: "Cannot demote the last administrator" };
      }
    }
    users[idx].role = newRole;
    saveUsers(users);
    if (user && user.username === username) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    }
    return { success: true };
  };

  const deleteUser = (username) => {
    if (user && user.username === username) {
      return { success: false, error: "Cannot delete your own account" };
    }
    const users = getUsers();
    const target = users.find((u) => u.username === username);
    if (target && target.role === ROLES.admin) {
      const adminCount = users.filter((u) => u.role === ROLES.admin).length;
      if (adminCount <= 1) {
        return { success: false, error: "Cannot delete the last administrator" };
      }
    }
    const filtered = users.filter((u) => u.username !== username);
    if (filtered.length === users.length) {
      return { success: false, error: "User not found" };
    }
    saveUsers(filtered);
    return { success: true };
  };

  const changePassword = (username, currentPassword, newPassword) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.username === username);
    if (idx === -1) {
      return { success: false, error: "User not found" };
    }
    const valid = bcrypt.compareSync(currentPassword, users[idx].password);
    if (!valid) {
      return { success: false, error: "Current password is incorrect" };
    }
    if (newPassword.length < 4) {
      return { success: false, error: "New password must be at least 4 characters" };
    }
    const salt = bcrypt.genSaltSync(10);
    users[idx].password = bcrypt.hashSync(newPassword, salt);
    saveUsers(users);
    return { success: true };
  };

  const resetSystem = () => {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdminSetup,
        createAdmin,
        login,
        logout,
        hasPermission,
        hasRole,
        getAllUsers,
        addLibrarian,
        addMember,
        signup,
        updateUserRole,
        deleteUser,
        changePassword,
        resetSystem,
        ROLES,
        ROLE_LABELS,
        ROLE_ICONS,
        PERMISSIONS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
