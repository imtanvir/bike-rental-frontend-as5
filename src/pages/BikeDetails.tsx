import BookingModal from "@/components/BookingModal";
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
import { userCurrentToken } from "@/redux/features/auth/authSlice";
import { useGetSingleBikeMutation } from "@/redux/features/bike/bikeApi";
import { TUser } from "@/redux/features/profile/profileSlice";
import { jwtDecode } from "jwt-decode";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

const BikeDetails = () => {
  const token = useAppSelector(userCurrentToken);
  const { id } = useParams();
  const [bikeData, { data: bike }] = useGetSingleBikeMutation();

  useEffect(() => {
    const res = async () => {
      await bikeData(id);
    };

    res();
  }, []);
  const handleAuth = () => {
    if (token) {
      const decoded: TUser = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // If token expired, try refreshing the access token
      if ((decoded.exp as number) < currentTime) {
        <Navigate to={"/login"} replace={true} />;
      }
    }
  };
  const [isMainOpen, setIsMainOpen] = useState(false);

  return (
    <section className="dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50 bg-gradient-to-b from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto poppins-regular dark:text-slate-300">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {bike?.data?.name}
            </CardTitle>
            <CardDescription>
              {bike?.data?.brand} - {bike?.data?.year}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <img
                src={bike?.data?.image ?? ""}
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
          <CardFooter>
            <Dialog open={isMainOpen} onOpenChange={setIsMainOpen}>
              <DialogTrigger asChild>
                {/* <Button variant="outline">Edit Profile</Button> */}
                <Button
                  className={`${
                    !bike?.data?.isAvailable ? "cursor-not-allowed" : ""
                  } w-full text-lg py-6 bg-indigo-800 text-white hover:bg-indigo-700 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600`}
                  disabled={!bike?.data?.isAvailable}
                  onClick={() => handleAuth()}
                >
                  Book Now
                </Button>
              </DialogTrigger>
              <BookingModal
                id={bike?.data?._id}
                setIsMainOpen={setIsMainOpen}
              />
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default BikeDetails;
