import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    newsUpdates: true,
    portfolioSummary: false,
    marketAnalysis: true,
    emailDigest: true,
  });

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl mb-2 bg-gradient-to-r from-[var(--velmora-purple)] to-[var(--velmora-magenta)] bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-[var(--velmora-light-purple)]">
          Customize your Velmora experience and manage your preferences.
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30">
        <h3 className="text-xl mb-4 text-[var(--velmora-light-purple)]">Profile Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--velmora-light-purple)] mb-2">Display Name</label>
              <Input
                defaultValue="Velmora User"
                className="bg-[var(--velmora-dark-bg)]/50 border-[var(--velmora-purple)]/30 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--velmora-light-purple)] mb-2">Email</label>
              <Input
                defaultValue="user@velmora.com"
                type="email"
                className="bg-[var(--velmora-dark-bg)]/50 border-[var(--velmora-purple)]/30 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--velmora-light-purple)] mb-2">Time Zone</label>
              <Select defaultValue="utc-5">
                <SelectTrigger className="bg-[var(--velmora-dark-bg)]/50 border-[var(--velmora-purple)]/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                  <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                  <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                  <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                  <SelectItem value="utc+0">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--velmora-light-purple)] mb-2">Currency</label>
              <Select defaultValue="usd">
                <SelectTrigger className="bg-[var(--velmora-dark-bg)]/50 border-[var(--velmora-purple)]/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD - US Dollar</SelectItem>
                  <SelectItem value="eur">EUR - Euro</SelectItem>
                  <SelectItem value="gbp">GBP - British Pound</SelectItem>
                  <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-[var(--velmora-light-purple)] mb-2">Language</label>
              <Select defaultValue="en">
                <SelectTrigger className="bg-[var(--velmora-dark-bg)]/50 border-[var(--velmora-purple)]/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-[var(--velmora-light-purple)] mb-2">Date Format</label>
              <Select defaultValue="mdy">
                <SelectTrigger className="bg-[var(--velmora-dark-bg)]/50 border-[var(--velmora-purple)]/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Button className="bg-[var(--velmora-purple)] hover:bg-[var(--velmora-purple)]/80 text-white">
            Save Profile Changes
          </Button>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30">
        <h3 className="text-xl mb-4 text-[var(--velmora-light-purple)]">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[var(--velmora-dark-bg)]/50 rounded-lg">
            <div>
              <div className="text-white">Price Alerts</div>
              <div className="text-sm text-[var(--velmora-violet)]">Get notified when your watchlist items hit target prices</div>
            </div>
            <Switch
              checked={notifications.priceAlerts}
              onCheckedChange={() => toggleNotification('priceAlerts')}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-[var(--velmora-dark-bg)]/50 rounded-lg">
            <div>
              <div className="text-white">News Updates</div>
              <div className="text-sm text-[var(--velmora-violet)]">Receive breaking news and market updates</div>
            </div>
            <Switch
              checked={notifications.newsUpdates}
              onCheckedChange={() => toggleNotification('newsUpdates')}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-[var(--velmora-dark-bg)]/50 rounded-lg">
            <div>
              <div className="text-white">Portfolio Summary</div>
              <div className="text-sm text-[var(--velmora-violet)]">Daily portfolio performance summaries</div>
            </div>
            <Switch
              checked={notifications.portfolioSummary}
              onCheckedChange={() => toggleNotification('portfolioSummary')}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-[var(--velmora-dark-bg)]/50 rounded-lg">
            <div>
              <div className="text-white">Market Analysis</div>
              <div className="text-sm text-[var(--velmora-violet)]">Weekly market insights and analysis reports</div>
            </div>
            <Switch
              checked={notifications.marketAnalysis}
              onCheckedChange={() => toggleNotification('marketAnalysis')}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-[var(--velmora-dark-bg)]/50 rounded-lg">
            <div>
              <div className="text-white">Email Digest</div>
              <div className="text-sm text-[var(--velmora-violet)]">Weekly email digest of your activity</div>
            </div>
            <Switch
              checked={notifications.emailDigest}
              onCheckedChange={() => toggleNotification('emailDigest')}
            />
          </div>
        </div>
      </Card>

      {/* Display Settings */}
      <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30">
        <h3 className="text-xl mb-4 text-[var(--velmora-light-purple)]">Display & Appearance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--velmora-light-purple)] mb-2">Theme</label>
              <Select defaultValue="dark">
                <SelectTrigger className="bg-[var(--velmora-dark-bg)]/50 border-[var(--velmora-purple)]/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark (Current)</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-[var(--velmora-light-purple)] mb-2">Chart Style</label>
              <Select defaultValue="candlestick">
                <SelectTrigger className="bg-[var(--velmora-dark-bg)]/50 border-[var(--velmora-purple)]/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="candlestick">Candlestick</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--velmora-light-purple)] mb-2">Default Dashboard</label>
              <Select defaultValue="overview">
                <SelectTrigger className="bg-[var(--velmora-dark-bg)]/50 border-[var(--velmora-purple)]/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="watchlist">Watchlist</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-[var(--velmora-light-purple)] mb-2">Sidebar Position</label>
              <Select defaultValue="left">
                <SelectTrigger className="bg-[var(--velmora-dark-bg)]/50 border-[var(--velmora-purple)]/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6 bg-[var(--velmora-card-bg)] border-[var(--velmora-purple)]/30">
        <h3 className="text-xl mb-4 text-[var(--velmora-light-purple)]">Security & Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[var(--velmora-dark-bg)]/50 rounded-lg">
            <div>
              <div className="text-white">Two-Factor Authentication</div>
              <div className="text-sm text-[var(--velmora-violet)]">Add an extra layer of security to your account</div>
            </div>
            <Button className="bg-[var(--velmora-magenta)]/20 hover:bg-[var(--velmora-magenta)]/40 text-[var(--velmora-magenta)] border-[var(--velmora-magenta)]/30">
              Enable 2FA
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-[var(--velmora-dark-bg)]/50 rounded-lg">
            <div>
              <div className="text-white">Login Sessions</div>
              <div className="text-sm text-[var(--velmora-violet)]">Manage active sessions across devices</div>
            </div>
            <Button className="bg-[var(--velmora-purple)]/20 hover:bg-[var(--velmora-purple)]/40 text-[var(--velmora-purple)] border-[var(--velmora-purple)]/30">
              View Sessions
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-[var(--velmora-dark-bg)]/50 rounded-lg">
            <div>
              <div className="text-white">Data Privacy</div>
              <div className="text-sm text-[var(--velmora-violet)]">Control how your data is used and shared</div>
            </div>
            <Button className="bg-[var(--velmora-light-purple)]/20 hover:bg-[var(--velmora-light-purple)]/40 text-[var(--velmora-light-purple)] border-[var(--velmora-light-purple)]/30">
              Privacy Settings
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 bg-red-900/10 border-red-500/30">
        <h3 className="text-xl mb-4 text-red-400">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-500/30">
            <div>
              <div className="text-white">Reset All Settings</div>
              <div className="text-sm text-red-300">Restore all settings to their default values</div>
            </div>
            <Button className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border-red-500/30">
              Reset Settings
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-500/30">
            <div>
              <div className="text-white">Delete Account</div>
              <div className="text-sm text-red-300">Permanently delete your account and all data</div>
            </div>
            <Button className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border-red-500/30">
              Delete Account
            </Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button className="bg-gradient-to-r from-[var(--velmora-purple)] to-[var(--velmora-magenta)] hover:from-[var(--velmora-purple)]/80 hover:to-[var(--velmora-magenta)]/80 text-white px-8 py-3 text-lg">
          Save All Changes
        </Button>
      </div>
    </div>
  );
}