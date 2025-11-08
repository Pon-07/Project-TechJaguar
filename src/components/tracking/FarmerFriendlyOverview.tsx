import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  Truck, 
  Warehouse, 
  Home,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  User,
  Phone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { TrackingRoute } from '../../data/tracking';

interface FarmerFriendlyOverviewProps {
  trackingData: TrackingRoute[];
  onTrackingSelect?: (trackingId: string) => void;
  selectedTracking?: string;
  viewMode?: 'farmer' | 'warehouse' | 'consumer';
}

export function FarmerFriendlyOverview({ 
  trackingData, 
  onTrackingSelect, 
  selectedTracking,
  viewMode = 'farmer'
}: FarmerFriendlyOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = trackingData.filter(route => {
    const searchLower = searchQuery.toLowerCase();
    return searchQuery === '' || 
      route.product_name.toLowerCase().includes(searchLower) ||
      route.farmer.name.toLowerCase().includes(searchLower) ||
      route.vehicle.number.toLowerCase().includes(searchLower);
  });

  const getCropIcon = (productName: string) => {
    if (productName.toLowerCase().includes('rice') || productName.toLowerCase().includes('paddy')) return '🌾';
    if (productName.toLowerCase().includes('tomato')) return '🍅';
    if (productName.toLowerCase().includes('mango')) return '🥭';
    if (productName.toLowerCase().includes('turmeric')) return '🟡';
    if (productName.toLowerCase().includes('groundnut')) return '🥜';
    return '🌱';
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'delivered':
        return { 
          label: 'Delivered ✅', 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          message: 'Successfully delivered!'
        };
      case 'out_for_delivery':
        return { 
          label: 'Out for Delivery 📦', 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Truck,
          iconColor: 'text-blue-600',
          message: 'On the way to customer'
        };
      case 'in_warehouse':
        return { 
          label: 'Stored 🏬', 
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: Warehouse,
          iconColor: 'text-amber-600',
          message: 'Safely stored in warehouse'
        };
      case 'in_transit_to_warehouse':
        return { 
          label: 'On the Way 🚚', 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Truck,
          iconColor: 'text-yellow-600',
          message: 'Moving to warehouse'
        };
      case 'delayed':
        return { 
          label: 'Delayed ⚠️', 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          message: 'Delayed - will update soon'
        };
      default:
        return { 
          label: 'Processing ⏳', 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          iconColor: 'text-gray-600',
          message: 'Processing your order'
        };
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
    if (diffHours < 24) return `${diffHours} hours`;
    const days = Math.ceil(diffHours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  const getStats = () => {
    return {
      total: trackingData.length,
      onTheWay: trackingData.filter(r => r.overall_status === 'in_transit_to_warehouse' || r.overall_status === 'out_for_delivery').length,
      stored: trackingData.filter(r => r.overall_status === 'in_warehouse').length,
      delivered: trackingData.filter(r => r.overall_status === 'delivered').length,
    };
  };

  const stats = getStats();

  const getViewTitle = () => {
    switch (viewMode) {
      case 'farmer': return 'Your Crops';
      case 'warehouse': return 'Incoming Crops';
      case 'consumer': return 'Your Orders';
      default: return 'All Tracking';
    }
  };

  const getViewDescription = () => {
    switch (viewMode) {
      case 'farmer': return 'Track where your crops are right now';
      case 'warehouse': return 'See all crops coming to warehouses';
      case 'consumer': return 'Track your orders from farm to home';
      default: return 'Live tracking overview';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{getViewTitle()}</h2>
          <p className="text-muted-foreground">{getViewDescription()}</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 animate-pulse">
          🟢 Live
        </Badge>
      </div>

      {/* Simple Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
              <div className="text-lg">📦</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.onTheWay}</div>
              <div className="text-sm text-muted-foreground">On the Way</div>
              <div className="text-lg">🚚</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.stored}</div>
              <div className="text-sm text-muted-foreground">Stored</div>
              <div className="text-lg">🏬</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
              <div className="text-sm text-muted-foreground">Delivered</div>
              <div className="text-lg">✅</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search your crops, farmer name, or vehicle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tracking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((route, index) => {
          const statusInfo = getStatusInfo(route.overall_status);
          const isSelected = selectedTracking === route.tracking_id;
          
          return (
            <motion.div
              key={route.tracking_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`cursor-pointer transition-all duration-300 ${
                isSelected ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-102'
              }`}
              onClick={() => onTrackingSelect?.(route.tracking_id)}
            >
              <Card className="h-full">
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getCropIcon(route.product_name)}</div>
                      <div>
                        <h3 className="font-semibold">{route.product_name}</h3>
                        <p className="text-sm text-muted-foreground">{route.quantity}</p>
                      </div>
                    </div>
                    <Badge className={`${statusInfo.color} border text-xs`}>
                      {statusInfo.label}
                    </Badge>
                  </div>

                  {/* Farmer Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-green-500 text-white">
                        {route.farmer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{route.farmer.name}</span>
                    <span className="text-xs text-muted-foreground">• {route.farmer.taluk}</span>
                  </div>

                  {/* Current Status */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <statusInfo.icon className={`w-4 h-4 ${statusInfo.iconColor}`} />
                      <span className="text-sm font-medium">{statusInfo.message}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      📍 Currently at: {route.current_location.place_name}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="text-xs text-muted-foreground mb-1">Vehicle & Driver</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">🚚 {route.vehicle.number}</div>
                        <div className="text-xs text-muted-foreground">👨‍💼 {route.vehicle.driver_name}</div>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>

                  {/* ETA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">Expected Time</div>
                      <div className="text-sm font-medium">⏰ {formatETA(route.estimated_delivery)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Going to</div>
                      <div className="text-sm font-medium">
                        {route.consumer ? '🏠 Customer' : `🏬 ${route.warehouse.name}`}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>
                        {Math.round((route.checkpoints.filter(cp => cp.status === 'completed').length / route.checkpoints.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${(route.checkpoints.filter(cp => cp.status === 'completed').length / route.checkpoints.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Blockchain Badge */}
                  {route.checkpoints.some(cp => cp.blockchain_hash && cp.status === 'completed') && (
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        🔐 Blockchain Secured
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground mb-4">
            Try searching for something else or check back later
          </p>
          <Button 
            variant="outline" 
            onClick={() => setSearchQuery('')}
          >
            Clear Search
          </Button>
        </motion.div>
      )}
    </div>
  );
}