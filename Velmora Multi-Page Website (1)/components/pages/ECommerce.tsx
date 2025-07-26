import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const productData = {
  'iphone': {
    name: 'iPhone 15 Pro',
    price: '$999.00',
    originalPrice: '$1199.00',
    discount: '17% OFF',
    rating: 4.8,
    reviews: 2847,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop',
    features: ['128GB Storage', 'A17 Pro Chip', 'Pro Camera System', '1 Year Warranty'],
    availability: 'In Stock',
    shipping: 'Free Shipping'
  },
  'laptop': {
    name: 'MacBook Pro 14"',
    price: '$1999.00',
    originalPrice: '$2399.00',
    discount: '17% OFF',
    rating: 4.9,
    reviews: 1523,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop',
    features: ['M3 Pro Chip', '16GB RAM', '512GB SSD', 'Liquid Retina XDR'],
    availability: 'Limited Stock',
    shipping: 'Free Shipping'
  },
  'headphones': {
    name: 'AirPods Pro 2',
    price: '$249.00',
    originalPrice: '$299.00',
    discount: '17% OFF',
    rating: 4.7,
    reviews: 4521,
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop',
    features: ['Active Noise Cancellation', 'Spatial Audio', 'MagSafe Charging', 'Up to 30 Hours Battery'],
    availability: 'In Stock',
    shipping: 'Free Shipping'
  },
  'watch': {
    name: 'Apple Watch Series 9',
    price: '$399.00',
    originalPrice: '$449.00',
    discount: '11% OFF',
    rating: 4.6,
    reviews: 3672,
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop',
    features: ['Always-On Display', 'Health Monitoring', 'GPS + Cellular', 'Water Resistant'],
    availability: 'In Stock',
    shipping: 'Free Shipping'
  },
  'tablet': {
    name: 'iPad Pro 12.9"',
    price: '$1099.00',
    originalPrice: '$1299.00',
    discount: '15% OFF',
    rating: 4.8,
    reviews: 2156,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    features: ['M2 Chip', '128GB Storage', 'Liquid Retina XDR', 'Apple Pencil Compatible'],
    availability: 'In Stock',
    shipping: 'Free Shipping'
  }
};

const trendingProducts = [
  { name: 'iPhone 15 Pro', price: '$999', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=150&fit=crop' },
  { name: 'MacBook Pro', price: '$1999', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=150&fit=crop' },
  { name: 'AirPods Pro', price: '$249', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=200&h=150&fit=crop' },
  { name: 'Apple Watch', price: '$399', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200&h=150&fit=crop' },
];

export default function ECommerce() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const result = productData[searchTerm.toLowerCase() as keyof typeof productData] || null;
      setSearchResult(result);
      setIsSearching(false);
    }, 1000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl mb-2 gradient-text">
          E-Commerce
        </h1>
        <p className="text-[var(--velmora-text)]">
          Search for products and get the best prices across multiple platforms.
        </p>
      </div>

      {/* Search Section */}
      <Card className="p-6 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search for products (try: iPhone, laptop, headphones, watch, tablet)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="border-[var(--velmora-secondary)]/30 focus:border-[var(--velmora-primary)] focus:ring-[var(--velmora-primary)] text-lg py-3"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="ripple-effect bg-[var(--velmora-primary)] hover:bg-[var(--velmora-primary)]/80 text-white px-8 py-3 text-lg"
          >
            {isSearching ? (
              <span className="loading-dots">Searching</span>
            ) : (
              '🔍 Search'
            )}
          </Button>
        </div>
      </Card>

      {/* Search Results */}
      {searchResult && (
        <Card className="p-6 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={searchResult.image}
                  alt={searchResult.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={searchResult.image}
                      alt={`${searchResult.name} view ${i + 1}`}
                      className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl text-[var(--velmora-text)] mb-2">{searchResult.name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{renderStars(searchResult.rating)}</div>
                  <span className="text-[var(--velmora-text)]">({searchResult.reviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl text-[var(--velmora-primary)] stat-counter">{searchResult.price}</span>
                  <span className="text-xl text-gray-500 line-through">{searchResult.originalPrice}</span>
                  <Badge className="bg-[var(--velmora-primary)]/20 text-[var(--velmora-primary)] border-[var(--velmora-primary)]/30">
                    {searchResult.discount}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    {searchResult.availability}
                  </Badge>
                  <span className="text-[var(--velmora-secondary)]">{searchResult.shipping}</span>
                </div>
              </div>

              <div>
                <h4 className="text-lg text-[var(--velmora-text)] mb-3">Key Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {searchResult.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--velmora-primary)] rounded-full"></div>
                      <span className="text-[var(--velmora-text)] text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 bg-[var(--velmora-primary)] hover:bg-[var(--velmora-primary)]/80 text-white py-3 text-lg ripple-effect">
                  🛒 Add to Cart
                </Button>
                <Button variant="outline" className="flex-1 border-[var(--velmora-secondary)] text-[var(--velmora-secondary)] hover:bg-[var(--velmora-secondary)]/10 py-3 text-lg">
                  💝 Add to Wishlist
                </Button>
              </div>

              <div className="bg-[var(--velmora-accent)]/20 p-4 rounded-lg">
                <h5 className="text-[var(--velmora-text)] mb-2">💳 Payment Options</h5>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="border-[var(--velmora-secondary)]/30 text-[var(--velmora-text)]">Credit Card</Badge>
                  <Badge variant="outline" className="border-[var(--velmora-secondary)]/30 text-[var(--velmora-text)]">PayPal</Badge>
                  <Badge variant="outline" className="border-[var(--velmora-secondary)]/30 text-[var(--velmora-text)]">Apple Pay</Badge>
                  <Badge variant="outline" className="border-[var(--velmora-secondary)]/30 text-[var(--velmora-text)]">Buy Now Pay Later</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* No Results */}
      {searchTerm && searchResult === null && !isSearching && (
        <Card className="p-12 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl mb-2 text-[var(--velmora-text)]">Product not found</h3>
          <p className="text-[var(--velmora-text)]/70">Try searching for: iPhone, laptop, headphones, watch, or tablet.</p>
        </Card>
      )}

      {/* Trending Products */}
      {!searchResult && !isSearching && (
        <Card className="p-6 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30">
          <h3 className="text-2xl mb-6 text-[var(--velmora-text)]">🔥 Trending Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden border border-[var(--velmora-secondary)]/20">
                <div className="aspect-video bg-gray-100">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-[var(--velmora-text)] mb-2">{product.name}</h4>
                  <div className="text-[var(--velmora-primary)] text-lg">{product.price}</div>
                  <Button 
                    size="sm" 
                    className="w-full mt-3 bg-[var(--velmora-secondary)] hover:bg-[var(--velmora-secondary)]/80 text-white"
                    onClick={() => {
                      setSearchTerm(product.name.split(' ')[0].toLowerCase());
                      handleSearch();
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30 text-center">
          <div className="text-4xl mb-4">🚚</div>
          <h4 className="text-lg text-[var(--velmora-text)] mb-2">Free Shipping</h4>
          <p className="text-[var(--velmora-text)]/70 text-sm">Free shipping on orders over $50</p>
        </Card>
        <Card className="p-6 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h4 className="text-lg text-[var(--velmora-text)] mb-2">Secure Payment</h4>
          <p className="text-[var(--velmora-text)]/70 text-sm">100% secure payment processing</p>
        </Card>
        <Card className="p-6 bg-[var(--velmora-background)] border border-[var(--velmora-secondary)]/30 text-center">
          <div className="text-4xl mb-4">↩️</div>
          <h4 className="text-lg text-[var(--velmora-text)] mb-2">Easy Returns</h4>
          <p className="text-[var(--velmora-text)]/70 text-sm">30-day return policy</p>
        </Card>
      </div>
    </div>
  );
}