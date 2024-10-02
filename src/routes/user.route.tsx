import MyRentals from "@/components/MyRentals";
import Profile from "@/components/Profile";
import ProtectedRoute from "@/layout/ProtectedRoute";
import AllBikes from "@/pages/AllBikes";
import UserProfileDashboard from "@/pages/UserDashboard";

export const userPath = [
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
        name: "User Rentals",
        path: "rentals",
        element: <MyRentals />,
      },
      {
        name: "Bikes",
        path: "available-bikes",
        element: <AllBikes />,
      },
      {
        name: "My Coupons",
        path: "coupons",
        element: <>hi</>,
      },
    ],
  },
];
