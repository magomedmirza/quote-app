const QuoteCard = ({ quote, author, categoryName, userName }) => (
  <div className="bg-gray-800 p-6 rounded-3xl shadow-2xl hover:shadow-teal-500/30 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02] border border-gray-700/50">
    <p className="text-xl italic text-gray-200 mb-5 font-serif leading-relaxed">
      "{quote}"
    </p>
    <div className="flex justify-between items-end text-sm text-gray-400 pt-4 border-t border-gray-700">
      <div>
        <span className="font-semibold text-teal-400 text-lg">~ {author}</span>
        <span className="ml-3 mt-1 inline-block px-3 py-1 text-xs bg-indigo-600/70 text-white rounded-full font-medium tracking-wider shadow-md">
          {categoryName}
        </span>
      </div>
      <p className="text-xs text-gray-500">by: {userName}</p>
    </div>
  </div>
);

export default QuoteCard;
