import { PlusCircle } from "lucide-react";
import BaseModal from "./BaseModal";

const AddQuoteModal = ({
  isOpen,
  onClose,
  quoteData,
  onQuoteDataChange,
  isSubmitting,
  submitError,
  onSubmit,
  categories,
}) => {
  const isFormValid =
    quoteData.quote.trim() && quoteData.author.trim() && quoteData.kategoriId;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <PlusCircle className="w-5 h-5 mr-2 text-green-600" />
          Tambah Quote Baru
        </>
      }
      isSubmitting={isSubmitting}
    >
      <form onSubmit={onSubmit} className="p-6">
        {submitError && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg">
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
            value={quoteData.kategoriId}
            onChange={onQuoteDataChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 disabled:bg-gray-100"
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
            value={quoteData.quote}
            onChange={onQuoteDataChange}
            rows="3"
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 disabled:bg-gray-100"
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
            value={quoteData.author}
            onChange={onQuoteDataChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 disabled:bg-gray-100"
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
            disabled={!isFormValid || isSubmitting}
            className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-150 flex items-center
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

export default AddQuoteModal;
