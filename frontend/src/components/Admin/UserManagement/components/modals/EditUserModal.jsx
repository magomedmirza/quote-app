import { Edit, Save, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import BaseModal from "./BaseModal";

const EditUserModal = ({
  isOpen,
  onClose,
  user,
  isSubmitting,
  submitError,
  onSubmit,
}) => {
  const [editedUserData, setEditedUserData] = useState({
    nama: "",
    username: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setEditedUserData({
        nama: user.nama || "",
        username: user.username || "",
        role: user.role || "",
      });
      setPassword("");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasChanges =
    user &&
    (editedUserData.nama !== user.nama ||
      editedUserData.username !== user.username ||
      editedUserData.role !== user.role ||
      password.trim() !== "");

  const isFormValid =
    editedUserData.nama.trim() &&
    editedUserData.username.trim() &&
    editedUserData.role;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid || !hasChanges || !user) return;

    const submitData = { ...editedUserData };
    if (password.trim()) {
      submitData.password = password;
    }

    onSubmit(user.id, submitData);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <Edit className="w-5 h-5 mr-2 text-yellow-600" />
          Edit User
        </>
      }
      isSubmitting={isSubmitting}
    >
      <form onSubmit={handleSubmit} className="p-6">
        {submitError && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg">
            <p className="font-medium">Gagal memperbarui user:</p>
            <p>{submitError}</p>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="editedNama"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nama Lengkap
          </label>
          <input
            id="editedNama"
            name="nama"
            type="text"
            placeholder="Masukkan nama lengkap"
            value={editedUserData.nama}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="editedUsername"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Username
          </label>
          <input
            id="editedUsername"
            name="username"
            type="text"
            placeholder="Masukkan username"
            value={editedUserData.username}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="editedPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password Baru (Opsional)
          </label>
          <div className="relative">
            <input
              id="editedPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Kosongkan jika tidak ingin mengubah password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Biarkan kosong jika tidak ingin mengubah password
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="editedRole"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Role
          </label>
          <select
            id="editedRole"
            name="role"
            value={editedUserData.role}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100"
          >
            <option value="">Pilih Role</option>
            <option value="Admin">Admin</option>
            <option value="Penulis">Penulis</option>
          </select>
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

export default EditUserModal;
