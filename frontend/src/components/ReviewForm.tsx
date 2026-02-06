"use client";

import { useState } from "react";
import { Star, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ReviewFormProps {
  bookingId?: string;
  serviceId?: string;
  initialData?: {
    _id?: string;
    rating: number;
    review: string;
    images?: string[];
  };
  onSuccess: () => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

export default function ReviewForm({
  bookingId,
  serviceId,
  initialData,
  onSuccess,
  onCancel,
  isEdit = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState(initialData?.review || "");
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // For now, just show placeholder - actual image upload would need backend integration
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real implementation, you would upload these to a server
      // For now, we'll just add placeholder URLs
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages].slice(0, 4)); // Max 4 images
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      setError("Please write a review");
      return;
    }

    if (!isEdit && !bookingId) {
      setError("Booking ID is required");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const endpoint = isEdit
        ? `${API_URL}/reviews/${initialData?._id || ""}`
        : `${API_URL}/reviews`;

      const method = isEdit ? "PUT" : "POST";

      const body: any = {
        rating,
        review: reviewText,
        images,
      };

      if (!isEdit) {
        body.bookingId = bookingId;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`h-8 w-8 sm:h-10 sm:w-10 ${
                star <= (hoverRating || rating)
                  ? "fill-amber-500 text-amber-500"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Rating selector */}
      <div>
        <Label className="text-base mb-3 block">
          Rate your experience <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center gap-3">
          {renderStars()}
          {rating > 0 && (
            <span className="text-sm text-gray-600">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </span>
          )}
        </div>
      </div>

      {/* Review textarea */}
      <div>
        <Label htmlFor="review" className="text-base mb-2 block">
          Write your review <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="review"
          placeholder="Share your experience with this service..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="min-h-[120px] resize-none"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {reviewText.length} / 1000 characters
        </p>
      </div>

      {/* Image upload */}
      <div>
        <Label htmlFor="images" className="text-base mb-2 block">
          Add photos (optional)
        </Label>
        
        {/* Image preview grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-3">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length < 4 && (
          <div className="flex items-center gap-2">
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <Label
              htmlFor="images"
              className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span className="text-sm">Upload Photos</span>
            </Label>
            <span className="text-xs text-gray-500">
              Max 4 images (JPG, PNG)
            </span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 sm:flex-none"
        >
          {loading ? "Submitting..." : isEdit ? "Update Review" : "Submit Review"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
