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
import { setRentStartTime } from "@/redux/features/rentTime/RentTimeSlice";
import { Clock } from "lucide-react";
import moment from "moment-timezone";
import { useState } from "react";
import { Link } from "react-router-dom";

const BookingModal = ({
  bikeId = null,
  setIsMainOpen,
}: {
  bikeId: string | null;
  setIsMainOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(() =>
    moment().format("hh:mm a")
  );

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleConfirmTime = () => {
    setIsTimePickerOpen(false);
  };
  // const formattedTime = moment(selectedTime, "HH:mm").format("hh:mm a");

  const handlePay = () => {
    // const currentDateTime = new Date();
    // const returnRentTime = moment(currentDateTime, "HH:mm").toDate();
    const startTime = moment(selectedTime, "HH:mm")
      .tz(moment.tz.guess(), true)
      .toDate();

    dispatch(
      setRentStartTime({
        rentStartTime: startTime.toISOString(),
      })
    );
  };

  return (
    <DialogContent className="sm:max-w-[425px] w-[90%]">
      <DialogHeader>
        <DialogTitle>Start Rent Your Bike</DialogTitle>
        <DialogDescription>
          Select your rent start time and go to next step to make an advance
          payment to complete your booking.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <Button
          onClick={() => setIsTimePickerOpen(true)}
          className="flex items-center bg-indigo-500 hover:bg-indigo-600 dark:bg-slate-800 text-white dark:hover:bg-slate-400"
        >
          <Clock className="mr-2 h-4 w-4" />
          {selectedTime ? `Select Start Time  ${selectedTime}` : "Select Time"}
        </Button>
      </div>
      <DialogFooter className="flex flex-row gap-4 justify-end">
        <Link to={`/payment/${bikeId}`}>
          <Button
            onClick={handlePay}
            className="bg-indigo-800 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:text-slate-100 dark:hover:bg-indigo-600"
          >
            Pay
          </Button>
        </Link>
        <Button onClick={() => setIsMainOpen(false)}>Close</Button>
      </DialogFooter>

      <Dialog open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
        <DialogContent className="sm:max-w-[300px] dark:bg-slate-800 w-[90%] rounded">
          <DialogHeader>
            <DialogTitle>Start Time</DialogTitle>
            <DialogDescription>
              Choose the time of your booking.
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
                value={selectedTime}
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
