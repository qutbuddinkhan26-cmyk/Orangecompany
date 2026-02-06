# Service Detail Page Documentation

## Overview

The Service Detail page (`/services/[id]/page.tsx`) provides a complete booking experience for users to view service details and create bookings.

## Features

### 1. Service Information Display
- **Service Name & Description**: Full service details with description
- **Category Badge**: Shows service category with icon
- **Pricing**: 
  - Base price display
  - Discount badge if applicable
  - Strikethrough original price when discounted
  - Final calculated price
- **Duration**: Service duration in minutes
- **Rating**: Star rating with total booking count
- **Image Gallery**: Main image with thumbnail navigation
- **What's Included**: List of included items with checkmark icons
- **What's Excluded**: List of excluded items with X icons

### 2. Booking Section
Located in the right sidebar on desktop, inline on mobile:

- **Date Picker**: 
  - Calendar component with date selection
  - Past dates are disabled automatically
  - Today's date is highlighted with a border
- **Time Slot Selection**: 
  - Dropdown with pre-generated time slots
  - 1-hour intervals from 8:00 AM to 8:00 PM
- **Address Selection**: 
  - Dropdown showing saved addresses
  - Default address pre-selected if available
  - "Add New Address" button to create new addresses
- **Special Instructions**: 
  - Optional textarea for booking notes
  - Placeholder text for guidance
- **Booking Summary**: 
  - Shows selected date, time, and price
  - Only visible when date and time are selected
- **Book Now Button**: 
  - Creates booking via API
  - Disabled until all required fields are filled
  - Shows loading state during booking creation
  - Redirects to booking confirmation page on success

### 3. Address Management
Dialog-based address creation form:

- **Address Label**: Dropdown (Home/Work/Other)
- **Full Address**: Textarea for complete address
- **Landmark**: Optional field
- **City**: Required field
- **State**: Required field
- **Pincode**: Required field

### 4. Reviews Section
Placeholder section with message "Review system coming soon"

## API Integration

### Endpoints Used

1. **GET /api/services/:id**
   - Fetches service details
   - Returns service object with all properties

2. **GET /api/addresses**
   - Fetches user's saved addresses
   - Requires authentication

3. **POST /api/addresses**
   - Creates new address
   - Requires: label, fullAddress, city, state, pincode

4. **POST /api/bookings**
   - Creates new booking
   - Requires: serviceId, bookingDate, timeSlot, addressId
   - Optional: specialInstructions

## Authentication

- Page requires authentication
- Redirects to `/login` if user is not authenticated
- Uses localStorage token for authentication
- Checks authentication on page load and API calls

## Error Handling

- Loading states for initial data fetch and booking creation
- Error messages for failed API calls
- 401 errors redirect to login page
- User-friendly error alerts
- Graceful handling of missing data

## Mobile Responsiveness

- **Desktop**: Two-column layout (content + booking sidebar)
- **Tablet**: Two-column layout with adjusted spacing
- **Mobile**: Single column, booking section below content
- Sticky header on all devices
- Responsive image gallery
- Touch-friendly buttons and inputs

## Component Dependencies

### UI Components Used
- `Button` - Primary actions
- `Badge` - Category and discount tags
- `Calendar` - Date selection
- `Select` - Dropdown selections
- `Textarea` - Text input areas
- `Input` - Single-line text inputs
- `Label` - Form labels
- `Dialog` - Address creation modal
- `Card` - Content containers (implicit)

### Helper Functions
- `formatPrice()` - Formats numbers as currency (₹)
- `formatDate()` - Formats dates in readable format
- `generateTimeSlots()` - Creates time slot array
- `isAuthenticated()` - Checks if user is logged in
- `ApiError` - Custom error class for API errors

## Usage Example

```typescript
// Navigate to service detail page
router.push(`/services/${serviceId}`);

// Or use Link component
<Link href={`/services/${serviceId}`}>
  View Service
</Link>
```

## State Management

### Service State
- `service` - Current service data
- `loading` - Initial load state
- `error` - Error message

### Booking State
- `selectedDate` - Date object
- `selectedTimeSlot` - String (e.g., "10:00 AM - 11:00 AM")
- `selectedAddressId` - Address ID string
- `specialInstructions` - String
- `bookingLoading` - Booking submission state

### Address State
- `addresses` - Array of user addresses
- `isAddressDialogOpen` - Dialog visibility
- `addressFormData` - Form state
- `addressFormLoading` - Form submission state

### Gallery State
- `selectedImage` - Currently displayed image index

## File Structure

```
frontend/src/
├── app/
│   ├── services/
│   │   └── [id]/
│   │       └── page.tsx          # Main service detail page
│   └── booking/
│       └── [id]/
│           └── page.tsx          # Booking confirmation page
├── lib/
│   └── api.ts                    # API helper functions
└── components/
    └── ui/
        ├── button.tsx
        ├── badge.tsx
        ├── calendar.tsx
        ├── select.tsx
        ├── textarea.tsx
        ├── input.tsx
        ├── label.tsx
        └── dialog.tsx
```

## Future Enhancements

1. **Reviews System**
   - Display actual customer reviews
   - Review submission form
   - Rating breakdown

2. **Image Gallery**
   - Lightbox for full-screen images
   - Image zoom functionality
   - Better thumbnail navigation

3. **Booking Features**
   - Multiple time slot selection
   - Recurring bookings
   - Provider selection
   - Preferred professional

4. **Address Features**
   - Map integration for address selection
   - GPS location auto-fill
   - Address validation
   - Edit existing addresses

5. **Payment Integration**
   - Payment gateway integration
   - Multiple payment methods
   - Payment status tracking

## Testing

To test the service detail page:

1. Start the backend server
2. Start the frontend dev server
3. Login with a customer account
4. Navigate to `/services/1` (or any valid service ID)
5. Test all booking form fields
6. Try creating a new address
7. Complete a booking
8. Verify redirect to booking confirmation

## Troubleshooting

### Common Issues

1. **"Service not found" error**
   - Check if service ID exists in database
   - Verify API endpoint is running
   - Check network tab for API errors

2. **Address dropdown is empty**
   - User might not have any saved addresses
   - Click "Add New Address" to create one

3. **Can't select past dates**
   - This is intentional - past dates are disabled
   - Select today or a future date

4. **Booking button disabled**
   - Ensure date, time slot, and address are all selected
   - Check console for any errors

5. **Redirect to login**
   - User session expired
   - Clear localStorage and login again

## Performance Considerations

- Parallel API calls for service and addresses
- Lazy loading of images
- Optimized re-renders with proper state management
- Minimal component re-renders
- Static generation where possible

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in dialogs
- Screen reader friendly
- Proper heading hierarchy

## Security

- Authentication required
- Token stored in localStorage (consider httpOnly cookies in production)
- API calls include auth headers
- Input validation on forms
- XSS protection through React
- CSRF protection (to be implemented)
