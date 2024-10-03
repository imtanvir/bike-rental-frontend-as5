import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { currentUser, logOut } from "@/redux/features/auth/authSlice";
import { TUser } from "@/redux/features/profile/profileSlice";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { userCurrentToken } from "./../redux/features/auth/authSlice";
import Logo from "/src/assets/images/logo/Logo.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAppSelector(currentUser);
  const role = user?.role as string;
  const navbarStyle: React.CSSProperties = {
    overflow: "hidden",
    position: "sticky",
    top: 0,
    width: "100%",
    zIndex: 1000,
  };

  const token = useAppSelector(userCurrentToken);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };
  return (
    <>
      <nav
        className="w-full shadow dark:shadow-black bg-slate-50 dark:bg-slate-950 overflow-hidden  z-50  h-[10vh] flex items-center "
        style={navbarStyle}
      >
        <Card className="container bg-card py-3 px-4 border-0 flex items-center justify-between gap-6 shadow-none">
          <div className="text-primary cursor-pointer">
            <Link
              className=" text-center flex items-end md:gap-2 gap-1 select-none"
              to={"/"}
            >
              <img className="h-8 w-auto md:h-10" src={Logo} alt="logo" />
              <h3 className="lg:text-xl text-xl font-light select-none word">
                RidePro
              </h3>
            </Link>
          </div>

          <ul className="hidden md:flex items-center gap-10 text-card-foreground p-regular">
            <li className="text-primary ">
              <Link to={"/"}>Home</Link>
            </li>
            {["user", "superAdmin", "admin"].includes(role) && (
              <li>
                <Link to={`/${(user as TUser)?.role}/dashboard`}>
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link to={"/all-bike"}>All Bike</Link>
            </li>
            <li>
              <Link to={"/about-us"}>About Us</Link>
            </li>
            <li>
              {token ? (
                <Button
                  className="bg-indigo-800 text-white hover:bg-indigo-700  dark:text-slate-100 "
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <Link
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-indigo-800 text-white hover:bg-indigo-700 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                  to={"/login"}
                >
                  Login
                </Link>
              )}
            </li>
            <li>
              <ModeToggle />
            </li>
          </ul>

          <div className="flex items-center">
            <div className="flex md:hidden p-regular mr-2 mt-6 items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5 rotate-0 scale-100" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to={"/"}>Home</Link>
                  </DropdownMenuItem>
                  {["user", "superAdmin", "admin"].includes(role) && (
                    <DropdownMenuItem>
                      <Link to={`/${(user as TUser)?.role}/dashboard`}>
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Link to={"/all-bike"}>All Bike</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to={"/about-us"}>About Us</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      className="dark:bg-indigo-800 dark:text-white dark:hover:bg-indigo-700"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ModeToggle />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      </nav>
    </>
  );
};

export default Navbar;
