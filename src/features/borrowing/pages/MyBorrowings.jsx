import { useAuth } from "../../auth/context/AuthContext";
import { useBorrowing } from "../context/BorrowingContext";
import BorrowTable from "../components/BorrowTable";

export default function MyBorrowings() {
  const { user } = useAuth();
  const { borrowings } = useBorrowing();

  const myBorrowings = borrowings.filter(
    (b) => b.memberName === user.username
  );

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>My Borrowings</h1>
      </div>
      <BorrowTable borrowings={myBorrowings} showMember={false} />
    </div>
  );
}
