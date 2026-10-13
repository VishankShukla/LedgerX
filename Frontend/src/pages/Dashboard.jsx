import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import useAccounts from "../hooks/useAccounts";
import { accountService } from "../services/account.service";
import AccountCard from "../components/AccountCard";
import Loader from "../components/Loader";

export default function Dashboard() {
  const { user } = useAuth();
  const { accounts, loading, error, reload } = useAccounts();
  const [creating, setCreating] = useState(false);

  const createAccount = async () => {
    setCreating(true);
    try {
      await accountService.create();
      toast.success("Account created");
      await reload();
    } catch (e) {
      toast.error(e.userMessage);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="row">
        <div>
          <h1>Hi, {user.name} 👋</h1>
          <p className="muted">Your accounts</p>
        </div>
        <button className="btn" onClick={createAccount} disabled={creating}>
          {creating ? "Creating…" : "+ New account"}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {!error && accounts.length === 0 && <div className="card empty">No accounts yet. Create your first one.</div>}
      <div className="grid">
        {accounts.map((a) => <AccountCard key={a._id} account={a} />)}
      </div>
    </>
  );
}
