import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';

export default function Profile() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl mb-2 bg-gradient-to-r from-[var(--velmora-purple)] to-[var(--velmora-magenta)] bg-clip-text text-transparent">
          Profile
        </h1>
        <p className="text-black">
          Manage your profile information and preferences.
        </p>
      </div>

      {/* Profile Header */}
      <Card className="p-6 bg-white border border-gray-200">
        <div className="flex items-center space-x-6">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="bg-[var(--velmora-purple)] text-white text-3xl">
              VU
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-3xl text-black mb-2">Velmora User</h2>
            <div className="flex items-center space-x-2 mb-4">
              <Badge className="bg-[var(--velmora-purple)]/20 text-[var(--velmora-purple)] border-[var(--velmora-purple)]/30">
                Premium Member
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-300">
                Verified
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Member Since:</span>
                <div className="text-black">January 2024</div>
              </div>
              <div>
                <span className="text-gray-600">Total Trades:</span>
                <div className="text-black">247</div>
              </div>
              <div>
                <span className="text-gray-600">Portfolio Value:</span>
                <div className="text-black">$45,327.89</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Information */}
      <Card className="p-6 bg-white border border-gray-200">
        <h3 className="text-2xl mb-4 text-black">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-black mb-2">Full Name</label>
            <Input
              defaultValue="Velmora User"
              className="border-gray-300 focus:border-[var(--velmora-purple)] focus:ring-[var(--velmora-purple)]"
            />
          </div>
          <div>
            <label className="block text-black mb-2">Email</label>
            <Input
              defaultValue="user@velmora.com"
              type="email"
              className="border-gray-300 focus:border-[var(--velmora-purple)] focus:ring-[var(--velmora-purple)]"
            />
          </div>
          <div>
            <label className="block text-black mb-2">Phone</label>
            <Input
              defaultValue="+1 (555) 123-4567"
              className="border-gray-300 focus:border-[var(--velmora-purple)] focus:ring-[var(--velmora-purple)]"
            />
          </div>
          <div>
            <label className="block text-black mb-2">Location</label>
            <Input
              defaultValue="New York, NY"
              className="border-gray-300 focus:border-[var(--velmora-purple)] focus:ring-[var(--velmora-purple)]"
            />
          </div>
        </div>
        <div className="mt-6">
          <Button className="bg-[var(--velmora-purple)] hover:bg-[var(--velmora-purple)]/80 text-white">
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Account Statistics */}
      <Card className="p-6 bg-white border border-gray-200">
        <h3 className="text-2xl mb-4 text-black">Account Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-xl text-black mb-1">247</div>
            <div className="text-gray-600 text-sm">Total Trades</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-xl text-green-600 mb-1">+12.5%</div>
            <div className="text-gray-600 text-sm">Overall Return</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">📰</div>
            <div className="text-xl text-black mb-1">1,459</div>
            <div className="text-gray-600 text-sm">News Articles Read</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">🎵</div>
            <div className="text-xl text-black mb-1">89</div>
            <div className="text-gray-600 text-sm">Playlists Created</div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6 bg-white border border-gray-200">
        <h3 className="text-2xl mb-4 text-black">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Bought AAPL', time: '2 hours ago', amount: '$1,556.00' },
            { action: 'Created Happy playlist', time: '1 day ago', amount: '12 songs' },
            { action: 'Sold BTC', time: '3 days ago', amount: '$23,400.00' },
            { action: 'Shared portfolio performance', time: '5 days ago', amount: '+15.2%' },
            { action: 'Read market analysis', time: '1 week ago', amount: '8 articles' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[var(--velmora-purple)]/20 rounded-full flex items-center justify-center">
                  <span className="text-[var(--velmora-purple)]">●</span>
                </div>
                <div>
                  <div className="text-black">{activity.action}</div>
                  <div className="text-gray-600 text-sm">{activity.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-black">{activity.amount}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}