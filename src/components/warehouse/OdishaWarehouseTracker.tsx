import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { 
  Warehouse, 
  MapPin, 
  Package, 
  TrendingUp, 
  TrendingDown,
  QrCode,
  Phone,
  Eye,
  BarChart3,
  Truck,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Filter,
  Search
} from 'lucide-react';
import { odishaWarehousesData } from '../../data/odishaWarehouses';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';

interface WarehouseDisplayData {
  warehouse_id: string;
  taluk: string;
  district: string;
  manager_name: string;
  manager_contact: string;
  capacity_tonnes: number;
  current_occupancy_tonnes: number;
  occupancy_percentage: number;
  total_crops_stored: number;
  total_quantity_sold_kg: number;
  total_qr_generated: number;
  high_demand_prediction: string;
  route_status: string;
  last_updated: string;
  rating: number;
  inventory_summary: {
    crop: string;
    quantity_kg: number;
    value_inr: number;
  }[];
  predictive_analytics: {
    expected_demand_increase: number;
    recommended_restocking: string[];
    price_trend: 'up' | 'down' | 'stable';
  };
}

const processWarehouseData = (): WarehouseDisplayData[] => {
  return odishaWarehousesData.warehouses.map(warehouse => {
    const occupancy_percentage = (warehouse.current_occupancy_tonnes / warehouse.capacity_tonnes) * 100;
    const total_quantity_sold_kg = warehouse.inventory.reduce((sum, item) => 
      sum + Math.floor(item.total_quantity_kg * 0.3), 0); // Assume 30% sold
    const total_qr_generated = warehouse.inventory.length * Math.floor(Math.random() * 15) + 5;
    
    // High demand prediction
    const highDemandCrop = warehouse.inventory.reduce((max, item) => 
      item.total_quantity_kg > max.total_quantity_kg ? item : max
    );
    const predicted_increase = 1000 + Math.floor(Math.random() * 4000);
    
    return {
      warehouse_id: warehouse.warehouse_id,
      taluk: warehouse.taluk,
      district: warehouse.district,
      manager_name: warehouse.manager.name,
      manager_contact: warehouse.manager.contact,
      capacity_tonnes: warehouse.capacity_tonnes,
      current_occupancy_tonnes: warehouse.current_occupancy_tonnes,
      occupancy_percentage,
      total_crops_stored: warehouse.inventory.length,
      total_quantity_sold_kg,
      total_qr_generated,
      high_demand_prediction: `${highDemandCrop.name} +${predicted_increase}kg`,
      route_status: occupancy_percentage > 80 ? 'Farm → Warehouse → Customer' : 
                   occupancy_percentage > 40 ? 'Farm → Warehouse' : 'Awaiting Stock',
      last_updated: warehouse.last_updated,
      rating: warehouse.rating,
      inventory_summary: warehouse.inventory.map(item => ({
        crop: item.name,
        quantity_kg: item.total_quantity_kg,
        value_inr: item.total_quantity_kg * item.community_price_per_kg
      })),
      predictive_analytics: {
        expected_demand_increase: Math.floor(Math.random() * 40) + 10,
        recommended_restocking: warehouse.inventory
          .filter(() => Math.random() > 0.7)
          .map(item => item.name)
          .slice(0, 2),
        price_trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
      }
    };
  });
};

export function OdishaWarehouseTracker() {
  const [warehouseData, setWarehouseData] = useState<WarehouseDisplayData[]>(() => processWarehouseData());
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedTaluk, setSelectedTaluk] = useState('all');
  const [cropFilter, setCropFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('occupancy');
  const { t } = useLanguage();

  // Extract unique values for filters
  const districts = [...new Set(warehouseData.map(w => w.district))].sort();
  const taluks = selectedDistrict === 'all' 
    ? [...new Set(warehouseData.map(w => w.taluk))].sort()
    : [...new Set(warehouseData.filter(w => w.district === selectedDistrict).map(w => w.taluk))].sort();
  const crops = [...new Set(warehouseData.flatMap(w => w.inventory_summary.map(i => i.crop)))].sort();

  // Filter and sort warehouses
  const filteredWarehouses = useMemo(() => {
    let filtered = warehouseData.filter(warehouse => {
      const districtMatch = selectedDistrict === 'all' || warehouse.district === selectedDistrict;
      const talukMatch = selectedTaluk === 'all' || warehouse.taluk === selectedTaluk;
      const cropMatch = cropFilter === 'all' || warehouse.inventory_summary.some(item => item.crop === cropFilter);
      const searchMatch = !searchQuery || 
        warehouse.warehouse_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.taluk.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.manager_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return districtMatch && talukMatch && cropMatch && searchMatch;
    });

    // Sort warehouses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'occupancy':
          return b.occupancy_percentage - a.occupancy_percentage;
        case 'capacity':
          return b.capacity_tonnes - a.capacity_tonnes;
        case 'rating':
          return b.rating - a.rating;
        case 'district':
          return a.district.localeCompare(b.district);
        case 'updated':
          return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime();
        default:
          return a.warehouse_id.localeCompare(b.warehouse_id);
      }
    });

    return filtered;
  }, [warehouseData, selectedDistrict, selectedTaluk, cropFilter, searchQuery, sortBy]);

  // Summary statistics
  const totalWarehouses = filteredWarehouses.length;
  const totalCapacity = filteredWarehouses.reduce((sum, w) => sum + w.capacity_tonnes, 0);
  const totalOccupancy = filteredWarehouses.reduce((sum, w) => sum + w.current_occupancy_tonnes, 0);
  const averageOccupancy = totalWarehouses > 0 ? (totalOccupancy / totalCapacity) * 100 : 0;
  const highOccupancyCount = filteredWarehouses.filter(w => w.occupancy_percentage > 80).length;
  const lowStockCount = filteredWarehouses.filter(w => w.occupancy_percentage < 20).length;

  const handleGenerateQR = (warehouseId: string, crop: string) => {
    const qrCode = `QR-${warehouseId}-${crop.replace(/\s+/g, '_')}-${Date.now()}`;
    toast.success(`QR Code generated: ${qrCode}`);
  };

  const handleViewQRHistory = (warehouseId: string) => {
    toast.info(`Viewing QR history for ${warehouseId}`);
  };

  const handleMarkSold = (warehouseId: string, crop: string) => {
    setWarehouseData(prev => prev.map(w => {
      if (w.warehouse_id === warehouseId) {
        return {
          ...w,
          total_quantity_sold_kg: w.total_quantity_sold_kg + Math.floor(Math.random() * 1000) + 500
        };
      }
      return w;
    }));
    toast.success(`${crop} marked as sold from ${warehouseId}`);
  };

  const handleUpdateQuantity = (warehouseId: string, crop: string) => {
    const newQuantity = Math.floor(Math.random() * 5000) + 1000;
    toast.success(`${crop} quantity updated to ${newQuantity}kg at ${warehouseId}`);
  };

  const getRouteStatusColor = (status: string) => {
    if (status.includes('Customer')) return 'text-green-600 bg-green-100';
    if (status.includes('Warehouse')) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getPriceTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <BarChart3 className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-blue-600" />
            Odisha District Warehouse Tracking
            <Badge variant="outline" className="ml-auto">
              {totalWarehouses} warehouses
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Real-time tracking across all {districts.length} districts with predictive analytics
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalWarehouses}</div>
              <div className="text-sm text-muted-foreground">Total Warehouses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{averageOccupancy.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Avg Occupancy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{highOccupancyCount}</div>
              <div className="text-sm text-muted-foreground">High Occupancy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
              <div className="text-sm text-muted-foreground">Low Stock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{totalCapacity.toLocaleString()}T</div>
              <div className="text-sm text-muted-foreground">Total Capacity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search warehouses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select 
              className="border rounded px-3 py-2"
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedTaluk('all'); // Reset taluk when district changes
              }}
            >
              <option value="all">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            
            <select 
              className="border rounded px-3 py-2"
              value={selectedTaluk}
              onChange={(e) => setSelectedTaluk(e.target.value)}
            >
              <option value="all">All Taluks</option>
              {taluks.map(taluk => (
                <option key={taluk} value={taluk}>{taluk}</option>
              ))}
            </select>
            
            <select 
              className="border rounded px-3 py-2"
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
            >
              <option value="all">All Crops</option>
              {crops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
            
            <select 
              className="border rounded px-3 py-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="occupancy">Sort by Occupancy</option>
              <option value="capacity">Sort by Capacity</option>
              <option value="rating">Sort by Rating</option>
              <option value="district">Sort by District</option>
              <option value="updated">Sort by Updated</option>
            </select>
            
            <Button variant="outline" onClick={() => {
              setSelectedDistrict('all');
              setSelectedTaluk('all');
              setCropFilter('all');
              setSearchQuery('');
            }}>
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWarehouses.map((warehouse, index) => (
          <motion.div
            key={warehouse.warehouse_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{warehouse.warehouse_id}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {warehouse.taluk}, {warehouse.district}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < warehouse.rating ? 'bg-yellow-400' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Occupancy */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Occupancy</span>
                    <span className="font-medium">{warehouse.occupancy_percentage.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={warehouse.occupancy_percentage} 
                    className={`h-2 ${warehouse.occupancy_percentage > 80 ? 'bg-red-100' : ''}`}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {warehouse.current_occupancy_tonnes}T / {warehouse.capacity_tonnes}T
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">{warehouse.total_crops_stored}</div>
                    <div className="text-xs text-muted-foreground">Crops Stored</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {(warehouse.total_quantity_sold_kg / 1000).toFixed(1)}T
                    </div>
                    <div className="text-xs text-muted-foreground">Sold</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{warehouse.total_qr_generated}</div>
                    <div className="text-xs text-muted-foreground">QR Codes</div>
                  </div>
                </div>

                {/* Route Status */}
                <div>
                  <div className="text-sm font-medium mb-2">Route Status</div>
                  <Badge className={`text-xs ${getRouteStatusColor(warehouse.route_status)}`}>
                    {warehouse.route_status}
                  </Badge>
                </div>

                {/* High Demand Prediction */}
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-orange-800 text-sm">High Demand Prediction</span>
                  </div>
                  <p className="text-sm text-orange-700">{warehouse.high_demand_prediction}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getPriceTrendIcon(warehouse.predictive_analytics.price_trend)}
                    <span className="text-xs text-orange-600">
                      +{warehouse.predictive_analytics.expected_demand_increase}% expected increase
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleGenerateQR(warehouse.warehouse_id, 'General')}
                  >
                    <QrCode className="w-3 h-3 mr-1" />
                    Generate QR
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewQRHistory(warehouse.warehouse_id)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View QR History
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleMarkSold(warehouse.warehouse_id, 'Paddy')}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Mark Sold
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleUpdateQuantity(warehouse.warehouse_id, 'General')}
                  >
                    <Package className="w-3 h-3 mr-1" />
                    Update Qty
                  </Button>
                </div>

                {/* Call Support */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                    onClick={() => toast.info(`Calling warehouse manager: ${warehouse.manager_contact}`)}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Manager
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                    onClick={() => toast.info('Calling customer support: +91-99999-33333')}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Support
                  </Button>
                </div>

                {/* Last Updated */}
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated: {new Date(warehouse.last_updated).toLocaleDateString('en-IN')}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredWarehouses.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Warehouse className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No warehouses found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSelectedDistrict('all');
                setSelectedTaluk('all');
                setCropFilter('all');
                setSearchQuery('');
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}