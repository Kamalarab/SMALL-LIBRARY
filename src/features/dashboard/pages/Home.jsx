import { Link } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { useBooks } from "../../books/context/BookContext";
import { useMembers } from "../../members/context/MemberContext";
import { useBorrowing } from "../../borrowing/context/BorrowingContext";
import { useCategories } from "../../categories/context/CategoryContext";

function StatCard({ number, label, color }) {
  return (
    <div className="stat-card">
      <span className="stat-number" style={color ? { color } : undefined}>
        {number}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function AdminDashboard() {
  const { books } = useBooks();
  const { members } = useMembers();
  const { borrowings } = useBorrowing();
  const { categories } = useCategories();
  const { getAllUsers } = useAuth();
  const users = getAllUsers();

  const activeBorrowings = borrowings.filter(
    (b) => b.status === "borrowed"
  ).length;
  const overdueBorrowings = borrowings.filter(
    (b) => b.status === "borrowed" && new Date(b.dueDate) < new Date()
  ).length;

  return (
    <div className="home">
      <h1>Admin Dashboard</h1>
      <p className="subtitle">Full system overview and management</p>

      <div className="stats">
        <StatCard number={books.length} label="Total Books" color="#0f3460" />
        <StatCard number={members.length} label="Members" color="#16213e" />
        <StatCard number={users.length} label="System Users" color="#e94560" />
        <StatCard
          number={activeBorrowings}
          label="Active Borrows"
          color="#f0a500"
        />
        <StatCard number={overdueBorrowings} label="Overdue" color="#e94560" />
        <StatCard
          number={categories.length}
          label="Categories"
          color="#0f3460"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="dashboard-actions">
            <Link to="/books" className="btn btn-primary">
              Manage Books
            </Link>
            <Link to="/members" className="btn btn-secondary">
              Manage Members
            </Link>
            <Link to="/borrowing" className="btn btn-primary">
              Manage Borrowing
            </Link>
            <Link to="/settings" className="btn btn-secondary">
              System Settings
            </Link>
          </div>
        </div>
        <div className="dashboard-card">
          <h3>System Overview</h3>
          <ul className="dashboard-list">
            <li>
              <span>Book Collection</span>
              <span className="badge">{books.length} titles</span>
            </li>
            <li>
              <span>Registered Members</span>
              <span className="badge">{members.length}</span>
            </li>
            <li>
              <span>Library Staff</span>
              <span className="badge">
                {users.filter((u) => u.role === "librarian").length}
              </span>
            </li>
            <li>
              <span>Active Loans</span>
              <span className="badge badge-warning">{activeBorrowings}</span>
            </li>
            <li>
              <span>Overdue Returns</span>
              <span className="badge badge-danger">{overdueBorrowings}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function LibrarianDashboard() {
  const { books } = useBooks();
  const { members } = useMembers();
  const { borrowings } = useBorrowing();

  const activeBorrowings = borrowings.filter(
    (b) => b.status === "borrowed"
  ).length;
  const todayReturns = borrowings.filter(
    (b) =>
      b.status === "borrowed" &&
      new Date(b.dueDate).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="home">
      <h1>Librarian Dashboard</h1>
      <p className="subtitle">Book management and borrowing operations</p>

      <div className="stats">
        <StatCard number={books.length} label="Total Books" color="#0f3460" />
        <StatCard number={members.length} label="Members" color="#16213e" />
        <StatCard
          number={activeBorrowings}
          label="Active Borrows"
          color="#f0a500"
        />
        <StatCard number={todayReturns} label="Due Today" color="#e94560" />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="dashboard-actions">
            <Link to="/books" className="btn btn-primary">
              View Books
            </Link>
            <Link to="/add" className="btn btn-secondary">
              Add New Book
            </Link>
            <Link to="/borrowing/issue" className="btn btn-primary">
              Issue Book
            </Link>
            <Link to="/members" className="btn btn-secondary">
              View Members
            </Link>
          </div>
        </div>
        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          {borrowings.length === 0 ? (
            <p className="empty-message">No borrowing records yet.</p>
          ) : (
            <ul className="dashboard-list">
              {borrowings.slice(-5).reverse().map((b) => (
                <li key={b.id}>
                  <span>
                    {b.status === "borrowed" ? "📤" : "📥"} {b.bookTitle} →{" "}
                    {b.memberName}
                  </span>
                  <span
                    className={`badge ${
                      b.status === "borrowed" ? "badge-warning" : "badge-success"
                    }`}
                  >
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function MemberDashboard() {
  const { books } = useBooks();
  const { borrowings } = useBorrowing();
  const { user } = useAuth();

  const myBorrowings = borrowings.filter(
    (b) => b.memberName === user.username
  );
  const activeBorrowings = myBorrowings.filter(
    (b) => b.status === "borrowed"
  );
  const recentBorrowings = myBorrowings.slice(-5).reverse();

  return (
    <div className="home">
      <h1>Welcome, {user.username}!</h1>
      <p className="subtitle">Browse books and manage your borrowings</p>

      <div className="stats">
        <StatCard number={books.length} label="Books Available" color="#0f3460" />
        <StatCard
          number={activeBorrowings.length}
          label="Currently Borrowed"
          color="#f0a500"
        />
        <StatCard number={myBorrowings.length} label="Total Borrows" color="#16213e" />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="dashboard-actions">
            <Link to="/books" className="btn btn-primary">
              Browse Books
            </Link>
            <Link to="/my-borrowings" className="btn btn-secondary">
              My Borrowings
            </Link>
          </div>
        </div>
        <div className="dashboard-card">
          <h3>Recent Borrowings</h3>
          {recentBorrowings.length === 0 ? (
            <p className="empty-message">
              You haven&apos;t borrowed any books yet. Browse our collection to
              get started!
            </p>
          ) : (
            <ul className="dashboard-list">
              {recentBorrowings.map((b) => (
                <li key={b.id}>
                  <span>{b.bookTitle}</span>
                  <span
                    className={`badge ${
                      b.status === "borrowed" ? "badge-warning" : "badge-success"
                    }`}
                  >
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "librarian":
      return <LibrarianDashboard />;
    case "member":
      return <MemberDashboard />;
    default:
      return <MemberDashboard />;
  }
}
