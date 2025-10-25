const BaseModal = ({ isOpen, onClose, title, children, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 transition-opacity duration-300 backdrop-blur-sm"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            {title}
          </h3>
          <button
            onClick={() => !isSubmitting && onClose()}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
