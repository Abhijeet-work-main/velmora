/* ==========================================
   VELMORA ADVANCED WEB SCRAPER - SCRIPTS
   ========================================== */

// Global Variables and Configuration
let socket;
let currentSection = 'dashboard';
let stockChart = null;
let cryptoChart = null;

// DOM Element References (cached for performance)
const elements = {
    // Navigation elements
    navButtons: null,
    dropdownToggle: null,
    dropdownMenu: null,
    
    // Search elements
    globalSearchInput: null,
    globalSearchBtn: null,
    stockSearchInput: null,
    stockSearchBtn: null,
    cryptoSearchInput: null,
    cryptoSearchBtn: null,
    
    // Content containers
    dashboardSection: null,
    stocksSection: null,
    cryptoSection: null,
    newsSection: null,
    
    // Watchlist containers
    stocksList: null,
    cryptosList: null,
    
    // Chart containers
    stockChartCanvas: null,
    cryptoChartCanvas: null,
    
    // Notification container
    notifications: null,
    recentActivity: null
};

/* ==========================================
   INITIALIZATION
   ========================================== */

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Velmora initializing...');
    
    // Cache DOM elements
    cacheElements();
    
    // Setup Socket.IO connection
    initializeSocket();
    
    // Setup navigation
    setupNavigation();
    
    // Setup search handlers
    setupSearchHandlers();
    
    // Setup refresh buttons
    setupRefreshButtons();
    
    // Load initial data
    loadInitialData();
    
    console.log('✅ Velmora initialized successfully');
});

/* ==========================================
   DOM ELEMENT CACHING
   ========================================== */

function cacheElements() {
    // Navigation
    elements.navButtons = document.querySelectorAll('.nav-button');
    elements.dropdownToggle = document.getElementById('menu-dropdown');
    elements.dropdownMenu = document.querySelector('.dropdown-menu');
    
    // Search inputs (updated IDs to match new HTML)
    elements.globalSearchInput = document.getElementById('global-search');
    elements.globalSearchBtn = document.getElementById('search-btn');
    elements.stockSearchInput = document.getElementById('stock-search');
    elements.stockSearchBtn = document.getElementById('stock-search-btn');
    elements.cryptoSearchInput = document.getElementById('crypto-search');
    elements.cryptoSearchBtn = document.getElementById('crypto-search-btn');
    
    // Sections (updated to match new HTML)
    elements.dashboardSection = document.getElementById('dashboard');
    elements.stocksSection = document.getElementById('stocks');
    elements.cryptoSection = document.getElementById('crypto');
    elements.newsSection = document.getElementById('news');
    
    // Lists (simplified names)
    elements.stocksList = document.getElementById('stocks-list');
    elements.cryptosList = document.getElementById('cryptos-list');
    
    // Charts (updated to match new HTML)
    elements.stockChartCanvas = document.getElementById('stock-chart');
    elements.cryptoChartCanvas = document.getElementById('crypto-chart');
    
    // Notifications (updated to match new HTML)
    elements.notifications = document.getElementById('notifications');
    elements.recentActivity = document.getElementById('recent-activity');
}

/* ==========================================
   SOCKET.IO CONNECTION
   ========================================== */

function initializeSocket() {
    socket = io();
    
    socket.on('connect', function() {
        console.log('🔌 Connected to server');
        showNotification('Connected to Velmora server', 'success');
    });
    
    socket.on('disconnect', function() {
        console.log('🔌 Disconnected from server');
        showNotification('Connection lost - trying to reconnect...', 'error');
    });
    
    // Handle scraping updates
    socket.on('scrape_update', handleScrapingUpdate);
    socket.on('custom_scrape_update', handleCustomScrapingUpdate);
}

/* ==========================================
   NAVIGATION SYSTEM
   ========================================== */

function setupNavigation() {
    // Add click handlers to navigation buttons
    elements.navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.dataset.section;
            if (targetSection) {
                switchToSection(targetSection);
            }
        });
    });
    
    // Setup dropdown menu
    if (elements.dropdownToggle) {
        elements.dropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            elements.dropdownMenu.classList.toggle('show');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            elements.dropdownMenu?.classList.remove('show');
        }
    });
}

function switchToSection(sectionName) {
    console.log(`📍 Switching to section: ${sectionName}`);
    
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
    }
    
    // Update navigation buttons
    elements.navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionName) {
            btn.classList.add('active');
        }
    });
    
    // Load section-specific data
    loadSectionData(sectionName);
}

function loadSectionData(sectionName) {
    switch(sectionName) {
        case 'stocks':
            refreshStockData();
            break;
        case 'crypto':
            refreshCryptoData();
            break;
        case 'dashboard':
            refreshDashboardData();
            break;
    }
}

/* ==========================================
   SEARCH FUNCTIONALITY
   ========================================== */

function setupSearchHandlers() {
    // Global search
    if (elements.globalSearchBtn) {
        elements.globalSearchBtn.addEventListener('click', handleGlobalSearch);
    }
    
    // Stock search
    if (elements.stockSearchBtn) {
        elements.stockSearchBtn.addEventListener('click', handleStockSearch);
    }
    
    // Crypto search
    if (elements.cryptoSearchBtn) {
        elements.cryptoSearchBtn.addEventListener('click', handleCryptoSearch);
    }
    
    // Enter key support for all search inputs
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchBtn = this.parentElement.querySelector('.btn-primary');
                if (searchBtn) {
                    searchBtn.click();
                }
            }
        });
    });
}

// Global search handler
function handleGlobalSearch() {
    const query = elements.globalSearchInput?.value.trim();
    if (!query) {
        showNotification('Please enter a search term', 'error');
        return;
    }
    
    console.log(`🔍 Global search for: ${query}`);
    showNotification(`Searching for "${query}"...`, 'info');
    
    // Send search request via Socket.IO
    socket.emit('scrape_request', {
        type: 'news',
        query: query
    });
}

// Stock search handler
async function handleStockSearch() {
    const symbol = elements.stockSearchInput?.value.trim().toUpperCase();
    if (!symbol) {
        showNotification('Please enter a stock symbol', 'error');
        return;
    }
    
    console.log(`📈 Stock search for: ${symbol}`);
    showNotification(`Getting quote for ${symbol}...`, 'info');
    
    try {
        const response = await fetch(`/api/scrape/stocks?symbol=${symbol}`);
        const data = await response.json();
        
        if (data.success) {
            displayStockDetails(data.data);
            showNotification(`Stock data for ${symbol} loaded successfully`, 'success');
        } else {
            showNotification(data.message || 'Failed to get stock data', 'error');
        }
    } catch (error) {
        console.error('❌ Stock search error:', error);
        showNotification('Failed to fetch stock data', 'error');
    }
}

// Crypto search handler  
async function handleCryptoSearch() {
    const symbol = elements.cryptoSearchInput?.value.trim().toLowerCase();
    if (!symbol) {
        showNotification('Please enter a cryptocurrency name', 'error');
        return;
    }
    
    console.log(`₿ Crypto search for: ${symbol}`);
    showNotification(`Getting price for ${symbol}...`, 'info');
    
    try {
        const response = await fetch(`/api/scrape/crypto?symbol=${symbol}`);
        const data = await response.json();
        
        if (data.success) {
            displayCryptoDetails(data.data);
            showNotification(`Crypto data for ${symbol} loaded successfully`, 'success');
        } else {
            showNotification(data.message || 'Failed to get crypto data', 'error');
        }
    } catch (error) {
        console.error('❌ Crypto search error:', error);
        showNotification('Failed to fetch crypto data', 'error');
    }
}

/* ==========================================
   REFRESH FUNCTIONALITY
   ========================================== */

function setupRefreshButtons() {
    // Stock refresh button (updated ID to match new HTML)
    const stockRefreshBtn = document.getElementById('refresh-stocks');
    if (stockRefreshBtn) {
        stockRefreshBtn.addEventListener('click', refreshStockData);
    }
    
    // Crypto refresh button (updated ID to match new HTML)
    const cryptoRefreshBtn = document.getElementById('refresh-crypto');
    if (cryptoRefreshBtn) {
        cryptoRefreshBtn.addEventListener('click', refreshCryptoData);
    }
}

// Refresh stock watchlist
async function refreshStockData() {
    console.log('🔄 Refreshing stock data...');
    const container = elements.stocksList;
    
    if (!container) return;
    
    // Show loading state
    container.innerHTML = '<div class="text-center py-8"><div class="loader mx-auto"></div><p class="mt-4 opacity-60">Loading stock data...</p></div>';
    
    try {
        const response = await fetch('/api/scrape/stocks');
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            displayStockList(data.data.slice(0, 6)); // Show first 6 stocks
            showNotification('Stock watchlist updated!', 'success');
        } else {
            throw new Error('No stock data received');
        }
    } catch (error) {
        console.error('❌ Error refreshing stocks:', error);
        container.innerHTML = '<div class="text-center py-8 text-red-400"><i class="fas fa-exclamation-triangle text-2xl mb-2"></i><p>Failed to load stock data</p></div>';
        showNotification('Failed to refresh stock data', 'error');
    }
}

// Refresh crypto watchlist
async function refreshCryptoData() {
    console.log('🔄 Refreshing crypto data...');
    const container = elements.cryptosList;
    
    if (!container) return;
    
    // Show loading state  
    container.innerHTML = '<div class="text-center py-8"><div class="loader mx-auto"></div><p class="mt-4 opacity-60">Loading crypto data...</p></div>';
    
    try {
        const response = await fetch('/api/scrape/crypto');
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            displayCryptoList(data.data.slice(0, 6)); // Show first 6 cryptos
            showNotification('Crypto watchlist updated!', 'success');
        } else {
            throw new Error('No crypto data received');
        }
    } catch (error) {
        console.error('❌ Error refreshing crypto:', error);
        container.innerHTML = '<div class="text-center py-8 text-red-400"><i class="fas fa-exclamation-triangle text-2xl mb-2"></i><p>Failed to load crypto data</p></div>';
        showNotification('Failed to refresh crypto data', 'error');
    }
}

// Refresh dashboard data
function refreshDashboardData() {
    console.log('🔄 Refreshing dashboard...');
    refreshStockData();
    refreshCryptoData();
}

/* ==========================================
   DATA DISPLAY FUNCTIONS
   ========================================== */

// Display stock list in watchlist
function displayStockList(stocks) {
    const container = elements.stocksList;
    if (!container) return;
    
    const stocksHTML = stocks.map(stock => `
        <div class="stock-item" data-symbol="${stock.symbol}">
            <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                    ${stock.symbol.charAt(0)}
                </div>
                <div>
                    <h4 class="font-semibold">${stock.symbol}</h4>
                    <p class="text-sm opacity-60">${stock.name || stock.symbol + ' Inc.'}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="font-semibold text-lg">$${parseFloat(stock.price).toFixed(2)}</div>
                <div class="text-sm ${parseFloat(stock.changePercent) >= 0 ? 'price-positive' : 'price-negative'}">
                    ${parseFloat(stock.changePercent) >= 0 ? '+' : ''}${parseFloat(stock.changePercent).toFixed(2)}%
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="space-y-3">${stocksHTML}</div>`;
    
    // Add click handlers for stock items
    container.querySelectorAll('.stock-item').forEach(item => {
        item.addEventListener('click', () => {
            const symbol = item.dataset.symbol;
            if (symbol && elements.stockSearchInput) {
                elements.stockSearchInput.value = symbol;
                handleStockSearch();
            }
        });
    });
}

// Display crypto list in watchlist
function displayCryptoList(cryptos) {
    const container = elements.cryptosList;
    if (!container) return;
    
    const cryptoIcons = {
        'BTC': '₿', 'ETH': 'Ξ', 'BNB': 'B', 'SOL': 'S', 'ADA': 'A', 'XRP': 'X'
    };
    
    const cryptoColors = {
        'BTC': 'bg-orange-500', 'ETH': 'bg-blue-500', 'BNB': 'bg-yellow-500',
        'SOL': 'bg-purple-500', 'ADA': 'bg-indigo-500', 'XRP': 'bg-blue-400'
    };
    
    const cryptosHTML = cryptos.map(crypto => `
        <div class="crypto-item" data-symbol="${crypto.symbol.toLowerCase()}">
            <div class="flex items-center space-x-4">
                <div class="w-10 h-10 ${cryptoColors[crypto.symbol] || 'bg-gray-600'} rounded-full flex items-center justify-center text-white font-bold">
                    ${cryptoIcons[crypto.symbol] || crypto.symbol.charAt(0)}
                </div>
                <div>
                    <h4 class="font-semibold">${crypto.symbol}</h4>
                    <p class="text-sm opacity-60">${crypto.name}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="font-semibold text-lg">$${parseFloat(crypto.price).toLocaleString()}</div>
                <div class="text-sm ${parseFloat(crypto.changePercent) >= 0 ? 'price-positive' : 'price-negative'}">
                    ${parseFloat(crypto.changePercent) >= 0 ? '+' : ''}${parseFloat(crypto.changePercent).toFixed(2)}%
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="space-y-3">${cryptosHTML}</div>`;
    
    // Add click handlers for crypto items
    container.querySelectorAll('.crypto-item').forEach(item => {
        item.addEventListener('click', () => {
            const symbol = item.dataset.symbol;
            if (symbol && elements.cryptoSearchInput) {
                elements.cryptoSearchInput.value = symbol;
                handleCryptoSearch();
            }
        });
    });
}

// Display individual stock details
function displayStockDetails(stock) {
    // Show the stock details card
    const stockCard = document.getElementById('stock-details');
    if (stockCard) {
        stockCard.style.display = 'block';
        
        // Update stock information
        updateElementText('stock-name', stock.name);
        updateElementText('stock-symbol', stock.symbol);
        updateElementText('stock-price', `$${stock.price}`);
        
        const change = parseFloat(stock.change);
        const changePercent = parseFloat(stock.changePercent);
        const changeColor = change >= 0 ? 'price-positive' : 'price-negative';
        const changeSign = change >= 0 ? '+' : '';
        
        updateElementText('stock-change', `${changeSign}${stock.change} (${changeSign}${stock.changePercent}%)`);
        updateElementClass('stock-change', `text-lg ${changeColor}`);
        updateElementClass('stock-price', `text-4xl font-bold ${changeColor}`);
        
        // Update additional info
        updateElementText('stock-market-cap', formatMarketCap(stock.marketCap || 0));
        updateElementText('stock-volume', formatVolume(stock.volume || 0));
        updateElementText('stock-day-range', `${stock.dayLow || '--'} - ${stock.dayHigh || '--'}`);
        updateElementText('stock-year-range', `${stock.yearLow || '--'} - ${stock.yearHigh || '--'}`);
        
        // Create or update chart
        createStockChart(stock);
    }
}

// Display individual crypto details
function displayCryptoDetails(crypto) {
    // Show the crypto details card
    const cryptoCard = document.getElementById('crypto-details');
    if (cryptoCard) {
        cryptoCard.style.display = 'block';
        
        // Update crypto information
        updateElementText('crypto-name', crypto.name);
        updateElementText('crypto-symbol', crypto.symbol);
        updateElementText('crypto-price', `$${crypto.price.toLocaleString()}`);
        
        const change = parseFloat(crypto.changePercent);
        const changeColor = change >= 0 ? 'price-positive' : 'price-negative';
        const changeSign = change >= 0 ? '+' : '';
        
        updateElementText('crypto-change', `${changeSign}${crypto.change} (${changeSign}${crypto.changePercent}%)`);
        updateElementClass('crypto-change', `text-lg ${changeColor}`);
        updateElementClass('crypto-price', 'text-4xl font-bold text-orange-500');
        
        // Update additional info
        updateElementText('crypto-market-cap', formatMarketCap(crypto.marketCap || 0));
        updateElementText('crypto-volume', formatMarketCap(crypto.volume24h || 0));
        updateElementText('crypto-24h-change', `${changeSign}${crypto.changePercent}%`);
        updateElementClass('crypto-24h-change', `font-semibold ${changeColor}`);
        updateElementText('crypto-rank', crypto.rank || '#--');
        
        // Create or update chart
        createCryptoChart(crypto);
    }
}

/* ==========================================
   CHART FUNCTIONS
   ========================================== */

// Create stock price chart
function createStockChart(stock) {
    const canvas = elements.stockChartCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (stockChart) {
        stockChart.destroy();
    }
    
    // Generate mock price data for demonstration
    const mockData = generateMockPriceData(parseFloat(stock.price), 30);
    
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockData.labels,
            datasets: [{
                label: `${stock.symbol} Price`,
                data: mockData.prices,
                borderColor: '#FF6B6B',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// Create crypto price chart
function createCryptoChart(crypto) {
    const canvas = elements.cryptoChartCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (cryptoChart) {
        cryptoChart.destroy();
    }
    
    // Generate mock price data for demonstration
    const mockData = generateMockPriceData(parseFloat(crypto.price), 30);
    
    cryptoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockData.labels,
            datasets: [{
                label: `${crypto.symbol} Price`,
                data: mockData.prices,
                borderColor: '#FFD93D',
                backgroundColor: 'rgba(255, 217, 61, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

/* ==========================================
   UTILITY FUNCTIONS
   ========================================== */

// Update element text content
function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

// Update element class
function updateElementClass(id, className) {
    const element = document.getElementById(id);
    if (element) {
        element.className = className;
    }
}

// Format market cap values
function formatMarketCap(value) {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
}

// Format volume values
function formatVolume(value) {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toString();
}

// Generate mock price data for charts
function generateMockPriceData(currentPrice, days) {
    const labels = [];
    const prices = [];
    const basePrice = currentPrice * 0.95; // Start slightly lower
    
    for (let i = 0; i < days; i++) {
        labels.push(`Day ${i + 1}`);
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const price = basePrice + (basePrice * variation) + ((currentPrice - basePrice) * (i / (days - 1)));
        prices.push(parseFloat(price.toFixed(2)));
    }
    
    return { labels, prices };
}

// Show notification to user
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to notification container or body
    const container = elements.notifications || document.body;
    container.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Add recent activity entry
function addRecentActivity(message, type = 'info') {
    const container = elements.recentActivity;
    if (!container) return;
    
    const icons = { 
        info: 'fa-info-circle text-blue-400', 
        success: 'fa-check-circle text-green-400', 
        error: 'fa-exclamation-triangle text-red-400' 
    };
    
    const item = document.createElement('div');
    item.className = 'flex items-start space-x-3 p-3 bg-opacity-20 bg-green-500 rounded-lg card-spacing';
    item.innerHTML = `
        <i class="fas ${icons[type]} mt-1"></i>
        <div>
            <p class="text-sm">${message}</p>
            <p class="text-xs opacity-60">${new Date().toLocaleTimeString()}</p>
        </div>
    `;
    
    container.prepend(item);
    
    // Keep only last 5 items
    if (container.children.length > 5) {
        container.lastChild.remove();
    }
}

// Handle scraping updates from Socket.IO
function handleScrapingUpdate(result) {
    console.log('📡 Received scraping update:', result);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addRecentActivity(`Search completed for "${result.query || 'query'}"`, 'success');
        
        // Display results in appropriate section
        if (currentSection === 'news' || currentSection === 'dashboard') {
            displaySearchResults(result.data);
        }
    } else {
        showNotification(result.message || 'Search failed', 'error');
        addRecentActivity('Search failed', 'error');
    }
}

// Handle custom scraping updates
function handleCustomScrapingUpdate(result) {
    console.log('📡 Received custom scraping update:', result);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addRecentActivity(`Custom scraping completed for ${result.url}`, 'success');
    } else {
        showNotification(result.message || 'Custom scraping failed', 'error');
        addRecentActivity('Custom scraping failed', 'error');
    }
}

// Display search results
function displaySearchResults(articles) {
    // Find results container based on current section
    let container = null;
    
    if (currentSection === 'dashboard') {
        container = document.getElementById('search-results');
    } else if (currentSection === 'news') {
        container = document.getElementById('news-results');
    }
    
    if (!container || !articles || articles.length === 0) {
        return;
    }
    
    const articlesHTML = articles.map(article => `
        <div class="content-card bounce-in">
            <h4 class="text-lg font-semibold mb-2">${article.title}</h4>
            <p class="text-sm opacity-70 mb-3">${article.content || article.description || 'No description available'}</p>
            <div class="flex justify-between items-center">
                <span class="text-sm text-blue-400">${article.source}</span>
                ${article.url ? `<a href="${article.url}" target="_blank" class="btn-secondary text-xs">Read More</a>` : ''}
            </div>
            ${article.publishedAt ? `<p class="text-xs opacity-50 mt-2">${new Date(article.publishedAt).toLocaleString()}</p>` : ''}
        </div>
    `).join('');
    
    container.innerHTML = articlesHTML;
}

// Load initial data when app starts
function loadInitialData() {
    // Auto-refresh watchlists on page load
    refreshStockData();
    refreshCryptoData();
    
    // Add initial activity
    addRecentActivity('Velmora dashboard loaded successfully', 'success');
}

/* ==========================================
   END OF SCRIPT
   ========================================== */

console.log('📜 Velmora scripts loaded successfully'); 