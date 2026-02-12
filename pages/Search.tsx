
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieApi } from '../services/api';
import { trackingService } from '../services/trackingService';
import { MovieItem } from '../types';
import { MovieCard } from '../components/MovieCard';
import { MovieSkeleton } from '../components/Skeleton';

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const doSearch = async () => {
      if (!query) return;
      setLoading(true);
      const res = await movieApi.search(query);
      setMovies(res.items);
      setLoading(false);
      
      // TRACK: Search query
      trackingService.logSearch(query);
    };

    doSearch();
  }, [query]);

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4">
      <header className="mb-10 border-b border-gray-800 pb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-400">
          Hasil pencarian untuk: <span className="text-white">"{query}"</span>
        </h1>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => <MovieSkeleton key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {movies.length === 0 && !loading && (
            <div className="py-20 text-center">
              <i className="fas fa-search-minus text-6xl text-gray-700 mb-6 block"></i>
              <h2 className="text-2xl font-bold mb-2">Pencarian tidak ditemukan</h2>
              <p className="text-gray-500">Coba kata kunci lain atau periksa ejaan Anda.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
