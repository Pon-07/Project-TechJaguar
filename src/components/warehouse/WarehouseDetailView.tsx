import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Box, 
  MapPin, 
  User, 
  Star, 
  Calendar, 
  QrCode, 
  Truck, 
  Package, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Users,
  Shield,
  ExternalLink,
  MessageSquare,
  Share2,
  Bookmark
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { Warehouse } from '../../data/warehouses';
import { InventoryTable } from './InventoryTable';
import { CommunityVotes } from './CommunityVotes';
import { ARPreview } from './ARPreview';

interface WarehouseDetailViewProps {
  warehouse: Warehouse;
  onBack: () => void;
  onInventoryItemClick: (item: any) => void;
}

export function WarehouseDetailView({ warehouse, onBack, onInventoryItemClick }: WarehouseDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const occupancyPercentage = (warehouse.current_occupancy_tonnes / warehouse.capacity_tonnes) * 100;
  
  // Mock chart data
  const monthlyData = [
    { month: 'Jul', inflow: warehouse.analytics.monthly_inflow_tonnes - 50, outflow: warehouse.analytics.monthly_outflow_tonnes - 30 },
    { month: 'Aug', inflow: warehouse.analytics.monthly_inflow_tonnes - 20, outflow: warehouse.analytics.monthly_outflow_tonnes - 10 },
    { month: 'Sep', inflow: warehouse.analytics.monthly_inflow_tonnes, outflow: warehouse.analytics.monthly_outflow_tonnes },
  ];

  // Category distribution for pie chart
  const categoryData = [
    { name: 'Grains', value: 45, color: '#22c55e' },
    { name: 'Vegetables', value: 25, color: '#f59e0b' },
    { name: 'Fruits', value: 20, color: '#3b82f6' },
    { name: 'Spices', value: 10, color: '#8b5cf6' },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'fill-amber-400 text-amber-400' 
            : i < rating 
            ? 'fill-amber-200 text-amber-200' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Warehouses
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-semibold">{warehouse.warehouse_id}</h1>
                <p className="text-sm text-muted-foreground">{warehouse.taluk}, {warehouse.district}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Warehouse Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* 3D Preview */}
            <ARPreview 
              asset3D={warehouse.warehouse_3d_asset}
              title="Warehouse 3D View"
              subtitle="Tap to open AR/3D viewer"
            />

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Warehouse Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium">{warehouse.address}</div>
                      <div className="text-muted-foreground">{warehouse.district}, {warehouse.state}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="font-medium">{warehouse.manager.name}</div>
                      <div className="text-muted-foreground">{warehouse.manager.contact}</div>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {warehouse.manager.uzhavar_pin}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(warehouse.rating)}
                      </div>
                      <span className="text-sm font-medium">{warehouse.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="font-medium">Last Inspection</div>
                      <div className="text-muted-foreground">{formatDate(warehouse.last_inspection_date)}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <Button className="w-full" variant="outline">
                    <QrCode className="w-4 h-4 mr-2" />
                    Show QR Code
                  </Button>
                  
                  {warehouse.delivery_partners.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Delivery Partners</div>
                      <div className="flex flex-wrap gap-2">
                        {warehouse.delivery_partners.map((partner, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Truck className="w-3 h-3 mr-1" />
                            {partner}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Capacity Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Box className="w-5 h-5" />
                  Capacity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Current Occupancy</span>
                    <span className="font-medium">
                      {warehouse.current_occupancy_tonnes}t / {warehouse.capacity_tonnes}t
                    </span>
                  </div>
                  <Progress value={occupancyPercentage} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{occupancyPercentage.toFixed(1)}% occupied</span>
                    <span>{(warehouse.capacity_tonnes - warehouse.current_occupancy_tonnes)}t available</span>
                  </div>
                  {occupancyPercentage >= 95 && (
                    <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-800">
                      ⚠️ Warehouse is near full capacity
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Inflow</p>
                            <p className="text-2xl font-semibold text-green-600">
                              {warehouse.analytics.monthly_inflow_tonnes}t
                            </p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Outflow</p>
                            <p className="text-2xl font-semibold text-blue-600">
                              {warehouse.analytics.monthly_outflow_tonnes}t
                            </p>
                          </div>
                          <TrendingDown className="w-8 h-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">3-Month Turnover</p>
                            <p className="text-2xl font-semibold text-amber-600">
                              {formatCurrency(warehouse.analytics.turnover_last_3_months_inr)}
                            </p>
                          </div>
                          <BarChart3 className="w-8 h-8 text-amber-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Inventory Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Current Inventory ({warehouse.inventory.length} items)
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab('inventory')}
                      >
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {warehouse.inventory.slice(0, 6).map((item, index) => (
                        <motion.div
                          key={item.item_id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => onInventoryItemClick(item)}
                          className="cursor-pointer"
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-medium text-sm">{item.name}</h4>
                                  {item.organic_cert === 'Yes' && (
                                    <Badge className="bg-green-100 text-green-800 text-xs">Organic</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">{item.variety}</p>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {item.farmer_count} farmers
                                  </span>
                                  <span className="font-medium text-green-600">
                                    ₹{item.community_price_per_kg}/kg
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {(item.total_quantity_kg / 1000).toFixed(1)} tonnes available
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Notes & Actions */}
                {warehouse.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{warehouse.notes}</p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm">Raise Request</Button>
                        <Button size="sm" variant="outline">Reserve Stock</Button>
                        <Button size="sm" variant="outline">Open AR</Button>
                        <Button size="sm" variant="outline">Share QR</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="inventory">
                <InventoryTable 
                  inventory={warehouse.inventory} 
                  onItemClick={onInventoryItemClick}
                />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                {/* Flow Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Monthly Flow (Last 3 Months)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Line 
                            type="monotone" 
                            dataKey="inflow" 
                            stroke="#22c55e" 
                            strokeWidth={2}
                            name="Inflow"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="outflow" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            name="Outflow"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Category Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {categoryData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}: {item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="community">
                <CommunityVotes 
                  votes={warehouse.community_price_votes}
                  contractIds={warehouse.inventory.map(item => item.blockchain_contract_id)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}