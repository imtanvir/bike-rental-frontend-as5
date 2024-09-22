import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TBooking } from "@/redux/features/booking/rentalSlice";
import placeholderImg from "../assets/images/banner.png";

const RentalCard = ({ rental }: { rental: TBooking }) => {
  const startTimeIs = rental.startTime?.toString();
  const startTimeConverted = new Date(startTimeIs as string)
    .toLocaleString()
    .slice(0, 26);

  return (
    <Card className="mb-6 animate-fade-left dark:bg-slate-800 dark:text-slate-300 bg-indigo-200">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="flex-1 p-6">
          <CardHeader className="p-0">
            <CardTitle className="text-xl font-bold">
              {rental?.bikeId?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-4 space-y-2">
            <p>
              <span className="font-semibold">Start Time:</span>{" "}
              {startTimeConverted ?? "N/A"}
            </p>
            <p>
              <span className="font-semibold">Return Time:</span>{" "}
              {rental.returnTime?.toString() ?? "N/A"}
            </p>
            <p>
              <span className="font-semibold">Total Cost:</span>
              {`$ ${rental.totalCost === 0 ? "N/A" : rental.totalCost}`}
            </p>
            <p className="text-orange-600">
              <span className="font-semibold text-black dark:text-slate-300">
                Rent Status:
              </span>
              {` ${!rental.isPaid ? "Active" : "Closed"}`}
            </p>
          </CardContent>
          {!rental.isPaid && (
            <CardFooter className="p-0 mt-4">
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-white dark:text-slate-300">
                Pay Now
              </Button>
            </CardFooter>
          )}
        </div>
        <div className="sm:w-1/3 p-4">
          <div className="relative w-full h-48 sm:h-full overflow-hidden rounded-lg">
            <img
              src={rental?.bikeId?.image ?? placeholderImg}
              alt={rental.bikeId?.name}
              className="w-full h-full object-cover rounded-lg hover:transition-transform transition-transform hover:scale-125"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RentalCard;
