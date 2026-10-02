import api from "./api";

export const transactionService = {
  transfer: (data) => api.post("/transactions", data),
};
