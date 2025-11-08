import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  MapPin, 
  Truck, 
  Package, 
  Factory, 
  User, 
  QrCode, 
  Shield, 
  Eye,
  Navigation,
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react';
import { indiaWarehousesData } from '../../data/indiaWideWarehouseData';
import { getCropDisplay } from '../../data/cropImages';

interface TrackingRoute {
  id: string;
  productName: string;
  cropImage: string;
  farmer: {
    name: string;
    state: string;
    district: string;
    pin: string;
  };
  warehouse: {
    name: string;
    state: string;
    district: string;
    id: string;
  };
  customer?: {
    name: string;
    location: string;
  };
  blockchainTx: string;
  qrImage: string;
  status: 'farm_to_warehouse' | 'warehouse_processing' | 'warehouse_to_customer' | 'delivered';
  coordinates: {
    farm: { lat: number; lng: number };
    warehouse: { lat: number; lng: number };
    customer?: { lat: number; lng: number };
  };
  estimatedDelivery: string;
  actualProgress: number; // 0-100
}

// Generate dummy tracking routes from warehouse data
function generateTrackingRoutes(): TrackingRoute[] {
  const routes: TrackingRoute[] = [];
  const statuses: TrackingRoute['status'][] = ['farm_to_warehouse', 'warehouse_processing', 'warehouse_to_customer', 'delivered'];
  
  // Take first 20 warehouses for demo
  indiaWarehousesData.warehouses.slice(0, 20).forEach((warehouse, index) => {
    const inventory = warehouse.inventory[0]; // Take first inventory item
    if (!inventory) return;

    const route: TrackingRoute = {
      id: `TRACK-${warehouse.state.substring(0,2).toUpperCase()}${warehouse.district.substring(0,2).toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
      productName: inventory.name,
      cropImage: getCropDisplay(inventory.name).emoji,
      farmer: {
        name: inventory.origin_farmer.name,
        state: warehouse.state,
        district: warehouse.district,
        pin: inventory.origin_farmer.pin
      },
      warehouse: {
        name: warehouse.name,
        state: warehouse.state,
        district: warehouse.district,
        id: warehouse.warehouse_id
      },
      customer: Math.random() > 0.5 ? {
        name: ['Amit Sharma', 'Priya Gupta', 'Ravi Kumar', 'Sunita Patel'][Math.floor(Math.random() * 4)],
        location: `${warehouse.district}, ${warehouse.state}`
      } : undefined,
      blockchainTx: inventory.blockchain_tx,
      qrImage: inventory.qr_image || `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0Ij5RUi0ke2ludmVudG9yeS5uYW1lfTwvdGV4dD4KPC9zdmc+`,
      status: statuses[index % 4],
      coordinates: {
        farm: {
          lat: warehouse.location.latitude + (Math.random() - 0.5) * 0.5,
          lng: warehouse.location.longitude + (Math.random() - 0.5) * 0.5
        },
        warehouse: warehouse.location,
        customer: Math.random() > 0.5 ? {
          lat: warehouse.location.latitude + (Math.random() - 0.5) * 0.3,
          lng: warehouse.location.longitude + (Math.random() - 0.5) * 0.3
        } : undefined
      },
      estimatedDelivery: new Date(Date.now() + Math.floor(Math.random() * 7 + 1) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      actualProgress: Math.floor(Math.random() * 100)
    };

    routes.push(route);
  });

  return routes;
}

export function India3DLiveTracking() {
  const [trackingRoutes, setTrackingRoutes] = useState<TrackingRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<TrackingRoute | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<TrackingRoute | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupRoute, setPopupRoute] = useState<TrackingRoute | null>(null);
  const [animatingRoutes, setAnimatingRoutes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const routes = generateTrackingRoutes();
    setTrackingRoutes(routes);

    // Animate route progress
    const interval = setInterval(() => {
      setTrackingRoutes(prev => prev.map(route => ({
        ...route,
        actualProgress: Math.min(100, route.actualProgress + Math.random() * 5)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: TrackingRoute['status']) => {
    switch (status) {
      case 'farm_to_warehouse': return 'text-blue-600 bg-blue-50';
      case 'warehouse_processing': return 'text-amber-600 bg-amber-50';
      case 'warehouse_to_customer': return 'text-purple-600 bg-purple-50';
      case 'delivered': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: TrackingRoute['status']) => {
    switch (status) {
      case 'farm_to_warehouse': return 'Farm → Warehouse';
      case 'warehouse_processing': return 'Processing';
      case 'warehouse_to_customer': return 'Warehouse → Customer';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

  const handleMarkerClick = (route: TrackingRoute) => {
    setPopupRoute(route);
    setShowPopup(true);
    setAnimatingRoutes(prev => new Set([...prev, route.id]));
    
    // Remove animation after 2 seconds
    setTimeout(() => {
      setAnimatingRoutes(prev => {
        const newSet = new Set(prev);
        newSet.delete(route.id);
        return newSet;
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Navigation className="w-8 h-8" />
            India-Wide 3D Live Tracking System
          </CardTitle>
          <p className="text-indigo-100">
            Real-time visualization of farm → warehouse → customer movement across all Indian states
          </p>
          <div className="flex items-center gap-4 mt-3">
            <Badge variant="secondary" className="bg-white/20 text-white">
              <MapPin className="w-3 h-3 mr-1" />
              {indiaWarehousesData.totalStats.totalStates} States
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Factory className="w-3 h-3 mr-1" />
              {indiaWarehousesData.totalStats.totalWarehouses} Warehouses
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Package className="w-3 h-3 mr-1" />
              {trackingRoutes.length} Active Routes
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Map Visualization */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Interactive 3D Route Map
              </CardTitle>
              <p className="text-muted-foreground">
                Click on any glowing marker to view detailed tracking information
              </p>
            </CardHeader>
            <CardContent>
              {/* 3D Map Container */}
              <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border-2 border-dashed border-indigo-200">
                {/* India Map Background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl opacity-10">🗺️</div>
                </div>
                
                {/* Animated Route Markers */}
                <div className="absolute inset-0">
                  {trackingRoutes.map((route, index) => {
                    const isAnimating = animatingRoutes.has(route.id);
                    const positionX = (index % 5) * 20 + 10;
                    const positionY = Math.floor(index / 5) * 25 + 15;
                    
                    return (
                      <div key={route.id} className="absolute">
                        {/* Route Line */}
                        <motion.div
                          className={`absolute w-20 h-0.5 ${getStatusColor(route.status)} opacity-30`}
                          style={{
                            left: `${positionX}%`,
                            top: `${positionY}%`,
                            transform: 'rotate(45deg)'
                          }}
                          animate={{
                            opacity: [0.3, 0.8, 0.3],
                            scaleX: [1, 1.2, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Farm Marker */}
                        <motion.div
                          className={`absolute w-6 h-6 rounded-full bg-green-500 flex items-center justify-center cursor-pointer shadow-lg ${isAnimating ? 'ring-4 ring-green-300' : ''}`}
                          style={{
                            left: `${positionX}%`,
                            top: `${positionY}%`
                          }}
                          whileHover={{ scale: 1.3 }}
                          animate={isAnimating ? {
                            scale: [1, 1.5, 1],
                            boxShadow: [
                              "0 0 0 0 rgba(34, 197, 94, 0.7)",
                              "0 0 0 10px rgba(34, 197, 94, 0)",
                              "0 0 0 0 rgba(34, 197, 94, 0)"
                            ]
                          } : {}}
                          transition={{ duration: 2, repeat: isAnimating ? 3 : 0 }}
                          onClick={() => handleMarkerClick(route)}
                        >
                          <User className="w-3 h-3 text-white" />
                        </motion.div>
                        
                        {/* Warehouse Marker */}
                        <motion.div
                          className={`absolute w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center cursor-pointer shadow-lg ${isAnimating ? 'ring-4 ring-blue-300' : ''}`}
                          style={{
                            left: `${positionX + 15}%`,
                            top: `${positionY - 5}%`
                          }}
                          whileHover={{ scale: 1.3 }}
                          animate={isAnimating ? {
                            scale: [1, 1.5, 1],
                            boxShadow: [
                              "0 0 0 0 rgba(59, 130, 246, 0.7)",
                              "0 0 0 10px rgba(59, 130, 246, 0)",
                              "0 0 0 0 rgba(59, 130, 246, 0)"
                            ]
                          } : {}}
                          transition={{ duration: 2, repeat: isAnimating ? 3 : 0 }}
                          onClick={() => handleMarkerClick(route)}
                        >
                          <Factory className="w-4 h-4 text-white" />
                        </motion.div>
                        
                        {/* Customer Marker (if exists) */}
                        {route.customer && (
                          <motion.div
                            className={`absolute w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center cursor-pointer shadow-lg ${isAnimating ? 'ring-4 ring-purple-300' : ''}`}
                            style={{
                              left: `${positionX + 25}%`,
                              top: `${positionY + 5}%`
                            }}
                            whileHover={{ scale: 1.3 }}
                            animate={isAnimating ? {
                              scale: [1, 1.5, 1],
                              boxShadow: [
                                "0 0 0 0 rgba(147, 51, 234, 0.7)",
                                "0 0 0 10px rgba(147, 51, 234, 0)",
                                "0 0 0 0 rgba(147, 51, 234, 0)"
                              ]
                            } : {}}
                            transition={{ duration: 2, repeat: isAnimating ? 3 : 0 }}
                            onClick={() => handleMarkerClick(route)}
                          >
                            <Package className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                        
                        {/* Moving Truck Animation */}
                        <motion.div
                          className="absolute w-4 h-4 text-orange-500"
                          style={{
                            left: `${positionX + (route.actualProgress / 100) * 20}%`,
                            top: `${positionY - 2}%`
                          }}
                          animate={{
                            x: [0, 5, 0],
                            y: [0, -2, 0]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Truck className="w-4 h-4" />
                        </motion.div>
                        
                        {/* Route Progress Bar */}
                        <div 
                          className="absolute bg-gray-200 h-1 rounded-full"
                          style={{
                            left: `${positionX}%`,
                            top: `${positionY + 8}%`,
                            width: '20%'
                          }}
                        >
                          <motion.div
                            className={`h-full rounded-full ${route.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'}`}
                            animate={{
                              width: `${route.actualProgress}%`
                            }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <h4 className="font-semibold text-sm mb-2">Map Legend</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Farm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-500"></div>
                      <span>Warehouse</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span>Customer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-3 h-3 text-orange-500" />
                      <span>In Transit</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Route List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Active Routes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {trackingRoutes.slice(0, 10).map((route) => (
                <motion.div
                  key={route.id}
                  className="p-3 border rounded-lg cursor-pointer hover:shadow-md transition-all"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleMarkerClick(route)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{route.cropImage}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{route.productName}</span>
                        <Badge className={`text-xs ${getStatusColor(route.status)}`}>
                          {getStatusText(route.status)}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {route.farmer.district}, {route.farmer.state}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${route.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${route.actualProgress}%` }}
                          />
                        </div>
                        <span className="text-xs ml-2">{route.actualProgress}%</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Route Popup */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="text-3xl">{popupRoute?.cropImage}</div>
              Route Details - {popupRoute?.id}
            </DialogTitle>
          </DialogHeader>
          
          {popupRoute && (
            <div className="space-y-6">
              {/* Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="w-5 h-5 text-green-600" />
                      Product Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Product:</strong> {popupRoute.productName}</div>
                    <div><strong>Farmer:</strong> {popupRoute.farmer.name}</div>
                    <div><strong>Origin:</strong> {popupRoute.farmer.district}, {popupRoute.farmer.state}</div>
                    <div><strong>Uzhavar PIN:</strong> {popupRoute.farmer.pin}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Factory className="w-5 h-5 text-blue-600" />
                      Warehouse Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Warehouse:</strong> {popupRoute.warehouse.name}</div>
                    <div><strong>Location:</strong> {popupRoute.warehouse.district}, {popupRoute.warehouse.state}</div>
                    <div><strong>ID:</strong> {popupRoute.warehouse.id}</div>
                    <div><strong>Status:</strong> 
                      <Badge className={`ml-2 ${getStatusColor(popupRoute.status)}`}>
                        {getStatusText(popupRoute.status)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* QR Code and Blockchain */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-purple-600" />
                      QR Code (Dummy)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-32 h-32 mx-auto border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center bg-purple-50">
                      <img 
                        src={popupRoute.qrImage} 
                        alt="QR Code" 
                        className="w-28 h-28 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0Ij5RUi1EVU1NWTwvdGV4dD4KPC9zdmc+';
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Scan to verify product authenticity
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-600" />
                      Blockchain Transaction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <strong>Tx Hash:</strong>
                      <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                        {popupRoute.blockchainTx}
                      </div>
                    </div>
                    <div className="text-sm">
                      <strong>Estimated Delivery:</strong> {popupRoute.estimatedDelivery}
                    </div>
                    <div className="text-sm">
                      <strong>Progress:</strong>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${popupRoute.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${popupRoute.actualProgress}%` }}
                          />
                        </div>
                        <span className="text-xs">{popupRoute.actualProgress}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowPopup(false)}>
                  Close
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Timeline
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}