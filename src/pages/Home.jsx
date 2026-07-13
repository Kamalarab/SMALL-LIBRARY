import { Link } from "react-router-dom";
import { useBooks } from "../context/BookContext";

export default function Home() {
  const { books } = useBooks();

  const totalBooks = books.length;
  const genres = [...new Set(books.map((b) => b.genre))];
  const authors = [...new Set(books.map((b) => b.author))];

  return (
    <div className="home">
      <h1>📚 Library Dashboard</h1>
      <p className="subtitle">Manage your personal book collection</p>

      <div className="stats">
        <div className="stat-card">
          <span className="stat-number">{totalBooks}</span>
          <span className="stat-label">Total Books</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{authors.length}</span>
          <span className="stat-label">Authors</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{genres.length}</span>
          <span className="stat-label">Genres</span>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/books" className="btn btn-primary">View All Books</Link>
        <Link to="/add" className="btn btn-secondary">Add New Book</Link>
      </div>
    </div>
  );
}
