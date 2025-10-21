import { useState, useEffect } from "react";
import { kategoriApi } from "../api/kategoriApi";

export const useKategori = () => {
  const [kategories, setKategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all categories
  const fetchKategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await kategoriApi.getAll();
      setKategories(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data kategori");
    } finally {
      setLoading(false);
    }
  };

  // Create category
  const createKategori = async (data) => {
    try {
      const response = await kategoriApi.create(data);
      await fetchKategories(); // Refresh list
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || "Gagal membuat kategori";
    }
  };

  // Update category
  const updateKategori = async (id, data) => {
    try {
      const response = await kategoriApi.update(id, data);
      await fetchKategories(); // Refresh list
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || "Gagal mengupdate kategori";
    }
  };

  // Delete category
  const deleteKategori = async (id) => {
    try {
      await kategoriApi.delete(id);
      await fetchKategories(); // Refresh list
    } catch (err) {
      throw err.response?.data?.message || "Gagal menghapus kategori";
    }
  };

  // Load categories on mount
  useEffect(() => {
    fetchKategories();
  }, []);

  return {
    kategories,
    loading,
    error,
    fetchKategories,
    createKategori,
    updateKategori,
    deleteKategori,
  };
};
