import AboutUs from "@/pages/AboutUs";
import AllBikes from "@/pages/AllBikes";
import BikeDetails from "@/pages/BikeDetails";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Payment from "@/pages/Payment";
import SignUp from "@/pages/SignUp";
import { routeGenerator } from "@/utils/routeGenaretor";
import { createBrowserRouter } from "react-router-dom";
import App from "./../App";
import _404 from "./../pages/_404";
import { adminPath } from "./admin.route";
import { userPath } from "./user.route";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/bike-details/:id",
        element: <BikeDetails />,
      },
      {
        path: "/all-product",
        element: <AllBikes />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/payment/:id",
        element: <Payment />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "*",
        element: <_404 />,
      },
    ],
  },
  {
    path: "/admin",
    element: <App />,
    children: routeGenerator(adminPath),
  },
  {
    path: "/user",
    element: <App />,
    children: routeGenerator(userPath),
  },
]);

export default router;
