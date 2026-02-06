
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Film Indo', path: '/category/indonesian-movies' },
    { name: 'Series Indo', path: '/category/indonesian-drama' },
    { name: 'Film Barat', path: '/category/hollywood-movies' },
    { name: 'K-Drama', path: '/category/kdrama' },
    { name: 'Anime', path: '/category/anime' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#090b13] shadow-xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-1">
            <span className="text-blue-500">ryusufx</span>
            <span>streaming</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-sm font-bold uppercase tracking-widest hover:text-white transition-colors ${location.pathname === link.path ? 'text-white' : 'text-gray-400'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-[#1a1d29] border border-gray-700 rounded-full px-4 py-1.5 focus-within:border-white transition-all">
            <input 
              type="text" 
              placeholder="Cari film atau series..." 
              className="bg-transparent border-none outline-none text-sm w-48 lg:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><i className="fas fa-search text-gray-400"></i></button>
          </form>

          <button 
            className="lg:hidden text-2xl text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-16 left-0 right-0 bg-[#090b13] border-b border-gray-800 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen py-6' : 'max-h-0'}`}>
        <div className="flex flex-col items-center gap-6 px-4">
          <form onSubmit={handleSearch} className="w-full flex items-center bg-[#1a1d29] border border-gray-700 rounded-full px-4 py-3">
            <input 
              type="text" 
              placeholder="Cari film atau series..." 
              className="bg-transparent border-none outline-none text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><i className="fas fa-search text-gray-400"></i></button>
          </form>
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className="text-lg font-bold uppercase tracking-widest text-gray-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
