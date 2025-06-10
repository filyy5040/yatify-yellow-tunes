
import { YOUTUBE_CONFIG, isAPIConfigured } from './config.js';

class YouTubeAPI {
  constructor() {
    this.baseUrl = YOUTUBE_CONFIG.BASE_URL;
    this.apiKey = YOUTUBE_CONFIG.API_KEY;
  }

  // Metodo per costruire URL con parametri
  buildURL(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    // Aggiungi la chiave API
    url.searchParams.append('key', this.apiKey);
    
    // Aggiungi parametri di default
    Object.entries(YOUTUBE_CONFIG.DEFAULT_PARAMS).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    // Aggiungi parametri personalizzati
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    return url.toString();
  }

  // Cerca video su YouTube
  async searchVideos(query, maxResults = 25) {
    if (!isAPIConfigured()) {
      console.error('❌ YouTube API key not configured');
      return { items: [], error: 'API key not configured' };
    }

    try {
      const url = this.buildURL(YOUTUBE_CONFIG.ENDPOINTS.SEARCH, {
        q: query,
        maxResults,
        order: 'relevance'
      });

      console.log(`🔍 Searching YouTube for: ${query}`);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }
      
      console.log(`✅ Found ${data.items?.length || 0} results`);
      return data;
      
    } catch (error) {
      console.error('❌ YouTube search error:', error);
      return { items: [], error: error.message };
    }
  }

  // Ottieni dettagli di un video specifico
  async getVideoDetails(videoId) {
    if (!isAPIConfigured()) {
      console.error('❌ YouTube API key not configured');
      return null;
    }

    try {
      const url = this.buildURL(YOUTUBE_CONFIG.ENDPOINTS.VIDEOS, {
        id: videoId,
        part: 'snippet,contentDetails,statistics'
      });

      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }
      
      return data.items?.[0] || null;
      
    } catch (error) {
      console.error('❌ YouTube video details error:', error);
      return null;
    }
  }

  // Cerca artisti/canali
  async searchArtists(query, maxResults = 10) {
    if (!isAPIConfigured()) {
      return { items: [], error: 'API key not configured' };
    }

    try {
      const url = this.buildURL(YOUTUBE_CONFIG.ENDPOINTS.SEARCH, {
        q: query,
        type: 'channel',
        maxResults
      });

      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ YouTube artists search error:', error);
      return { items: [], error: error.message };
    }
  }

  // Ottieni video popolari per categoria
  async getTrendingMusic(maxResults = 20) {
    if (!isAPIConfigured()) {
      return { items: [], error: 'API key not configured' };
    }

    try {
      // Cerca video musicali popolari
      const url = this.buildURL(YOUTUBE_CONFIG.ENDPOINTS.SEARCH, {
        q: 'music 2024 hits',
        maxResults,
        order: 'viewCount'
      });

      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ YouTube trending error:', error);
      return { items: [], error: error.message };
    }
  }
}

// Esporta istanza singleton
export const youtubeAPI = new YouTubeAPI();
