const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse(response: Response) {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message || 'An error occurred',
      data
    );
  }
  
  return data;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // Services
  async getServiceById(id: string) {
    const response = await fetch(`${API_URL}/services/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Addresses
  async getAddresses() {
    const response = await fetch(`${API_URL}/addresses`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async createAddress(addressData: {
    label: string;
    fullAddress: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
    isDefault?: boolean;
  }) {
    const response = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData),
    });
    return handleResponse(response);
  },

  // Bookings
  async createBooking(bookingData: {
    serviceId: string;
    bookingDate: string;
    timeSlot: string;
    addressId: string;
    specialInstructions?: string;
  }) {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
  },

  async getBookingById(id: string) {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Reviews
  async getServiceReviews(serviceId: string, page = 1, limit = 10) {
    const response = await fetch(`${API_URL}/reviews/service/${serviceId}?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getUserReviews(userId: string) {
    const response = await fetch(`${API_URL}/reviews/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async createReview(reviewData: {
    bookingId: string;
    rating: number;
    review: string;
    images?: string[];
  }) {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
  },

  async updateReview(reviewId: string, reviewData: {
    rating?: number;
    review?: string;
    images?: string[];
  }) {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
  },

  async deleteReview(reviewId: string) {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async addProviderResponse(reviewId: string, response: string) {
    const res = await fetch(`${API_URL}/reviews/${reviewId}/response`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ response }),
    });
    return handleResponse(res);
  },

  // Auth/Profile
  async getProfile() {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async updateProfile(profileData: {
    fullName?: string;
    phone?: string;
    dateOfBirth?: string;
    profilePhoto?: string;
  }) {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData),
    });
    return handleResponse(response);
  },

  async deleteAccount(password: string) {
    const response = await fetch(`${API_URL}/auth/account`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ password }),
    });
    return handleResponse(response);
  },
};

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

export function formatPrice(price: number): string {
  return `₹${price.toFixed(0)}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTimeSlot(hour: number): string {
  const start = hour % 12 === 0 ? 12 : hour % 12;
  const end = (hour + 1) % 12 === 0 ? 12 : (hour + 1) % 12;
  const startPeriod = hour < 12 ? 'AM' : 'PM';
  const endPeriod = (hour + 1) % 24 < 12 ? 'AM' : 'PM';
  return `${start}:00 ${startPeriod} - ${end}:00 ${endPeriod}`;
}

export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 8; hour <= 19; hour++) {
    slots.push(formatTimeSlot(hour));
  }
  return slots;
}
