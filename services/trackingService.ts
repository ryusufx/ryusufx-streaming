
import { db, collection, addDoc, serverTimestamp } from './firebase';
import { VisitorLog } from '../types';

export const trackingService = {
  logEvent: async (log: Omit<VisitorLog, 'timestamp' | 'userAgent' | 'platform' | 'path'>) => {
    try {
      const logData = {
        ...log,
        path: window.location.pathname + window.location.search,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        timestamp: serverTimestamp(),
      };
      
      await addDoc(collection(db, "visitor_logs"), logData);
    } catch (e) {
      console.error("Error recording log: ", e);
    }
  },

  logPageView: (title?: string) => {
    trackingService.logEvent({
      action: 'PAGE_VIEW',
      contentTitle: title || document.title
    });
  },

  logPlay: (movieTitle: string) => {
    trackingService.logEvent({
      action: 'PLAY_MOVIE',
      contentTitle: movieTitle
    });
  },

  logSearch: (query: string) => {
    trackingService.logEvent({
      action: 'SEARCH',
      query: query
    });
  }
};
