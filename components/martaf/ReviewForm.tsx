"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { apiService } from "@/lib/api";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

export function ReviewForm({ productId, onReviewSubmitted, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.createReview(productId, {
        rating,
        comment: comment.trim()
      });
      
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      onReviewSubmitted();
    } catch (error) {
      console.error("Failed to submit review:", error);
      const message = error instanceof Error ? error.message : "Failed to submit review";
      
      if (message.includes('Backend authentication configuration issue')) {
        toast.error("Review system is temporarily unavailable. Please try again later.");
      } else {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Rating *</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 transition-colors"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        {/* Review Comment */}
        <div>
          <label className="block text-sm font-medium mb-2">Review *</label>
          <Textarea
            value={comment}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="min-h-[100px] resize-none"
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/1000 characters
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0 || !comment.trim()}
            className="flex-1"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </div>
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
} 