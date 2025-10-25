import { Edit, Trash2 } from "lucide-react";

const UserTable = ({ users, onEdit, onDelete, isSubmitting }) => {
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
    <div className="overflow-x-auto mt-6">
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
                  onClick={() => onEdit(user)}
                  className="text-yellow-600 hover:text-yellow-900 mr-3 p-1 rounded-full hover:bg-yellow-50 transition duration-150 disabled:opacity-50"
                  title="Edit User"
                  disabled={isSubmitting}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(user)}
                  className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition duration-150 disabled:opacity-50"
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
    </div>
  );
};

export default UserTable;
