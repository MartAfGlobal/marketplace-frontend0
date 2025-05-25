"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft, MessageSquare, Image as ImageIcon, BarChart3, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Review {
  id: string;
  customerName: string;
  date: string;
  rating: number;
  comment: string;
  verified: boolean;
  images?: string[];
  video?: string;
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
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'photos' | 'charts'>('all');
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{type: 'image' | 'video', url: string, index: number, reviewId: string} | null>(null);

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

  const getFilteredReviews = () => {
    let filtered = reviews;
    
    // Filter by type first
    if (filterType === 'photos') {
      filtered = filtered.filter(review => 
        (review.images && review.images.length > 0) || review.video
      );
    }
    
    // Then filter by rating (only if not in photos mode)
    if (filterType !== 'photos' && selectedRating !== null) {
      filtered = filtered.filter(review => review.rating === selectedRating);
    }
    
    return filtered;
  };

  const filteredReviews = getFilteredReviews();

  const openMediaViewer = (type: 'image' | 'video', url: string, index: number, reviewId: string) => {
    setSelectedMedia({ type, url, index, reviewId });
    setMediaViewerOpen(true);
  };

  const closeMediaViewer = () => {
    setMediaViewerOpen(false);
    setSelectedMedia(null);
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (!selectedMedia) return;
    
    const currentReview = reviews.find(r => r.id === selectedMedia.reviewId);
    if (!currentReview) return;
    
    const allMedia = [
      ...(currentReview.images?.map(img => ({ type: 'image' as const, url: img })) || []),
      ...(currentReview.video ? [{ type: 'video' as const, url: currentReview.video }] : [])
    ];
    
    const currentIndex = selectedMedia.index;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex + 1 >= allMedia.length ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex - 1 < 0 ? allMedia.length - 1 : currentIndex - 1;
    }
    
    setSelectedMedia({
      ...allMedia[newIndex],
      index: newIndex,
      reviewId: selectedMedia.reviewId
    });
  };

  // Show only photos and videos when "Photos" filter is active
  const renderPhotosOnlyView = () => {
    const reviewsWithMedia = reviews.filter(review => 
      (review.images && review.images.length > 0) || review.video
    );

    return (
      <div className="grid grid-cols-3 gap-2">
        {reviewsWithMedia.map((review) => {
          const allMedia = [
            ...(review.images?.map(img => ({ type: 'image' as const, url: img })) || []),
            ...(review.video ? [{ type: 'video' as const, url: review.video }] : [])
          ];
          
          return allMedia.map((media, index) => (
            <div 
              key={`${review.id}-${index}`}
              className="aspect-square relative cursor-pointer rounded-lg overflow-hidden"
              onClick={() => openMediaViewer(media.type, media.url, index, review.id)}
            >
              {media.type === 'image' ? (
                <Image
                  src={media.url}
                  alt={`Review media ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                />
              ) : (
                <div className="relative w-full h-full bg-black">
                  <video
                    src={media.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
            </div>
          ));
        })}
      </div>
    );
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-screen p-0">
          <DrawerHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 hover:bg-gray-100"
                onClick={() => onOpenChange(false)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <DrawerTitle className="text-lg font-semibold">
                Ratings & Reviews
              </DrawerTitle>
            </div>
          </DrawerHeader>

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
                variant={filterType === 'photos' ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${
                  filterType === 'photos' 
                    ? 'bg-orange-500 hover:bg-orange-600 border-orange-500' 
                    : 'border-gray-300'
                }`}
                onClick={() => setFilterType('photos')}
              >
                <ImageIcon className="w-4 h-4" />
                Photos
              </Button>
              <Button
                variant={filterType === 'charts' ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${
                  filterType === 'charts' 
                    ? 'bg-orange-500 hover:bg-orange-600 border-orange-500' 
                    : 'border-gray-300'
                }`}
                onClick={() => setFilterType('charts')}
              >
                <BarChart3 className="w-4 h-4" />
                Charts
              </Button>
            </div>

            {/* Rating Filter Pills */}
            {filterType !== 'photos' && (
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
            )}

            {/* Content based on filter type */}
            {filterType === 'photos' ? (
              renderPhotosOnlyView()
            ) : filterType === 'charts' ? (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Charts view coming soon</p>
              </div>
            ) : (
              /* Reviews List */
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
                    <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
                    
                    {/* Review Media */}
                    {((review.images && review.images.length > 0) || review.video) && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {review.images?.map((image, index) => (
                          <div 
                            key={index}
                            className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => openMediaViewer('image', image, index, review.id)}
                          >
                            <Image
                              src={image}
                              alt={`Review image ${index + 1}`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        ))}
                        {review.video && (
                          <div 
                            className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer relative bg-black"
                            onClick={() => openMediaViewer('video', review.video!, (review.images?.length || 0), review.id)}
                          >
                            <video
                              src={review.video}
                              className="w-full h-full object-cover"
                              muted
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
        </DrawerContent>
      </Drawer>

      {/* Media Viewer Dialog */}
      <Dialog open={mediaViewerOpen} onOpenChange={setMediaViewerOpen}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black border-none">
          <DialogHeader className="absolute top-4 left-4 z-10">
            <DialogTitle className="text-white">Review Media</DialogTitle>
          </DialogHeader>
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
            onClick={() => setMediaViewerOpen(false)}
          >
            <X className="w-6 h-6" />
          </Button>
          
          {selectedMedia && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
                onClick={() => navigateMedia('prev')}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
                onClick={() => navigateMedia('next')}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              {/* Media Content */}
              <div className="w-full h-full flex items-center justify-center p-4">
                {selectedMedia.type === 'image' ? (
                  <Image
                    src={selectedMedia.url}
                    alt="Review image"
                    width={800}
                    height={600}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <video
                    src={selectedMedia.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-full rounded-lg"
                  />
                )}
              </div>

              {/* Media Counter */}
              {(() => {
                const currentReview = reviews.find(r => r.id === selectedMedia.reviewId);
                if (!currentReview) return null;
                const totalMedia = (currentReview.images?.length || 0) + (currentReview.video ? 1 : 0);
                return (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedMedia.index + 1} of {totalMedia}
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 