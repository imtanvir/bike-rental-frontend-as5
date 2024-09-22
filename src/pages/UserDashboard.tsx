import Sidebar from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/hooks/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { TUser } from "@/redux/features/profile/profileSlice";
import { useState } from "react";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { Outlet } from "react-router-dom";

export default function UserProfileDashboard() {
  const user = useAppSelector(currentUser);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    // toggle sidebar
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="flex h-screen relative dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50 bg-gradient-to-b from-green-50 to-blue-50">
      {/* Sidebar */}
      <Button
        className="md:hidden absolute right-2 top-2"
        onClick={handleToggleSidebar}
      >
        <FaArrowRightArrowLeft />
      </Button>
      <div
        className={`bg-indigo-900 dark:bg-slate-900 md:w-64 p-6 space-y-6 md:relative absolute z-30 transition-transform duration-500 ease-in-out  shadow w-30% h-full transform ${
          sidebarOpen
            ? "translate-x-0 "
            : "translate-x-[-100%] md:translate-x-0"
        }`}
      >
        <div className="flex items-center space-x-2 ">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src="/placeholder.svg?height=40&width=40"
              alt={(user as TUser).name as string}
            />
            <AvatarFallback>
              {((user as TUser).name as string)
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-slate-300">
              {(user as TUser).name}
            </h2>
            <p className="text-sm text-slate-400 just">
              Role: <span className="capitalize">{(user as TUser).role}</span>
            </p>
          </div>
        </div>
        <Separator />
        <nav className="space-y-4">
          {/* <NavItem icon={<UserIcon className="w-4 h-4" />}>
            <Link
              className="text-slate-300 hover:text-slate-400"
              to={"/user/dashboard/"}
            >
              Profile
            </Link>
          </NavItem>
          <NavItem icon={<SettingsIcon className="w-4 h-4" />}>
            <Link
              className="text-slate-300  hover:text-slate-400"
              to={"/user/dashboard/rentals"}
            >
              My rental
            </Link>
          </NavItem>
          <NavItem icon={<BellIcon className="w-4 h-4" />}>
            <Link
              className="text-slate-300  hover:text-slate-400"
              to={"/user/dashboard/dashboard3"}
            >
              Notifications
            </Link>
          </NavItem>
          <Button
            className="bg-indigo-600 w-full text-white hover:bg-indigo-700 dark:text-slate-100 "
            // onClick={handleLogout}
          >
            Logout
          </Button> */}
          <Sidebar role={(user as TUser).role as string} />
        </nav>
      </div>
      {/* Main Content */}
      <Outlet />
    </div>
  );
}
