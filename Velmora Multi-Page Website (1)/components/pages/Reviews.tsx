import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';

const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: '2 days ago',
    comment: 'Velmora has completely transformed how I track my investments. The interface is intuitive and the insights are incredibly valuable.',
    verified: true
  },
  {
    id: 2,
    name: 'Michael Chen',
    rating: 4,
    date: '1 week ago',
    comment: 'Great platform for stock analysis and news aggregation. The mood playlist feature is a nice touch!',
    verified: true
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    rating: 5,
    date: '2 weeks ago',
    comment: 'The crypto insights are spot on. I\'ve made better trading decisions since using Velmora.',
    verified: false
  },
  {
    id: 4,
    name: 'David Wilson',
    rating: 4,
    date: '3 weeks ago',
    comment: 'Excellent news scraper functionality. Keeps me updated on all market movements in real-time.',
    verified: true
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    rating: 5,
    date: '1 month ago',
    comment: 'The dashboard is clean and informative. Love the purple theme and smooth user experience.',
    verified: true
  }
];

export default function Reviews() {
  const [newReview, setNewReview] = useState('');
  const [userRating, setUserRating] = useState(5);

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-2xl cursor-pointer transition-colors ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        onClick={interactive ? () => setUserRating(i + 1) : undefined}
      >
        ⭐
      </span>
    ));
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl mb-2 bg-gradient-to-r from-[var(--velmora-purple)] to-[var(--velmora-magenta)] bg-clip-text text-transparent">
          Reviews
        </h1>
        <p className="text-black">
          See what our users are saying about Velmora and share your own experience.
        </p>
      </div>

      {/* Overall Rating */}
      <Card className="p-6 bg-white border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <div className="text-4xl text-black mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-gray-600 text-sm">Based on {reviews.length} reviews</div>
          </div>
          <div className="flex-1 max-w-md ml-8">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(r => r.rating === rating).length;
              const percentage = (count / reviews.length) * 100;
              return (
                <div key={rating} className="flex items-center mb-2">
                  <span className="text-black w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                    <div 
                      className="bg-[var(--velmora-purple)] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-600 text-sm w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Write a Review */}
      <Card className="p-6 bg-white border border-gray-200">
        <h3 className="text-2xl mb-4 text-black">Write a Review</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-black mb-2">Your Rating</label>
            <div className="flex space-x-1">
              {renderStars(userRating, true)}
            </div>
          </div>
          <div>
            <label className="block text-black mb-2">Your Review</label>
            <Textarea
              placeholder="Share your experience with Velmora..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="min-h-[120px] border-gray-300 focus:border-[var(--velmora-purple)] focus:ring-[var(--velmora-purple)]"
            />
          </div>
          <Button className="bg-[var(--velmora-purple)] hover:bg-[var(--velmora-purple)]/80 text-white">
            Submit Review
          </Button>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6 bg-white border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[var(--velmora-purple)] text-white">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-black font-medium">{review.name}</span>
                    {review.verified && (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-gray-500 text-sm">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-black leading-relaxed">{review.comment}</p>
          </Card>
        ))}
      </div>

      {/* Review Stats */}
      <Card className="p-6 bg-white border border-gray-200">
        <h3 className="text-2xl mb-4 text-black">Review Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-xl text-black mb-1">96%</div>
            <div className="text-gray-600 text-sm">Positive Reviews</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">💬</div>
            <div className="text-xl text-black mb-1">1,247</div>
            <div className="text-gray-600 text-sm">Total Reviews</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-xl text-black mb-1">4.2</div>
            <div className="text-gray-600 text-sm">Average Rating</div>
          </div>
        </div>
      </Card>
    </div>
  );
}