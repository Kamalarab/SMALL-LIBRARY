import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../context/CategoryContext";

export default function CategoryForm({ editCategory }) {
  const { addCategory, updateCategory } = useCategories();
  const navigate = useNavigate();

  const [name, setName] = useState(editCategory?.name || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a category name.");
      return;
    }
    if (editCategory) {
      updateCategory(editCategory.id, { name: name.trim() });
    } else {
      addCategory({ name: name.trim() });
    }
    navigate("/categories");
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        {editCategory ? "Update Category" : "Add Category"}
      </button>
    </form>
  );
}
