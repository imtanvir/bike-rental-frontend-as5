import Profile from "@/components/Profile";
import ProtectedRoute from "@/layout/ProtectedRoute";
import BikeManagement from "@/pages/BikeManagement";
import UserProfileDashboard from "@/pages/UserDashboard";

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
        element: <></>,
      },
      {
        name: "Rent Management",
        path: "rent-management",
        element: <></>,
      },
      {
        name: "Coupon Management",
        path: "coupon-management",
        element: <></>,
      },
    ],
  },
];
