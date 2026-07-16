import { useNavigate } from "react-router-dom";
import { useMembers } from "../context/MemberContext";
import { useAuth } from "../../auth/context/AuthContext";

export default function MemberTable({ members }) {
  const { deleteMember } = useMembers();
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = user && (user.role === "admin" || user.role === "librarian");

  if (!members || members.length === 0) {
    return <p className="empty-message">No members found.</p>;
  }

  return (
    <table className="book-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          {canManage && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {members.map((member, index) => (
          <tr key={member.id}>
            <td>{index + 1}</td>
            <td>{member.name}</td>
            <td>{member.email}</td>
            <td>{member.phone}</td>
            {canManage && (
              <td className="actions">
                <button
                  className="btn btn-edit"
                  onClick={() =>
                    navigate(`/members/edit/${member.id}`)
                  }
                >
                  Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => {
                    if (confirm(`Delete member "${member.name}"?`))
                      deleteMember(member.id);
                  }}
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
