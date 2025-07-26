import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/pages/Dashboard';
import NewsScraper from './components/pages/NewsScraper';
import StockPrices from './components/pages/StockPrices';
import CryptoInsights from './components/pages/CryptoInsights';
import ECommerce from './components/pages/ECommerce';
import CustomMoodPlaylist from './components/pages/CustomMoodPlaylist';
import Share from './components/pages/Share';
import Profile from './components/pages/Profile';
import AboutUs from './components/pages/AboutUs';
import Reviews from './components/pages/Reviews';
import Settings from './components/pages/Settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'News Scraper':
        return <NewsScraper />;
      case 'Stock Prices':
        return <StockPrices />;
      case 'Crypto Insights':
        return <CryptoInsights />;
      case 'E-Commerce':
        return <ECommerce />;
      case 'Custom Mood Playlist':
        return <CustomMoodPlaylist />;
      case 'Share':
        return <Share />;
      case 'Profile':
        return <Profile />;
      case 'About Us':
        return <AboutUs />;
      case 'Reviews':
        return <Reviews />;
      case 'Settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--velmora-background)] text-[var(--velmora-text)]">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}