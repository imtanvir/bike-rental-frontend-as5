import Checkout from "@/components/Checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSingleBikeMutation } from "@/redux/features/bike/bikeApi";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const { id } = useParams();
  const [bikeData, { data: bike }] = useGetSingleBikeMutation();
  useEffect(() => {
    const res = async () => {
      await bikeData(id);
    };

    res();
  }, [bikeData, id]);

  return (
    <>
      <section className=" dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50 bg-gradient-to-b from-green-50 to-blue-50">
        <div className="container py-32 mx-auto">
          <h1 className="text-left md:text-6xl text-4xl bebas-neue-regular py-5">
            Let's Advance to confirm your booking
          </h1>

          <div className="flex md:flex-row flex-col justify-center items-center gap-5">
            {bike?.success === true ? (
              <div className="max-w-sm rounded overflow-hidden shadow-lg bg-indigo-100 dark:bg-slate-800">
                <img
                  className="w-full"
                  src={bike?.data?.image}
                  alt={bike?.data?.name}
                />
                <div className="px-6 py-4">
                  <h1 className="font-bold text-xl mb-2 dark:text-slate-300">
                    {bike?.data?.name}
                  </h1>
                  <p className="text-gray-700 dark:text-slate-400 text-base">
                    {bike?.data?.model}
                  </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                  <h2 className="py-2 dark:text-slate-300">
                    Advance payment amount:{" "}
                    <span className="font-bold">100$</span>{" "}
                  </h2>
                  <h3 className=" poppins-regular dark:text-slate-300">
                    Rent:{" "}
                    <span className="font-bold">
                      ${bike?.data?.pricePerHour}/hr
                    </span>
                  </h3>
                  <form>
                    <div className="flex gap-2 flex-row">
                      <Input
                        type="text"
                        className="w-[70%]"
                        name="coupon"
                        value={bike?.data?._id}
                      />
                      <Button className="w-[30%]">Apply</Button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />{" "}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />{" "}
                  <Skeleton className="h-4 w-[200px]" />{" "}
                </div>
                <Skeleton className="h-4 w-[150px]" />{" "}
                <Skeleton className="h-4 w-[100px]" />
              </div>
            )}
            <Elements stripe={stripePromise}>
              <Checkout id={bike?.data._id} />
            </Elements>
          </div>
        </div>
      </section>
    </>
  );
};

export default Payment;
