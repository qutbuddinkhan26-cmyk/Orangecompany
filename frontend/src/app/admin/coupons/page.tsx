"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Percent, DollarSign } from "lucide-react";

interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  applicableServices: { _id: string; name: string }[];
}

interface Service {
  _id: string;
  name: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minOrderAmount: "0",
    maxDiscountAmount: "",
    validFrom: "",
    validTo: "",
    usageLimit: "",
    isActive: true,
    applicableServices: [] as string[],
  });

  useEffect(() => {
    fetchCoupons();
    fetchServices();
  }, [search, currentPage]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (search) params.append("search", search);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/services`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        minOrderAmount: coupon.minOrderAmount.toString(),
        maxDiscountAmount: coupon.maxDiscountAmount?.toString() || "",
        validFrom: new Date(coupon.validFrom).toISOString().split("T")[0],
        validTo: new Date(coupon.validTo).toISOString().split("T")[0],
        usageLimit: coupon.usageLimit?.toString() || "",
        isActive: coupon.isActive,
        applicableServices: coupon.applicableServices.map((s) => s._id),
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "0",
        maxDiscountAmount: "",
        validFrom: "",
        validTo: "",
        usageLimit: "",
        isActive: true,
        applicableServices: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = editingCoupon
        ? `${process.env.NEXT_PUBLIC_API_URL}/coupons/${editingCoupon._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/coupons`;

      const payload: any = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount),
        validFrom: new Date(formData.validFrom).toISOString(),
        validTo: new Date(formData.validTo).toISOString(),
        isActive: formData.isActive,
        applicableServices: formData.applicableServices,
      };

      if (formData.maxDiscountAmount) {
        payload.maxDiscountAmount = Number(formData.maxDiscountAmount);
      }

      if (formData.usageLimit) {
        payload.usageLimit = Number(formData.usageLimit);
      }

      const res = await fetch(url, {
        method: editingCoupon ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsDialogOpen(false);
        fetchCoupons();
      } else {
        alert(data.message || "Error saving coupon");
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
      alert("Error saving coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        fetchCoupons();
      } else {
        alert(data.message || "Error deleting coupon");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("Error deleting coupon");
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/${coupon._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: !coupon.isActive }),
        }
      );

      const data = await res.json();
      if (data.success) {
        fetchCoupons();
      }
    } catch (error) {
      console.error("Error toggling coupon:", error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Coupon Management</h1>
          <p className="text-gray-600">Manage discount coupons</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search coupon code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Min Order</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No coupons found
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((coupon) => (
                    <TableRow key={coupon._id}>
                      <TableCell className="font-mono font-bold">
                        {coupon.code}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {coupon.discountType === "percentage" ? (
                            <>
                              <Percent className="h-4 w-4" />
                              {coupon.discountValue}%
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-4 w-4" />₹
                              {coupon.discountValue}
                            </>
                          )}
                        </div>
                        {coupon.maxDiscountAmount && (
                          <div className="text-xs text-gray-500">
                            Max: ₹{coupon.maxDiscountAmount}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>₹{coupon.minOrderAmount}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(coupon.validFrom)}</div>
                          <div className="text-gray-500">
                            to {formatDate(coupon.validTo)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {coupon.usageCount}
                        {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                      </TableCell>
                      <TableCell>
                        <button onClick={() => handleToggleActive(coupon)}>
                          <Badge
                            className={
                              coupon.isActive
                                ? "bg-green-100 text-green-700 cursor-pointer hover:bg-green-200"
                                : "bg-red-100 text-red-700 cursor-pointer hover:bg-red-200"
                            }
                          >
                            {coupon.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(coupon)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(coupon._id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Add/Edit Coupon Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Edit Coupon" : "Add Coupon"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Coupon Code *</Label>
              <Input
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                placeholder="SAVE20"
                className="font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Discount Type *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setFormData({ ...formData, discountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>
                  Discount Value * (
                  {formData.discountType === "percentage" ? "%" : "₹"})
                </Label>
                <Input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({ ...formData, discountValue: e.target.value })
                  }
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Order Amount (₹)</Label>
                <Input
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, minOrderAmount: e.target.value })
                  }
                  min="0"
                />
              </div>
              {formData.discountType === "percentage" && (
                <div>
                  <Label>Max Discount Amount (₹)</Label>
                  <Input
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxDiscountAmount: e.target.value,
                      })
                    }
                    min="0"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Valid From *</Label>
                <Input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, validFrom: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Valid To *</Label>
                <Input
                  type="date"
                  value={formData.validTo}
                  onChange={(e) =>
                    setFormData({ ...formData, validTo: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Usage Limit</Label>
                <Input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: e.target.value })
                  }
                  min="0"
                  placeholder="Unlimited"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.isActive ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isActive: value === "active" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Applicable Services (leave empty for all)</Label>
              <Select
                value=""
                onValueChange={(value) => {
                  if (!formData.applicableServices.includes(value)) {
                    setFormData({
                      ...formData,
                      applicableServices: [
                        ...formData.applicableServices,
                        value,
                      ],
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select services" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service._id} value={service._id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.applicableServices.map((serviceId) => {
                  const service = services.find((s) => s._id === serviceId);
                  return (
                    <Badge
                      key={serviceId}
                      className="bg-primary/10 text-primary cursor-pointer"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          applicableServices:
                            formData.applicableServices.filter(
                              (id) => id !== serviceId
                            ),
                        });
                      }}
                    >
                      {service?.name} ✕
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingCoupon ? "Save Changes" : "Create Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
