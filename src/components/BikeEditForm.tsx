import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/hooks";
import { useUpdateSingleBikeMutation } from "@/redux/features/bike/bikeApi";
import { setBikes } from "@/redux/features/bike/bikeSlice";
import { TBike } from "@/types/intex";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const BikeEditForm = ({
  allBikes,
  bike,
  isProcessing,
  isEditing,
  setIsProcessing,
  setIsEditing,
}: {
  allBikes: TBike[];
  bike: TBike;
  isProcessing: boolean;
  isEditing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [updateBike] = useUpdateSingleBikeMutation();
  const dispatch = useAppDispatch();

  const [bikeData, setBikeData] = useState({
    _id: bike._id,
    image: bike.image,
    name: bike.name,
    description: bike.description,
    pricePerHour: bike.pricePerHour,
    rating: bike.rating,
    isAvailable: bike.isAvailable,
    cc: bike.cc,
    year: bike.year,
    model: bike.model,
    brand: bike.brand,
    weight: bike.weight,
    frameSize: bike.frameSize,
    tireSize: bike.tireSize,
    gears: bike.gears,
    features: bike.features,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    console.log(e.target.name, e.target.value);
    const { name, value } = e.target;
    if (
      name === "phone" ||
      name === "cc" ||
      name === "year" ||
      name === "rating"
    ) {
      const numericValue = value.replace(/\D/g, "");
      setBikeData((prevUser) => ({ ...prevUser, [name]: numericValue }));
    } else if (name === "isAvailable") {
      setBikeData((prevUser) => ({
        ...prevUser,
        [name]: value === "true" ? true : false,
      }));
    } else {
      setBikeData((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(!isProcessing);
    const toastId = toast.loading("Bike Data updating...");
    const response = await updateBike(bikeData);
    if (response?.data?.success === true) {
      const updatedBikes = allBikes.map((bike) =>
        bike._id === bikeData._id ? { ...bike, ...bikeData } : bike
      );

      dispatch(setBikes({ data: updatedBikes }));

      toast.success("Bike updated successfully", {
        id: toastId,
        duration: 2000,
        className: "bg-green-500 text-white border-green-400",
      });
      setIsProcessing(!isProcessing);
      setIsEditing(false);
    } else {
      toast.error("Something went wrong", { id: toastId });
    }
  };
  return (
    <section className="dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50 bg-gradient-to-b from-green-50 to-blue-50 px-5 py-10 mt-5 shadow-md rounded-md">
      <div className="flex justify-between">
        <h1 className=" bebas-neue-regular text-3xl">Edit Bike Details</h1>
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
            <Label htmlFor="name">Name</Label>
            <Input
              className="dark:bg-slate-900"
              id="name"
              name="name"
              value={bikeData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              className="dark:bg-slate-900"
              id="brand"
              name="brand"
              type="text"
              value={bikeData.brand}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price-/hr</Label>
            <Input
              className="dark:bg-slate-900"
              id="price"
              name="price"
              type="text"
              value={bikeData.pricePerHour}
              onChange={handleInputChange}
              pattern="[0-9]*"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cc">CC</Label>
            <Input
              className="dark:bg-slate-900"
              id="cc"
              name="cc"
              value={bikeData.cc}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              className="dark:bg-slate-900"
              id="model"
              name="model"
              value={bikeData.model}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              className="dark:bg-slate-900"
              id="year"
              name="year"
              value={bikeData.year}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="available">Available</Label>
            <select
              id="isAvailable"
              name="isAvailable"
              value={`${bikeData.isAvailable}`}
              onChange={handleInputChange}
              className="w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md bg-current dark:bg-slate-900"
            >
              <option key={"true"} value={"true"}>
                Yes
              </option>
              <option key={"false"} value={"false"}>
                N/A
              </option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight</Label>
            <Input
              className="dark:bg-slate-900"
              id="weight"
              name="weight"
              value={bikeData.weight}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tireSize">Tire Size</Label>
            <Input
              className="dark:bg-slate-900"
              id="tireSize"
              name="tireSize"
              value={bikeData.tireSize}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frameSize">Frame Size</Label>
            <Input
              className="dark:bg-slate-900"
              id="frameSize"
              name="frameSize"
              value={bikeData.frameSize}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Input
              className="dark:bg-slate-900"
              id="rating"
              name="rating"
              value={bikeData.rating}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gears">Gears</Label>
            <Input
              className="dark:bg-slate-900"
              id="gears"
              name="gears"
              value={bikeData.gears}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cc">CC</Label>
            <Input
              className="dark:bg-slate-900"
              id="cc"
              name="cc"
              value={bikeData.cc}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cc">CC</Label>
            <Input
              className="dark:bg-slate-900"
              id="cc"
              name="cc"
              value={bikeData.cc}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={bikeData.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button
            className="bg-indigo-800 text-white hover:bg-indigo-700  dark:text-slate-100"
            disabled={isProcessing}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </section>
  );
};

export default BikeEditForm;
