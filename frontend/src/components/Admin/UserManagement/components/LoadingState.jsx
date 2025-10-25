const LoadingState = () => (
  <div className="p-8 bg-white rounded-lg shadow-xl">
    <div className="text-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 inline-block mr-2"></div>
      <span className="text-pink-600 font-medium">Memuat data user...</span>
    </div>
  </div>
);

export default LoadingState;
