
import React, { useEffect, useState } from 'react';
import { movieApi } from '../services/api';
import { trackingService } from '../services/trackingService';
import { MovieItem, CategoryAction } from '../types';
import { MovieCard } from '../components/MovieCard';
import { MovieSkeleton, HeroSkeleton } from '../components/Skeleton';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [trending, setTrending] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHero, setActiveHero] = useState(0);

  const [categories, setCategories] = useState<{title: string, action: string, items: MovieItem[]}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch trending dulu untuk hero section
        const trendingRes = await movieApi.fetchCategory(CategoryAction.TRENDING);
        setTrending(trendingRes.items.slice(0, 10));

        const cats = [
          { title: 'Film Indonesia Terbaru', action: CategoryAction.INDONESIAN_MOVIES },
          { title: 'Film Barat Terpopuler', action: CategoryAction.HOLLYWOOD_MOVIES },
          { title: 'Anime Series', action: CategoryAction.ANIME },
          { title: 'K-Drama Populer', action: CategoryAction.KDRAMA },
        ];

        // Pengambilan data kategori secara berurutan dengan jeda 300ms
        // Ini mencegah API memblokir request karena dianggap 'burst'
        const results = [];
        for (const cat of cats) {
          const res = await movieApi.fetchCategory(cat.action);
          results.push({ ...cat, items: res.items.slice(0, 8) });
          // Beri jeda antar request jika tidak ada di cache
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        setCategories(results);
        trackingService.logPageView('Home Page');
      } catch (e) {
        console.error("Home fetch error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (trending.length > 0) {
      const interval = setInterval(() => {
        setActiveHero((prev) => (prev + 1) % Math.min(trending.length, 5));
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [trending]);

  if (loading && trending.length === 0) {
    return (
      <div className="pt-20">
        <HeroSkeleton />
        <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <MovieSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <section className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden bg-[#090b13]">
        {trending.slice(0, 5).map((movie, idx) => {
          const isTV = movie.type === 'tv';
          return (
            <div 
              key={movie.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                idx === activeHero 
                  ? 'opacity-100 z-20 visible scale-100' 
                  : 'opacity-0 z-0 invisible scale-105 pointer-events-none'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#090b13] via-[#090b13]/60 to-transparent z-10 md:w-4/5"></div>
              <div className="absolute inset-0 hero-gradient z-10"></div>
              
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full h-full object-cover object-top md:object-center"
              />
              
              <div className="absolute bottom-16 left-0 right-0 md:bottom-24 md:left-12 z-20 px-4 md:px-0 max-w-3xl">
                <div className={`transition-all duration-700 delay-300 ${idx === activeHero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <span className="bg-blue-600 text-white text-[10px] md:text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block shadow-lg">
                    Trending Now
                  </span>
                  
                  <h1 className="text-3xl md:text-6xl font-black text-white mb-3 md:mb-5 leading-[1.1] drop-shadow-2xl line-clamp-2 uppercase">
                    {movie.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-300 text-xs md:text-sm mb-8 font-bold">
                    <span className="flex items-center gap-1.5 text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                      <i className="fas fa-star text-[10px]"></i> {movie.rating || '0'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="far fa-calendar-alt text-blue-500"></i> {movie.year}
                    </span>
                    <span className="px-2 py-0.5 border border-white/20 rounded text-[10px] uppercase font-black bg-white/5">
                      {isTV ? 'Series' : 'Movie'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <Link 
                      to={`/detail/${movie.detailPath}`}
                      className="bg-white text-black px-6 md:px-10 py-3 md:py-4 rounded-xl font-black hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2 md:gap-3 shadow-xl active:scale-95 group text-xs md:text-sm"
                    >
                      <i className="fas fa-play group-hover:scale-125 transition-transform"></i> 
                      {isTV ? 'MULAI EPISODE 1' : 'TONTON SEKARANG'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute bottom-6 right-6 md:right-12 z-30 flex gap-2">
          {trending.slice(0, 5).map((_, i) => (
            <button 
              key={i}
              onClick={() => setActiveHero(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${i === activeHero ? 'w-8 bg-blue-500' : 'w-2 bg-white/30'}`}
            ></button>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-10 md:-mt-20 relative z-30 space-y-16">
        {categories.map((cat) => (
          <section key={cat.action} className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl md:text-2xl font-black flex items-center gap-3 text-white tracking-tight">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                {cat.title}
              </h2>
              <Link to={`/category/${cat.action}`} className="text-blue-500 text-xs md:text-sm font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
                Lihat Semua <i className="fas fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {cat.items.map((movie) => (
                <MovieCard key={`${movie.id}-${cat.action}`} movie={movie} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
