import { useState } from "react";
import { Link } from "react-router-dom";
import { useBooks } from "../context/BookContext";
import { useAuth } from "../../auth/context/AuthContext";
import SearchBar from "../components/SearchBar";
import BookTable from "../components/BookTable";

export default function Books() {
  const { books } = useBooks();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const canManage =
    user && (user.role === "admin" || user.role === "librarian");

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>All Books</h1>
        {canManage && (
          <Link to="/add" className="btn btn-primary">
            + Add Book
          </Link>
        )}
      </div>
      <SearchBar value={search} onChange={setSearch} />
      <BookTable books={filtered} />
    </div>
  );
}
