# 🏍Bike Rental Service Web Application 🏍

- **Live Site:**
  - RidePro Bike Rental Service Live: https://bike-rental-frontend-as5-gx.vercel.app/
  - RidePro Bike Rental Backend Api Live: https://bike-rental-backend-as5.vercel.app/

## Overview

This project is a fully functional Bike Rental Service platform that allows users to browse, rent, and manage bike bookings. The application includes both user and admin functionalities, with features such as bike management, booking, rentals, and an interactive user experience. It is fully responsive and integrates with a backend API for handling data.

---

### Features

#### Public Pages

- **Navbar & Footer:**
  - Integrated with dynamic user role-based navigation.
  - Social media icons and website links for privacy policy, terms of service, and contact.
- **Home Page:**

  - Hero section with a banner and search bar for bike availability.
  - Featured section to display available bikes with their brand and a "View Detail" button.
  - Testimonials, Why Choose Us, Coupons & Discounts sections.
  - Contact Us section with a functional form.

- **About Us Page:**

  - Mission statement, team section, history, and contact information.

- **User Authentication:**
  - Users can sign up, log in, and log out.
  - Form validation ensures accurate input.

#### User Dashboard (Protected Routes)

- **User Profile Management:**

  - Users can view and update their profiles with name, email, phone, and address.

- **Bike Management:**

  - Bike listing with filtering by brand, model, and availability.
  - Bike detail page with full information and a "Book Now" button.

- **Rental Management:**
  - Booking process allows users to rent bikes with a payment system.
  - My Rentals page with tabs for Paid and Unpaid rentals. Users can pay for rentals and see the status.
- **Coupon Management:**
  - Here user can view their coupon.
  - User can take a coupon from the coupon wheel of home page.

#### Admin Pages (Protected Routes)

- **Admin Profile Management:** Same as user profile management.

- **Bike Management:**

  - Admins can create, edit, and delete bikes.
  - Integrated filter system for easier bike management.

- **User Management:**

  - Admins can promote users to admin roles and delete users.

- **Return Bike:**
  - Admins can process bike returns, update rental statuses, and calculate final costs.

#### Additional Features

- **Coupon Management (Bonus):**

  - Admins can create and manage coupon codes for discounts.
  - Integrated coupon system on the user side with a spin-the-wheel gamified feature for discounts.

- **Error Handling:**

  - Comprehensive error and validation handling, including custom 404 pages.

- **Responsiveness:**
  - The website is fully responsive, ensuring compatibility with mobile, tablet, and desktop devices.

---

### Bonus Features

- **Coupon Functionality:**

  - A gamified "spin-the-wheel" feature for winning discounts.
  - Users can apply discount codes during checkout. Log in required!

- **Dark Mode:**
  - Toggle between light and dark mode using a theme switcher.

---

### Technologies Used

- **Frontend:**

  - React.js with Tailwind CSS, Shadcn and raw css coding for styling.
  - React Redux, Persist for state management.

- **Backend:**

  - Node.js with Express.js.
  - MongoDB for the database.

- **Deployment & Hosting:**
  - Vercel for deploying backend and frontend live.
  - Image hosting and Image CRUD for the full site is used Cloudinary.

---

### How to Run

1. Clone repository and run:

   ```bash
   git clone https://github.com/yourusername/bike-rental-service.git
   cd ./folder_path/
   npm run install
   // set all ENV variable and backend URL, then follow the command

   npm run dev
   ```
