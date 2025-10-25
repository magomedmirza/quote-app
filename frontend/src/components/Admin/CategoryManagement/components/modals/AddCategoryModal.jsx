import { PlusCircle } from "lucide-react";
import BaseModal from "./BaseModal";

const AddCategoryModal = ({
  isOpen,
  onClose,
  categoryName,
  onCategoryNameChange,
  isSubmitting,
  submitError,
  onSubmit,
}) => (
  <BaseModal
    isOpen={isOpen}
    onClose={onClose}
    title={
      <>
        <PlusCircle className="w-5 h-5 mr-2 text-indigo-600" />
        Tambah Kategori Baru
      </>
    }
    isSubmitting={isSubmitting}
  >
    <form onSubmit={onSubmit} className="p-6">
      {submitError && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg">
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
          value={categoryName}
          onChange={onCategoryNameChange}
          required
          disabled={isSubmitting}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-100"
          autoFocus
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
          disabled={!categoryName.trim() || isSubmitting}
          className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-150 flex items-center
            ${
              isSubmitting || !categoryName.trim()
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

export default AddCategoryModal;
