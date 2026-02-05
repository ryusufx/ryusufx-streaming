
export interface MovieItem {
  id: string;
  title: string;
  poster: string;
  rating: number | string;
  year: string;
  type: 'movie' | 'tv';
  genre: string;
  detailPath: string;
}

export interface Episode {
  title: string;
  url: string;
  episodeNumber?: number;
}

export interface Season {
  seasonName: string;
  episodes: Episode[];
}

export interface MovieDetail {
  title: string;
  poster: string;
  rating: string;
  year: string;
  genre: string;
  description: string;
  playerUrl: string;
  type: 'movie' | 'tv';
  seasons?: Season[];
  director?: string;
  cast?: string;
}

export interface ApiResponse {
  success: boolean;
  items: MovieItem[];
  page: number;
  hasMore: boolean;
}

export enum CategoryAction {
  TRENDING = 'trending',
  INDONESIAN_MOVIES = 'indonesian-movies',
  INDONESIAN_DRAMA = 'indonesian-drama',
  ADULT_COMEDY = 'adult-comedy',
  WESTERN_TV = 'western-tv',
  KDRAMA = 'kdrama',
  SHORT_TV = 'short-tv',
  ANIME = 'anime'
}
