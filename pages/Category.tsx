
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { movieApi } from '../services/api';
import { MovieItem } from '../types';
import { MovieCard } from '../components/MovieCard';
import { MovieSkeleton } from '../components/Skeleton';

const categoryNames: Record<string, string> = {
  'indonesian-movies': 'Film Indonesia',
  'indonesian-drama': 'Serial TV Indonesia',
  'adult-comedy': 'Canda Dewasa',
  'western-tv': 'Serial TV Barat',
  'kdrama': 'K-Drama',
  'short-tv': 'Short TV',
  'anime': 'Anime',
  'trending': 'Trending Now'
};

export const Category: React.FC = () => {
  const { action } = useParams<{ action: string }>();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!action) return;
      setLoading(true);
      setPage(1); // Reset page on action change
      const res = await movieApi.fetchCategory(action, 1);
      setMovies(res.items);
      setHasMore(res.hasMore);
      setLoading(false);
    };

    fetchCategory();
  }, [action]);

  const loadMore = async () => {
    if (!action || !hasMore || loading) return;
    setLoading(true);
    const nextPage = page + 1;
    const res = await movieApi.fetchCategory(action, nextPage);
    setMovies(prev => [...prev, ...res.items]);
    setPage(nextPage);
    setHasMore(res.hasMore);
    setLoading(false);
  };

  const title = categoryNames[action || ''] || 'Kategori';

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4">
      <header className="mb-10 flex items-center justify-between border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <div className="w-1.5 h-10 bg-blue-500 rounded"></div>
          {title}
        </h1>
        <div className="text-gray-500 text-sm font-medium">
          Total: {movies.length} konten
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard key={`${movie.id}-${movie.detailPath}`} movie={movie} />
        ))}
        {loading && [...Array(12)].map((_, i) => <MovieSkeleton key={i} />)}
      </div>

      {!loading && hasMore && (
        <div className="mt-16 flex justify-center">
          <button 
            onClick={loadMore}
            className="bg-[#1a1d29] border border-gray-700 hover:border-white px-10 py-3 rounded-full font-bold transition-all"
          >
            Muat Lebih Banyak
          </button>
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className="py-20 text-center">
          <i className="fas fa-search text-5xl text-gray-700 mb-4 block"></i>
          <p className="text-gray-500">Tidak ada konten ditemukan untuk kategori ini.</p>
        </div>
      )}
    </div>
  );
};
