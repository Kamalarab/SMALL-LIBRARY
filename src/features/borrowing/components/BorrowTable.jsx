import { useBorrowing } from "../context/BorrowingContext";
import { useAuth } from "../../auth/context/AuthContext";

export default function BorrowTable({ borrowings, showMember = true }) {
  const { returnBook } = useBorrowing();
  const { user } = useAuth();
  const canManage = user && (user.role === "admin" || user.role === "librarian");

  if (!borrowings || borrowings.length === 0) {
    return <p className="empty-message">No borrowing records found.</p>;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString();
  };

  const isOverdue = (b) =>
    b.status === "borrowed" && new Date(b.dueDate) < new Date();

  return (
    <table className="book-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Book</th>
          {showMember && <th>Member</th>}
          <th>Issue Date</th>
          <th>Due Date</th>
          <th>Status</th>
          {canManage && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {borrowings.map((b, index) => (
          <tr key={b.id} className={isOverdue(b) ? "row-overdue" : ""}>
            <td>{index + 1}</td>
            <td>{b.bookTitle}</td>
            {showMember && <td>{b.memberName}</td>}
            <td>{formatDate(b.issueDate)}</td>
            <td>{formatDate(b.dueDate)}</td>
            <td>
              <span
                className={`badge ${
                  b.status === "returned"
                    ? "badge-success"
                    : isOverdue(b)
                    ? "badge-danger"
                    : "badge-warning"
                }`}
              >
                {isOverdue(b) ? "overdue" : b.status}
              </span>
            </td>
            {canManage && (
              <td className="actions">
                {b.status === "borrowed" && (
                  <button
                    className="btn btn-edit"
                    onClick={() => returnBook(b.id)}
                  >
                    Return
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
