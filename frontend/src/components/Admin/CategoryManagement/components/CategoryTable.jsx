import { Edit, Trash2 } from "lucide-react";

const CategoryTable = ({ categories, onEdit, onDelete, isSubmitting }) => (
  <div className="overflow-x-auto mt-6">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
            No
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
            Nama Kategori
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {categories.map((category, index) => (
          <tr key={category.id || index} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {index + 1}.
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {category.nama}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <button
                onClick={() => onEdit(category)}
                className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 rounded-full hover:bg-indigo-50 transition duration-150 disabled:opacity-50"
                title="Edit Kategori"
                disabled={isSubmitting}
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(category)}
                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition duration-150 disabled:opacity-50"
                title="Hapus Kategori"
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

export default CategoryTable;
