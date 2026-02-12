
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Detail } from './pages/Detail';
import { Category } from './pages/Category';
import { Search } from './pages/Search';
import { Admin } from './pages/Admin';

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
            <Route path="/detail/*" element={<Detail />} />
            {/* Route Admin Rahasia */}
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        
        <footer className="bg-[#090b13] py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center gap-2 mb-10">
              <span className="text-2xl md:text-3xl font-black tracking-tighter text-blue-500">ryusufx</span>
              <span className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic">streaming</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-[10px] md:text-xs text-gray-400 mb-10 font-black uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-white transition-all">Tentang Kami</a>
              <a href="#" className="hover:text-white transition-all">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition-all">Hubungi Kami</a>
              <a href="#" className="hover:text-white transition-all">DMCA</a>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-[10px] text-gray-600 leading-relaxed uppercase tracking-tighter">
                ryusufx streaming adalah platform gratis untuk berbagi konten video. Kami tidak menyimpan file apapun di server kami. Semua konten disediakan oleh pihak ketiga yang tidak berafiliasi.
              </p>
              <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">
                © 2026 ryusufx streaming. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
