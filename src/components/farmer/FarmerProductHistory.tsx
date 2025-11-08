import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Package, 
  MapPin, 
  Clock, 
  Truck, 
  Store, 
  QrCode, 
  ChevronRight, 
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Eye,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  Leaf,
  Award,
  Navigation,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useLanguage } from '../../contexts/LanguageContext';
import { productMovementHistory, getMovementsByFarmer, ProductMovementEntry } from '../../data/productMovementHistory';
import { User } from '../../types/user';

interface FarmerProductHistoryProps {
  user: User | null;
}

export function FarmerProductHistory({ user }: FarmerProductHistoryProps) {
  const [selectedMovement, setSelectedMovement] = useState<ProductMovementEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const { t } = useLanguage();

  // Get movements for current farmer
  const farmerMovements = useMemo(() => {
    if (!user?.uzhavarPin) return [];
    return getMovementsByFarmer(user.uzhavarPin);
  }, [user?.uzhavarPin]);

  // Filter movements based on search and filters
  const filteredMovements = useMemo(() => {
    return farmerMovements.filter(movement => {
      const matchesSearch = movement.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movement.uzhavan_santhai_shop.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || movement.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter === 'last_week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = new Date(movement.created_at) >= weekAgo;
      } else if (dateFilter === 'last_month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = new Date(movement.created_at) >= monthAgo;
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [farmerMovements, searchTerm, statusFilter, dateFilter]);

  // Analytics
  const analytics = useMemo(() => {
    const totalQuantity = farmerMovements.reduce((sum, m) => sum + m.product.quantity, 0);
    const totalValue = farmerMovements.reduce((sum, m) => sum + (m.product.quantity * m.pricing.farmer_price), 0);
    const avgSustainability = farmerMovements.reduce((sum, m) => sum + m.sustainability_score, 0) / farmerMovements.length;
    const totalCarbonSaved = farmerMovements.reduce((sum, m) => sum + m.carbon_footprint, 0);
    
    const statusCounts = farmerMovements.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalProducts: farmerMovements.length,
      totalQuantity,
      totalValue,
      avgSustainability: Math.round(avgSustainability * 10) / 10,
      totalCarbonSaved: Math.round(totalCarbonSaved * 10) / 10,
      statusCounts
    };
  }, [farmerMovements]);

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

  const TimelineStep = ({ step, isActive, isCompleted, time, description }: {
    step: string;
    isActive: boolean;
    isCompleted: boolean;
    time?: string;
    description: string;
  }) => (
    <div className="flex items-center space-x-3 py-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isCompleted ? 'bg-green-500 text-white' : 
        isActive ? 'bg-blue-500 text-white animate-pulse' : 
        'bg-gray-200 text-gray-500'
      }`}>
        {isCompleted ? <CheckCircle className="w-4 h-4" /> : getStatusIcon(step)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className={`font-medium ${isCompleted || isActive ? 'text-gray-900' : 'text-gray-500'}`}>
            {description}
          </span>
          {time && (
            <span className="text-sm text-gray-500">{formatDate(time)}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            Product Movement History
          </CardTitle>
          <p className="text-muted-foreground">
            Track your products from farm to Uzhavan Santhai shops
          </p>
        </CardHeader>
        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalProducts}</div>
              <div className="text-sm text-muted-foreground">Total Products</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">₹{analytics.totalValue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{analytics.totalQuantity}</div>
              <div className="text-sm text-muted-foreground">Total Quantity</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{analytics.avgSustainability}/10</div>
              <div className="text-sm text-muted-foreground">Sustainability</div>
            </div>
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{analytics.totalCarbonSaved}kg</div>
              <div className="text-sm text-muted-foreground">Carbon Impact</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products or shops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="harvested">Harvested</SelectItem>
                <SelectItem value="in_transit_to_warehouse">To Warehouse</SelectItem>
                <SelectItem value="in_warehouse">In Warehouse</SelectItem>
                <SelectItem value="in_transit_to_shop">To Shop</SelectItem>
                <SelectItem value="available_at_shop">At Shop</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last_week">Last Week</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Movement List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredMovements.map((movement, index) => (
            <motion.div
              key={movement.movement_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={movement.product.image}
                        alt={movement.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{movement.product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {movement.product.quantity} {movement.product.unit} • {movement.product.variety}
                          </p>
                          <div className="flex items-center mt-2 space-x-4">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {movement.warehouse.location.district}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <ChevronRight className="w-3 h-3" />
                              {movement.uzhavan_santhai_shop.location.district}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            ₹{movement.pricing.farmer_price}/kg
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total: ₹{(movement.product.quantity * movement.pricing.farmer_price).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Status and Timeline Preview */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge className={`flex items-center gap-1 ${getStatusColor(movement.status)}`}>
                            {getStatusIcon(movement.status)}
                            {formatStatus(movement.status)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Updated: {formatDate(movement.updated_at)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Leaf className="w-3 h-3 text-green-500" />
                            {movement.sustainability_score}/10
                          </Badge>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Package className="w-5 h-5" />
                                  {movement.product.name} - Movement Details
                                </DialogTitle>
                                <DialogDescription>
                                  View complete product journey from farm to Uzhavan Santhai shop with Amazon-style tracking timeline
                                </DialogDescription>
                              </DialogHeader>
                              
                              <Tabs defaultValue="timeline" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                                  <TabsTrigger value="details">Product Details</TabsTrigger>
                                  <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="timeline" className="mt-6">
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      {/* Left Column - Timeline */}
                                      <div>
                                        <h4 className="font-semibold mb-4">Product Journey Timeline</h4>
                                        <div className="space-y-1">
                                          <TimelineStep
                                            step="harvested"
                                            isCompleted={true}
                                            isActive={false}
                                            time={movement.timeline.harvested}
                                            description="Harvested & Quality Checked"
                                          />
                                          <TimelineStep
                                            step="in_transit_to_warehouse"
                                            isCompleted={!!movement.timeline.arrived_at_warehouse}
                                            isActive={movement.status === 'in_transit_to_warehouse'}
                                            time={movement.timeline.dispatched_to_warehouse}
                                            description="Dispatched to Warehouse"
                                          />
                                          <TimelineStep
                                            step="in_warehouse"
                                            isCompleted={!!movement.timeline.dispatched_to_shop}
                                            isActive={movement.status === 'in_warehouse'}
                                            time={movement.timeline.arrived_at_warehouse}
                                            description="Arrived at Warehouse"
                                          />
                                          <TimelineStep
                                            step="in_transit_to_shop"
                                            isCompleted={!!movement.timeline.arrived_at_shop}
                                            isActive={movement.status === 'in_transit_to_shop'}
                                            time={movement.timeline.dispatched_to_shop}
                                            description="Dispatched to Shop"
                                          />
                                          <TimelineStep
                                            step="available_at_shop"
                                            isCompleted={movement.status === 'available_at_shop' || movement.status === 'sold'}
                                            isActive={movement.status === 'available_at_shop'}
                                            time={movement.timeline.arrived_at_shop}
                                            description="Available at Uzhavan Santhai"
                                          />
                                        </div>
                                      </div>

                                      {/* Right Column - Location Details */}
                                      <div>
                                        <h4 className="font-semibold mb-4">Location Details</h4>
                                        <div className="space-y-4">
                                          <div className="p-4 border rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                              <Store className="w-4 h-4 text-blue-600" />
                                              <span className="font-medium">Warehouse</span>
                                            </div>
                                            <div className="text-sm space-y-1">
                                              <div>{movement.warehouse.name}</div>
                                              <div className="text-muted-foreground">
                                                {movement.warehouse.location.district}, {movement.warehouse.location.state}
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="p-4 border rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                              <ShoppingCart className="w-4 h-4 text-green-600" />
                                              <span className="font-medium">Uzhavan Santhai Shop</span>
                                            </div>
                                            <div className="text-sm space-y-1">
                                              <div>{movement.uzhavan_santhai_shop.name}</div>
                                              <div className="text-muted-foreground">
                                                {movement.uzhavan_santhai_shop.location.district}, {movement.uzhavan_santhai_shop.location.state}
                                              </div>
                                              <div className="text-muted-foreground">
                                                Manager: {movement.uzhavan_santhai_shop.contact.manager}
                                              </div>
                                              <div className="text-muted-foreground">
                                                Phone: {movement.uzhavan_santhai_shop.contact.phone}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="details" className="mt-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="font-semibold mb-4">Product Information</h4>
                                      <div className="space-y-3">
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Batch ID:</span>
                                          <span className="font-mono">{movement.product.batch_id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">QR Code:</span>
                                          <Badge variant="outline" className="font-mono">{movement.product.qr_code}</Badge>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Blockchain TX:</span>
                                          <span className="font-mono text-sm">{movement.product.blockchain_tx}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Carbon Footprint:</span>
                                          <span>{movement.carbon_footprint}kg CO₂</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Sustainability Score:</span>
                                          <Badge className="bg-green-100 text-green-800">
                                            {movement.sustainability_score}/10
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-semibold mb-4">Pricing & Certifications</h4>
                                      <div className="space-y-3">
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Farmer Price:</span>
                                          <span className="font-semibold">₹{movement.pricing.farmer_price}/kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Final Price:</span>
                                          <span className="font-semibold">₹{movement.pricing.final_price}/kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Community Votes:</span>
                                          <span>{movement.pricing.community_votes}</span>
                                        </div>
                                        <div className="space-y-2">
                                          <span className="text-muted-foreground">Certifications:</span>
                                          <div className="flex flex-wrap gap-1">
                                            {movement.certifications.map((cert, idx) => (
                                              <Badge key={idx} variant="outline" className="text-xs">
                                                <Award className="w-3 h-3 mr-1" />
                                                {cert}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="tracking" className="mt-6">
                                  <div className="text-center py-12">
                                    <Navigation className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Live Tracking</h3>
                                    <p className="text-muted-foreground mb-4">
                                      Current Location: {movement.current_location.place_name}
                                    </p>
                                    <Badge className={`${getStatusColor(movement.status)} px-4 py-2`}>
                                      {getStatusIcon(movement.status)}
                                      <span className="ml-2">{formatStatus(movement.status)}</span>
                                    </Badge>
                                    <p className="text-sm text-muted-foreground mt-4">
                                      Last updated: {formatDate(movement.current_location.updated_at)}
                                    </p>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredMovements.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                ? 'Try adjusting your filters to see more results.' 
                : 'Start by adding products to see their movement history.'}
            </p>
            {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDateFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}