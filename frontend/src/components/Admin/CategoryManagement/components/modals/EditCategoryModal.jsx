import { Edit, Save } from "lucide-react";
import { useState, useEffect } from "react";
import BaseModal from "./BaseModal";

const EditCategoryModal = ({
  isOpen,
  onClose,
  category,
  isSubmitting,
  submitError,
  onSubmit,
}) => {
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    if (category) {
      setEditedName(category.nama || "");
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editedName.trim() || !category) return;
    onSubmit(category.id, editedName.trim());
  };

  const isNameUnchanged = editedName.trim() === category?.nama;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
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
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg">
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100"
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
            disabled={!editedName.trim() || isNameUnchanged || isSubmitting}
            className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-150 flex items-center
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

export default EditCategoryModal;
