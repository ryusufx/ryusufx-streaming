
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Detail } from './pages/Detail';
import { Category } from './pages/Category';
import { Search } from './pages/Search';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:action" element={<Category />} />
            <Route path="/search" element={<Search />} />
            {/* Use wildcard * to capture detail paths that include slashes */}
            <Route path="/detail/*" element={<Detail />} />
          </Routes>
        </main>
        
        <footer className="bg-[#090b13] py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="text-2xl font-black tracking-tighter text-white mb-6">
              <span className="text-blue-500">ryusufx</span> streaming
            </div>
            <div className="flex justify-center gap-6 text-sm text-gray-400 mb-8 font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-all">Tentang Kami</a>
              <a href="#" className="hover:text-white transition-all">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition-all">Hubungi Kami</a>
            </div>
            <p className="text-xs text-gray-500 max-w-xl mx-auto leading-relaxed">
              ryusufx streaming adalah platform gratis untuk berbagi konten video. Kami tidak menyimpan file apapun di server kami. Semua konten disediakan oleh pihak ketiga yang tidak berafiliasi.
            </p>
            <p className="mt-8 text-[10px] text-gray-600">
              © 2026 ryusufx streaming. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
