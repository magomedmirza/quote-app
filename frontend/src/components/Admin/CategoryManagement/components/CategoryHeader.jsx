import { Tag, PlusCircle } from "lucide-react";

const CategoryHeader = ({ onAddClick, isLoading }) => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h2 className="text-3xl font-bold text-gray-800 flex items-center">
        <Tag className="inline-block mr-2 text-indigo-500" />
        Manajemen Kategori
      </h2>
      <p className="text-gray-600 mt-2">Kelola Kategori Quote</p>
    </div>

    <button
      onClick={onAddClick}
      className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md disabled:opacity-50"
      disabled={isLoading}
    >
      <PlusCircle className="w-4 h-4 mr-2" />
      Tambah Kategori
    </button>
  </div>
);

export default CategoryHeader;
