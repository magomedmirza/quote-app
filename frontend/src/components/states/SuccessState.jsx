import HeroHeader from "../../components/layout/HeroHeader.jsx";
import QuoteCard from "../../components/layout/QuoteCard.jsx";

const SuccessState = ({ quotes, onLogin }) => (
  <div className="min-h-screen bg-gray-950 text-white font-['Inter']">
    <HeroHeader
      subtitle={`Ditemukan ${quotes.length} Quote Inspiratif`}
      onLogin={onLogin}
    />
    <main className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8 pb-16">
      {quotes.map((item) => (
        <QuoteCard
          key={item.id}
          quote={item.quote}
          author={item.author}
          categoryName={item.kategori?.nama || "Umum"}
          userName={item.user?.nama || "Anonim"}
        />
      ))}
    </main>
  </div>
);

export default SuccessState;
