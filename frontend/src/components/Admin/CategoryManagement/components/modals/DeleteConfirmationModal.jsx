import { Trash2 } from "lucide-react";
import BaseModal from "./BaseModal";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  category,
  isSubmitting,
  submitError,
  onConfirm,
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
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
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg">
            <p className="font-medium">Gagal menghapus:</p>
            <p>{submitError}</p>
          </div>
        )}

        <p className="text-gray-700 mb-6">
          Apakah Anda yakin ingin menghapus kategori{" "}
          <span className="font-bold text-red-600">"{category?.nama}"</span>?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 font-medium disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(category?.id)}
            disabled={isSubmitting}
            className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-150 flex items-center
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

export default DeleteConfirmationModal;
