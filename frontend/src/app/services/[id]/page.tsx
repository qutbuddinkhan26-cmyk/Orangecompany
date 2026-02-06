"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Clock,
  MapPin,
  ArrowLeft,
  Check,
  X,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  api,
  isAuthenticated,
  formatPrice,
  formatDate,
  generateTimeSlots,
  ApiError,
} from "@/lib/api";

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: {
    name: string;
    slug: string;
    icon: string;
  };
  basePrice: number;
  discountPercentage: number;
  durationMinutes: number;
  images: string[];
  thumbnail: string;
  whatIncluded: string[];
  whatExcluded: string[];
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  totalBookings: number;
}

interface Address {
  _id: string;
  label: string;
  fullAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  // Booking state
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Address dialog state
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    label: "home",
    fullAddress: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [addressFormLoading, setAddressFormLoading] = useState(false);

  // Image gallery state
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Load service and addresses
    loadData();
  }, [serviceId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [serviceData, addressesData] = await Promise.all([
        api.getServiceById(serviceId),
        api.getAddresses(),
      ]);

      setService(serviceData.service);
      setAddresses(addressesData.addresses || []);

      // Set default address if available
      const defaultAddress = addressesData.addresses?.find(
        (addr: Address) => addr.isDefault
      );
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      }
    } catch (err: any) {
      console.error("Error loading data:", err);
      if (err instanceof ApiError && err.status === 401) {
        router.push("/login");
      } else {
        setError(err.message || "Failed to load service details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressFormLoading(true);

    try {
      const response = await api.createAddress(addressFormData);
      setAddresses([...addresses, response.address]);
      setSelectedAddressId(response.address._id);
      setIsAddressDialogOpen(false);
      setAddressFormData({
        label: "home",
        fullAddress: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch (err: any) {
      alert(err.message || "Failed to create address");
    } finally {
      setAddressFormLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTimeSlot || !selectedAddressId) {
      alert("Please select date, time slot, and address");
      return;
    }

    setBookingLoading(true);

    try {
      const bookingDate = selectedDate.toISOString().split("T")[0];
      const response = await api.createBooking({
        serviceId,
        bookingDate,
        timeSlot: selectedTimeSlot,
        addressId: selectedAddressId,
        specialInstructions,
      });

      // Redirect to booking details page
      router.push(`/booking/${response.booking._id}`);
    } catch (err: any) {
      alert(err.message || "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Service not found"}</p>
          <Link href="/services">
            <Button>Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discountedPrice = service.discountPercentage
    ? service.basePrice * (1 - service.discountPercentage / 100)
    : service.basePrice;

  const timeSlots = generateTimeSlots();

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
        {/* Back button */}
        <Link
          href="/services"
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={
                    service.images && service.images.length > 0
                      ? service.images[selectedImage]
                      : service.thumbnail ||
                        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800"
                  }
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {service.images && service.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {service.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${service.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="mb-2">
                    {service.categoryId.icon} {service.categoryId.name}
                  </Badge>
                  <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="font-medium">{service.rating}</span>
                      <span>({service.totalBookings} bookings)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{service.durationMinutes} minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{service.description}</p>

              {/* What's Included */}
              {service.whatIncluded && service.whatIncluded.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    {service.whatIncluded.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What's Excluded */}
              {service.whatExcluded && service.whatExcluded.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <X className="h-5 w-5 text-red-600" />
                    What's Not Included
                  </h3>
                  <ul className="space-y-2">
                    {service.whatExcluded.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
              <div className="text-center py-8 text-gray-500">
                <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Review system coming soon</p>
                <p className="text-sm mt-2">
                  Be the first to leave a review after booking this service
                </p>
              </div>
            </div>
          </div>

          {/* Booking Sidebar - Desktop: Right sidebar, Mobile: Bottom sheet */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg lg:sticky lg:top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  {service.discountPercentage > 0 && (
                    <span className="text-2xl font-bold text-gray-400 line-through">
                      {formatPrice(service.basePrice)}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(discountedPrice)}
                  </span>
                </div>
                {service.discountPercentage > 0 && (
                  <Badge variant="destructive">
                    {service.discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                {/* Date Selection */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="h-4 w-4" />
                    Select Date
                  </Label>
                  <Calendar
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disablePastDates={true}
                  />
                </div>

                {/* Time Slot Selection */}
                <div>
                  <Label>Select Time Slot</Label>
                  <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Address Selection */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    Service Address
                  </Label>
                  <Select
                    value={selectedAddressId}
                    onValueChange={setSelectedAddressId}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select address" />
                    </SelectTrigger>
                    <SelectContent>
                      {addresses.map((address) => (
                        <SelectItem key={address._id} value={address._id}>
                          {address.label} - {address.fullAddress}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setIsAddressDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </div>

                {/* Special Instructions */}
                <div>
                  <Label htmlFor="instructions">
                    Special Instructions (Optional)
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any specific requirements or instructions..."
                    className="mt-2 min-h-[80px]"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  />
                </div>

                {/* Booking Summary */}
                {selectedDate && selectedTimeSlot && (
                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{selectedTimeSlot}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-primary">
                        {formatPrice(discountedPrice)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Book Now Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBooking}
                  disabled={
                    bookingLoading ||
                    !selectedDate ||
                    !selectedTimeSlot ||
                    !selectedAddressId
                  }
                >
                  {bookingLoading ? "Processing..." : "Book Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Enter your address details where the service should be provided.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddressSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="label">Address Label</Label>
                <Select
                  value={addressFormData.label}
                  onValueChange={(value) =>
                    setAddressFormData({ ...addressFormData, label: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fullAddress">Full Address</Label>
                <Textarea
                  id="fullAddress"
                  required
                  className="mt-2"
                  placeholder="House No., Building Name, Street"
                  value={addressFormData.fullAddress}
                  onChange={(e) =>
                    setAddressFormData({
                      ...addressFormData,
                      fullAddress: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="landmark">Landmark (Optional)</Label>
                <Input
                  id="landmark"
                  className="mt-2"
                  placeholder="Nearby landmark"
                  value={addressFormData.landmark}
                  onChange={(e) =>
                    setAddressFormData({
                      ...addressFormData,
                      landmark: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    required
                    className="mt-2"
                    placeholder="City"
                    value={addressFormData.city}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        city: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    required
                    className="mt-2"
                    placeholder="State"
                    value={addressFormData.state}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        state: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  required
                  className="mt-2"
                  placeholder="123456"
                  value={addressFormData.pincode}
                  onChange={(e) =>
                    setAddressFormData({
                      ...addressFormData,
                      pincode: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddressDialogOpen(false)}
                disabled={addressFormLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addressFormLoading}>
                {addressFormLoading ? "Saving..." : "Save Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
