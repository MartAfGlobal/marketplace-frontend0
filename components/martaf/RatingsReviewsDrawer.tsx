"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft, MessageSquare, Image as ImageIcon, BarChart3 } from "lucide-react";

interface Review {
  id: string;
  customerName: string;
  date: string;
  rating: number;
  comment: string;
  verified: boolean;
}

interface RatingsReviewsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  reviews: Review[];
}

export function RatingsReviewsDrawer({
  open,
  onOpenChange,
  averageRating,
  totalReviews,
  ratingBreakdown,
  reviews
}: RatingsReviewsDrawerProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(5);
  const [filterType, setFilterType] = useState<'all' | 'photos' | 'charts'>('all');

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingBarWidth = (count: number) => {
    const maxCount = Math.max(...Object.values(ratingBreakdown));
    return (count / maxCount) * 100;
  };

  const filteredReviews = selectedRating 
    ? reviews.filter(review => review.rating === selectedRating)
    : reviews;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-screen p-0">
        <SheetHeader className="border-b p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 hover:bg-gray-100"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <SheetTitle className="text-lg font-semibold">
              Ratings & Reviews
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Rating Summary */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold">{averageRating}/5</div>
              <div className="flex-1">
                <div className="flex mb-1">{renderStars(Math.floor(averageRating))}</div>
                <div className="text-sm text-gray-600">Based on {totalReviews} reviews</div>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-2">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-400 h-2 rounded-full transition-all"
                      style={{ width: `${getRatingBarWidth(ratingBreakdown[rating as keyof typeof ratingBreakdown])}%` }}
                    />
                  </div>
                  <span className="text-sm w-4 text-right">
                    {ratingBreakdown[rating as keyof typeof ratingBreakdown]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={filterType === 'all' ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-2 ${
                filterType === 'all' 
                  ? 'bg-orange-500 hover:bg-orange-600 border-orange-500' 
                  : 'border-orange-500 text-orange-500'
              }`}
              onClick={() => setFilterType('all')}
            >
              <MessageSquare className="w-4 h-4" />
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-gray-300"
              onClick={() => setFilterType('photos')}
            >
              <ImageIcon className="w-4 h-4" />
              Photos
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-gray-300"
              onClick={() => setFilterType('charts')}
            >
              <BarChart3 className="w-4 h-4" />
              Charts
            </Button>
          </div>

          {/* Rating Filter Pills */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant={selectedRating === null ? "default" : "outline"}
              size="sm"
              className={selectedRating === null ? "bg-orange-500 hover:bg-orange-600" : ""}
              onClick={() => setSelectedRating(null)}
            >
              All
            </Button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={selectedRating === rating ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-1 ${
                  selectedRating === rating ? "bg-orange-500 hover:bg-orange-600" : ""
                }`}
                onClick={() => setSelectedRating(rating)}
              >
                {rating}
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </Button>
            ))}
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium">{review.customerName}</div>
                  <div className="text-sm text-gray-500">{review.date}</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                  {review.verified && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      Verified Purchase
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="border-t p-4 bg-white">
          <div className="flex gap-3">
            <div className="relative">
              <Button variant="outline" size="sm" className="p-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
                </svg>
              </Button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                24
              </span>
            </div>
            <Button variant="outline" className="flex-1">
              Add to cart
            </Button>
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
              Buy now
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 