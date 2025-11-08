import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
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
  Users,
  QrCode,
  Phone,
  FileEdit,
  CheckSquare,
  Bell,
  TrendingDown,
  Truck,
  Globe,
  Activity,
  DollarSign,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { odishaWarehousesData, odishaPredictiveData, odishaCallSupport, OdishaWarehouse } from '../../data/odishaWarehouses';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface OdishaWarehouseManagementProps {
  onWarehouseSelect: (warehouse: OdishaWarehouse) => void;
}

const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f97316'];

export function OdishaWarehouseManagement({ onWarehouseSelect }: OdishaWarehouseManagementProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedTaluk, setSelectedTaluk] = useState('all');
  const [sortBy, setSortBy] = useState('warehouse_id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedWarehouseForQR, setSelectedWarehouseForQR] = useState<OdishaWarehouse | null>(null);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState('');

  const warehouses = odishaWarehousesData.warehouses;

  // Enhanced warehouse data with calculated metrics
  const enhancedWarehouses = useMemo(() => {
    return warehouses.map(warehouse => {
      const totalStored = warehouse.inventory.reduce((sum, item) => sum + item.total_quantity_kg, 0);
      const totalPending = Math.floor(totalStored * 0.25);
      const totalSold = Math.floor(totalStored * 0.65);
      const qrCodesGenerated = warehouse.inventory.length * 4;
      
      return {
        ...warehouse,
        totalStored: totalStored / 1000,
        totalPending,
        totalSold,
        qrCodesGenerated,
        occupancyPercentage: (warehouse.current_occupancy_tonnes / warehouse.capacity_tonnes) * 100,
        totalValue: warehouse.inventory.reduce((sum, item) => sum + (item.total_quantity_kg * item.community_price_per_kg), 0),
        predictiveData: odishaPredictiveData.predictions.find(p => p.warehouse_id === warehouse.warehouse_id)
      };
    });
  }, [warehouses]);

  // Get unique districts and taluks for filters
  const districts = useMemo(() => {
    return [...new Set(warehouses.map(w => w.district))].sort();
  }, [warehouses]);

  const taluks = useMemo(() => {
    const filtered = selectedDistrict === 'all' 
      ? warehouses 
      : warehouses.filter(w => w.district === selectedDistrict);
    return [...new Set(filtered.map(w => w.taluk))].sort();
  }, [warehouses, selectedDistrict]);

  const crops = useMemo(() => {
    const allCrops = warehouses.flatMap(w => 
      w.inventory.map(item => item.name.split(' ')[0])
    );
    return [...new Set(allCrops)].sort();
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

      // District filter
      if (selectedDistrict !== 'all' && warehouse.district !== selectedDistrict) {
        return false;
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

      // Stock filter
      if (stockFilter !== 'all') {
        if (stockFilter === 'low' && warehouse.occupancyPercentage > 30) return false;
        if (stockFilter === 'medium' && (warehouse.occupancyPercentage <= 30 || warehouse.occupancyPercentage > 70)) return false;
        if (stockFilter === 'high' && warehouse.occupancyPercentage <= 70) return false;
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
  }, [enhancedWarehouses, searchQuery, selectedDistrict, selectedTaluk, selectedCrop, stockFilter, sortBy, sortOrder]);

  // Analytics data
  const analyticsData = useMemo(() => {
    // District-wise distribution
    const districtData = districts.map(district => {
      const districtWarehouses = warehouses.filter(w => w.district === district);
      const totalStock = districtWarehouses.reduce((sum, w) => sum + w.current_occupancy_tonnes, 0);
      const totalCapacity = districtWarehouses.reduce((sum, w) => sum + w.capacity_tonnes, 0);
      
      return {
        district,
        warehouses: districtWarehouses.length,
        totalStock,
        capacity: totalCapacity,
        occupancy: totalCapacity > 0 ? (totalStock / totalCapacity) * 100 : 0
      };
    });

    // Crop-wise analytics
    const cropData = crops.slice(0, 8).map(crop => {
      const totalStock = warehouses.reduce((sum, warehouse) => {
        return sum + warehouse.inventory
          .filter(item => item.name.toLowerCase().includes(crop.toLowerCase()))
          .reduce((itemSum, item) => itemSum + item.total_quantity_kg, 0);
      }, 0);
      
      const totalValue = warehouses.reduce((sum, warehouse) => {
        return sum + warehouse.inventory
          .filter(item => item.name.toLowerCase().includes(crop.toLowerCase()))
          .reduce((itemSum, item) => itemSum + (item.total_quantity_kg * item.community_price_per_kg), 0);
      }, 0);
      
      return {
        crop,
        stock: totalStock / 1000,
        value: totalValue / 100000, // Convert to lakhs
        warehouses: warehouses.filter(w => 
          w.inventory.some(item => item.name.toLowerCase().includes(crop.toLowerCase()))
        ).length
      };
    });

    // Monthly trend data (dummy)
    const monthlyTrend = [
      { month: 'Jan', inflow: 1250, outflow: 980, inventory: 2100 },
      { month: 'Feb', inflow: 1180, outflow: 1050, inventory: 2230 },
      { month: 'Mar', inflow: 1320, outflow: 1120, inventory: 2430 },
      { month: 'Apr', inflow: 1450, outflow: 1200, inventory: 2680 },
      { month: 'May', inflow: 1380, outflow: 1300, inventory: 2760 },
      { month: 'Jun', inflow: 1520, outflow: 1450, inventory: 2830 }
    ];

    return { districtData, cropData, monthlyTrend };
  }, [warehouses, districts, crops]);

  const handleGenerateQR = (warehouse: OdishaWarehouse, item?: any) => {
    setSelectedWarehouseForQR(warehouse);
    setQrDialogOpen(true);
    toast.success(`QR Code generated for ${warehouse.warehouse_id}${item ? ` - ${item.name}` : ''}`);
  };

  const handleMarkSold = (warehouse: OdishaWarehouse, item: any) => {
    toast.success(`${item.name} marked as sold in ${warehouse.warehouse_id}`);
  };

  const handleUpdateQuantity = (warehouse: OdishaWarehouse, item: any) => {
    toast.success(`Quantity updated for ${item.name} in ${warehouse.warehouse_id}`);
  };

  const handleCallSupport = (type: string) => {
    setSelectedContact(type);
    setCallDialogOpen(true);
    
    let contactNumber = '';
    switch (type) {
      case 'warehouse':
        contactNumber = odishaCallSupport.warehouse_support;
        break;
      case 'farmer':
        contactNumber = odishaCallSupport.farmer_helpline;
        break;
      case 'consumer':
        contactNumber = odishaCallSupport.consumer_support;
        break;
      case 'emergency':
        contactNumber = odishaCallSupport.emergency_hotline;
        break;
      default:
        contactNumber = odishaCallSupport.warehouse_support;
    }
    
    toast.success(`Connecting to ${contactNumber}...`);
  };

  const handleRefresh = () => {
    toast.success('Odisha warehouse data refreshed successfully');
  };

  const handleExport = () => {
    const exportData = filteredWarehouses.map(w => ({
      ID: w.warehouse_id,
      District: w.district,
      Taluk: w.taluk,
      Manager: w.manager.name,
      Contact: w.manager.contact,
      'Total Stored (tonnes)': w.totalStored.toFixed(1),
      'Capacity (tonnes)': w.capacity_tonnes,
      'Occupancy %': w.occupancyPercentage.toFixed(1),
      'QR Codes Generated': w.qrCodesGenerated,
      Rating: w.rating,
      'Last Updated': new Date(w.last_updated).toLocaleDateString(),
      'High Demand Crops': w.predictiveData?.high_demand_crops.map(c => c.crop).join(', ') || 'N/A'
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'odisha-warehouses-overview.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Odisha warehouse overview exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-600 via-red-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="flex items-center justify-between relative">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Globe className="w-8 h-8" />
              Odisha State Warehouse Management
            </h2>
            <p className="text-orange-100 mt-2 text-lg">
              Comprehensive management across all 30 districts of Odisha
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Warehouse className="w-3 h-3 mr-1" />
                {warehouses.length} Active Warehouses
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <MapPin className="w-3 h-3 mr-1" />
                {districts.length} Districts Covered
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Package className="w-3 h-3 mr-1" />
                {filteredWarehouses.length} Filtered Results
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">₹{(analyticsData.cropData.reduce((sum, c) => sum + c.value, 0)).toFixed(1)}L</div>
            <div className="text-sm text-orange-100">Total Inventory Value</div>
            <div className="flex items-center text-sm mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +18.5% vs last quarter
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          {
            label: 'Total Capacity',
            value: `${warehouses.reduce((sum, w) => sum + w.capacity_tonnes, 0).toLocaleString()}t`,
            icon: Package,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            change: '+12.3%'
          },
          {
            label: 'Current Stock',
            value: `${warehouses.reduce((sum, w) => sum + w.current_occupancy_tonnes, 0).toLocaleString()}t`,
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-50',
            change: '+8.7%'
          },
          {
            label: 'Active Products',
            value: warehouses.reduce((sum, w) => sum + w.inventory.length, 0).toString(),
            icon: Activity,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            change: '+15.2%'
          },
          {
            label: 'QR Codes Generated',
            value: filteredWarehouses.reduce((sum, w) => sum + w.qrCodesGenerated, 0).toString(),
            icon: QrCode,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            change: '+22.1%'
          },
          {
            label: 'Avg Occupancy',
            value: `${(warehouses.reduce((sum, w) => sum + (w.current_occupancy_tonnes / w.capacity_tonnes) * 100, 0) / warehouses.length).toFixed(1)}%`,
            icon: BarChart3,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            change: '+5.4%'
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
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District-wise Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              District-wise Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.districtData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district" angle={-45} textAnchor="end" height={80} fontSize={10} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="warehouses" fill="#3b82f6" name="Warehouses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Crop-wise Value */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Top Crops by Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.cropData.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ crop, percent }) => `${crop}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.cropData.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`₹${value}L`, 'Value']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Monthly Inventory Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="inventory" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                <Area type="monotone" dataKey="inflow" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Call Warehouse Support', icon: Phone, action: () => handleCallSupport('warehouse') },
              { label: 'Call Farmer Helpline', icon: Users, action: () => handleCallSupport('farmer') },
              { label: 'Emergency Hotline', icon: AlertTriangle, action: () => handleCallSupport('emergency') },
              { label: 'Generate QR Codes', icon: QrCode, action: () => setQrDialogOpen(true) }
            ].map((action, index) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={action.action}
              >
                <action.icon className="w-6 h-6" />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Warehouse Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="w-5 h-5" />
              Warehouse Management Dashboard
            </CardTitle>
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
          {/* Enhanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search warehouses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedDistrict} onValueChange={(value) => {
              setSelectedDistrict(value);
              setSelectedTaluk('all'); // Reset taluk when district changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTaluk} onValueChange={setSelectedTaluk}>
              <SelectTrigger>
                <SelectValue placeholder="Taluk" />
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
                <SelectValue placeholder="Crop Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                {crops.map(crop => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Stock Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="low">Low (0-30%)</SelectItem>
                <SelectItem value="medium">Medium (30-70%)</SelectItem>
                <SelectItem value="high">High (70%+)</SelectItem>
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

          {/* Enhanced Warehouse Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warehouse Details</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Storage Info</TableHead>
                  <TableHead>Inventory Status</TableHead>
                  <TableHead>QR & Blockchain</TableHead>
                  <TableHead>Predictive Analytics</TableHead>
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
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-bold text-blue-600">{warehouse.warehouse_id}</div>
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span className="text-sm">{warehouse.rating}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Updated: {new Date(warehouse.last_updated).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{warehouse.district}</div>
                        <div className="text-sm text-muted-foreground">{warehouse.taluk}</div>
                        <div className="text-xs text-gray-500">{warehouse.state}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{warehouse.manager.name}</div>
                        <div className="text-sm text-muted-foreground">{warehouse.manager.contact}</div>
                        <div className="text-xs text-blue-600">{warehouse.manager.uzhavar_pin}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">{warehouse.totalStored.toFixed(1)}t</span>
                          <span className="text-muted-foreground"> / {warehouse.capacity_tonnes}t</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                warehouse.occupancyPercentage > 80 ? 'bg-red-500' : 
                                warehouse.occupancyPercentage > 60 ? 'bg-amber-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(warehouse.occupancyPercentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs">{warehouse.occupancyPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {warehouse.inventory.length} product types
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-2">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 text-xs">
                          Pending: {warehouse.totalPending.toLocaleString()} kg
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                          Sold: {warehouse.totalSold.toLocaleString()} kg
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Value: ₹{(warehouse.totalValue / 100000).toFixed(1)}L
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                          QR: {warehouse.qrCodesGenerated} codes
                        </Badge>
                        <div className="text-xs text-muted-foreground font-mono">
                          {warehouse.qr_code_id}
                        </div>
                        <div className="text-xs text-purple-600">
                          Blockchain verified
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        {warehouse.predictiveData?.high_demand_crops.slice(0, 2).map((prediction, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="font-medium">{prediction.crop}</span>
                            <div className="text-muted-foreground">
                              Demand: {prediction.predicted_demand_kg.toLocaleString()}kg
                            </div>
                            <div className={`text-xs ${
                              prediction.price_trend === 'increasing' ? 'text-green-600' : 
                              prediction.price_trend === 'decreasing' ? 'text-red-600' : 'text-blue-600'
                            }`}>
                              {prediction.price_trend} ({prediction.confidence}% confidence)
                            </div>
                          </div>
                        )) || <div className="text-xs text-muted-foreground">No predictions available</div>}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs h-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateQR(warehouse);
                          }}
                        >
                          <QrCode className="w-3 h-3 mr-1" />
                          QR
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs h-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallSupport('warehouse');
                          }}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs h-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            onWarehouseSelect(warehouse);
                          }}
                        >
                          <FileEdit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredWarehouses.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No warehouses found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code Generation Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate QR Code</DialogTitle>
            <DialogDescription>
              Generate QR codes for warehouse products and batches
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedWarehouseForQR && (
              <div>
                <h4 className="font-medium mb-2">Warehouse: {selectedWarehouseForQR.warehouse_id}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedWarehouseForQR.inventory.map((item) => (
                    <div key={item.item_id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.batch_id}</div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleGenerateQR(selectedWarehouseForQR, item)}
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        Generate
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-center p-8 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <QrCode className="w-16 h-16 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">QR Code will appear here</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Call Support Dialog */}
      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>
              Connect with Odisha warehouse support services
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {Object.entries(odishaCallSupport).map(([key, number]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium capitalize">{key.replace('_', ' ')}</div>
                  <div className="text-sm text-muted-foreground">{number}</div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => {
                    toast.success(`Calling ${number}...`);
                    setCallDialogOpen(false);
                  }}
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}