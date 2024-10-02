import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useGetAllBikesQuery } from "@/redux/features/bike/bikeApi";
import { bikeCurrentBikes, setBikes } from "@/redux/features/bike/bikeSlice";
import { TBike } from "@/types/intex";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { FaBiking } from "react-icons/fa";
import { Link } from "react-router-dom";
import BikeCard from "./BikeCard";
import BikeSkeleton from "./BikeSkeleton";
const FeaturedBikes = () => {
  // get bike data from bike api
  const dispatch = useAppDispatch();
  const { data } = useGetAllBikesQuery(undefined);
  useEffect(() => {
    if (data) {
      dispatch(setBikes({ data: data.data }));
    }
  }, [data, dispatch]);

  const bikeData = useAppSelector(bikeCurrentBikes);

  return (
    <>
      {/* Featured section of bikes  */}
      <section className="relative dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50 bg-gradient-to-b from-green-50 to-blue-50">
        <div className="min-h-screen container md:py-32 py-16 ">
          <h1 className="text-left md:text-6xl text-4xl md:pb-16 pb-10 bebas-neue-regular">
            Top Picks: Featured Bikes
          </h1>
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {bikeData ? (
              bikeData?.length !== 0 ? (
                bikeData
                  ?.slice(0, 10)
                  .map((bike: TBike) => (
                    <BikeCard
                      key={bike._id}
                      id={bike._id}
                      image={bike.image ?? "placeholder_image"}
                      brand={bike.brand}
                      model={bike.model}
                    />
                  ))
              ) : (
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((skeleton) => (
                  <BikeSkeleton key={skeleton} />
                ))
              )
            ) : (
              <>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center py-5 bebas-neue-regular flex justify-center items-end dark:text-slate-300 gap-3">
                  <p className="md:text-3xl text-xl">
                    No bike data available...
                  </p>
                  <div className=" gap-4 flex items-center justify-center transition-transform">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-r-2 border-blue-500"></div>
                    <p>
                      <FaBiking className="text-blue-500 text-5xl -skew-x-12" />
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-center pt-6">
            <Link
              to={"/all-bike"}
              className={` ${!bikeData ? "hidden" : "flex items-center"}`}
            >
              <Button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-slate-800 text-white hover:text-white hover:bg-slate-700 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                variant="outline"
                size="lg"
              >
                See more <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedBikes;
