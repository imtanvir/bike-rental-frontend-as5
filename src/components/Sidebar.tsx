import { useAppDispatch } from "@/hooks/hooks";
import { logOut } from "@/redux/features/auth/authSlice";
import { BikeIcon, UserIcon, UsersIcon } from "lucide-react";
import { FaCartShopping } from "react-icons/fa6";
import { RiCoupon2Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const Sidebar = ({ role }: { role: string }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };
  const NavItem = ({
    icon,
    children,
  }: {
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center space-x-2 text-muted-foreground hover:text-primary cursor-pointer">
      {icon}
      <span>{children}</span>
    </div>
  );

  const adminSidebarItems = [
    {
      icon: <UserIcon className="w-4 h-4 hover:text-white" />,
      title: "Profile",
      to: "/admin/dashboard",
    },
    {
      icon: <BikeIcon className="w-4 h-4 hover:text-white" />,
      title: "Bike Management",
      to: "/admin/dashboard/bike-management",
    },
    {
      icon: <UsersIcon className="w-4 h-4 hover:text-white" />,
      title: "User Management",
      to: "/admin/users/user-management",
    },
    {
      icon: <FaCartShopping className="w-4 h-4 hover:text-white" />,
      title: "Rent Management",
      to: "/admin/users/rent-management",
    },
    {
      icon: <RiCoupon2Line className="w-4 h-4 hover:text-white" />,
      title: "Coupon Management",
      to: "/admin/users/coupon-management",
    },
  ];

  const userSidebarItems = [
    {
      icon: <UserIcon className="w-4 h-4" />,
      title: "Profile",
      to: "/user/dashboard",
    },
    {
      icon: <FaCartShopping className="w-4 h-4 hover:text-white" />,
      title: "Rentals",
      to: "rentals",
    },
    {
      icon: <BikeIcon className="w-4 h-4 hover:text-white" />,
      title: "Bikes",
      to: "/user/dashboard/available-bikes",
    },
    {
      icon: <RiCoupon2Line className="w-4 h-4 hover:text-white" />,
      title: "My Coupon",
      to: "/user/dashboard/coupons",
    },
  ];

  return (
    <>
      <nav className="space-y-4">
        {role === "user" &&
          userSidebarItems.map((item) => (
            <NavItem key={item.title} icon={item.icon}>
              <Link
                className="text-slate-300 hover:text-slate-400"
                to={item.to}
              >
                {item.title}
              </Link>
            </NavItem>
          ))}

        {["superadmin", "admin"].includes(role) &&
          adminSidebarItems.map((item) => (
            <NavItem key={item.title} icon={item.icon}>
              <Link
                className="text-slate-300 hover:text-slate-400"
                to={item.to}
              >
                {item.title}
              </Link>
            </NavItem>
          ))}

        <Button
          className="bg-indigo-600 w-full text-white hover:bg-indigo-700 dark:text-slate-100 "
          onClick={handleLogout}
          // onClick={handleLogout}
        >
          Logout
        </Button>
      </nav>
    </>
  );
};

export default Sidebar;
