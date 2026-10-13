import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAccounts from "../hooks/useAccounts";
import { transactionService } from "../services/transaction.service";
import Loader from "../components/Loader";

export default function SendMoney() {
  const { accounts, loading } = useAccounts();
  const navigate = useNavigate();
  const keyRef = useRef(crypto.randomUUID()); // idempotency key: double-click pe double payment nahi hoga
  const [form, setForm] = useState({ fromAccount: "", toAccount: "", amount: "" });
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    const toAccount = form.toAccount.trim();
    if (!form.fromAccount || !toAccount) return toast.error("Dono accounts bharo");
    if (form.fromAccount === toAccount) return toast.error("Same account me send nahi kar sakte");
    if (!(amount > 0)) return toast.error("Valid amount daalo");

    setBusy(true);
    try {
      await transactionService.transfer({
        fromAccount: form.fromAccount,
        toAccount,
        amount,
        idempotencyKey: keyRef.current,
      });
      keyRef.current = crypto.randomUUID(); // success ke baad naya key
      toast.success("Transfer successful");
      navigate("/");
    } catch (err) {
      toast.error(err.userMessage);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <h1>Send money</h1>
      <form className="card form" onSubmit={onSubmit}>
        <label>From account
          <select name="fromAccount" value={form.fromAccount} onChange={onChange} required>
            <option value="">Select account</option>
            {accounts.map((a) => <option key={a._id} value={a._id}>{a._id}</option>)}
          </select>
        </label>
        <label>To account ID
          <input name="toAccount" value={form.toAccount} onChange={onChange} placeholder="Receiver account ID" required />
        </label>
        <label>Amount (₹)
          <input type="number" name="amount" min="1" step="any" value={form.amount} onChange={onChange} required />
        </label>
        <button className="btn" disabled={busy}>{busy ? "Sending…" : "Send"}</button>
      </form>
    </>
  );
}
