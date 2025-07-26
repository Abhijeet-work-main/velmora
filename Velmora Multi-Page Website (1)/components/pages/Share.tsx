import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';

export default function Share() {
  const [message, setMessage] = useState('');

  const socialPlatforms = [
    { name: 'Twitter', icon: '🐦', color: 'bg-blue-500' },
    { name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' },
    { name: 'Facebook', icon: '📘', color: 'bg-blue-600' },
    { name: 'Discord', icon: '💬', color: 'bg-indigo-600' },
    { name: 'Telegram', icon: '✈️', color: 'bg-sky-500' },
    { name: 'WhatsApp', icon: '💚', color: 'bg-green-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl mb-2 bg-gradient-to-r from-[var(--velmora-purple)] to-[var(--velmora-magenta)] bg-clip-text text-transparent">
          Share
        </h1>
        <p className="text-black">
          Share your insights, portfolio performance, and market analysis with others.
        </p>
      </div>

      {/* Content Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border border-gray-200">
          <h3 className="text-xl mb-4 text-black">Customize Your Share</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-black mb-2">Title</label>
              <Input
                placeholder="Enter a title for your share..."
                className="border-gray-300 focus:border-[var(--velmora-purple)] focus:ring-[var(--velmora-purple)]"
              />
            </div>
            <div>
              <label className="block text-sm text-black mb-2">Message</label>
              <Textarea
                placeholder="Add a personal message or insight..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border-gray-300 focus:border-[var(--velmora-purple)] focus:ring-[var(--velmora-purple)] min-h-[120px]"
              />
            </div>
            <div className="flex gap-2">
              <Badge className="bg-[var(--velmora-purple)]/20 text-[var(--velmora-purple)] border-[var(--velmora-purple)]/30">
                #Velmora
              </Badge>
              <Badge className="bg-[var(--velmora-magenta)]/20 text-[var(--velmora-magenta)] border-[var(--velmora-magenta)]/30">
                #Investing
              </Badge>
              <Badge className="bg-[var(--velmora-light-purple)]/20 text-[var(--velmora-light-purple)] border-[var(--velmora-light-purple)]/30">
                #FinTech
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200">
          <h3 className="text-xl mb-4 text-black">Preview</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--velmora-purple)] to-[var(--velmora-magenta)] rounded-full flex items-center justify-center text-white">
                V
              </div>
              <div>
                <div className="text-black">Velmora User</div>
                <div className="text-sm text-gray-600">@velmora_user</div>
              </div>
            </div>
            <div className="text-black mb-3">
              {message || "Check out my latest portfolio performance on Velmora! 📈"}
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
              <div className="text-sm text-gray-600 mb-2">Portfolio Performance</div>
              <div className="text-2xl text-green-600">+12.5%</div>
              <div className="text-sm text-gray-600">Last 30 days</div>
            </div>
            <div className="flex gap-2 text-sm text-gray-600">
              <span>2:30 PM</span>
              <span>•</span>
              <span>Jan 17, 2025</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Social Platforms */}
      <Card className="p-6 bg-white border border-gray-200">
        <h3 className="text-xl mb-4 text-black">Share On</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {socialPlatforms.map((platform) => (
            <Button
              key={platform.name}
              className={`${platform.color} hover:opacity-80 text-white border-0 h-auto py-4 flex-col gap-2`}
            >
              <span className="text-2xl">{platform.icon}</span>
              <span className="text-sm">{platform.name}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Share Settings */}
      <Card className="p-6 bg-white border border-gray-200">
        <h3 className="text-xl mb-4 text-black">Share Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="text-black">Include Performance Data</div>
              <div className="text-sm text-gray-600">Share your portfolio performance metrics</div>
            </div>
            <div className="w-12 h-6 bg-[var(--velmora-purple)] rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="text-black">Anonymous Sharing</div>
              <div className="text-sm text-gray-600">Hide your identity when sharing</div>
            </div>
            <div className="w-12 h-6 bg-gray-300 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="text-black">Auto-generate Hashtags</div>
              <div className="text-sm text-gray-600">Automatically add relevant hashtags</div>
            </div>
            <div className="w-12 h-6 bg-[var(--velmora-purple)] rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Share Button */}
      <div className="flex justify-center">
        <Button className="bg-gradient-to-r from-[var(--velmora-purple)] to-[var(--velmora-magenta)] hover:from-[var(--velmora-purple)]/80 hover:to-[var(--velmora-magenta)]/80 text-white px-8 py-3 text-lg">
          Share Now 🚀
        </Button>
      </div>
    </div>
  );
}