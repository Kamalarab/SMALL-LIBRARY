import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";

const LIBRARY_SETTINGS_KEY = "library_settings";

function loadLibrarySettings() {
  try {
    const data = localStorage.getItem(LIBRARY_SETTINGS_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function UserManagement() {
  const { getAllUsers, updateUserRole, deleteUser, user, ROLES, ROLE_LABELS } =
    useAuth();
  const users = getAllUsers();

  const handleRoleChange = (username, newRole) => {
    if (
      confirm(
        `Change ${username}'s role to ${ROLE_LABELS[newRole]}?`
      )
    ) {
      updateUserRole(username, newRole);
    }
  };

  const handleDelete = (username) => {
    if (confirm(`Delete user "${username}"? This cannot be undone.`)) {
      deleteUser(username);
    }
  };

  return (
    <div className="settings-section">
      <h3>User Management</h3>
      <table className="book-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.username}>
              <td>
                {u.username}
                {u.username === user.username && (
                  <span className="badge badge-success" style={{ marginLeft: 8 }}>
                    You
                  </span>
                )}
              </td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) =>
                    handleRoleChange(u.username, e.target.value)
                  }
                  disabled={u.username === user.username}
                  className="role-select"
                >
                  {Object.entries(ROLES).map(([key]) => (
                    <option key={key} value={key}>
                      {ROLE_LABELS[key]}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(u.username)}
                  disabled={u.username === user.username}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PasswordChange() {
  const { user, changePassword } = useAuth();
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!current || !newPass || !confirmPass) {
      setMsg({ type: "error", text: "Please fill in all fields." });
      return;
    }
    if (newPass !== confirmPass) {
      setMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    const result = changePassword(user.username, current, newPass);
    if (result.success) {
      setMsg({ type: "success", text: "Password changed successfully." });
      setCurrent("");
      setNewPass("");
      setConfirmPass("");
    } else {
      setMsg({ type: "error", text: result.error });
    }
  };

  return (
    <div className="settings-section">
      <h3>Change Password</h3>
      {msg.text && (
        <div className={msg.type === "error" ? "auth-error" : "auth-success"}>
          {msg.text}
        </div>
      )}
      <form className="book-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Enter current password"
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Password
        </button>
      </form>
    </div>
  );
}

function AddLibrarian() {
  const { addLibrarian } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!username.trim() || !password || !confirmPassword) {
      setMsg({ type: "error", text: "Please fill in all fields." });
      return;
    }
    if (username.trim().length < 3) {
      setMsg({ type: "error", text: "Username must be at least 3 characters." });
      return;
    }
    if (password.length < 4) {
      setMsg({ type: "error", text: "Password must be at least 4 characters." });
      return;
    }
    if (password !== confirmPassword) {
      setMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    const result = addLibrarian(username.trim(), password);
    if (result.success) {
      setMsg({ type: "success", text: `Librarian "${username.trim()}" created successfully.` });
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } else {
      setMsg({ type: "error", text: result.error });
    }
  };

  return (
    <div className="settings-section">
      <h3>Add Librarian</h3>
      {msg.text && (
        <div className={msg.type === "error" ? "auth-error" : "auth-success"}>
          {msg.text}
        </div>
      )}
      <form className="book-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Librarian
        </button>
      </form>
    </div>
  );
}

function LibrarySettings() {
  const saved = loadLibrarySettings();
  const [libraryName, setLibraryName] = useState(saved?.libraryName ?? "My Library");
  const [maxBorrowDays, setMaxBorrowDays] = useState(saved?.maxBorrowDays ?? 14);
  const [maxBooks, setMaxBooks] = useState(saved?.maxBooks ?? 5);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    const settings = { libraryName, maxBorrowDays: Number(maxBorrowDays), maxBooks: Number(maxBooks) };
    localStorage.setItem(LIBRARY_SETTINGS_KEY, JSON.stringify(settings));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="settings-section">
      <h3>Library Configuration</h3>
      {showSaved && <div className="auth-success">Settings saved.</div>}
      <div className="book-form">
        <div className="form-group">
          <label>Library Name</label>
          <input
            type="text"
            value={libraryName}
            onChange={(e) => setLibraryName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Max Borrow Days</label>
          <input
            type="number"
            value={maxBorrowDays}
            onChange={(e) => setMaxBorrowDays(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Max Books Per Member</label>
          <input
            type="number"
            value={maxBooks}
            onChange={(e) => setMaxBooks(Number(e.target.value))}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
}

function ResetSystem() {
  const { resetSystem } = useAuth();
  const navigate = useNavigate();

  const handleReset = () => {
    if (
      confirm(
        "WARNING: This will delete ALL user accounts and reset the system. You will need to set up a new Administrator. This cannot be undone. Continue?"
      )
    ) {
      resetSystem();
      navigate("/setup");
    }
  };

  return (
    <div className="settings-section">
      <h3>Reset System</h3>
      <p style={{ marginBottom: 12, color: "#666" }}>
        Remove all user accounts and start fresh. You will need to create a new
        Administrator account.
      </p>
      <button className="btn btn-delete" onClick={handleReset}>
        Reset All Users
      </button>
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="home">
      <h1>Settings</h1>
      <p className="subtitle">Account and system configuration</p>

      <PasswordChange />

      {(user.role === "admin" || user.role === "librarian") && (
        <LibrarySettings />
      )}

      {user.role === "admin" && <AddLibrarian />}
      {user.role === "admin" && <UserManagement />}
      {user.role === "admin" && <ResetSystem />}
    </div>
  );
}
