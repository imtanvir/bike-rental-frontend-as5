import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RentalSkeleton = () => {
  return (
    <Card className="mb-6 animate-fade-left dark:bg-slate-800 dark:text-slate-300 bg-indigo-200">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="flex-1 p-6">
          <CardHeader className="p-0">
            <CardTitle className="text-xl font-bold">
              <Skeleton className="w-32 h-6" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-4 space-y-2">
            <div>
              <span className="font-semibold">Start Time:</span>{" "}
              <Skeleton className="w-40 h-5 inline-block" />
            </div>
            <div>
              <span className="font-semibold">Return Time:</span>{" "}
              <Skeleton className="w-40 h-5 inline-block" />
            </div>
            <div>
              <span className="font-semibold">Total Cost:</span>{" "}
              <Skeleton className="w-20 h-5 inline-block" />
            </div>
            <div className="text-orange-600">
              <span className="font-semibold text-black dark:text-slate-300">
                Rent Status:
              </span>{" "}
              <Skeleton className="w-24 h-5 inline-block" />
            </div>
          </CardContent>
          <CardFooter className="p-0 mt-4">
            <Skeleton className="w-24 h-10 bg-indigo-500" />
          </CardFooter>
        </div>
        <div className="sm:w-1/3 p-4">
          <div className="relative w-full h-48 sm:h-full overflow-hidden rounded-lg">
            <Skeleton className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RentalSkeleton;
