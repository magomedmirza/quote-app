import { Quote, PlusCircle } from "lucide-react";

const QuoteHeader = ({ onAddClick, isLoading }) => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h2 className="text-3xl font-bold text-gray-800 flex items-center">
        <Quote className="inline-block mr-2 text-green-500" />
        Quotes Saya
      </h2>
    </div>

    <button
      onClick={onAddClick}
      className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-700 transition duration-150 shadow-md disabled:opacity-50"
      disabled={isLoading}
    >
      <PlusCircle className="w-4 h-4 mr-2" />
      Tambah Quote
    </button>
  </div>
);

export default QuoteHeader;
