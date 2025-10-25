import { Quote, PlusCircle } from "lucide-react";

const EmptyState = ({ onAddClick }) => (
  <div className="text-center py-12">
    <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <p className="text-gray-500 text-lg">Belum ada quotes</p>
    <p className="text-gray-400 mb-4">Mulai buat quote pertama Anda</p>
    <button
      onClick={onAddClick}
      className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150 mx-auto"
    >
      <PlusCircle className="w-4 h-4 mr-2" />
      Buat Quote Pertama
    </button>
  </div>
);

export default EmptyState;
