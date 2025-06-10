
// Yatify - Apple Music Clone JavaScript

class YatifyApp {
  constructor() {
    this.currentTab = 'listen-now';
    this.isPlaying = false;
    this.currentTrack = null;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupSwipeGestures();
    this.setupSearchFunctionality();
    this.preloadImages();
    
    console.log('🎵 Yatify initialized successfully');
  }

  setupEventListeners() {
    // Tab navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = tab.dataset.tab;
        this.switchTab(targetTab);
      });
    });

    // Play buttons
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handlePlayButton(btn);
      });
    });

    // Album/Station cards
    const mediaCards = document.querySelectorAll('.album-card, .station-card, .album-row');
    mediaCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.play-btn') && !e.target.closest('.more-btn')) {
          this.handleMediaCardClick(card);
        }
      });
    });

    // Player controls
    const controlButtons = document.querySelectorAll('.control-btn');
    controlButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.togglePlayPause();
      });
    });

    // Genre cards
    const genreCards = document.querySelectorAll('.genre-card');
    genreCards.forEach(card => {
      card.addEventListener('click', () => {
        this.handleGenreClick(card);
      });
    });

    // Library buttons
    const libraryButtons = document.querySelectorAll('.library-btn');
    libraryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.handleLibraryClick(btn);
      });
    });

    // Header profile button
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        this.handleProfileClick();
      });
    }

    // More buttons
    const moreButtons = document.querySelectorAll('.more-btn');
    moreButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleMoreClick(btn);
      });
    });
  }

  setupSwipeGestures() {
    let startX = 0;
    let startY = 0;
    let isScrolling = null;

    const mainContent = document.querySelector('.main-content');
    
    mainContent.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isScrolling = null;
    }, { passive: true });

    mainContent.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = startX - currentX;
      const diffY = startY - currentY;

      if (isScrolling === null) {
        isScrolling = Math.abs(diffY) > Math.abs(diffX);
      }

      if (!isScrolling && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - next tab
          this.navigateTab('next');
        } else {
          // Swipe right - previous tab
          this.navigateTab('previous');
        }
        startX = 0;
        startY = 0;
      }
    }, { passive: true });
  }

  setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      let searchTimeout;
      
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length >= 3) {
          searchTimeout = setTimeout(() => {
            this.performSearch(query);
          }, 300);
        } else if (query.length === 0) {
          this.clearSearchResults();
        }
      });

      searchInput.addEventListener('focus', () => {
        this.handleSearchFocus();
      });

      searchInput.addEventListener('blur', () => {
        this.handleSearchBlur();
      });
    }
  }

  switchTab(tabName) {
    // Update active nav tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update active content tab
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    // Update header title
    const headerTitle = document.querySelector('.header-title h1');
    const titles = {
      'listen-now': 'Ascolta ora',
      'discover': 'Scopri',
      'radio': 'Radio',
      'library': 'Libreria',
      'search': 'Cerca'
    };
    headerTitle.textContent = titles[tabName] || 'Yatify';

    this.currentTab = tabName;
    
    // Add smooth transition effect
    this.animateTabSwitch();
    
    console.log(`🎵 Switched to tab: ${tabName}`);
  }

  navigateTab(direction) {
    const tabs = ['listen-now', 'discover', 'radio', 'library', 'search'];
    const currentIndex = tabs.indexOf(this.currentTab);
    let newIndex;

    if (direction === 'next') {
      newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
    }

    this.switchTab(tabs[newIndex]);
  }

  animateTabSwitch() {
    const activePane = document.querySelector('.tab-pane.active');
    if (activePane) {
      activePane.style.opacity = '0';
      activePane.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        activePane.style.opacity = '1';
        activePane.style.transform = 'translateY(0)';
      }, 50);
    }
  }

  handlePlayButton(button) {
    // Visual feedback
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);

    // Find parent media item
    const mediaItem = button.closest('.album-card, .station-card, .album-row');
    if (mediaItem) {
      this.playMedia(mediaItem);
    }

    console.log('🎵 Play button clicked');
  }

  handleMediaCardClick(card) {
    // Add ripple effect
    this.createRippleEffect(card);
    
    // Navigate to detail view (placeholder)
    console.log('🎵 Media card clicked:', card);
    
    // For now, just play the media
    this.playMedia(card);
  }

  playMedia(mediaElement) {
    // Extract media info
    const title = mediaElement.querySelector('.album-title, .station-title, .track-title')?.textContent || 'Unknown Title';
    const artist = mediaElement.querySelector('.album-artist, .station-subtitle, .track-artist')?.textContent || 'Unknown Artist';
    const artwork = mediaElement.querySelector('img')?.src || '';

    // Update player bar
    this.updatePlayerBar(title, artist, artwork);
    
    // Update play state
    this.isPlaying = true;
    this.currentTrack = { title, artist, artwork };
    
    console.log(`🎵 Now playing: ${title} by ${artist}`);
  }

  updatePlayerBar(title, artist, artwork) {
    const trackTitle = document.querySelector('.track-title');
    const trackArtist = document.querySelector('.track-artist');
    const trackArtwork = document.querySelector('.track-artwork img');

    if (trackTitle) trackTitle.textContent = title;
    if (trackArtist) trackArtist.textContent = artist;
    if (trackArtwork && artwork) trackArtwork.src = artwork;

    // Animate player bar update
    const playerBar = document.querySelector('.player-bar');
    playerBar.style.transform = 'translateY(10px)';
    playerBar.style.opacity = '0.8';
    
    setTimeout(() => {
      playerBar.style.transform = 'translateY(0)';
      playerBar.style.opacity = '1';
    }, 200);
  }

  togglePlayPause() {
    this.isPlaying = !this.isPlaying;
    
    // Update play button icon
    const controlBtn = document.querySelector('.control-btn');
    const icon = controlBtn.querySelector('svg path');
    
    if (this.isPlaying) {
      // Change to pause icon
      icon.setAttribute('d', 'M6 4h4v16H6V4zm8 0h4v16h-4V4z');
    } else {
      // Change to play icon
      icon.setAttribute('d', 'M8 5v14l11-7z');
    }

    // Visual feedback
    controlBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
      controlBtn.style.transform = 'scale(1)';
    }, 150);

    console.log(`🎵 ${this.isPlaying ? 'Playing' : 'Paused'}`);
  }

  handleGenreClick(genreCard) {
    const genreName = genreCard.textContent.trim();
    
    // Add click animation
    genreCard.style.transform = 'scale(0.98)';
    setTimeout(() => {
      genreCard.style.transform = 'scale(1)';
    }, 150);

    // Switch to search tab and search for genre
    this.switchTab('search');
    setTimeout(() => {
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.value = genreName;
        searchInput.focus();
        this.performSearch(genreName);
      }
    }, 300);

    console.log(`🎵 Genre selected: ${genreName}`);
  }

  handleLibraryClick(button) {
    const action = button.textContent.trim();
    
    // Visual feedback
    button.style.background = 'var(--color-surface-secondary)';
    setTimeout(() => {
      button.style.background = 'var(--color-surface)';
    }, 200);

    console.log(`🎵 Library action: ${action}`);
  }

  handleProfileClick() {
    console.log('🎵 Profile clicked');
    // Placeholder for profile functionality
  }

  handleMoreClick(button) {
    console.log('🎵 More options clicked');
    // Placeholder for context menu
  }

  performSearch(query) {
    console.log(`🎵 Searching for: ${query}`);
    
    // Show loading state
    const searchInput = document.querySelector('.search-input');
    const originalPlaceholder = searchInput.placeholder;
    searchInput.placeholder = 'Cercando...';
    
    // Simulate search delay
    setTimeout(() => {
      searchInput.placeholder = originalPlaceholder;
      // Here you would integrate with YouTube Data API
      this.displaySearchResults(query);
    }, 500);
  }

  displaySearchResults(query) {
    // Placeholder for search results display
    console.log(`🎵 Displaying results for: ${query}`);
  }

  clearSearchResults() {
    console.log('🎵 Clearing search results');
  }

  handleSearchFocus() {
    const searchContainer = document.querySelector('.search-input-container');
    searchContainer.style.transform = 'scale(1.02)';
    
    setTimeout(() => {
      searchContainer.style.transform = 'scale(1)';
    }, 200);
  }

  handleSearchBlur() {
    // Placeholder for search blur handling
  }

  createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 214, 10, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.marginLeft = -size / 2 + 'px';
    ripple.style.marginTop = -size / 2 + 'px';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  preloadImages() {
    // Preload key images for better performance
    const images = [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571974599782-87624638275b?w=400&h=400&fit=crop'
    ];

    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }
}

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.yatifyApp = new YatifyApp();
});

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = YatifyApp;
}
