"use client";

import { Star, Edit2, Trash2, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ReviewCardProps {
  review: {
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
  };
  currentUserId?: string;
  currentUserRole?: string;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  onReply?: (reviewId: string) => void;
}

export default function ReviewCard({
  review,
  currentUserId,
  currentUserRole,
  onEdit,
  onDelete,
  onReply,
}: ReviewCardProps) {
  const isOwner = currentUserId === review.userId._id;
  const isProvider = currentUserRole === "provider";
  const canEdit = isOwner && onEdit;
  const canDelete = isOwner && onDelete;
  const canReply = isProvider && !review.response && onReply;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-amber-500 text-amber-500"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border rounded-lg p-4 sm:p-6 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.userId.profilePhoto} alt={review.userId.fullName} />
            <AvatarFallback>{getInitials(review.userId.fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm sm:text-base">{review.userId.fullName}</h4>
            <div className="flex items-center gap-2 mt-1">
              {renderStars(review.rating)}
              <span className="text-xs sm:text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {(canEdit || canDelete || canReply) && (
          <div className="flex items-center gap-1 sm:gap-2 ml-2">
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(review._id)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(review._id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {canReply && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReply(review._id)}
                className="h-8"
              >
                <Reply className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Reply</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Review text */}
      <p className="text-sm sm:text-base text-gray-700 mb-3 whitespace-pre-wrap">
        {review.review}
      </p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
          {review.images.map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden border bg-gray-100"
            >
              <img
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}

      {/* Provider response */}
      {review.response && (
        <div className="mt-4 pl-4 border-l-2 border-primary bg-gray-50 p-3 rounded-r-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              Provider Response
            </Badge>
            {review.respondedAt && (
              <span className="text-xs text-gray-500">
                {formatDate(review.respondedAt)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.response}</p>
        </div>
      )}
    </div>
  );
}
