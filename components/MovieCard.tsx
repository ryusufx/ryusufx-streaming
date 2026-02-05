
import React from 'react';
import { Link } from 'react-router-dom';
import { MovieItem } from '../types';

interface MovieCardProps {
  movie: MovieItem;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  // Use a simple path, React Router and Browser will handle basic encoding
  // Wildcard route in App.tsx captures everything after /detail/
  const detailUrl = `/detail/${movie.detailPath}`;

  return (
    <Link 
      to={detailUrl}
      className="card-hover relative group block bg-[#1a1d29] rounded-xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-500 shadow-lg"
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600/1a1d29/FFFFFF?text=No+Poster';
          }}
        />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1.5 border border-white/10 shadow-xl">
          <i className="fas fa-star text-yellow-400"></i>
          <span className="text-white">{movie.rating || '0'}</span>
        </div>

        {/* Year Badge */}
        {movie.year && (
          <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black border border-white/10 uppercase tracking-tighter text-white">
            {movie.year}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b13] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
           <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
             <button className="bg-white text-black w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2">
                <i className="fas fa-play"></i> Tonton
             </button>
           </div>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-b from-transparent to-black/20">
        <h3 className="text-sm font-bold truncate text-white group-hover:text-blue-400 transition-colors mb-1">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between">
           <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
            {movie.type === 'tv' ? 'Series' : 'Movie'}
          </p>
          <span className="text-[9px] text-blue-500/80 font-black truncate max-w-[60%] text-right">
            {movie.genre ? movie.genre.split(',')[0] : ''}
          </span>
        </div>
      </div>
    </Link>
  );
};
