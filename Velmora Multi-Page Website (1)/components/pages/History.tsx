import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const historyData = [
  {
    id: 1,
    date: '2025-01-17',
    time: '14:30',
    action: 'Buy',
    asset: 'AAPL',
    quantity: 10,
    price: 155.60,
    total: 1556.00,
    type: 'stock',
    status: 'completed'
  },
  {
    id: 2,
    date: '2025-01-17',
    time: '12:15',
    action: 'Sell',
    asset: 'BTC',
    quantity: 0.5,
    price: 46800,
    total: 23400.00,
    type: 'crypto',
    status: 'completed'
  },
  {
    id: 3,
    date: '2025-01-16',
    time: '16:45',
    action: 'Buy',
    asset: 'TSLA',
    quantity: 5,
    price: 258.10,
    total: 1290.50,
    type: 'stock',
    status: 'completed'
  },
  {
    id: 4,
    date: '2025-01-16',
    time: '11:20',
    action: 'News Alert',
    asset: 'Market Update',
    details: 'Fed announces interest rate decision',
    type: 'news',
    status: 'viewed'
  },
  {
    id: 5,
    date: '2025-01-15',
    time: '09:30',
    action: 'Buy',
    asset: 'ETH',
    quantity: 2,
    price: 3380,
    total: 6760.00,
    type: 'crypto',
    status: 'completed'
  },
  {
    id: 6,
    date: '2025-01-14',
    time: '15:22',
    action: 'Portfolio Analysis',
    asset: 'Monthly Report',
    details: 'Generated monthly performance report',
    type: 'analysis',
    status: 'generated'
  },
  {
    id: 7,
    date: '2025-01-14',
    time: '13:10',
    action: 'Sell',
    asset: 'GOOGL',
    quantity: 1,
    price: 2820.90,
    total: 2820.90,
    type: 'stock',
    status: 'completed'
  },
  {
    id: 8,
    date: '2025-01-13',
    time: '10:05',
    action: 'Buy',
    asset: 'SOL',
    quantity: 50,
    price: 122,
    total: 6100.00,
    type: 'crypto',
    status: 'completed'
  },
];

export default function History() {
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  const filters = [
    { id: 'all', label: 'All Activity', icon: '📋' },
    { id: 'trades', label: 'Trades', icon: '💹' },
    { id: 'news', label: 'News', icon: '📰' },
    { id: 'analysis', label: 'Analysis', icon: '📊' },
  ];

  const dateRanges = ['7d', '30d', '90d', '1y'];

  const filteredHistory = historyData.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'trades') return item.type === 'stock' || item.type === 'crypto';
    if (filter === 'news') return item.type === 'news';
    if (filter === 'analysis') return item.type === 'analysis';
    return true;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'Buy':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Buy</Badge>;
      case 'Sell':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Sell</Badge>;
      case 'News Alert':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">News</Badge>;
      case 'Portfolio Analysis':
        return <Badge className="bg-[var(--velmora-purple)]/20 text-[var(--velmora-purple)] border-[var(--velmora-purple)]/30">Analysis</Badge>;
      default:
        return <Badge className="bg-[var(--velmora-violet)]/20 text-[var(--velmora-violet)] border-[var(--velmora-violet)]/30">{action}</Badge>;
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'stock': return '📈';
      case 'crypto': return '₿';
      case 'news': return '📰';
      case 'analysis': return '📊';
      default: return '📋';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-2 bg-gradient-to-r from-[var(--velmora-purple)] to-[var(--velmora-magenta)] bg-clip-text text-transparent">
          History
        </h1>
        <p className="text-[var(--velmora-light-purple)]">
          Track all your activities, trades, and interactions on Velmora.
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2 flex-wrap">
            {filters.map((filterOption) => (
              <Button
                key={filterOption.id}
                variant={filter === filterOption.id ? "default" : "outline"}
                onClick={() => setFilter(filterOption.id)}
                className={`${
                  filter === filterOption.id
                    ? 'bg-[var(--velmora-purple)] hover:bg-[var(--velmora-purple)]/80'
                    : 'border-[var(--velmora-purple)]/30 text-[var(--velmora-light-purple)] hover:bg-[var(--velmora-purple)]/20'
                }`}
              >
                <span className="mr-2">{filterOption.icon}</span>
                {filterOption.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            {dateRanges.map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange(range)}
                className={`${
                  dateRange === range
                    ? 'bg-[var(--velmora-magenta)] hover:bg-[var(--velmora-magenta)]/80'
                    : 'border-[var(--velmora-magenta)]/30 text-[var(--velmora-magenta)] hover:bg-[var(--velmora-magenta)]/20'
                }`}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30 text-center">
          <div className="text-3xl mb-2">💹</div>
          <div className="text-2xl text-white mb-1">24</div>
          <div className="text-[var(--velmora-light-purple)] text-sm">Total Trades</div>
        </Card>
        <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30 text-center">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl text-green-400 mb-1">$45,327</div>
          <div className="text-[var(--velmora-light-purple)] text-sm">Total Volume</div>
        </Card>
        <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30 text-center">
          <div className="text-3xl mb-2">📰</div>
          <div className="text-2xl text-white mb-1">156</div>
          <div className="text-[var(--velmora-light-purple)] text-sm">News Alerts</div>
        </Card>
        <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30 text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl text-white mb-1">8</div>
          <div className="text-[var(--velmora-light-purple)] text-sm">Reports Generated</div>
        </Card>
      </div>

      {/* History List */}
      <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30">
        <h3 className="text-xl mb-4 text-[var(--velmora-light-purple)]">Recent Activity</h3>
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-4 bg-[var(--velmora-dark-bg)]/50 rounded-lg hover:bg-[var(--velmora-dark-bg)]/70 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{getAssetIcon(item.type)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getActionBadge(item.action)}
                    <span className="text-white">{item.asset}</span>
                  </div>
                  <div className="text-sm text-[var(--velmora-violet)]">
                    {formatDate(item.date)} at {item.time}
                    {item.details && ` • ${item.details}`}
                  </div>
                </div>
              </div>
              
              {item.quantity && item.price && (
                <div className="text-right">
                  <div className="text-white">
                    {item.quantity} @ ${item.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-[var(--velmora-light-purple)]">
                    Total: ${item.total?.toLocaleString()}
                  </div>
                </div>
              )}
              
              <div className="text-right">
                <Badge 
                  className={`${
                    item.status === 'completed' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : item.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      : 'bg-[var(--velmora-violet)]/20 text-[var(--velmora-violet)] border-[var(--velmora-violet)]/30'
                  }`}
                >
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl text-[var(--velmora-light-purple)] mb-1">Export History</h3>
            <p className="text-[var(--velmora-violet)] text-sm">Download your activity history for records or tax purposes</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-[var(--velmora-purple)]/20 hover:bg-[var(--velmora-purple)]/40 text-[var(--velmora-purple)] border-[var(--velmora-purple)]/30">
              📄 Export PDF
            </Button>
            <Button className="bg-[var(--velmora-magenta)]/20 hover:bg-[var(--velmora-magenta)]/40 text-[var(--velmora-magenta)] border-[var(--velmora-magenta)]/30">
              📊 Export CSV
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}