import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { BookProvider } from "./features/books/context/BookContext";
import { MemberProvider } from "./features/members/context/MemberContext";
import { BorrowingProvider } from "./features/borrowing/context/BorrowingContext";
import { CategoryProvider } from "./features/categories/context/CategoryContext";
import Sidebar from "./shared/components/Sidebar";
import Navbar from "./shared/components/Navbar";
import ProtectedRoute from "./shared/components/ProtectedRoute";

import Login from "./features/auth/pages/Login";
import Setup from "./features/auth/pages/Signup";
import Register from "./features/auth/pages/Register";
import Unauthorized from "./features/auth/pages/Unauthorized";
import Home from "./features/dashboard/pages/Home";
import Books from "./features/books/pages/Books";
import AddBook from "./features/books/pages/AddBook";
import Members from "./features/members/pages/Members";
import AddMember from "./features/members/pages/AddMember";
import Borrowing from "./features/borrowing/pages/Borrowing";
import IssueBook from "./features/borrowing/pages/IssueBook";
import MyBorrowings from "./features/borrowing/pages/MyBorrowings";
import Categories from "./features/categories/pages/Categories";
import AddCategory from "./features/categories/pages/AddCategory";
import Reports from "./features/reports/pages/Reports";
import Settings from "./features/settings/pages/Settings";
import Fines from "./features/borrowing/pages/Fines";
import Profile from "./features/auth/pages/Profile";

import "./App.css";

function AppRoutes() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/setup" || location.pathname === "/register";

  return (
    <div className={isAuthPage ? "app-layout auth-layout" : "app-layout"}>
      {!isAuthPage && <Navbar />}
      <div className={isAuthPage ? "app-body auth-body" : "app-body"}>
        {!isAuthPage && <Sidebar />}
        <div className={isAuthPage ? "main-content auth-content" : "main-content"}>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* All authenticated users */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <Books />
              </ProtectedRoute>
            }
          />

          {/* Admin and Librarian: manage books */}
          <Route
            path="/add"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "librarian"]}
              >
                <AddBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "librarian"]}
              >
                <AddBook />
              </ProtectedRoute>
            }
          />

          {/* Admin and Librarian: manage members */}
          <Route
            path="/members"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "librarian"]}
              >
                <Members />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/add"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "librarian"]}
              >
                <AddMember />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/edit/:id"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "librarian"]}
              >
                <AddMember />
              </ProtectedRoute>
            }
          />

          {/* Admin and Librarian: manage borrowing */}
          <Route
            path="/borrowing"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "librarian"]}
              >
                <Borrowing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrowing/issue"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "librarian"]}
              >
                <IssueBook />
              </ProtectedRoute>
            }
          />

          {/* Member: view own borrowings */}
          <Route
            path="/my-borrowings"
            element={
              <ProtectedRoute requiredRoles={["member"]}>
                <MyBorrowings />
              </ProtectedRoute>
            }
          />

          {/* Admin only: categories */}
          <Route
            path="/categories"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/add"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <AddCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/edit/:id"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <AddCategory />
              </ProtectedRoute>
            }
          />

          {/* Admin and Librarian: reports */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "librarian"]}
              >
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* All users: fines */}
          <Route
            path="/fines"
            element={
              <ProtectedRoute>
                <Fines />
              </ProtectedRoute>
            }
          />

          {/* All users: profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin only: settings */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <MemberProvider>
          <BorrowingProvider>
            <CategoryProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </CategoryProvider>
          </BorrowingProvider>
        </MemberProvider>
      </BookProvider>
    </AuthProvider>
  );
}
