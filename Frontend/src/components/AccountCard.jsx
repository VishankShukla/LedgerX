import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"

export default function AccountCard({ account }) {
  const navigate = useNavigate();

  const copyId = async (e) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(account._id);
    toast.success("Account ID copied");
  };

  return (
    <div className="card clickable" onClick={()=>navigate(`/account/${account._id}`)}>
      <div className="row">
        <span className={`badge ${account.status}`}>{account.status}</span>
        <span className="muted">{account.currency}</span>
      </div>
      <p className="muted" style={{ margin: "16px 0" }}>Tap to view balance & history →</p>
      <button className="link" onClick={copyId} title="Copy account ID">Account No.: {account._id} ⧉</button>
    </div>
  );
}
