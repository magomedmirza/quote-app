import { useState, useCallback } from "react";

export const useQuoteModals = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [deletingQuote, setDeletingQuote] = useState(null);
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

  const openEditModal = useCallback((quote) => {
    setEditingQuote(quote);
    setSubmitError(null);
  }, []);

  const closeEditModal = useCallback(() => {
    if (!isSubmitting) {
      setEditingQuote(null);
      setSubmitError(null);
    }
  }, [isSubmitting]);

  const openDeleteModal = useCallback((quote) => {
    setDeletingQuote(quote);
    setSubmitError(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (!isSubmitting) {
      setDeletingQuote(null);
      setSubmitError(null);
    }
  }, [isSubmitting]);

  return {
    // Modal states
    isAddModalOpen,
    editingQuote,
    deletingQuote,
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
