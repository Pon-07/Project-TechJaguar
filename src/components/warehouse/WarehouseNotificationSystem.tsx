import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  Truck, 
  CheckCircle, 
  X,
  Volume2,
  VolumeX,
  Settings,
  Filter,
  Clock,
  MapPin,
  BarChart3
} from 'lucide-react';
import { odishaWarehousesData } from '../../data/odishaWarehouses';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'stock_low' | 'product_arrival' | 'product_departure' | 'demand_high' | 'system_alert' | 'blockchain_update';
  title: string;
  message: string;
  warehouse_id?: string;
  district?: string;
  product?: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  action_required: boolean;
  auto_dismiss: boolean;
  duration?: number;
}

// Generate dynamic notifications based on Odisha warehouse data
const generateOdishaNotifications = (): Notification[] => {
  const notifications: Notification[] = [];
  const now = new Date();
  
  odishaWarehousesData.warehouses.forEach((warehouse, index) => {
    // Stock level notifications
    warehouse.inventory.forEach((item, itemIndex) => {
      const stockPercentage = (item.total_quantity_kg / 1000) / warehouse.capacity_tonnes;
      
      if (stockPercentage < 0.1) {
        notifications.push({
          id: `low-stock-${warehouse.warehouse_id}-${item.item_id}`,
          type: 'stock_low',
          title: 'Low Stock Alert',
          message: `${item.name} running low at ${warehouse.warehouse_id} (${warehouse.district}). Only ${item.total_quantity_kg}kg remaining.`,
          warehouse_id: warehouse.warehouse_id,
          district: warehouse.district,
          product: item.name,
          timestamp: new Date(now.getTime() - Math.random() * 2 * 60 * 60 * 1000).toISOString(),
          priority: stockPercentage < 0.05 ? 'critical' : 'high',
          is_read: Math.random() > 0.7,
          action_required: true,
          auto_dismiss: false
        });
      }
      
      // High demand predictions
      if (Math.random() > 0.8) {
        notifications.push({
          id: `demand-high-${warehouse.warehouse_id}-${item.item_id}`,
          type: 'demand_high',
          title: 'High Demand Prediction',
          message: `AI predicts 40% increase in demand for ${item.name} in ${warehouse.district} over next 7 days.`,
          warehouse_id: warehouse.warehouse_id,
          district: warehouse.district,
          product: item.name,
          timestamp: new Date(now.getTime() - Math.random() * 60 * 60 * 1000).toISOString(),
          priority: 'medium',
          is_read: Math.random() > 0.5,
          action_required: true,
          auto_dismiss: false
        });
      }
    });
    
    // Product arrival notifications
    if (Math.random() > 0.6) {
      const randomItem = warehouse.inventory[Math.floor(Math.random() * warehouse.inventory.length)];
      notifications.push({
        id: `arrival-${warehouse.warehouse_id}-${randomItem.item_id}-${Date.now()}`,
        type: 'product_arrival',
        title: 'Product Arrival',
        message: `${randomItem.name} shipment arrived at ${warehouse.warehouse_id}. Quantity: ${Math.floor(Math.random() * 5000) + 1000}kg`,
        warehouse_id: warehouse.warehouse_id,
        district: warehouse.district,
        product: randomItem.name,
        timestamp: new Date(now.getTime() - Math.random() * 30 * 60 * 1000).toISOString(),
        priority: 'low',
        is_read: Math.random() > 0.6,
        action_required: false,
        auto_dismiss: true,
        duration: 10000
      });
    }
    
    // Product departure notifications
    if (Math.random() > 0.7) {
      const randomItem = warehouse.inventory[Math.floor(Math.random() * warehouse.inventory.length)];
      notifications.push({
        id: `departure-${warehouse.warehouse_id}-${randomItem.item_id}-${Date.now()}`,
        type: 'product_departure',
        title: 'Product Dispatched',
        message: `${randomItem.name} shipment dispatched from ${warehouse.warehouse_id} to customer in Bhubaneswar.`,
        warehouse_id: warehouse.warehouse_id,
        district: warehouse.district,
        product: randomItem.name,
        timestamp: new Date(now.getTime() - Math.random() * 20 * 60 * 1000).toISOString(),
        priority: 'low',
        is_read: Math.random() > 0.4,
        action_required: false,
        auto_dismiss: true,
        duration: 8000
      });
    }
    
    // Blockchain updates
    if (Math.random() > 0.85) {
      const randomItem = warehouse.inventory[Math.floor(Math.random() * warehouse.inventory.length)];
      notifications.push({
        id: `blockchain-${warehouse.warehouse_id}-${randomItem.item_id}-${Date.now()}`,
        type: 'blockchain_update',
        title: 'Blockchain Transaction Verified',
        message: `Smart contract for ${randomItem.name} batch ${randomItem.batch_id} successfully verified on blockchain.`,
        warehouse_id: warehouse.warehouse_id,
        district: warehouse.district,
        product: randomItem.name,
        timestamp: new Date(now.getTime() - Math.random() * 45 * 60 * 1000).toISOString(),
        priority: 'medium',
        is_read: Math.random() > 0.5,
        action_required: false,
        auto_dismiss: true,
        duration: 12000
      });
    }
  });
  
  // System alerts
  if (Math.random() > 0.9) {
    notifications.push({
      id: `system-alert-${Date.now()}`,
      type: 'system_alert',
      title: 'System Update Available',
      message: 'New AI analytics features available. Update now to access enhanced demand prediction models.',
      timestamp: new Date(now.getTime() - Math.random() * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      is_read: false,
      action_required: true,
      auto_dismiss: false
    });
  }
  
  return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export function WarehouseNotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [floatingNotifications, setFloatingNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const { t } = useLanguage();

  useEffect(() => {
    // Initial load
    const initialNotifications = generateOdishaNotifications();
    setNotifications(initialNotifications);
    
    // Show recent unread notifications as floating
    const recentUnread = initialNotifications
      .filter(n => !n.is_read && new Date(n.timestamp).getTime() > Date.now() - 30 * 60 * 1000)
      .slice(0, 3);
    setFloatingNotifications(recentUnread);
  }, []);

  // Auto-generate new notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotifications = generateOdishaNotifications().slice(0, 3);
      
      setNotifications(prev => {
        const updated = [...newNotifications, ...prev].slice(0, 50); // Keep latest 50
        return updated;
      });
      
      // Add to floating notifications
      const newFloating = newNotifications.filter(n => !n.is_read);
      if (newFloating.length > 0) {
        setFloatingNotifications(prev => [...newFloating, ...prev].slice(0, 5));
        
        if (soundEnabled) {
          // Play notification sound (simulated)
          toast.success('New warehouse notification');
        }
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Auto-dismiss floating notifications
  useEffect(() => {
    floatingNotifications.forEach(notification => {
      if (notification.auto_dismiss && notification.duration) {
        setTimeout(() => {
          setFloatingNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, notification.duration);
      }
    });
  }, [floatingNotifications]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'stock_low': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'product_arrival': return <Package className="w-5 h-5 text-green-600" />;
      case 'product_departure': return <Truck className="w-5 h-5 text-blue-600" />;
      case 'demand_high': return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case 'blockchain_update': return <CheckCircle className="w-5 h-5 text-purple-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const typeMatch = selectedType === 'all' || notification.type === selectedType;
    const priorityMatch = selectedPriority === 'all' || notification.priority === selectedPriority;
    return typeMatch && priorityMatch;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.is_read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const dismissFloating = (id: string) => {
    setFloatingNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    toast.success('All notifications marked as read');
  };

  return (
    <>
      {/* Main Notification Panel */}
      <div className="space-y-6">
        {/* Header & Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Warehouse Notifications
              <Badge className="bg-red-500 text-white ml-auto">
                {unreadCount} unread
              </Badge>
              {criticalCount > 0 && (
                <Badge className="bg-red-600 text-white animate-pulse">
                  {criticalCount} critical
                </Badge>
              )}
            </CardTitle>
            <p className="text-muted-foreground">
              Real-time alerts for stock levels, shipments, and demand predictions across Odisha
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select 
                  className="border rounded px-3 py-1"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="stock_low">Stock Alerts</option>
                  <option value="product_arrival">Arrivals</option>
                  <option value="product_departure">Departures</option>
                  <option value="demand_high">Demand Alerts</option>
                  <option value="blockchain_update">Blockchain</option>
                  <option value="system_alert">System</option>
                </select>
                
                <select 
                  className="border rounded px-3 py-1"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Sound On
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 mr-2" />
                      Sound Off
                    </>
                  )}
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark All Read
                </Button>
                <Badge variant="outline">
                  {filteredNotifications.length} notifications
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-muted-foreground mb-2">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    All caught up! New notifications will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`font-medium ${!notification.is_read ? 'font-bold' : ''}`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(notification.timestamp).toLocaleString('en-IN')}
                                </div>
                                {notification.district && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {notification.district}
                                  </div>
                                )}
                                {notification.warehouse_id && (
                                  <div className="flex items-center gap-1">
                                    <Package className="w-3 h-3" />
                                    {notification.warehouse_id}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <Badge className={`text-xs ${
                                notification.priority === 'critical' ? 'bg-red-500 text-white' :
                                notification.priority === 'high' ? 'bg-orange-500 text-white' :
                                notification.priority === 'medium' ? 'bg-blue-500 text-white' :
                                'bg-gray-500 text-white'
                              }`}>
                                {notification.priority.toUpperCase()}
                              </Badge>
                              
                              {notification.action_required && (
                                <Badge variant="outline" className="text-xs">
                                  Action Required
                                </Badge>
                              )}
                              
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        <AnimatePresence>
          {floatingNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className={`w-80 rounded-lg border-l-4 shadow-lg bg-white p-4 ${getPriorityColor(notification.priority)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      {notification.district && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{notification.district}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={() => dismissFloating(notification.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}