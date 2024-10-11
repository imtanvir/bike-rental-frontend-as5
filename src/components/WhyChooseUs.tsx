import { Bike, Clock, CreditCard, MapPin, Shield, Wrench } from "lucide-react";

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: <Bike className="w-12 h-12 text-primary dark:text-primary/90" />,
      title: "Wide Range of Bikes",
      description:
        "From city cruisers to mountain bikes, we have the perfect ride for every adventure.",
      stat: "50+ bike models",
    },
    {
      icon: <MapPin className="w-12 h-12 text-primary dark:text-primary/90" />,
      title: "Convenient Locations",
      description:
        "Multiple pickup and drop-off points across the city for your convenience.",
      stat: "10 locations citywide",
    },
    {
      icon: <Clock className="w-12 h-12 text-primary dark:text-primary/90" />,
      title: "Flexible Rental Periods",
      description:
        "Rent by the hour, day, or week. Our flexible options fit your schedule.",
      stat: "24/7 availability",
    },
    {
      icon: <Shield className="w-12 h-12 text-primary dark:text-primary/90" />,
      title: "Safety First",
      description:
        "All our bikes are regularly maintained and come with complimentary safety gear.",
      stat: "100% safety record",
    },
    {
      icon: <Wrench className="w-12 h-12 text-primary dark:text-primary/90" />,
      title: "Free Maintenance",
      description:
        "Enjoy free adjustments and on-the-go repairs during your rental period.",
      stat: "On-demand support",
    },
    {
      icon: (
        <CreditCard className="w-12 h-12 text-primary dark:text-primary/90" />
      ),
      title: "Competitive Pricing",
      description:
        "Great rates with discounts for longer rentals and frequent riders.",
      stat: "Up to 25% savings",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-blue-50 dark:bg-gradient-to-b dark:from-background dark:to-muted">
      <div className="container mx-auto px-4 poppins-regular">
        <h1 className="md:text-6xl text-3xl bebas-neue-regular text-left mb-4">
          Why Choose Our Bike Rental
        </h1>
        <p className="md:text-xl text-lg  text-left text-muted-foreground mb-12">
          Discover the advantages that make us the top choice for riding
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-4 p-3 bg-indigo-700/10 dark:bg-indigo-900/40 rounded-full">
                {benefit.icon}
              </div>
              <h3 className="md:text-2xl text-xl font-semibold mb-2 dark:text-slate-300">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground mb-4 dark:text-slate-400">
                {benefit.description}
              </p>
              <div className="mt-auto">
                <span className="text-lg font-bold text-primary dark:text-slate-300">
                  {benefit.stat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
