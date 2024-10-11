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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppSelector } from "@/hooks/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useReturnBikeByUserMutation } from "@/redux/features/booking/bookingApi";
import { TBooking } from "@/redux/features/booking/rentalSlice";
import { useCreateTestimonialMutation } from "@/redux/features/testimonial/testimonialApi";
import { timeConverter } from "@/utils/timeConverter";
import moment from "moment";
import { MutableRefObject, useState } from "react";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RiInformationLine } from "react-icons/ri";
import Rating from "react-rating";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import placeholderImg from "../assets/images/banner.png";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Textarea } from "./ui/textarea";

const RentalCard = ({
  rental,
  reviewRef,
}: {
  rental: TBooking;
  reviewRef: MutableRefObject<number>;
}) => {
  const [createTestimonial] = useCreateTestimonialMutation();
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isReturned, setIsReturned] = useState(false);
  const [returnBike] = useReturnBikeByUserMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bikeRating, setBikeRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector(currentUser);
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

  const handleFeedback = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length <= 200) {
      setFeedback(value);
    }
  };
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleTestimonialSubmit = async () => {
    setIsProcessing(true);
    const toastId = toast.loading("Sending feedback...");
    try {
      const data = {
        userId: rental?.userId?._id,
        bikeId: rental?.bikeId?._id,
        message: feedback,
        rating: bikeRating,
      };

      const response = await createTestimonial({
        data,
        bikeTotalRating: rental?.bikeId?.totalRating,
        rentalId: rental?._id,
      });
      if (response?.data?.success === true) {
        setIsReviewed(true);
        reviewRef.current = reviewRef.current + 1;
        setIsProcessing(false);
        toast.success("Thank you for your feedback", { id: toastId });
        setTimeout(() => {
          setIsDialogOpen(false);
          navigate(`/${user?.role}/dashboard/rentals`);
        }, 1000);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <>
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
              <span
                className={`${
                  rental?.getBackAmount && rental?.getBackAmount > 0
                    ? "block"
                    : "hidden"
                }`}
              >
                You Get Back: ${rental?.getBackAmount}
              </span>
              <p className="flex gap-4 items-center">
                <span>
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
                </span>
                <Button
                  disabled={rental?.feedBackSubmitted as boolean}
                  onClick={() => setIsDialogOpen(true)}
                  className={`${
                    rental?.feedBackSubmitted !== false ||
                    (rental?.isPaid && rental?.feedBackSubmitted !== false) ||
                    (isReviewed === false && reviewRef.current === 1) ||
                    (isReviewed === true && reviewRef.current === 1) ||
                    (isReviewed === false &&
                      rental?.pendingCalculation === true) ||
                    (isReviewed === false &&
                      rental?.pendingCalculation === false &&
                      !rental?.isPaid) ||
                    (isReviewed === false &&
                      rental?.pendingCalculation === true &&
                      !rental?.isPaid)
                      ? "hidden"
                      : ""
                  } bg-yellow-500 hover:bg-yellow-600 h-7`}
                >
                  Review
                </Button>
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
                      <DialogTitle></DialogTitle>
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
                        Admin will review your bike return and when calculate
                        the cost, then you can pay.
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
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="flex flex-col  bg-indigo-600 ">
          <div className="flex justify-end">
            <AlertDialogCancel
              onClick={handleClose}
              className="w-10 h-10 p-0 flex"
            >
              <IoMdClose className="text-xl" />
            </AlertDialogCancel>
          </div>
          <AlertDialogTitle>
            <span className="md:text-3xl text-xl block bebas-neue-regular">
              Share your experience with us
            </span>
            <span className="block">Your feedback will help us improve.</span>
          </AlertDialogTitle>
          <Textarea
            className="text-slate-800 text-base bg-indigo-200 focus:ring-0 focus:ring-offset-0 focus:border-0 border-0 border-transparent outline-none"
            placeholder="Write your ride experience with us."
            name="feedback"
            value={feedback}
            onChange={handleFeedback}
          />
          <span className="text-slate-800 text-sm">
            Write within 200 characters.
          </span>
          <div className="flex justify-between">
            <div className="flex gap-2 items-center flex-row box-content">
              <span className="text-lg block">Rating</span>
              {/* @ts-expect-error there is a version miss-match in the source */}
              <Rating
                emptySymbol={
                  <CiStar className="text-white  text-lg md:text-2xl" />
                }
                fullSymbol={
                  <FaStar className="text-[#f59e0b] text-lg md:text-2xl" />
                }
                initialRating={bikeRating}
                start={0}
                stop={5}
                step={1}
                fractions={2}
                onChange={(bikeRating: number) => setBikeRating(bikeRating)}
                readonly={false}
                className="pt-2"
              />{" "}
              {bikeRating !== 0 ? (
                <span className="font-semibold">
                  {bikeRating}
                  {" / "}5
                </span>
              ) : (
                ""
              )}
            </div>
            <Button
              disabled={isProcessing}
              onClick={handleTestimonialSubmit}
              className="w-1/4 bg-blue-500 text-white hover:bg-blue-500/80"
            >
              {isProcessing ? "Processing..." : "Submit"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RentalCard;
