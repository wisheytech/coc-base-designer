'use client';

import { useState } from 'react';

interface CanvasControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onPanChange: (deltaX: number, deltaY: number) => void;
  onResetView: () => void;
}

export function CanvasControls({ zoom, onZoomChange, onPanChange, onResetView }: CanvasControlsProps) {
  const [isPanning, setIsPanning] = useState(false);

  const zoomIn = () => onZoomChange(Math.min(3, zoom * 1.2));
  const zoomOut = () => onZoomChange(Math.max(0.3, zoom * 0.8));

  return (
    <>
      {/* Zoom Controls - Works on both mobile and desktop */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="w-12 h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg flex items-center justify-center font-bold text-xl transition-colors"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="w-12 h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg flex items-center justify-center font-bold text-xl transition-colors"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={onResetView}
          className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center font-bold text-xs transition-colors"
          title="Reset View"
        >
          ⌂
        </button>
      </div>

      {/* Pan Controls - Mobile friendly */}
      <div className="fixed bottom-4 right-4 z-50 grid grid-cols-3 gap-1 md:hidden">
        <div></div>
        <button
          onMouseDown={() => onPanChange(0, 20)}
          onTouchStart={() => onPanChange(0, 20)}
          className="w-10 h-10 bg-amber-600 hover:bg-amber-700 text-white rounded shadow-lg flex items-center justify-center font-bold transition-colors"
        >
          ↑
        </button>
        <div></div>
        <button
          onMouseDown={() => onPanChange(-20, 0)}
          onTouchStart={() => onPanChange(-20, 0)}
          className="w-10 h-10 bg-amber-600 hover:bg-amber-700 text-white rounded shadow-lg flex items-center justify-center font-bold transition-colors"
        >
          ←
        </button>
        <div></div>
        <button
          onMouseDown={() => onPanChange(20, 0)}
          onTouchStart={() => onPanChange(20, 0)}
          className="w-10 h-10 bg-amber-600 hover:bg-amber-700 text-white rounded shadow-lg flex items-center justify-center font-bold transition-colors"
        >
          →
        </button>
        <div></div>
        <button
          onMouseDown={() => onPanChange(0, -20)}
          onTouchStart={() => onPanChange(0, -20)}
          className="w-10 h-10 bg-amber-600 hover:bg-amber-700 text-white rounded shadow-lg flex items-center justify-center font-bold transition-colors"
        >
          ↓
        </button>
        <div></div>
      </div>

      {/* Zoom Slider - Desktop */}
      <div className="fixed bottom-4 left-4 z-50 hidden md:block">
        <div className="bg-black bg-opacity-50 rounded-lg p-3">
          <label className="block text-white text-sm mb-2">Zoom: {Math.round(zoom * 100)}%</label>
          <input
            type="range"
            min="30"
            max="300"
            value={zoom * 100}
            onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
            className="w-32 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </>
  );
}
