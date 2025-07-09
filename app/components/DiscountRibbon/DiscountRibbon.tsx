"use client";

import { useEffect, useState } from "react";

const getMonthName = () => {
  const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  return months[new Date().getMonth()];
};

const getTimeLeftInMonth = () => {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const timeLeft = endOfMonth.getTime() - now.getTime();
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
};

export default function DiscountRibbon() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeftInMonth());
  const monthCode = `${getMonthName()}50`;

  useEffect(() => {
    // Update countdown every second
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeftInMonth());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="z-40 w-full bg-[#7f6d2a] text-white py-3 shadow-lg mt-[72px]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-center items-center gap-4 md:gap-8">
          <div className="text-xl md:text-xl font-bold">¡Ahora con 50% de descuento!</div>
          <div className="text-base md:text-lg">
            Usa el código <span className="font-mono bg-white/20 px-2 py-1 rounded">{monthCode}</span>
          </div>
          <div className="text-sm md:text-base flex items-center gap-2">
            <span>Promoción válida hasta:</span>
            <div className="flex items-center gap-1 font-mono">
              <span className="py-1 rounded">{timeLeft.days} días,</span>
              <span className="py-1 rounded">{timeLeft.hours.toString().padStart(2, '0')}h</span>
              <span className="py-1 rounded">{timeLeft.minutes.toString().padStart(2, '0')}m</span>
              <span className="py-1 rounded">{timeLeft.seconds.toString().padStart(2, '0')}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 