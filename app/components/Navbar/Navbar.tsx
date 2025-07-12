"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import logo from "./logo_just5stars.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="Logo Just5Stars"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="/#stories" className="text-gray-600 hover:text-[#7f6d2a] transition-colors">
            Casos de Éxito
          </a>
          <a href="/contact" className="text-gray-600 hover:text-[#7f6d2a] transition-colors">
            Contacto
          </a>
          <button 
            onClick={scrollToProducts}
            className="bg-[#7f6d2a] text-white px-4 py-2 rounded-lg hover:bg-[#6a5a23] transition-colors"
          >
            Ver Servicios
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-[#7f6d2a] transition-colors"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="px-6 py-4 space-y-4">
            <a 
              href="/#stories" 
              className="block text-gray-600 hover:text-[#7f6d2a] transition-colors"
              onClick={toggleMenu}
            >
              Casos de Éxito
            </a>
            <a 
              href="/contact" 
              className="block text-gray-600 hover:text-[#7f6d2a] transition-colors"
              onClick={toggleMenu}
            >
              Contacto
            </a>
            <button 
              onClick={scrollToProducts}
              className="w-full bg-[#7f6d2a] text-white px-4 py-2 rounded-lg hover:bg-[#6a5a23] transition-colors"
            >
              Ver Servicios
            </button>
          </div>
        </div>
      )}
    </nav>
  );
} 