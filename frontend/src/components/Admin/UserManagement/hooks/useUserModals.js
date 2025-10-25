import { useState, useCallback } from "react";

export const useUserModals = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true);
    setSubmitError(null);
  }, []);

  const closeAddModal = useCallback(() => {
    if (!isSubmitting) {
      setIsAddModalOpen(false);
      setSubmitError(null);
    }
  }, [isSubmitting]);

  const openEditModal = useCallback((user) => {
    setEditingUser(user);
    setSubmitError(null);
  }, []);

  const closeEditModal = useCallback(() => {
    if (!isSubmitting) {
      setEditingUser(null);
      setSubmitError(null);
    }
  }, [isSubmitting]);

  const openDeleteModal = useCallback((user) => {
    setDeletingUser(user);
    setSubmitError(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (!isSubmitting) {
      setDeletingUser(null);
      setSubmitError(null);
    }
  }, [isSubmitting]);

  return {
    // Modal states
    isAddModalOpen,
    editingUser,
    deletingUser,
    isSubmitting,
    submitError,

    // Modal actions
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,

    // Submit state
    setIsSubmitting,
    setSubmitError,
  };
};
