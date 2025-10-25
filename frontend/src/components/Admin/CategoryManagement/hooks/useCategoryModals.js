import { useState, useCallback } from "react";

export const useCategoryModals = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
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

  const openEditModal = useCallback((category) => {
    setEditingCategory(category);
    setSubmitError(null);
  }, []);

  const closeEditModal = useCallback(() => {
    if (!isSubmitting) {
      setEditingCategory(null);
      setSubmitError(null);
    }
  }, [isSubmitting]);

  const openDeleteModal = useCallback((category) => {
    setDeletingCategory(category);
    setSubmitError(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (!isSubmitting) {
      setDeletingCategory(null);
      setSubmitError(null);
    }
  }, [isSubmitting]);

  return {
    // Modal states
    isAddModalOpen,
    editingCategory,
    deletingCategory,
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
