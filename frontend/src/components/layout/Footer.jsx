import { Heart, Quote, Github } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-teal-500/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Quote className="w-8 h-8 text-teal-400" />
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
                Quote Apps
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Temukan inspirasi harian melalui kumpulan quote terbaik. Bagikan
              kebijaksanaan dan motivasi dengan dunia.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/magomedmirza/quote-app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal-400 transition duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Fitur</h3>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Quote Inspiratif</p>
              <p className="text-gray-400 text-sm">Berbagai Kategori</p>
              <p className="text-gray-400 text-sm">Multi User Role</p>
            </div>
          </div>

          {/* PBL Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Program</h3>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm font-semibold">
                PBL Batch III
              </p>
              <p className="text-gray-400 text-sm">
                Pengembangan Web Dengan Node.js Dan React.JS
              </p>
              {/* Jika punya logo Kemnaker */}
              <img
                src="/LOGO-BPVP-BNA-BIRU.png"
                alt="Kemnaker"
                className="h-20 opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>© {currentYear} Quote Apps. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-400 text-sm text-center">
            <span>Made with Kelompok I</span>
            <span>for PBL Batch III - Kemnaker</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
