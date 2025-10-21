// src/components/ui/Button.jsx

import React from "react";

// Destructure props yang Anda harapkan
const Button = ({
  children, // Konten di dalam tombol (teks)
  onClick, // Fungsi yang dijalankan saat diklik
  variant = "primary", // Untuk styling (misal: 'primary', 'secondary', 'danger')
  type = "button", // Tipe tombol HTML (submit, button, reset)
  ...rest // Props HTML lainnya (seperti disabled, className)
}) => {
  // Logika Styling (Contoh sederhana dengan string)
  let baseClasses = "px-4 py-2 font-semibold rounded transition-colors";

  if (variant === "primary") {
    baseClasses += " bg-blue-600 text-white hover:bg-blue-700";
  } else if (variant === "danger") {
    baseClasses += " bg-red-500 text-white hover:bg-red-600";
  }
  // ... Tambahkan styling Tailwind CSS Anda di sini

  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClasses}
      {...rest} // Menyebarkan props tambahan (misalnya 'disabled')
    >
      {/* Konten (anak-anak) diletakkan di tengah */}
      {children}
    </button>
  );
};

export default Button;
