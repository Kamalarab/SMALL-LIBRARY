import { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../context/CategoryContext";
import CategoryTable from "../components/CategoryTable";

export default function Categories() {
  const { categories } = useCategories();
  const [search, setSearch] = useState("");

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>Categories</h1>
        <Link to="/categories/add" className="btn btn-primary">
          + Add Category
        </Link>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <CategoryTable categories={filtered} />
    </div>
  );
}
