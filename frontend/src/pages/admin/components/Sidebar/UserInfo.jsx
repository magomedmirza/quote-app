const UserInfo = ({ user }) => (
  <div className="mb-6 p-3 bg-gray-700 rounded-lg">
    <p className="text-sm text-gray-300">Welcome,</p>
    <p className="font-semibold text-white">{user?.nama || "Admin"}</p>
    <p className="text-xs text-gray-400 capitalize">
      {user?.role || "Administrator"}
    </p>
  </div>
);

export default UserInfo;
