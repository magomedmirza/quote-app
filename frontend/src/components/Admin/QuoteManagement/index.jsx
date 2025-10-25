import { useState, useEffect } from "react";
import { useQuotes } from "./hooks/useQuotes";
import { useCategories } from "./hooks/useCategories";
import { useQuoteModals } from "./hooks/useQuoteModals";
import QuoteHeader from "./components/QuoteHeader";
import QuoteTable from "./components/QuoteTable";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import AddQuoteModal from "./components/modals/AddQuoteModal";
import EditQuoteModal from "./components/modals/EditQuoteModal";
import DeleteConfirmationModal from "./components/modals/DeleteConfirmationModal";

const QuoteManagement = () => {
  const [newQuote, setNewQuote] = useState({
    kategoriId: "",
    quote: "",
    author: "",
    userId: localStorage.getItem("userId") || "1",
  });

  const {
    quotes,
    isLoading,
    error,
    fetchQuotes,
    createQuote,
    updateQuote,
    deleteQuote,
  } = useQuotes();

  const { categories, fetchCategories } = useCategories();

  const {
    isAddModalOpen,
    editingQuote,
    deletingQuote,
    isSubmitting,
    submitError,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    setIsSubmitting,
    setSubmitError,
  } = useQuoteModals();

  useEffect(() => {
    fetchCategories();
    fetchQuotes();
  }, [fetchCategories, fetchQuotes]);

  const handleAddQuote = async (e) => {
    e.preventDefault();
    if (
      !newQuote.quote.trim() ||
      !newQuote.author.trim() ||
      !newQuote.kategoriId
    )
      return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createQuote(newQuote);
      closeAddModal();
      setNewQuote({
        kategoriId: "",
        quote: "",
        author: "",
        userId: localStorage.getItem("userId") || "1",
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal menambahkan quote. Coba lagi.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditQuote = async (id, updatedData) => {
    if (!id) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await updateQuote(id, updatedData);
      closeEditModal();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal memperbarui quote.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuote = async (id) => {
    if (!id) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await deleteQuote(id);
      closeDeleteModal();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal menghapus quote.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuoteDataChange = (e) => {
    const { name, value } = e.target;
    setNewQuote((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl">
      <QuoteHeader onAddClick={openAddModal} isLoading={isLoading} />

      {quotes.length === 0 ? (
        <EmptyState onAddClick={openAddModal} />
      ) : (
        <QuoteTable
          quotes={quotes}
          categories={categories}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Modals */}
      <AddQuoteModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        quoteData={newQuote}
        onQuoteDataChange={handleQuoteDataChange}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleAddQuote}
        categories={categories}
      />

      <EditQuoteModal
        isOpen={!!editingQuote}
        onClose={closeEditModal}
        quote={editingQuote}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleEditQuote}
        categories={categories}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingQuote}
        onClose={closeDeleteModal}
        quote={deletingQuote}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onConfirm={handleDeleteQuote}
      />
    </div>
  );
};

export default QuoteManagement;
