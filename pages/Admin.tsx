
import React, { useEffect, useState } from 'react';
import { db, collection, query, orderBy, limit, onSnapshot, writeBatch, doc } from '../services/firebase';
import { VisitorLog } from '../types';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalPlays: 0,
    totalSearches: 0
  });

  // Cek sesi saat komponen dimuat
  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data hanya jika sudah login
  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(collection(db, "visitor_logs"), orderBy("timestamp", "desc"), limit(100));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const logsData: VisitorLog[] = [];
      let plays = 0;
      let views = 0;
      let searches = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data() as VisitorLog;
        logsData.push({ ...data, id: doc.id });
        
        if (data.action === 'PLAY_MOVIE') plays++;
        if (data.action === 'PAGE_VIEW') views++;
        if (data.action === 'SEARCH') searches++;
      });

      setLogs(logsData);
      setStats({
        totalVisits: views,
        totalPlays: plays,
        totalSearches: searches
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'ryusuf' && password === 'vhavha@46') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Username atau Password salah!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  const handleClearLogs = async () => {
    if (logs.length === 0) return;
    
    const confirmClear = window.confirm("Apakah Anda yakin ingin menghapus SEMUA log aktivitas? Tindakan ini tidak dapat dibatalkan.");
    
    if (confirmClear) {
      setIsClearing(true);
      try {
        const batch = writeBatch(db);
        // Kita hapus log yang ada di current view (limit 100)
        logs.forEach((log) => {
          if (log.id) {
            const logRef = doc(db, "visitor_logs", log.id);
            batch.delete(logRef);
          }
        });
        await batch.commit();
        alert("Berhasil menghapus log terbaru.");
      } catch (error) {
        console.error("Error clearing logs:", error);
        alert("Gagal menghapus log.");
      } finally {
        setIsClearing(false);
      }
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Baru saja';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      day: '2-digit', 
      month: 'short' 
    });
  };

  // Tampilan Login jika belum terautentikasi
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4 bg-[#090b13]">
        <div className="max-w-md w-full bg-[#1a1d29] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full"></div>
          
          <div className="relative z-10 text-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              <i className="fas fa-user-shield"></i>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Admin Access</h1>
            <p className="text-gray-500 text-xs font-bold mt-2 uppercase tracking-widest">Silakan login untuk memantau trafik</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black p-3 rounded-xl text-center uppercase tracking-widest animate-shake">
                {loginError}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Username</label>
              <input 
                type="text" 
                className="w-full bg-[#090b13] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                className="w-full bg-[#090b13] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-white text-black font-black py-4 rounded-2xl mt-4 hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 uppercase text-xs tracking-[0.2em]"
            >
              Masuk Sekarang
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Tampilan Dashboard jika sudah login
  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold">Sinkronisasi Data...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <i className="fas fa-chart-line text-blue-500"></i>
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Monitor Aktivitas Pengunjung</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-green-500/10 text-green-500 px-4 py-2.5 rounded-2xl text-[10px] font-black flex items-center gap-2 border border-green-500/20">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            LIVE MONITORING
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all px-4 py-2.5 rounded-2xl text-[10px] font-black border border-red-500/20 uppercase tracking-widest"
          >
            Logout <i className="fas fa-sign-out-alt ml-1"></i>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#1a1d29] border border-white/5 p-8 rounded-[2rem] shadow-xl hover:border-blue-500/30 transition-all group">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 group-hover:text-blue-400 transition-colors">Total Kunjungan</p>
          <p className="text-5xl font-black text-white">{stats.totalVisits}</p>
          <div className="mt-4 text-[10px] text-blue-500 font-black uppercase flex items-center gap-2">
            <i className="fas fa-eye"></i> Halaman dibuka
          </div>
        </div>
        <div className="bg-[#1a1d29] border border-white/5 p-8 rounded-[2rem] shadow-xl hover:border-green-500/30 transition-all group">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 group-hover:text-green-400 transition-colors">Total Video Diputar</p>
          <p className="text-5xl font-black text-white">{stats.totalPlays}</p>
          <div className="mt-4 text-[10px] text-green-500 font-black uppercase flex items-center gap-2">
            <i className="fas fa-play-circle"></i> Video di-klik
          </div>
        </div>
        <div className="bg-[#1a1d29] border border-white/5 p-8 rounded-[2rem] shadow-xl hover:border-yellow-500/30 transition-all group">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 group-hover:text-yellow-400 transition-colors">Total Pencarian</p>
          <p className="text-5xl font-black text-white">{stats.totalSearches}</p>
          <div className="mt-4 text-[10px] text-yellow-500 font-black uppercase flex items-center gap-2">
            <i className="fas fa-search"></i> Kueri pencarian
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#1a1d29] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between bg-white/[0.01] gap-4">
          <h2 className="font-black text-white uppercase text-xs tracking-widest flex items-center gap-3">
            <i className="fas fa-history text-blue-500"></i> Aktivitas Terbaru
          </h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleClearLogs}
              disabled={isClearing || logs.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                logs.length === 0 ? 'opacity-50 cursor-not-allowed border-gray-700 text-gray-700' : 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-600 hover:text-white active:scale-95'
              }`}
            >
              {isClearing ? (
                <i className="fas fa-spinner animate-spin"></i>
              ) : (
                <i className="fas fa-trash-alt"></i>
              )}
              {isClearing ? 'Menghapus...' : 'Hapus Semua Log'}
            </button>
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full">{logs.length} Log Dimuat</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-[10px] uppercase font-black text-gray-500 border-b border-white/5">
                <th className="px-8 py-5">Waktu</th>
                <th className="px-8 py-5">Aksi</th>
                <th className="px-8 py-5">Detail Konten</th>
                <th className="px-8 py-5">Perangkat & Platform</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {logs.length > 0 ? logs.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all">
                  <td className="px-8 py-6 text-gray-400 font-bold">
                    {formatTime(log.timestamp)}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      log.action === 'PLAY_MOVIE' ? 'bg-green-500/20 text-green-500 border border-green-500/20' :
                      log.action === 'SEARCH' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20' :
                      'bg-blue-500/20 text-blue-500 border border-blue-500/20'
                    }`}>
                      {log.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="max-w-xs">
                      <p className="text-white font-black truncate text-sm mb-1">
                        {log.contentTitle || log.query || log.path}
                      </p>
                      <p className="text-[9px] text-gray-600 truncate font-bold uppercase tracking-tighter">{log.path}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-500">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-gray-400 uppercase text-[9px]">{log.platform}</span>
                      <span className="text-[9px] truncate max-w-[200px] text-gray-600 italic font-medium">{log.userAgent}</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-600 font-bold italic">
                    Belum ada aktivitas yang tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
