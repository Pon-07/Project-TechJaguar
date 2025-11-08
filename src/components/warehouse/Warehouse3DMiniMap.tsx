import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { MapPin, Navigation, Package, Settings, Truck } from 'lucide-react';

interface WarehouseSection {
  id: string;
  name: string;
  type: 'rack' | 'aisle' | 'control' | 'loading' | 'storage';
  position: { x: number; y: number; z: number };
  status: 'healthy' | 'warning' | 'critical';
  occupancy: number;
  items: number;
}

interface CameraPosition {
  x: number;
  y: number;
  z: number;
  rotation: number;
}

interface Warehouse3DMiniMapProps {
  sections: WarehouseSection[];
  cameraPosition: CameraPosition;
  selectedSection: WarehouseSection | null;
  onSectionClick: (section: WarehouseSection) => void;
}

export function Warehouse3DMiniMap({ 
  sections, 
  cameraPosition, 
  selectedSection, 
  onSectionClick 
}: Warehouse3DMiniMapProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#138808'; // India Green
      case 'warning': return '#FF9933'; // Saffron
      case 'critical': return '#dc2626'; // Red
      default: return '#6b7280'; // Gray
    }
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'storage': return Package;
      case 'control': return Settings;
      case 'loading': return Truck;
      default: return Package;
    }
  };

  // Normalize positions for mini-map (scale down from 3D coordinates)
  const normalizePosition = (pos: { x: number; y: number; z: number }) => ({
    x: (pos.x / 60) * 100, // Scale to percentage
    y: (pos.z / 60) * 100  // Use Z for Y in 2D map
  });

  const cameraMapPosition = normalizePosition(cameraPosition);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-4 right-4 z-20"
    >
      <Card className="w-64 bg-black/20 backdrop-blur-lg border border-[#FF9933]/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <Navigation className="w-4 h-4 text-[#FF9933]" />
            Warehouse Map
            <Badge className="ml-auto bg-[#0B3D91]/30 text-[#0B3D91] border-[#0B3D91]">
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          {/* Mini Map Container */}
          <div className="relative w-full h-40 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-[#FF9933]/20 overflow-hidden">
            {/* Grid Background */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
              <defs>
                <pattern id="miniMapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 153, 51, 0.3)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#miniMapGrid)" />
            </svg>

            {/* Warehouse Sections */}
            {sections.map((section) => {
              const position = normalizePosition(section.position);
              const Icon = getSectionIcon(section.type);
              const isSelected = selectedSection?.id === section.id;
              
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => onSectionClick(section)}
                >
                  {/* Section Indicator */}
                  <div 
                    className={`relative w-6 h-6 rounded-lg transition-all duration-300 ${
                      isSelected ? 'ring-2 ring-white' : ''
                    }`}
                    style={{
                      backgroundColor: getStatusColor(section.status),
                      boxShadow: `0 0 ${isSelected ? '12px' : '8px'} ${getStatusColor(section.status)}66`
                    }}
                  >
                    <Icon className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    
                    {/* Pulse Animation for Selected */}
                    {isSelected && (
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-lg border-2 border-white"
                      />
                    )}
                  </div>

                  {/* Hover Tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap border border-[#FF9933]/50">
                    {section.id}
                  </div>

                  {/* Status Indicator */}
                  <div 
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white"
                    style={{ backgroundColor: getStatusColor(section.status) }}
                  />
                </motion.div>
              );
            })}

            {/* Camera Position Indicator */}
            <motion.div
              className="absolute z-10"
              style={{
                left: `${cameraMapPosition.x}%`,
                top: `${cameraMapPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                rotate: cameraPosition.rotation
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Camera Icon */}
              <div className="relative">
                <div className="w-4 h-4 bg-[#FF9933] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
                
                {/* View Cone */}
                <div 
                  className="absolute top-1/2 left-1/2 w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 rotate-45"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255, 153, 51, 0.3) 45deg, transparent 90deg)',
                    borderRadius: '0 50% 0 0'
                  }}
                />

                {/* Pulse Animation */}
                <motion.div
                  animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 w-4 h-4 bg-[#FF9933]/30 rounded-full"
                />
              </div>
            </motion.div>

            {/* Compass */}
            <div className="absolute top-2 right-2">
              <div className="w-8 h-8 bg-black/50 rounded-full border border-[#FF9933]/50 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: -cameraPosition.rotation }}
                  transition={{ duration: 0.3 }}
                  className="text-[#FF9933] text-xs font-bold"
                >
                  N
                </motion.div>
              </div>
            </div>

            {/* "You Are Here" Label */}
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-[#FF9933]/20 text-[#FF9933] border-[#FF9933] text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                You Are Here
              </Badge>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 space-y-2">
            <div className="text-xs text-white font-medium">Status Legend</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#138808]" />
                <span className="text-white/80">Healthy</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#FF9933]" />
                <span className="text-white/80">Warning</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-white/80">Critical</span>
              </div>
            </div>
          </div>

          {/* Camera Position Info */}
          <div className="mt-3 p-2 bg-black/30 rounded border border-[#0B3D91]/30">
            <div className="text-xs text-[#0B3D91] font-medium mb-1">Camera Position</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
              <div>X: {cameraPosition.x.toFixed(1)}</div>
              <div>Y: {cameraPosition.y.toFixed(1)}</div>
              <div>Z: {cameraPosition.z.toFixed(1)}</div>
              <div>Rot: {cameraPosition.rotation.toFixed(1)}°</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}