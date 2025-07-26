import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const cryptoData = [
  { time: '00:00', BTC: 45000, ETH: 3200, ADA: 1.25, SOL: 110, DOGE: 0.08 },
  { time: '04:00', BTC: 45500, ETH: 3250, ADA: 1.28, SOL: 115, DOGE: 0.082 },
  { time: '08:00', BTC: 44800, ETH: 3180, ADA: 1.22, SOL: 108, DOGE: 0.078 },
  { time: '12:00', BTC: 46200, ETH: 3320, ADA: 1.31, SOL: 120, DOGE: 0.085 },
  { time: '16:00', BTC: 47100, ETH: 3400, ADA: 1.35, SOL: 125, DOGE: 0.088 },
  { time: '20:00', BTC: 46800, ETH: 3380, ADA: 1.33, SOL: 122, DOGE: 0.087 },
];

const cryptoList = [
  { symbol: 'BTC', name: 'Bitcoin', price: 46800, change: 1800, changePercent: 4.00, marketCap: '$902.1B', volume24h: '$28.5B' },
  { symbol: 'ETH', name: 'Ethereum', price: 3380, change: 180, changePercent: 5.63, marketCap: '$406.2B', volume24h: '$15.2B' },
  { symbol: 'ADA', name: 'Cardano', price: 1.33, change: 0.08, changePercent: 6.40, marketCap: '$44.8B', volume24h: '$2.1B' },
  { symbol: 'SOL', name: 'Solana', price: 122, change: 12, changePercent: 10.91, marketCap: '$37.5B', volume24h: '$1.8B' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.087, change: 0.007, changePercent: 8.75, marketCap: '$12.3B', volume24h: '$890M' },
  { symbol: 'MATIC', name: 'Polygon', price: 0.92, change: -0.05, changePercent: -5.15, marketCap: '$8.5B', volume24h: '$420M' },
];

const marketStats = [
  { label: 'Total Market Cap', value: '$1.82T', change: '+3.2%', positive: true },
  { label: '24h Volume', value: '$67.8B', change: '+12.5%', positive: true },
  { label: 'Bitcoin Dominance', value: '49.6%', change: '-0.8%', positive: false },
  { label: 'Active Cryptocurrencies', value: '13,247', change: '+156', positive: true },
];

export default function CryptoInsights() {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');

  const getChangeBadge = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return (
      <Badge className={`${isPositive ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
        {isPositive ? '+' : ''}{change > 1 ? change.toFixed(0) : change.toFixed(3)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl mb-2 bg-gradient-to-r from-[var(--velmora-purple)] to-[var(--velmora-magenta)] bg-clip-text text-transparent">
          Crypto Insights
        </h1>
        <p className="text-black">
          Explore cryptocurrency markets, trends, and insights.
        </p>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketStats.map((stat, index) => (
          <Card key={index} className="p-6 bg-white border border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl text-black mb-2">{stat.value}</p>
              <Badge className={`${stat.positive ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                {stat.change}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Price Chart */}
      <Card className="p-6 bg-white border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-2xl text-black mb-1">{selectedCrypto} Price Chart</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl text-black">
                ${selectedCrypto === 'BTC' ? '46,800' : selectedCrypto === 'ETH' ? '3,380' : '122'}
              </span>
              <span className="text-green-600 text-lg">+4.00%</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['BTC', 'ETH', 'SOL'].map((crypto) => (
              <Button
                key={crypto}
                variant={selectedCrypto === crypto ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCrypto(crypto)}
                className={`${
                  selectedCrypto === crypto
                    ? 'bg-[var(--velmora-magenta)] hover:bg-[var(--velmora-magenta)]/80'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {crypto}
              </Button>
            ))}
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={cryptoData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                color: '#1f2937'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey={selectedCrypto} 
              stroke="var(--velmora-magenta)" 
              strokeWidth={3}
              dot={{ fill: 'var(--velmora-magenta)', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Cryptocurrency List */}
      <Card className="p-6 bg-white border border-gray-200">
        <h3 className="text-xl mb-4 text-black">Top Cryptocurrencies</h3>
        <div className="space-y-3">
          {cryptoList.map((crypto) => (
            <div 
              key={crypto.symbol} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => setSelectedCrypto(crypto.symbol)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--velmora-purple)] to-[var(--velmora-magenta)] rounded-full flex items-center justify-center text-white">
                  {crypto.symbol.charAt(0)}
                </div>
                <div>
                  <div className="text-black font-medium">{crypto.symbol}</div>
                  <div className="text-sm text-gray-600">{crypto.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-black font-medium">${crypto.price > 1 ? crypto.price.toFixed(0) : crypto.price.toFixed(3)}</div>
                <div className="flex items-center gap-2">
                  {getChangeBadge(crypto.change, crypto.changePercent)}
                </div>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-sm text-gray-600">Market Cap</div>
                <div className="text-sm text-black">{crypto.marketCap}</div>
              </div>
              <div className="text-right hidden lg:block">
                <div className="text-sm text-gray-600">24h Volume</div>
                <div className="text-sm text-black">{crypto.volume24h}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Fear & Greed Index */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border border-gray-200">
          <h3 className="text-xl mb-4 text-black">Fear & Greed Index</h3>
          <div className="text-center">
            <div className="text-6xl mb-4">😊</div>
            <div className="text-4xl text-green-600 mb-2">72</div>
            <div className="text-xl text-black mb-2">Greed</div>
            <p className="text-gray-600 text-sm">
              The market is showing signs of greed. This could indicate a potential market correction.
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200">
          <h3 className="text-xl mb-4 text-black">Market Insights</h3>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-black mb-1">🚀 Bullish Trend</div>
              <div className="text-sm text-gray-600">
                Major cryptocurrencies are showing strong upward momentum.
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-black mb-1">📈 High Volume</div>
              <div className="text-sm text-gray-600">
                Trading volumes are 25% above average, indicating strong interest.
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-black mb-1">⚠️ Volatility Alert</div>
              <div className="text-sm text-gray-600">
                Expect increased price swings in the next 24-48 hours.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}