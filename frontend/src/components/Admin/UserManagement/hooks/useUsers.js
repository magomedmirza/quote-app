import { useState, useCallback } from "react";
import api from "../../../../api/axios";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/user");
      setUsers(response.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        err.response?.data?.message || "Gagal memuat data user dari server."
      );
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = async (userData) => {
    const response = await api.post("/user", userData);
    await fetchUsers();
    return response.data;
  };

  const updateUser = async (id, userData) => {
    const response = await api.put(`/user/${id}`, userData);
    await fetchUsers();
    return response.data;
  };

  const deleteUser = async (id) => {
    await api.delete(`/user/${id}`);
    await fetchUsers();
  };

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
