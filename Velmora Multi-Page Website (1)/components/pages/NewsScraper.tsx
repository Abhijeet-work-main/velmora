import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const mockNews = [
  {
    id: 1,
    title: "Market Reaches New Highs Amid Economic Recovery",
    source: "Financial Times",
    time: "2 hours ago",
    category: "Markets",
    sentiment: "positive",
    summary: "Global markets continue their upward trajectory as economic indicators show strong recovery signals.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop"
  },
  {
    id: 2,
    title: "Cryptocurrency Regulation Updates Expected This Week",
    source: "CryptoNews",
    time: "4 hours ago",
    category: "Crypto",
    sentiment: "neutral",
    summary: "Regulatory bodies are preparing to announce new guidelines for cryptocurrency trading and investments.",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop"
  },
  {
    id: 3,
    title: "Tech Stocks Face Pressure from Rising Interest Rates",
    source: "TechCrunch",
    time: "6 hours ago",
    category: "Technology",
    sentiment: "negative",
    summary: "Technology sector stocks are experiencing volatility as interest rate concerns mount among investors.",
    image: "https://images.unsplash.com/photo-1518186233392-c232efbf2373?w=400&h=200&fit=crop"
  },
  {
    id: 4,
    title: "Energy Sector Shows Strong Performance in Q4",
    source: "Energy Weekly",
    time: "8 hours ago",
    category: "Energy",
    sentiment: "positive",
    summary: "Energy companies report robust quarterly earnings, driven by increased demand and stabilizing prices.",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=200&fit=crop"
  },
  {
    id: 5,
    title: "AI Companies Announce Major Breakthrough in Machine Learning",
    source: "AI Today",
    time: "10 hours ago",
    category: "AI/ML",
    sentiment: "positive",
    summary: "Leading AI companies unveil new machine learning models with unprecedented capabilities.",
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=200&fit=crop"
  },
  {
    id: 6,
    title: "Federal Reserve Maintains Interest Rates",
    source: "Bloomberg",
    time: "12 hours ago",
    category: "Markets",
    sentiment: "neutral",
    summary: "The Federal Reserve announced its decision to maintain current interest rates amid economic uncertainty.",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=200&fit=crop"
  }
];

export default function NewsScraper() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [animatedResults, setAnimatedResults] = useState<any[]>([]);

  const categories = ['All', 'Markets', 'Crypto', 'Technology', 'Energy', 'AI/ML'];

  const filteredNews = mockNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = () => {
    if (!searchTerm.trim() && selectedCategory === 'All') return;
    
    setIsSearching(true);
    setShowResults(false);
    setAnimatedResults([]);

    // Simulate API call delay
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
      
      // Animate results one by one
      filteredNews.forEach((news, index) => {
        setTimeout(() => {
          setAnimatedResults(prev => [...prev, news]);
        }, index * 150);
      });
    }, 800);
  };

  // Auto-search when category changes
  useEffect(() => {
    if (selectedCategory !== 'All') {
      handleSearch();
    }
  }, [selectedCategory]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-300';
      case 'negative': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl mb-2 gradient-text">
          News Scraper
        </h1>
        <p className="text-[var(--velmora-text)]">
          Stay updated with the latest financial news and market insights.
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search news articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="border-[var(--velmora-secondary)]/30 focus:border-[var(--velmora-primary)] focus:ring-[var(--velmora-primary)] text-lg py-3"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`ripple-effect ${
                  selectedCategory === category
                    ? 'rainbow-gradient text-white'
                    : 'border-[var(--velmora-secondary)]/30 text-[var(--velmora-text)] hover:bg-[var(--velmora-primary)]/10'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="ripple-effect bg-[var(--velmora-primary)] hover:bg-[var(--velmora-primary)]/80 text-white px-6"
          >
            {isSearching ? (
              <span className="loading-dots">Searching</span>
            ) : (
              '🔍 Search'
            )}
          </Button>
        </div>
      </Card>

      {/* Loading State */}
      {isSearching && (
        <Card className="p-12 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30 text-center">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl mb-2 text-[var(--velmora-text)]">
            <span className="loading-dots">Fetching latest news</span>
          </h3>
          <p className="text-[var(--velmora-text)]/70">Please wait while we gather the most recent articles...</p>
        </Card>
      )}

      {/* News Cards with Animation */}
      {showResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animatedResults.map((article, index) => (
            <Card 
              key={article.id} 
              className="bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30 overflow-hidden news-card-enter"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={getSentimentColor(article.sentiment)}>
                    {article.sentiment}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="border-[var(--velmora-secondary)]/30 text-[var(--velmora-text)]">
                    {article.category}
                  </Badge>
                </div>
                <h3 className="text-lg mb-2 text-[var(--velmora-text)] hover:text-[var(--velmora-primary)] transition-colors cursor-pointer line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-[var(--velmora-text)]/70 text-sm mb-3 line-clamp-3">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between text-sm text-[var(--velmora-text)]/60 mb-3">
                  <span>{article.source}</span>
                  <span>{article.time}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-[var(--velmora-primary)] hover:bg-[var(--velmora-primary)]/80 text-white flex-1 ripple-effect"
                  >
                    Read More
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-[var(--velmora-secondary)]/30 text-[var(--velmora-text)] hover:bg-[var(--velmora-secondary)]/10"
                  >
                    💾
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {showResults && animatedResults.length === 0 && (
        <Card className="p-12 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30 text-center">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl mb-2 text-[var(--velmora-text)]">No articles found</h3>
          <p className="text-[var(--velmora-text)]/70">Try adjusting your search terms or category filters.</p>
        </Card>
      )}

      {/* Trending Topics */}
      {!showResults && !isSearching && (
        <Card className="p-6 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30">
          <h3 className="text-2xl mb-4 text-[var(--velmora-text)]">🔥 Trending Topics</h3>
          <div className="flex flex-wrap gap-2">
            {['AI Revolution', 'Crypto Market', 'Tech Earnings', 'Climate Tech', 'Fed Policy', 'EV Growth'].map((topic, index) => (
              <Button
                key={topic}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm(topic);
                  handleSearch();
                }}
                className="border-[var(--velmora-primary)]/30 text-[var(--velmora-primary)] hover:bg-[var(--velmora-primary)]/10 ripple-effect"
              >
                #{topic}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}