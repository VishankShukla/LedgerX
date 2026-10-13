import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { user, logout } = useAuth();
  return (
    <>
      <header className="navbar">
        <div className="container row">
          <strong>LedgerX</strong>
          <nav>
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/send">Send money</NavLink>
          </nav>
          <div>
            <span className="muted">{user.name}</span>
            <button className="btn ghost" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>
      <main className="container"><Outlet /></main>
    </>
  );
}
