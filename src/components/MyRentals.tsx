import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGetRentalsQuery } from "@/redux/features/booking/bookingApi";
import { TBooking } from "@/redux/features/booking/rentalSlice";
import { useEffect } from "react";
import NoDataAvailable from "./NoDataAvailable";
import RentalCard from "./RentalCard";
// Mock data for rentals

const MyRentals = () => {
  const { data, refetch } = useGetRentalsQuery(undefined);
  useEffect(() => {
    refetch();
  }, [refetch]);
  console.log({ data });
  const unpaidRental = data?.data?.filter(
    (rental: TBooking) => rental.isPaid === false
  );

  const paidRental = data?.data?.filter((rental: TBooking) => rental.isPaid);
  return (
    <div className="container mx-auto px-4 py-8 overflow-auto poppins-regular ">
      <Tabs defaultValue="unpaid" className="space-y-4">
        <h1 className="text-3xl font-bold mb-6">My Rentals</h1>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>
        <TabsContent key={"unpaid"} value="unpaid">
          {unpaidRental && unpaidRental?.length > 0 ? (
            data?.data
              ?.filter((rental: TBooking) => rental.isPaid === false)
              .map((rental: TBooking) => (
                <RentalCard key={rental._id} rental={rental} />
              ))
          ) : (
            <NoDataAvailable />
          )}
        </TabsContent>
        <TabsContent key={"paid"} value="paid">
          {paidRental && paidRental?.length > 0 ? (
            data?.data
              ?.filter((rental: TBooking) => rental.isPaid)
              .map((rental: TBooking) => (
                <RentalCard key={rental._id} rental={rental} />
              ))
          ) : (
            <NoDataAvailable />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyRentals;
