import { FaBiking } from "react-icons/fa";

const NoDataAvailable = () => {
  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex md:flex-row flex-col-reverse py-20 md:items-end items-center justify-center gap-4 poppins-0regular dark:text-slate-300">
        <p className="md:text-2xl text-xl">No data available...</p>
        <div className=" gap-4 flex items-center justify-center transition-transform">
          <p>
            <FaBiking className="text-blue-500 text-5xl -skew-x-12 animate-pulse transition duration-1000" />
          </p>
        </div>
      </div>
    </>
  );
};

export default NoDataAvailable;
