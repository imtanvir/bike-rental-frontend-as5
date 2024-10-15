import Sidebar from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/hooks/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { TUser } from "@/redux/features/profile/profileSlice";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Outlet } from "react-router-dom";
import "./UserDashboard.css";

export default function UserProfileDashboard() {
  const user = useAppSelector(currentUser);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    // toggle sidebar
    setSidebarOpen(!sidebarOpen);
  };

  const role = user?.role as string;
  return (
    <div className="flex h-screen relative dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50 bg-gradient-to-b from-green-50 to-blue-50">
      {/* Sidebar */}
      <Button
        className="lg:hidden  absolute -left-1 top-2"
        onClick={handleToggleSidebar}
        variant="outline"
        size="icon"
      >
        <Menu className="h-5 w-5 rotate-0 scale-100" />
      </Button>
      <div
        className={` dark:bg-slate-950 bg-indigo-900 lg:w-64 w-30% p-6 space-y-6 lg:relative absolute z-30 transition-transform duration-500 ease-in-out  shadow  h-full transform ${
          sidebarOpen
            ? "translate-x-0 "
            : "translate-x-[-100%] lg:translate-x-0"
        }`}
      >
        <div className="flex items-center relative space-x-2 ">
          <Button
            className="lg:hidden absolute -right-5 -top-5 p-2 dark:bg-slate-500 w-7 h-7 rounded-full"
            onClick={handleToggleSidebar}
          >
            <FaArrowLeft className="text-slate-300 text-2xl" />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={(user as TUser)?.image?.[0]?.url}
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
              {(user as TUser).name?.split(" ")[0]}
            </h2>
            <p className="text-sm text-slate-400 just">
              Role:{" "}
              <span className="capitalize">
                {(user as TUser).role === "admin"
                  ? "Admin"
                  : (user as TUser).role === "superAdmin"
                  ? "Super Admin"
                  : "User"}
              </span>
            </p>
          </div>
        </div>
        <Separator />
        <nav className="space-y-4">
          <Sidebar role={role} />
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
