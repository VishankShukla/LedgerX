import { useEffect, useState } from "react";
import { transactionService } from "../services/transaction.service";
import { formatINR } from "../utils/format";
import Loader from "./Loader";

const formatData = (d) => new Date(d).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"});

export default function TransactionList({ accountId }){
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");
        transactionService.getHistory(accountId)
        .then(({data}) => setTransactions(data.transaction))
        .catch((e) => setError(e.userMessage))
        .finally(()=> setLoading(false));
    },[accountId]);

    if(loading) return <Loader/>;
    if(error) return <p className="error">{error}</p>;
    if (transactions.length === 0) return <div className="card empty">No transactions yet.</div>;

    return(
        <div className="tx-list">
            {transactions.map((t)=>{
                const isDebit = t.fromAccount === accountId;
                return(
                    <div className="card tx-item" key={t._id}>
                        <div>
                            <strong>{isDebit ? "Sent" : "Received"}</strong>
                            <p className="muted tx-meta">{formatData(t.createdAt)}</p>
                        </div>
                        <div className="tx-right">
                            <span className={`tx-amount ${isDebit ? "debit" : "credit"}`}>
                                {isDebit ? "-" : "+"}{formatINR(t.amount)}
                            </span>
                            <span className={`badge ${t.status}`}>{t.status}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}