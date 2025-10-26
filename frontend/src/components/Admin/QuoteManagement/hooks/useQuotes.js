import { useState, useCallback } from "react";
import api from "../../../../api/axios";

export const useQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/quote").catch((err) => {
        // ✅ HANDLE 404 - DATA KOSONG BUKAN ERROR
        if (err.response?.status === 404) {
          return { data: [] };
        }
        throw err;
      });

      setQuotes(response.data || []);
    } catch (err) {
      console.error("Error fetching quotes:", err);
      // ✅ JANGAN SET ERROR JIKA 404
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || "Gagal memuat data quote.");
      }
      setQuotes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createQuote = async (quoteData) => {
    const response = await api.post("/quote", quoteData);
    await fetchQuotes();
    return response.data;
  };

  const updateQuote = async (id, quoteData) => {
    const response = await api.put(`/quote/${id}`, quoteData);
    await fetchQuotes();
    return response.data;
  };

  const deleteQuote = async (id) => {
    await api.delete(`/quote/${id}`);
    await fetchQuotes();
  };

  return {
    quotes,
    isLoading,
    error,
    fetchQuotes,
    createQuote,
    updateQuote,
    deleteQuote,
  };
};
