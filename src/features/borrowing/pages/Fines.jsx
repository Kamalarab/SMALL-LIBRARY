import { useAuth } from "../../auth/context/AuthContext";
import { useBorrowing } from "../context/BorrowingContext";

const FINE_PER_DAY = 1.0;

export default function Fines() {
  const { user } = useAuth();
  const { borrowings } = useBorrowing();

  const now = new Date();

  const myBorrowings =
    user.role === "member"
      ? borrowings.filter((b) => b.memberName === user.username)
      : borrowings;

  const fines = myBorrowings
    .filter((b) => b.status === "borrowed" && new Date(b.dueDate) < now)
    .map((b) => {
      const due = new Date(b.dueDate);
      const daysOverdue = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
      const amount = daysOverdue * FINE_PER_DAY;
      return { ...b, daysOverdue, amount };
    });

  const totalFines = fines.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>Fines</h1>
      </div>

      <div className="stats">
        <div className="stat-card">
          <span className="stat-number" style={{ color: "#e94560" }}>
            ${totalFines.toFixed(2)}
          </span>
          <span className="stat-label">Total Outstanding</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{fines.length}</span>
          <span className="stat-label">Overdue Books</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">${FINE_PER_DAY.toFixed(2)}</span>
          <span className="stat-label">Fine Per Day</span>
        </div>
      </div>

      {fines.length === 0 ? (
        <div className="dashboard-card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "#2e7d32", fontSize: "1.1rem", fontWeight: 600 }}>
            No outstanding fines
          </p>
          <p style={{ color: "#777", marginTop: "0.5rem" }}>
            All your books are returned on time.
          </p>
        </div>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>Book</th>
              {user.role !== "member" && <th>Member</th>}
              <th>Due Date</th>
              <th>Days Overdue</th>
              <th>Fine Amount</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((f) => (
              <tr key={f.id} className="row-overdue">
                <td>{f.bookTitle}</td>
                {user.role !== "member" && <td>{f.memberName}</td>}
                <td>{new Date(f.dueDate).toLocaleDateString()}</td>
                <td>
                  <span className="badge badge-danger">{f.daysOverdue} days</span>
                </td>
                <td>
                  <span className="badge badge-warning">${f.amount.toFixed(2)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
