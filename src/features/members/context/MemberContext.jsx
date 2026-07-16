import { createContext, useContext, useState } from "react";

const MemberContext = createContext();

const initialMembers = [];

export function MemberProvider({ children }) {
  const [members, setMembers] = useState(initialMembers);

  const addMember = (member) => {
    setMembers((prev) => [...prev, { ...member, id: Date.now() }]);
  };

  const updateMember = (id, updatedMember) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updatedMember } : m)));
  };

  const deleteMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <MemberContext.Provider value={{ members, addMember, updateMember, deleteMember }}>
      {children}
    </MemberContext.Provider>
  );
}

export const useMembers = () => useContext(MemberContext);
