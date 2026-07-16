import { createContext, useContext, useState } from "react";

const BorrowingContext = createContext();

const initialBorrowings = [];

export function BorrowingProvider({ children }) {
  const [borrowings, setBorrowings] = useState(initialBorrowings);

  const issueBook = (borrowing) => {
    setBorrowings((prev) => [
      ...prev,
      { ...borrowing, id: Date.now(), status: "borrowed", issueDate: new Date().toISOString() },
    ]);
  };

  const returnBook = (id) => {
    setBorrowings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "returned", returnDate: new Date().toISOString() } : b))
    );
  };

  return (
    <BorrowingContext.Provider value={{ borrowings, issueBook, returnBook }}>
      {children}
    </BorrowingContext.Provider>
  );
}

export const useBorrowing = () => useContext(BorrowingContext);
