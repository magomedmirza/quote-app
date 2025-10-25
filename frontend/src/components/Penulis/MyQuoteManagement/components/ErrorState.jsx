const ErrorState = ({ error }) => (
  <div className="p-8 bg-white rounded-lg shadow-xl">
    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      <p className="font-bold">Error:</p>
      <p>{error}</p>
    </div>
  </div>
);

export default ErrorState;
