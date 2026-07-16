import { useBooks } from "../../books/context/BookContext";
import { useMembers } from "../../members/context/MemberContext";
import { useBorrowing } from "../../borrowing/context/BorrowingContext";
import { useCategories } from "../../categories/context/CategoryContext";
import { useAuth } from "../../auth/context/AuthContext";

export default function Reports() {
  const { books } = useBooks();
  const { members } = useMembers();
  const { borrowings } = useBorrowing();
  const { categories } = useCategories();
  const { getAllUsers } = useAuth();
  const users = getAllUsers();

  const genreCounts = books.reduce((acc, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
  }, {});

  const authorCounts = books.reduce((acc, book) => {
    acc[book.author] = (acc[book.author] || 0) + 1;
    return acc;
  }, {});

  const activeBorrowings = borrowings.filter((b) => b.status === "borrowed");
  const returnedBorrowings = borrowings.filter((b) => b.status === "returned");
  const overdueBorrowings = activeBorrowings.filter(
    (b) => new Date(b.dueDate) < new Date()
  );

  return (
    <div className="home">
      <h1>Reports &amp; Analytics</h1>
      <p className="subtitle">Comprehensive library statistics</p>

      <div className="stats">
        <div className="stat-card">
          <span className="stat-number">{books.length}</span>
          <span className="stat-label">Total Books</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{members.length}</span>
          <span className="stat-label">Members</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{borrowings.length}</span>
          <span className="stat-label">Total Borrows</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{activeBorrowings.length}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{returnedBorrowings.length}</span>
          <span className="stat-label">Returned</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: "#e94560" }}>
            {overdueBorrowings.length}
          </span>
          <span className="stat-label">Overdue</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Books by Genre</h3>
          <ul className="dashboard-list">
            {Object.entries(genreCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([genre, count]) => (
                <li key={genre}>
                  <span>{genre}</span>
                  <span className="badge">{count}</span>
                </li>
              ))}
          </ul>
        </div>
        <div className="dashboard-card">
          <h3>Books by Author</h3>
          <ul className="dashboard-list">
            {Object.entries(authorCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([author, count]) => (
                <li key={author}>
                  <span>{author}</span>
                  <span className="badge">{count}</span>
                </li>
              ))}
          </ul>
        </div>
        <div className="dashboard-card">
          <h3>System Users by Role</h3>
          <ul className="dashboard-list">
            <li>
              <span>Administrators</span>
              <span className="badge">
                {users.filter((u) => u.role === "admin").length}
              </span>
            </li>
            <li>
              <span>Librarians</span>
              <span className="badge">
                {users.filter((u) => u.role === "librarian").length}
              </span>
            </li>
            <li>
              <span>Members</span>
              <span className="badge">
                {users.filter((u) => u.role === "member").length}
              </span>
            </li>
          </ul>
        </div>
        <div className="dashboard-card">
          <h3>Borrowing Overview</h3>
          <ul className="dashboard-list">
            <li>
              <span>Currently Borrowed</span>
              <span className="badge badge-warning">
                {activeBorrowings.length}
              </span>
            </li>
            <li>
              <span>Returned</span>
              <span className="badge badge-success">
                {returnedBorrowings.length}
              </span>
            </li>
            <li>
              <span>Overdue</span>
              <span className="badge badge-danger">
                {overdueBorrowings.length}
              </span>
            </li>
            <li>
              <span>Categories</span>
              <span className="badge">{categories.length}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
