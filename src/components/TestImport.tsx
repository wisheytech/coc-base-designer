'use client';

import React from 'react';
import { COCBuilding, getBuildingsForTH, getMaxBuildingCount } from '@/types';

export default function TestImport() {
  // Test the import and type usage
  const thLevel = 10;
  const buildings: COCBuilding[] = getBuildingsForTH(thLevel);
  const cannonCount = getMaxBuildingCount('cannon', thLevel);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🧪 Type Import Test</h1>
      
      <div className="space-y-2">
        <p><strong>TH Level:</strong> {thLevel}</p>
        <p><strong>Available Buildings:</strong> {buildings.length}</p>
        <p><strong>Max Cannons for TH{thLevel}:</strong> {cannonCount}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Building List:</h2>
        <ul className="list-disc pl-6">
          {buildings.map((building) => (
            <li key={building.id}>
              {building.name} (Max: {building.availability[thLevel]?.maxCount || 0})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
