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
    <div className="flex items-center space-x-2 flex-nowrap text-muted-foreground hover:text-primary cursor-pointer">
      {icon}
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );

  const adminSidebarItems = [
    {
      icon: <UserIcon className="w-4 h-4 hover:text-white" />,
      title: "Profile",
      to: `/${role}/dashboard`,
    },
    {
      icon: <BikeIcon className="w-4 h-4 hover:text-white" />,
      title: "Bike Management",
      to: `bike-management`,
    },
    {
      icon: <UsersIcon className="w-4 h-4 hover:text-white" />,
      title: "User Management",
      to: `user-management`,
    },
    {
      icon: <FaCartShopping className="w-4 h-4 hover:text-white" />,
      title: "Rent Management",
      to: `rent-management`,
    },
    {
      icon: <RiCoupon2Line className="w-4 h-4 hover:text-white" />,
      title: "Coupon Management",
      to: `coupon-management`,
    },
  ];

  const userSidebarItems = [
    {
      icon: <UserIcon className="w-4 h-4" />,
      title: "Profile",
      to: `/${role}/dashboard`,
    },
    {
      icon: <FaCartShopping className="w-4 h-4 hover:text-white" />,
      title: "Rentals",
      to: "rentals",
    },
    {
      icon: <BikeIcon className="w-4 h-4 hover:text-white" />,
      title: "Bikes",
      to: `/${role}/dashboard/available-bikes`,
    },
    {
      icon: <RiCoupon2Line className="w-4 h-4 hover:text-white" />,
      title: "My Coupon",
      to: `coupons`,
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

        {["superAdmin", "admin"].includes(role) &&
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
        >
          Logout
        </Button>
      </nav>
    </>
  );
};

export default Sidebar;
