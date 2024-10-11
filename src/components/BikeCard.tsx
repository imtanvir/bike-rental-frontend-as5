import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ratingAverageCalculate } from "@/utils/ratingAverageCalculate";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const BikeCard = ({
  id,
  image,
  brand,
  model,
  rating,
}: {
  id: string;
  image: string;
  brand: string;
  model: string;
  rating: number[];
}) => {
  const averageRating = ratingAverageCalculate(rating);
  return (
    <>
      <Card
        key={id}
        className="poppins-regular overflow-hidden flex flex-col dark:bg-slate-800 dark:shadow-md"
      >
        <CardHeader className="p-0">
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={image}
              alt={`${brand} ${model}`}
              className="absolute inset-0 w-full h-full transition hover:transition-transform hover:scale-125 object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-md dark:text-slate-300 mb-1">
            {brand}
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-500">{model}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`md:w-4 w-3 md:h-4 h-3 ${
                  i < Math.floor(averageRating ?? 0)
                    ? "text-yellow-400 fill-current"
                    : "text-slate-500 fill-slate-500"
                }`}
              />
            ))}
            <span className="font-normal text-sm ps-2">{`(${averageRating})`}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Link to={`/bike-details/${id}`} className="w-full">
            <Button
              variant="outline"
              className="bg-indigo-800 hover:bg-indigo-600 hover:text-slate-200 text-slate-300 dark:bg-indigo-600 dark:text-slate-200 dark:hover:bg-indigo-700 w-full"
            >
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default BikeCard;
