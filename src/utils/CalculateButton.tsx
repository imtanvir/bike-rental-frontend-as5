import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/hooks";
import { TBooking } from "@/redux/features/booking/rentalSlice";
import { useState } from "react";
import { toast } from "sonner";

const CalculateButton = ({
  item,
  setRentals,
  rentalCalculation,
  allRental,
}: {
  item: TBooking;
  setRentals: any;
  rentalCalculation: any;
  allRental: TBooking[];
}) => {
  const dispatch = useAppDispatch();
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculation = async (id: string) => {
    const toastId = toast.loading("Rent cost calculating...");
    try {
      setIsCalculating(true);
      const response = await rentalCalculation(id);
      if (response.data.success === true) {
        setIsCalculating(false);
        const filterRentals = allRental?.filter((rental) => rental._id !== id);

        dispatch(
          setRentals({ data: [...filterRentals!, response?.data?.data] })
        );
        toast.success("Rent cost calculation successful!", {
          id: toastId,
          duration: 3000,
          className: "bg-green-500 text-white border-green-400",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong!", {
        id: toastId,
        duration: 2000,
      });
    }
  };

  return (
    <>
      <Button
        onClick={() => handleCalculation(item._id as string)}
        className="bg-indigo-600 hover:bg-indigo-700 text-slate-100"
      >
        {isCalculating ? "Calculating..." : "Calculate"}
      </Button>
    </>
  );
};

export default CalculateButton;
