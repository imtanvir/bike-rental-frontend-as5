import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useCreateBikeMutation } from "@/redux/features/bike/bikeApi";
import { bikeCurrentBikes, setBikes } from "@/redux/features/bike/bikeSlice";
import { ChangeEvent, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const BikeCreate = ({
  isProcessing,
  isCreating,
  setIsProcessing,
  setIsCreating,
}: {
  isProcessing: boolean;
  isCreating: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const [createBike] = useCreateBikeMutation();
  const allBikes = useAppSelector(bikeCurrentBikes);

  const [bikeData, setBikeData] = useState({
    image: null as File[] | null,
    name: "",
    description: "",
    pricePerHour: 0,
    rating: 0,
    isAvailable: false,
    cc: 0,
    year: new Date().getFullYear(),
    model: "",
    brand: "",
    weight: "",
    frameSize: "",
    tireSize: "",
    gears: "",
    features: [""],
  });

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
      name === "pricePerHour" ||
      name === "year" ||
      name === "rating"
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
      const fileList = Array.from(e.target.files); // Handle multiple files
      setBikeData((prevData) => ({
        ...prevData,
        image: fileList,
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(!isProcessing);
    const toastId = toast.loading("New Bike inserting...");
    const submissionData = new FormData();

    const bikeDataCreateIntoDb = {
      name: bikeData.name,
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
    submissionData.append("data", JSON.stringify(bikeDataCreateIntoDb));

    // Append images to FormData
    if (bikeData.image) {
      bikeData.image.forEach((file) => {
        submissionData.append("file", file);
      });
    }
    // Send form data to the backend
    const response = await createBike(submissionData);
    if (response?.data?.success === true) {
      dispatch(
        setBikes({ data: [response?.data?.data[0], ...(allBikes ?? [])] })
      );
      toast.success("Bike created successfully!", {
        id: toastId,
        className: "bg-green-500 text-white border-green-400",
      });
      setIsProcessing(false);
      setIsCreating(false);
    } else {
      toast.error("Something went wrong", {
        id: toastId,
        className: "bg-red-500 text-white border-red-400",
      });
    }
  };

  return (
    <section className="dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50 bg-gradient-to-b from-green-50 to-blue-50 px-5 py-10 mt-5 shadow-md rounded-md">
      <div className="flex justify-between">
        <h1 className="bebas-neue-regular text-3xl">Create A New Bike</h1>
        <Button
          className="bg-orange-400 hover:bg-orange-500 dark:text-slate-900 p-medium"
          onClick={() => {
            setIsProcessing(false);
            setIsCreating(!isCreating);
          }}
        >
          Cancel
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              className="dark:bg-slate-950"
              id="name"
              name="name"
              value={bikeData.name}
              onChange={handleInputChange}
              placeholder="Enter bike name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              className="dark:bg-slate-950"
              id="brand"
              name="brand"
              type="text"
              value={bikeData.brand}
              onChange={handleInputChange}
              placeholder="Enter bike brand"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricePerHour">Price-/hr</Label>
            <Input
              className="dark:bg-slate-950"
              id="pricePerHour"
              name="pricePerHour"
              type="text"
              value={bikeData.pricePerHour}
              onChange={handleInputChange}
              placeholder="Enter price per hour"
              pattern="[0-9]*"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cc">CC</Label>
            <Input
              className="dark:bg-slate-950"
              id="cc"
              name="cc"
              type="text"
              value={bikeData.cc}
              onChange={handleInputChange}
              placeholder="Enter bike CC"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              className="dark:bg-slate-950"
              id="model"
              name="model"
              value={bikeData.model}
              onChange={handleInputChange}
              placeholder="Enter bike model"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              className="dark:bg-slate-950"
              id="year"
              name="year"
              value={bikeData.year}
              onChange={handleInputChange}
              placeholder="Enter manufacturing year"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="available">Available</Label>
            <select
              id="isAvailable"
              name="isAvailable"
              value={`${bikeData.isAvailable}`}
              onChange={handleInputChange}
              className="w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md bg-white dark:bg-slate-900"
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
              className="dark:bg-slate-950"
              id="weight"
              name="weight"
              value={bikeData.weight}
              onChange={handleInputChange}
              placeholder="Enter bike weight"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tireSize">Tire Size</Label>
            <Input
              className="dark:bg-slate-950"
              id="tireSize"
              name="tireSize"
              value={bikeData.tireSize}
              onChange={handleInputChange}
              placeholder="Enter tire size"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frameSize">Frame Size</Label>
            <Input
              className="dark:bg-slate-950"
              id="frameSize"
              name="frameSize"
              value={bikeData.frameSize}
              onChange={handleInputChange}
              placeholder="Enter frame size"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Input
              className="dark:bg-slate-950"
              id="rating"
              name="rating"
              value={bikeData.rating}
              onChange={handleInputChange}
              placeholder="Enter bike rating"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gears">Gears</Label>
            <Input
              className="dark:bg-slate-950"
              id="gears"
              name="gears"
              value={bikeData.gears}
              onChange={handleInputChange}
              placeholder="Enter number of gears"
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
            placeholder="Enter bike description"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Bike Image</Label>
          <Input
            type="file"
            id="image"
            onChange={handleFileChange}
            required
            // multiple
            accept="image/*"
            // className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label>Features</Label>
          <div className="flex gap-4 flex-wrap items-center">
            {bikeData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  className="dark:bg-slate-950"
                  id={`feature-${index}`}
                  name={`feature-${index}`}
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e)}
                  placeholder="Enter a feature"
                />
                {index > 0 && (
                  <RiDeleteBin6Line
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeFeature(index)}
                  />
                )}
              </div>
            ))}
            <IoIosAddCircleOutline
              className="text-indigo-500 md:text-4xl text-2xl cursor-pointer"
              onClick={addFeatures}
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isProcessing}
          className="bg-indigo-800 text-white hover:bg-indigo-700  dark:text-slate-100 w-full"
        >
          {isProcessing ? "Processing..." : "Create Bike"}
        </Button>
      </form>
    </section>
  );
};

export default BikeCreate;
