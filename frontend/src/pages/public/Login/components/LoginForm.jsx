const LoginForm = ({ formData, isLoading, error, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div>
      <label
        htmlFor="username"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Username
      </label>
      <input
        id="username"
        name="username"
        type="text"
        required
        value={formData.username}
        onChange={onChange}
        placeholder="username Anda"
        className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 shadow-inner placeholder:text-gray-500"
        disabled={isLoading}
      />
    </div>

    <div>
      <label
        htmlFor="password"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        value={formData.password}
        onChange={onChange}
        placeholder="••••••••"
        className="w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 shadow-inner placeholder:text-gray-500"
        disabled={isLoading}
      />
    </div>

    <button
      type="submit"
      disabled={isLoading}
      className={`w-full py-3 px-4 rounded-xl text-gray-900 font-bold tracking-wider uppercase transition duration-300 transform shadow-lg ${
        isLoading
          ? "bg-teal-600/50 cursor-not-allowed"
          : "bg-teal-400 hover:bg-teal-300 hover:scale-[1.01] hover:shadow-teal-500/50"
      }`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Memproses...
        </div>
      ) : (
        "Masuk Sekarang"
      )}
    </button>
  </form>
);

export default LoginForm;
