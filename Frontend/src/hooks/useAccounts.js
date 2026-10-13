import { useCallback, useEffect, useState } from "react";
import { accountService } from "../services/account.service";

export default function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const { data } = await accountService.getAll();
      setAccounts(data.accounts);
    } catch (e) {
      setError(e.userMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { accounts, loading, error, reload: load };
}
