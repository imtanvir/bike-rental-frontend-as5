import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IoMdClose } from "react-icons/io";

import NoDataAvailable from "@/components/NoDataAvailable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
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
  useGetAllRentalsQuery,
  useRentCalculationMutation,
} from "@/redux/features/booking/bookingApi";
import {
  currentUserRentals,
  setRentals,
  TBooking,
} from "@/redux/features/booking/rentalSlice";
import CalculateButton from "@/utils/CalculateButton";
import { timeConverter } from "@/utils/timeConverter";
import { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const RentManagement = () => {
  const dispatch = useAppDispatch();
  const { data, refetch } = useGetAllRentalsQuery(undefined);
  const [rentalCalculation] = useRentCalculationMutation();
  const allRental = useAppSelector(currentUserRentals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [getMoneyBack, setGetMoneyBack] = useState(0);
  useEffect(() => {
    if (data?.data) {
      dispatch(setRentals({ data: data?.data }));
    }
  }, [data, dispatch]);
  useEffect(() => {
    refetch();
  }, [refetch, allRental]);

  const [filters, setFilters] = useState({
    unpaid: false,
    running: false,
    pendingCalculate: false,
    paid: false,
  });

  const filteredRental = allRental?.filter(
    (rent: TBooking) =>
      (!filters.paid || rent.isPaid) &&
      (!filters.pendingCalculate ||
        (rent.pendingCalculation && rent.estimatedReturnTime)) &&
      (!filters.unpaid ||
        (!rent.isPaid &&
          rent.estimatedReturnTime &&
          rent.pendingCalculation === false)) &&
      (!filters.running ||
        (!rent.pendingCalculation && !rent.estimatedReturnTime))
  );
  const handleFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const target = event.target;
    const { name } = target;
    const checked = "checked" in target ? target.checked : null;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <section className="container mx-auto">
      <div className="px-2">
        <div className="w-full border rounded-lg overflow-hidden shadow-md">
          <div className="relative">
            <div className=" bg-indigo-50 dark:bg-slate-800 p-4 shadow flex justify-between gap-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <p className="flex gap-2 items-center">
                      Filter options <FaArrowRightLong />
                    </p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="running"
                          name="running"
                          checked={filters.running}
                          onChange={handleFilterChange}
                          className="form-checkbox h-5 w-5 text-blue-600 dark:text-slate-300"
                        />
                        <label htmlFor="running" className="ml-2">
                          Running
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="paid"
                          name="paid"
                          checked={filters.paid}
                          onChange={handleFilterChange}
                          className="form-checkbox h-5 w-5 text-blue-600 dark:text-slate-300"
                        />
                        <label htmlFor="paid" className="ml-2">
                          Paid
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="unpaid"
                          name="unpaid"
                          checked={filters.unpaid}
                          onChange={handleFilterChange}
                          className="form-checkbox h-5 w-5 text-blue-600 dark:text-slate-300"
                        />
                        <label htmlFor="unpaid" className="ml-2">
                          Unpaid
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="pendingCalculate"
                          name="pendingCalculate"
                          checked={filters.pendingCalculate}
                          onChange={handleFilterChange}
                          className="form-checkbox h-5 w-5 text-blue-600 dark:text-slate-300"
                        />
                        <label htmlFor="pendingCalculate" className="ml-2">
                          Pending Calculation
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <Table>
              <TableHeader className="sticky top-0 z-10 dark:bg-slate-700  bg-indigo-700 hover:bg-indigo-700 ">
                <TableRow className="text-center flex flex-row justify-around items-center hover:bg-indigo-700 dark:hover:bg-slate-700">
                  <TableHead className="md:flex-1 flex-auto whitespace-nowrap md:w-auto w-[100px] text-center text-slate-50 pt-4 box-border">
                    Bike
                  </TableHead>
                  <TableHead className="md:flex-1 flex-auto whitespace-nowrap md:w-auto w-[100px] text-center text-slate-50 pt-4">
                    Name
                  </TableHead>
                  <TableHead className="md:flex-1 flex-auto whitespace-nowrap md:w-auto w-[100px] text-center text-slate-50 pt-4 box-border">
                    User
                  </TableHead>
                  <TableHead className="md:flex-1 flex-auto whitespace-nowrap md:w-auto w-[100px] text-center text-slate-50 pt-4 box-border">
                    Start Time
                  </TableHead>
                  <TableHead className="md:flex-1 flex-auto whitespace-nowrap md:w-auto w-[100px] text-center text-slate-50 pt-4 box-border">
                    Return Time
                  </TableHead>
                  <TableHead className="md:flex-1 flex-auto whitespace-nowrap md:w-auto w-[100px] text-center text-slate-50 pt-4 box-border">
                    Total Cost
                  </TableHead>
                  <TableHead className="md:flex-1 flex-auto whitespace-nowrap md:w-auto w-[100px] text-center text-slate-50 pt-4 box-border">
                    Status
                  </TableHead>
                  <TableHead className="md:flex-1 flex-auto whitespace-nowrap md:w-auto w-[100px] text-center text-slate-50 pt-4 box-border">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            <Table>
              <TableBody>
                {filteredRental?.length !== 0 &&
                  filteredRental?.map((item: TBooking) => (
                    <TableRow
                      key={item._id}
                      className="dark:hover:bg-slate-800 text-center flex flex-row justify-around items-center"
                    >
                      <TableCell className="font-medium md:flex-1 flex-auto flex justify-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <div className="cursor-pointer rounded-lg flex justify-center items-center overflow-hidden w-20 h-20">
                              <img
                                className="w-20 h-20 object-cover rounded-lg transition hover:transition-transform hover:scale-125"
                                src={`${item?.bikeId?.image?.[0]?.url}`}
                                alt={item?.bikeId?.name}
                              />
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="flex flex-col items-end">
                            <AlertDialogCancel className="w-10 h-10 p-0">
                              <IoMdClose className="text-xl" />
                            </AlertDialogCancel>
                            <img
                              src={`${item?.bikeId?.image?.[0]?.url}`}
                              alt={item?.bikeId?.name}
                            />
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                      <TableCell className="md:flex-1 flex-auto text-center">
                        {item?.bikeId?.name}
                      </TableCell>
                      <TableCell className="md:flex-1 flex-auto whitespace-nowrap text-center">
                        {item.userId?.name?.split(" ")[0]}
                      </TableCell>
                      <TableCell className="md:flex-1 flex-auto text-center">
                        {item?.startTime
                          ? timeConverter(item?.startTime as Date)
                          : "N/A"}
                      </TableCell>
                      <TableCell className="md:flex-1 flex-auto text-center">
                        {item.returnTime
                          ? timeConverter(item?.returnTime)
                          : "N/A"}
                      </TableCell>
                      <TableCell className="md:flex-1 flex-auto whitespace-nowrap text-center">
                        {item?.totalCost === 0 ? "N/A" : item?.totalCost}
                      </TableCell>
                      <TableCell className="md:flex-1 flex-auto whitespace-nowrap text-center">
                        {item.isPaid ? (
                          <Badge className="bg-green-500 hover:bg-green-500 text-white dark:text-slate-900">
                            Paid
                          </Badge>
                        ) : item.pendingCalculation ? (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white dark:text-slate-900">
                            Pending
                          </Badge>
                        ) : item.pendingCalculation === false &&
                          !item.estimatedReturnTime?.toString() ? (
                          <Badge className="bg-blue-500 hover:bg-blue-500 dark:text-slate-50">
                            Running
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-400 hover:bg-orange-400 text-white dark:text-slate-900">
                            Unpaid
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="w-[150px] text-center flex gap-2 justify-center">
                        {item.pendingCalculation ? (
                          <CalculateButton
                            item={item}
                            setRentals={setRentals}
                            rentalCalculation={rentalCalculation}
                            allRental={allRental as TBooking[]}
                            setIsDialogOpen={setIsDialogOpen}
                            setTotalCost={setTotalCost}
                            setGetMoneyBack={setGetMoneyBack}
                          />
                        ) : item.pendingCalculation === false &&
                          !item.estimatedReturnTime?.toString() ? (
                          <Button
                            aria-readonly={true}
                            className="bg-slate-600 dark:hover:bg-slate-500 text-slate-100 cursor-not-allowed"
                          >
                            Calculate
                          </Button>
                        ) : (
                          <Button className="bg-green-600 hover:bg-green-600 text-slate-100 cursor-default">
                            Calculated
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {filteredRental?.length === 0 && <NoDataAvailable />}
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
            <span className="text-2xl p-bold">Rent Paid!</span>
            <span className="text-base block poppins-regular pb-4">
              The rent has been successfully paid as the total cost less than
              advance payment.
            </span>
            <div className="flex flex-row gap-2">
              <span className="block">
                <span className="text-yellow-400">Charged Amount :</span> $
                {totalCost}
              </span>
              <span>{" | "}</span>
              <span className="block">
                <span className="text-yellow-400">Money Back :</span> $
                {getMoneyBack}
              </span>
            </div>
          </AlertDialogTitle>

          <div className="flex justify-between"></div>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default RentManagement;
