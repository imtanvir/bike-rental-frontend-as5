import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import {
  useCreateCouponMutation,
  useGetCouponsQuery,
} from "@/redux/features/coupon/couponApi";
import {
  currentCoupons,
  setCoupons,
  TCoupon,
} from "@/redux/features/coupon/couponSlice";
import moment from "moment-timezone";
import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import bikeWheel from "../assets/images/wheel.png";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
const options = [
  { value: "5%", color: "#6c00d6" },
  { value: "10%", color: "#5200a3" },
  { value: "25%", color: "#6c00d6" },
  { value: "30%", color: "#5200a3" },
];

const CouponWheel = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(currentUser);
  const allCoupons = useAppSelector(currentCoupons);
  const [createCoupon] = useCreateCouponMutation();

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [discount, setDiscount] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const { data } = useGetCouponsQuery(undefined);
  useEffect(() => {
    if (data) {
      dispatch(setCoupons({ data: data.data }));
    }
  }, [data]);
  useEffect(() => {
    if (couponCheckRef.current === 0 && user) {
      const couponExist = allCoupons?.find(
        (coupon: TCoupon) => coupon.userId?._id === user?._id
      );
      if (couponExist) {
        setCouponCheck(couponExist);
        couponCheckRef.current += 1;
      } else {
        setCouponCheck(null);
      }
    }
  }, [allCoupons, user]);

  useEffect(() => {
    if (wheelRef.current) {
      wheelRef.current.style.transition = `transform 5s ease-out`; // Ensure the spin lasts 5 seconds
      wheelRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }, [rotation]);

  const couponWheelRef = useRef<true | null>(null);
  const [couponCheck, setCouponCheck] = useState<TCoupon | null>(null);
  const couponCheckRef = useRef<number>(0);

  const spinWheel = () => {
    if (["user"].includes(user?.role as string)) {
      if (isSpinning) return;

      setIsSpinning(true);
      setSelectedOption(null);

      const spinRotation = 360 * 5 + Math.random() * 360; // Spin at least 5 times
      const newRotation = rotation + spinRotation;
      setRotation(newRotation);

      // Calculate the duration for the spin
      const spinDuration = 5000; // 5 seconds

      // Start the spin
      setTimeout(async () => {
        setIsSpinning(false);
        const normalizedRotation = ((newRotation % 360) + 360) % 360;
        const selectedIndex = Math.floor(
          ((360 - normalizedRotation) / 360) * options.length
        );
        const discount = options[selectedIndex].value;
        const createTime = moment(new Date(), "HH:mm")
          .tz(moment.tz.guess(), true)
          .toDate();
        const createCode = new Date().toISOString();

        const couponCode = new Date(createCode).getTime().toString();
        const data = {
          couponCode,
          userId: user?._id as string,
          createDate: createTime.toISOString(),
          discount: parseInt(discount.slice(0, -1)),
          isUsed: false,
          isExpired: false,
        };
        const response = await createCoupon(data);
        if (response.data.success === true) {
          couponWheelRef.current = true;
          setSelectedOption(couponCode);
          setDiscount(discount);
          setIsLoading(false);
          dispatch(setCoupons({ data: [...allCoupons, response?.data?.data] }));
        }
      }, spinDuration);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (data: string) => {
    navigator.clipboard.writeText(data).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <section className=" bg-indigo-100 dark:bg-gradient-to-b dark:from-background dark:to-muted">
      <div className=" flex lg:flex-row flex-col gap-4 items-center md:py-32 py-16 container mx-auto">
        <div>
          <h1 className="text-center md:text-6xl text-4xl bebas-neue-regular">
            Experience Your Next Ride with an Exclusive{" "}
            <span className="text-indigo-500">Discount</span>.
            <br /> Spin the Wheel and Unlock Your{" "}
            <span className="text-indigo-500">Coupon</span>!
          </h1>
        </div>
        <div className="container mx-auto flex md:flex-row flex-col justify-end gap-5 md:items-end items-center poppins-regular">
          <div className="relative w-64 h-64 mb-8">
            <div className="relative w-full h-full z-20">
              <img
                src={bikeWheel}
                className="w-full absolute custom-spin-slow"
                alt="wheel"
              />
            </div>
            <div
              ref={wheelRef}
              className="z-30 top-8 left-8 w-[75%] h-[75%] absolute overflow-hidden rounded-full transition-transform duration-5000 ease-out"
              style={{
                background: `conic-gradient(
              ${options[0].color} 0deg 90deg,
              ${options[1].color} 90deg 180deg,
              ${options[2].color} 180deg 270deg,
              ${options[3].color} 270deg 360deg
            )`,
              }}
              aria-hidden="true"
            >
              {options.map((option, index) => (
                <div
                  key={option.value}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold"
                  style={{
                    transform: `rotate(${
                      index * 90
                    }deg) translateY(-40px) translateX(40px)`,
                    transformOrigin: "center center",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {option.value}
                </div>
              ))}
            </div>
            <div
              className="absolute top-0 left-[50%] transform -translate-x-1/2 rotate-[180deg] text-white font-bold"
              style={{ zIndex: 30 }}
            >
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-yellow-400" />
            </div>
          </div>
          <div className="flex flex-col">
            {["user"].includes(user?.role as string) &&
            !couponCheck &&
            couponWheelRef.current === null ? (
              <Button
                onClick={() => {
                  spinWheel();
                  setIsLoading(!isLoading);
                }}
                disabled={isSpinning}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-pulse animate-infinite animate-ease-linear hover:animate-none"
              >
                {isSpinning ? "Spinning..." : "Spin the Wheel"}
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    aria-readonly={true}
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-pulse animate-infinite animate-ease-linear hover:animate-none"
                  >
                    Spin the Wheel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[90%] flex flex-col items-end bg-indigo-100 dark:bg-gradient-to-b dark:from-background dark:to-muted">
                  <AlertDialogCancel className="w-10 h-10 p-0">
                    <IoMdClose className="text-xl" />
                  </AlertDialogCancel>
                  <AlertDialogTitle>
                    <p>
                      {user && user.role !== "user"
                        ? "User only can use the coupon wheel to get coupon from here!"
                        : (user && user?.role === "user" && couponCheck) ||
                          (user &&
                            user?.role === "user" &&
                            couponWheelRef.current === true)
                        ? "You must use your previous coupon, otherwise you can't get another!"
                        : "Log in to use the coupon wheel and get the best discount!"}
                    </p>
                  </AlertDialogTitle>
                  {!user && (
                    <Link to={"/login"}>
                      <Button className="dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:text-slate-300">
                        Log in
                      </Button>
                    </Link>
                  )}
                </AlertDialogContent>
              </AlertDialog>
            )}

            {!isLoading ? (
              <div className={`${selectedOption ? "visible" : "invisible"}`}>
                <p
                  className="pb-2 pt-4 text-lg font-semibold"
                  aria-live="polite"
                >
                  You got <span className="text-indigo-500">{discount}</span>{" "}
                  discount coupon!
                </p>
                <div className="relative inline-flex items-center">
                  <input
                    type="text"
                    value={selectedOption || ""}
                    readOnly
                    className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                  />
                  <button
                    onClick={() => handleCopy(selectedOption || "")}
                    className="ml-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center"
                  >
                    {copied ? (
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 12"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5.917 5.724 10.5 15 1.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                      </svg>
                    )}
                  </button>
                  {copied && (
                    <div className="absolute bottom-[-1.5rem] left-0 bg-gray-900 text-white text-xs rounded-lg p-1 shadow-lg">
                      Copied!
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-2">
                <p className="bg-clip-text text-transparent bg-gradient-to-tr from-violet-700 to-pink-600 text-left">
                  Loading Coupon...
                </p>
                <input
                  type="text"
                  value={""}
                  readOnly
                  disabled={true}
                  className=" border  text-sm rounded-lg p-2.5 invisible"
                />
                <button className="ml-2     rounded-lg p-2 inline-flex items-center invisible">
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CouponWheel;
