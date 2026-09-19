"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function VantaWavesBackground() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    let effect = null;

    const loadVanta = async () => {
      if (!effect && vantaRef.current) {
        try {
          const WAVES = (await import("vanta/dist/vanta.waves.min")).default;
          effect = WAVES({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x080c16,
            shininess: 25.00,
            waveHeight: 15.00,
            waveSpeed: 0.60,
            zoom: 0.75
          });
          setVantaEffect(effect);
        } catch (err) {
          console.error("Vanta WAVES initialization error:", err);
        }
      }
    };

    loadVanta();

    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#0A0E1A]">
      <div ref={vantaRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
