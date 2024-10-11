import BikeCard from "@/components/BikeCard";
import NoDataAvailable from "@/components/NoDataAvailable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useGetAllBikesQuery } from "@/redux/features/bike/bikeApi";
import { bikeCurrentBikes, setBikes } from "@/redux/features/bike/bikeSlice";
import { TBike } from "@/types/intex";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const AllBikes = () => {
  const dispatch = useAppDispatch();
  const { data, refetch } = useGetAllBikesQuery(undefined);
  const allBikes = useAppSelector(bikeCurrentBikes);

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
    <section
      className="container mx-auto py-4
    "
    >
      <div className="px-2">
        <h1 className="md:text-4xl text-xl font-bold p-4 bebas-neue-regular">
          All Listed Bike
        </h1>
        <div className="w-full border rounded-lg overflow-hidden shadow-md md:p-4 p-2">
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
              <Button className="dark:bg-indigo-800 dark:text-slate-300">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
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
            </div>
          </div>
          <div className="max-h-[60vh] min-h-[50vh] overflow-y-auto">
            {Array.isArray(filteredBikes) && filteredBikes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBikes?.map((bike: TBike) => (
                  <BikeCard
                    key={bike._id}
                    id={bike._id}
                    image={bike.image?.[0]?.url ?? "placeholder_image"}
                    brand={bike.brand}
                    model={bike.model}
                    rating={bike.rating}
                  />
                ))}
              </div>
            ) : (
              <NoDataAvailable />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllBikes;
