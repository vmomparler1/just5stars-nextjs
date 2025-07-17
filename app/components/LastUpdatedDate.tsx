"use client";

import { useEffect, useState } from "react";

export default function LastUpdatedDate() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by ensuring component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <p className="text-sm text-gray-500">
        Última actualización: --
      </p>
    );
  }

  return (
    <p className="text-sm text-gray-500">
      Última actualización: {new Date().toLocaleDateString('es-ES')}
    </p>
  );
} 