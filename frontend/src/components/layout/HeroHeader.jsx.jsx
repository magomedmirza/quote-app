const HeroHeader = ({ title = "Quote Apps", subtitle, onLogin }) => {
  return (
    <header className="pt-8 pb-12 md:pt-10 md:pb-16 mb-10 bg-gray-900 shadow-2xl rounded-b-[3rem] border-b-4 border-teal-500/50 relative">
      <div className="absolute top-5 right-6 md:right-10 z-10">
        <button
          className="px-5 py-2 text-sm font-semibold text-gray-900 bg-teal-400 rounded-full transition duration-300 ease-in-out hover:bg-teal-300 hover:shadow-lg hover:shadow-teal-500/40 transform hover:scale-105"
          onClick={onLogin}
        >
          Login
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400 tracking-tight mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-gray-400 mt-3 max-w-2xl mx-auto font-light">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
};

export default HeroHeader;
