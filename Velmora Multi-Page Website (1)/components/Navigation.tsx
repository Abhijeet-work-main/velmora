import React, { useState } from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  'Dashboard',
  'News Scraper',
  'Stock Prices',
  'Crypto Insights',
  'E-Commerce',
  'Custom Mood Playlist',
  'Share'
];

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-[var(--velmora-nav-bg)] border-b border-[var(--velmora-secondary)]/30 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="velmora-brand">
            <h1 className="text-4xl font-bold gradient-text px-6 py-2">
              Velmora
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {navigationItems.map((item) => (
              <button
                key={item}
                onClick={() => onPageChange(item)}
                className={`
                  glow-button relative px-4 py-2 rounded-lg transition-all duration-300 
                  border border-[var(--velmora-secondary)]/50 backdrop-blur-sm
                  ${currentPage === item 
                    ? 'rainbow-gradient text-white shadow-lg' 
                    : 'bg-[var(--velmora-background)] text-[var(--velmora-text)] hover:bg-[var(--velmora-primary)]/20'
                  }
                `}
              >
                <span className="relative z-10">{item}</span>
              </button>
            ))}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-[var(--velmora-secondary)]/50 text-[var(--velmora-text)] hover:bg-[var(--velmora-primary)]/20">
                <span className="text-lg">☰</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[var(--velmora-nav-bg)] border-[var(--velmora-secondary)]/30">
              <DropdownMenuItem 
                onClick={() => onPageChange('Profile')}
                className="cursor-pointer hover:bg-[var(--velmora-primary)]/20 text-[var(--velmora-text)]"
              >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback className="bg-[var(--velmora-primary)] text-white text-sm">U</AvatarFallback>
                </Avatar>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onPageChange('About Us')}
                className="cursor-pointer hover:bg-[var(--velmora-primary)]/20 text-[var(--velmora-text)]"
              >
                <span className="mr-2">ℹ️</span>
                About Us
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onPageChange('Reviews')}
                className="cursor-pointer hover:bg-[var(--velmora-primary)]/20 text-[var(--velmora-text)]"
              >
                <span className="mr-2">⭐</span>
                Reviews
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onPageChange('Settings')}
                className="cursor-pointer hover:bg-[var(--velmora-primary)]/20 text-[var(--velmora-text)]"
              >
                <span className="mr-2">⚙️</span>
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}