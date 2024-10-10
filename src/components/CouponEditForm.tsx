import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/hooks";
import { useSingleCouponUpdateMutation } from "@/redux/features/coupon/couponApi";
import { setCoupons, TCoupon } from "@/redux/features/coupon/couponSlice";
import { timeConverter } from "@/utils/timeConverter";
import React, { useState } from "react";
import { toast } from "sonner";
import { Label } from "./ui/label";

const CouponEditForm = ({
  allCoupon,
  coupon,
  isProcessing,
  isEditing,
  setIsProcessing,
  setIsEditing,
}: {
  allCoupon: TCoupon[];
  coupon: TCoupon;
  isProcessing: boolean;
  isEditing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [updateCoupon] = useSingleCouponUpdateMutation();
  const dispatch = useAppDispatch();
  
  const [couponData, setCouponData] = useState({
    couponCode: coupon?.couponCode ?? "",
    userId: coupon?.userId?._id ?? "",
    discount: coupon?.discount ?? 0,
    isExpired: coupon?.isExpired ?? false,
    createDate: timeConverter(coupon?.createDate as Date) ?? "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "discount") {
      let numericValue = parseFloat(value.replace(/\D/g, ""));
      numericValue = isNaN(numericValue)
        ? 0
        : Math.min(Math.max(numericValue, 0), 99);
      setCouponData((prevUser) => ({
        ...prevUser,
        [name]: numericValue,
      }));
    } else if (name === "expired") {
      setCouponData((prevUser) => ({
        ...prevUser,
        [name]: value === "true" ? true : false,
      }));
    } else {
      setCouponData((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Coupon Data updating...");
    setIsProcessing(!isProcessing);

    const couponDataUpdate = {
      couponCode: couponData.couponCode,
      userId: couponData.userId,
      discount: couponData.discount,
      isExpired: couponData.isExpired,
    };

    const queryData = {
      id: coupon?._id,
      data: couponDataUpdate,
    };
    const response = await updateCoupon(queryData);
    if (response?.data?.success === true) {
      const updatedCoupon = allCoupon.map((coupon) =>
        coupon._id === response?.data?.data?._id
          ? { ...coupon, ...response.data.data }
          : coupon
      );

      dispatch(setCoupons({ data: updatedCoupon }));

      toast.success("Coupon updated successfully", {
        id: toastId,
        duration: 2000,
        className: "bg-green-500 text-white border-green-400",
      });
      setIsProcessing(false);
      setIsEditing(false);
    } else {
      toast.error("Something went wrong", { id: toastId });
    }
  };
  return (
    <section className="dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50 bg-gradient-to-b from-green-50 to-blue-50 px-5 py-10 mt-5 shadow-md rounded-md">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <h1 className=" bebas-neue-regular text-3xl">Edit Coupon Details</h1>
        </div>
        <Button
          className=" bg-orange-400 hover:bg-orange-500 dark:text-slate-900 p-medium "
          onClick={() => {
            setIsProcessing(false);
            setIsEditing(!isEditing);
          }}
        >
          Cancel
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2 ">
        <div className="grid md:grid-cols-2 grid-cols-1  gap-4">
          <div className="space-y-2">
            <Label htmlFor="coupon">Coupon</Label>
            <Input
              className="dark:bg-slate-900"
              id="coupon"
              name="coupon"
              value={couponData.couponCode}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="created">Created</Label>
            <Input
              className="dark:bg-slate-900"
              id="created"
              name="created"
              value={couponData.createDate as string}
              readOnly
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount</Label>
            <Input
              className="dark:bg-slate-900"
              id="discount"
              name="discount"
              type="text"
              value={couponData.discount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricePerHour">User Id</Label>
            <Input
              className="dark:bg-slate-900"
              id="pricePerHour"
              name="pricePerHour"
              placeholder="Enter the user id for who own the coupon"
              type="text"
              value={couponData.userId}
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="available">Expired</Label>
            <select
              id="isAvailable"
              name="isAvailable"
              value={`${couponData.isExpired}`}
              onChange={handleInputChange}
              className="w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md bg-white dark:bg-slate-900 border"
            >
              <option key={"true"} value={"true"}>
                Yes
              </option>
              <option key={"false"} value={"false"}>
                No
              </option>
            </select>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              className="bg-indigo-800 text-white hover:bg-indigo-700  dark:text-slate-100 w-full"
              disabled={isProcessing}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CouponEditForm;
