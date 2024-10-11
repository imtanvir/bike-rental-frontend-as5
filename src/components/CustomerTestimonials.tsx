import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useGetAllTestimonialQuery } from "@/redux/features/testimonial/testimonialApi";
import {
  currentTestimonial,
  setTestimonials,
  TTestimonial,
} from "@/redux/features/testimonial/testimonialSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Rating from "react-rating";
import NoDataAvailable from "./NoDataAvailable";

const CustomerTestimonials = () => {
  const { data: testimonialsData, refetch } =
    useGetAllTestimonialQuery(undefined);
  const dispatch = useAppDispatch();
  const testimonials = useAppSelector(currentTestimonial);

  useEffect(() => {
    if (testimonialsData?.data) {
      dispatch(setTestimonials({ data: testimonialsData.data }));
    }
    refetch(); // Keep this for any necessary refetch
  }, [dispatch, testimonialsData?.data, refetch]);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const itemWidth = scrollWidth / (testimonials! && testimonials?.length);

      carouselRef.current.scrollTo({
        left: itemWidth * index,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    const newIndex =
      (currentIndex + 1) %
      (testimonials && testimonials.length ? testimonials.length : 0);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handlePrev = () => {
    const newIndex =
      (currentIndex -
        1 +
        (testimonials && testimonials.length ? testimonials.length : 0)) %
      (testimonials && testimonials.length ? testimonials.length : 0);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="md:py-32 py-16 bg-gradient-to-b from-green-50 to-blue-50 dark:bg-gradient-to-b dark:from-background dark:to-muted">
        <div className="container px-4 md:px-6">
          <h2 className="md:text-6xl text-4xl text-left bebas-neue-regular mb-8">
            What Our Customers Say
          </h2>
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {testimonials &&
                testimonials.length > 0 &&
                testimonials.map((testimonial: TTestimonial) => (
                  <div
                    key={testimonial?._id}
                    className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 snap-center px-2"
                  >
                    <Card className="bg-white dark:bg-slate-800 h-full poppins-regular">
                      <CardContent className="p-6 flex flex-col justify-between h-full">
                        <blockquote className="text-md mb-4 dark:text-slate-300">
                          "{testimonial.message}"
                        </blockquote>
                        <div className="flex flex-row items-center">
                          {/* @ts-expect-error there is a version miss-match in the source */}
                          <Rating
                            fullSymbol={
                              <FaStar className="text-[#f59e0b] text-lg" />
                            }
                            emptySymbol={
                              <FaStar className="text-slate-400 mx-[.10rem] dark:text-slate-500 text-lg" />
                            }
                            initialRating={testimonial.rating as number}
                            start={0}
                            stop={5}
                            step={1}
                            fractions={2}
                            readonly={true}
                          />
                          <span className="text-sm font-semibold text-slate-500">{`(${
                            testimonial.rating as number
                          })`}</span>
                        </div>
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage
                              src={testimonial?.userId?.image?.[0]?.url ?? ""}
                              alt={testimonial!.userId?.name ?? ""}
                            />
                            <AvatarFallback className=" dark:bg-slate-600 dark:text-slate-200">
                              {(testimonial?.userId?.name ?? "")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-semibold dark:text-slate-300">
                            {testimonial?.userId?.name}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              {testimonials && testimonials.length === 0 && (
                <div className="py-5">
                  <NoDataAvailable />
                </div>
              )}
            </div>
            {testimonials && testimonials.length !== 0 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-indigo-400 text-white hover:bg-indigo-500 hover:text-white absolute left-2 top-1/2 transform -translate-y-1/2 dark:bg-slate-500 dark:hover:bg-slate-600 hidden sm:flex"
                  bg-indigo-400
                  onClick={handlePrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous testimonial</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-indigo-400 text-white hover:bg-indigo-500 hover:text-white absolute right-2 top-1/2 transform -translate-y-1/2 dark:bg-slate-500 dark:hover:bg-slate-600 hidden sm:flex"
                  bg-indigo-400
                  onClick={handleNext}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next testimonial</span>
                </Button>
              </>
            )}
          </div>
          <div className="flex justify-evenly mt-4">
            <Button
              onClick={handlePrev}
              className="h-7 rounded-3xl dark:bg-slate-500 text-white bg-indigo-400 md:hidden dark:hover:bg-slate-600"
            >
              <SlArrowLeft />
            </Button>
            <Button
              onClick={handleNext}
              className="h-7 rounded-3xl dark:bg-slate-500 text-white bg-indigo-400 md:hidden dark:hover:bg-slate-600"
            >
              <SlArrowRight />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomerTestimonials;
