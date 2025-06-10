
// YouTube Data API v3 Configuration
export const YOUTUBE_CONFIG = {
  // Inserisci qui la tua chiave API di YouTube Data API v3
  API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE',
  BASE_URL: 'https://www.googleapis.com/youtube/v3',
  
  // Endpoint URLs
  ENDPOINTS: {
    SEARCH: '/search',
    VIDEOS: '/videos',
    PLAYLISTS: '/playlists',
    CHANNELS: '/channels'
  },
  
  // Default parameters
  DEFAULT_PARAMS: {
    part: 'snippet',
    type: 'video',
    maxResults: 25,
    regionCode: 'IT',
    relevanceLanguage: 'it'
  }
};

// Verifica se la chiave API è configurata
export const isAPIConfigured = () => {
  return YOUTUBE_CONFIG.API_KEY && YOUTUBE_CONFIG.API_KEY !== 'YOUR_YOUTUBE_API_KEY_HERE';
};
