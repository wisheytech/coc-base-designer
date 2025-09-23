'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Line, Rect, Group, Text, Circle } from 'react-konva';
import { getBuildingsForTH, getMaxBuildingCount } from '@/types';
import { useBaseStore } from '@/stores/baseStore';

const COC_GRID_SIZE = 32;
const COC_BASE_WIDTH = 44;
const COC_BASE_HEIGHT = 44;

const COC_COLORS = {
  grass: '#7cb342',
  grassDark: '#689f38',
  baseCanvas: '#8bc34a',
  gridLine: '#9ccc65',
  gridLineStrong: '#aed581',
  baseBorder: '#558b2f',
  selected: '#00e676',
  snapGuide: '#ffeb3b'
};

const BUILDING_COLORS: Record<string, { main: string; top: string; shadow: string }> = {
  town_hall: { main: '#ff6f00', top: '#ff8f00', shadow: '#e65100' },
  cannon: { main: '#8d6e63', top: '#a1887f', shadow: '#5d4037' },
  archer_tower: { main: '#4caf50', top: '#66bb6a', shadow: '#2e7d32' },
  mortar: { main: '#607d8b', top: '#78909c', shadow: '#37474f' },
  wizard_tower: { main: '#9c27b0', top: '#ba68c8', shadow: '#6a1b9a' },
  tesla: { main: '#2196f3', top: '#42a5f5', shadow: '#0d47a1' },
  air_defense: { main: '#f44336', top: '#ef5350', shadow: '#c62828' },
  gold_mine: { main: '#ffc107', top: '#ffca28', shadow: '#f57c00' },
  elixir_collector: { main: '#e91e63', top: '#ec407a', shadow: '#ad1457' },
  gold_storage: { main: '#ff9800', top: '#ffa726', shadow: '#ef6c00' },
  elixir_storage: { main: '#673ab7', top: '#7986cb', shadow: '#4527a0' },
  army_camp: { main: '#4caf50', top: '#66bb6a', shadow: '#2e7d32' },
  barracks: { main: '#795548', top: '#8d6e63', shadow: '#4e342e' },
  clan_castle: { main: '#3f51b5', top: '#5c6bc0', shadow: '#283593' },
};

export function BaseEditor() {
  const stageRef = useRef<any>(null);
  const { buildings, addBuilding, updateBuilding, removeBuilding, clearAll } = useBaseStore();

  const [selectedTH, setSelectedTH] = useState(10);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

  // Default zoom at 100% for parity with the in-game “Edit Mode” feel; range still 60%–150%. [web:264][web:3]
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [zoomInput, setZoomInput] = useState('100');

  // Screen-space optical offset (pre-flip/pre-scale) scaled by zoom to eliminate drift at low/high zoom. [web:234][web:3]
  const getOpticalOffset = (basePxHeight: number, z: number) => ({
    x: 0,
    y: Math.round(basePxHeight * 0.298 * z)
  });

  // Slightly wider horizontal stretch so left/right corners match the game’s framing more closely. [web:236][web:3]
  const SCREEN_STRETCH_X = 1.22;

  // Responsive canvas dimensions
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 800,
    height: 600,
    scale: 1,
    stageWidth: COC_BASE_WIDTH * COC_GRID_SIZE,
    stageHeight: COC_BASE_HEIGHT * COC_GRID_SIZE
  });

  const availableBuildings = getBuildingsForTH(selectedTH);

  // Compute responsive size with headroom for isometric tilt. [web:77][web:3]
  const calculateCanvasDimensions = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const topBarHeight = viewportWidth < 1024 ? 50 : 60;
    const bottomBarHeight = viewportWidth < 1024 ? 110 : 130;
    const verticalMargin = 10;

    const availableWidth = viewportWidth - 40;
    const availableHeight = viewportHeight - topBarHeight - bottomBarHeight - (verticalMargin * 2);

    const baseWidth = COC_BASE_WIDTH * COC_GRID_SIZE;
    const baseHeight = COC_BASE_HEIGHT * COC_GRID_SIZE;

    const isometricHeightMultiplier = 1.2;
    const adjustedHeight = availableHeight / isometricHeightMultiplier;

    const scaleX = availableWidth / baseWidth;
    const scaleY = adjustedHeight / baseHeight;
    const optimalScale = Math.min(scaleX, scaleY, 0.9);

    const minScale = viewportWidth < 768 ? 0.35 : 0.5;
    const finalScale = Math.max(optimalScale, minScale);

    return {
      width: baseWidth * finalScale,
      height: baseHeight * finalScale,
      scale: finalScale,
      stageWidth: baseWidth,
      stageHeight: baseHeight
    };
  }, []);

  useEffect(() => {
    const updateDimensions = () => setCanvasDimensions(calculateCanvasDimensions());
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('resize', updateDimensions);
      document.body.style.overflow = 'auto';
    };
  }, [calculateCanvasDimensions]);

  useEffect(() => {
    setZoomInput(Math.round(zoom * 100).toString());
  }, [zoom]);

  const handleZoomChange = (newZoom: number) => {
    const clampedZoom = Math.max(0.6, Math.min(1.5, newZoom));
    setZoom(clampedZoom);
  };

  const handleZoomSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleZoomChange(parseFloat(e.target.value));
  };

  const handleZoomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomInput(e.target.value);
    const n = parseFloat(e.target.value);
    if (!isNaN(n) && n >= 60 && n <= 150) handleZoomChange(n / 100);
  };

  const handleZoomInputBlur = () => {
    const n = parseFloat(zoomInput);
    if (isNaN(n) || n < 60 || n > 150) setZoomInput(Math.round(zoom * 100).toString());
  };

  // Flip‑aware panning (axes invert after rotateZ(180deg), so subtract deltas). [web:3][web:186]
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  };
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isDragging) return;
    const dx = e.clientX - lastPanPoint.x;
    const dy = e.clientY - lastPanPoint.y;
    setPan(prev => ({ x: prev.x - dx, y: prev.y - dy }));
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  };
  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Building placement/snap/limits/collision
  const handleBuildingDrop = (buildingType: string, position: { x: number; y: number }) => {
    const adjustedX = (position.x - pan.x) / (zoom * canvasDimensions.scale);
    const adjustedY = (position.y - pan.y) / (zoom * canvasDimensions.scale);

    const snappedX = Math.round(adjustedX / COC_GRID_SIZE) * COC_GRID_SIZE;
    const snappedY = Math.round(adjustedY / COC_GRID_SIZE) * COC_GRID_SIZE;

    const minX = COC_GRID_SIZE * 2;
    const minY = COC_GRID_SIZE * 2;
    const maxX = COC_GRID_SIZE * (COC_BASE_WIDTH - 4);
    const maxY = COC_GRID_SIZE * (COC_BASE_HEIGHT - 4);

    if (snappedX < minX || snappedX > maxX || snappedY < minY || snappedY > maxY) return;

    const currentCount = buildings.filter(b => b.type === buildingType).length;
    const maxCount = getMaxBuildingCount(buildingType, selectedTH);
    if (currentCount >= maxCount) return;

    const hasCollision = buildings.some(b =>
      Math.abs(b.x - snappedX) < COC_GRID_SIZE && Math.abs(b.y - snappedY) < COC_GRID_SIZE
    );
    if (hasCollision) return;

    addBuilding({
      id: crypto.randomUUID(),
      type: buildingType,
      x: snappedX,
      y: snappedY,
      level: Math.floor(Math.random() * 3) + 1
    });
  };

  const handleBuildingMove = (id: string, position: { x: number; y: number }) => {
    const snappedX = Math.round(position.x / COC_GRID_SIZE) * COC_GRID_SIZE;
    const snappedY = Math.round(position.y / COC_GRID_SIZE) * COC_GRID_SIZE;
    updateBuilding(id, { x: snappedX, y: snappedY });
  };

  const opticalOffset = getOpticalOffset(canvasDimensions.height, zoom);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        // Outer scenery: layered backgrounds to evoke forest top, grassy mid, and darker vignette edges. [web:274][web:276]
        background: `
          radial-gradient(1200px 800px at 15% 10%, rgba(34,139,34,0.35), transparent 60%),
          radial-gradient(1000px 900px at 85% 15%, rgba(56,142,60,0.25), transparent 65%),
          radial-gradient(1600px 900px at 50% 100%, rgba(0,0,0,0.35), transparent 70%),
          linear-gradient(140deg, #78b43c 0%, #6aa238 35%, #5a9a36 55%, #4e8f33 75%, #4b8931 100%)
        `
      }}
    >
      {/* TOP UI BAR */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black bg-opacity-30 text-white p-1 sm:p-2">
        <div className="flex items-center justify-between flex-wrap gap-1 sm:gap-2">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="bg-orange-600 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center space-x-1 sm:space-x-2">
              <span>⚡</span>
              <span className="hidden sm:inline">Village Edit Mode</span>
            </div>
            <select
              value={selectedTH}
              onChange={(e) => setSelectedTH(Number(e.target.value))}
              className="bg-black bg-opacity-50 text-white px-2 py-1 sm:px-2 sm:py-1.5 rounded text-xs sm:text-sm font-semibold"
            >
              {Array.from({ length: 17 }, (_, i) => i + 1).map((th) => (
                <option key={th} value={th} className="bg-black">TH{th}</option>
              ))}
            </select>
          </div>

          {/* ZOOM CONTROLS */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-black bg-opacity-50 px-1 sm:px-2 py-1 sm:py-1.5 rounded-lg">
            <button onClick={() => handleZoomChange(zoom * 0.9)} className="w-6 h-6 sm:w-7 sm:h-7 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 font-bold text-xs sm:text-sm flex items-center justify-center">−</button>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-xs text-gray-300 hidden md:inline">60%</span>
              <input
                type="range"
                min="0.6"
                max="1.5"
                step="0.01"
                value={zoom}
                onChange={handleZoomSlider}
                className="w-8 sm:w-12 md:w-16 h-1.5 sm:h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #22c55e 0%, #22c55e ${((zoom - 0.6) / (1.5 - 0.6)) * 100}%, #4b5563 ${((zoom - 0.6) / (1.5 - 0.6)) * 100}%, #4b5563 100%)`
                }}
              />
              <span className="text-xs text-gray-300 hidden md:inline">150%</span>
            </div>
            <div className="flex items-center space-x-0.5 sm:space-x-1">
              <input
                type="text"
                value={zoomInput}
                onChange={handleZoomInput}
                onBlur={handleZoomInputBlur}
                onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                className="w-6 sm:w-8 h-5 sm:h-6 bg-black bg-opacity-50 text-white text-center text-xs sm:text-sm rounded border border-gray-600 focus:border-green-400 focus:outline-none"
              />
              <span className="text-xs sm:text-sm font-semibold">%</span>
            </div>
            <button onClick={() => { setZoom(1.0); setPan({ x: 0, y: 0 }); }} className="w-6 h-6 sm:w-7 sm:h-7 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 font-bold text-xs flex items-center justify-center" title="Reset zoom and pan">⌂</button>
          </div>
        </div>
      </div>

      {/* MAIN CANVAS AREA – centered 16:9 viewport with vignette to match in-game edges */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: 60,
          bottom: 120,
          display: 'grid',
          placeItems: 'center',
          // Subtle scenic floor behind the board using multiple backgrounds and a soft vignette. [web:274][web:276]
          background: `
            radial-gradient(1200px 700px at 50% 20%, rgba(139, 195, 74, 0.35), transparent 70%),
            radial-gradient(1200px 900px at 50% 110%, rgba(0,0,0,0.30), transparent 65%),
            linear-gradient(180deg, #75d053 0%, #22b24f 60%, #159244 100%)
          `,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* 16:9 canvas window */}
        <div
          id="builder-viewport"
          className="rounded-xl shadow-2xl border border-black/25"
          style={{
            width: 'min(92vw, 1024px)',
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            position: 'relative',
            // Slight vertical color drift like the game’s grass plane. [web:274]
            background: 'linear-gradient(180deg, #3ed25a 0%, #22b24f 60%, #148a41 100%)'
          }}
        >
          {/* Vignette overlay for more game-like depth at edges. [web:275][web:276] */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `
                radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.25) 100%)
              `
            }}
          />

          {/* Anchor at center via translate(-50%,-50%); keep origin at center for all layers. [web:3][web:174] */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              transformOrigin: 'center center'
            }}
          >
            {/* Screen-space horizontal stretch to widen left/right corners. [web:236] */}
            <div style={{ transform: `scaleX(${SCREEN_STRETCH_X})`, transformOrigin: 'center center' }}>
              {/* Screen-space optical offset scaled by zoom to prevent vertical drift at any zoom. [web:234] */}
              <div style={{ transform: `translate(${opticalOffset.x}px, ${opticalOffset.y}px)`, transformOrigin: 'center center' }}>
                {/* Isolated 180° flip so later transforms don’t affect it. [web:186] */}
                <div style={{ transform: 'rotateZ(180deg)', transformOrigin: 'center center' }}>
                  {/* Isometric chain; pan/zoom applied here with center pivot per MDN. [web:3][web:174] */}
                  <div
                    style={{
                      width: canvasDimensions.width,
                      height: canvasDimensions.height,
                      transformOrigin: 'center center',
                      transformStyle: 'preserve-3d',
                      transform: `
                        scale(${canvasDimensions.scale * zoom})
                        translate3d(${pan.x}px, ${pan.y}px, 0px)
                        rotateX(30deg)
                        rotateY(0deg)
                        rotateZ(45deg)
                      `,
                      transition: isDragging ? 'none' : 'transform 0.12s ease',
                      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
                    }}
                  >
                    <Stage
                      ref={stageRef}
                      width={canvasDimensions.stageWidth}
                      height={canvasDimensions.stageHeight}
                      onDrop={(e: React.DragEvent) => {
                        e.preventDefault();
                        const stage = stageRef.current;
                        if (stage) {
                          const pos = stage.getPointerPosition();
                          const buildingType = e.dataTransfer.getData('building-type');
                          if (buildingType && pos) handleBuildingDrop(buildingType, pos);
                        }
                      }}
                      onDragOver={(e: React.DragEvent) => e.preventDefault()}
                      onWheel={(e) => {
                        e.evt.preventDefault();
                        const direction = e.evt.deltaY > 0 ? -1 : 1;
                        handleZoomChange(zoom * (direction > 0 ? 1.05 : 0.95));
                      }}
                    >
                      <Layer>
                        {/* BASE CANVAS BACKGROUND WITH 3D DEPTH */}
                        <Rect
                          x={0}
                          y={0}
                          width={canvasDimensions.stageWidth}
                          height={canvasDimensions.stageHeight}
                          fill={COC_COLORS.baseCanvas}
                          stroke={COC_COLORS.baseBorder}
                          strokeWidth={6}
                          shadowColor="rgba(0,0,0,0.3)"
                          shadowBlur={20}
                          shadowOffset={{ x: 10, y: 10 }}
                        />

                        {/* DEPTH LAYERS FOR 3D EFFECT */}
                        <Rect x={-5} y={-5} width={canvasDimensions.stageWidth + 10} height={canvasDimensions.stageHeight + 10} fill="#689f38" opacity={0.6} />
                        <Rect x={-3} y={-3} width={canvasDimensions.stageWidth + 6} height={canvasDimensions.stageHeight + 6} fill="#7cb342" opacity={0.8} />

                        {/* AUTHENTIC COC DIAMOND GRID OVERLAY */}
                        <AuthenticCOCDiamondGrid />

                        {/* BUILDABLE AREA WITH 3D DEPTH */}
                        <Rect
                          x={COC_GRID_SIZE * 2}
                          y={COC_GRID_SIZE * 2}
                          width={COC_GRID_SIZE * (COC_BASE_WIDTH - 4)}
                          height={COC_GRID_SIZE * (COC_BASE_HEIGHT - 4)}
                          fill="rgba(139, 195, 74, 0.3)"
                          stroke={COC_COLORS.gridLineStrong}
                          strokeWidth={3}
                          dash={[15, 10]}
                          opacity={0.9}
                          shadowColor="rgba(255,255,255,0.2)"
                          shadowBlur={5}
                        />

                        {/* Buildings */}
                        {buildings.map((b) => (
                          <AuthenticCOCBuilding
                            key={b.id}
                            building={b}
                            isSelected={selectedBuildingId === b.id}
                            onMove={(pos) => handleBuildingMove(b.id, pos)}
                            onSelect={() => setSelectedBuildingId(b.id)}
                            onDelete={() => {
                              removeBuilding(b.id);
                              if (selectedBuildingId === b.id) setSelectedBuildingId(null);
                            }}
                          />
                        ))}
                      </Layer>
                    </Stage>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 

      {/* BOTTOM INVENTORY */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-cyan-600 via-cyan-500 to-transparent p-1 sm:p-2">
        <div className="text-center text-white text-xs sm:text-sm font-bold mb-1 drop-shadow-lg">
          🏗️ Drag buildings from the inventory to place them
        </div>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-40 rounded-xl p-1.5 sm:p-2 backdrop-blur-sm w-full max-w-6xl">
            <div className="flex space-x-1.5 sm:space-x-2 overflow-x-auto pb-1">
              {availableBuildings.map((building) => {
                const currentCount = buildings.filter(x => x.type === building.id).length;
                const maxCount = building.availability[selectedTH]?.maxCount || 0;
                const isMaxed = currentCount >= maxCount;
                const colors = BUILDING_COLORS[building.id] || BUILDING_COLORS.town_hall;

                return (
                  <div
                    key={building.id}
                    draggable={!isMaxed}
                    onDragStart={(e: React.DragEvent<HTMLDivElement>) => e.dataTransfer.setData('building-type', building.id)}
                    className={`flex-shrink-0 relative group ${isMaxed ? 'cursor-not-allowed opacity-50' : 'cursor-move'}`}
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg relative transform transition-all duration-200 ${!isMaxed && 'group-hover:scale-110 group-hover:shadow-lg'}`}
                      style={{
                        background: `linear-gradient(135deg, ${colors.top} 0%, ${colors.main} 60%, ${colors.shadow} 100%)`,
                        border: '2px solid rgba(255,255,255,0.4)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                    >
                      <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full border-2 border-white text-xs font-bold text-black flex items-center justify-center shadow-sm">
                        {building.availability[selectedTH]?.maxLevel || 1}
                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-cyan-600 text-white text-xs px-1 sm:px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                        ×{maxCount}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs drop-shadow-lg">
                        {building.name.split(' ').map((w: string) => w[0]).join('').toUpperCase()}
                      </div>
                    </div>
                    <div className="text-center text-white text-xs font-semibold mt-1 w-10 sm:w-12 lg:w-14 truncate drop-shadow-sm">
                      {building.name}
                    </div>
                    {currentCount > 0 && (
                      <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full text-xs font-bold text-white flex items-center justify-center shadow-lg border border-white">
                        {currentCount}
                      </div>
                    )}
                    {isMaxed && (
                      <div className="absolute inset-0 bg-red-600 bg-opacity-75 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">MAX</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Slider styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}

/* Grid overlay */
function AuthenticCOCDiamondGrid() {
  const lines = [];

  for (let x = 0; x <= COC_BASE_WIDTH; x++) {
    for (let y = 0; y <= COC_BASE_HEIGHT; y++) {
      const cx = x * COC_GRID_SIZE + COC_GRID_SIZE / 2;
      const cy = y * COC_GRID_SIZE + COC_GRID_SIZE / 2;
      const h = COC_GRID_SIZE / 2;
      if ((x + y) % 2 === 0 && x < COC_BASE_WIDTH && y < COC_BASE_HEIGHT) {
        lines.push(<Line key={`dsh-${x}-${y}`} points={[cx + 2, cy - h + 2, cx + h + 2, cy + 2, cx + 2, cy + h + 2, cx - h + 2, cy + 2, cx + 2, cy - h + 2]} stroke="rgba(0,0,0,0.2)" strokeWidth={1.2} opacity={0.4} closed fill="transparent" />);
        lines.push(<Line key={`d-${x}-${y}`} points={[cx, cy - h, cx + h, cy, cx, cy + h, cx - h, cy, cx, cy - h]} stroke={COC_COLORS.gridLine} strokeWidth={1.2} opacity={0.8} closed fill="transparent" />);
      }
    }
  }
  for (let x = 0; x <= COC_BASE_WIDTH; x++) {
    lines.push(<Line key={`vsh-${x}`} points={[x * COC_GRID_SIZE + 1, 1, x * COC_GRID_SIZE + 1, COC_BASE_HEIGHT * COC_GRID_SIZE + 1]} stroke="rgba(0,0,0,0.1)" strokeWidth={x % 5 === 0 ? 1.5 : 0.6} opacity={0.3} />);
    lines.push(<Line key={`v-${x}`} points={[x * COC_GRID_SIZE, 0, x * COC_GRID_SIZE, COC_BASE_HEIGHT * COC_GRID_SIZE]} stroke={COC_COLORS.gridLine} strokeWidth={x % 5 === 0 ? 1.5 : 0.6} opacity={0.5} />);
  }
  for (let y = 0; y <= COC_BASE_HEIGHT; y++) {
    lines.push(<Line key={`hsh-${y}`} points={[1, y * COC_GRID_SIZE + 1, COC_BASE_WIDTH * COC_GRID_SIZE + 1, y * COC_GRID_SIZE + 1]} stroke="rgba(0,0,0,0.1)" strokeWidth={y % 5 === 0 ? 1.5 : 0.6} opacity={0.3} />);
    lines.push(<Line key={`h-${y}`} points={[0, y * COC_GRID_SIZE, COC_BASE_WIDTH * COC_GRID_SIZE, y * COC_GRID_SIZE]} stroke={COC_COLORS.gridLine} strokeWidth={y % 5 === 0 ? 1.5 : 0.6} opacity={0.5} />);
  }
  return <>{lines}</>;
}

interface BuildingSpriteProps {
  building: any;
  isSelected: boolean;
  onMove: (position: { x: number; y: number }) => void;
  onSelect: () => void;
  onDelete: () => void;
}

/* Building sprite */
function AuthenticCOCBuilding({ building, isSelected, onMove, onSelect, onDelete }: BuildingSpriteProps) {
  const colors = BUILDING_COLORS[building.type] || BUILDING_COLORS.town_hall;
  const size = 30;
  const h3D = 8;

  return (
    <Group
      x={building.x}
      y={building.y}
      draggable
      onDragEnd={(e: any) => onMove({ x: e.target.x(), y: e.target.y() })}
      onClick={onSelect}
      onTap={onSelect}
      onDblClick={onDelete}
      onDblTap={onDelete}
    >
      <Rect x={4} y={4} width={size + 4} height={size + 4} fill="rgba(0,0,0,0.5)" cornerRadius={6} skewX={-3} skewY={-2} />
      <Rect width={size} height={size} fill={colors.main} stroke="rgba(0,0,0,0.4)" strokeWidth={1.5} cornerRadius={4} shadowColor="rgba(0,0,0,0.3)" shadowBlur={8} />
      <Rect x={-h3D / 2} y={-h3D} width={size} height={size} fill={colors.top} stroke="rgba(0,0,0,0.2)" strokeWidth={1} cornerRadius={4} opacity={0.95} />
      <Rect x={size} y={-h3D / 2} width={h3D} height={size + h3D / 2} fill={colors.shadow} opacity={0.9} />
      {isSelected && <Rect x={-6} y={-6} width={size + 12} height={size + 12} stroke={COC_COLORS.selected} strokeWidth={4} cornerRadius={8} dash={[8, 4]} />}
      <Text text={building.type.replace('_', '\n').toUpperCase()} fontSize={6} fill="white" width={size} height={size} align="center" verticalAlign="middle" fontStyle="bold" shadowColor="#000" shadowBlur={2} />
      <Circle x={size - 6} y={6} radius={6} fill="#ffd700" stroke="#ff8f00" strokeWidth={1.5} />
      <Text x={size - 6} y={6} text={building.level.toString()} fontSize={8} fill="#000" align="center" offsetX={3} offsetY={3} fontStyle="bold" />
    </Group>
  );
}
