import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = () => (
  <Link
    to="/"
    className="absolute top-4 left-4 flex items-center text-gray-400 hover:text-teal-400 transition duration-200 group"
  >
    <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
    <span className="text-sm">Kembali ke Home</span>
  </Link>
);

export default BackButton;
