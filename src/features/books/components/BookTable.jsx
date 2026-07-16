import { Link } from "react-router-dom";
import { useBooks } from "../context/BookContext";
import { useAuth } from "../../auth/context/AuthContext";

export default function BookTable({ books }) {
  const { deleteBook } = useBooks();
  const { user } = useAuth();
  const canManage =
    user && (user.role === "admin" || user.role === "librarian");

  if (books.length === 0) {
    return <p className="empty-message">No books found.</p>;
  }

  return (
    <table className="book-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Author</th>
          <th>Genre</th>
          <th>Year</th>
          {canManage && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => (
          <tr key={book.id}>
            <td>{index + 1}</td>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.genre}</td>
            <td>{book.year}</td>
            {canManage && (
              <td className="actions">
                <Link to={`/edit/${book.id}`} className="btn btn-edit">
                  Edit
                </Link>
                <button
                  className="btn btn-delete"
                  onClick={() => {
                    if (confirm(`Delete "${book.title}"?`)) deleteBook(book.id);
                  }}
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
