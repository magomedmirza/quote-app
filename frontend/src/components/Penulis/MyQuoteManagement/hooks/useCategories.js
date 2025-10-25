import { useState, useCallback } from "react";
import api from "../../../../api/axios";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/kategori");
      setCategories(response.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // ✅ EMPTY DEPENDENCY ARRAY

  return {
    categories,
    isLoading,
    fetchCategories,
  };
};
