// import "../pages/Home.css";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useGetAllBikesQuery } from "@/redux/features/bike/bikeApi";
import { bikeCurrentBikes, setBikes } from "@/redux/features/bike/bikeSlice";
import { TBike } from "@/types/intex";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import BikeCard from "./BikeCard";
const FeaturedBikes = () => {
  // get bike data from bike api
  const dispatch = useAppDispatch();
  const { data } = useGetAllBikesQuery(undefined);
  if (data) {
    dispatch(setBikes({ data: data.data }));
  }

  const bikeData = useAppSelector(bikeCurrentBikes);

  return (
    <>
      {/* Featured section of bikes  */}
      <section className="dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50 bg-gradient-to-b from-green-50 to-blue-50">
        <div className="min-h-screen container md:py-32 py-16 ">
          <h1 className="text-left md:text-6xl text-4xl md:pb-16 pb-10 bebas-neue-regular">
            Top Picks: Featured Bikes
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {bikeData.length !== 0 ? (
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
              <h1>No bike found</h1>
            )}
          </div>
          <div className="flex justify-center pt-6">
            <Button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-slate-800 text-white hover:text-white hover:bg-slate-700 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
              variant="outline"
              size="lg"
            >
              <Link to={"/"} className="flex items-center">
                See more <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedBikes;
