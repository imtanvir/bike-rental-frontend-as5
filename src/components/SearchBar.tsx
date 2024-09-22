import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CiSearch } from "react-icons/ci";
import { RiMotorbikeFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const tags = Array.from({ length: 0 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);
const SearchBar = () => {
  // const searchResult = [];

  return (
    <>
      <div className="relative md:w-1/3 w-full">
        <div className="">
          <CiSearch className="absolute text-gray-500 font-medium text-[3rem] ps-[20px]" />
          <input
            className=" w-full text-[19px] bg-white dark:bg-slate-900 text-[#414141] dark:text-slate-100 ps-[50px] px-[30px] py-[10px] rounded-full outline-none border-0 shadow-md poppins-regular"
            placeholder="Search By bike, model or brand..."
          />
        </div>
        {/* <div
          className={`flex flex-col bg-gray-50  absolute -bottom-full top-full left-[4%] w-[90%] min-h-[10rem] overflow-auto scrollbar-thin border rounded-b shadow-md ${
            searchResult?.length === 0 ? "py-0 hidden" : "py-1 block"
          }`}
        >
          <Link
            to={"/"}
            className="border-b border-gray-200 p-2 dark:hover:bg-slate-800 flex gap-1 items-center"
          >
            <RiMotorbikeFill className=" dark:text-indigo-500" /> All
          </Link>
          <Link
            to={"/"}
            className="border-b border-gray-200 p-2 dark:hover:bg-slate-800 flex gap-1 items-center"
          >
            <RiMotorbikeFill className=" dark:text-indigo-500" /> All
          </Link>
          <Link
            to={"/"}
            className="border-b border-gray-200 p-2 dark:hover:bg-slate-800 flex gap-1 items-center"
          >
            <RiMotorbikeFill className=" dark:text-indigo-500" /> All
          </Link>
          <Link
            to={"/"}
            className="border-b border-gray-200 p-2 dark:hover:bg-slate-800 flex gap-1 items-center"
          >
            <RiMotorbikeFill className=" dark:text-indigo-500" /> All
          </Link>
        </div> */}

        <ScrollArea
          className={` ${
            tags?.length === 0 ? "py-0 hidden" : "py-1 block"
          } relative h-72 w-[90%] left-[4%] rounded-md border bg-white dark:bg-slate-800`}
        >
          <div className="p-4 poppins-regular">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <>
                  <Link
                    to={"/"}
                    className=" p-2 dark:hover:bg-slate-800 text-sm flex gap-1 items-center"
                  >
                    <RiMotorbikeFill className=" dark:text-indigo-500 md:text-lg text-base" />{" "}
                    {tag}
                  </Link>
                  <Separator className="my-2 dark:bg-slate-700" />
                </>
              ))
            ) : (
              <p className="text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 poppins-regular">
                Related bike not found!
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default SearchBar;
