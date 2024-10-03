import BikeCard from "@/components/BikeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllBikesQuery } from "@/redux/features/bike/bikeApi";
import { TBike } from "@/types/intex";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import pimg from "../assets/images/banner.png";

const bikes = [
  {
    id: 1,
    name: "Mountain Explorer",
    brand: "TrailMaster",
    model: "XT750",
    price: 1299,
    available: true,
    image: pimg,
  },
  {
    id: 2,
    name: "City Cruiser",
    brand: "UrbanRide",
    model: "Comfort 5",
    price: 599,
    available: false,
    image: pimg,
  },
  {
    id: 3,
    name: "Speed Demon",
    brand: "VelocityPro",
    model: "Aero 3000",
    price: 2499,
    available: true,
    image: pimg,
  },
  {
    id: 4,
    name: "Electric Dream",
    brand: "EcoRide",
    model: "E-City 2",
    price: 1899,
    available: true,
    image: pimg,
  },
  {
    id: 5,
    name: "Kid's Adventure",
    brand: "LittleRider",
    model: "Junior 20",
    price: 299,
    available: true,
    image: pimg,
  },
  {
    id: 6,
    name: "Folding Commuter",
    brand: "CompactGo",
    model: "Fold-X",
    price: 799,
    available: false,
    image: pimg,
  },
];

const brands = [...new Set(bikes.map((bike) => bike.brand))];
const models = [...new Set(bikes.map((bike) => bike.model))];

const AllBikes = () => {
  const { data, refetch } = useGetAllBikesQuery(undefined);

  useEffect(() => {
    refetch();
  }, [refetch]);

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

  return (
    <section className="overflow-auto flex mx-auto">
      <div className="container mx-auto">
        <div className="space-y-6 py-28">
          <div className="flex flex-col sm:flex-row gap-4">
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
          <div className=" bg-indigo-50 dark:bg-slate-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
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
              <Button className="mt-4 bg-indigo-800 hover:bg-indigo-600 hover:text-slate-200 text-slate-300 ">
                Filter
              </Button>
            </div>
          </div>
          {data?.data?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {data?.data?.map((bike: TBike) => (
                <BikeCard
                  key={bike._id}
                  id={bike._id}
                  image={bike.image?.[0]?.url ?? "placeholder_image"}
                  brand={bike.brand}
                  model={bike.model}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-700">
                No bikes found
              </h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AllBikes;
