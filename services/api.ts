
import { ApiResponse, MovieDetail, CategoryAction, Season, Episode } from '../types';
import { db, doc, getDoc, setDoc } from './firebase';

const BASE_URL = 'https://zeldvorik.ru/apiv3/api.php';

// TTL Konfigurasi (dalam milidetik)
const LOCAL_CACHE_TTL = 15 * 60 * 1000;   // 15 Menit di browser masing-masing
const DB_CACHE_TTL = 4 * 60 * 60 * 1000;  // 4 Jam di Database (Berbagi untuk semua user)

// Helper untuk Local Cache (Browser)
const localCache = {
  get: (key: string) => {
    const itemStr = localStorage.getItem(`cache_${key}`);
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    if (new Date().getTime() > item.expiry) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }
    return item.value;
  },
  set: (key: string, value: any) => {
    const item = { value, expiry: new Date().getTime() + LOCAL_CACHE_TTL };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  }
};

// Helper untuk DB Cache (Firestore)
const dbCache = {
  get: async (collectionName: string, id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const now = new Date().getTime();
        // Jika data masih fresh
        if (now < data.expiry) {
          return data.content;
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  },
  set: async (collectionName: string, id: string, value: any) => {
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, {
        content: value,
        expiry: new Date().getTime() + DB_CACHE_TTL,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("DB Cache Set Error:", e);
    }
  }
};

export const movieApi = {
  fetchCategory: async (action: string, page: number = 1): Promise<ApiResponse> => {
    const cacheKey = `${action}_p${page}`;
    
    // 1. Cek Local Cache (Paling Cepat)
    const localData = localCache.get(cacheKey);
    if (localData) return localData;

    // 2. Cek Database Cache (Berbagi antar user)
    const dbData = await dbCache.get("cached_categories", cacheKey);
    if (dbData) {
      localCache.set(cacheKey, dbData); // Simpan ke local juga agar request berikutnya instan
      return dbData;
    }

    // 3. Terakhir, tembak API (Jika tidak ada di manapun)
    try {
      let url = `${BASE_URL}?action=${action}&page=${page}`;
      if (action === 'hollywood-movies') {
        url = `${BASE_URL}?action=search&q=hollywood%20movies&page=${page}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        // Simpan hasil ke Database agar user lain bisa pakai
        dbCache.set("cached_categories", cacheKey, data);
        localCache.set(cacheKey, data);
      }
      return data;
    } catch (error) {
      return { success: false, items: [], page: 1, hasMore: false };
    }
  },

  search: async (query: string): Promise<ApiResponse> => {
    // Search biasanya tidak di-cache di DB agar dinamis, 
    // tapi kita gunakan local cache singkat saja
    const cacheKey = `search_${query.toLowerCase().replace(/\s/g, '_')}`;
    const localData = localCache.get(cacheKey);
    if (localData) return localData;

    try {
      const response = await fetch(`${BASE_URL}?action=search&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.success) localCache.set(cacheKey, data);
      return data;
    } catch (error) {
      return { success: false, items: [], page: 1, hasMore: false };
    }
  },

  getDetail: async (detailPath: string): Promise<MovieDetail | null> => {
    // Gunakan hash atau base64 untuk ID dokumen Firestore yang aman
    const safeId = btoa(detailPath).substring(0, 50).replace(/\//g, '_');
    
    // 1. Cek Local
    const localData = localCache.get(`detail_${safeId}`);
    if (localData) return localData;

    // 2. Cek DB
    const dbData = await dbCache.get("cached_details", safeId);
    if (dbData) {
      localCache.set(`detail_${safeId}`, dbData);
      return dbData;
    }

    // 3. Tembak API
    try {
      const url = `${BASE_URL}?action=detail&detailPath=${encodeURIComponent(detailPath)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        const item = data.item || data.data || (data.items && data.items[0]) || data.results?.[0];
        if (item) {
          const rawSeasons = item.seasons || item.episodes_list || [];
          let normalizedSeasons: Season[] = [];

          if (Array.isArray(rawSeasons)) {
            if (rawSeasons.length > 0 && (rawSeasons[0].episodes || rawSeasons[0].seasonName)) {
              normalizedSeasons = rawSeasons.map((s: any, index: number) => ({
                seasonName: s.seasonName || `Season ${index + 1}`,
                episodes: (s.episodes || []).map((e: any) => ({
                  title: e.title || e.name || 'Episode',
                  url: e.url || e.embed_url || e.player_url || ''
                }))
              }));
            } else {
              normalizedSeasons = [{
                seasonName: 'Season 1',
                episodes: rawSeasons.map((e: any, index: number) => ({
                  title: e.title || e.name || `Episode ${index + 1}`,
                  url: e.url || e.embed_url || e.player_url || ''
                }))
              }];
            }
          }

          const result: MovieDetail = {
            title: item.title || item.name || '',
            poster: item.poster || item.image || '',
            rating: item.rating || '0',
            year: item.year || '',
            genre: item.genre || '',
            description: item.description || '',
            playerUrl: item.playerUrl || item.embed_url || '',
            type: item.type || (normalizedSeasons.length > 1 ? 'tv' : 'movie'),
            seasons: normalizedSeasons
          };

          // Simpan ke DB agar user berikutnya tidak membebani API
          dbCache.set("cached_details", safeId, result);
          localCache.set(`detail_${safeId}`, result);
          return result;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }
};
