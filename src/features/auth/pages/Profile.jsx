import { useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { useBorrowing } from "../../borrowing/context/BorrowingContext";

export default function Profile() {
  const { user, changePassword, ROLE_LABELS } = useAuth();
  const { borrowings } = useBorrowing();
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  const myBorrowings = borrowings.filter((b) => b.memberName === user.username);
  const activeBorrowings = myBorrowings.filter((b) => b.status === "borrowed");
  const returnedBorrowings = myBorrowings.filter((b) => b.status === "returned");

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!currentPass || !newPass || !confirmPass) {
      setMsg({ type: "error", text: "Please fill in all fields." });
      return;
    }
    if (newPass !== confirmPass) {
      setMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    const result = changePassword(user.username, currentPass, newPass);
    if (result.success) {
      setMsg({ type: "success", text: "Password changed successfully." });
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } else {
      setMsg({ type: "error", text: result.error });
    }
  };

  return (
    <div className="home">
      <h1>My Profile</h1>
      <p className="subtitle">View and manage your account</p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Account Information</h3>
          <div className="profile-info">
            <div className="profile-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="profile-details">
              <div className="profile-row">
                <span className="profile-label">Username</span>
                <span className="profile-value">{user.username}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Role</span>
                <span className="profile-value">
                  <span className="badge">{ROLE_LABELS[user.role]}</span>
                </span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Total Borrowings</span>
                <span className="profile-value">{myBorrowings.length}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Active Borrows</span>
                <span className="profile-value">
                  <span className="badge badge-warning">{activeBorrowings.length}</span>
                </span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Returned</span>
                <span className="profile-value">
                  <span className="badge badge-success">{returnedBorrowings.length}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Change Password</h3>
          {msg.text && (
            <div className={msg.type === "error" ? "auth-error" : "auth-success"}>
              {msg.text}
            </div>
          )}
          <form className="book-form" onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
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
      </div>
    </div>
  );
}
