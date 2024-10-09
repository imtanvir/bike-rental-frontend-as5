import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/hooks";
import { useUpdateSingleBikeMutation } from "@/redux/features/bike/bikeApi";
import { setBikes } from "@/redux/features/bike/bikeSlice";
import { TBike, TImage } from "@/types/intex";
import React, { ChangeEvent, useRef, useState } from "react";
import { FaPen } from "react-icons/fa6";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectBikeImg, setSelectBikeImg] = useState<{ image: File[] | null }>({
    image: null,
  });
  const [isNewImgSelected, setIsNewImgSelected] = useState(false);
  const addFeatures = () => {
    setBikeData((prevBikeData) => ({
      ...prevBikeData,
      features: [...prevBikeData.features, ""],
    }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = bikeData.features.filter((_, i) => i !== index);
    setBikeData({ ...bikeData, features: newFeatures });
  };
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (
      name === "phone" ||
      name === "cc" ||
      name === "year" ||
      name === "rating" ||
      name === "pricePerHour"
    ) {
      const numericValue = value.replace(/\D/g, "");
      setBikeData((prevUser) => ({
        ...prevUser,
        [name]: isNaN(parseFloat(numericValue)) ? 0 : parseFloat(numericValue),
      }));
    } else if (name === "isAvailable") {
      setBikeData((prevUser) => ({
        ...prevUser,
        [name]: value === "true" ? true : false,
      }));
    } else {
      setBikeData((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  const handleFeatureChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFeatures = [...bikeData.features];
    newFeatures[index] = e.target.value;
    setBikeData((prevBikeData) => ({ ...prevBikeData, features: newFeatures }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setSelectBikeImg((prevData) => ({
        ...prevData,
        image: fileList,
      }));
      setIsNewImgSelected(true);
    }
  };
  const handleSelectImgRemove = () => {
    setSelectBikeImg((prevData) => ({
      ...prevData,
      image: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsNewImgSelected(false);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Bike Data updating...");
    setIsProcessing(!isProcessing);
    const submissionData = new FormData();
    const bikeDataUpdateIntoDb = {
      name: bikeData.name,
      image: (bikeData?.image as TImage[]).map((img) =>
        isNewImgSelected === true ? { ...img, isRemove: true } : img
      ),
      description: bikeData.description,
      pricePerHour: bikeData.pricePerHour,
      rating: bikeData.rating,
      isAvailable: bikeData.isAvailable,
      cc: bikeData.cc,
      year: bikeData.year,
      model: bikeData.model,
      brand: bikeData.brand,
      weight: bikeData.weight,
      frameSize: bikeData.frameSize,
      tireSize: bikeData.tireSize,
      gears: bikeData.gears,
      features: bikeData.features,
    };

    // Append other form data as JSON
    submissionData.append("data", JSON.stringify(bikeDataUpdateIntoDb));
    submissionData.append("_id", bikeData._id);

    if (selectBikeImg.image) {
      selectBikeImg.image.forEach((file) => {
        submissionData.append("file", file);
      });
    }
    const queryData = {
      id: bikeData._id,
      data: submissionData,
    };
    const response = await updateBike(queryData);
    if (response?.data?.success === true) {
      const updatedBikes = allBikes.map((bike) =>
        bike._id === response?.data?.data?._id
          ? { ...bike, ...response.data.data }
          : bike
      );

      dispatch(setBikes({ data: updatedBikes }));

      toast.success("Bike updated successfully", {
        id: toastId,
        duration: 2000,
        className: "bg-green-500 text-white border-green-400",
      });
      setIsProcessing(false);
      setIsEditing(false);
    } else {
      toast.error("Something went wrong", { id: toastId });
    }
  };
  return (
    <section className="dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50 bg-gradient-to-b from-green-50 to-blue-50 px-5 py-10 mt-5 shadow-md rounded-md">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <h1 className=" bebas-neue-regular text-3xl">Edit Bike Details</h1>
        </div>
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
        <div className="space-y-2">
          <div
            className={`${
              isNewImgSelected === false ? "block" : "hidden"
            } w-20 h-20 rounded-full relative overflow-hidden hover:bottom-0 hover:transition-all image-circle `}
          >
            <img
              className="rounded-full w-full h-full"
              src={bikeData?.image?.[0]?.url}
              alt={bikeData?.name}
            />
            <Label
              htmlFor="image"
              className="edit-img absolute h-1/2 w-full -bottom-[50%] transition bg-white opacity-50 flex justify-center items-start pt-2 text-base"
            >
              <FaPen className="text-slate-900" />
            </Label>
          </div>
          <div className={`${isNewImgSelected ? "block" : "hidden"} relative`}>
            <Input
              ref={fileInputRef}
              type="file"
              id="image"
              onChange={handleFileChange}
              required={isNewImgSelected}
              // multiple
              accept="image/*"
            />
            <div
              className=" absolute right-0 rounded-lg top-1/2 -translate-y-1/2 bg-indigo-700 h-full w-[5%] flex justify-center items-center cursor-pointer"
              onClick={handleSelectImgRemove}
            >
              <IoCloseCircleOutline className="text-slate-50 text-2xl" />
            </div>
          </div>
        </div>
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
            <Label htmlFor="pricePerHour">Price-/hr</Label>
            <Input
              className="dark:bg-slate-900"
              id="pricePerHour"
              name="pricePerHour"
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
              className="w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md bg-white dark:bg-slate-900 border"
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
        <div className="space-y-2">
          <Label>Features</Label>
          <div className="flex gap-4 flex-wrap">
            {bikeData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  className="dark:bg-slate-900"
                  id={`feature-${index}`}
                  name={`feature-${index}`}
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e)}
                />
                {bikeData.features.length > 1 && (
                  <button
                    type="button"
                    title="Remove Feature"
                    onClick={() => removeFeature(index)}
                    className="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded"
                  >
                    <RiDeleteBin6Line />
                  </button>
                )}
              </div>
            ))}
            <IoIosAddCircleOutline
              title="Add Feature"
              className="text-indigo-500 md:text-4xl text-2xl cursor-pointer"
              onClick={addFeatures}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            className="bg-indigo-800 text-white hover:bg-indigo-700  dark:text-slate-100 w-full"
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
