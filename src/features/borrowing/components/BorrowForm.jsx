import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooks } from "../../books/context/BookContext";
import { useMembers } from "../../members/context/MemberContext";
import { useBorrowing } from "../context/BorrowingContext";

export default function BorrowForm({ editBorrowing }) {
  const { books } = useBooks();
  const { members } = useMembers();
  const { issueBook } = useBorrowing();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bookId: editBorrowing?.bookId || "",
    memberId: editBorrowing?.memberId || "",
    dueDate: editBorrowing?.dueDate || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.bookId || !form.memberId || !form.dueDate) {
      alert("Please fill in all fields.");
      return;
    }

    const book = books.find((b) => b.id === Number(form.bookId));
    const member = members.find((m) => m.id === Number(form.memberId));

    if (!book || !member) {
      alert("Invalid book or member selection.");
      return;
    }

    issueBook({
      bookId: book.id,
      bookTitle: book.title,
      memberId: member.id,
      memberName: member.name,
      dueDate: form.dueDate,
    });
    navigate("/borrowing");
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Book</label>
        <select name="bookId" value={form.bookId} onChange={handleChange}>
          <option value="">Select a book</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} — {b.author}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Member</label>
        <select name="memberId" value={form.memberId} onChange={handleChange}>
          <option value="">Select a member</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.email})
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Issue Book
      </button>
    </form>
  );
}
