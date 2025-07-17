"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState, useEffect } from "react";
import standsImage from "./stand_02.png";
import localSeoIcon from "./stand_local_seo.png";
import allInclusive from "./stand_local_seo_360.png";
import { OrderModal } from "../OrderModal";
import pricesData from '@/app/data/prices.json';
import productsData from '@/app/data/products.json';



export default function Products() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  const handleOrderClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsOrderModalOpen(true);
  };

  // Set client-side flag after mounting to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get price entries from prices.json
  const standOnlyPriceEntry = pricesData.find(p => p.number_of_stands === 1 && p.local_seo === 0 && p.full_service === 0);
  const localSeoPriceEntry = pricesData.find(p => p.number_of_stands === 3 && p.local_seo === 1 && p.full_service === 0);
  const fullServicePriceEntry = pricesData.find(p => p.number_of_stands === 3 && p.local_seo === 0 && p.full_service === 1);

  return (
    <>
      <section id="products" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>

          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(productsData).map(([productId, productData], index) => {
              // Get appropriate image based on product ID
              const getProductImage = (id: string) => {
                switch(id) {
                  case 'stand_only': return standsImage;
                  case 'stand_visibility': return localSeoIcon;
                  case 'stand_visibility_web': return allInclusive;
                  default: return standsImage;
                }
              };

              // Get appropriate price entry based on product configuration
              const getPriceEntry = (id: string) => {
                switch(id) {
                  case 'stand_only': return standOnlyPriceEntry;
                  case 'stand_visibility': return localSeoPriceEntry;
                  case 'stand_visibility_web': return fullServicePriceEntry;
                  default: return null;
                }
              };

              const priceEntry = getPriceEntry(productId);
              const monthlyText = (productId === 'stand_visibility' || productId === 'stand_visibility_web') ? '/mes' : '';
              const originalPrice = priceEntry?.price || 0;
              
              // Only calculate discount-related values client-side to prevent hydration issues
              const hasDiscount = isClient ? (priceEntry?.voucher && priceEntry?.voucher_percent) : false;
              const discountedPrice = isClient && hasDiscount ? originalPrice * (1 - (priceEntry?.voucher_percent || 0)) : originalPrice;

              const product = {
                id: productData.id,
                title: productData.title,
                description: productData.description,
                image: getProductImage(productId),
                cta_text: productData.cta_text,
                label: productData.label,
                features: productData.features,
                priceEntry,
                originalPrice,
                discountedPrice,
                hasDiscount,
                monthlyText,
                isClient
              };

              return (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative flex flex-col h-full">
                {product.label && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span 
                      className="text-white px-4 py-2 rounded-full text-sm font-bold"
                      style={{ backgroundColor: product.label.color }}
                    >
                      {product.label.text}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-center mb-6">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={300}
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h3>
                  
                  <div className="mb-6">
                    {product.isClient && product.hasDiscount ? (
                      <div className="text-center space-y-2">
                        <div className="font-bold text-[#7f6d2a] py-2 px-4">
                          <span className="text-5xl">{product.discountedPrice.toFixed(2)}</span>
                          <span className="text-2xl">€{product.monthlyText}</span>
                        </div>
                        <div className="text-gray-500 line-through">
                          <span className="text-xl">{product.originalPrice.toFixed(2)}</span>
                          <span className="text-base">€{product.monthlyText}</span>
                        </div>
                        {/* Discount and Permanencia in same row */}
                        <div className="flex justify-center items-center gap-3 flex-wrap">
                          <div className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                            -50% dto.
                          </div>
                          {productData.secondary_label && (
                            <span 
                              className="text-[#7f6d2a] text-sm font-semibold px-3 py-1 rounded-full border border-[#7f6d2a]"
                            >
                              {productData.secondary_label.text}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="font-bold text-[#7f6d2a] py-2 px-4">
                          <span className="text-5xl">{product.originalPrice.toFixed(2)}</span>
                          <span className="text-2xl">€{product.monthlyText}</span>
                        </div>
                        {productData.secondary_label && (
                          <div className="mt-2">
                            <span 
                              className="text-[#7f6d2a] text-sm font-semibold px-3 py-1 rounded-full border border-[#7f6d2a]"
                            >
                              {productData.secondary_label.text}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Move button here, right after price */}
                  <button 
                    onClick={() => handleOrderClick(product.id)}
                    className="w-full bg-[#7f6d2a] text-white py-3 rounded-lg font-semibold hover:bg-[#6a5a23] transition-colors mb-6"
                  >
                    {product.cta_text}
                  </button>

                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedProductId={selectedProductId}
        onProductChange={(productId) => setSelectedProductId(productId)}
      />
    </>
  );
} 