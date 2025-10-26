import { useState, useCallback } from "react";
import api from "../../../../api/axios";

export const useMyQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserId = () => localStorage.getItem("userId");

  // PASTIKAN fetchMyQuotes TIDAK BERUBAH SETIAP RENDER
  const fetchMyQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      console.log("Fetching quotes for user:", userId); // DEBUG

      if (!userId) {
        throw new Error("User ID tidak ditemukan");
      }

      const response = await api.get(`/quote/user/${userId}`).catch((err) => {
        if (err.response?.status === 404) {
          return { data: [] };
        }
        throw err;
      });

      setQuotes(response.data || []);
    } catch (err) {
      console.error("Error fetching my quotes:", err);
      setError(err.response?.data?.message || "Gagal memuat data quote Anda.");
      setQuotes([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // ✅ EMPTY DEPENDENCY ARRAY

  const createQuote = async (quoteData) => {
    const response = await api.post("/quote", quoteData);
    await fetchMyQuotes();
    return response.data;
  };

  const updateQuote = async (id, quoteData) => {
    const response = await api.put(`/quote/${id}`, quoteData);
    await fetchMyQuotes();
    return response.data;
  };

  const deleteQuote = async (id) => {
    await api.delete(`/quote/${id}`);
    await fetchMyQuotes();
  };

  return {
    quotes,
    isLoading,
    error,
    fetchMyQuotes,
    createQuote,
    updateQuote,
    deleteQuote,
    getUserId,
  };
};
