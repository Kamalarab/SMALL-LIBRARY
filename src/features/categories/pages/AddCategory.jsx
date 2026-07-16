import { useParams } from "react-router-dom";
import { useCategories } from "../context/CategoryContext";
import CategoryForm from "../components/CategoryForm";

export default function AddCategory() {
  const { categories } = useCategories();
  const { id } = useParams();
  const editCategory = id ? categories.find((c) => c.id === Number(id)) : null;

  return (
    <div className="add-book-page">
      <h1>{editCategory ? "Edit Category" : "Add New Category"}</h1>
      <CategoryForm editCategory={editCategory} />
    </div>
  );
}
