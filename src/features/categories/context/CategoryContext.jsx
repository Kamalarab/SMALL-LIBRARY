import { createContext, useContext, useState } from "react";

const CategoryContext = createContext();

const initialCategories = [
  { id: 1, name: "Fiction" },
  { id: 2, name: "Non-Fiction" },
  { id: 3, name: "Dystopian" },
  { id: 4, name: "Romance" },
  { id: 5, name: "Fantasy" },
];

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState(initialCategories);

  const addCategory = (category) => {
    setCategories((prev) => [...prev, { ...category, id: Date.now() }]);
  };

  const updateCategory = (id, updatedCategory) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedCategory } : c)));
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategories = () => useContext(CategoryContext);
