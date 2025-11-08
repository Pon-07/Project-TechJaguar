import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { TrackingRoute } from '../../data/tracking';
import { TrackingTimeline } from './TrackingTimeline';

interface TrackingOverviewProps {
  trackingData: TrackingRoute[];
  onTrackingSelect?: (trackingId: string) => void;
  selectedTracking?: string;
  viewMode?: 'farmer' | 'warehouse' | 'consumer';
}

export function TrackingOverview({ 
  trackingData, 
  onTrackingSelect, 
  selectedTracking,
  viewMode = 'farmer'
}: TrackingOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredData = trackingData.filter(route => {
    const matchesSearch = searchQuery === '' || 
      route.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.tracking_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.farmer.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || route.overall_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    const stats = {
      total: trackingData.length,
      in_transit: trackingData.filter(r => r.overall_status === 'in_transit_to_warehouse' || r.overall_status === 'out_for_delivery').length,
      in_warehouse: trackingData.filter(r => r.overall_status === 'in_warehouse').length,
      delivered: trackingData.filter(r => r.overall_status === 'delivered').length,
      delayed: trackingData.filter(r => r.overall_status === 'delayed').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  const getViewModeTitle = () => {
    switch (viewMode) {
      case 'farmer': return 'My Crop Shipments';
      case 'warehouse': return 'Incoming Shipments';
      case 'consumer': return 'My Orders';
      default: return 'Tracking Overview';
    }
  };

  const getViewModeDescription = () => {
    switch (viewMode) {
      case 'farmer': return 'Track your crops from farm to consumer';
      case 'warehouse': return 'Monitor incoming and outgoing shipments';
      case 'consumer': return 'Track your orders from farm to doorstep';
      default: return 'Live tracking overview';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{getViewModeTitle()}</h2>
          <p className="text-muted-foreground">{getViewModeDescription()}</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Live Tracking
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-semibold">{stats.total}</p>
                </div>
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Transit</p>
                  <p className="text-2xl font-semibold text-yellow-600">{stats.in_transit}</p>
                </div>
                <Truck className="w-5 h-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Warehouse</p>
                  <p className="text-2xl font-semibold text-blue-600">{stats.in_warehouse}</p>
                </div>
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-semibold text-green-600">{stats.delivered}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delayed</p>
                  <p className="text-2xl font-semibold text-red-600">{stats.delayed}</p>
                </div>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by product, tracking ID, or farmer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'in_transit_to_warehouse' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('in_transit_to_warehouse')}
          >
            In Transit
          </Button>
          <Button
            variant={statusFilter === 'in_warehouse' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('in_warehouse')}
          >
            In Warehouse
          </Button>
          <Button
            variant={statusFilter === 'delivered' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('delivered')}
          >
            Delivered
          </Button>
        </div>
      </div>

      {/* Tracking List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.map((route, index) => (
          <motion.div
            key={route.tracking_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`cursor-pointer ${selectedTracking === route.tracking_id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => onTrackingSelect?.(route.tracking_id)}
          >
            <TrackingTimeline trackingRoute={route} compact />
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No tracking data found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or check back later
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}