import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Package,
  TrendingUp,
  Clock,
  X,
  Settings,
  Users,
  QrCode,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { warehousesData, Warehouse as WarehouseType } from '../../data/warehouses';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface NotificationsAlertsProps {
  selectedWarehouse?: WarehouseType;
  onNotificationAction?: (action: string, data: any) => void;
}

interface Notification {
  id: string;
  type: 'low_stock' | 'new_arrival' | 'qr_generated' | 'high_demand' | 'price_alert' | 'quality_check';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  warehouse_id: string;
  data?: any;
  read: boolean;
  actionRequired: boolean;
}

// Generate dummy notifications
const generateNotifications = (warehouse: WarehouseType): Notification[] => {
  const notifications: Notification[] = [];
  const now = new Date();

  // Low stock alerts
  warehouse.inventory.forEach((item, index) => {
    if (Math.random() > 0.7) { // 30% chance of low stock
      notifications.push({
        id: `low_stock_${item.item_id}`,
        type: 'low_stock',
        title: 'Low Stock Alert',
        message: `${item.name} stock is running low (${(item.total_quantity_kg / 1000).toFixed(1)}t remaining)`,
        timestamp: new Date(now.getTime() - Math.random() * 3600000),
        priority: item.total_quantity_kg < 5000 ? 'urgent' : 'high',
        warehouse_id: warehouse.warehouse_id,
        data: { item, threshold: 5000 },
        read: Math.random() > 0.6,
        actionRequired: true
      });
    }
  });

  // New arrivals
  if (Math.random() > 0.5) {
    notifications.push({
      id: `new_arrival_${Date.now()}`,
      type: 'new_arrival',
      title: 'New Product Arrival',
      message: `Fresh batch of ${warehouse.inventory[0].name} arrived from ${warehouse.inventory[0].farmer_count} farmers`,
      timestamp: new Date(now.getTime() - Math.random() * 7200000),
      priority: 'medium',
      warehouse_id: warehouse.warehouse_id,
      data: { quantity: 5000, farmers: warehouse.inventory[0].farmer_count },
      read: Math.random() > 0.7,
      actionRequired: false
    });
  }

  // QR generated
  warehouse.inventory.forEach((item) => {
    if (Math.random() > 0.8) { // 20% chance
      notifications.push({
        id: `qr_${item.item_id}_${Date.now()}`,
        type: 'qr_generated',
        title: 'QR Code Generated',
        message: `QR code successfully generated for ${item.name} batch ${item.batch_id}`,
        timestamp: new Date(now.getTime() - Math.random() * 1800000),
        priority: 'low',
        warehouse_id: warehouse.warehouse_id,
        data: { item, qr_id: `QR_${item.batch_id}` },
        read: Math.random() > 0.5,
        actionRequired: false
      });
    }
  });

  // High demand predictions
  if (Math.random() > 0.6) {
    const randomItem = warehouse.inventory[Math.floor(Math.random() * warehouse.inventory.length)];
    notifications.push({
      id: `high_demand_${randomItem.item_id}`,
      type: 'high_demand',
      title: 'High Demand Predicted',
      message: `AI predicts 25% increase in demand for ${randomItem.name} this week`,
      timestamp: new Date(now.getTime() - Math.random() * 5400000),
      priority: 'medium',
      warehouse_id: warehouse.warehouse_id,
      data: { item: randomItem, increase: 25, timeframe: '7 days' },
      read: Math.random() > 0.8,
      actionRequired: true
    });
  }

  // Price alerts
  if (Math.random() > 0.7) {
    const randomItem = warehouse.inventory[Math.floor(Math.random() * warehouse.inventory.length)];
    notifications.push({
      id: `price_alert_${randomItem.item_id}`,
      type: 'price_alert',
      title: 'Price Optimization Opportunity',
      message: `Optimize ${randomItem.name} price to ₹${(randomItem.community_price_per_kg * 1.05).toFixed(2)}/kg for +12% revenue`,
      timestamp: new Date(now.getTime() - Math.random() * 10800000),
      priority: 'medium',
      warehouse_id: warehouse.warehouse_id,
      data: { 
        item: randomItem, 
        current_price: randomItem.community_price_per_kg,
        suggested_price: randomItem.community_price_per_kg * 1.05,
        revenue_impact: 12
      },
      read: Math.random() > 0.9,
      actionRequired: true
    });
  }

  // Quality check reminders
  if (Math.random() > 0.8) {
    notifications.push({
      id: `quality_check_${Date.now()}`,
      type: 'quality_check',
      title: 'Quality Check Due',
      message: `Monthly quality inspection due for warehouse ${warehouse.warehouse_id}`,
      timestamp: new Date(now.getTime() - Math.random() * 14400000),
      priority: 'high',
      warehouse_id: warehouse.warehouse_id,
      data: { last_inspection: warehouse.last_inspection_date },
      read: false,
      actionRequired: true
    });
  }

  return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export function NotificationsAlerts({ selectedWarehouse, onNotificationAction }: NotificationsAlertsProps) {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  const [showSettings, setShowSettings] = useState(false);

  const warehouses = warehousesData.warehouses;
  const targetWarehouse = selectedWarehouse || warehouses[0];

  // Generate notifications on mount and warehouse change
  useEffect(() => {
    const allNotifications = selectedWarehouse 
      ? generateNotifications(selectedWarehouse)
      : warehouses.flatMap(w => generateNotifications(w));
    
    setNotifications(allNotifications);
  }, [selectedWarehouse, warehouses]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      if (filter === 'unread' && notification.read) return false;
      if (filter === 'urgent' && notification.priority !== 'urgent') return false;
      return true;
    });
  }, [notifications, filter]);

  // Notification counts
  const notificationCounts = useMemo(() => {
    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      urgent: notifications.filter(n => n.priority === 'urgent').length,
      actionRequired: notifications.filter(n => n.actionRequired && !n.read).length
    };
  }, [notifications]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'low_stock': return AlertTriangle;
      case 'new_arrival': return Package;
      case 'qr_generated': return QrCode;
      case 'high_demand': return TrendingUp;
      case 'price_alert': return DollarSign;
      case 'quality_check': return CheckCircle;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );

    // Show notification-specific toast
    toast.success(`Notification: ${notification.title}`);

    // Call action handler if provided
    if (onNotificationAction) {
      onNotificationAction('view', notification);
    }
  };

  const handleNotificationAction = (notification: Notification, action: string) => {
    switch (action) {
      case 'dismiss':
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
        toast.success('Notification dismissed');
        break;
      case 'restock':
        toast.success(`Restock order initiated for ${notification.data?.item?.name}`);
        break;
      case 'update_price':
        toast.success(`Price updated for ${notification.data?.item?.name}`);
        break;
      case 'schedule_check':
        toast.success('Quality check scheduled');
        break;
      default:
        break;
    }

    if (onNotificationAction) {
      onNotificationAction(action, notification);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const refreshNotifications = () => {
    const allNotifications = selectedWarehouse 
      ? generateNotifications(selectedWarehouse)
      : warehouses.flatMap(w => generateNotifications(w));
    
    setNotifications(allNotifications);
    toast.success('Notifications refreshed');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="w-6 h-6" />
              Notifications & Alerts
            </h2>
            <p className="text-amber-100 mt-1">
              Real-time warehouse monitoring and alerts system
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {notificationCounts.urgent} Urgent
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Clock className="w-3 h-3 mr-1" />
                {notificationCounts.actionRequired} Action Required
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{notificationCounts.unread}</div>
            <div className="text-sm text-amber-100">Unread Notifications</div>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/20 hover:bg-white/30"
                onClick={refreshNotifications}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/20 hover:bg-white/30"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Floating bell animation */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Bell className="w-24 h-24" />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Notifications',
            value: notificationCounts.total,
            icon: Bell,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
          },
          {
            label: 'Unread',
            value: notificationCounts.unread,
            icon: AlertTriangle,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
          },
          {
            label: 'Urgent',
            value: notificationCounts.urgent,
            icon: AlertTriangle,
            color: 'text-red-600',
            bg: 'bg-red-50'
          },
          {
            label: 'Action Required',
            value: notificationCounts.actionRequired,
            icon: Clock,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
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

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({notificationCounts.total})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread ({notificationCounts.unread})
              </Button>
              <Button
                variant={filter === 'urgent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('urgent')}
              >
                Urgent ({notificationCounts.urgent})
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={notificationCounts.unread === 0}
            >
              Mark All Read
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredNotifications.map((notification, index) => {
            const Icon = getNotificationIcon(notification.type);
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                } ${getPriorityColor(notification.priority)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        notification.priority === 'urgent' ? 'bg-red-100' :
                        notification.priority === 'high' ? 'bg-orange-100' :
                        notification.priority === 'medium' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          notification.priority === 'urgent' ? 'text-red-600' :
                          notification.priority === 'high' ? 'text-orange-600' :
                          notification.priority === 'medium' ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold truncate">{notification.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={getPriorityColor(notification.priority)}
                            >
                              {notification.priority.toUpperCase()}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{notification.warehouse_id}</span>
                            <span>{notification.timestamp.toLocaleTimeString()}</span>
                          </div>

                          <div className="flex gap-2">
                            {notification.actionRequired && (
                              <>
                                {notification.type === 'low_stock' && (
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNotificationAction(notification, 'restock');
                                    }}
                                  >
                                    Restock
                                  </Button>
                                )}
                                {notification.type === 'price_alert' && (
                                  <Button 
                                    size="sm" 
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNotificationAction(notification, 'update_price');
                                    }}
                                  >
                                    Update Price
                                  </Button>
                                )}
                                {notification.type === 'quality_check' && (
                                  <Button 
                                    size="sm" 
                                    className="bg-purple-600 hover:bg-purple-700"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNotificationAction(notification, 'schedule_check');
                                    }}
                                  >
                                    Schedule
                                  </Button>
                                )}
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationAction(notification, 'dismiss');
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No notifications match your current filter.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}