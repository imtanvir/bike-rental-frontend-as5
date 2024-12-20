import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/hooks/hooks";
import { TBooking } from "@/redux/features/booking/rentalSlice";
import { setRentStartTime } from "@/redux/features/rentTime/RentTimeSlice";
import { convertToDate, formatTime } from "@/utils/convertToDate";
import { Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const BookingModal = ({
  bikeId = null,
  rental = null,
  handleReturnBike = () => {}, // default to an empty function
  setIsMainOpen,
  setSelectedReturnTime = () => {},
}: {
  bikeId?: string | null;
  rental?: TBooking | null;
  handleReturnBike?: () => void;
  setIsMainOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedReturnTime?: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const dispatch = useAppDispatch();
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(() =>
    formatTime(new Date())
  );

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleConfirmTime = () => {
    setIsTimePickerOpen(false);
  };

  const handlePay = () => {
    const startTime = convertToDate(selectedTime);
    dispatch(
      setRentStartTime({
        rentStartTime: startTime.toISOString(),
      })
    );
  };

  return (
    <DialogContent className="sm:max-w-[425px] w-[90%]">
      <DialogHeader>
        <DialogTitle>
          {rental && rental?.bikeId?.isAvailable === false
            ? "Return rented Bike"
            : "Start Rent Your Bike"}
        </DialogTitle>
        <DialogDescription>
          {rental && rental?.bikeId?.isAvailable === false
            ? " Select your rent return time and go to next step to return the bike."
            : "Select your rent start time and go to next step to make an advance payment to complete your booking."}
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <Button
          onClick={() => setIsTimePickerOpen(true)}
          className="flex items-center bg-indigo-500 hover:bg-indigo-600 dark:bg-slate-800 text-white dark:hover:bg-slate-400"
        >
          <Clock className="mr-2 h-4 w-4" />
          {selectedTime
            ? `Select ${
                rental && rental?.bikeId?.isAvailable === false
                  ? "Return"
                  : "Start"
              } Time  ${selectedTime}`
            : "Select Time"}
        </Button>
      </div>
      <DialogFooter className="flex flex-row gap-4 justify-end">
        {bikeId && !rental && (
          <>
            <Link to={`/payment/${bikeId}`}>
              <Button
                onClick={handlePay}
                className="bg-indigo-800 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:text-slate-100 dark:hover:bg-indigo-600"
              >
                Pay
              </Button>
            </Link>
            <Button onClick={() => setIsMainOpen(false)}>Close</Button>
          </>
        )}
        {rental && rental?.bikeId?.isAvailable === false && (
          <Button
            onClick={() => {
              handleReturnBike();
              const returnTime = convertToDate(selectedTime);
              setSelectedReturnTime(returnTime.toISOString());

              setIsMainOpen(false);
            }}
            className="bg-indigo-800 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:text-slate-100 dark:hover:bg-indigo-600"
          >
            {"Return Bike"}
          </Button>
        )}
      </DialogFooter>

      <Dialog open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
        <DialogContent className="sm:max-w-[300px] dark:bg-slate-800 w-[90%] rounded">
          <DialogHeader>
            <DialogTitle>
              {rental?.bikeId?.isAvailable === false
                ? "Return Time"
                : "Start Time"}
            </DialogTitle>
            <DialogDescription>
              {`Choose the time of your ${
                rental?.bikeId?.isAvailable === false
                  ? "return bike"
                  : "booking"
              } time.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 dark:text-slate-300">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={selectedTime.split(" ")[0]}
                onChange={handleTimeChange}
                className="col-span-3 user-select-none text-slate-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-indigo-700 text-white hover:bg-indigo-600"
              onClick={handleConfirmTime}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogContent>
  );
};

export default BookingModal;
