import React, { useEffect, useState, useRef } from 'react';

export const CursorLight: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const requestRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let lastUpdateTime = 0;
    const throttleDelay = 16; // ~60fps

    const updateMousePosition = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastUpdateTime < throttleDelay) return;
      
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Check if hovering over interactive elements (optimized)
      const target = e.target as HTMLElement;
      const isButton = target.tagName === 'BUTTON' || 
                      target.tagName === 'A' || 
                      target.closest('button, a, [role="button"]') !== null;
      setIsHoveringButton(isButton);
      
      lastUpdateTime = now;
    };

    const animatePosition = () => {
      // Smooth interpolation for cursor following
      const lerp = (start: number, end: number, factor: number) => 
        start + (end - start) * factor;
      
      const lerpFactor = 0.15; // Adjust for smoothness vs responsiveness
      
      currentPositionRef.current.x = lerp(
        currentPositionRef.current.x, 
        mouseRef.current.x, 
        lerpFactor
      );
      currentPositionRef.current.y = lerp(
        currentPositionRef.current.y, 
        mouseRef.current.y, 
        lerpFactor
      );
      
      setMousePosition({ ...currentPositionRef.current });
      requestRef.current = requestAnimationFrame(animatePosition);
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    requestRef.current = requestAnimationFrame(animatePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const intensity = isHoveringButton ? 0.3 : 0.2;
  const size = isHoveringButton ? 400 : 500;

  return (
    <>
      {/* Main cursor light - single optimized layer */}
      <div
        className="pointer-events-none fixed inset-0 z-30 cursor-light-layer"
        style={{
          '--mouse-x': `${mousePosition.x}px`,
          '--mouse-y': `${mousePosition.y}px`,
          '--size': `${size}px`,
          '--intensity': intensity,
          background: `radial-gradient(var(--size) at var(--mouse-x) var(--mouse-y), rgba(139, 92, 246, var(--intensity)), transparent 70%)`,
        } as React.CSSProperties}
      />
      
      {/* Secondary glow effect - lighter and larger */}
      <div
        className="pointer-events-none fixed inset-0 z-25 cursor-light-layer"
        style={{
          '--mouse-x': `${mousePosition.x}px`,
          '--mouse-y': `${mousePosition.y}px`,
          '--size': `${size * 1.5}px`,
          '--intensity': intensity * 0.4,
          background: `radial-gradient(var(--size) at var(--mouse-x) var(--mouse-y), rgba(168, 85, 247, var(--intensity)), transparent 80%)`,
        } as React.CSSProperties}
      />
    </>
  );
};

export default CursorLight;
