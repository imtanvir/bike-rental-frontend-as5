import Profile from "@/components/Profile";
import ProtectedRoute from "@/layout/ProtectedRoute";
import BikeManagement from "@/pages/BikeManagement";
import CouponManagement from "@/pages/CouponManagement";
import RentManagement from "@/pages/RentManagement";
import UserProfileDashboard from "@/pages/UserDashboard";
import UserManagement from "@/pages/UserManagement";

export const adminPath = [
  {
    name: "Dashboard",
    path: "dashboard",
    element: (
      <ProtectedRoute>
        <UserProfileDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        name: "User Profile",
        path: "",
        element: <Profile />,
      },
      {
        name: "Bike Management",
        path: "bike-management",
        element: <BikeManagement />,
      },
      {
        name: "User Management",
        path: "user-management",
        element: <UserManagement />,
      },
      {
        name: "Rent Management",
        path: "rent-management",
        element: <RentManagement />,
      },
      {
        name: "Coupon Management",
        path: "coupon-management",
        element: <CouponManagement />,
      },
    ],
  },
];
