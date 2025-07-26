import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

const companyInsights = {
  'AAPL': {
    name: 'Apple Inc.',
    currentPrice: 155.60,
    change: 5.35,
    changePercent: 3.56,
    volume: '45.2M',
    marketCap: '$2.45T',
    pe: 28.5,
    dayRange: '150.20 - 157.80',
    fiftyTwoWeekRange: '124.17 - 199.62',
    insights: [
      'Strong iPhone sales in Q4 2024',
      'Services revenue grew 16% year-over-year',
      'Cash reserves at $162.1 billion',
      'Dividend yield of 0.52%'
    ],
    lastEarnings: '+8.3% surprise',
    nextEarnings: 'Feb 1, 2025',
    analystRating: 'Buy',
    priceTarget: '$185.00'
  },
  'GOOGL': {
    name: 'Alphabet Inc.',
    currentPrice: 2820.90,
    change: 70.10,
    changePercent: 2.55,
    volume: '12.8M',
    marketCap: '$1.78T',
    pe: 22.1,
    dayRange: '2780.00 - 2845.50',
    fiftyTwoWeekRange: '2193.62 - 3042.93',
    insights: [
      'Cloud revenue increased 35% YoY',
      'YouTube ad revenue at $8.9B',
      'AI integration across products',
      'Strong search market position'
    ],
    lastEarnings: '+12.7% surprise',
    nextEarnings: 'Jan 28, 2025',
    analystRating: 'Buy',
    priceTarget: '$3,100.00'
  },
  'TSLA': {
    name: 'Tesla Inc.',
    currentPrice: 258.10,
    change: 12.50,
    changePercent: 5.08,
    volume: '28.4M',
    marketCap: '$824.5B',
    pe: 58.9,
    dayRange: '245.60 - 262.30',
    fiftyTwoWeekRange: '138.80 - 299.29',
    insights: [
      'Record vehicle deliveries in Q4',
      'Cybertruck production ramping up',
      'Energy storage business growth',
      'Autonomous driving progress'
    ],
    lastEarnings: '+15.2% surprise',
    nextEarnings: 'Jan 24, 2025',
    analystRating: 'Hold',
    priceTarget: '$275.00'
  },
  'MSFT': {
    name: 'Microsoft Corp.',
    currentPrice: 322.80,
    change: 12.35,
    changePercent: 3.98,
    volume: '22.1M',
    marketCap: '$2.41T',
    pe: 31.2,
    dayRange: '318.20 - 325.60',
    fiftyTwoWeekRange: '309.45 - 384.30',
    insights: [
      'Azure cloud growth at 30%',
      'Office 365 subscriber increase',
      'AI integration in products',
      'Strong enterprise demand'
    ],
    lastEarnings: '+6.8% surprise',
    nextEarnings: 'Jan 22, 2025',
    analystRating: 'Buy',
    priceTarget: '$360.00'
  }
};

const watchlist = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 155.60, change: 5.35, changePercent: 3.56, volume: '45.2M' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2820.90, change: 70.10, changePercent: 2.55, volume: '12.8M' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 258.10, change: 12.50, changePercent: 5.08, volume: '28.4M' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 322.80, change: 12.35, changePercent: 3.98, volume: '22.1M' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3285.04, change: -15.20, changePercent: -0.46, volume: '15.6M' },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 324.85, change: 8.95, changePercent: 2.83, volume: '18.9M' },
];

export default function StockPrices() {
  const [selectedStock, setSelectedStock] = useState('AAPL');

  const currentInsights = companyInsights[selectedStock as keyof typeof companyInsights];

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeBadge = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return (
      <Badge className={`${isPositive ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
        {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
      </Badge>
    );
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Buy': return 'bg-green-100 text-green-800 border-green-300';
      case 'Hold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Sell': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl mb-2 bg-gradient-to-r from-[var(--velmora-purple)] to-[var(--velmora-magenta)] bg-clip-text text-transparent">
          Stock Prices
        </h1>
        <p className="text-black">
          Track stock prices and analyze detailed company insights.
        </p>
      </div>

      {/* Company Insights Section */}
      <Card className="p-6 bg-white border border-gray-200">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl text-black mb-1">{currentInsights.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl text-black">${currentInsights.currentPrice}</span>
                {getChangeBadge(currentInsights.change, currentInsights.changePercent)}
              </div>
            </div>
            <div className="text-right">
              <Badge className={getRatingColor(currentInsights.analystRating)}>
                {currentInsights.analystRating}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">
                Target: ${currentInsights.priceTarget}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Market Cap</div>
            <div className="text-lg text-black">{currentInsights.marketCap}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">P/E Ratio</div>
            <div className="text-lg text-black">{currentInsights.pe}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Volume</div>
            <div className="text-lg text-black">{currentInsights.volume}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Day Range</div>
            <div className="text-lg text-black">{currentInsights.dayRange}</div>
          </div>
        </div>

        {/* Company Insights */}
        <div className="mb-6">
          <h4 className="text-lg text-black mb-3">Key Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentInsights.insights.map((insight, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-[var(--velmora-purple)] rounded-full mr-3"></div>
                <span className="text-black text-sm">{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Last Earnings</div>
            <div className="text-lg text-green-600">{currentInsights.lastEarnings}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Next Earnings</div>
            <div className="text-lg text-black">{currentInsights.nextEarnings}</div>
          </div>
        </div>
      </Card>

      {/* Watchlist */}
      <Card className="p-6 bg-white border border-gray-200">
        <h3 className="text-xl mb-4 text-black">Watchlist</h3>
        <div className="space-y-3">
          {watchlist.map((stock) => (
            <div 
              key={stock.symbol} 
              className={`flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border ${
                selectedStock === stock.symbol ? 'border-[var(--velmora-purple)] bg-[var(--velmora-purple)]/5' : 'border-gray-200'
              }`}
              onClick={() => setSelectedStock(stock.symbol)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[var(--velmora-purple)]/20 rounded-full flex items-center justify-center">
                  <span className="text-[var(--velmora-purple)] font-bold">
                    {stock.symbol.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-black font-medium">{stock.symbol}</div>
                  <div className="text-sm text-gray-600">{stock.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-black font-medium">${stock.price.toFixed(2)}</div>
                <div className="flex items-center gap-2">
                  {getChangeBadge(stock.change, stock.changePercent)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Volume</div>
                <div className="text-sm text-black">{stock.volume}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}