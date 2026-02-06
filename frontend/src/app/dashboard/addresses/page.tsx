"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  MapPin,
  CreditCard,
  Bell,
  LogOut,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

interface Address {
  _id: string;
  label: string;
  fullAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

interface AddressFormData {
  label: string;
  fullAddress: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
  isDefault: boolean;
}

const initialFormData: AddressFormData = {
  label: "Home",
  fullAddress: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  latitude: "",
  longitude: "",
  isDefault: false,
};

export default function AddressesPage() {
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<AddressFormData>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/login";
      return;
    }
    setUser(JSON.parse(userData));

    // Fetch addresses
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setAddresses(data.addresses);
      } else {
        setError(data.message || "Failed to fetch addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const validateForm = (): boolean => {
    const errors: Partial<AddressFormData> = {};
    
    if (!formData.label) errors.label = "Label is required";
    if (!formData.fullAddress.trim()) errors.fullAddress = "Full address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = "Pincode must be 6 digits";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAddress = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const addressData: any = {
        label: formData.label,
        fullAddress: formData.fullAddress,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        isDefault: formData.isDefault,
      };

      if (formData.landmark) addressData.landmark = formData.landmark;
      if (formData.latitude) addressData.latitude = parseFloat(formData.latitude);
      if (formData.longitude) addressData.longitude = parseFloat(formData.longitude);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/addresses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(addressData),
        }
      );

      const data = await response.json();
      if (data.success) {
        setShowAddDialog(false);
        setFormData(initialFormData);
        setFormErrors({});
        fetchAddresses();
      } else {
        setError(data.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      setError("Failed to add address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAddress = async () => {
    if (!validateForm() || !editingAddress) return;

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const addressData: any = {
        label: formData.label,
        fullAddress: formData.fullAddress,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        isDefault: formData.isDefault,
      };

      if (formData.landmark) addressData.landmark = formData.landmark;
      if (formData.latitude) addressData.latitude = parseFloat(formData.latitude);
      if (formData.longitude) addressData.longitude = parseFloat(formData.longitude);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/addresses/${editingAddress._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(addressData),
        }
      );

      const data = await response.json();
      if (data.success) {
        setShowEditDialog(false);
        setEditingAddress(null);
        setFormData(initialFormData);
        setFormErrors({});
        fetchAddresses();
      } else {
        setError(data.message || "Failed to update address");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      setError("Failed to update address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!deletingAddress) return;

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/addresses/${deletingAddress._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setShowDeleteDialog(false);
        setDeletingAddress(null);
        fetchAddresses();
      } else {
        setError(data.message || "Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      setError("Failed to delete address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/addresses/${addressId}/default`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchAddresses();
      } else {
        setError(data.message || "Failed to set default address");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      setError("Failed to set default address");
    }
  };

  const openAddDialog = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setError(null);
    setShowAddDialog(true);
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      fullAddress: address.fullAddress,
      landmark: address.landmark || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      latitude: address.latitude?.toString() || "",
      longitude: address.longitude?.toString() || "",
      isDefault: address.isDefault,
    });
    setFormErrors({});
    setError(null);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (address: Address) => {
    setDeletingAddress(address);
    setError(null);
    setShowDeleteDialog(true);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary">
              ServiceHub
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/services" className="text-sm hover:text-primary">
                Browse Services
              </Link>
              <Link href="/dashboard" className="text-sm hover:text-primary">
                Dashboard
              </Link>
            </nav>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.fullName}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="text-sm text-gray-500 mb-1">Member since</div>
                <div className="font-medium">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            <nav className="bg-white rounded-xl shadow-md p-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 mb-2"
              >
                <Calendar className="h-5 w-5" />
                My Bookings
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 mb-2"
              >
                <User className="h-5 w-5" />
                Profile
              </Link>
              <Link
                href="/dashboard/addresses"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium mb-2"
              >
                <MapPin className="h-5 w-5" />
                Addresses
              </Link>
              <Link
                href="/dashboard/payments"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 mb-2"
              >
                <CreditCard className="h-5 w-5" />
                Payments
              </Link>
              <Link
                href="/dashboard/notifications"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 mb-2"
              >
                <Bell className="h-5 w-5" />
                Notifications
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">My Addresses</h1>
              <p className="text-gray-600">Manage your saved addresses</p>
            </div>

            {error && (
              <Alert className="mb-6 bg-red-50 text-red-900 border-red-200">
                {error}
              </Alert>
            )}

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Saved Addresses</h2>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Address
                </Button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">No addresses yet</h3>
                  <p className="text-gray-600 mb-4">
                    Add your first address to get started
                  </p>
                  <Button onClick={openAddDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow relative"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={address.isDefault ? "default" : "secondary"}>
                            {address.label}
                          </Badge>
                          {address.isDefault && (
                            <Badge variant="success">
                              <Star className="h-3 w-3 mr-1" />
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(address)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(address)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-sm space-y-1 mb-3">
                        <p className="font-medium">{address.fullAddress}</p>
                        {address.landmark && (
                          <p className="text-gray-600">
                            Landmark: {address.landmark}
                          </p>
                        )}
                        <p className="text-gray-600">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                      </div>

                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address._id)}
                          className="w-full"
                        >
                          Set as Default
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Enter your address details below
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Select
                value={formData.label}
                onValueChange={(value) =>
                  setFormData({ ...formData, label: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select label" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.label && (
                <p className="text-sm text-red-500">{formErrors.label}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullAddress">Full Address *</Label>
              <Textarea
                id="fullAddress"
                value={formData.fullAddress}
                onChange={(e) =>
                  setFormData({ ...formData, fullAddress: e.target.value })
                }
                placeholder="Enter your complete address"
                rows={3}
              />
              {formErrors.fullAddress && (
                <p className="text-sm text-red-500">{formErrors.fullAddress}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark</Label>
              <Input
                id="landmark"
                value={formData.landmark}
                onChange={(e) =>
                  setFormData({ ...formData, landmark: e.target.value })
                }
                placeholder="Nearby landmark (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="City"
                />
                {formErrors.city && (
                  <p className="text-sm text-red-500">{formErrors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  placeholder="State"
                />
                {formErrors.state && (
                  <p className="text-sm text-red-500">{formErrors.state}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value })
                }
                placeholder="6-digit pincode"
                maxLength={6}
              />
              {formErrors.pincode && (
                <p className="text-sm text-red-500">{formErrors.pincode}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  placeholder="e.g., 28.6139"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  placeholder="e.g., 77.2090"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isDefault: checked as boolean })
                }
              />
              <Label htmlFor="isDefault" className="cursor-pointer">
                Set as default address
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleAddAddress} disabled={submitting}>
              {submitting ? "Adding..." : "Add Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>
              Update your address details below
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-label">Label *</Label>
              <Select
                value={formData.label}
                onValueChange={(value) =>
                  setFormData({ ...formData, label: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select label" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.label && (
                <p className="text-sm text-red-500">{formErrors.label}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-fullAddress">Full Address *</Label>
              <Textarea
                id="edit-fullAddress"
                value={formData.fullAddress}
                onChange={(e) =>
                  setFormData({ ...formData, fullAddress: e.target.value })
                }
                placeholder="Enter your complete address"
                rows={3}
              />
              {formErrors.fullAddress && (
                <p className="text-sm text-red-500">{formErrors.fullAddress}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-landmark">Landmark</Label>
              <Input
                id="edit-landmark"
                value={formData.landmark}
                onChange={(e) =>
                  setFormData({ ...formData, landmark: e.target.value })
                }
                placeholder="Nearby landmark (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-city">City *</Label>
                <Input
                  id="edit-city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="City"
                />
                {formErrors.city && (
                  <p className="text-sm text-red-500">{formErrors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-state">State *</Label>
                <Input
                  id="edit-state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  placeholder="State"
                />
                {formErrors.state && (
                  <p className="text-sm text-red-500">{formErrors.state}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-pincode">Pincode *</Label>
              <Input
                id="edit-pincode"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value })
                }
                placeholder="6-digit pincode"
                maxLength={6}
              />
              {formErrors.pincode && (
                <p className="text-sm text-red-500">{formErrors.pincode}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-latitude">Latitude</Label>
                <Input
                  id="edit-latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  placeholder="e.g., 28.6139"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-longitude">Longitude</Label>
                <Input
                  id="edit-longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  placeholder="e.g., 77.2090"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isDefault: checked as boolean })
                }
              />
              <Label htmlFor="edit-isDefault" className="cursor-pointer">
                Set as default address
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleEditAddress} disabled={submitting}>
              {submitting ? "Updating..." : "Update Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {deletingAddress && (
            <div className="py-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{deletingAddress.label}</Badge>
                  {deletingAddress.isDefault && (
                    <Badge variant="success">Default</Badge>
                  )}
                </div>
                <p className="text-sm font-medium">{deletingAddress.fullAddress}</p>
                <p className="text-sm text-gray-600">
                  {deletingAddress.city}, {deletingAddress.state} -{" "}
                  {deletingAddress.pincode}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAddress}
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Delete Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
