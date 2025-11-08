import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Truck, 
  Tractor, 
  Package, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Navigation,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TrackingRoute, TrackingCheckpoint } from '../../data/tracking';

interface TrackingMap3DProps {
  trackingData: TrackingRoute[];
  selectedTracking?: string;
  onTrackingSelect?: (trackingId: string) => void;
  viewMode?: 'overview' | 'detailed';
}

export function TrackingMap3D({ 
  trackingData, 
  selectedTracking, 
  onTrackingSelect, 
  viewMode = 'overview' 
}: TrackingMap3DProps) {
  const [zoom, setZoom] = useState(1);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getVehicleIcon = (type: 'truck' | 'tractor' | 'van') => {
    switch (type) {
      case 'truck': return Truck;
      case 'tractor': return Tractor;
      case 'van': return Package;
      default: return Truck;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'active': return 'text-yellow-400';
      case 'pending': return 'text-gray-400';
      case 'delayed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRouteColor = (overallStatus: string) => {
    switch (overallStatus) {
      case 'delivered': return '#22c55e';
      case 'out_for_delivery': return '#3b82f6';
      case 'in_warehouse': return '#f59e0b';
      case 'in_transit_to_warehouse': return '#eab308';
      case 'delayed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.2, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.2, 0.5));
  const handleReset = () => setZoom(1);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            3D Live Tracking Map
          </CardTitle>
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
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Live
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative bg-slate-900 overflow-hidden" style={{ height: '500px' }}>
          {/* Background Tamil Nadu Map */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 400'%3E%3Cpath fill='%234f46e5' stroke='%236366f1' stroke-width='2' d='M50,50 L450,50 L420,350 L80,350 Z'/%3E%3C/svg%3E")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Glowing Grid */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#22c55e" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Interactive Map Content */}
          <motion.div
            className="absolute inset-4"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Routes */}
            {trackingData.map((route, index) => {
              const routeColor = getRouteColor(route.overall_status);
              const isSelected = selectedTracking === route.tracking_id;
              
              return (
                <div key={route.tracking_id}>
                  {/* Route Path */}
                  <svg 
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: isSelected ? 20 : 10 }}
                  >
                    <defs>
                      <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: routeColor, stopOpacity: 0.3 }} />
                        <stop offset="50%" style={{ stopColor: routeColor, stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: routeColor, stopOpacity: 0.3 }} />
                      </linearGradient>
                      <filter id={`glow-${index}`}>
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    {route.checkpoints.map((checkpoint, cpIndex) => {
                      if (cpIndex === 0) return null;
                      const prevCheckpoint = route.checkpoints[cpIndex - 1];
                      
                      return (
                        <motion.line
                          key={`${checkpoint.id}-line`}
                          x1={`${prevCheckpoint.location.coordinates.lng * 5}%`}
                          y1={`${(100 - prevCheckpoint.location.coordinates.lat * 10) + 30}%`}
                          x2={`${checkpoint.location.coordinates.lng * 5}%`}
                          y2={`${(100 - checkpoint.location.coordinates.lat * 10) + 30}%`}
                          stroke={`url(#gradient-${index})`}
                          strokeWidth={isSelected ? "4" : "2"}
                          filter={`url(#glow-${index})`}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ 
                            pathLength: checkpoint.status === 'completed' ? 1 : 0.5,
                            opacity: 1 
                          }}
                          transition={{ duration: 2, delay: cpIndex * 0.5 }}
                        />
                      );
                    })}
                  </svg>

                  {/* Vehicle Position */}
                  <motion.div
                    className={`absolute cursor-pointer ${isSelected ? 'z-30' : 'z-20'}`}
                    style={{
                      left: `${route.current_location.lng * 5}%`,
                      top: `${(100 - route.current_location.lat * 10) + 30}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onTrackingSelect?.(route.tracking_id)}
                    animate={{
                      y: [0, -3, 0],
                      scale: isSelected ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      y: { duration: 2, repeat: Infinity },
                      scale: { duration: 1, repeat: Infinity }
                    }}
                  >
                    <div className={`relative ${isSelected ? 'filter drop-shadow-lg' : ''}`}>
                      {/* Vehicle Icon */}
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${isSelected ? 'bg-blue-500 ring-4 ring-blue-300' : 'bg-green-500'}
                        shadow-lg
                      `}>
                        {React.createElement(getVehicleIcon(route.vehicle.type), {
                          className: "w-4 h-4 text-white"
                        })}
                      </div>

                      {/* Pulse Animation */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-green-400"
                        animate={{ scale: [1, 2, 2.5], opacity: [1, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />

                      {/* Vehicle Number */}
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white rounded px-2 py-1 text-xs whitespace-nowrap">
                        {route.vehicle.number}
                      </div>

                      {/* Status Badge */}
                      <div className="absolute -top-2 -right-2">
                        <div className={`w-3 h-3 rounded-full ${
                          route.overall_status === 'delivered' ? 'bg-green-400' :
                          route.overall_status === 'delayed' ? 'bg-red-400 animate-pulse' :
                          'bg-yellow-400 animate-pulse'
                        }`} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Checkpoints */}
                  {route.checkpoints.map((checkpoint, cpIndex) => (
                    <motion.div
                      key={checkpoint.id}
                      className="absolute"
                      style={{
                        left: `${checkpoint.location.coordinates.lng * 5}%`,
                        top: `${(100 - checkpoint.location.coordinates.lat * 10) + 30}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 15,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: cpIndex * 0.3 }}
                    >
                      <div className="relative">
                        {/* Checkpoint Icon */}
                        <div className={`
                          w-4 h-4 rounded-full border-2 border-white shadow-lg
                          ${checkpoint.status === 'completed' ? 'bg-green-500' :
                            checkpoint.status === 'active' ? 'bg-yellow-500 animate-pulse' :
                            checkpoint.status === 'delayed' ? 'bg-red-500' :
                            'bg-gray-400'}
                        `}>
                          {checkpoint.blockchain_hash && (
                            <Zap className="w-2 h-2 text-white absolute top-0.5 left-0.5" />
                          )}
                        </div>

                        {/* Checkpoint Info (on hover) */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/90 text-white rounded-lg p-2 text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="font-medium">{checkpoint.name}</div>
                          <div className="text-gray-300">{checkpoint.description}</div>
                          {checkpoint.blockchain_hash && (
                            <div className="text-green-400 mt-1">
                              🔒 Blockchain: {checkpoint.blockchain_hash.slice(0, 8)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              );
            })}

            {/* Warehouse Hubs */}
            {Array.from(new Set(trackingData.map(r => r.warehouse.taluk))).map((taluk, index) => {
              const warehouse = trackingData.find(r => r.warehouse.taluk === taluk)?.warehouse;
              if (!warehouse) return null;

              // Mock coordinates for warehouses
              const coords = {
                'Madurai': { lat: 9.9252, lng: 78.1198 },
                'Tirunelveli': { lat: 8.7139, lng: 77.7567 },
                'Thanjavur': { lat: 10.7870, lng: 79.1378 },
              }[taluk] || { lat: 10, lng: 78 };

              return (
                <motion.div
                  key={taluk}
                  className="absolute z-10"
                  style={{
                    left: `${coords.lng * 5}%`,
                    top: `${(100 - coords.lat * 10) + 30}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.5 }}
                >
                  <div className="relative">
                    {/* Warehouse Building */}
                    <div className="w-12 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg shadow-lg border-2 border-blue-300">
                      <div className="w-full h-2 bg-blue-300 rounded-t-lg" />
                      <div className="flex justify-center items-center h-4">
                        <Package className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    {/* Warehouse Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-lg border-2 border-blue-400 opacity-50"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Warehouse Label */}
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-blue-900/90 text-white rounded px-2 py-1 text-xs whitespace-nowrap">
                      {warehouse.name}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-black/80 rounded-lg p-3 text-white text-xs">
            <div className="mb-2 font-medium">Live Status</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                <span>In Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Delayed</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-green-400" />
                <span>Blockchain Verified</span>
              </div>
            </div>
          </div>

          {/* Real-time Updates */}
          <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500 rounded-lg p-2 text-green-400 text-xs">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live Updates</span>
            </div>
            <div>Last updated: {new Date().toLocaleTimeString('en-IN')}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}