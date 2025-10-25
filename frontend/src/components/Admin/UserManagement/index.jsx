import { useState, useEffect } from "react";
import { useUsers } from "./hooks/useUsers";
import { useUserModals } from "./hooks/useUserModals";
import UserHeader from "./components/UserHeader";
import UserTable from "./components/UserTable";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import AddUserModal from "./components/modals/AddUserModal";
import EditUserModal from "./components/modals/EditUserModal";
import DeleteConfirmationModal from "./components/modals/DeleteConfirmationModal";

const UserManagement = () => {
  const [newUser, setNewUser] = useState({
    nama: "",
    username: "",
    password: "",
    role: "",
  });

  const {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const {
    isAddModalOpen,
    editingUser,
    deletingUser,
    isSubmitting,
    submitError,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    setIsSubmitting,
    setSubmitError,
  } = useUserModals();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (e) => {
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
      await createUser(newUser);
      closeAddModal();
      setNewUser({
        nama: "",
        username: "",
        password: "",
        role: "",
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal menambahkan user. Coba lagi.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (id, updatedData) => {
    if (!id) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await updateUser(id, updatedData);
      closeEditModal();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal memperbarui user.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!id) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await deleteUser(id);
      closeDeleteModal();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal menghapus user.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl">
      <UserHeader onAddClick={openAddModal} isLoading={isLoading} />

      {users.length === 0 ? (
        <EmptyState onAddClick={openAddModal} />
      ) : (
        <UserTable
          users={users}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        userData={newUser}
        onUserDataChange={handleUserDataChange}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleAddUser}
      />

      <EditUserModal
        isOpen={!!editingUser}
        onClose={closeEditModal}
        user={editingUser}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleEditUser}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingUser}
        onClose={closeDeleteModal}
        user={deletingUser}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default UserManagement;
