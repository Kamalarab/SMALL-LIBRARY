import { useState } from "react";
import { Link } from "react-router-dom";
import { useBorrowing } from "../context/BorrowingContext";
import { useAuth } from "../../auth/context/AuthContext";
import BorrowTable from "../components/BorrowTable";

export default function Borrowing() {
  const { borrowings } = useBorrowing();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const canManage = user && (user.role === "admin" || user.role === "librarian");

  const filtered = borrowings.filter(
    (b) =>
      b.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.memberName.toLowerCase().includes(search.toLowerCase()) ||
      b.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>Borrowing Records</h1>
        {canManage && (
          <Link to="/borrowing/issue" className="btn btn-primary">
            + Issue Book
          </Link>
        )}
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by book, member, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <BorrowTable borrowings={filtered} />
    </div>
  );
}
