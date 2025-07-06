import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedIn from "./components/FeaturedIn";
import Products from "./components/Products";
import WhyJust5Stars from "./components/WhyJust5Stars";
import SuccessStories from "./components/SuccessStories";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      <Navbar />
      <Hero />
      <FeaturedIn />
      <Products />
      <WhyJust5Stars />
      <SuccessStories />
      <CTA />
      <Footer />
    </div>
  );
}
