import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { accountService } from "../services/account.service";
import { formatINR } from "../utils/format";

export default function AccountCard({ account }) {
  const [balance, setBalance] = useState(null); // null = loading, undefined = failed

  useEffect(() => {
    accountService
      .getBalance(account._id)
      .then((res) => setBalance(res.data.balance))
      .catch(() => setBalance(undefined));
  }, [account._id]);

  const copyId = async () => {
    await navigator.clipboard.writeText(account._id);
    toast.success("Account ID copied");
  };

  return (
    <div className="card">
      <div className="row">
        <span className={`badge ${account.status}`}>{account.status}</span>
        <span className="muted">{account.currency}</span>
      </div>
      <h2 className="balance">{balance === null ? "…" : balance === undefined ? "—" : formatINR(balance)}</h2>
      <button className="link" onClick={copyId} title="Copy account ID">Account No.: {account._id} ⧉</button>
    </div>
  );
}
