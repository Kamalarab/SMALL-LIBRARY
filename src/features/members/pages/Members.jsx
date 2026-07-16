import { useState } from "react";
import { Link } from "react-router-dom";
import { useMembers } from "../context/MemberContext";
import { useAuth } from "../../auth/context/AuthContext";
import MemberTable from "../components/MemberTable";

export default function Members() {
  const { members } = useMembers();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const canManage = user && (user.role === "admin" || user.role === "librarian");

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search)
  );

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>Members</h1>
        {canManage && (
          <Link to="/members/add" className="btn btn-primary">
            + Add Member
          </Link>
        )}
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <MemberTable members={filtered} />
    </div>
  );
}
