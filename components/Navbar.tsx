
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
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-1.5 group transition-transform hover:scale-105 active:scale-95">
            <span className="text-xl md:text-2xl font-black tracking-tighter text-blue-500 group-hover:text-blue-400 transition-colors">ryusufx</span>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white">streaming</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-[11px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors ${location.pathname === link.path ? 'text-white' : 'text-gray-400'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-blue-500/50 focus-within:bg-white/10 transition-all">
            <input 
              type="text" 
              placeholder="Cari film atau series..." 
              className="bg-transparent border-none outline-none text-xs w-48 lg:w-64 text-white placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><i className="fas fa-search text-gray-500 text-xs"></i></button>
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
      <div className={`lg:hidden absolute top-16 left-0 right-0 bg-[#090b13] border-b border-gray-800 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen py-8' : 'max-h-0'}`}>
        <div className="flex flex-col items-center gap-8 px-4">
          <form onSubmit={handleSearch} className="w-full flex items-center bg-[#1a1d29] border border-gray-700 rounded-xl px-4 py-3">
            <input 
              type="text" 
              placeholder="Cari film atau series..." 
              className="bg-transparent border-none outline-none text-sm w-full text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><i className="fas fa-search text-gray-400"></i></button>
          </form>
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className="text-sm font-black uppercase tracking-widest text-gray-300 hover:text-white"
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
