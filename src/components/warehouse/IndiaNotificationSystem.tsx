import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Bell, 
  CheckCircle, 
  Package, 
  Truck, 
  AlertTriangle, 
  TrendingUp, 
  QrCode,
  Factory,
  Zap,
  X,
  Volume2,
  VolumeX,
  Settings,
  Eye,
  Clock,
  MapPin
} from 'lucide-react';
import { indiaWarehousesData } from '../../data/indiaWideWarehouseData';
import { getCropDisplay } from '../../data/cropImages';
import { toast } from 'sonner@2.0.3';

interface Notification {
  id: string;
  type: 'qr_generated' | 'product_dispatched' | 'product_arrived' | 'low_stock' | 'high_demand' | 'system_alert';
  title: string;
  message: string;
  state: string;
  district: string;
  warehouse: string;
  cropImage?: string;
  productName?: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
  metadata?: {
    qrId?: string;
    trackingId?: string;
    stockLevel?: number;
    demandIncrease?: number;
    blockchainTx?: string;
  };
}

const NOTIFICATION_TYPES = {
  qr_generated: {
    icon: QrCode,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    glowColor: 'shadow-purple-500/50',
    title: 'QR Code Generated'
  },
  product_dispatched: {
    icon: Truck,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    glowColor: 'shadow-blue-500/50',
    title: 'Product Dispatched'
  },
  product_arrived: {
    icon: Package,
    color: 'text-green-600 bg-green-50 border-green-200',
    glowColor: 'shadow-green-500/50',
    title: 'Product Arrived'
  },
  low_stock: {
    icon: AlertTriangle,
    color: 'text-red-600 bg-red-50 border-red-200',
    glowColor: 'shadow-red-500/50',
    title: 'Low Stock Alert'
  },
  high_demand: {
    icon: TrendingUp,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    glowColor: 'shadow-orange-500/50',
    title: 'High Demand Alert'
  },
  system_alert: {
    icon: Bell,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    glowColor: 'shadow-indigo-500/50',
    title: 'System Alert'
  }
};

// Generate realistic notifications from warehouse data
function generateNotifications(): Notification[] {
  const notifications: Notification[] = [];
  const types: (keyof typeof NOTIFICATION_TYPES)[] = ['qr_generated', 'product_dispatched', 'product_arrived', 'low_stock', 'high_demand'];
  
  // Generate notifications for different warehouses
  indiaWarehousesData.warehouses.slice(0, 30).forEach((warehouse, index) => {
    const type = types[index % types.length];
    const inventory = warehouse.inventory[0];
    const timeOffset = Math.floor(Math.random() * 24 * 60 * 60 * 1000); // Random time within last 24 hours
    
    let notification: Notification;
    
    switch (type) {
      case 'qr_generated':
        notification = {
          id: `qr_${index}`,
          type: 'qr_generated',
          title: '✅ QR Code Generated',
          message: `New QR code created for ${inventory?.name || 'Product'} from ${warehouse.name}`,
          state: warehouse.state,
          district: warehouse.district,
          warehouse: warehouse.name,
          cropImage: getCropDisplay(inventory?.name || 'Product').emoji,
          productName: inventory?.name || 'Product',
          timestamp: new Date(Date.now() - timeOffset),
          read: Math.random() > 0.3,
          priority: 'medium',
          actionRequired: false,
          metadata: {
            qrId: `QR-${warehouse.state.substring(0,2).toUpperCase()}${warehouse.district.substring(0,2).toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
            blockchainTx: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`
          }
        };
        break;
        
      case 'product_dispatched':
        notification = {
          id: `dispatch_${index}`,
          type: 'product_dispatched',
          title: '🚚 Product Dispatched',
          message: `${inventory?.name || 'Product'} shipment dispatched from ${warehouse.name} to customer`,
          state: warehouse.state,
          district: warehouse.district,
          warehouse: warehouse.name,
          cropImage: getCropDisplay(inventory?.name || 'Product').emoji,
          productName: inventory?.name || 'Product',
          timestamp: new Date(Date.now() - timeOffset),
          read: Math.random() > 0.4,
          priority: 'medium',
          actionRequired: false,
          metadata: {
            trackingId: `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            blockchainTx: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`
          }
        };
        break;
        
      case 'product_arrived':
        notification = {
          id: `arrival_${index}`,
          type: 'product_arrived',
          title: '📦 Product Arrived',
          message: `${inventory?.name || 'Product'} delivery confirmed at ${warehouse.name}`,
          state: warehouse.state,
          district: warehouse.district,
          warehouse: warehouse.name,
          cropImage: getCropDisplay(inventory?.name || 'Product').emoji,
          productName: inventory?.name || 'Product',
          timestamp: new Date(Date.now() - timeOffset),
          read: Math.random() > 0.5,
          priority: 'low',
          actionRequired: false,
          metadata: {
            trackingId: `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
          }
        };
        break;
        
      case 'low_stock':
        notification = {
          id: `stock_${index}`,
          type: 'low_stock',
          title: '⚠️ Low Stock Alert',
          message: `Critical stock level for ${inventory?.name || 'Product'} at ${warehouse.name} - ${warehouse.district}`,
          state: warehouse.state,
          district: warehouse.district,
          warehouse: warehouse.name,
          cropImage: getCropDisplay(inventory?.name || 'Product').emoji,
          productName: inventory?.name || 'Product',
          timestamp: new Date(Date.now() - timeOffset),
          read: Math.random() > 0.6,
          priority: 'high',
          actionRequired: true,
          metadata: {
            stockLevel: Math.floor(warehouse.current_occupancy_tonnes / warehouse.capacity_tonnes * 100)
          }
        };
        break;
        
      case 'high_demand':
        notification = {
          id: `demand_${index}`,
          type: 'high_demand',
          title: '📊 High Demand Alert',
          message: `Increased demand detected for ${inventory?.name || 'Product'} in ${warehouse.state} region`,
          state: warehouse.state,
          district: warehouse.district,
          warehouse: warehouse.name,
          cropImage: getCropDisplay(inventory?.name || 'Product').emoji,
          productName: inventory?.name || 'Product',
          timestamp: new Date(Date.now() - timeOffset),
          read: Math.random() > 0.7,
          priority: 'medium',
          actionRequired: true,
          metadata: {
            demandIncrease: Math.floor(Math.random() * 30) + 15
          }
        };
        break;
        
      default:
        return;
    }
    
    notifications.push(notification);
  });
  
  // Sort by timestamp (newest first)
  return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function IndiaNotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [glowingNotifications, setGlowingNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    const initialNotifications = generateNotifications();
    setNotifications(initialNotifications);
    
    // Start glow animation for recent notifications
    const recentIds = initialNotifications
      .filter(n => Date.now() - n.timestamp.getTime() < 5 * 60 * 1000) // Last 5 minutes
      .map(n => n.id);
    setGlowingNotifications(new Set(recentIds));
    
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const newNotification = generateNewNotification();
      if (newNotification) {
        setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep max 50 notifications
        setGlowingNotifications(prev => new Set([...prev, newNotification.id]));
        
        // Show toast notification
        if (soundEnabled) {
          toast.success(`${newNotification.title}`, {
            description: newNotification.message,
            duration: 4000
          });
        }
        
        // Stop glowing after 10 seconds
        setTimeout(() => {
          setGlowingNotifications(prev => {
            const newSet = new Set(prev);
            newSet.delete(newNotification.id);
            return newSet;
          });
        }, 10000);
      }
    }, 8000); // New notification every 8 seconds
    
    return () => clearInterval(interval);
  }, [soundEnabled]);

  const generateNewNotification = (): Notification | null => {
    const types: (keyof typeof NOTIFICATION_TYPES)[] = ['qr_generated', 'product_dispatched', 'product_arrived', 'low_stock', 'high_demand'];
    const type = types[Math.floor(Math.random() * types.length)];
    const warehouse = indiaWarehousesData.warehouses[Math.floor(Math.random() * indiaWarehousesData.warehouses.length)];
    const inventory = warehouse.inventory[0];
    
    if (!inventory) return null;
    
    const id = `${type}_${Date.now()}`;
    
    const baseNotification = {
      id,
      state: warehouse.state,
      district: warehouse.district,
      warehouse: warehouse.name,
      cropImage: getCropDisplay(inventory.name).emoji,
      productName: inventory.name,
      timestamp: new Date(),
      read: false,
      metadata: {
        qrId: `QR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        trackingId: `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        blockchainTx: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`
      }
    };
    
    switch (type) {
      case 'qr_generated':
        return {
          ...baseNotification,
          type: 'qr_generated',
          title: '✅ New QR Generated',
          message: `QR code created for ${inventory.name} at ${warehouse.name}`,
          priority: 'medium',
          actionRequired: false
        };
      case 'product_dispatched':
        return {
          ...baseNotification,
          type: 'product_dispatched',
          title: '🚚 Dispatch Complete',
          message: `${inventory.name} dispatched from ${warehouse.district}`,
          priority: 'medium',
          actionRequired: false
        };
      case 'low_stock':
        return {
          ...baseNotification,
          type: 'low_stock',
          title: '⚠️ Stock Critical',
          message: `Urgent: ${inventory.name} stock below 20% at ${warehouse.name}`,
          priority: 'high',
          actionRequired: true,
          metadata: {
            ...baseNotification.metadata,
            stockLevel: Math.floor(Math.random() * 20) + 5
          }
        };
      default:
        return null;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setGlowingNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const filteredNotifications = notifications.filter(n => 
    filterType === 'all' || n.type === filterType
  );

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.priority === 'high' || n.priority === 'critical').length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const diff = Date.now() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Bell className="w-8 h-8" />
            India Warehouse Notification Center
          </CardTitle>
          <p className="text-orange-100">
            Real-time alerts and notifications from warehouses across all Indian states
          </p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{notifications.length}</div>
              <div className="text-sm text-orange-100">Total Notifications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{unreadCount}</div>
              <div className="text-sm text-orange-100">Unread</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{criticalCount}</div>
              <div className="text-sm text-orange-100">Critical Alerts</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            variant="outline" 
            size="sm"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </Button>
          <Button 
            onClick={() => setShowAll(!showAll)} 
            variant="outline" 
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showAll ? 'Show Recent' : 'Show All'}
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {['all', 'qr_generated', 'product_dispatched', 'low_stock', 'high_demand'].map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(type)}
            >
              {type === 'all' ? 'All' : NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES]?.title || type}
            </Button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {(showAll ? filteredNotifications : filteredNotifications.slice(0, 12)).map((notification) => {
            const typeConfig = NOTIFICATION_TYPES[notification.type];
            const Icon = typeConfig.icon;
            const isGlowing = glowingNotifications.has(notification.id);
            
            return (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  boxShadow: isGlowing ? `0 0 20px ${typeConfig.glowColor}` : "0 1px 3px rgba(0,0,0,0.1)"
                }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                } ${isGlowing ? 'animate-pulse' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon with Priority Indicator */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${typeConfig.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getPriorityColor(notification.priority)}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {notification.cropImage && <span className="text-lg">{notification.cropImage}</span>}
                          {notification.title}
                          {notification.actionRequired && (
                            <Badge className="bg-red-100 text-red-600 text-xs">Action Required</Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{formatTimeAgo(notification.timestamp)}</span>
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Location and Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {notification.district}, {notification.state}
                      </div>
                      <div className="flex items-center gap-1">
                        <Factory className="w-3 h-3" />
                        {notification.warehouse}
                      </div>
                      {notification.metadata?.qrId && (
                        <div className="flex items-center gap-1">
                          <QrCode className="w-3 h-3" />
                          {notification.metadata.qrId}
                        </div>
                      )}
                      {notification.metadata?.trackingId && (
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {notification.metadata.trackingId}
                        </div>
                      )}
                    </div>
                    
                    {/* Additional Info */}
                    {notification.metadata && (
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <div className="flex gap-4 text-xs">
                          {notification.metadata.stockLevel && (
                            <span className="text-red-600">Stock: {notification.metadata.stockLevel}%</span>
                          )}
                          {notification.metadata.demandIncrease && (
                            <span className="text-orange-600">Demand: +{notification.metadata.demandIncrease}%</span>
                          )}
                          {notification.metadata.blockchainTx && (
                            <span className="font-mono text-gray-500">Tx: {notification.metadata.blockchainTx}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredNotifications.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
              <p className="text-muted-foreground">
                No notifications found for the selected filter
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}