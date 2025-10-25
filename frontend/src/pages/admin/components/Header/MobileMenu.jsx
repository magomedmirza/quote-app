const MobileMenu = ({ activeView, setActiveView }) => (
  <div className="p-4 bg-white border-b border-gray-100 md:hidden">
    <select
      value={activeView}
      onChange={(e) => setActiveView(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="Kategori">Kategori</option>
      <option value="Quote">Quote</option>
      <option value="User">User</option>
    </select>
  </div>
);

export default MobileMenu;
