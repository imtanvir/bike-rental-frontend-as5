import BookingModal from "@/components/BookingModal";
import NoDataAvailable from "@/components/NoDataAvailable";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/hooks/hooks";
import { currentUser, userCurrentToken } from "@/redux/features/auth/authSlice";
import { useGetSingleBikeMutation } from "@/redux/features/bike/bikeApi";
import { TUser } from "@/redux/features/profile/profileSlice";
import { jwtDecode } from "jwt-decode";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Link, Navigate, useParams } from "react-router-dom";

const BikeDetails = () => {
  const token = useAppSelector(userCurrentToken);
  const { id } = useParams();
  const [bikeData, { data: bike }] = useGetSingleBikeMutation();
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useAppSelector(currentUser);
  useEffect(() => {
    setLoading(true);
    const res = async () => {
      const response = await bikeData(id);
      if (response?.error) {
        setHasError(true); // Set error state when there's an error
      } else {
        setHasError(false);
      }
      setLoading(false);
    };

    res();
  }, [id, bikeData]);

  const handleAuth = () => {
    if (token) {
      const decoded: TUser = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // If token expired
      if ((decoded.exp as number) < currentTime) {
        <Navigate to={"/login"} replace={true} />;
      }
    }
  };

  if (loading) {
    return (
      <section className="relative h-[80vh]">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex md:flex-row flex-col-reverse py-20 md:items-end items-center justify-center gap-4 poppins-0regular dark:text-slate-300">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 md:text-xl text-sm  text-indigo-700 dark:text-slate-300 transition ease-in-out duration-150 cursor-not-allowed">
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
            Loading...
          </div>
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="relative h-[80vh]">
        <NoDataAvailable />
      </section>
    );
  }
  return (
    <section className="dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50 bg-gradient-to-b from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto poppins-regular dark:text-slate-300">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex justify-between items-center">
              <p>{bike?.data?.name}</p>
              <Link
                to={"/all-bike"}
                className="flex gap-2 text-base text-slate-300 poppins-regular items-center rounded bg-indigo-700 p-2"
              >
                back
                <FaArrowRight className="text-sm" />
              </Link>
            </CardTitle>
            <CardDescription>
              {bike?.data?.brand} - {bike?.data?.year}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <img
                src={bike?.data?.image?.[0]?.url ?? ""}
                alt={bike?.data?.name}
                className="w-full h-full object-cover hover:transition-transform transition hover:scale-125"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold">
                ${bike?.data?.pricePerHour}
              </span>
              <Badge
                className={`text-base py-1 px-3 ${
                  bike?.data?.isAvailable
                    ? "bg-lime-400 text-slate-800 dark:bg-lime-400 dark:text-slate-800"
                    : "bg-gray-300 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {bike?.data?.isAvailable ? "Available" : "Not Available"}
              </Badge>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{bike?.data?.description}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Engine</h4>
                  <p>{bike?.data?.cc} CC</p>
                </div>
                <div>
                  <h4 className="font-medium">Year</h4>
                  <p>{bike?.data?.year}</p>
                </div>
                <div>
                  <h4 className="font-medium">Weight</h4>
                  <p>{bike?.data?.weight}</p>
                </div>
                <div>
                  <h4 className="font-medium">Frame Size</h4>
                  <p>{bike?.data?.frameSize}</p>
                </div>
                <div>
                  <h4 className="font-medium">Tire Size</h4>
                  <p>{bike?.data?.tireSize}</p>
                </div>
                <div>
                  <h4 className="font-medium">Gears</h4>
                  <p>{bike?.data?.gears}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside grid grid-cols-2 gap-2">
                {bike?.data?.features?.map((feature: string) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(bike?.data?.rating ?? 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">
                  {bike?.data?.rating === 0 ? "Not rated" : bike?.data?.rating}
                </span>
                {bike?.data?.rating !== 0 && (
                  <span className="text-gray-600">
                    ({bike?.data?.totalRating} reviews)
                  </span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter
            className={`${
              user?.role === "superAdmin" || user?.role === "admin"
                ? "hidden"
                : ""
            }`}
          >
            {user?.role === "user" && (
              <Dialog open={isMainOpen} onOpenChange={setIsMainOpen}>
                <DialogTrigger asChild>
                  <Button
                    className={`${
                      !bike?.data?.isAvailable
                        ? "cursor-not-allowed dark:bg-slate-700"
                        : ""
                    } w-full text-lg py-6 bg-indigo-800 text-white hover:bg-indigo-700 dark:text-slate-200`}
                    disabled={!bike?.data?.isAvailable}
                    onClick={() => handleAuth()}
                  >
                    Book Now
                  </Button>
                </DialogTrigger>
                <BookingModal
                  bikeId={bike?.data?._id}
                  setIsMainOpen={setIsMainOpen}
                />
              </Dialog>
            )}
            {!user?.role && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    aria-readonly={true}
                    className="w-full text-lg py-6 bg-indigo-800 text-white hover:bg-indigo-700 dark:text-slate-200"
                  >
                    Book Now
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[90%] flex flex-col bg-indigo-100 dark:bg-gradient-to-b dark:from-background dark:to-muted">
                  <span className="flex justify-end">
                    <AlertDialogCancel className="w-10 h-10 p-0">
                      <IoMdClose className="text-xl" />
                    </AlertDialogCancel>
                  </span>
                  <AlertDialogTitle>
                    <p className="text-lg">
                      Please log in to continue the booking!
                    </p>
                  </AlertDialogTitle>
                  <span className="flex justify-end">
                    <Link to={"/login"}>
                      <Button className="dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:text-slate-300">
                        Log in
                      </Button>
                    </Link>
                  </span>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default BikeDetails;
