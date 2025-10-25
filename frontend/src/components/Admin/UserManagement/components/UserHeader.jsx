import { Users, PlusCircle } from "lucide-react";

const UserHeader = ({ onAddClick, isLoading }) => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h2 className="text-3xl font-bold text-gray-800 flex items-center">
        <Users className="inline-block mr-2 text-pink-500" />
        Manajemen User
      </h2>
      <p className="text-gray-600 mt-2">
        Kelola akun pengguna, berikan hak admin atau penulis.
      </p>
    </div>

    <button
      onClick={onAddClick}
      className="flex items-center px-4 py-2 bg-pink-600 text-white font-semibold text-sm rounded-lg hover:bg-pink-700 transition duration-150 shadow-md disabled:opacity-50"
      disabled={isLoading}
    >
      <PlusCircle className="w-4 h-4 mr-2" />
      Tambah User
    </button>
  </div>
);

export default UserHeader;
