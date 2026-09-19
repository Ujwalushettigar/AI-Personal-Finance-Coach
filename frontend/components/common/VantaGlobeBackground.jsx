"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function VantaGlobeBackground({ children }) {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    let effect = null;

    const loadVanta = async () => {
      if (!effect && vantaRef.current) {
        try {
          const GLOBE = (await import("vanta/dist/vanta.globe.min")).default;
          effect = GLOBE({
            el: vantaRef.current,
            THREE: THREE,
            backgroundAlpha: 1,
            backgroundColor: 0x0A0E1A,
            color: 0x39FF88,
            color2: 0x22D3EE,
            gyroControls: false,
            maxDistance: 22,
            minHeight: 200,
            minWidth: 200,
            mouseControls: true,
            points: 12,
            scale: 1,
            scaleMobile: 1,
            showDots: true,
            size: 1.1,
            spacing: 14,
            touchControls: true,
          });
          setVantaEffect(effect);
        } catch (err) {
          console.error("Vanta initialization error:", err);
        }
      }
    };

    loadVanta();

    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg">
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none" />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}

