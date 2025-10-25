import { PlusCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import BaseModal from "./BaseModal";

const AddUserModal = ({
  isOpen,
  onClose,
  userData,
  onUserDataChange,
  isSubmitting,
  submitError,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid =
    userData.nama.trim() &&
    userData.username.trim() &&
    userData.password.trim() &&
    userData.role;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <PlusCircle className="w-5 h-5 mr-2 text-pink-600" />
          Tambah User Baru
        </>
      }
      isSubmitting={isSubmitting}
    >
      <form onSubmit={onSubmit} className="p-6">
        {submitError && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg">
            <p className="font-medium">Gagal menyimpan user:</p>
            <p>{submitError}</p>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="nama"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nama Lengkap
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            placeholder="Masukkan nama lengkap"
            value={userData.nama}
            onChange={onUserDataChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 transition duration-150 disabled:bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Masukkan username"
            value={userData.username}
            onChange={onUserDataChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 transition duration-150 disabled:bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={userData.password}
              onChange={onUserDataChange}
              required
              disabled={isSubmitting}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 transition duration-150 disabled:bg-gray-100 pr-10"
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
        </div>

        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={userData.role}
            onChange={onUserDataChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-pink-500 focus:border-pink-500 transition duration-150 disabled:bg-gray-100"
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
            disabled={!isFormValid || isSubmitting}
            className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-150 flex items-center
              ${
                isSubmitting || !isFormValid
                  ? "bg-pink-400 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-700"
              }
            `}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <PlusCircle className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Menyimpan..." : "Simpan User"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default AddUserModal;
