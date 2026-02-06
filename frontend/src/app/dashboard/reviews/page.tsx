"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api, isAuthenticated, ApiError } from "@/lib/api";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";

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
    _id: string;
    name: string;
    thumbnail: string;
  };
  bookingId: {
    _id: string;
    bookingNumber: string;
    bookingDate: string;
  };
}

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Get user ID from token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.userId);
        loadReviews(payload.userId);
      } catch (err) {
        console.error("Invalid token:", err);
        router.push("/login");
      }
    }
  }, []);

  const loadReviews = async (userId: string) => {
    try {
      setLoading(true);
      const data = await api.getUserReviews(userId);
      setReviews(data.reviews);
      setError("");
    } catch (err: any) {
      console.error("Error loading reviews:", err);
      if (err instanceof ApiError && err.status === 401) {
        router.push("/login");
      } else {
        setError(err.message || "Failed to load reviews");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (reviewId: string) => {
    const review = reviews.find((r) => r._id === reviewId);
    if (review) {
      setEditingReview(review);
      setIsEditDialogOpen(true);
    }
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setEditingReview(null);
    // Reload reviews
    if (currentUserId) {
      loadReviews(currentUserId);
    }
  };

  const handleDeleteClick = (reviewId: string) => {
    setDeletingReviewId(reviewId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await api.deleteReview(deletingReviewId);
      setReviews(reviews.filter((r) => r._id !== deletingReviewId));
      setIsDeleteDialogOpen(false);
      setDeletingReviewId("");
    } catch (err: any) {
      alert(err.message || "Failed to delete review");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-2xl font-bold text-primary">
                ServiceHub
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your reviews...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary">
              ServiceHub
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
          <p className="text-gray-600">
            Manage your reviews and see responses from service providers
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't written any reviews yet. After completing a booking, you can
              share your experience!
            </p>
            <Link href="/services">
              <Button>Browse Services</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Service Info Header */}
                <div className="border-b p-4 bg-gray-50">
                  <div className="flex items-center gap-4">
                    <img
                      src={review.serviceId.thumbnail}
                      alt={review.serviceId.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{review.serviceId.name}</h3>
                      <p className="text-sm text-gray-600">
                        Booking #{review.bookingId.bookingNumber} •{" "}
                        {formatDate(review.bookingId.bookingDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Review Card */}
                <div className="p-4">
                  <ReviewCard
                    review={review}
                    currentUserId={currentUserId}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Review Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>
              Update your review. Changes can be made within 7 days of posting.
            </DialogDescription>
          </DialogHeader>
          {editingReview && (
            <ReviewForm
              initialData={{
                _id: editingReview._id,
                rating: editingReview.rating,
                review: editingReview.review,
                images: editingReview.images,
              }}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
