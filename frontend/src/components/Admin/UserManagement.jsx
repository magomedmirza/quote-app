import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
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
// 1. KOMPONEN MODAL TAMBAH USER
// =======================================================
const AddUserModal = (props) => {
  const {
    isModalOpen,
    newUser,
    setNewUser,
    isSubmitting,
    submitError,
    handleNewUserSubmit,
    handleCloseModal,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid =
    newUser.nama.trim() &&
    newUser.username.trim() &&
    newUser.password.trim() &&
    newUser.role;

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={
        <>
          <PlusCircle className="w-5 h-5 mr-2 text-pink-600" />
          Tambah User Baru
        </>
      }
      isSubmitting={isSubmitting}
    >
      <form onSubmit={handleNewUserSubmit} className="p-6">
        {submitError && (
          <div
            className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg transition-all duration-300"
            role="alert"
          >
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
            value={newUser.nama}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            value={newUser.username}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              value={newUser.password}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed pr-10"
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
            value={newUser.role}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-pink-500 focus:border-pink-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Pilih Role</option>
            <option value="Admin">Admin</option>
            <option value="Penulis">Penulis</option>
          </select>
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

// =======================================================
// 2. KOMPONEN MODAL EDIT USER
// =======================================================
const EditUserModal = ({
  editingUser,
  isSubmitting,
  submitError,
  handleEditUserSubmit,
  handleCloseEditModal,
}) => {
  const [editedUserData, setEditedUserData] = useState({
    nama: "",
    username: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (editingUser) {
      setEditedUserData({
        nama: editingUser.nama || "",
        username: editingUser.username || "",
        role: editingUser.role || "",
      });
      setPassword("");
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasChanges =
    editingUser &&
    (editedUserData.nama !== editingUser.nama ||
      editedUserData.username !== editingUser.username ||
      editedUserData.role !== editingUser.role ||
      password.trim() !== "");

  const isFormValid =
    editedUserData.nama.trim() &&
    editedUserData.username.trim() &&
    editedUserData.role;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid || !hasChanges || !editingUser) return;

    const submitData = { ...editedUserData };
    if (password.trim()) {
      submitData.password = password;
    }

    handleEditUserSubmit(editingUser.id, submitData);
  };

  const isModalOpen = !!editingUser;

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={handleCloseEditModal}
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
          <div
            className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg transition-all duration-300"
            role="alert"
          >
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed pr-10"
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
            className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Pilih Role</option>
            <option value="Admin">Admin</option>
            <option value="Penulis">Penulis</option>
          </select>
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
  deletingUser,
  isSubmitting,
  submitError,
  handleDeleteUserConfirm,
  handleCloseDeleteModal,
}) => {
  const isModalOpen = !!deletingUser;

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
          Apakah Anda yakin ingin menghapus user{" "}
          <span className="font-bold text-red-600">"{deletingUser?.nama}"</span>{" "}
          dengan username{" "}
          <span className="font-bold text-red-600">
            "{deletingUser?.username}"
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
            onClick={() => handleDeleteUserConfirm(deletingUser?.id)}
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
function UserManagement() {
  // State management
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    nama: "",
    username: "",
    password: "",
    role: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/user");
      setUsers(response.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        err.response?.data?.message || "Gagal memuat data user dari server."
      );
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Modal handlers
  const handleCloseAddModal = useCallback(() => {
    if (!isSubmitting) {
      setIsAddModalOpen(false);
      setNewUser({
        nama: "",
        username: "",
        password: "",
        role: "",
      });
      setSubmitError(null);
    }
  }, [isSubmitting]);

  const handleCloseEditModal = useCallback(() => {
    if (!isSubmitting) {
      setEditingUser(null);
      setSubmitError(null);
    }
  }, [isSubmitting]);

  const handleCloseDeleteModal = useCallback(() => {
    if (!isSubmitting) {
      setDeletingUser(null);
      setSubmitError(null);
    }
  }, [isSubmitting]);

  // CRUD operations
  const handleNewUserSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (
        !newUser.nama.trim() ||
        !newUser.username.trim() ||
        !newUser.password.trim() ||
        !newUser.role
      ) {
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await api.post("/user", newUser);
        handleCloseAddModal();
        await fetchUsers();
      } catch (err) {
        console.error("Error adding user:", err);
        const errorMessage =
          err.response?.data?.message || "Gagal menambahkan user. Coba lagi.";
        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [newUser, fetchUsers, handleCloseAddModal]
  );

  const handleEdit = useCallback((user) => {
    setSubmitError(null);
    setEditingUser(user);
  }, []);

  const handleEditUserSubmit = useCallback(
    async (id, updatedData) => {
      if (!id) return;

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await api.put(`/user/${id}`, updatedData);
        handleCloseEditModal();
        await fetchUsers();
      } catch (err) {
        console.error("Error updating user:", err);
        const errorMessage =
          err.response?.data?.message || "Gagal memperbarui user.";
        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchUsers, handleCloseEditModal]
  );

  const handleDelete = useCallback((user) => {
    setSubmitError(null);
    setDeletingUser(user);
  }, []);

  const handleDeleteUserConfirm = useCallback(
    async (id) => {
      if (!id) return;

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await api.delete(`/user/${id}`);
        handleCloseDeleteModal();
        await fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        const errorMessage =
          err.response?.data?.message || "Gagal menghapus user.";
        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchUsers, handleCloseDeleteModal]
  );

  // Role badge styling
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Penulis":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl relative">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-3 mb-6 flex justify-between items-center">
        <span className="flex items-center">
          <Users className="inline-block mr-2 text-pink-500" />
          Manajemen User
        </span>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-pink-600 text-white font-semibold text-sm rounded-lg hover:bg-pink-700 transition duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Tambah User
        </button>
      </h2>

      <p className="text-gray-600 mb-6">
        Kelola akun pengguna, berikan hak admin atau penulis.
      </p>

      {isLoading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 inline-block mr-2"></div>
          <span className="text-pink-600 font-medium">Memuat data user...</span>
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
          {users.length === 0 ? (
            <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
              Tidak ada user ditemukan. Klik "Tambah User" untuk memulai.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                    Role
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}.
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-yellow-600 hover:text-yellow-900 mr-3 p-1 rounded-full hover:bg-yellow-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Edit User"
                        disabled={isSubmitting}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Hapus User"
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
      <AddUserModal
        isModalOpen={isAddModalOpen}
        newUser={newUser}
        setNewUser={setNewUser}
        isSubmitting={isSubmitting}
        submitError={submitError}
        handleNewUserSubmit={handleNewUserSubmit}
        handleCloseModal={handleCloseAddModal}
      />

      <EditUserModal
        editingUser={editingUser}
        isSubmitting={isSubmitting}
        submitError={submitError}
        handleEditUserSubmit={handleEditUserSubmit}
        handleCloseEditModal={handleCloseEditModal}
      />

      <DeleteConfirmationModal
        deletingUser={deletingUser}
        isSubmitting={isSubmitting}
        submitError={submitError}
        handleDeleteUserConfirm={handleDeleteUserConfirm}
        handleCloseDeleteModal={handleCloseDeleteModal}
      />
    </div>
  );
}

export default UserManagement;
