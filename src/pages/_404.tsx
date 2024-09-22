import { Link } from "react-router-dom";
import _404img from "../assets/images/_404.svg";
const _404 = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-amber-100 dark:bg-gray-900">
      <div className="text-center">
        {/* <h1 className=" text-8xl font-bold  dark:text-red-600">404</h1>
        <p className="mt-4 text-xl text-gray-600">
          Oops! The page you are looking for doesn’t exist.
        </p> */}
        <img src={_404img} alt="not found image" className="w-[30rem]" />
        <Link
          to="/"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 dark:bg-indigo-800 dark:text-white dark:hover:bg-indigo-700"
        >
          Go back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default _404;
