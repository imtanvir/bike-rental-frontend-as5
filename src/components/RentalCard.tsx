import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useReturnBikeByUserMutation } from "@/redux/features/booking/bookingApi";
import { TBooking } from "@/redux/features/booking/rentalSlice";
import { timeConverter } from "@/utils/timeConverter";
import moment from "moment";
import { useState } from "react";
import { RiInformationLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import placeholderImg from "../assets/images/banner.png";

const RentalCard = ({ rental }: { rental: TBooking }) => {
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isReturned, setIsReturned] = useState(false);
  const [returnBike] = useReturnBikeByUserMutation();

  const startTimeIs = rental.startTime?.toString();
  const startTimeConverted = new Date(startTimeIs as string)
    .toLocaleString()
    .slice(0, 26);

  const handleReturnBike = async () => {
    const currentDateTime = new Date();
    const returnRentTime = moment(currentDateTime, "HH:mm").toDate();
    const response = await returnBike({
      data: { estimatedReturnTime: returnRentTime.toISOString() },
      id: rental._id,
    });

    if (response.data.success === true) {
      setIsReturned(true);
      setTimeout(() => {
        setIsMainOpen(false);
      }, 2000);
    }
  };
  const estReturnTime = new Date(rental.estimatedReturnTime as Date)
    .toLocaleString()
    .slice(0, 26);

  return (
    <Card className=" mb-6 animate-fade-left  shadow dark:bg-slate-800 dark:text-slate-300 bg-indigo-200">
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
              <span className="font-semibold">
                {rental.returnTime?.toString() && !rental.pendingCalculation
                  ? "Return Time"
                  : rental?.estimatedReturnTime
                  ? `Return Time(est)`
                  : "Return Time"}
                :
              </span>{" "}
              {rental.returnTime && !rental.pendingCalculation
                ? timeConverter(rental?.returnTime)
                : rental?.estimatedReturnTime
                ? estReturnTime
                : "Not returned yet."}
            </p>

            <p className="font-bold">
              <span className="font-semibold me-2">Total Cost:</span>
              {`${rental.totalCost === 0 ? ` N/A` : "$" + rental.totalCost}`}
            </p>
            <p>
              <span className="font-semibold text-black dark:text-slate-300">
                Rent Status:
              </span>
              <span
                className={` ms-2 px-1 rounded-sm ${
                  rental.isPaid
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 dark:bg-yellow-600 text-white"
                }`}
              >{` ${rental.isPaid ? "Paid & closed" : "Active"}`}</span>
            </p>
          </CardContent>
          {!rental.pendingCalculation &&
            !rental.estimatedReturnTime?.toString() && (
              <CardFooter className="p-0 mt-4">
                <Dialog open={isMainOpen} onOpenChange={setIsMainOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={handleReturnBike}
                      className="bg-blue-400 hover:bg-blue-500 text-white dark:text-slate-100"
                    >
                      Return Bike
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] w-[90%]">
                    <DialogHeader>
                      <DialogDescription>
                        {!isReturned && (
                          <span className="flex items-center justify-center p-10 text-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </span>
                        )}
                        {isReturned && (
                          <span className="text-green-500 text-xl text-center p-10">
                            Returned Successfully
                          </span>
                        )}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            )}
          {rental.pendingCalculation && (
            <CardFooter className="p-0 mt-4">
              <Button
                aria-readonly={true}
                className="bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-slate-800 dark:text-slate-200 cursor-not-allowed"
              >
                Pending Cost Calculate
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button>
                      <RiInformationLine className="font-bold text-slate-800 dark:text-slate-50 text-xl ms-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Admin will review your bike return and when calculate the
                      cost, then you can pay.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          )}
          {!rental.isPaid &&
            !rental.pendingCalculation &&
            rental.estimatedReturnTime && (
              <CardFooter className="p-0 mt-4">
                <Link
                  to={`/payment/${rental._id}`}
                  className="py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white dark:text-slate-100"
                >
                  Pay Now
                </Link>
              </CardFooter>
            )}
        </div>
        <div className="sm:w-1/3 p-4">
          <div className="relative w-full h-48 sm:h-full overflow-hidden rounded-lg">
            <img
              src={rental?.bikeId?.image?.[0]?.url ?? placeholderImg}
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
