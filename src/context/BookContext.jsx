import { createContext, useContext, useState } from "react";

const BookContext = createContext();

const initialBooks = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", year: 1925 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", year: 1960 },
  { id: 3, title: "1984", author: "George Orwell", genre: "Dystopian", year: 1949 },
  { id: 4, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", year: 1813 },
  { id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", year: 1937 },
];

export function BookProvider({ children }) {
  const [books, setBooks] = useState(initialBooks);

  const addBook = (book) => {
    setBooks((prev) => [...prev, { ...book, id: Date.now() }]);
  };

  const updateBook = (id, updatedBook) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updatedBook } : b)));
  };

  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <BookContext.Provider value={{ books, addBook, updateBook, deleteBook }}>
      {children}
    </BookContext.Provider>
  );
}

export const useBooks = () => useContext(BookContext);
