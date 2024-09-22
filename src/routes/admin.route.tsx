import Profile from "@/components/Profile";
import UserProfileDashboard from "@/pages/UserDashboard";

export const adminPath = [
  {
    name: "Dashboard",
    path: "dashboard",
    element: <UserProfileDashboard />,
    children: [
      {
        name: "User Profile",
        path: "",
        element: <Profile />,
      },
      {
        name: "Bike Management",
        path: "bike-management",
        element: <></>,
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
