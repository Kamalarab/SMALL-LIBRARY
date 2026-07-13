import { useState } from "react";
import { Link } from "react-router-dom";
import { useBooks } from "../context/BookContext";
import SearchBar from "../components/SearchBar";
import BookTable from "../components/BookTable";

export default function Books() {
  const { books } = useBooks();
  const [search, setSearch] = useState("");

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>📖 All Books</h1>
        <Link to="/add" className="btn btn-primary">+ Add Book</Link>
      </div>
      <SearchBar value={search} onChange={setSearch} />
      <BookTable books={filtered} />
    </div>
  );
}
