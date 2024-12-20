import { useAppSelector } from "@/hooks/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import {
  useRentABikeMutation,
  useRentPaidUpdateMutation,
} from "@/redux/features/booking/bookingApi";
import { useMakeAdvancePaymentMutation } from "@/redux/features/payment/paymentApi";
import { TUser } from "@/redux/features/profile/profileSlice";
import { useStartTime } from "@/redux/features/rentTime/RentTimeSlice";
import { useCreateTestimonialMutation } from "@/redux/features/testimonial/testimonialApi";
import { TBike } from "@/types/intex";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useRef, useState } from "react";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Rating from "react-rating";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const Checkout = ({
  id,
  payAmount,
  userId,
  bikeDetails,
  rentId = null,
}: {
  id: string;
  payAmount: number;
  userId: string | null;
  bikeDetails: TBike;
  rentId?: string | null;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [err, setErr] = useState("");
  const startTime = useAppSelector(useStartTime);
  const [rentABike] = useRentABikeMutation(undefined);
  const [rentPaidUpdate] = useRentPaidUpdateMutation();
  const [makePayment] = useMakeAdvancePaymentMutation(undefined);
  const [createTestimonial] = useCreateTestimonialMutation();
  const [clientSecret, setClientSecret] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [processing, setProcessing] = useState(false);
  const user = useAppSelector(currentUser);
  const paymentRef = useRef(0);
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bikeRating, setBikeRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (bikeDetails?.isAvailable && startTime?.rentStartTime === null) {
      navigate(`/bike-details/${id}`);
    }

    const advancePayment = async () => {
      const response = await makePayment({
        amount: payAmount,
      });
      setClientSecret(response.data.data.clientSecret);
    };

    if (paymentRef.current === 0 && payAmount !== 0) {
      paymentRef.current = 1;
      advancePayment();
    }
  }, [payAmount, startTime?.rentStartTime]);

  const handleErr = () => {
    if (err) {
      setErr("");
    }
  };
  const handleFeedback = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length <= 200) {
      setFeedback(value);
    }
  };

  const handleTestimonialSubmit = async () => {
    setIsProcessing(true);
    const toastId = toast.loading("Sending feedback...");
    try {
      const data = {
        userId: userId,
        bikeId: bikeDetails?._id,
        message: feedback,
        rating: bikeRating,
      };
      const response = await createTestimonial({
        data,
        bikeTotalRating: bikeDetails?.totalRating,
        rentalId: rentId,
      });
      if (response?.data?.success === true) {
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

  const handleClose = () => {
    navigate(`/${user?.role}/dashboard/rentals`);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Payment processing...");

    setProcessing(true);
    if (!stripe || !elements) {
      return <div>Loading...</div>;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }

    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      setProcessing(false);
      setErr(error.message ?? "An unexpected error occurred.");
      toast.error("Something went wrong!", { id: toastId, duration: 2000 });
    } else {
      setProcessing(true);
      setErr("");
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: (user as TUser)?.email || "anonymous",
            name: (user as TUser)?.name || "anonymous",
          },
        },
      });

    if (confirmError) {
      toast.error(confirmError.message, { id: toastId, duration: 2000 });
    } else {
      if (paymentIntent.status === "succeeded") {
        if (bikeDetails.isAvailable) {
          const response = await rentABike({
            bikeId: id,
            startTime: startTime?.rentStartTime,
            advancePaid: 100,
          });
          if (response?.data?.success) {
            setTransactionId(paymentIntent.id);
            setProcessing(false);
            toast.success("Your payment was successful!", {
              id: toastId,
              duration: 2000,
              className: "bg-green-500 text-white border-green-400",
            });

            setTimeout(() => {
              setIsDialogOpen(false);
              navigate(`/${user?.role}/dashboard/rentals`);
            }, 2000);
          }
        } else if (bikeDetails.isAvailable === false && rentId) {
          const response = await rentPaidUpdate(rentId);
          if (response?.data?.success) {
            setTransactionId(paymentIntent.id);
            setProcessing(false);
            setIsDialogOpen(true);
            toast.success("Your payment was successful!", {
              id: toastId,
              duration: 2000,
              className: "bg-green-500 text-white border-green-400",
            });
          }
        }
      }
    }
  };

  const currentTheme = localStorage.getItem("ride-pro-theme");
  const options = {
    style: {
      base: {
        fontSize: "16px",
        fontFamily: "'Poppins', sans-serif",
        color: currentTheme === "light" ? "#000000" : "#e2e8f0",
        "::placeholder": {
          color: "#a0aec0",
          fontStyle: "italic",
        },
        iconColor: currentTheme === "light" ? "#4a5568" : "#cbd5e0",
        letterSpacing: "0.025em",
        padding: "12px 10px",
      },
      invalid: {
        color: "#e53e3e",
        iconColor: "#e53e3e",
      },
      complete: {
        color: "#38a169",
        iconColor: "#38a169",
      },
    },
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className=" px-5 md:py-10 flex flex-col gap-2 md:w-1/2 w-full mx-auto bg-white/50 dark:bg-gray-800/20 backdrop-blur-md border border-white/100 dark:border-gray-700/30 shadow-lg rounded-lg p-6"
      >
        <CardElement
          onChange={handleErr}
          className="  dark:bg-gray-800/20 text-slate-900 backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-lg rounded-lg p-6"
          options={options}
        />
        <p className="text-red-500">{err}</p>
        <p className="font-semibold bebas-neue-regular dark:text-slate-300 md:text-lg text-base">
          Your card will be charged{" "}
          <span className="text-indigo-500">${payAmount}</span>
        </p>
        <Button
          type="submit"
          disabled={
            (!startTime?.rentStartTime && bikeDetails?.isAvailable) ||
            err.trim().length !== 0 ||
            payAmount === 0 ||
            !stripe ||
            !clientSecret ||
            processing ||
            transactionId.length > 1
          }
          className={`button ${
            (!startTime?.rentStartTime && bikeDetails?.isAvailable) ||
            !stripe ||
            !clientSecret ||
            err
              ? "bg-slate-500 cursor-not-allowed hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-700"
              : transactionId
              ? "bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 focus:ring-green-300"
              : "bg-indigo-700 hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 focus:ring-indigo-300"
          }  text-white  focus:ring-4 mt-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2 text-center `}
        >
          {processing && !err && (
            <span className="flex items-center justify-center">
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
          {!transactionId && !processing && <>Pay</>}
          {!processing && transactionId && <>Payment Successful</>}
        </Button>
        <p className="text-green-500">
          {transactionId && (
            <span>Your transaction id is: {transactionId}</span>
          )}
        </p>

        <p className="text-center">
          Power by <span className="text-indigo-500 font-thin">Stripe</span>
        </p>
      </form>
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
              Your payment successfully Completed!
            </span>
            <span className="block">Charged Amount : ${payAmount}+vat</span>
          </AlertDialogTitle>
          <Textarea
            className="text-slate-800 text-base bg-indigo-200 focus:ring-0 focus:ring-offset-0 focus:border-0 border-0 border-transparent outline-none"
            placeholder="Share your ride experience with us."
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

export default Checkout;
