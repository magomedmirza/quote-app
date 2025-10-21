import React, { useState, useEffect, useCallback } from "react";
import { Tag, Edit, Trash2, PlusCircle, Save } from "lucide-react";
import api from "../../api/axios";

// =======================================================
// KOMPONEN MODAL DASAR
// =======================================================
const BaseModal = ({
  isOpen,
  onClose,
  title,
  children,
  isSubmitting,
  hideCloseButton,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 transition-opacity duration-300 backdrop-blur-sm"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            {title}
          </h3>
          {!hideCloseButton && (
            <button
              onClick={() => !isSubmitting && onClose()}
              className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

// =======================================================
// 1. KOMPONEN MODAL TAMBAH KATEGORI
// =======================================================
const AddCategoryModal = (props) => {
  const {
    isModalOpen,
    newCategoryName,
    setNewCategoryName,
    isSubmitting,
    submitError,
    handleNewCategorySubmit,
    handleCloseModal,
  } = props;

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={
        <>
          <PlusCircle className="w-5 h-5 mr-2 text-indigo-600" />
          Tambah Kategori Baru
        </>
      }
      isSubmitting={isSubmitting}
    >
      <form onSubmit={handleNewCategorySubmit} className="p-6">
        {submitError && (
          <div
            className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg transition-all duration-300"
            role="alert"
          >
            <p className="font-medium">Gagal menyimpan kategori:</p>
            <p>{submitError}</p>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="categoryName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nama Kategori
          </label>
          <input
            id="categoryName"
            type="text"
            placeholder="Misalnya: Motivasi, Filosofi, Humor"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
            autoFocus
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={handleCloseModal}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={!newCategoryName.trim() || isSubmitting}
            className={`
              px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-150 flex items-center
              ${
                isSubmitting || !newCategoryName.trim()
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }
            `}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <PlusCircle className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

// =======================================================
// 2. KOMPONEN MODAL EDIT KATEGORI
// =======================================================
const EditCategoryModal = ({
  editingCategory,
  isSubmitting,
  submitError,
  handleEditCategorySubmit,
  handleCloseEditModal,
}) => {
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    if (editingCategory) {
      setEditedName(editingCategory.nama || "");
    }
  }, [editingCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editedName.trim() || !editingCategory) return;
    handleEditCategorySubmit(editingCategory.id, editedName.trim());
  };

  const isModalOpen = !!editingCategory;
  const isNameUnchanged = editedName.trim() === editingCategory?.nama;

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={handleCloseEditModal}
      title={
        <>
          <Edit className="w-5 h-5 mr-2 text-yellow-600" />
          Edit Kategori
        </>
      }
      isSubmitting={isSubmitting}
    >
      <form onSubmit={handleSubmit} className="p-6">
        {submitError && (
          <div
            className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg transition-all duration-300"
            role="alert"
          >
            <p className="font-medium">Gagal memperbarui kategori:</p>
            <p>{submitError}</p>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="editedCategoryName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nama Kategori
          </label>
          <input
            id="editedCategoryName"
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
            autoFocus
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={handleCloseEditModal}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={!editedName.trim() || isNameUnchanged || isSubmitting}
            className={`
              px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-150 flex items-center
              ${
                isSubmitting || isNameUnchanged
                  ? "bg-yellow-400 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }
            `}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Memperbarui..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

// =======================================================
// 3. KOMPONEN MODAL KONFIRMASI HAPUS
// =======================================================
const DeleteConfirmationModal = ({
  deletingCategory,
  isSubmitting,
  submitError,
  handleDeleteCategoryConfirm,
  handleCloseDeleteModal,
}) => {
  const isModalOpen = !!deletingCategory;

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={handleCloseDeleteModal}
      title={
        <>
          <Trash2 className="w-5 h-5 mr-2 text-red-600" />
          Konfirmasi Hapus
        </>
      }
      isSubmitting={isSubmitting}
    >
      <div className="p-6">
        {submitError && (
          <div
            className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg"
            role="alert"
          >
            <p className="font-medium">Gagal menghapus:</p>
            <p>{submitError}</p>
          </div>
        )}

        <p className="text-gray-700 mb-6">
          Apakah Anda yakin ingin menghapus kategori{" "}
          <span className="font-bold text-red-600">
            "{deletingCategory?.nama}"
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCloseDeleteModal}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => handleDeleteCategoryConfirm(deletingCategory?.id)}
            disabled={isSubmitting}
            className={`
              px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-150 flex items-center
              ${
                isSubmitting
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }
            `}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Menghapus..." : "Hapus Permanen"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

// =======================================================
// KOMPONEN UTAMA
// =======================================================
function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // State untuk submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch categories
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

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handler untuk menutup modal
  const handleCloseAddModal = useCallback(() => {
    if (!isSubmitting) {
      setIsAddModalOpen(false);
      setNewCategoryName("");
      setSubmitError(null);
    }
  }, [isSubmitting]);

  const handleCloseEditModal = useCallback(() => {
    if (!isSubmitting) {
      setEditingCategory(null);
      setSubmitError(null);
    }
  }, [isSubmitting]);

  const handleCloseDeleteModal = useCallback(() => {
    if (!isSubmitting) {
      setDeletingCategory(null);
      setSubmitError(null);
    }
  }, [isSubmitting]);

  // CRUD Operations
  const handleNewCategorySubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newCategoryName.trim()) return;

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await api.post("/kategori", { nama: newCategoryName.trim() });
        handleCloseAddModal();
        await fetchCategories();
      } catch (err) {
        console.error("Error adding category:", err);
        const errorMessage =
          err.response?.data?.message ||
          "Gagal menambahkan kategori. Coba lagi.";
        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [newCategoryName, fetchCategories, handleCloseAddModal]
  );

  const handleEdit = useCallback((category) => {
    setSubmitError(null);
    setEditingCategory(category);
  }, []);

  const handleEditCategorySubmit = useCallback(
    async (id, newName) => {
      if (!id || !newName) return;

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await api.put(`/kategori/${id}`, { nama: newName });
        handleCloseEditModal();
        await fetchCategories();
      } catch (err) {
        console.error("Error updating category:", err);
        const errorMessage =
          err.response?.data?.message ||
          "Gagal memperbarui kategori. Pastikan nama unik.";
        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchCategories, handleCloseEditModal]
  );

  const handleDelete = useCallback((category) => {
    setSubmitError(null);
    setDeletingCategory(category);
  }, []);

  const handleDeleteCategoryConfirm = useCallback(
    async (id) => {
      if (!id) return;

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await api.delete(`/kategori/${id}`);
        handleCloseDeleteModal();
        await fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err);
        const errorMessage =
          err.response?.data?.message ||
          "Gagal menghapus kategori. Pastikan tidak ada postingan yang terkait.";
        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchCategories, handleCloseDeleteModal]
  );

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl relative">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-3 mb-6 flex justify-between items-center">
        <span className="flex items-center">
          <Tag className="inline-block mr-2 text-indigo-500" />
          Manajemen Kategori
        </span>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Tambah Kategori
        </button>
      </h2>
      <p className="text-gray-600 mb-6">Kelola Kategori Quote</p>
      {isLoading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 inline-block mr-2"></div>
          <span className="text-indigo-600 font-medium">
            Memuat data kategori...
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto mt-6">
          {categories.length === 0 ? (
            <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
              Tidak ada kategori ditemukan. Klik "Tambah Kategori" untuk
              memulai.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                    Nama Kategori
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category, index) => (
                  <tr key={category.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}.
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {category.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 rounded-full hover:bg-indigo-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Edit Kategori"
                        disabled={isSubmitting}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Hapus Kategori"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal Components */}
      <AddCategoryModal
        isModalOpen={isAddModalOpen}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        isSubmitting={isSubmitting}
        submitError={submitError}
        handleNewCategorySubmit={handleNewCategorySubmit}
        handleCloseModal={handleCloseAddModal}
      />

      <EditCategoryModal
        editingCategory={editingCategory}
        isSubmitting={isSubmitting}
        submitError={submitError}
        handleEditCategorySubmit={handleEditCategorySubmit}
        handleCloseEditModal={handleCloseEditModal}
      />

      <DeleteConfirmationModal
        deletingCategory={deletingCategory}
        isSubmitting={isSubmitting}
        submitError={submitError}
        handleDeleteCategoryConfirm={handleDeleteCategoryConfirm}
        handleCloseDeleteModal={handleCloseDeleteModal}
      />
    </div>
  );
}

export default CategoryManagement;
