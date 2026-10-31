import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAccounts from "../hooks/useAccounts";
import { accountService } from "../services/account.service";
import { formatINR } from "../utils/format";
import TransactionList from "../components/TransactionList";
import Loader from "../components/Loader";

export default function AccountDetail() {
  const { accountId } = useParams();
  const { accounts, loading } = useAccounts();
  const [balance, setBalance] = useState(null); // null = loading, undefined = failed

  const account = accounts.find((a) => a._id === accountId);

  useEffect(() => {
    setBalance(null);
    accountService
      .getBalance(accountId)
      .then((res) => setBalance(res.data.balance))
      .catch(() => setBalance(undefined));
  }, [accountId]);

  if (loading) return <Loader />;
  if (!account) return <p className="error">Account not found.</p>;

  return (
    <>
      <Link to="/" className="muted">← Back to dashboard</Link>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="row">
          <span className={`badge ${account.status}`}>{account.status}</span>
          <span className="muted">{account.currency}</span>
        </div>
        <p className="muted" style={{ marginBottom: 0 }}>Available balance</p>
        <h2 className="balance">
          {balance === null ? "…" : balance === undefined ? "—" : formatINR(balance)}
        </h2>
        <p className="muted tx-meta">Account No.: {account._id}</p>
      </div>

      <h2 style={{ marginTop: 28 }}>Transaction history</h2>
      <TransactionList accountId={accountId} />
    </>
  );
}