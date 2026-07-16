import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMembers } from "../context/MemberContext";

export default function MemberForm({ editMember }) {
  const { addMember, updateMember } = useMembers();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: editMember?.name || "",
    email: editMember?.email || "",
    phone: editMember?.phone || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill in all fields.");
      return;
    }
    if (editMember) {
      updateMember(editMember.id, form);
    } else {
      addMember(form);
    }
    navigate("/members");
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Member Name</label>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter member name"
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        {editMember ? "Update Member" : "Add Member"}
      </button>
    </form>
  );
}
