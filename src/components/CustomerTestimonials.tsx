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
import React, { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import Rating from "react-rating";
const CustomerTestimonials = () => {
  const { data: testimonialsData, refetch } =
    useGetAllTestimonialQuery(undefined);
  const dispatch = useAppDispatch();
  const testimonials = useAppSelector(currentTestimonial);
  useEffect(() => {
    dispatch(setTestimonials({ data: testimonialsData?.data }));
    refetch();
  }, [refetch, testimonialsData?.data]);
  // const testimonials = [
  //   {
  //     quote: "The bikes were in great condition and the service was excellent!",
  //     name: "Sarah L.",
  //     avatar: img,
  //   },
  //   {
  //     quote: "Exploring the city on these bikes was the highlight of our trip.",
  //     name: "Mike T.",
  //     avatar: img,
  //   },
  //   {
  //     quote:
  //       "Affordable prices and a wide selection of bikes. Highly recommend!",
  //     name: "Emily R.",
  //     avatar: "placeholder/img",
  //   },
  //   {
  //     quote:
  //       "The staff was incredibly helpful in choosing the right bike for me.",
  //     name: "David K.",
  //     avatar: img,
  //   },
  //   {
  //     quote:
  //       "Smooth rental process and the bikes were perfect for our family outing.",
  //     name: "Lisa M.",
  //     avatar: img,
  //   },
  //   {
  //     quote:
  //       "Great way to see the sights and get some exercise. Will rent again!",
  //     name: "Chris P.",
  //     avatar: img,
  //   },
  // ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const itemWidth = scrollWidth / testimonials!.length;
      carouselRef.current.scrollTo({
        left: itemWidth * index,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    const newIndex =
      (currentIndex - 1 + testimonials!.length) % testimonials!.length;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % testimonials!.length;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleNext();
    }

    if (touchStart - touchEnd < -75) {
      handlePrev();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

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
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
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
                        <div>
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
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-slate-500 dark:hover:bg-slate-600 hidden sm:flex"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-slate-500 dark:hover:bg-slate-600 hidden sm:flex"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            {testimonials?.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={`mx-1 ${
                  currentIndex === index
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  scrollToIndex(index);
                }}
              >
                <span className="sr-only">Go to testimonial {index + 1}</span>
                <span aria-hidden="true">{index + 1}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomerTestimonials;
