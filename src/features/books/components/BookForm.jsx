import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBooks } from "../context/BookContext";

export default function BookForm({ editBook }) {
  const { addBook, updateBook } = useBooks();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", author: "", genre: "", year: "" });

  useEffect(() => {
    if (editBook) {
      setForm({
        title: editBook.title,
        author: editBook.author,
        genre: editBook.genre,
        year: editBook.year,
      });
    }
  }, [editBook]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.genre || !form.year) {
      alert("Please fill in all fields.");
      return;
    }

    if (editBook) {
      updateBook(editBook.id, { ...form, year: Number(form.year) });
    } else {
      addBook({ ...form, year: Number(form.year) });
    }
    navigate("/books");
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Author</label>
        <input name="author" value={form.author} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Genre</label>
        <input name="genre" value={form.genre} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Year</label>
        <input name="year" type="number" value={form.year} onChange={handleChange} />
      </div>
      <button type="submit" className="btn btn-primary">
        {editBook ? "Update Book" : "Add Book"}
      </button>
    </form>
  );
}
