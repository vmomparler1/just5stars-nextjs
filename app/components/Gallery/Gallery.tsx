"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface GalleryProps {
  images: {
    src: string | StaticImageData;
    alt: string;
    title?: string;
    description?: string;
  }[];
  className?: string;
}

export default function Gallery({ images, className = "" }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main Image Display */}
      <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          fill
          className="object-contain"
          priority={currentIndex === 0}
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Imagen anterior"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Siguiente imagen"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Image Info */}
      {(images[currentIndex].title || images[currentIndex].description) && (
        <div className="mt-4 text-center">
          {images[currentIndex].title && (
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {images[currentIndex].title}
            </h4>
          )}
          {images[currentIndex].description && (
            <p className="text-gray-600">
              {images[currentIndex].description}
            </p>
          )}
        </div>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                index === currentIndex
                  ? "bg-blue-600 scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}