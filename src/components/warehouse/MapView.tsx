import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, ZoomIn, ZoomOut, RotateCcw, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Warehouse } from '../../data/warehouses';
import { WarehouseCard } from './WarehouseCard';

interface MapViewProps {
  warehouses: Warehouse[];
  onWarehouseClick: (warehouse: Warehouse) => void;
  selectedTaluks: string[];
  activeFilters: string[];
}

export function MapView({ warehouses, onWarehouseClick, selectedTaluks, activeFilters }: MapViewProps) {
  const [zoom, setZoom] = useState(1);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  // Filter warehouses based on selection and filters
  const filteredWarehouses = warehouses.filter(warehouse => {
    // Taluk filter
    if (selectedTaluks.length > 0 && !selectedTaluks.includes(warehouse.taluk)) {
      return false;
    }

    // Active filters
    if (activeFilters.includes('zomato') && !warehouse.zomato_partner_enabled) {
      return false;
    }
    if (activeFilters.includes('organic') && !warehouse.inventory.some(item => item.organic_cert === 'Yes')) {
      return false;
    }
    if (activeFilters.includes('low-stock')) {
      const hasLowStock = warehouse.inventory.some(item => 
        (item.total_quantity_kg / 1000) < (warehouse.capacity_tonnes * 0.05)
      );
      if (!hasLowStock) return false;
    }

    return true;
  });

  // Mock coordinates for Tamil Nadu taluks - in real app, this would come from a GIS service
  const talukCoordinates: Record<string, { x: number; y: number }> = {
    'Maduravoyal': { x: 15, y: 45 },
    'Sairam': { x: 10, y: 25 },
    'Kanchipuram North': { x: 25, y: 55 },
    'Coimbatore North': { x: 5, y: 70 },
    'Salem Central': { x: 35, y: 40 },
    'Erode East': { x: 20, y: 65 },
    'Tiruppur West': { x: 15, y: 75 },
    'Vellore South': { x: 45, y: 30 },
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.2, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setSelectedPin(null);
  };

  const getWarehouseStatusColor = (warehouse: Warehouse) => {
    const occupancyPercentage = (warehouse.current_occupancy_tonnes / warehouse.capacity_tonnes) * 100;
    if (occupancyPercentage >= 95) return 'bg-red-500';
    if (occupancyPercentage >= 80) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getWarehouseSize = (warehouse: Warehouse) => {
    if (warehouse.capacity_tonnes >= 1500) return 'w-4 h-4';
    if (warehouse.capacity_tonnes >= 1000) return 'w-3.5 h-3.5';
    return 'w-3 h-3';
  };

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <div className="text-sm text-muted-foreground">
            Zoom: {Math.round(zoom * 100)}%
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Available
          </Badge>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <div className="w-2 h-2 bg-amber-500 rounded-full mr-2" />
            High Occupancy
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
            Full
          </Badge>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <Card className="relative overflow-hidden" style={{ height: '600px' }}>
          {/* Tamil Nadu Map Background - simplified outline */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23f0f9ff' stroke='%23cbd5e1' stroke-width='0.5' d='M10,20 L90,20 L85,80 L15,85 Z'/%3E%3C/svg%3E")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Interactive Map Content */}
          <motion.div
            className="absolute inset-4"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Warehouse Pins */}
            {filteredWarehouses.map((warehouse) => {
              const coords = talukCoordinates[warehouse.taluk];
              if (!coords) return null;

              return (
                <motion.div
                  key={warehouse.warehouse_id}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedPin(
                    selectedPin === warehouse.warehouse_id ? null : warehouse.warehouse_id
                  )}
                >
                  <div className="relative">
                    {/* Pin */}
                    <div className={`
                      ${getWarehouseSize(warehouse)} 
                      ${getWarehouseStatusColor(warehouse)} 
                      rounded-full border-2 border-white shadow-lg
                      ${selectedPin === warehouse.warehouse_id ? 'ring-2 ring-blue-500' : ''}
                    `} />
                    
                    {/* Warehouse ID Label */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white rounded px-2 py-1 shadow-sm border text-xs font-medium whitespace-nowrap">
                      {warehouse.warehouse_id}
                    </div>

                    {/* Zomato Badge */}
                    {warehouse.zomato_partner_enabled && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border border-white" />
                    )}

                    {/* Ripple Effect for Selected */}
                    {selectedPin === warehouse.warehouse_id && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-blue-500"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Taluk Labels */}
            {Object.entries(talukCoordinates).map(([taluk, coords]) => (
              <div
                key={taluk}
                className="absolute text-xs font-medium text-muted-foreground pointer-events-none"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y - 8}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {selectedTaluks.length === 0 || selectedTaluks.includes(taluk) ? taluk : ''}
              </div>
            ))}
          </motion.div>
        </Card>

        {/* Selected Warehouse Details */}
        {selectedPin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 right-4 w-80"
          >
            <WarehouseCard
              warehouse={filteredWarehouses.find(w => w.warehouse_id === selectedPin)!}
              onClick={() => onWarehouseClick(filteredWarehouses.find(w => w.warehouse_id === selectedPin)!)}
              isMapView={true}
            />
          </motion.div>
        )}
      </div>

      {/* Map Legend */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium mb-2">Map Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Available ({filteredWarehouses.filter(w => (w.current_occupancy_tonnes / w.capacity_tonnes) < 0.8).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span>High Occupancy ({filteredWarehouses.filter(w => {
                  const occ = w.current_occupancy_tonnes / w.capacity_tonnes;
                  return occ >= 0.8 && occ < 0.95;
                }).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Full ({filteredWarehouses.filter(w => (w.current_occupancy_tonnes / w.capacity_tonnes) >= 0.95).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span>Zomato Partner ({filteredWarehouses.filter(w => w.zomato_partner_enabled).length})</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredWarehouses.length} of {warehouses.length} warehouses
          </div>
        </div>
      </Card>
    </div>
  );
}