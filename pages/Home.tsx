
import React, { useEffect, useState } from 'react';
import { movieApi } from '../services/api';
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
      const trendingRes = await movieApi.fetchCategory(CategoryAction.TRENDING);
      setTrending(trendingRes.items.slice(0, 10));

      const cats = [
        { title: 'Film Indonesia Terbaru', action: CategoryAction.INDONESIAN_MOVIES },
        { title: 'K-Drama Populer', action: CategoryAction.KDRAMA },
        { title: 'Serial TV Barat', action: CategoryAction.WESTERN_TV },
        { title: 'Anime Series', action: CategoryAction.ANIME },
      ];

      const catResults = await Promise.all(
        cats.map(async (cat) => {
          const res = await movieApi.fetchCategory(cat.action);
          return { ...cat, items: res.items.slice(0, 8) };
        })
      );

      setCategories(catResults);
      setLoading(false);
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

  const currentHero = trending[activeHero];

  return (
    <div className="pb-20">
      {/* Hero Slider */}
      <section className="relative h-[60vh] md:h-[85vh] w-full overflow-hidden">
        {trending.slice(0, 5).map((movie, idx) => (
          <div 
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeHero ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#090b13] via-transparent to-transparent z-10 md:w-1/2"></div>
            <div className="absolute inset-0 hero-gradient z-10"></div>
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="w-full h-full object-cover object-top md:object-center"
            />
            <div className="absolute bottom-10 left-4 md:left-12 z-20 max-w-2xl">
              <span className="bg-blue-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded uppercase tracking-widest mb-4 inline-block">
                Trending Now
              </span>
              <h1 className="text-3xl md:text-6xl font-black text-white mb-2 md:mb-4 leading-tight drop-shadow-lg">
                {movie.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-300 text-sm mb-6">
                <span className="flex items-center gap-1 text-yellow-400 font-bold">
                  <i className="fas fa-star"></i> {movie.rating}
                </span>
                <span>{movie.year}</span>
                <span className="px-2 border border-gray-500 rounded text-[10px] uppercase">{movie.type}</span>
                <span>{movie.genre}</span>
              </div>
              <div className="flex items-center gap-3">
                <Link 
                  to={`/detail/${encodeURIComponent(movie.detailPath)}`}
                  className="bg-white text-black px-6 md:px-10 py-3 rounded font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <i className="fas fa-play"></i> TONTON SEKARANG
                </Link>
                <Link 
                  to={`/detail/${encodeURIComponent(movie.detailPath)}`}
                  className="bg-gray-800/80 backdrop-blur-md text-white px-6 md:px-10 py-3 rounded font-bold hover:bg-gray-700 transition-all flex items-center gap-2"
                >
                  <i className="fas fa-info-circle"></i> DETAIL
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 md:-mt-20 relative z-30 space-y-12">
        {categories.map((cat) => (
          <section key={cat.action} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                <div className="w-1 h-8 bg-blue-500 rounded"></div>
                {cat.title}
              </h2>
              <Link to={`/category/${cat.action}`} className="text-blue-500 text-sm font-bold hover:underline">
                Lihat Semua <i className="fas fa-chevron-right text-[10px]"></i>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {cat.items.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
