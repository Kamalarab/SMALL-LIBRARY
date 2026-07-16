import { useParams } from "react-router-dom";
import { useMembers } from "../context/MemberContext";
import MemberForm from "../components/MemberForm";

export default function AddMember() {
  const { members } = useMembers();
  const { id } = useParams();
  const editMember = id ? members.find((m) => m.id === Number(id)) : null;

  return (
    <div className="add-book-page">
      <h1>{editMember ? "Edit Member" : "Add New Member"}</h1>
      <MemberForm editMember={editMember} />
    </div>
  );
}
