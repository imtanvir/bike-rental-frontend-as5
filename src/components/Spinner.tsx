import { FaBiking } from "react-icons/fa";

const Spinner = () => {
  return (
    <div className=" gap-4 flex items-center justify-center h-screen transition-transform">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-r-2 border-blue-500"></div>
      <p>
        <FaBiking className="text-blue-500 text-5xl -skew-x-12" />
      </p>
    </div>
  );
};

export default Spinner;
