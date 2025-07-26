import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const latestUpdates = [
  { category: 'Technology', title: 'Apple announces new AI features', time: '2 hours ago' },
  { category: 'Cryptocurrency', title: 'Bitcoin reaches new monthly high', time: '4 hours ago' },
  { category: 'Market', title: 'S&P 500 closes at record high', time: '6 hours ago' },
  { category: 'Energy', title: 'Oil prices surge due to supply concerns', time: '8 hours ago' },
  { category: 'Healthcare', title: 'Breakthrough in cancer treatment research', time: '12 hours ago' },
];

const features = [
  {
    title: 'News Scraper',
    description: 'Stay updated with real-time financial news from multiple sources',
    icon: '📰',
    color: 'bg-blue-500'
  },
  {
    title: 'Stock Prices',
    description: 'Track and analyze stock performance with detailed insights',
    icon: '📈',
    color: 'bg-green-500'
  },
  {
    title: 'Crypto Insights',
    description: 'Get comprehensive cryptocurrency market analysis and trends',
    icon: '₿',
    color: 'bg-orange-500'
  },
  {
    title: 'E-Commerce',
    description: 'Search and compare prices for products across multiple platforms',
    icon: '🛒',
    color: 'bg-purple-500'
  },
  {
    title: 'Custom Mood Playlist',
    description: 'Get personalized music recommendations based on your current mood',
    icon: '🎵',
    color: 'bg-pink-500'
  },
  {
    title: 'Share',
    description: 'Share your portfolio performance and insights with others',
    icon: '🔗',
    color: 'bg-indigo-500'
  }
];

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  const dailyChange = selectedPeriod === 'daily' ? '+2.45%' : selectedPeriod === 'weekly' ? '+8.73%' : '+15.24%';

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl mb-2 gradient-text">
          Dashboard
        </h1>
        <p className="text-[var(--velmora-text)]">
          Welcome to your Velmora dashboard. Monitor your investments, track news, and analyze market trends.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--velmora-text)]/70 text-sm">Change</p>
              <p className="text-2xl text-green-600 stat-counter">{dailyChange}</p>
              <div className="mt-2 space-x-1">
                <Button
                  size="sm"
                  variant={selectedPeriod === 'daily' ? 'default' : 'outline'}
                  onClick={() => setSelectedPeriod('daily')}
                  className="text-xs ripple-effect"
                >
                  Daily
                </Button>
                <Button
                  size="sm"
                  variant={selectedPeriod === 'weekly' ? 'default' : 'outline'}
                  onClick={() => setSelectedPeriod('weekly')}
                  className="text-xs ripple-effect"
                >
                  Weekly
                </Button>
                <Button
                  size="sm"
                  variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
                  onClick={() => setSelectedPeriod('monthly')}
                  className="text-xs ripple-effect"
                >
                  Monthly
                </Button>
              </div>
            </div>
            <div className="w-12 h-12 marigold-gradient rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--velmora-text)]/70 text-sm">Your Total Investment</p>
              <p className="text-2xl text-[var(--velmora-text)] stat-counter">$45,672.83</p>
              <p className="text-sm text-[var(--velmora-secondary)] mt-1">USD</p>
            </div>
            <div className="w-12 h-12 rainbow-gradient rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--velmora-text)]/70 text-sm">Latest Updates</p>
              <p className="text-2xl text-[var(--velmora-text)] stat-counter">156</p>
              <p className="text-sm text-[var(--velmora-secondary)] mt-1">Today</p>
            </div>
            <div className="w-12 h-12 green-gradient rounded-lg flex items-center justify-center">
              <span className="text-2xl">📰</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Latest Updates */}
      <Card className="p-6 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30">
        <h3 className="text-xl mb-4 text-[var(--velmora-text)]">Latest Updates</h3>
        <div className="space-y-4">
          {latestUpdates.map((update, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[var(--velmora-accent)]/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-[var(--velmora-primary)]" />
                <div>
                  <span className="text-[var(--velmora-text)]">{update.title}</span>
                  <div className="text-sm text-[var(--velmora-text)]/70">{update.category}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-[var(--velmora-text)]/60">{update.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* What you wanna do today */}
      <Card className="p-6 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30">
        <h3 className="text-2xl mb-6 text-[var(--velmora-text)]">What you wanna do today?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-4 bg-[var(--velmora-accent)]/20 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center mb-3">
                <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center mr-3`}>
                  <span className="text-white text-lg">{feature.icon}</span>
                </div>
                <h4 className="text-lg text-[var(--velmora-text)]">{feature.title}</h4>
              </div>
              <p className="text-[var(--velmora-text)]/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}