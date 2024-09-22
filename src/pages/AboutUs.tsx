import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  Bike,
  Calendar,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Sarah Pedal",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Cycling enthusiast with 15 years of experience in the bike industry.",
    },
    {
      name: "Mike Spoke",
      role: "Head Mechanic",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Certified bike technician with a passion for restoring vintage bicycles.",
    },
    {
      name: "Emma Chain",
      role: "Community Manager",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Former pro cyclist dedicated to making biking accessible to everyone.",
    },
  ];

  const milestones = [
    { year: 2015, event: "BikeBuddies founded with a fleet of 50 bikes" },
    { year: 2017, event: "Launched our mobile app for easy bike rentals" },
    { year: 2019, event: "Expanded to 5 locations across the city" },
    { year: 2022, event: "Introduced electric bikes to our fleet" },
    { year: 2024, event: "Reached 100,000 rides milestone" },
  ];

  return (
    <div className="bg-gradient-to-b from-green-50 to-blue-50 dark:from-background dark:to-muted">
      <header className="py-20">
        <div className="container mx-auto px-4 text-left">
          <h1 className="md:text-6xl text-4xl mb-4 bebas-neue-regular">
            About RidePro
          </h1>
          <p className="text-xl max-w-2xl poppins-regular">
            Pedaling towards a greener future, one ride at a time.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 space-y-20 poppins-regular">
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6 flex items-center justify-center">
            <Bike className="mr-2 h-8 w-8 text-primary" />
            Our Mission
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            At BikeBuddies, we're on a mission to revolutionize urban
            transportation. We believe that every pedal stroke brings us closer
            to cleaner air, healthier communities, and more vibrant cities. Our
            goal is to make cycling accessible, enjoyable, and convenient for
            everyone – whether you're a daily commuter, a weekend adventurer, or
            just looking for a fun way to explore the city.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className=" shadow-lg dark:border-none">
              <CardContent className="flex flex-col items-center p-6">
                <Bike className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Quality Bikes</h3>
                <p className="text-center text-muted-foreground">
                  Well-maintained fleet for all riding styles
                </p>
              </CardContent>
            </Card>
            <Card className=" shadow-lg dark:border-none">
              <CardContent className="flex flex-col items-center p-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Community Focus</h3>
                <p className="text-center text-muted-foreground">
                  Building a network of passionate cyclists
                </p>
              </CardContent>
            </Card>
            <Card className=" shadow-lg dark:border-none">
              <CardContent className="flex flex-col items-center p-6">
                <Award className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Eco-Friendly</h3>
                <p className="text-center text-muted-foreground">
                  Promoting sustainable urban mobility
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
            <Users className="mr-2 h-8 w-8 text-primary" />
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.name} className="overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
            <Calendar className="mr-2 h-8 w-8 text-primary" />
            Our Journey
          </h2>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center">
                <div className="w-24 text-right mr-8 font-bold text-primary text-lg">
                  {milestone.year}
                </div>
                <div className="flex-1 p-6 bg-muted rounded-lg relative overflow-hidden">
                  <p className="text-lg">{milestone.event}</p>
                  <Bike className="absolute right-4 bottom-4 h-16 w-16 text-primary/10" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-b from-indigo-100 dark:from-background to-muted text-slate-700 dark:text-slate-300 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
            <Phone className="mr-2 h-8 w-8" />
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                <p>123 Bike Lane, Cycleville, 98765</p>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                <p>+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                <p>ride@bikebuddies.com</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Hours of Operation</h3>
              <ul className="list-disc list-inside">
                <li>Monday - Friday: 7:00 AM - 8:00 PM</li>
                <li>Saturday - Sunday: 8:00 AM - 6:00 PM</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button
              className="text-slate-700 dark:text-slate-300 shadow-lg"
              variant="outline"
              size="lg"
            >
              <Link to="/" className="flex items-center">
                Contact Us <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
