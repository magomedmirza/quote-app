import { Edit, Trash2 } from "lucide-react";

const QuoteTable = ({ quotes, categories, onEdit, onDelete, isSubmitting }) => {
  const getCategoryName = (kategoriId) => {
    const category = categories.find((cat) => cat.id === kategoriId);
    return category ? category.nama : "Tidak Diketahui";
  };

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12">
        <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Belum ada quotes</p>
        <p className="text-gray-400">Mulai buat quote pertama Anda</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
              No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">
              Isi Quote
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
              Penulis
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
              Kategori
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {quotes.map((quote, index) => (
            <tr key={quote.id || index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 align-top">
                {index + 1}.
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 align-top max-w-sm">
                <p className="line-clamp-3">"{quote.quote}"</p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-top">
                {quote.author}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-top">
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {getCategoryName(quote.kategoriId)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium align-top space-x-1">
                <button
                  onClick={() => onEdit(quote)}
                  className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50 transition duration-150 disabled:opacity-50"
                  title="Edit Quote"
                  disabled={isSubmitting}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(quote)}
                  className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition duration-150 disabled:opacity-50"
                  title="Hapus Quote"
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

export default QuoteTable;
