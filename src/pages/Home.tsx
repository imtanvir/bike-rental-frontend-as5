import Banner from "@/components/Banner";
import ContactUs from "@/components/ContactUs";
import CouponWheel from "@/components/CouponWeel";
import CustomerTestimonials from "@/components/CustomerTestimonials";
import FeaturedBikes from "@/components/FeaturedBikes";
import WhyChooseUs from "@/components/WhyChooseUs";
import "../pages/Home.css";
const Home = () => {
  return (
    <>
      <Banner />
      <FeaturedBikes />
      <CustomerTestimonials />
      <WhyChooseUs />
      <CouponWheel />
      <ContactUs />
    </>
  );
};

export default Home;
