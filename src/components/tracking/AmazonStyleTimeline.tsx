import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  Shield,
  User,
  Warehouse,
  Home,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { TrackingRoute } from '../../data/tracking';

interface AmazonStyleTimelineProps {
  trackingRoute: TrackingRoute;
  viewMode?: 'farmer' | 'warehouse' | 'consumer';
}

export function AmazonStyleTimeline({ trackingRoute, viewMode = 'farmer' }: AmazonStyleTimelineProps) {
  const getCropIcon = (productName: string) => {
    if (productName.toLowerCase().includes('rice') || productName.toLowerCase().includes('paddy')) return '🌾';
    if (productName.toLowerCase().includes('tomato')) return '🍅';
    if (productName.toLowerCase().includes('mango')) return '🥭';
    if (productName.toLowerCase().includes('turmeric')) return '🟡';
    if (productName.toLowerCase().includes('groundnut')) return '🥜';
    return '🌱';
  };

  const getStepIcon = (checkpoint: any, isActive: boolean, isCompleted: boolean) => {
    if (checkpoint.blockchain_hash) {
      return <Shield className={`w-5 h-5 ${isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'}`} />;
    }
    
    switch (checkpoint.name.toLowerCase()) {
      case 'harvested':
        return <Package className={`w-5 h-5 ${isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'}`} />;
      case 'loaded for transport':
      case 'in transit':
      case 'out for delivery':
        return <Truck className={`w-5 h-5 ${isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'}`} />;
      case 'warehouse arrival':
      case 'warehouse storage':
      case 'at warehouse gate':
        return <Warehouse className={`w-5 h-5 ${isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'}`} />;
      case 'delivered':
        return <Home className={`w-5 h-5 ${isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'}`} />;
      default:
        return <Clock className={`w-5 h-5 ${isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'}`} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === date.toDateString();
    
    if (isToday) {
      return `Today, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isYesterday) {
      return `Yesterday, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
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
    return `${diffHours} hours`;
  };

  const getOverallStatus = () => {
    switch (trackingRoute.overall_status) {
      case 'delivered':
        return { 
          label: 'Delivered', 
          icon: '✅', 
          color: 'bg-green-100 text-green-800 border-green-200',
          message: `Your ${trackingRoute.product_name} has been delivered successfully!`
        };
      case 'out_for_delivery':
        return { 
          label: 'Out for Delivery', 
          icon: '📦', 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          message: `Your ${trackingRoute.product_name} is out for delivery. ETA: ${formatETA(trackingRoute.estimated_delivery)}`
        };
      case 'in_warehouse':
        return { 
          label: 'Stored', 
          icon: '🏬', 
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          message: `Your ${trackingRoute.product_name} is safely stored at ${trackingRoute.warehouse.name}`
        };
      case 'in_transit_to_warehouse':
        return { 
          label: 'On the Way', 
          icon: '🚚', 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          message: `Your ${trackingRoute.product_name} is on the way to ${trackingRoute.warehouse.name}. ETA: ${formatETA(trackingRoute.estimated_delivery)}`
        };
      case 'delayed':
        return { 
          label: 'Delayed', 
          icon: '⚠️', 
          color: 'bg-red-100 text-red-800 border-red-200',
          message: `Your ${trackingRoute.product_name} delivery is delayed. We'll update you soon.`
        };
      default:
        return { 
          label: 'Processing', 
          icon: '⏳', 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          message: `Your ${trackingRoute.product_name} is being processed`
        };
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getCropIcon(trackingRoute.product_name)}</div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {trackingRoute.product_name}
                <Badge className={`${overallStatus.color} border`}>
                  {overallStatus.icon} {overallStatus.label}
                </Badge>
              </CardTitle>
              <div className="text-sm text-muted-foreground mt-1">
                {trackingRoute.quantity} • ID: {trackingRoute.tracking_id}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Expected</div>
            <div className="font-medium">{formatTimestamp(trackingRoute.estimated_delivery)}</div>
          </div>
        </div>

        {/* Amazon-style Status Message */}
        <div className={`mt-4 p-4 rounded-lg border ${overallStatus.color}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-lg">{overallStatus.icon}</div>
            <span className="font-medium">{overallStatus.message}</span>
          </div>
          
          {viewMode === 'consumer' && trackingRoute.consumer && (
            <div className="text-sm opacity-80">
              Delivering to: {trackingRoute.consumer.delivery_address}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Amazon-style Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-gray-300" />

          {/* Timeline Steps */}
          <div className="space-y-8">
            {trackingRoute.checkpoints.map((checkpoint, index) => {
              const isCompleted = checkpoint.status === 'completed';
              const isActive = checkpoint.status === 'active';
              const isPending = checkpoint.status === 'pending';
              
              return (
                <motion.div
                  key={checkpoint.id}
                  className="relative flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  {/* Step Icon */}
                  <div className={`
                    relative z-10 w-12 h-12 rounded-full border-4 flex items-center justify-center
                    ${isCompleted ? 'bg-green-500 border-green-400' : 
                      isActive ? 'bg-blue-500 border-blue-400 animate-pulse' :
                      'bg-gray-300 border-gray-200'}
                    shadow-lg transition-all duration-300
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        {getStepIcon(checkpoint, isActive, isCompleted)}
                      </motion.div>
                    ) : (
                      getStepIcon(checkpoint, isActive, isCompleted)
                    )}
                    
                    {/* Blockchain Badge */}
                    {checkpoint.blockchain_hash && isCompleted && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Shield className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0 pb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-medium ${isCompleted ? 'text-green-800' : isActive ? 'text-blue-800' : 'text-gray-600'}`}>
                        {checkpoint.name}
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        {isCompleted ? formatTimestamp(checkpoint.timestamp) :
                         isActive ? 'In Progress' :
                         isPending && checkpoint.estimated_duration ? `ETA: ${checkpoint.estimated_duration}h` : 'Pending'}
                      </div>
                    </div>
                    
                    <p className={`text-sm ${isCompleted ? 'text-green-700' : isActive ? 'text-blue-700' : 'text-gray-500'} mb-2`}>
                      {checkpoint.description}
                    </p>
                    
                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{checkpoint.location.taluk}</span>
                    </div>

                    {/* Blockchain Hash */}
                    {checkpoint.blockchain_hash && isCompleted && (
                      <div className="mt-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Blockchain Verified: {checkpoint.blockchain_hash.slice(0, 10)}...
                        </Badge>
                      </div>
                    )}

                    {/* Active Status Indicator */}
                    {isActive && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-xs text-blue-600 font-medium">Live Update</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-green-600" />
              Farmer Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs bg-green-500 text-white">
                    {trackingRoute.farmer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{trackingRoute.farmer.name}</span>
              </div>
              <div className="text-muted-foreground">📍 {trackingRoute.farmer.taluk}, Tamil Nadu</div>
              <div className="text-muted-foreground">🆔 {trackingRoute.farmer.uzhavar_pin}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              Vehicle & Driver
            </h4>
            <div className="space-y-2 text-sm">
              <div>🚚 {trackingRoute.vehicle.number}</div>
              <div>👨‍💼 {trackingRoute.vehicle.driver_name}</div>
              <div className="text-muted-foreground">📞 {trackingRoute.vehicle.driver_contact}</div>
            </div>
          </div>
        </div>

        {/* Consumer Information (if applicable) */}
        {trackingRoute.consumer && viewMode === 'consumer' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Home className="w-4 h-4 text-green-600" />
              Delivery Information
            </h4>
            <div className="space-y-1 text-sm">
              <div>📦 Order ID: {trackingRoute.consumer.order_id}</div>
              <div>📍 {trackingRoute.consumer.delivery_address}</div>
              <div className="text-green-700 font-medium mt-2">
                💚 By buying directly from farmers, you're supporting sustainable agriculture!
              </div>
            </div>
          </div>
        )}

        {/* Current Status */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="font-medium text-blue-800">Current Location</span>
          </div>
          <div className="text-sm text-blue-700">
            📍 {trackingRoute.current_location.place_name}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Last updated: {formatTimestamp(trackingRoute.updated_at)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}