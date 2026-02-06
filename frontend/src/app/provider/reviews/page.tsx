"use client";

import { useState, useEffect } from "react";
import ReviewCard from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Star, Filter } from "lucide-react";

interface Review {
  _id: string;
  rating: number;
  review: string;
  images?: string[];
  response?: string;
  respondedAt?: string;
  createdAt: string;
  userId: {
    _id: string;
    fullName: string;
    profilePhoto?: string;
  };
  serviceId: {
    name: string;
  };
  bookingId: {
    bookingNumber: string;
    bookingDate: string;
  };
}

export default function ProviderReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [selectedRating]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const ratingQuery = selectedRating ? `?rating=${selectedRating}` : "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/provider/reviews${ratingQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}/response`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ response: replyText }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setReplyingTo(null);
        setReplyText("");
        fetchReviews();
      }
    } catch (error) {
      console.error("Error adding response:", error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-amber-500 text-amber-500"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const ratingFilters = [
    { value: null, label: "All" },
    { value: 5, label: "5 Stars" },
    { value: 4, label: "4 Stars" },
    { value: 3, label: "3 Stars" },
    { value: 2, label: "2 Stars" },
    { value: 1, label: "1 Star" },
  ];

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
          <div className="h-24 bg-gray-200 rounded mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reviews</h1>
        <p className="text-gray-600">Manage and respond to customer reviews</p>
      </div>

      {/* Rating Summary */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold mb-2">Overall Rating</h2>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="text-5xl font-bold">{averageRating}</div>
              <div>
                {renderStars(Math.round(averageRating))}
                <p className="text-sm text-gray-600 mt-1">
                  Based on {reviews.length} reviews
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Rating Distribution</h2>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{
                        width: `${reviews.length > 0 ? (distribution[rating as keyof typeof distribution] / reviews.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 w-8">
                    {distribution[rating as keyof typeof distribution]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="font-medium">Filter by:</span>
          {ratingFilters.map((filter) => (
            <Button
              key={filter.value || "all"}
              variant={selectedRating === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRating(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">No reviews found</h3>
            <p className="text-gray-600">
              {selectedRating
                ? "No reviews with this rating"
                : "You haven't received any reviews yet"}
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{review.serviceId?.name}</h3>
                    <p className="text-sm text-gray-500">
                      Booking #{review.bookingId?.bookingNumber} •{" "}
                      {new Date(review.bookingId?.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                  {renderStars(review.rating)}
                </div>
              </div>

              <ReviewCard
                review={review}
                currentUserRole="provider"
                onReply={!review.response ? () => setReplyingTo(review._id) : undefined}
              />

              {replyingTo === review._id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold mb-2">Add Your Response</h4>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your response to this review..."
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                  />
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => handleReply(review._id)}
                      disabled={!replyText.trim()}
                      size="sm"
                    >
                      Submit Response
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
