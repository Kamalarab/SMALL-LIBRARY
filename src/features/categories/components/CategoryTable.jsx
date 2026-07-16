import { useCategories } from "../context/CategoryContext";

export default function CategoryTable({ categories }) {
  const { deleteCategory } = useCategories();

  if (!categories || categories.length === 0) {
    return <p className="empty-message">No categories found.</p>;
  }

  return (
    <table className="book-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Category Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category, index) => (
          <tr key={category.id}>
            <td>{index + 1}</td>
            <td>{category.name}</td>
            <td className="actions">
              <button
                className="btn btn-edit"
                onClick={() =>
                  (window.location.href = `/categories/edit/${category.id}`)
                }
              >
                Edit
              </button>
              <button
                className="btn btn-delete"
                onClick={() => {
                  if (confirm(`Delete category "${category.name}"?`))
                    deleteCategory(category.id);
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
