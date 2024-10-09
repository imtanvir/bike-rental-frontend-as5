import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useGetAllBikesQuery } from "@/redux/features/bike/bikeApi";
import { bikeCurrentBikes, setBikes } from "@/redux/features/bike/bikeSlice";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { RiMotorbikeFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const { data, refetch } = useGetAllBikesQuery(undefined);
  const allBikes = useAppSelector(bikeCurrentBikes);

  useEffect(() => {
    if (data?.data) {
      dispatch(setBikes({ data: data?.data }));
    }
  }, [data, dispatch]);
  useEffect(() => {
    refetch();
  }, [refetch]);

  const [searchTerms, setSearchTerms] = useState("");
  const searchResultBikes = allBikes?.filter(
    (bike) =>
      bike.name.toLowerCase().includes(searchTerms.toLowerCase()) ||
      bike.brand.toLowerCase().includes(searchTerms.toLowerCase()) ||
      bike.model.toLowerCase().includes(searchTerms.toLowerCase())
  );

  return (
    <>
      <div className="relative md:w-1/3 w-full">
        <div className="">
          <CiSearch className="absolute text-gray-500 font-medium text-[3rem] ps-[20px]" />
          <input
            className=" w-full text-[19px] bg-white dark:bg-slate-900 text-[#414141] dark:text-slate-300 ps-[50px] px-[30px] py-[10px] rounded-full outline-none border-0 shadow-md poppins-regular"
            name="searchTerm"
            placeholder="Search By bike, model or brand..."
            value={searchTerms}
            onChange={(e) => setSearchTerms(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div
          className={`flex flex-col bg-gray-50 dark:bg-slate-900  absolute -bottom-full top-full left-[4%] w-[90%] min-h-[10rem] overflow-auto scrollbar-thin border rounded-b shadow-md ${
            searchTerms.length === 0 ? "py-0 hidden" : "py-1 block"
          }`}
        >
          {searchResultBikes?.length !== 0 ? (
            searchResultBikes?.map((bike) => (
              <Link
                key={bike._id}
                to={`/bike-details/${bike._id}`}
                className="border-b border-gray-200 dark:border-slate-500 p-2 dark:bg-slate-700 dark:hover:bg-slate-800  dark:text-slate-300 flex gap-1 items-center"
              >
                <RiMotorbikeFill className=" dark:text-indigo-500" />{" "}
                {bike.name}
              </Link>
            ))
          ) : (
            <p className="text-center dark:text-slate-300 poppins-regular box-border pt-10">
              No Bike exist...
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchBar;
