import api from './api';

export const accountService = {
    create: () => api.post("/account"),
    getAll: () => api.get("/account/get"),
    getBalance: (id) => api.get(`/account/balance/${id}`),
}