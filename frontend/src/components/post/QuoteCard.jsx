import React from "react";

const QuoteCard = ({ quote, author, categoryName, userName }) => {
  return (
    // Kontainer kartu dengan bayangan dan border yang elegan
    <div
      className="
      bg-white shadow-xl hover:shadow-2xl transition duration-300 rounded-lg p-6
      flex flex-col h-full border border-gray-100
    "
    >
      {/* Kategori dan Penulis */}
      <div className="flex justify-between items-center mb-4 text-xs font-medium text-gray-500">
        <span className="bg-blue-500 text-white px-3 py-1 rounded-full uppercase tracking-wider">
          {categoryName}
        </span>
        <span className="text-gray-500">Ditambahkan oleh: {userName}</span>
      </div>

      {/* Quote Inti (Fokus utama) */}
      <blockquote className="flex-grow">
        <p
          className="
          text-2xl font-serif italic text-gray-900 leading-snug 
          relative before:content-['“'] before:absolute before:left-[-15px] before:top-[-5px] before:text-4xl before:text-blue-300
        "
        >
          {quote}
        </p>
      </blockquote>

      {/* Author (Footer dengan garis pemisah tipis) */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-lg font-bold text-gray-800">— {author}</p>
      </div>
    </div>
  );
};

export default QuoteCard;
