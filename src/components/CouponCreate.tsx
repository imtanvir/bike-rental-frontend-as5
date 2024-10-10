import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  useCreateCouponMutation,
  useGetCouponsQuery,
} from "@/redux/features/coupon/couponApi";
import {
  currentCoupons,
  setCoupons,
  TCoupon,
} from "@/redux/features/coupon/couponSlice";
import { useGetAllUserQuery } from "@/redux/features/users/usersApi";
import { TUser } from "@/redux/features/users/usersSlice";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "./ui/label";

const CouponCreate = ({
  isProcessing,
  isCreating,
  setIsProcessing,
  setIsCreating,
  setNewCoupon,
}: {
  isProcessing: boolean;
  isCreating: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  setNewCoupon: React.Dispatch<React.SetStateAction<TCoupon | null>>;
}) => {
  const dispatch = useAppDispatch();
  const [userVerified, setUserVerified] = useState(false);
  const [createCoupon] = useCreateCouponMutation();
  const allCoupons = useAppSelector(currentCoupons);
  const createTime = moment(new Date(), "HH:mm")
    .tz(moment.tz.guess(), true)
    .toDate();

  const formattedCreateTime = createTime.toISOString();
  const convertedTime = new Date(formattedCreateTime)
    .toLocaleString()
    .slice(0, 26);
  const [couponData, setCouponData] = useState({
    couponCode: "",
    userId: "",
    discount: 0,
    isExpired: false,
    createDate: convertedTime,
  });
  const { data, refetch } = useGetAllUserQuery(undefined);
  const { data: coupons } = useGetCouponsQuery(undefined);

  useEffect(() => {
    dispatch(setCoupons({ data: coupons?.data }));
    refetch();
  }, [coupons, refetch]);

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
  const handleUserCheck = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const userIdTextParam = e.target.value;
    const filterUser = data?.data?.find(
      (user: TUser) => user?._id === userIdTextParam
    );

    if (filterUser) {
      setUserVerified(true);
      toast.success("User id verified", {
        className: "bg-green-500 text-white border-green-400 text-slate800",
        style: {
          color: "black",
          fontWeight: "bold",
        },
      });
    } else {
      setUserVerified(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(!isProcessing);
    const toastId = toast.loading("New Coupon inserting...");
    const couponDataCreate = {
      couponCode: couponData?.couponCode,
      userId: couponData?.userId,
      discount: couponData?.discount,
      isExpired: false,
      createDate: convertedTime,
      isUsed: false,
    };

    const response = await createCoupon(couponDataCreate);
    if (response?.data?.success === true) {
      dispatch(
        setCoupons({ data: [response?.data?.data[0], ...(allCoupons ?? [])] })
      );
      toast.success("Coupon created successfully!", {
        id: toastId,
        className: "bg-green-500 text-white border-green-400",
      });
      
      setNewCoupon(response?.data?.data as TCoupon);
      setIsProcessing(false);
      setIsCreating(false);
    } else {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <section className=" dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50 bg-gradient-to-b from-green-50 to-blue-50 px-5 py-10 mt-5 shadow-md rounded-md">
      <div className="flex justify-between">
        <h1 className="bebas-neue-regular text-3xl">Create A New Coupon</h1>
        <Button
          className="bg-orange-400 hover:bg-orange-500 dark:text-slate-900 p-medium"
          onClick={() => {
            setIsProcessing(false);
            setIsCreating(!isCreating);
          }}
        >
          Cancel
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2 ">
        <div className="grid md:grid-cols-2 grid-cols-1  gap-4">
          <div className="space-y-2">
            <Label htmlFor="couponCode">Coupon</Label>
            <Input
              className="dark:bg-slate-900"
              id="couponCode"
              name="couponCode"
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
            <Label htmlFor="userId">User Id</Label>
            <Input
              className="dark:bg-slate-900"
              id="userId"
              name="userId"
              placeholder="Enter the user id for who own the coupon"
              type="text"
              value={couponData.userId}
              onChange={(e) => {
                handleInputChange(e);
                handleUserCheck(e);
              }}
            />
          </div>
          <div>
            <Label htmlFor="available">Expired</Label>
            <select
              id="isAvailable"
              name="isAvailable"
              value={"false"}
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
        </div>
        <div className="flex flex-col justify-end pt-4">
          <Button
            className="bg-indigo-800 text-white hover:bg-indigo-700  dark:text-slate-100 w-full"
            disabled={userVerified === false}
            type="submit"
          >
            Create Coupon
          </Button>
          <div className=" py-3 text-center">
            <p
              className={`${
                userVerified === false ? "block" : "hidden"
              }  text-yellow-600 font-semibold`}
            >
              {userVerified === false
                ? "Enter an valid user id to enable Coupon Creation..."
                : ""}
            </p>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CouponCreate;
