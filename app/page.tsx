"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedIn from "./components/FeaturedIn";
import Products from "./components/Products";
import WhyJust5Stars from "./components/WhyJust5Stars";
import SuccessStories from "./components/SuccessStories";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import { DiscountRibbon } from "./components/DiscountRibbon";

export default function Home() {
  return (
    <main>
      <Navbar />
      <DiscountRibbon />
      <Hero />
      <FeaturedIn />
      <Products />
      <WhyJust5Stars />
      <SuccessStories />
      <CTA />
      <Footer />
    </main>
  );
}
