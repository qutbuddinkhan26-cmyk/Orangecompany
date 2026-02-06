# Service Detail Page Test Plan

## Manual Testing Checklist

### Prerequisites
- [ ] Backend server running on http://localhost:5000
- [ ] Frontend server running on http://localhost:3000
- [ ] Test user account created (customer role)
- [ ] Test service with ID exists in database

### Authentication Tests
- [ ] Navigate to `/services/1` without authentication → should redirect to `/login`
- [ ] Login with test credentials
- [ ] Navigate to `/services/1` → should load service detail page
- [ ] Check that token is stored in localStorage
- [ ] Open DevTools Network tab → verify Authorization header in API requests

### Service Display Tests
- [ ] Service name displays correctly
- [ ] Service description shows full text
- [ ] Category badge shows correct category with icon
- [ ] Price displays correctly (₹ symbol and amount)
- [ ] Discount badge shows if discountPercentage > 0
- [ ] Original price shows with strikethrough if discounted
- [ ] Final price calculates correctly (basePrice × (1 - discount/100))
- [ ] Duration displays in minutes
- [ ] Rating displays with star icon
- [ ] Total bookings count displays
- [ ] Main image loads correctly
- [ ] If multiple images, thumbnail navigation works
- [ ] Clicking thumbnails changes main image
- [ ] What's Included section displays with checkmarks
- [ ] What's Excluded section displays with X icons

### Calendar Tests
- [ ] Calendar displays current month
- [ ] Today's date has border highlight
- [ ] Can navigate to next month
- [ ] Can navigate to previous month
- [ ] Cannot select dates in the past (disabled and grayed out)
- [ ] Can select today's date
- [ ] Can select future dates
- [ ] Selected date gets highlighted with primary color
- [ ] Clicking same date keeps it selected

### Time Slot Tests
- [ ] Time slot dropdown shows placeholder "Choose a time slot"
- [ ] Clicking dropdown shows all time slots
- [ ] Time slots range from 8:00 AM to 8:00 PM
- [ ] Each slot is 1 hour duration
- [ ] Format is "HH:00 AM/PM - HH:00 AM/PM"
- [ ] Last slot is "7:00 PM - 8:00 PM"
- [ ] Can select a time slot
- [ ] Selected slot displays in dropdown

### Address Tests
- [ ] If user has addresses, default address is pre-selected
- [ ] Address dropdown shows all saved addresses
- [ ] Format is "label - fullAddress"
- [ ] Can select different address
- [ ] "Add New Address" button visible

### Add New Address Dialog Tests
- [ ] Click "Add New Address" → dialog opens
- [ ] Dialog shows title "Add New Address"
- [ ] All fields render correctly:
  - [ ] Address Label dropdown (Home/Work/Other)
  - [ ] Full Address textarea
  - [ ] Landmark input
  - [ ] City input
  - [ ] State input
  - [ ] Pincode input
- [ ] Required fields have asterisk or validation
- [ ] Fill all required fields and submit
- [ ] Loading state shows "Saving..." on button
- [ ] Dialog closes on success
- [ ] New address appears in address dropdown
- [ ] New address is auto-selected
- [ ] Try submitting without required fields → should show error
- [ ] Cancel button closes dialog without saving

### Special Instructions Tests
- [ ] Textarea displays placeholder text
- [ ] Can type in textarea
- [ ] Text persists when scrolling page
- [ ] Character limit (if any) works correctly

### Booking Summary Tests
- [ ] Summary not visible until date and time selected
- [ ] After selecting date and time, summary appears
- [ ] Summary shows:
  - [ ] Date in readable format
  - [ ] Time slot in HH:00 AM/PM format
  - [ ] Total price with ₹ symbol
- [ ] Summary updates when date/time changed

### Book Now Button Tests
- [ ] Button disabled when missing required fields:
  - [ ] No date selected
  - [ ] No time slot selected
  - [ ] No address selected
- [ ] Button enabled when all fields filled
- [ ] Button shows "Book Now" text
- [ ] Click button → shows "Processing..." text
- [ ] Button disabled during processing
- [ ] On success:
  - [ ] Redirects to `/booking/[bookingId]`
  - [ ] Booking confirmation page loads
  - [ ] Shows success message with green checkmark
  - [ ] Displays booking number
  - [ ] Shows all booking details
- [ ] On error:
  - [ ] Shows error alert
  - [ ] Button re-enables
  - [ ] Can retry booking

### Reviews Section Tests
- [ ] Section header "Customer Reviews" displays
- [ ] Placeholder message shows "Review system coming soon"
- [ ] Star icon displays
- [ ] Additional text about being first reviewer shows

### Responsive Design Tests

#### Desktop (> 1024px)
- [ ] Two-column layout (content left, booking right)
- [ ] Booking sidebar sticky on scroll
- [ ] Header sticky at top
- [ ] All content readable
- [ ] No horizontal scroll

#### Tablet (768px - 1024px)
- [ ] Two-column layout maintained
- [ ] Proper spacing between columns
- [ ] Booking section still sticky
- [ ] Touch targets adequate size

#### Mobile (< 768px)
- [ ] Single column layout
- [ ] Booking section below content
- [ ] Booking section NOT sticky (scrolls with page)
- [ ] All buttons full width
- [ ] Text readable without zoom
- [ ] No horizontal scroll
- [ ] Dialog responsive
- [ ] Calendar fits screen width
- [ ] Touch targets at least 44x44px

### Error Handling Tests
- [ ] Invalid service ID → shows "Service not found"
- [ ] Network error during load → shows error message
- [ ] 401 error → redirects to login
- [ ] Failed booking → shows error alert
- [ ] Failed address creation → shows error alert
- [ ] Empty addresses list → only shows "Add New Address" button

### Loading States Tests
- [ ] Initial page load shows spinner
- [ ] Spinner shows "Loading service details..." text
- [ ] Booking button shows "Processing..." during submission
- [ ] Address form button shows "Saving..." during submission
- [ ] Loading indicator centers on screen

### Navigation Tests
- [ ] "Back to Services" link works
- [ ] ServiceHub logo links to home
- [ ] Dashboard button links to dashboard
- [ ] After booking, "Go to Dashboard" button works
- [ ] After booking, "Browse More Services" button works

### Browser Compatibility Tests
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Performance Tests
- [ ] Page loads in < 3 seconds on good connection
- [ ] Images load progressively
- [ ] No layout shift during load
- [ ] Smooth scrolling
- [ ] No jank during interactions
- [ ] Calendar navigation is responsive

### Accessibility Tests
- [ ] Can tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Can submit forms with Enter key
- [ ] Labels associated with form inputs
- [ ] Heading hierarchy correct (h1 → h2 → h3)
- [ ] Images have alt text
- [ ] Color contrast passes WCAG AA
- [ ] Screen reader can read all content

## Automated Tests (Future)

### Unit Tests
- formatPrice() function
- formatDate() function
- formatTimeSlot() function
- generateTimeSlots() function
- isAuthenticated() function

### Integration Tests
- API calls with mock responses
- Form submissions
- Dialog open/close
- Date selection

### E2E Tests
- Complete booking flow
- Address creation flow
- Error scenarios
- Authentication flow

## Test Data

### Sample Service
```json
{
  "_id": "1",
  "name": "Deep Home Cleaning",
  "description": "Comprehensive cleaning of your entire home",
  "categoryId": {
    "name": "Home Cleaning",
    "icon": "🧹"
  },
  "basePrice": 999,
  "discountPercentage": 10,
  "durationMinutes": 180,
  "rating": 4.8,
  "totalBookings": 2534,
  "images": ["image1.jpg", "image2.jpg"],
  "whatIncluded": ["Floor cleaning", "Bathroom cleaning"],
  "whatExcluded": ["Window cleaning"]
}
```

### Sample Address
```json
{
  "_id": "addr1",
  "label": "home",
  "fullAddress": "123 Main St, Apt 4B",
  "landmark": "Near Central Park",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "isDefault": true
}
```

## Bug Report Template

```
**Title**: [Brief description]

**Severity**: [Critical / High / Medium / Low]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**:

**Actual Behavior**:

**Browser**: [Chrome 120 / Firefox 121 / etc.]
**Device**: [Desktop / iPhone 14 / Samsung Galaxy / etc.]
**Screen Size**: [1920x1080 / 375x667 / etc.]

**Screenshots**: [If applicable]

**Console Errors**: [If applicable]
```

## Test Results Log

| Test Category | Pass | Fail | Notes |
|--------------|------|------|-------|
| Authentication | - | - | |
| Service Display | - | - | |
| Calendar | - | - | |
| Time Slots | - | - | |
| Addresses | - | - | |
| Add Address Dialog | - | - | |
| Special Instructions | - | - | |
| Booking Summary | - | - | |
| Book Now Button | - | - | |
| Reviews Section | - | - | |
| Responsive Design | - | - | |
| Error Handling | - | - | |
| Loading States | - | - | |
| Navigation | - | - | |
| Browser Compatibility | - | - | |
| Performance | - | - | |
| Accessibility | - | - | |

**Tested By**: _____________
**Date**: _____________
**Environment**: _____________
**Overall Status**: ⬜ Pass ⬜ Fail ⬜ Partial
