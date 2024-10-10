import Checkout from "@/components/Checkout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetSingleBikeMutation } from "@/redux/features/bike/bikeApi";
import {
  useDiscountTotalCostApplyMutation,
  useGetSingleRentalQuery,
} from "@/redux/features/booking/bookingApi";
import {
  useCheckAndUseCouponMutation,
  useDeleteCouponMutation,
  useGetCouponsQuery,
} from "@/redux/features/coupon/couponApi";
import {
  currentCoupons,
  setCoupons,
  TCoupon,
} from "@/redux/features/coupon/couponSlice";
import { TBike } from "@/types/intex";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [getBike, { data: bike }] = useGetSingleBikeMutation();
  const [deleteCoupon] = useDeleteCouponMutation();
  const [getCouponData] = useCheckAndUseCouponMutation(undefined);
  const [discountTotalCostUpdate] = useDiscountTotalCostApplyMutation();
  const { data } = useGetCouponsQuery(undefined);
  const { data: singleRent, refetch } = useGetSingleRentalQuery(id);
  const singleRentData = useMemo(() => {
    return { rentDetails: singleRent?.data };
  }, [singleRent]);

  const [bikeData, setBikeData] = useState<TBike | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [isError, setIsError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [isCouponUsed, setIsCouponUsed] = useState<boolean>(false);
  const user = useAppSelector(currentUser);
  const allCoupons = useAppSelector(currentCoupons);
  const [couponCheck, setCouponCheck] = useState<TCoupon | null>(null);

  const [couponInput, setCouponInput] = useState<{ inputValue: string }>({
    inputValue: "",
  });

  useEffect(() => {
    const c = allCoupons?.find(
      (coupon: TCoupon) => coupon.userId?._id === user?._id
    );
    setCouponCheck(c as TCoupon);
  }, [allCoupons]);

  useEffect(() => {
    refetch();
    dispatch(setCoupons({ data: data?.data }));
  }, [refetch, data]);

  useEffect(() => {
    const res = async () => {
      await getBike(id);
    };

    res();
  }, [getBike, id]);

  useEffect(() => {
    if (bike?.success === true && singleRent === undefined) {
      setBikeData(bike.data);
    } else if (singleRent?.success === true && bike === undefined) {
      setBikeData(singleRent?.data?.bikeId);
    }
  }, [bike, singleRent]);

  const handleCouponInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCouponInput((prevInput) => ({
      ...prevInput,
      inputValue: value,
    }));
  };
  const [payAmount, setPayAmount] = useState(0);
  const [totalCost, setTotalCost] = useState<number>(
    singleRentData?.rentDetails?.totalCost ?? 0
  );
  useEffect(() => {
    if (singleRentData?.rentDetails?.totalCost) {
      setPayAmount(singleRentData?.rentDetails?.totalCost);
      setTotalCost(singleRentData?.rentDetails?.totalCost);
    } else if (bikeData?.isAvailable) {
      setPayAmount(100);
    }
  }, [singleRentData, bikeData]);

  useEffect(() => {
    if (singleRentData?.rentDetails?.totalCost) {
      setTotalCost(singleRentData.rentDetails.totalCost);
    }
  }, [totalCost]);

  const handleCouponApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    setIsError("");

    setCouponSuccess(null);

    if (
      couponInput.inputValue === undefined ||
      (couponInput.inputValue && couponInput.inputValue.trim().length) === 0
    ) {
      setIsApplying(false);
      setIsError("Enter a coupon to apply!");
      return;
    }
    if (singleRentData?.rentDetails.discountApplied) {
      setIsApplying(false);
      setIsError("Your rent has already been discounted!");
      return;
    }
    const data = {
      couponCode: couponInput.inputValue,
      userId: couponCheck?.userId?._id,
    };
    const couponServerResponse = await getCouponData(data);
    if (couponServerResponse?.data?.success === true) {
      const discount = couponServerResponse?.data?.data[0].discount;
      const onePercentOfTotalCost =
        (singleRentData?.rentDetails?.totalCost as number) / 100;
      const calculateDiscountTotalCost = discount * onePercentOfTotalCost;
      const data = {
        totalCost: calculateDiscountTotalCost.toFixed(2),
        id: singleRentData?.rentDetails?._id,
      };
      const rentalUpdateRes = await discountTotalCostUpdate(data);

      if (rentalUpdateRes?.data?.success === true) {
        const deleteUsedCoupon = await deleteCoupon(
          couponServerResponse?.data?.data[0]?._id
        );
        setIsCouponUsed(true);
        if (deleteUsedCoupon?.data?.success === true) {
          setTotalCost(rentalUpdateRes?.data?.data?.totalCost);
          setCouponInput({ inputValue: "" });
          setIsApplying(false);
          setCouponSuccess("Coupon Applied Successfully!");
          setIsError(null);

          refetch();
        }
      }
    } else {
      setIsApplying(false);
      setIsError("Coupon is invalid or expired!");
    }
  };

  const couponApplyHandler = (coupon: string) => {
    setCouponInput((prevInput) => ({
      ...prevInput,
      inputValue: coupon,
    }));
  };
  return (
    <>
      <section className=" dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50 bg-gradient-to-b from-green-50 to-blue-50">
        <div className="container md:py-32 py-16 mx-auto">
          <h1 className="text-left md:text-6xl text-4xl bebas-neue-regular py-5">
            {bikeData?.isAvailable
              ? "Let's Advance to confirm your booking"
              : "Let's pay your bike rent cost!"}
          </h1>

          <div className="flex md:flex-row flex-col justify-center items-center gap-5">
            {bikeData ? (
              <div className="max-w-sm rounded overflow-hidden shadow-lg bg-indigo-100 dark:bg-slate-800">
                <img
                  className="w-full"
                  src={bikeData?.image?.[0]?.url}
                  alt={bikeData?.name}
                />
                <div className="px-6 py-4">
                  <h1 className="font-bold text-xl mb-2 dark:text-slate-300">
                    {bikeData?.name}
                  </h1>
                  <p className="text-gray-700 dark:text-slate-400 text-base">
                    {bikeData?.model}
                  </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                  <h2 className="py-2 dark:text-slate-300">
                    {`${
                      bikeData?.isAvailable
                        ? "Advance payment amount $100"
                        : `Total payment Amount $${singleRentData?.rentDetails?.totalCost}`
                    }`}
                  </h2>
                  <h3 className=" poppins-regular dark:text-slate-300">
                    {singleRentData?.rentDetails && !bikeData.isAvailable
                      ? "Total Cost:"
                      : "Price"}
                    <span className="font-bold ms-1">
                      $
                      {singleRentData?.rentDetails && !bikeData.isAvailable
                        ? totalCost
                        : bikeData?.pricePerHour + " /hr"}
                    </span>
                  </h3>
                  {singleRentData?.rentDetails && (
                    <div>
                      <form
                        onSubmit={handleCouponApply}
                        className=" py-3 border-t border-gray-400"
                      >
                        <div className="flex flex-col gap-2">
                          <h3 className="font-semibold">
                            Apply if you have any coupon!
                          </h3>
                          <div className="flex gap-2 flex-row pt-2">
                            <Input
                              type="text"
                              className="w-[70%]"
                              name="coupon"
                              placeholder="Enter coupon code"
                              onChange={handleCouponInput}
                              value={couponInput.inputValue}
                            />
                            <Button
                              disabled={isApplying}
                              className={`${
                                isApplying ? "cursor-not-allowed" : ""
                              } w-[30%] bg-indigo-500 hover:bg-indigo-600 text-white`}
                            >
                              {isApplying ? "Applying..." : "Apply"}
                            </Button>
                          </div>
                        </div>
                        {!isCouponUsed && couponCheck?.couponCode && (
                          <p className="pt-2">
                            Use your {couponCheck?.discount}% coupon code:{" "}
                            <Badge
                              onClick={() =>
                                couponApplyHandler(
                                  couponCheck?.couponCode as string
                                )
                              }
                              className="bg-indigo-800 cursor-pointer hover:bg-indigo-900 text-white"
                            >
                              {couponCheck?.couponCode}
                            </Badge>{" "}
                          </p>
                        )}
                      </form>
                      <p
                        className={`${
                          couponSuccess ? "block" : "hidden"
                        } py-2 text-green-500 font-semibold`}
                      >
                        {couponSuccess ?? ""}
                      </p>
                      <p
                        className={`${
                          isError ? "block" : "hidden"
                        } py-2 text-center text-base text-yellow-500 font-semibold`}
                      >
                        {isError ?? ""}
                      </p>
                    </div>
                  )}
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
              <Checkout
                payAmount={payAmount}
                id={bikeData?._id as string}
                bikeDetails={bikeData as TBike}
                userId={user?._id as string}
                rentId={
                  singleRentData?.rentDetails?._id
                    ? (singleRentData?.rentDetails._id as string)
                    : null
                }
              />
            </Elements>
          </div>
        </div>
        <p className="text-center text-yellow-600 dark:text-yellow-600 pb-5 md:font-semibold font-medium ">
          Note: Please do not reload the page while payment is processing,
          otherwise it could be fail.
        </p>
      </section>
    </>
  );
};

export default Payment;
