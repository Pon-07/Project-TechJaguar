import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Search,
  Filter,
  SortAsc,
  TrendingUp,
  Package,
  Clock,
  MapPin,
  BarChart3,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Warehouse,
  Users
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { odishaWarehousesData, OdishaWarehouse } from '../../data/odishaWarehouses';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface WarehouseOverviewDashboardProps {
  onWarehouseSelect: (warehouse: OdishaWarehouse) => void;
}

const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];

export function WarehouseOverviewDashboard({ onWarehouseSelect }: WarehouseOverviewDashboardProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState('all');
  const [sortBy, setSortBy] = useState('warehouse_id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const warehouses = odishaWarehousesData.warehouses;

  // Enhanced warehouse data with calculated metrics
  const enhancedWarehouses = useMemo(() => {
    return warehouses.map(warehouse => {
      const totalStored = warehouse.inventory.reduce((sum, item) => sum + item.total_quantity_kg, 0);
      const totalPending = Math.floor(totalStored * 0.25); // 25% pending orders (dummy)
      const totalSold = Math.floor(totalStored * 0.65); // 65% sold (dummy)
      const qrCodesGenerated = warehouse.inventory.length * 3; // 3 QR codes per product (dummy)
      
      return {
        ...warehouse,
        totalStored: totalStored / 1000, // Convert to tonnes
        totalPending,
        totalSold,
        qrCodesGenerated,
        occupancyPercentage: (warehouse.current_occupancy_tonnes / warehouse.capacity_tonnes) * 100,
        totalValue: warehouse.inventory.reduce((sum, item) => sum + (item.total_quantity_kg * item.community_price_per_kg), 0)
      };
    });
  }, [warehouses]);

  // Get unique taluks for filter
  const taluks = useMemo(() => {
    return [...new Set(warehouses.map(w => w.taluk))];
  }, [warehouses]);

  // Get unique crops for filter
  const crops = useMemo(() => {
    const allCrops = warehouses.flatMap(w => 
      w.inventory.map(item => item.name.split(' ')[0]) // Get first word of crop name
    );
    return [...new Set(allCrops)];
  }, [warehouses]);

  // Filter and sort warehouses
  const filteredWarehouses = useMemo(() => {
    let filtered = enhancedWarehouses.filter(warehouse => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches = 
          warehouse.warehouse_id.toLowerCase().includes(query) ||
          warehouse.taluk.toLowerCase().includes(query) ||
          warehouse.district.toLowerCase().includes(query) ||
          warehouse.manager.name.toLowerCase().includes(query) ||
          warehouse.inventory.some(item => 
            item.name.toLowerCase().includes(query) ||
            item.variety.toLowerCase().includes(query)
          );
        if (!matches) return false;
      }

      // Taluk filter
      if (selectedTaluk !== 'all' && warehouse.taluk !== selectedTaluk) {
        return false;
      }

      // Crop filter
      if (selectedCrop !== 'all') {
        const hasCrop = warehouse.inventory.some(item => 
          item.name.toLowerCase().includes(selectedCrop.toLowerCase())
        );
        if (!hasCrop) return false;
      }

      // Date filter
      if (dateFilter !== 'all') {
        const lastUpdate = new Date(warehouse.last_updated);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dateFilter === 'week' && daysDiff > 7) return false;
        if (dateFilter === 'month' && daysDiff > 30) return false;
      }

      return true;
    });

    // Sort warehouses
    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'totalStored':
          aValue = a.totalStored;
          bValue = b.totalStored;
          break;
        case 'occupancy':
          aValue = a.occupancyPercentage;
          bValue = b.occupancyPercentage;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'last_updated':
          aValue = new Date(a.last_updated).getTime();
          bValue = new Date(b.last_updated).getTime();
          break;
        default:
          aValue = a.warehouse_id;
          bValue = b.warehouse_id;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
  }, [enhancedWarehouses, searchQuery, selectedTaluk, selectedCrop, dateFilter, sortBy, sortOrder]);

  // Analytics data
  const analyticsData = useMemo(() => {
    const stockByType = crops.slice(0, 6).map(crop => {
      const totalStock = warehouses.reduce((sum, warehouse) => {
        return sum + warehouse.inventory
          .filter(item => item.name.toLowerCase().includes(crop.toLowerCase()))
          .reduce((itemSum, item) => itemSum + item.total_quantity_kg, 0);
      }, 0);
      
      return {
        crop,
        stock: totalStock / 1000, // Convert to tonnes
        value: totalStock * 50 // Dummy value calculation
      };
    });

    const pendingVsSold = {
      pending: filteredWarehouses.reduce((sum, w) => sum + w.totalPending, 0),
      sold: filteredWarehouses.reduce((sum, w) => sum + w.totalSold, 0)
    };

    const profitLoss = warehouses.map(w => ({
      warehouse: w.warehouse_id.split('-')[2],
      profit: w.analytics.turnover_last_3_months_inr / 100000, // Convert to lakhs
      loss: Math.random() * 50000, // Dummy loss data
      occupancy: (w.current_occupancy_tonnes / w.capacity_tonnes) * 100
    }));

    return { stockByType, pendingVsSold, profitLoss };
  }, [warehouses, filteredWarehouses, crops]);

  const handleRefresh = () => {
    toast.success('Dashboard data refreshed successfully');
  };

  const handleExport = () => {
    const exportData = filteredWarehouses.map(w => ({
      ID: w.warehouse_id,
      Taluk: w.taluk,
      District: w.district,
      Manager: w.manager.name,
      'Total Stored (tonnes)': w.totalStored.toFixed(1),
      'Occupancy %': w.occupancyPercentage.toFixed(1),
      'QR Codes Generated': w.qrCodesGenerated,
      Rating: w.rating,
      'Last Updated': new Date(w.last_updated).toLocaleDateString()
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'warehouse-overview.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Warehouse overview exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Warehouse Overview Dashboard
            </h2>
            <p className="text-blue-100 mt-1">
              Complete analytics and management across all warehouse locations
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Warehouse className="w-3 h-3 mr-1" />
                {warehouses.length} Active Warehouses
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Package className="w-3 h-3 mr-1" />
                {filteredWarehouses.length} Filtered Results
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹{(analyticsData.profitLoss.reduce((sum, p) => sum + p.profit, 0)).toFixed(1)}L</div>
            <div className="text-sm text-blue-100">Total Turnover (3M)</div>
            <div className="flex items-center text-sm mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15.2% vs last quarter
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Capacity',
            value: `${warehouses.reduce((sum, w) => sum + w.capacity_tonnes, 0).toLocaleString()}t`,
            icon: Package,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
          },
          {
            label: 'Current Stock',
            value: `${warehouses.reduce((sum, w) => sum + w.current_occupancy_tonnes, 0).toLocaleString()}t`,
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-50'
          },
          {
            label: 'Active Products',
            value: warehouses.reduce((sum, w) => sum + w.inventory.length, 0).toString(),
            icon: Package,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
          },
          {
            label: 'QR Codes Generated',
            value: filteredWarehouses.reduce((sum, w) => sum + w.qrCodesGenerated, 0).toString(),
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 ${stat.bg} rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock by Type Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Crop Stock Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.stockByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" />
                <YAxis tickFormatter={(value) => `${value}t`} />
                <Tooltip formatter={(value: any) => [`${value} tonnes`, '']} />
                <Bar dataKey="stock" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pending vs Sold */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pending Orders', value: analyticsData.pendingVsSold.pending, color: '#f59e0b' },
                    { name: 'Completed Sales', value: analyticsData.pendingVsSold.sold, color: '#22c55e' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {[0, 1].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Warehouse Management</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search warehouses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedTaluk} onValueChange={setSelectedTaluk}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Taluk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Taluks</SelectItem>
                {taluks.map(taluk => (
                  <SelectItem key={taluk} value={taluk}>{taluk}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                {crops.map(crop => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Date Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warehouse_id">Warehouse ID</SelectItem>
                <SelectItem value="totalStored">Total Stored</SelectItem>
                <SelectItem value="occupancy">Occupancy %</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="last_updated">Last Updated</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <SortAsc className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Warehouse Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warehouse ID</TableHead>
                  <TableHead>Taluk/District</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Total Stored</TableHead>
                  <TableHead>Pending Orders</TableHead>
                  <TableHead>Sold Crops</TableHead>
                  <TableHead>QR Codes</TableHead>
                  <TableHead>Occupancy</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarehouses.map((warehouse, index) => (
                  <motion.tr
                    key={warehouse.warehouse_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onWarehouseSelect(warehouse)}
                  >
                    <TableCell className="font-medium">{warehouse.warehouse_id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{warehouse.taluk}</div>
                        <div className="text-sm text-muted-foreground">{warehouse.district}</div>
                      </div>
                    </TableCell>
                    <TableCell>{warehouse.manager.name}</TableCell>
                    <TableCell>{warehouse.totalStored.toFixed(1)}t</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">
                        {warehouse.totalPending.toLocaleString()} kg
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {warehouse.totalSold.toLocaleString()} kg
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {warehouse.qrCodesGenerated} codes
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              warehouse.occupancyPercentage > 80 ? 'bg-red-500' : 
                              warehouse.occupancyPercentage > 60 ? 'bg-amber-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(warehouse.occupancyPercentage, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm">{warehouse.occupancyPercentage.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span>{warehouse.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(warehouse.last_updated).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onWarehouseSelect(warehouse);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredWarehouses.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No warehouses found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}