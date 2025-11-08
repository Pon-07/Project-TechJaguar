import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Warehouse, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Users,
  MapPin, 
  Clock, 
  Truck, 
  Store, 
  QrCode, 
  ChevronRight, 
  Search,
  Filter,
  Calendar,
  Eye,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  Leaf,
  Award,
  Navigation,
  ArrowRight,
  ArrowLeft,
  BarChart3,
  FileText,
  Download
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  productMovementHistory, 
  getMovementsByWarehouse, 
  getMovementsByState,
  getMovementsByDistrict,
  ProductMovementEntry 
} from '../../data/productMovementHistory';
import { indiaWarehousesData } from '../../data/indiaWideWarehouseData';

export function WarehouseProductHistory() {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'analytics'>('incoming');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [cropFilter, setCropFilter] = useState<string>('all');
  const { t } = useLanguage();

  // Get unique states, districts, and warehouses
  const availableStates = useMemo(() => {
    const states = [...new Set(productMovementHistory.map(m => m.warehouse.location.state))];
    return states.sort();
  }, []);

  const availableDistricts = useMemo(() => {
    let movements = productMovementHistory;
    if (selectedState !== 'all') {
      movements = movements.filter(m => m.warehouse.location.state === selectedState);
    }
    const districts = [...new Set(movements.map(m => m.warehouse.location.district))];
    return districts.sort();
  }, [selectedState]);

  const availableWarehouses = useMemo(() => {
    let movements = productMovementHistory;
    if (selectedState !== 'all') {
      movements = movements.filter(m => m.warehouse.location.state === selectedState);
    }
    if (selectedDistrict !== 'all') {
      movements = movements.filter(m => m.warehouse.location.district === selectedDistrict);
    }
    const warehouses = [...new Set(movements.map(m => ({ id: m.warehouse.id, name: m.warehouse.name })))];
    return warehouses.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedState, selectedDistrict]);

  const availableCrops = useMemo(() => {
    const crops = [...new Set(productMovementHistory.map(m => m.product.category))];
    return crops.sort();
  }, []);

  // Filter movements
  const filteredMovements = useMemo(() => {
    return productMovementHistory.filter(movement => {
      // State filter
      if (selectedState !== 'all' && movement.warehouse.location.state !== selectedState) return false;
      
      // District filter
      if (selectedDistrict !== 'all' && movement.warehouse.location.district !== selectedDistrict) return false;
      
      // Warehouse filter
      if (selectedWarehouse !== 'all' && movement.warehouse.id !== selectedWarehouse) return false;
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          movement.product.name.toLowerCase().includes(searchLower) ||
          movement.farmer.name.toLowerCase().includes(searchLower) ||
          movement.warehouse.name.toLowerCase().includes(searchLower) ||
          movement.uzhavan_santhai_shop.name.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      // Crop filter
      if (cropFilter !== 'all' && movement.product.category !== cropFilter) return false;
      
      // Date filter
      if (dateFilter !== 'all') {
        const movementDate = new Date(movement.created_at);
        const now = new Date();
        if (dateFilter === 'last_week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (movementDate < weekAgo) return false;
        } else if (dateFilter === 'last_month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (movementDate < monthAgo) return false;
        }
      }
      
      return true;
    });
  }, [selectedState, selectedDistrict, selectedWarehouse, searchTerm, cropFilter, dateFilter]);

  // Separate incoming and outgoing
  const incomingMovements = useMemo(() => {
    return filteredMovements.filter(m => 
      m.status === 'harvested' || 
      m.status === 'in_transit_to_warehouse' || 
      m.status === 'in_warehouse'
    ).sort((a, b) => new Date(b.timeline.arrived_at_warehouse || b.created_at).getTime() - 
                     new Date(a.timeline.arrived_at_warehouse || a.created_at).getTime());
  }, [filteredMovements]);

  const outgoingMovements = useMemo(() => {
    return filteredMovements.filter(m => 
      m.status === 'in_transit_to_shop' || 
      m.status === 'available_at_shop' || 
      m.status === 'sold'
    ).sort((a, b) => new Date(b.timeline.dispatched_to_shop || b.created_at).getTime() - 
                     new Date(a.timeline.dispatched_to_shop || a.created_at).getTime());
  }, [filteredMovements]);

  // Analytics
  const analytics = useMemo(() => {
    const totalMovements = filteredMovements.length;
    const totalValue = filteredMovements.reduce((sum, m) => sum + (m.product.quantity * m.pricing.final_price), 0);
    const totalQuantity = filteredMovements.reduce((sum, m) => sum + m.product.quantity, 0);
    
    const warehouseStats = filteredMovements.reduce((acc, m) => {
      const warehouseId = m.warehouse.id;
      if (!acc[warehouseId]) {
        acc[warehouseId] = {
          name: m.warehouse.name,
          location: m.warehouse.location,
          totalMovements: 0,
          totalValue: 0,
          totalQuantity: 0,
          avgSustainability: 0
        };
      }
      acc[warehouseId].totalMovements += 1;
      acc[warehouseId].totalValue += m.product.quantity * m.pricing.final_price;
      acc[warehouseId].totalQuantity += m.product.quantity;
      acc[warehouseId].avgSustainability += m.sustainability_score;
      return acc;
    }, {} as Record<string, any>);

    // Calculate averages
    Object.values(warehouseStats).forEach((stats: any) => {
      stats.avgSustainability = Math.round((stats.avgSustainability / stats.totalMovements) * 10) / 10;
    });

    const topWarehouses = Object.values(warehouseStats)
      .sort((a: any, b: any) => b.totalValue - a.totalValue)
      .slice(0, 5);

    const categoryStats = filteredMovements.reduce((acc, m) => {
      const category = m.product.category;
      if (!acc[category]) {
        acc[category] = { count: 0, value: 0, quantity: 0 };
      }
      acc[category].count += 1;
      acc[category].value += m.product.quantity * m.pricing.final_price;
      acc[category].quantity += m.product.quantity;
      return acc;
    }, {} as Record<string, any>);

    const topCategories = Object.entries(categoryStats)
      .sort(([,a], [,b]) => (b as any).value - (a as any).value)
      .slice(0, 5);

    return {
      totalMovements,
      totalValue,
      totalQuantity,
      warehouseStats,
      topWarehouses,
      categoryStats,
      topCategories,
      incomingCount: incomingMovements.length,
      outgoingCount: outgoingMovements.length
    };
  }, [filteredMovements, incomingMovements, outgoingMovements]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'harvested': return <Package className="w-4 h-4" />;
      case 'in_transit_to_warehouse': return <Truck className="w-4 h-4" />;
      case 'in_warehouse': return <Store className="w-4 h-4" />;
      case 'in_transit_to_shop': return <Navigation className="w-4 h-4" />;
      case 'available_at_shop': return <ShoppingCart className="w-4 h-4" />;
      case 'sold': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'harvested': return 'bg-blue-100 text-blue-800';
      case 'in_transit_to_warehouse': return 'bg-yellow-100 text-yellow-800';
      case 'in_warehouse': return 'bg-purple-100 text-purple-800';
      case 'in_transit_to_shop': return 'bg-orange-100 text-orange-800';
      case 'available_at_shop': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const MovementCard = ({ movement, isIncoming }: { movement: ProductMovementEntry; isIncoming: boolean }) => (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Product Image */}
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={movement.product.image}
              alt={movement.product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{movement.product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {movement.product.quantity} {movement.product.unit}
                </p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  {isIncoming ? (
                    <>
                      <Users className="w-3 h-3 mr-1" />
                      From: {movement.farmer.name} ({movement.farmer.district})
                    </>
                  ) : (
                    <>
                      <Store className="w-3 h-3 mr-1" />
                      To: {movement.uzhavan_santhai_shop.name} ({movement.uzhavan_santhai_shop.location.district})
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge className={`${getStatusColor(movement.status)} text-xs`}>
                  {getStatusIcon(movement.status)}
                  <span className="ml-1">{formatStatus(movement.status)}</span>
                </Badge>
                <div className="text-sm font-medium mt-1">
                  ₹{(movement.product.quantity * movement.pricing.final_price).toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {movement.warehouse.name}
                </span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(isIncoming ? 
                    (movement.timeline.arrived_at_warehouse || movement.timeline.dispatched_to_warehouse) :
                    (movement.timeline.dispatched_to_shop || movement.timeline.arrived_at_shop)
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  <QrCode className="w-3 h-3 mr-1" />
                  {movement.product.qr_code}
                </Badge>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs px-2 py-1">
                      <Eye className="w-3 h-3 mr-1" />
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{movement.product.name} - Full Details</DialogTitle>
                      <DialogDescription>
                        Complete product information including supply chain details, certifications, and blockchain tracking
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-2">Product Info</h5>
                        <div className="space-y-1">
                          <div>Batch: {movement.product.batch_id}</div>
                          <div>Blockchain: {movement.product.blockchain_tx}</div>
                          <div>Carbon: {movement.carbon_footprint}kg CO₂</div>
                          <div>Sustainability: {movement.sustainability_score}/10</div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Supply Chain</h5>
                        <div className="space-y-1">
                          <div>Farmer: {movement.farmer.name}</div>
                          <div>Warehouse: {movement.warehouse.name}</div>
                          <div>Shop: {movement.uzhavan_santhai_shop.name}</div>
                          <div>Status: {formatStatus(movement.status)}</div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-orange-600" />
            Warehouse Product Movement History
          </CardTitle>
          <p className="text-muted-foreground">
            Track incoming and outgoing products across warehouses and Uzhavan Santhai shops
          </p>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {availableStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger>
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {availableDistricts.map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger>
                <SelectValue placeholder="Select Warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                {availableWarehouses.map(warehouse => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cropFilter} onValueChange={setCropFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Crop Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCrops.map(crop => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last_week">Last Week</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalMovements}</div>
              <div className="text-sm text-muted-foreground">Total Movements</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">₹{(analytics.totalValue / 100000).toFixed(1)}L</div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{analytics.totalQuantity}</div>
              <div className="text-sm text-muted-foreground">Total Quantity</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{analytics.incomingCount}</div>
              <div className="text-sm text-muted-foreground">Incoming</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{analytics.outgoingCount}</div>
              <div className="text-sm text-muted-foreground">Outgoing</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="incoming" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Incoming Products ({analytics.incomingCount})
          </TabsTrigger>
          <TabsTrigger value="outgoing" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Outgoing Products ({analytics.outgoingCount})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="mt-6">
          <div className="space-y-4">
            <AnimatePresence>
              {incomingMovements.map((movement, index) => (
                <motion.div
                  key={movement.movement_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MovementCard movement={movement} isIncoming={true} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {incomingMovements.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Incoming Products</h3>
                  <p className="text-muted-foreground">No products match your current filters.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="outgoing" className="mt-6">
          <div className="space-y-4">
            <AnimatePresence>
              {outgoingMovements.map((movement, index) => (
                <motion.div
                  key={movement.movement_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MovementCard movement={movement} isIncoming={false} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {outgoingMovements.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Store className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Outgoing Products</h3>
                  <p className="text-muted-foreground">No products match your current filters.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Warehouses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Top Performing Warehouses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topWarehouses.map((warehouse: any, index: number) => (
                    <div key={warehouse.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{warehouse.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {warehouse.location.district}, {warehouse.location.state}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{(warehouse.totalValue / 1000).toFixed(1)}K</div>
                        <div className="text-sm text-muted-foreground">{warehouse.totalMovements} movements</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Top Product Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topCategories.map(([category, stats]: [string, any], index: number) => (
                    <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{category}</div>
                          <div className="text-sm text-muted-foreground">{stats.count} products</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{(stats.value / 1000).toFixed(1)}K</div>
                        <div className="text-sm text-muted-foreground">{stats.quantity} units</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}