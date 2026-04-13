// ===== HSE CENTER FAVORITES LOGIC =====

const HSE_FAV_KEY = 'hse_favorites_list';

/**
 * Initialize Favorites: Add stars to cards and render section
 */
function initHSEFavorites() {
    console.log('⭐ Initializing HSE Favorites...');
    // Only select cards from the main categories, EXCLUDING clones in the favorites section
    const categoryGrids = document.querySelectorAll('#hse-center-screen section .hse-grid, #hse-center-screen .hse-grid:not(#hse-favorites-grid)');
    const favorites = getHSEFavorites();

    const allCards = [];
    categoryGrids.forEach(grid => {
        if (grid.id === 'hse-favorites-grid') return;
        grid.querySelectorAll('.hse-card').forEach(c => allCards.push(c));
    });

    allCards.forEach((card) => {
        // Extract a truly unique ID from the subscreen name or title
        const onclickAttr = card.getAttribute('onclick') || '';
        const cardTitle = card.querySelector('.card-title')?.innerText || '';
        
        // Try to get the subscreen ID from navigateToSubscreen('ID')
        let cardId = '';
        const match = onclickAttr.match(/navigateToSubscreen\(['"]([^'"]+)['"]\)/);
        if (match && match[1]) {
            cardId = match[1];
        } else {
            // Fallback: sanitized title
            cardId = cardTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
        }
        
        if (!cardId) return;
        
        card.setAttribute('data-fav-id', cardId);

        // Add star icon if not already present
        if (!card.querySelector('.fav-star')) {
            const star = document.createElement('div');
            star.className = 'fav-star' + (favorites.includes(cardId) ? ' active' : '');
            star.innerHTML = '⭐';
            star.onclick = (e) => {
                e.stopPropagation(); 
                toggleHSEFavorite(cardId);
            };
            card.appendChild(star);
        }
    });

    renderHSEFavorites();
}

/**
 * Get list of favorite IDs from storage
 */
function getHSEFavorites() {
    try {
        const data = localStorage.getItem(HSE_FAV_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

/**
 * Toggle favorite status
 */
function toggleHSEFavorite(id) {
    let favorites = getHSEFavorites();
    const index = favorites.indexOf(id);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(id);
    }

    localStorage.setItem(HSE_FAV_KEY, JSON.stringify(favorites));
    
    // Update all matching stars (original and cloned)
    document.querySelectorAll(`[data-fav-id="${id}"] .fav-star`).forEach(s => {
        if (index > -1) s.classList.remove('active');
        else s.classList.add('active');
    });

    renderHSEFavorites();
}

/**
 * Render correctly cloned cards into the Favorites section
 */
function renderHSEFavorites() {
    const container = document.getElementById('hse-favorites-container');
    const grid = document.getElementById('hse-favorites-grid');
    const favorites = getHSEFavorites();

    if (favorites.length === 0) {
        container.classList.add('hidden');
        return;
    }

    container.classList.remove('hidden');
    grid.innerHTML = '';

    favorites.forEach(id => {
        // Find the original card
        const original = document.querySelector(`#hse-center-screen .hse-grid .hse-card[data-fav-id="${id}"]`);
        if (original) {
            const clone = original.cloneNode(true);
            
            // Re-bind the click events since cloneNode(true) doesn't copy listeners
            // but inline 'onclick' attributes are copied, so it "just works" for these cards.
            // We just need to re-bind the star toggle.
            const star = clone.querySelector('.fav-star');
            if (star) {
                star.onclick = (e) => {
                    e.stopPropagation();
                    toggleHSEFavorite(id);
                };
            }

            grid.appendChild(clone);
        }
    });
}

// Export to window
window.initHSEFavorites = initHSEFavorites;
window.toggleHSEFavorite = toggleHSEFavorite;
