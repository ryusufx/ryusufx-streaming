
import { ApiResponse, MovieDetail, CategoryAction, Season, Episode } from '../types';

const BASE_URL = 'https://zeldvorik.ru/apiv3/api.php';

export const movieApi = {
  fetchCategory: async (action: string, page: number = 1): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${BASE_URL}?action=${action}&page=${page}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Fetch category error:', error);
      return { success: false, items: [], page: 1, hasMore: false };
    }
  },

  search: async (query: string): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${BASE_URL}?action=search&q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      return { success: false, items: [], page: 1, hasMore: false };
    }
  },

  getDetail: async (detailPath: string): Promise<MovieDetail | null> => {
    try {
      const url = `${BASE_URL}?action=detail&detailPath=${encodeURIComponent(detailPath)}`;
      
      console.log('Fetching detail from URL:', url);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Detail fetch failed with status: ${response.status}`);
      
      const data = await response.json();
      console.log('Raw API Detail Data:', data);

      if (data.success) {
        const item = data.item || data.data || (data.items && data.items[0]) || data.results?.[0] || data.result;
        
        if (item) {
          // Normalize seasons and episodes deeply
          const rawSeasons = item.seasons || item.episodes_list || [];
          let normalizedSeasons: Season[] = [];

          if (Array.isArray(rawSeasons)) {
            if (rawSeasons.length > 0 && (rawSeasons[0].episodes || rawSeasons[0].seasonName)) {
              // Standard season structure
              normalizedSeasons = rawSeasons.map((s: any, index: number) => ({
                // Gunakan index + 1 jika seasonName tidak disediakan oleh API
                seasonName: s.seasonName || s.name || `Season ${index + 1}`,
                episodes: (s.episodes || []).map((e: any) => ({
                  title: e.title || e.name || 'Episode',
                  url: e.url || e.embed_url || e.player_url || e.playerUrl || ''
                }))
              }));
            } else {
              // Flat episode list (Single Season)
              normalizedSeasons = [{
                seasonName: 'Season 1',
                episodes: rawSeasons.map((e: any, index: number) => ({
                  title: e.title || e.name || `Episode ${index + 1}`,
                  url: e.url || e.embed_url || e.player_url || e.playerUrl || ''
                }))
              }];
            }
          }

          return {
            title: item.title || item.name || '',
            poster: item.poster || item.thumb || item.image || '',
            rating: item.rating || '0',
            year: item.year || item.release_date || '',
            genre: item.genre || item.genres || '',
            description: item.description || item.synopsis || item.overview || '',
            playerUrl: item.playerUrl || item.embed_url || item.video_url || '',
            type: item.type || (normalizedSeasons.length > 1 || (normalizedSeasons.length === 1 && normalizedSeasons[0].episodes.length > 1) ? 'tv' : 'movie'),
            seasons: normalizedSeasons,
            director: item.director || '',
            cast: item.cast || item.actors || ''
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Detail fetch error:', error);
      return null;
    }
  }
};
