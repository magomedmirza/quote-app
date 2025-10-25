import { Edit, Save } from "lucide-react";
import { useState, useEffect } from "react";
import BaseModal from "./BaseModal";

const EditQuoteModal = ({
  isOpen,
  onClose,
  quote,
  isSubmitting,
  submitError,
  onSubmit,
  categories,
}) => {
  const [editedQuoteData, setEditedQuoteData] = useState({
    kategoriId: "",
    quote: "",
    author: "",
    userId: "",
  });

  useEffect(() => {
    if (quote) {
      setEditedQuoteData({
        kategoriId: quote.kategoriId || "",
        quote: quote.quote || "",
        author: quote.author || "",
        userId: quote.userId || "",
      });
    }
  }, [quote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedQuoteData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasChanges =
    quote &&
    (editedQuoteData.kategoriId !== quote.kategoriId ||
      editedQuoteData.quote.trim() !== quote.quote ||
      editedQuoteData.author.trim() !== quote.author);

  const isFormValid =
    editedQuoteData.quote.trim() &&
    editedQuoteData.author.trim() &&
    editedQuoteData.kategoriId;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid || !hasChanges || !quote) return;
    onSubmit(quote.id, editedQuoteData);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
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
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg">
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
            className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 font-medium disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={!isFormValid || !hasChanges || isSubmitting}
            className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-150 flex items-center
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

export default EditQuoteModal;
