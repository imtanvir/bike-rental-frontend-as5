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
import moment from "moment";
import { useState } from "react";
import { Link } from "react-router-dom";

const BookingModal = ({
  id,
  setIsMainOpen,
}: {
  id: string;
  setIsMainOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(() =>
    moment().format("hh:mm a")
  );

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
    console.log("time:", moment().toDate());
  };

  const handleConfirmTime = () => {
    setIsTimePickerOpen(false);
  };
  // const formattedTime = moment(selectedTime, "HH:mm").format("hh:mm a");

  const handlePay = () => {
    const startRentTime = moment(selectedTime, "HH:mm").toDate();
    dispatch(
      setRentStartTime({
        rentStartTime: startRentTime.toISOString(),
      })
    );
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Rent Your Bike</DialogTitle>
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
          {selectedTime ? `Select Start Time: ${selectedTime}` : "Select Time"}
        </Button>
      </div>
      <DialogFooter>
        <Link to={`/payment/${id}`}>
          <Button
            onClick={handlePay}
            className="bg-indigo-800 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            Pay
          </Button>
        </Link>
        <Button onClick={() => setIsMainOpen(false)}>Close</Button>
      </DialogFooter>

      <Dialog open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
        <DialogContent className="sm:max-w-[300px]">
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
                className="col-span-3 user-select-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmTime}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogContent>
  );
};

export default BookingModal;