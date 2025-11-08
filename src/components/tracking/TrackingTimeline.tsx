import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  Zap, 
  AlertCircle,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { TrackingRoute, TrackingCheckpoint } from '../../data/tracking';

interface TrackingTimelineProps {
  trackingRoute: TrackingRoute;
  compact?: boolean;
}

export function TrackingTimeline({ trackingRoute, compact = false }: TrackingTimelineProps) {
  const getCheckpointIcon = (checkpoint: TrackingCheckpoint, index: number) => {
    if (checkpoint.blockchain_hash) {
      return Shield;
    }
    
    switch (checkpoint.name.toLowerCase()) {
      case 'harvested': return Package;
      case 'loaded for transport': return Truck;
      case 'warehouse arrival': return MapPin;
      case 'delivered': return CheckCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 border-green-400';
      case 'active': return 'bg-yellow-500 border-yellow-400 animate-pulse';
      case 'delayed': return 'bg-red-500 border-red-400 animate-pulse';
      default: return 'bg-gray-400 border-gray-300';
    }
  };

  const getProgressPercentage = () => {
    const completedCheckpoints = trackingRoute.checkpoints.filter(cp => cp.status === 'completed').length;
    return (completedCheckpoints / trackingRoute.checkpoints.length) * 100;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getOverallStatusDetails = () => {
    switch (trackingRoute.overall_status) {
      case 'harvested':
        return { label: 'Harvested', color: 'bg-green-100 text-green-800', icon: Package };
      case 'in_transit_to_warehouse':
        return { label: 'In Transit to Warehouse', color: 'bg-yellow-100 text-yellow-800', icon: Truck };
      case 'in_warehouse':
        return { label: 'In Warehouse', color: 'bg-blue-100 text-blue-800', icon: MapPin };
      case 'out_for_delivery':
        return { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800', icon: Truck };
      case 'delivered':
        return { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'delayed':
        return { label: 'Delayed', color: 'bg-red-100 text-red-800', icon: AlertCircle };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const statusDetails = getOverallStatusDetails();

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(trackingRoute.checkpoints.find(cp => cp.status === 'active')?.status || 'pending').replace('border-', 'bg-').split(' ')[0]}`} />
              <span className="font-medium text-sm">{trackingRoute.product_name}</span>
            </div>
            <Badge className={statusDetails.color} variant="outline">
              {statusDetails.label}
            </Badge>
          </div>
          <Progress value={getProgressPercentage()} className="h-2 mb-2" />
          <div className="text-xs text-muted-foreground">
            ETA: {formatTimestamp(trackingRoute.estimated_delivery).date} at {formatTimestamp(trackingRoute.estimated_delivery).time}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            Tracking Timeline
          </CardTitle>
          <Badge className={statusDetails.color} variant="outline">
            <statusDetails.icon className="w-3 h-3 mr-1" />
            {statusDetails.label}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {trackingRoute.product_name} • {trackingRoute.quantity} • ID: {trackingRoute.tracking_id}
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Progress</span>
            <span>{getProgressPercentage().toFixed(0)}% Complete</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-3" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-green-500 via-yellow-500 to-gray-300" />

          {/* Checkpoints */}
          <div className="space-y-6">
            {trackingRoute.checkpoints.map((checkpoint, index) => {
              const IconComponent = getCheckpointIcon(checkpoint, index);
              const timestamp = formatTimestamp(checkpoint.timestamp);
              
              return (
                <motion.div
                  key={checkpoint.id}
                  className="relative flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  {/* Checkpoint Icon */}
                  <div className={`
                    relative z-10 w-12 h-12 rounded-full border-4 flex items-center justify-center
                    ${getStatusColor(checkpoint.status)}
                    shadow-lg
                  `}>
                    <IconComponent className="w-5 h-5 text-white" />
                    
                    {/* Blockchain Badge */}
                    {checkpoint.blockchain_hash && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Zap className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Checkpoint Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{checkpoint.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        {timestamp.date} • {timestamp.time}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {checkpoint.description}
                    </p>
                    
                    {/* Location */}
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{checkpoint.location.taluk}</span>
                    </div>

                    {/* Blockchain Hash */}
                    {checkpoint.blockchain_hash && (
                      <div className="mt-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Blockchain: {checkpoint.blockchain_hash}
                        </Badge>
                      </div>
                    )}

                    {/* Estimated Duration */}
                    {checkpoint.estimated_duration && checkpoint.status === 'pending' && (
                      <div className="mt-2">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          ETA: {checkpoint.estimated_duration}h
                        </Badge>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Vehicle and Farmer Info */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Vehicle Details</h5>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Vehicle: {trackingRoute.vehicle.number}</div>
                <div>Driver: {trackingRoute.vehicle.driver_name}</div>
                <div>Contact: {trackingRoute.vehicle.driver_contact}</div>
              </div>
            </div>
            <div>
              <h5 className="font-medium mb-2">Farmer Details</h5>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Name: {trackingRoute.farmer.name}</div>
                <div>Uzhavar PIN: {trackingRoute.farmer.uzhavar_pin}</div>
                <div>Taluk: {trackingRoute.farmer.taluk}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Location */}
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium text-green-800">Current Location</span>
          </div>
          <div className="text-sm text-green-700">
            {trackingRoute.current_location.place_name}
          </div>
          <div className="text-xs text-green-600 mt-1">
            Last updated: {new Date(trackingRoute.updated_at).toLocaleString('en-IN')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}