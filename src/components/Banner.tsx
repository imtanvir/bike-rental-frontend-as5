import SearchBar from "@/components/SearchBar";
import { IoIosArrowRoundDown } from "react-icons/io";
const Banner = () => {
  return (
    <>
      <section
        className="background-image h-[90vh] pt-60 box-border flex relative"
        id="main-banner"
      >
        <div className="flex flex-col container items-center gap-8">
          <h1 className="text-center md:text-6xl text-2xl bebas-neue-regular text-white">
            Pro Rides, Pro Service – Elevate Your Bike Experience
          </h1>
          <SearchBar />
        </div>
        <span className=" absolute bottom-5 animate-bounce left-1/2 transform -translate-x-1/2 rounded-full border-2 border-white dark:border-slate-600 dark:bg-slate-600  hover:cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition">
          <IoIosArrowRoundDown className="text-white dark:text-violet-400 hover:text-slate-950  text-4xl" />
        </span>
      </section>
    </>
  );
};

export default Banner;
