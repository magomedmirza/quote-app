import { useState, useCallback } from "react";
import api from "../../../../api/axios";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/kategori");
      setCategories(response.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(
        err.response?.data?.message || "Gagal memuat data kategori dari server."
      );
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategory = async (categoryData) => {
    const response = await api.post("/kategori", categoryData);
    await fetchCategories();
    return response.data;
  };

  const updateCategory = async (id, categoryData) => {
    const response = await api.put(`/kategori/${id}`, categoryData);
    await fetchCategories();
    return response.data;
  };

  const deleteCategory = async (id) => {
    await api.delete(`/kategori/${id}`);
    await fetchCategories();
  };

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
