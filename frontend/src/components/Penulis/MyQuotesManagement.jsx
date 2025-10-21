import React, { useState, useEffect, useCallback } from "react";
import {
  Quote,
  Edit,
  Trash2,
  PlusCircle,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 transform transition-all duration-300 scale-100"
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
// 1. KOMPONEN MODAL TAMBAH QUOTE
// =======================================================
const AddQuoteModal = (props) => {
  const {
    isModalOpen,
    newQuote,
    setNewQuote,
    isSubmitting,
    submitError,
    handleNewQuoteSubmit,
    handleCloseModal,
    categories,
  } = props;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewQuote((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid =
    newQuote.quote.trim() && newQuote.author.trim() && newQuote.kategoriId;

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={
        <>
          <PlusCircle className="w-5 h-5 mr-2 text-green-600" />
          Tambah Quote Baru
        </>
      }
      isSubmitting={isSubmitting}
    >
      <form onSubmit={handleNewQuoteSubmit} className="p-6">
        {submitError && (
          <div
            className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg transition-all duration-300"
            role="alert"
          >
            <p className="font-medium">Gagal menyimpan quote:</p>
            <p>{submitError}</p>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="kategoriId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Kategori
          </label>
          <select
            id="kategoriId"
            name="kategoriId"
            value={newQuote.kategoriId}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="quote"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Isi Quote
          </label>
          <textarea
            id="quote"
            name="quote"
            placeholder="Masukkan isi quote di sini..."
            value={newQuote.quote}
            onChange={handleChange}
            rows="3"
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nama Penulis/Author
          </label>
          <input
            id="author"
            name="author"
            type="text"
            placeholder="Misalnya: Ali Bin Abi Thalib"
            value={newQuote.author}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            disabled={!isFormValid || isSubmitting}
            className={`
              px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-150 flex items-center
              ${
                isSubmitting || !isFormValid
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }
            `}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <PlusCircle className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Menyimpan..." : "Simpan Quote"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

// =======================================================
// 2. KOMPONEN MODAL EDIT QUOTE
// =======================================================
const EditQuoteModal = ({
  editingQuote,
  isSubmitting,
  submitError,
  handleEditQuoteSubmit,
  handleCloseEditModal,
  categories,
}) => {
  const [editedQuoteData, setEditedQuoteData] = useState({
    kategoriId: "",
    quote: "",
    author: "",
    userId: "",
  });

  useEffect(() => {
    if (editingQuote) {
      setEditedQuoteData({
        kategoriId: editingQuote.kategoriId || "",
        quote: editingQuote.quote || "",
        author: editingQuote.author || "",
        userId: editingQuote.userId || "",
      });
    }
  }, [editingQuote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedQuoteData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasChanges =
    editingQuote &&
    (editedQuoteData.kategoriId !== editingQuote.kategoriId ||
      editedQuoteData.quote.trim() !== editingQuote.quote ||
      editedQuoteData.author.trim() !== editingQuote.author);

  const isFormValid =
    editedQuoteData.quote.trim() &&
    editedQuoteData.author.trim() &&
    editedQuoteData.kategoriId;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid || !hasChanges || !editingQuote) return;
    handleEditQuoteSubmit(editingQuote.id, editedQuoteData);
  };

  const isModalOpen = !!editingQuote;

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={handleCloseEditModal}
      title={
        <>
          <Edit className="w-5 h-5 mr-2 text-yellow-600" />
          Edit Quote
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
            <p className="font-medium">Gagal memperbarui quote:</p>
            <p>{submitError}</p>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="editedKategoriId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Kategori
          </label>
          <select
            id="editedKategoriId"
            name="kategoriId"
            value={editedQuoteData.kategoriId}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="editedQuote"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Isi Quote
          </label>
          <textarea
            id="editedQuote"
            name="quote"
            placeholder="Masukkan isi quote di sini..."
            value={editedQuoteData.quote}
            onChange={handleChange}
            rows="3"
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="editedAuthor"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nama Penulis/Author
          </label>
          <input
            id="editedAuthor"
            name="author"
            type="text"
            placeholder="Misalnya: Ali Bin Abi Thalib"
            value={editedQuoteData.author}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            disabled={!isFormValid || !hasChanges || isSubmitting}
            className={`
              px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-150 flex items-center
              ${
                isSubmitting || !isFormValid || !hasChanges
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
  deletingQuote,
  isSubmitting,
  submitError,
  handleDeleteQuoteConfirm,
  handleCloseDeleteModal,
}) => {
  const isModalOpen = !!deletingQuote;

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
          Apakah Anda yakin ingin menghapus quote dari{" "}
          <span className="font-bold text-red-600">
            "{deletingQuote?.author}"
          </span>{" "}
          dengan isi:
          <i className="block mt-2 p-2 bg-red-50 rounded-md border-l-4 border-red-400">
            "{deletingQuote?.quote}"
          </i>
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
            onClick={() => handleDeleteQuoteConfirm(deletingQuote?.id)}
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
// UTILITY FUNCTIONS
// =======================================================
const getUserIdFromLocalStorage = () => {
  return localStorage.getItem("userId");
};

// =======================================================
// KOMPONEN UTAMA MY QUOTES MANAGEMENT
// =======================================================
function MyQuotesManagement() {
  const currentUserId = getUserIdFromLocalStorage();

  // State management
  const [quotes, setQuotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuote, setNewQuote] = useState({
    kategoriId: "",
    quote: "",
    author: "",
    userId: currentUserId,
  });
  const [editingQuote, setEditingQuote] = useState(null);
  const [deletingQuote, setDeletingQuote] = useState(null);

  // Fetch functions - HANYA QUOTE MILIK PENULIS SAJA
  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const response = await api.get("/kategori");
      setCategories(response.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  const fetchMyQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Hanya ambil quotes milik penulis yang sedang login
      const response = await api.get(`/quote/user/${currentUserId}`);
      setQuotes(response.data || []);
    } catch (err) {
      console.error("Error fetching my quotes:", err);
      setError(err.response?.data?.message || "Gagal memuat data quote Anda.");
      setQuotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchCategories();
    fetchMyQuotes();
  }, [fetchCategories, fetchMyQuotes]);

  // Modal handlers
  const handleCloseAddModal = useCallback(() => {
    if (!isSubmitting) {
      setIsAddModalOpen(false);
      setNewQuote({
        kategoriId: "",
        quote: "",
        author: "",
        userId: currentUserId,
      });
      setSubmitError(null);
    }
  }, [isSubmitting, currentUserId]);

  const handleCloseEditModal = useCallback(() => {
    if (!isSubmitting) {
      setEditingQuote(null);
      setSubmitError(null);
    }
  }, [isSubmitting]);

  const handleCloseDeleteModal = useCallback(() => {
    if (!isSubmitting) {
      setDeletingQuote(null);
      setSubmitError(null);
    }
  }, [isSubmitting]);

  // CRUD operations
  const handleNewQuoteSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (
        !newQuote.quote.trim() ||
        !newQuote.author.trim() ||
        !newQuote.kategoriId
      ) {
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await api.post("/quote", newQuote);
        handleCloseAddModal();
        await fetchMyQuotes();
      } catch (err) {
        console.error("Error adding quote:", err);
        const errorMessage =
          err.response?.data?.message || "Gagal menambahkan quote. Coba lagi.";
        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [newQuote, fetchMyQuotes, handleCloseAddModal]
  );

  const handleEdit = useCallback((quote) => {
    setSubmitError(null);
    setEditingQuote(quote);
  }, []);

  const handleEditQuoteSubmit = useCallback(
    async (id, updatedData) => {
      if (!id) return;

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await api.put(`/quote/${id}`, updatedData);
        handleCloseEditModal();
        await fetchMyQuotes();
      } catch (err) {
        console.error("Error updating quote:", err);
        const errorMessage =
          err.response?.data?.message || "Gagal memperbarui quote.";
        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchMyQuotes, handleCloseEditModal]
  );

  const handleDelete = useCallback((quote) => {
    setSubmitError(null);
    setDeletingQuote(quote);
  }, []);

  const handleDeleteQuoteConfirm = useCallback(
    async (id) => {
      if (!id) return;

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await api.delete(`/quote/${id}`);
        handleCloseDeleteModal();
        await fetchMyQuotes();
      } catch (err) {
        console.error("Error deleting quote:", err);
        const errorMessage =
          err.response?.data?.message || "Gagal menghapus quote.";
        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchMyQuotes, handleCloseDeleteModal]
  );

  // Utility function
  const getCategoryName = (kategoriId) => {
    if (isLoadingCategories || categories.length === 0) return "Memuat...";
    const category = categories.find((cat) => cat.id === kategoriId);
    return category ? category.nama : "Tidak Diketahui";
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl relative">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-3 mb-6 flex justify-between items-center">
        <span className="flex items-center">
          <Quote className="inline-block mr-2 text-green-500" />
          Quotes Saya
        </span>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-700 transition duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Tambah Quote
        </button>
      </h2>

      {isLoading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 inline-block mr-2"></div>
          <span className="text-green-600 font-medium">
            Memuat quotes Anda...
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
          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Belum ada quotes</p>
              <p className="text-gray-400">Mulai buat quote pertama Anda</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150 mx-auto"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Buat Quote Pertama
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">
                    Isi Quote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Penulis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.map((quote, index) => (
                  <tr key={quote.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 align-top">
                      {index + 1}.
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 align-top max-w-sm">
                      <p className="line-clamp-3">"{quote.quote}"</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-top">
                      {quote.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-top">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {getCategoryName(quote.kategoriId)}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium align-top space-x-1">
                      <button
                        onClick={() => handleEdit(quote)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Edit Quote"
                        disabled={isSubmitting}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(quote)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Hapus Quote"
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
      <AddQuoteModal
        isModalOpen={isAddModalOpen}
        newQuote={newQuote}
        setNewQuote={setNewQuote}
        isSubmitting={isSubmitting}
        submitError={submitError}
        handleNewQuoteSubmit={handleNewQuoteSubmit}
        handleCloseModal={handleCloseAddModal}
        categories={categories}
      />

      <EditQuoteModal
        editingQuote={editingQuote}
        isSubmitting={isSubmitting}
        submitError={submitError}
        handleEditQuoteSubmit={handleEditQuoteSubmit}
        handleCloseEditModal={handleCloseEditModal}
        categories={categories}
      />

      <DeleteConfirmationModal
        deletingQuote={deletingQuote}
        isSubmitting={isSubmitting}
        submitError={submitError}
        handleDeleteQuoteConfirm={handleDeleteQuoteConfirm}
        handleCloseDeleteModal={handleCloseDeleteModal}
      />
    </div>
  );
}

export default MyQuotesManagement;
