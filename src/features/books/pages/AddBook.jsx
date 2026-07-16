import { useParams } from "react-router-dom";
import { useBooks } from "../context/BookContext";
import BookForm from "../components/BookForm";

export default function AddBook() {
  const { books } = useBooks();
  const { id } = useParams();
  const editBook = id ? books.find((b) => b.id === Number(id)) : null;

  return (
    <div className="add-book-page">
      <h1>{editBook ? "✏️ Edit Book" : "➕ Add New Book"}</h1>
      <BookForm editBook={editBook} />
    </div>
  );
}
