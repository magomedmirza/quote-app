const ErrorAlert = ({ error }) => {
  if (!error) return null;

  return (
    <div className="p-4 mb-6 text-sm text-red-300 bg-red-900/50 rounded-lg border-l-4 border-red-500 shadow-md">
      <span className="font-bold">Gagal Masuk:</span> {error}
    </div>
  );
};

export default ErrorAlert;
