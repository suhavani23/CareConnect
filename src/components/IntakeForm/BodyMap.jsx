import React from 'react';
import './BodyMap.css';

const regions = [
  { id: 'Head', label: 'Head', path: 'M100,20 C100,5 140,5 140,20 C140,40 130,50 120,60 C110,50 100,40 100,20 Z', textPos: { x: 120, y: 30 } },
  { id: 'Neck', label: 'Neck', path: 'M115,60 L125,60 L125,70 L115,70 Z', textPos: { x: 120, y: 68 } },
  { id: 'Left Shoulder', label: 'L. Shoulder', path: 'M115,70 L80,80 L70,100 L100,90 Z', textPos: { x: 90, y: 85 } },
  { id: 'Right Shoulder', label: 'R. Shoulder', path: 'M125,70 L160,80 L170,100 L140,90 Z', textPos: { x: 150, y: 85 } },
  { id: 'Chest', label: 'Chest', path: 'M100,90 L140,90 L135,140 L105,140 Z', textPos: { x: 120, y: 115 } },
  { id: 'Abdomen', label: 'Abdomen', path: 'M105,140 L135,140 L135,200 L105,200 Z', textPos: { x: 120, y: 175 } },
  { id: 'Groin', label: 'Groin/Pelvis', path: 'M105,200 L135,200 L120,230 Z', textPos: { x: 120, y: 215 } },
  { id: 'Left Arm', label: 'L. Arm', path: 'M70,100 L50,160 L65,165 L80,110 Z', textPos: { x: 60, y: 135 } },
  { id: 'Right Arm', label: 'R. Arm', path: 'M170,100 L190,160 L175,165 L160,110 Z', textPos: { x: 180, y: 135 } },
  { id: 'Left Hand', label: 'L. Hand', path: 'M50,160 L40,190 L55,195 L65,165 Z', textPos: { x: 48, y: 180 } },
  { id: 'Right Hand', label: 'R. Hand', path: 'M190,160 L200,190 L185,195 L175,165 Z', textPos: { x: 192, y: 180 } },
  { id: 'Left Leg', label: 'L. Leg', path: 'M105,200 L120,230 L100,320 L85,315 Z', textPos: { x: 100, y: 270 } },
  { id: 'Right Leg', label: 'R. Leg', path: 'M135,200 L120,230 L140,320 L155,315 Z', textPos: { x: 140, y: 270 } },
  { id: 'Left Foot', label: 'L. Foot', path: 'M85,315 L100,320 L105,340 L80,340 Z', textPos: { x: 92, y: 335 } },
  { id: 'Right Foot', label: 'R. Foot', path: 'M155,315 L140,320 L135,340 L160,340 Z', textPos: { x: 148, y: 335 } }
];

const BodyMap = ({ selectedRegions, onToggleRegion }) => {
  return (
    <div className="body-map-wrapper">
      <div className="body-map-instruction">
        <strong>Tap the affected areas</strong> on the body map below.
      </div>

      <div className="body-map-svg-container">
        <svg viewBox="0 0 240 360" preserveAspectRatio="xMidYMin meet">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <g>
            {regions.map((region) => {
              const isSelected = selectedRegions.has(region.id);
              return (
                <g key={region.id} onClick={() => onToggleRegion(region.id)}>
                  <path
                    className={`body-region ${isSelected ? 'selected' : ''}`}
                    d={region.path}
                  />
                  <text
                    x={region.textPos.x}
                    y={region.textPos.y}
                    className={`body-region-label ${isSelected ? 'label-selected' : ''}`}
                  >
                    {region.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="w-full">
        <div className="body-map-count mb-2">
          Selected Areas: <strong>{selectedRegions.size}</strong>
        </div>
        <div className="body-map-tags">
          {selectedRegions.size === 0 && (
            <div className="body-map-empty">No areas selected yet</div>
          )}
          {Array.from(selectedRegions).map((regionId) => (
            <span
              key={regionId}
              className="body-map-tag"
              onClick={() => onToggleRegion(regionId)}
            >
              {regionId}
              <span className="body-map-tag-x">✕</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BodyMap;
