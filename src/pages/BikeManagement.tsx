import BikeEditForm from "@/components/BikeEditForm";
import { RiDeleteBin6Line } from "react-icons/ri";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IoMdClose } from "react-icons/io";

import BikeCreate from "@/components/BikeCreate";
import NoDataAvailable from "@/components/NoDataAvailable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  useDeleteSingleBikeMutation,
  useGetAllBikesQuery,
} from "@/redux/features/bike/bikeApi";
import { bikeCurrentBikes, setBikes } from "@/redux/features/bike/bikeSlice";
import { TBike } from "@/types/intex";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "sonner";

const BikeManagement = () => {
  const dispatch = useAppDispatch();
  const { data, refetch } = useGetAllBikesQuery(undefined);
  const [deleteBike] = useDeleteSingleBikeMutation();
  const allBikes = useAppSelector(bikeCurrentBikes);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBike, setSelectedBike] = useState<TBike | null>(null);

  useEffect(() => {
    if (data?.data) {
      dispatch(setBikes({ data: data?.data }));
    }
  }, [data, dispatch]);
  useEffect(() => {
    refetch();
  }, [refetch]);

  const brands = [...new Set(allBikes?.map((bike) => bike?.brand))];
  const models = [...new Set(allBikes?.map((bike) => bike?.model))];
  const handleDeleteBike = async (id: string) => {
    setIsProcessing(!isProcessing);
    const toastId = toast.loading("Bike deleting...");
    const response = await deleteBike(id);
    if (response?.data?.success === true) {
      const updatedBikes = allBikes?.filter((bike) => bike._id !== id && bike);

      dispatch(setBikes({ data: updatedBikes }));

      toast.success("Bike deleted successfully", {
        id: toastId,
        duration: 2000,
        className: "bg-green-500 text-white border-green-400",
      });
      setIsProcessing(!isProcessing);
    } else {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    available: false,
    brand: "all",
    model: "all",
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

  const filteredBikes = allBikes?.filter(
    (bike) =>
      bike.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filters.available || bike.isAvailable) &&
      (filters.brand === "all" || bike.brand === filters.brand) &&
      (filters.model === "all" || bike.model === filters.model)
  );
  return (
    <section className="container mx-auto">
      {isEditing ? (
        <BikeEditForm
          allBikes={allBikes as TBike[]}
          bike={selectedBike as TBike}
          isProcessing={isProcessing}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setIsProcessing={setIsProcessing}
        />
      ) : isCreating ? (
        <BikeCreate
          isProcessing={isProcessing}
          isCreating={isCreating}
          setIsProcessing={setIsProcessing}
          setIsCreating={setIsCreating}
        />
      ) : (
        <div className="px-2">
          <div className="w-full border rounded-lg overflow-hidden shadow-md">
            <div className="relative">
              <div className="flex flex-col sm:flex-row gap-4 my-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search bikes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className=" dark:bg-slate-800 dark:text-slate-300"
                  />
                </div>
              </div>
              <div className=" bg-indigo-50 dark:bg-slate-800 p-4 shadow flex justify-between gap-2">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Filter options</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="available"
                            name="available"
                            checked={filters.available}
                            onChange={handleFilterChange}
                            className="form-checkbox h-5 w-5 text-blue-600 dark:text-slate-300"
                          />
                          <label htmlFor="available" className="ml-2">
                            Available only
                          </label>
                        </div>
                        <div className="flex items-center">
                          <label htmlFor="brand" className="mr-2">
                            Brand:
                          </label>
                          <select
                            id="brand"
                            name="brand"
                            value={filters.brand}
                            onChange={handleFilterChange}
                            className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
                          >
                            <option value="all">All Brands</option>
                            {brands.map((brand) => (
                              <option key={brand} value={brand}>
                                {brand}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center">
                          <label htmlFor="model" className="mr-2">
                            Model:
                          </label>
                          <select
                            id="model"
                            name="model"
                            value={filters.model}
                            onChange={handleFilterChange}
                            className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:focus:ring-slate-500 dark:focus:border-slate-500"
                          >
                            <option value="all">All Models</option>
                            {models.map((model) => (
                              <option key={model} value={model}>
                                {model}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Button
                  className="bg-indigo-700 text-white hover:bg-indigo-800  dark:text-slate-100"
                  onClick={() => setIsCreating(true)}
                >
                  Create Bike
                </Button>
              </div>
              <Table>
                <TableHeader className="sticky top-0 z-10 dark:bg-slate-700  bg-indigo-700 hover:bg-indigo-700 ">
                  <TableRow className="text-center flex flex-row justify-around items-center hover:bg-indigo-700 dark:hover:bg-slate-700">
                    <TableHead className="md:flex-1 flex-auto md:w-auto w-[100px] text-center text-slate-50 pt-4 box-border">
                      Bike
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto md:w-auto w-[100px] text-center text-slate-50 pt-4 box-border">
                      Name
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto md:w-auto w-[100px] text-center text-slate-50 pt-4 box-border">
                      Brand
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto md:w-auto w-[100px] text-center text-slate-50 pt-4 box-border">
                      Model
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto md:w-auto w-[100px] text-center text-slate-50 pt-4 box-border">
                      Available
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto md:w-auto w-[100px] text-center text-slate-50 pt-4 box-border">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <Table>
                <TableBody>
                  {filteredBikes?.length !== 0 &&
                    filteredBikes?.map((item: TBike) => (
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
                                  src={`${item?.image?.[0]?.url}`}
                                  alt={item.name}
                                />
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="flex flex-col items-end">
                              <AlertDialogCancel className="w-10 h-10 p-0">
                                <IoMdClose className="text-xl" />
                              </AlertDialogCancel>
                              <img
                                src={`${item?.image?.[0]?.url}`}
                                alt={item.name}
                              />
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                        <TableCell className="md:flex-1 flex-auto text-center">
                          {item.name}
                        </TableCell>
                        <TableCell className="md:flex-1 flex-auto text-center">
                          {item.brand}
                        </TableCell>
                        <TableCell className="md:flex-1 flex-auto text-center">
                          {item.model}
                        </TableCell>
                        <TableCell className="md:flex-1 flex-auto text-center">
                          {item.isAvailable ? "Yes" : "No"}
                        </TableCell>
                        <TableCell className="w-[150px] text-center flex gap-2 justify-center">
                          <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-slate-100"
                            onClick={() => {
                              setIsEditing(true);
                              setSelectedBike(item);
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
                            <AlertDialogContent className="bg-red-500 border-red-500 text-slate-100 w-[90%] rounded-lg">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="md:text-2xl text-xl p-bold text-slate-100 dark:text-slate-900 flex gap-6 items-center">
                                  Are you absolutely sure? <RiDeleteBin6Line />
                                </AlertDialogTitle>
                                <AlertDialogDescription className="dark:text-slate-800 text-base text-start text-slate-200 font-semibold">
                                  This action cannot be undone. This will
                                  permanently delete the Bike data!
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className=" bg-orange-400 hover:bg-orange-500 dark:text-slate-900 p-medium border-orange-400 hover:border-orange-500">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteBike(item._id)}
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
      {filteredBikes?.length === 0 && <NoDataAvailable />}
    </section>
  );
};

export default BikeManagement;
