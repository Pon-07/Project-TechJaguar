import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  MapPin, 
  Factory, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Users,
  Target,
  Zap,
  Brain,
  Activity
} from 'lucide-react';
import { indiaWarehousesData, DEMAND_PREDICTIONS, CROP_IMAGES } from '../../data/indiaWideWarehouseData';

interface StatePrediction {
  state: string;
  districts: string[];
  majorCrop: string;
  cropImage: string;
  demandTrend: 'up' | 'down' | 'stable';
  demandPercentage: number;
  totalWarehouses: number;
  totalCapacity: number;
  currentStock: number;
  stockPercentage: number;
  stockStatus: 'High' | 'Medium' | 'Low';
  avgEfficiency: number;
  predictions: {
    nextWeek: number;
    nextMonth: number;
    nextQuarter: number;
  };
  alerts: string[];
}

interface WarehouseAnalytics {
  state: string;
  district: string;
  warehouseName: string;
  capacity: number;
  currentStock: number;
  efficiency: number;
  demand: number;
  status: 'High' | 'Medium' | 'Low';
  majorProducts: string[];
}

// Generate comprehensive analytics data
function generateIndiaPredictiveData(): {
  statePredictions: StatePrediction[];
  warehouseAnalytics: WarehouseAnalytics[];
  nationalStats: any;
} {
  const statePredictions: StatePrediction[] = [];
  const warehouseAnalytics: WarehouseAnalytics[] = [];
  
  // Process each state
  Object.entries(indiaWarehousesData.warehouses.reduce((acc, warehouse) => {
    if (!acc[warehouse.state]) {
      acc[warehouse.state] = [];
    }
    acc[warehouse.state].push(warehouse);
    return acc;
  }, {} as { [key: string]: typeof indiaWarehousesData.warehouses })).forEach(([state, warehouses]) => {
    
    const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity_tonnes, 0);
    const totalStock = warehouses.reduce((sum, w) => sum + w.current_occupancy_tonnes, 0);
    const avgEfficiency = warehouses.reduce((sum, w) => sum + w.analytics.efficiency_rating, 0) / warehouses.length;
    const stockPercentage = (totalStock / totalCapacity) * 100;
    
    const prediction = DEMAND_PREDICTIONS[state] || { crop: 'Rice', trend: 'up', percentage: 15 };
    
    // Generate alerts based on stock levels and demand
    const alerts: string[] = [];
    if (stockPercentage > 90) {
      alerts.push(`⚠️ High stock levels - consider distribution acceleration`);
    }
    if (stockPercentage < 30) {
      alerts.push(`🔴 Low stock alert - immediate restocking required`);
    }
    if (prediction.percentage > 25) {
      alerts.push(`📈 High demand surge predicted - prepare for increased orders`);
    }
    
    statePredictions.push({
      state,
      districts: [...new Set(warehouses.map(w => w.district))],
      majorCrop: prediction.crop,
      cropImage: CROP_IMAGES[prediction.crop as keyof typeof CROP_IMAGES] || '🌾',
      demandTrend: prediction.trend as 'up' | 'down' | 'stable',
      demandPercentage: prediction.percentage,
      totalWarehouses: warehouses.length,
      totalCapacity,
      currentStock: totalStock,
      stockPercentage: Math.round(stockPercentage),
      stockStatus: stockPercentage > 80 ? 'High' : stockPercentage > 50 ? 'Medium' : 'Low',
      avgEfficiency: Math.round(avgEfficiency * 10) / 10,
      predictions: {
        nextWeek: Math.round(totalStock * (1 + (prediction.percentage / 100) * 0.1)),
        nextMonth: Math.round(totalStock * (1 + (prediction.percentage / 100) * 0.3)),
        nextQuarter: Math.round(totalStock * (1 + (prediction.percentage / 100) * 0.8))
      },
      alerts
    });
    
    // Generate warehouse analytics for each warehouse
    warehouses.forEach(warehouse => {
      warehouseAnalytics.push({
        state: warehouse.state,
        district: warehouse.district,
        warehouseName: warehouse.name,
        capacity: warehouse.capacity_tonnes,
        currentStock: warehouse.current_occupancy_tonnes,
        efficiency: warehouse.analytics.efficiency_rating,
        demand: prediction.percentage,
        status: warehouse.analytics.stock_status,
        majorProducts: warehouse.inventory.slice(0, 3).map(item => item.name)
      });
    });
  });
  
  // Sort predictions by demand percentage
  statePredictions.sort((a, b) => b.demandPercentage - a.demandPercentage);
  
  const nationalStats = {
    totalStates: statePredictions.length,
    totalWarehouses: statePredictions.reduce((sum, p) => sum + p.totalWarehouses, 0),
    totalCapacity: statePredictions.reduce((sum, p) => sum + p.totalCapacity, 0),
    totalStock: statePredictions.reduce((sum, p) => sum + p.currentStock, 0),
    avgDemandIncrease: Math.round(statePredictions.reduce((sum, p) => sum + p.demandPercentage, 0) / statePredictions.length),
    highDemandStates: statePredictions.filter(p => p.demandPercentage > 25).length,
    lowStockStates: statePredictions.filter(p => p.stockStatus === 'Low').length,
    totalAlerts: statePredictions.reduce((sum, p) => sum + p.alerts.length, 0)
  };
  
  return { statePredictions, warehouseAnalytics, nationalStats };
}

export function IndiaPredictiveAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<ReturnType<typeof generateIndiaPredictiveData> | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'states' | 'warehouses' | 'alerts'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      const data = generateIndiaPredictiveData();
      setAnalyticsData(data);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <motion.div
                className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h2 className="text-2xl font-bold mb-2">Loading India-Wide Analytics</h2>
              <p className="text-blue-100">Processing data from {indiaWarehousesData.totalStats.totalStates} states and {indiaWarehousesData.totalStats.totalWarehouses} warehouses...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analyticsData) return null;

  const { statePredictions, warehouseAnalytics, nationalStats } = analyticsData;

  const getDemandColor = (trend: string, percentage: number) => {
    if (trend === 'up' && percentage > 25) return 'text-green-600 bg-green-50';
    if (trend === 'up' && percentage > 15) return 'text-blue-600 bg-blue-50';
    if (trend === 'down') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'High': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'Low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with National Stats */}
      <Card className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Brain className="w-8 h-8" />
            India Predictive Analytics - AI Powered Insights
          </CardTitle>
          <p className="text-indigo-100">
            Real-time demand forecasting and stock optimization across all Indian states
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{nationalStats.totalStates}</div>
              <div className="text-sm text-indigo-100">States Covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{nationalStats.totalWarehouses}</div>
              <div className="text-sm text-indigo-100">Warehouses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">+{nationalStats.avgDemandIncrease}%</div>
              <div className="text-sm text-indigo-100">Avg Demand Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{nationalStats.totalAlerts}</div>
              <div className="text-sm text-indigo-100">Active Alerts</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* View Mode Selector */}
      <div className="flex gap-4">
        {[
          { key: 'overview', label: 'National Overview', icon: Activity },
          { key: 'states', label: 'State Predictions', icon: MapPin },
          { key: 'warehouses', label: 'Warehouse Analytics', icon: Factory },
          { key: 'alerts', label: 'Smart Alerts', icon: AlertTriangle }
        ].map((mode) => (
          <Button
            key={mode.key}
            variant={viewMode === mode.key ? "default" : "outline"}
            onClick={() => setViewMode(mode.key as any)}
            className="flex items-center gap-2"
          >
            <mode.icon className="w-4 h-4" />
            {mode.label}
          </Button>
        ))}
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <div className="space-y-6">
          {/* Top Performing States */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Top 6 High-Demand States
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statePredictions.slice(0, 6).map((state, index) => (
                  <motion.div
                    key={state.state}
                    className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedState(state.state)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{state.cropImage}</div>
                      <div>
                        <h3 className="font-semibold">{state.state}</h3>
                        <p className="text-sm text-muted-foreground">{state.majorCrop}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Demand Growth</span>
                        <Badge className={getDemandColor(state.demandTrend, state.demandPercentage)}>
                          +{state.demandPercentage}%
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Stock Status</span>
                        <Badge className={getStockColor(state.stockStatus)}>
                          {state.stockStatus}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Efficiency</span>
                        <span className="text-sm font-semibold">{state.avgEfficiency}/10</span>
                      </div>
                      
                      <Progress value={state.stockPercentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {state.stockPercentage}% capacity • {state.totalWarehouses} warehouses
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* National Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Demand Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Growth States</span>
                    <Badge className="bg-green-50 text-green-600">
                      {nationalStats.highDemandStates}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Growth</span>
                    <span className="font-semibold text-green-600">+{nationalStats.avgDemandIncrease}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Predicted increase in crop demand over next quarter
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-600" />
                  Stock Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Capacity</span>
                    <span className="font-semibold">{(nationalStats.totalCapacity / 1000000).toFixed(1)}M tonnes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Stock</span>
                    <span className="font-semibold">{(nationalStats.totalStock / 1000000).toFixed(1)}M tonnes</span>
                  </div>
                  <Progress value={(nationalStats.totalStock / nationalStats.totalCapacity) * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {Math.round((nationalStats.totalStock / nationalStats.totalCapacity) * 100)}% national capacity utilization
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Alert Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Alerts</span>
                    <Badge className="bg-red-50 text-red-600">
                      {nationalStats.totalAlerts}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low Stock States</span>
                    <span className="font-semibold text-red-600">{nationalStats.lowStockStates}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Immediate attention required for stock replenishment
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* State Predictions Mode */}
      {viewMode === 'states' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {statePredictions.map((state) => (
              <motion.div
                key={state.state}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="cursor-pointer"
                onClick={() => setSelectedState(selectedState === state.state ? null : state.state)}
              >
                <Card className={`transition-all ${selectedState === state.state ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{state.cropImage}</div>
                        <div>
                          <h3 className="text-lg">{state.state}</h3>
                          <p className="text-sm text-muted-foreground">{state.districts.length} districts</p>
                        </div>
                      </div>
                      <Badge className={getDemandColor(state.demandTrend, state.demandPercentage)}>
                        {state.majorCrop} +{state.demandPercentage}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="font-semibold">{state.totalWarehouses}</div>
                        <div className="text-xs text-muted-foreground">Warehouses</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{state.stockPercentage}%</div>
                        <div className="text-xs text-muted-foreground">Stock Level</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{state.avgEfficiency}</div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                      </div>
                    </div>
                    
                    <Progress value={state.stockPercentage} className="h-2 mb-3" />
                    
                    {selectedState === state.state && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="border-t pt-3 space-y-2"
                      >
                        <div className="text-sm">
                          <strong>Districts:</strong> {state.districts.join(', ')}
                        </div>
                        <div className="text-sm">
                          <strong>Predictions:</strong>
                          <div className="grid grid-cols-3 gap-2 mt-1 text-xs">
                            <div>Next Week: {(state.predictions.nextWeek / 1000).toFixed(1)}k tonnes</div>
                            <div>Next Month: {(state.predictions.nextMonth / 1000).toFixed(1)}k tonnes</div>
                            <div>Next Quarter: {(state.predictions.nextQuarter / 1000).toFixed(1)}k tonnes</div>
                          </div>
                        </div>
                        {state.alerts.length > 0 && (
                          <div className="bg-amber-50 p-2 rounded text-xs">
                            {state.alerts.map((alert, index) => (
                              <div key={index}>{alert}</div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Warehouse Analytics Mode */}
      {viewMode === 'warehouses' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="w-5 h-5 text-blue-600" />
              Warehouse Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">State</th>
                    <th className="text-left p-2">District</th>
                    <th className="text-left p-2">Warehouse</th>
                    <th className="text-right p-2">Capacity</th>
                    <th className="text-right p-2">Stock</th>
                    <th className="text-right p-2">Efficiency</th>
                    <th className="text-right p-2">Demand</th>
                    <th className="text-center p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouseAnalytics.slice(0, 20).map((warehouse, index) => (
                    <motion.tr
                      key={`${warehouse.state}-${warehouse.district}`}
                      className="border-b hover:bg-gray-50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="p-2 font-medium">{warehouse.state}</td>
                      <td className="p-2">{warehouse.district}</td>
                      <td className="p-2 text-blue-600">{warehouse.warehouseName}</td>
                      <td className="p-2 text-right">{(warehouse.capacity / 1000).toFixed(1)}k</td>
                      <td className="p-2 text-right">{(warehouse.currentStock / 1000).toFixed(1)}k</td>
                      <td className="p-2 text-right">{warehouse.efficiency}/10</td>
                      <td className="p-2 text-right text-green-600">+{warehouse.demand}%</td>
                      <td className="p-2 text-center">
                        <Badge className={getStockColor(warehouse.status)}>
                          {warehouse.status}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts Mode */}
      {viewMode === 'alerts' && (
        <div className="space-y-4">
          {statePredictions.filter(state => state.alerts.length > 0).map((state) => (
            <Card key={state.state}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="text-2xl">{state.cropImage}</div>
                  <div>
                    <h3>{state.state} - Smart Alerts</h3>
                    <p className="text-sm text-muted-foreground">{state.alerts.length} active alerts</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {state.alerts.map((alert, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span className="text-sm">{alert}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}