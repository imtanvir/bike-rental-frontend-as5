import { RiDeleteBin6Line } from "react-icons/ri";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import CouponCreate from "@/components/CouponCreate";
import CouponEditForm from "@/components/CouponEditForm";
import NoDataAvailable from "@/components/NoDataAvailable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  useDeleteCouponMutation,
  useGetCouponsQuery,
} from "@/redux/features/coupon/couponApi";
import {
  currentCoupons,
  setCoupons,
  TCoupon,
} from "@/redux/features/coupon/couponSlice";

import { timeConverter } from "@/utils/timeConverter";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "sonner";

const CouponManagement = () => {
  const dispatch = useAppDispatch();
  const { data, refetch } = useGetCouponsQuery(undefined);
  const [deleteCoupon] = useDeleteCouponMutation();
  const allCoupons = useAppSelector(currentCoupons);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<TCoupon | null>(null);
  const [newCoupon, setNewCoupon] = useState<TCoupon | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (data?.data) {
      dispatch(setCoupons({ data: data?.data }));
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [newCoupon, refetch]);

  const handleDeleteCoupon = async (id: string) => {
    setIsProcessing(!isProcessing);
    const toastId = toast.loading("Coupon deleting...");
    const response = await deleteCoupon(id);
    if (response?.data?.success === true) {
      const updatedCoupon = allCoupons?.filter(
        (coupon) => coupon?._id !== id && coupon
      );

      dispatch(setCoupons({ data: updatedCoupon }));

      toast.success("Coupon deleted successfully", {
        id: toastId,
        duration: 2000,
        className: "bg-green-500 text-white border-green-400",
      });
      setIsProcessing(!isProcessing);
    } else {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  const [filters, setFilters] = useState({
    expired: false,
    running: false,
  });

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const target = event.target;
    const { name, value, type } = target;
    const checked = "checked" in target ? target.checked : null;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const filteredCoupon = allCoupons?.filter(
    (coupon: TCoupon) =>
      (!filters.expired || coupon?.isExpired) &&
      (!filters.running || !coupon?.isExpired)
  );

  return (
    <section className="container mx-auto">
      {isEditing ? (
        <CouponEditForm
          allCoupon={allCoupons as TCoupon[]}
          coupon={selectedCoupon as TCoupon}
          isProcessing={isProcessing}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setIsProcessing={setIsProcessing}
        />
      ) : isCreating ? (
        <CouponCreate
          isProcessing={isProcessing}
          isCreating={isCreating}
          setIsProcessing={setIsProcessing}
          setIsCreating={setIsCreating}
          setNewCoupon={setNewCoupon}
        />
      ) : (
        <div className="px-2">
          <div className="w-full border rounded-lg overflow-hidden shadow-md">
            <div className="relative">
              <div className=" bg-indigo-50 dark:bg-slate-800 p-4 shadow flex justify-between gap-2">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Filter options</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="expired"
                            name="expired"
                            checked={filters.expired}
                            onChange={handleFilterChange}
                            className="form-checkbox h-5 w-5 text-blue-600 dark:text-slate-300"
                          />
                          <label htmlFor="available" className="ml-2">
                            Expired
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="running"
                            name="running"
                            checked={filters.running}
                            onChange={handleFilterChange}
                            className="form-checkbox h-5 w-5 text-blue-600 dark:text-slate-300"
                          />
                          <label htmlFor="available" className="ml-2">
                            Running
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Button
                  className="bg-indigo-700 text-white hover:bg-indigo-800  dark:text-slate-100"
                  onClick={() => setIsCreating(true)}
                >
                  Create Coupon
                </Button>
              </div>
              <Table>
                <TableHeader className="sticky top-0 z-10 dark:bg-slate-700  bg-indigo-700 hover:bg-indigo-700 ">
                  <TableRow className="text-center flex flex-row justify-around items-center hover:bg-indigo-700 dark:hover:bg-slate-700">
                    <TableHead className="md:flex-1 flex-auto text-center text-slate-50 pt-4 box-border">
                      Coupon
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto text-center text-slate-50 pt-4 box-border">
                      Discount
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto text-center text-slate-50 pt-4 box-border">
                      Created
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto text-center text-slate-50 pt-4 box-border">
                      Expire
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto text-center text-slate-50 pt-4 box-border">
                      User
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto text-center text-slate-50 pt-4 box-border">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <Table>
                <TableBody>
                  {filteredCoupon?.length !== 0 &&
                    filteredCoupon?.map((item: TCoupon) => (
                      <TableRow
                        key={item?._id}
                        className="dark:hover:bg-slate-800 text-center flex flex-row justify-around items-center"
                      >
                        <TableCell className="font-medium md:flex-1 flex-auto flex justify-center">
                          {item?.couponCode}
                        </TableCell>
                        <TableCell className="md:flex-1 flex-auto text-center">
                          {item?.discount}
                          {"%"}
                        </TableCell>
                        <TableCell className="md:flex-1 flex-auto text-center">
                          {timeConverter(item?.createDate as Date)}
                        </TableCell>
                        <TableCell className="md:flex-1 flex-auto text-center">
                          24 hours
                        </TableCell>
                        <TableCell className="md:flex-1 flex-auto text-center">
                          {item?.userId?.name}
                        </TableCell>
                        <TableCell className="w-[150px] text-center flex gap-2 justify-center">
                          <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-slate-100"
                            onClick={() => {
                              setIsEditing(true);
                              setSelectedCoupon(item);
                            }}
                          >
                            <FaRegEdit />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="bg-red-600 hover:bg-red-700 text-slate-100">
                                <RiDeleteBin6Line />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-red-500 border-red-500 text-slate-100 w-[90%]">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="md:text-2xl text-xl p-bold text-slate-100 dark:text-slate-900 flex gap-6 items-center">
                                  Are you absolutely sure? <RiDeleteBin6Line />
                                </AlertDialogTitle>
                                <AlertDialogDescription className="dark:text-slate-800 text-base text-start text-slate-200 poppins-regular">
                                  This action cannot be undone. This will
                                  permanently delete the Coupon data!
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className=" bg-orange-400 hover:bg-orange-500 dark:text-slate-900 p-medium border-orange-400 hover:border-orange-500">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteCoupon(item?._id as string)
                                  }
                                  className="bg-indigo-800 text-white hover:bg-indigo-700  dark:text-slate-100 "
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
      {filteredCoupon?.length === 0 && <NoDataAvailable />}
    </section>
  );
};

export default CouponManagement;
