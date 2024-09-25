import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const BikeCard = ({
  id,
  image,
  brand,
  model,
}: {
  id: string;
  image: string;
  brand: string;
  model: string;
}) => {
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
