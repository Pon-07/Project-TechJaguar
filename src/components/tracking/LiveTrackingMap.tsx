import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Truck, 
  Tractor, 
  Package, 
  CheckCircle, 
  Clock,
  Navigation,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  User,
  Warehouse,
  Home
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { TrackingRoute } from '../../data/tracking';

interface LiveTrackingMapProps {
  trackingData: TrackingRoute[];
  selectedTracking?: string;
  onTrackingSelect?: (trackingId: string) => void;
  viewMode?: 'farmer' | 'warehouse' | 'consumer';
}

export function LiveTrackingMap({ 
  trackingData, 
  selectedTracking, 
  onTrackingSelect, 
  viewMode = 'farmer' 
}: LiveTrackingMapProps) {
  const [zoom, setZoom] = useState(1);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [hoveredVehicle, setHoveredVehicle] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 100);
    }, 2000); // Slower, more realistic movement
    return () => clearInterval(interval);
  }, []);

  const getVehicleIcon = (type: 'truck' | 'tractor' | 'van') => {
    switch (type) {
      case 'truck': return '🚚';
      case 'tractor': return '🚜';
      case 'van': return '🚐';
      default: return '🚚';
    }
  };

  const getCropIcon = (productName: string) => {
    if (productName.toLowerCase().includes('rice') || productName.toLowerCase().includes('paddy')) return '🌾';
    if (productName.toLowerCase().includes('tomato')) return '🍅';
    if (productName.toLowerCase().includes('mango')) return '🥭';
    if (productName.toLowerCase().includes('turmeric')) return '🟡';
    if (productName.toLowerCase().includes('groundnut')) return '🥜';
    return '🌱';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#22c55e'; // Green
      case 'out_for_delivery': return '#3b82f6'; // Blue
      case 'in_warehouse': return '#f59e0b'; // Amber
      case 'in_transit_to_warehouse': return '#eab308'; // Yellow
      case 'delayed': return '#ef4444'; // Red
      default: return '#6b7280'; // Gray
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered ✅';
      case 'out_for_delivery': return 'Out for Delivery 📦';
      case 'in_warehouse': return 'Stored 🏬';
      case 'in_transit_to_warehouse': return 'On the Way 🚚';
      case 'delayed': return 'Delayed ⚠️';
      default: return 'Unknown';
    }
  };

  const formatETA = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 0) return 'Overdue';
    if (diffHours < 1) return 'Less than 1 hour';
    if (diffHours === 1) return '1 hour';
    return `${diffHours} hours`;
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
            Live Tracking Map
            <Badge variant="outline" className="bg-green-50 text-green-700 animate-pulse">
              LIVE
            </Badge>
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
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative bg-slate-900 overflow-hidden" style={{ height: '600px' }}>
          {/* Animated Background Grid */}
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

          {/* Tamil Nadu Map Outline */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 500 400" className="w-full h-full">
              <path 
                d="M100,80 L400,60 L420,120 L400,200 L380,280 L350,340 L300,360 L200,350 L150,320 L120,280 L100,200 Z" 
                fill="none" 
                stroke="#4f46e5" 
                strokeWidth="2"
                className="animate-pulse"
              />
              {/* Taluk markers */}
              <circle cx="180" cy="160" r="3" fill="#22c55e" /> {/* Madurai */}
              <circle cx="140" cy="280" r="3" fill="#22c55e" /> {/* Tirunelveli */}
              <circle cx="280" cy="140" r="3" fill="#22c55e" /> {/* Thanjavur */}
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
            {/* Routes and Vehicles */}
            {trackingData.map((route, index) => {
              const statusColor = getStatusColor(route.overall_status);
              const isSelected = selectedTracking === route.tracking_id;
              const isHovered = hoveredVehicle === route.tracking_id;
              
              // Calculate vehicle position (mock animation)
              const baseX = 20 + (index * 15) % 60;
              const baseY = 20 + (index * 20) % 60;
              const animOffset = Math.sin((animationFrame + index * 10) * 0.1) * 2;
              
              return (
                <div key={route.tracking_id} className="relative">
                  {/* Route Path */}
                  <svg 
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: isSelected ? 20 : 10 }}
                  >
                    <defs>
                      <linearGradient id={`route-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: statusColor, stopOpacity: 0.3 }} />
                        <stop offset="50%" style={{ stopColor: statusColor, stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: statusColor, stopOpacity: 0.3 }} />
                      </linearGradient>
                      <filter id={`glow-${index}`}>
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* Animated route line */}
                    <motion.path
                      d={`M ${baseX}% ${baseY}% Q ${baseX + 20}% ${baseY + 10}% ${baseX + 40}% ${baseY + 5}%`}
                      stroke={`url(#route-gradient-${index})`}
                      strokeWidth={isSelected ? "4" : "2"}
                      fill="none"
                      filter={`url(#glow-${index})`}
                      initial={{ pathLength: 0 }}
                      animate={{ 
                        pathLength: route.overall_status === 'delivered' ? 1 : 0.7,
                        opacity: 1 
                      }}
                      transition={{ duration: 3, delay: index * 0.5 }}
                    />
                  </svg>

                  {/* Animated Vehicle */}
                  <motion.div
                    className={`absolute cursor-pointer ${isSelected ? 'z-30' : 'z-20'}`}
                    style={{
                      left: `${baseX + animOffset}%`,
                      top: `${baseY + animOffset}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onTrackingSelect?.(route.tracking_id)}
                    onHoverStart={() => setHoveredVehicle(route.tracking_id)}
                    onHoverEnd={() => setHoveredVehicle(null)}
                    animate={{
                      y: [0, -5, 0],
                      scale: isSelected ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      y: { duration: 3, repeat: Infinity },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                  >
                    <div className={`relative ${isSelected ? 'filter drop-shadow-lg' : ''}`}>
                      {/* Vehicle Container */}
                      <div className={`
                        w-16 h-16 rounded-2xl flex flex-col items-center justify-center
                        ${isSelected ? 'bg-blue-500 ring-4 ring-blue-300' : 'bg-white'}
                        shadow-lg border-2 border-gray-200
                      `}>
                        {/* Crop Icon */}
                        <div className="text-lg">{getCropIcon(route.product_name)}</div>
                        {/* Vehicle Icon */}
                        <div className="text-sm">{getVehicleIcon(route.vehicle.type)}</div>
                      </div>

                      {/* Farmer Avatar */}
                      <div className="absolute -top-2 -left-2">
                        <Avatar className="w-6 h-6 border-2 border-white">
                          <AvatarFallback className="text-xs bg-green-500 text-white">
                            {route.farmer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Status Indicator */}
                      <div className="absolute -top-1 -right-1">
                        <div 
                          className={`w-4 h-4 rounded-full border-2 border-white ${
                            route.overall_status === 'delivered' ? 'bg-green-400' :
                            route.overall_status === 'delayed' ? 'bg-red-400 animate-pulse' :
                            'bg-yellow-400 animate-pulse'
                          }`} 
                        />
                      </div>

                      {/* Live pulse animation */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-green-400"
                        animate={{ scale: [1, 1.5, 2], opacity: [1, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>

                  {/* Vehicle Info Popup */}
                  <AnimatePresence>
                    {(isHovered || isSelected) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute z-40"
                        style={{
                          left: `${baseX + animOffset + 8}%`,
                          top: `${baseY + animOffset - 10}%`,
                          transform: 'translate(-50%, -100%)',
                        }}
                      >
                        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-64">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="text-2xl">{getCropIcon(route.product_name)}</div>
                            <div>
                              <h3 className="font-semibold text-sm">{route.product_name}</h3>
                              <p className="text-xs text-gray-600">{route.quantity}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-green-600" />
                              <span className="font-medium">{route.farmer.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm">{getVehicleIcon(route.vehicle.type)}</div>
                              <span>{route.vehicle.number}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-blue-600" />
                              <span>{route.current_location.place_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>ETA: {formatETA(route.estimated_delivery)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-2 border-t">
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ 
                                backgroundColor: `${statusColor}20`,
                                borderColor: statusColor,
                                color: statusColor 
                              }}
                            >
                              {getStatusLabel(route.overall_status)}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Warehouse Hubs */}
            {Array.from(new Set(trackingData.map(r => r.warehouse.taluk))).map((taluk, index) => {
              const warehouse = trackingData.find(r => r.warehouse.taluk === taluk)?.warehouse;
              if (!warehouse) return null;

              // Mock coordinates for warehouses
              const coords = {
                'Madurai': { x: 30, y: 40 },
                'Tirunelveli': { x: 20, y: 70 },
                'Thanjavur': { x: 60, y: 35 },
              }[taluk] || { x: 50, y: 50 };

              return (
                <motion.div
                  key={taluk}
                  className="absolute z-10"
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.5 }}
                >
                  <div className="relative">
                    {/* Warehouse Building */}
                    <div className="w-14 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg shadow-lg border-2 border-blue-300 flex items-center justify-center">
                      <Warehouse className="w-6 h-6 text-white" />
                    </div>

                    {/* Warehouse Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-lg border-2 border-blue-400 opacity-50"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Warehouse Label */}
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-blue-900/90 text-white rounded px-2 py-1 text-xs whitespace-nowrap">
                      🏬 {warehouse.name}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Status Legend */}
          <div className="absolute bottom-4 left-4 bg-black/80 rounded-lg p-3 text-white text-xs max-w-48">
            <div className="mb-2 font-medium">📍 Live Status</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Delivered ✅</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span>Out for Delivery 📦</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                <span>On the Way 🚚</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span>Stored 🏬</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span>Delayed ⚠️</span>
              </div>
            </div>
          </div>

          {/* Live Updates Indicator */}
          <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500 rounded-lg p-2 text-green-400 text-xs">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live Updates</span>
            </div>
            <div>Last updated: {new Date().toLocaleTimeString('en-IN')}</div>
          </div>

          {/* Farmer-friendly Message */}
          {viewMode === 'farmer' && trackingData.length > 0 && (
            <div className="absolute bottom-4 right-4 bg-white/90 border border-green-200 rounded-lg p-3 text-sm max-w-64">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-lg">{getCropIcon(trackingData[0].product_name)}</div>
                <span className="font-medium text-green-800">Your {trackingData[0].product_name.split(' ')[1] || trackingData[0].product_name}</span>
              </div>
              <div className="text-green-700">
                {trackingData[0].overall_status === 'in_transit_to_warehouse' 
                  ? `is on the way to ${trackingData[0].warehouse.name}. ETA: ${formatETA(trackingData[0].estimated_delivery)}`
                  : getStatusLabel(trackingData[0].overall_status)
                }
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}