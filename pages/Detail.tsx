
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { movieApi } from '../services/api';
import { trackingService } from '../services/trackingService';
import { MovieDetail, Episode, Season } from '../types';

export const Detail: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [episodeSearch, setEpisodeSearch] = useState('');
  const playerRef = useRef<HTMLDivElement>(null);

  const getDetailPath = () => {
    if (params['*']) return params['*'];
    const parts = location.pathname.split('/detail/');
    return parts.length > 1 ? parts[1] : '';
  };

  const detailPath = getDetailPath();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!detailPath) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const decodedPath = decodeURIComponent(detailPath);
      
      try {
        const res = await movieApi.getDetail(decodedPath);
        if (res) {
          setDetail(res);
          // Auto-select video source
          if (res.playerUrl) {
             setActiveUrl(res.playerUrl);
          } else if (res.seasons && res.seasons.length > 0 && res.seasons[0].episodes.length > 0) {
             setActiveUrl(res.seasons[0].episodes[0].url);
          }

          // TRACK: Page view with movie title
          trackingService.logPageView(`Detail: ${res.title}`);
        }
      } catch (err) {
        console.error("Component fetch detail error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [detailPath]);

  const isMultiEpisode = useMemo(() => {
    if (!detail) return false;
    const totalEpisodes = detail.seasons?.reduce((acc, s) => acc + s.episodes.length, 0) || 0;
    return detail.type === 'tv' && totalEpisodes > 1;
  }, [detail]);

  const handleSelectEpisode = (url: string, epTitle?: string) => {
    if (!url) {
      alert("Maaf, link video untuk episode ini tidak tersedia.");
      return;
    }
    setActiveUrl(url);
    scrollToPlayer();
    
    // TRACK: Play Event
    if (detail) {
      trackingService.logPlay(`${detail.title}${epTitle ? ` - ${epTitle}` : ''}`);
    }
  };

  const scrollToPlayer = () => {
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const filteredSeasons = useMemo(() => {
    if (!detail?.seasons) return [];
    return detail.seasons.map((s) => ({
      ...s,
      episodes: s.episodes.filter((e) => 
        (e.title || '').toLowerCase().includes(episodeSearch.toLowerCase())
      )
    })).filter((s) => s.episodes.length > 0);
  }, [detail?.seasons, episodeSearch]);

  const handleTontonSekarang = () => {
    if (detail?.seasons && detail.seasons.length > 0 && detail.seasons[0].episodes.length > 0) {
      handleSelectEpisode(detail.seasons[0].episodes[0].url, detail.seasons[0].episodes[0].title);
    } else if (detail?.playerUrl) {
      handleSelectEpisode(detail.playerUrl);
    }
  };

  const handleLastEpisode = () => {
    if (detail?.seasons && detail.seasons.length > 0) {
      const lastSeason = detail.seasons[detail.seasons.length - 1];
      if (lastSeason.episodes.length > 0) {
        const lastEp = lastSeason.episodes[lastSeason.episodes.length - 1];
        handleSelectEpisode(lastEp.url, lastEp.title);
      }
    }
  };

  const renderMetadata = (data: any) => {
    if (!data) return null;
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) {
      return data.map((item: any) => {
        if (typeof item === 'string') return item;
        return item.name || item.character || 'Pemeran';
      }).join(', ');
    }
    return String(data);
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-bold text-lg">Memuat Detail...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#1a1d29] p-10 rounded-3xl border border-white/5 text-center shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-4">Detail Tidak Ditemukan</h2>
          <Link to="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-20">
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b13] via-[#090b13]/80 to-transparent z-10"></div>
        <img 
          src={detail.poster} 
          alt={detail.title} 
          className="w-full h-full object-cover blur-2xl opacity-30 scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-center md:items-end">
          <div className="w-40 md:w-56 flex-shrink-0 shadow-2xl rounded-xl overflow-hidden border border-white/10">
            <img src={detail.poster} alt={detail.title} className="w-full" />
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
              <span className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                {isMultiEpisode ? 'TV Series' : 'Movie'}
              </span>
              {detail.genre && typeof detail.genre === 'string' && detail.genre.split(',').map((g) => (
                <span key={g} className="bg-white/10 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  {g.trim()}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              {detail.title}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm text-gray-400">
              <span className="text-yellow-400 font-bold flex items-center gap-1.5">
                <i className="fas fa-star"></i> {detail.rating || 'N/A'}
              </span>
              <span>{detail.year || 'N/A'}</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
              <button 
                onClick={handleTontonSekarang}
                className="bg-white text-black px-8 py-3.5 rounded-xl font-black transition-all hover:bg-blue-500 hover:text-white flex items-center gap-2 active:scale-95"
              >
                <i className="fas fa-play"></i> 
                {isMultiEpisode ? 'Mulai Episode 1' : 'Tonton Sekarang'}
              </button>
              
              {isMultiEpisode && (
                <button 
                  onClick={handleLastEpisode}
                  className="bg-white/10 text-white px-8 py-3.5 rounded-xl font-black transition-all hover:bg-white/20 flex items-center gap-2 active:scale-95"
                >
                  <i className="fas fa-step-forward"></i> Episode Terbaru
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section ref={playerRef} className="space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <i className="fas fa-play-circle text-blue-500"></i> Video Player
            </h2>
            <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video relative border border-white/5">
              {activeUrl ? (
                <iframe 
                  key={activeUrl}
                  src={activeUrl}
                  className="w-full h-full"
                  allowFullScreen
                  frameBorder="0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                  title="Video Player"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-500">
                  <i className="fas fa-video-slash text-5xl opacity-20"></i>
                  <p className="font-bold">Pilih video untuk memutar</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-[#1a1d29] p-8 rounded-3xl border border-white/5 space-y-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <i className="fas fa-info-circle text-blue-500"></i> Sinopsis
            </h2>
            <p className="text-gray-300 leading-relaxed italic">
              {detail.description || "Tidak ada sinopsis tersedia."}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5 text-sm">
              {detail.director && (
                <div>
                  <span className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Sutradara</span>
                  <p className="text-white font-bold">{renderMetadata(detail.director)}</p>
                </div>
              )}
              {detail.cast && (
                <div>
                  <span className="text-gray-500 font-bold uppercase text-[10px] block mb-1">Pemeran</span>
                  <p className="text-white font-bold">{renderMetadata(detail.cast)}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          {isMultiEpisode ? (
            <div className="bg-[#1a1d29] rounded-3xl p-6 border border-white/5 sticky top-24 shadow-xl">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <i className="fas fa-list text-blue-500"></i> Daftar Episode
              </h3>
              
              <div className="relative mb-6">
                <input 
                  type="text" 
                  placeholder="Cari episode..."
                  className="w-full bg-[#090b13] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all text-white"
                  value={episodeSearch}
                  onChange={(e) => setEpisodeSearch(e.target.value)}
                />
              </div>

              <div className="max-h-[500px] overflow-y-auto pr-2 space-y-8 custom-scrollbar">
                {filteredSeasons.map((season, sIdx) => (
                  <div key={sIdx}>
                    <div className="text-[10px] uppercase font-black text-blue-500 tracking-widest mb-4 flex items-center gap-3">
                      {season.seasonName}
                      <div className="h-px flex-1 bg-white/5"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {season.episodes.map((ep, eIdx) => (
                        <button 
                          key={eIdx}
                          onClick={() => handleSelectEpisode(ep.url, ep.title)}
                          className={`flex items-center gap-4 p-3 rounded-xl text-left transition-all border group ${activeUrl === ep.url ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-black/20 border-white/5 hover:border-white/20 text-gray-400 hover:text-white'}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black ${activeUrl === ep.url ? 'bg-white text-blue-600' : 'bg-white/5 text-gray-500'}`}>
                            {eIdx + 1}
                          </div>
                          <span className="text-sm font-bold truncate flex-1">{ep.title}</span>
                          {activeUrl === ep.url && (
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {filteredSeasons.length === 0 && (
                  <p className="text-center text-gray-600 py-10 text-sm">Episode tidak ditemukan.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#1a1d29] rounded-3xl p-8 border border-white/5 text-center space-y-6 shadow-xl sticky top-24">
              <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 text-4xl mx-auto border border-blue-500/20">
                <i className="fas fa-film"></i>
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-white text-lg">Format Film</h3>
                <p className="text-sm text-gray-400 leading-relaxed px-2">
                  Konten ini adalah film berdurasi penuh (Single Movie). Selamat menikmati tontonan Anda!
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
