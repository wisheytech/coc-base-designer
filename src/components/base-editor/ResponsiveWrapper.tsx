'use client';

import { useState, useEffect } from 'react';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
}

export function ResponsiveWrapper({ children }: ResponsiveWrapperProps) {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isLandscape: false
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width <= 768;
      const isLandscape = width > height;

      setViewport({ width, height, isMobile, isLandscape });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return (
    <div 
      className={`coc-responsive-wrapper ${viewport.isMobile ? 'mobile' : 'desktop'} ${viewport.isLandscape ? 'landscape' : 'portrait'}`}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  );
}
