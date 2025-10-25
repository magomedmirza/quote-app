import { useState, useEffect } from "react";
import { useCategories } from "./hooks/useCategories";
import { useCategoryModals } from "./hooks/useCategoryModals";
import CategoryHeader from "./components/CategoryHeader";
import CategoryTable from "./components/CategoryTable";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import AddCategoryModal from "./components/modals/AddCategoryModal";
import EditCategoryModal from "./components/modals/EditCategoryModal";
import DeleteConfirmationModal from "./components/modals/DeleteConfirmationModal";

const CategoryManagement = () => {
  const [newCategoryName, setNewCategoryName] = useState("");

  const {
    categories,
    isLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const {
    isAddModalOpen,
    editingCategory,
    deletingCategory,
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
  } = useCategoryModals();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createCategory({ nama: newCategoryName.trim() });
      closeAddModal();
      setNewCategoryName("");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal menambahkan kategori. Coba lagi.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async (id, newName) => {
    if (!id || !newName) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await updateCategory(id, { nama: newName });
      closeEditModal();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Gagal memperbarui kategori. Pastikan nama unik.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!id) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await deleteCategory(id);
      closeDeleteModal();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Gagal menghapus kategori. Pastikan tidak ada postingan yang terkait.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl">
      <CategoryHeader onAddClick={openAddModal} isLoading={isLoading} />

      {categories.length === 0 ? (
        <EmptyState onAddClick={openAddModal} />
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        categoryName={newCategoryName}
        onCategoryNameChange={(e) => setNewCategoryName(e.target.value)}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleAddCategory}
      />

      <EditCategoryModal
        isOpen={!!editingCategory}
        onClose={closeEditModal}
        category={editingCategory}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleEditCategory}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingCategory}
        onClose={closeDeleteModal}
        category={deletingCategory}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
};

export default CategoryManagement;
