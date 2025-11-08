import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Navigation, 
  MapPin, 
  Truck, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Leaf,
  Route,
  Play,
  Pause
} from 'lucide-react';
import { odishaWarehousesData } from '../../data/odishaWarehouses';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';

interface RoutePoint {
  id: string;
  type: 'farm' | 'warehouse' | 'customer';
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  timestamp: string;
  status: 'completed' | 'in-progress' | 'pending';
  details: {
    product?: string;
    quantity?: number;
    farmer?: string;
    blockchain_hash?: string;
  };
}

interface ProductRoute {
  route_id: string;
  product_name: string;
  total_quantity_kg: number;
  current_location: string;
  progress_percentage: number;
  estimated_delivery: string;
  blockchain_hash: string;
  route_points: RoutePoint[];
  is_live: boolean;
}

// Generate dummy route data based on Odisha warehouses
const generateOdishaRoutes = (): ProductRoute[] => {
  const routes: ProductRoute[] = [];
  
  odishaWarehousesData.warehouses.slice(0, 15).forEach((warehouse, index) => {
    warehouse.inventory.forEach((item, itemIndex) => {
      const routeId = `RT-${warehouse.warehouse_id}-${item.item_id}`;
      const progress = 25 + (index * 15) % 75; // Varying progress
      
      const route: ProductRoute = {
        route_id: routeId,
        product_name: `${item.name} (${item.variety})`,
        total_quantity_kg: Math.floor(item.total_quantity_kg / 10), // Scaled down for demo
        current_location: progress > 60 ? 'En route to Customer' : 'At Warehouse',
        progress_percentage: progress,
        estimated_delivery: new Date(Date.now() + (24 * 60 * 60 * 1000) * (2 - progress/50)).toISOString(),
        blockchain_hash: item.blockchain_contract_id,
        is_live: Math.random() > 0.3,
        route_points: [
          {
            id: `${routeId}-farm`,
            type: 'farm',
            name: `${warehouse.manager.name}'s Farm`,
            location: `${warehouse.taluk} Village, ${warehouse.district}`,
            coordinates: { lat: 20.5 + Math.random(), lng: 85.8 + Math.random() },
            timestamp: new Date(Date.now() - (48 * 60 * 60 * 1000)).toISOString(),
            status: 'completed',
            details: {
              product: item.name,
              quantity: Math.floor(item.total_quantity_kg / 10),
              farmer: warehouse.manager.name,
              blockchain_hash: item.blockchain_contract_id
            }
          },
          {
            id: `${routeId}-warehouse`,
            type: 'warehouse',
            name: warehouse.warehouse_id,
            location: `${warehouse.address}, ${warehouse.district}`,
            coordinates: { lat: 20.3 + Math.random(), lng: 85.9 + Math.random() },
            timestamp: new Date(Date.now() - (24 * 60 * 60 * 1000)).toISOString(),
            status: progress > 40 ? 'completed' : 'in-progress',
            details: {
              product: item.name,
              quantity: Math.floor(item.total_quantity_kg / 10),
              blockchain_hash: item.blockchain_contract_id
            }
          },
          {
            id: `${routeId}-customer`,
            type: 'customer',
            name: 'Customer Location',
            location: `Bhubaneswar, Khordha District`,
            coordinates: { lat: 20.2961, lng: 85.8245 },
            timestamp: new Date(Date.now() + (12 * 60 * 60 * 1000)).toISOString(),
            status: progress > 90 ? 'completed' : progress > 60 ? 'in-progress' : 'pending',
            details: {
              product: item.name,
              quantity: Math.floor(item.total_quantity_kg / 10),
              blockchain_hash: item.blockchain_contract_id
            }
          }
        ]
      };
      
      routes.push(route);
    });
  });
  
  return routes;
};

export function OdishaRouteTracker() {
  const [routes, setRoutes] = useState<ProductRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<ProductRoute | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [filterDistrict, setFilterDistrict] = useState('all');
  const { t } = useLanguage();

  useEffect(() => {
    setRoutes(generateOdishaRoutes());
  }, []);

  // Auto-update route progress for demo
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setRoutes(prev => prev.map(route => ({
        ...route,
        progress_percentage: Math.min(100, route.progress_percentage + Math.random() * 2),
        current_location: route.progress_percentage > 60 
          ? 'En route to Customer' 
          : route.progress_percentage > 30 
            ? 'Processing at Warehouse' 
            : 'At Farm'
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const districts = [...new Set(odishaWarehousesData.warehouses.map(w => w.district))];
  
  const filteredRoutes = filterDistrict === 'all' 
    ? routes 
    : routes.filter(route => 
        route.route_points.some(point => point.location.includes(filterDistrict))
      );

  const liveRoutes = filteredRoutes.filter(r => r.is_live);
  const completedToday = filteredRoutes.filter(r => r.progress_percentage === 100).length;
  const inTransit = filteredRoutes.filter(r => r.progress_percentage > 30 && r.progress_percentage < 100).length;

  const handleRouteClick = (route: ProductRoute) => {
    setSelectedRoute(route);
    toast.success(`Viewing route for ${route.product_name}`);
  };

  const handleRoutePointClick = (route: ProductRoute, point: RoutePoint) => {
    toast.info(`${point.name}: ${point.details.product} - ${point.details.quantity}kg`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5 text-blue-600" />
            Odisha Route Tracker - Amazon Style
            <Badge variant="outline" className="ml-auto">
              {liveRoutes.length} Live Routes
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Real-time tracking of products from farms across Odisha to consumers
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select 
                className="border rounded px-3 py-1"
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
              >
                <option value="all">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Simulation
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume Simulation
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Completed Today: {completedToday}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span>In Transit: {inTransit}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span>Total Routes: {filteredRoutes.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Map Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Routes List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredRoutes.map((route, index) => (
                  <motion.div
                    key={route.route_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedRoute?.route_id === route.route_id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleRouteClick(route)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium truncate">{route.product_name}</h3>
                          {route.is_live && (
                            <Badge className="bg-red-500 text-white animate-pulse">
                              LIVE
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-3">
                          <p>Quantity: {route.total_quantity_kg}kg</p>
                          <p>Status: {route.current_location}</p>
                          <p>ETA: {new Date(route.estimated_delivery).toLocaleDateString('en-IN')}</p>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{route.progress_percentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={route.progress_percentage} className="h-2" />
                        </div>
                        
                        {/* Route Points Preview */}
                        <div className="flex items-center gap-2">
                          {route.route_points.map((point, pointIndex) => (
                            <div
                              key={point.id}
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRoutePointClick(route, point);
                              }}
                            >
                              <div className={`w-3 h-3 rounded-full ${
                                point.status === 'completed' 
                                  ? 'bg-green-500' 
                                  : point.status === 'in-progress' 
                                    ? 'bg-blue-500 animate-pulse' 
                                    : 'bg-gray-300'
                              }`} />
                              {pointIndex < route.route_points.length - 1 && (
                                <div className="w-4 h-0.5 bg-gray-300" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-xs text-muted-foreground mb-2">
                          Blockchain
                        </div>
                        <div className="font-mono text-xs bg-purple-50 px-2 py-1 rounded">
                          {route.blockchain_hash.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Route Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Route Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRoute ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">{selectedRoute.product_name}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Route ID: {selectedRoute.route_id}</p>
                      <p>Quantity: {selectedRoute.total_quantity_kg}kg</p>
                      <p>Progress: {selectedRoute.progress_percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Journey Timeline</h4>
                    {selectedRoute.route_points.map((point, index) => (
                      <div key={point.id} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            point.status === 'completed' 
                              ? 'bg-green-500' 
                              : point.status === 'in-progress' 
                                ? 'bg-blue-500 animate-pulse' 
                                : 'bg-gray-300'
                          }`}>
                            {point.status === 'completed' && (
                              <CheckCircle className="w-2 h-2 text-white" />
                            )}
                            {point.status === 'in-progress' && (
                              <Clock className="w-2 h-2 text-white animate-spin" />
                            )}
                          </div>
                          {index < selectedRoute.route_points.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-300 mt-1" />
                          )}
                        </div>
                        
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            {point.type === 'farm' && <Leaf className="w-4 h-4 text-green-600" />}
                            {point.type === 'warehouse' && <Package className="w-4 h-4 text-blue-600" />}
                            {point.type === 'customer' && <MapPin className="w-4 h-4 text-purple-600" />}
                            <span className="font-medium text-sm">{point.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{point.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(point.timestamp).toLocaleString('en-IN')}
                          </p>
                          {point.details.blockchain_hash && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                <Zap className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 mb-1">Environmental Impact</h4>
                    <p className="text-sm text-green-600">
                      Direct farm-to-consumer delivery saves ~{(selectedRoute.total_quantity_kg * 0.12).toFixed(1)} kg CO₂
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Route className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-muted-foreground mb-2">Select a Route</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on any route to view detailed tracking information
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}