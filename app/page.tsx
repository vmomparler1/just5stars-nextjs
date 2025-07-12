"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedIn from "./components/FeaturedIn";
import Products from "./components/Products";
import { NFCExpositors } from "./components/NFCExpositors";
import SuccessStories from "./components/SuccessStories";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import { DiscountRibbon } from "./components/DiscountRibbon";
import { WhatsAppButton } from "./components/WhatsAppButton";
import CookiesBanner from "./components/CookiesBanner";

export default function Home() {
  return (
    <main>
      <Navbar />
      <DiscountRibbon />
      <Hero />
      <FeaturedIn />
      <Products />
      <NFCExpositors />
      <SuccessStories />
      <CTA />
      <Footer />
      <WhatsAppButton />
      <CookiesBanner />
      </main>
  );
}
