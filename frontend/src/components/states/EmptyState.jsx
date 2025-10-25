import HeroHeader from "../../components/layout/HeroHeader.jsx";

const EmptyState = ({ onLogin }) => (
  <div className="min-h-screen bg-gray-950 text-white font-['Inter']">
    <HeroHeader onLogin={onLogin} />
    <div className="text-center p-10 bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-300 max-w-lg mx-auto rounded-xl shadow-2xl">
      <p className="font-bold text-2xl">Quote Kosong</p>
      <p className="mt-3">
        Sepertinya belum ada Quote yang ditambahkan oleh penulis manapun.
      </p>
    </div>
  </div>
);

export default EmptyState;
