import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Package, 
  Truck, 
  Store, 
  CheckCircle, 
  Bell, 
  X,
  MapPin,
  Clock,
  Navigation,
  ShoppingCart
} from 'lucide-react';
import { productMovementHistory, ProductMovementEntry } from '../data/productMovementHistory';
import { useLanguage } from '../contexts/LanguageContext';

interface MovementNotification {
  id: string;
  movement: ProductMovementEntry;
  type: 'status_update' | 'arrival' | 'dispatch' | 'quality_check';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}

export function ProductMovementNotifications() {
  const [notifications, setNotifications] = useState<MovementNotification[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useLanguage();

  // Simulate real-time notifications
  useEffect(() => {
    const generateNotifications = () => {
      const sampleNotifications: MovementNotification[] = [
        {
          id: 'notif-1',
          movement: productMovementHistory[0],
          type: 'arrival',
          message: `${productMovementHistory[0].product.name} has arrived at ${productMovementHistory[0].uzhavan_santhai_shop.name}`,
          timestamp: new Date().toISOString(),
          priority: 'high',
          read: false
        },
        {
          id: 'notif-2',
          movement: productMovementHistory[1],
          type: 'dispatch',
          message: `${productMovementHistory[1].product.name} dispatched from ${productMovementHistory[1].warehouse.name}`,
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          priority: 'medium',
          read: false
        },
        {
          id: 'notif-3',
          movement: productMovementHistory[2],
          type: 'quality_check',
          message: `Quality verification completed for ${productMovementHistory[2].product.name}`,
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          priority: 'low',
          read: false
        }
      ];

      setNotifications(sampleNotifications);
    };

    generateNotifications();

    // Simulate new notifications every 30 seconds
    const interval = setInterval(() => {
      const randomMovement = productMovementHistory[Math.floor(Math.random() * productMovementHistory.length)];
      const types: MovementNotification['type'][] = ['status_update', 'arrival', 'dispatch', 'quality_check'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const messages = {
        status_update: `Status updated: ${randomMovement.product.name} is now ${randomMovement.status.replace('_', ' ')}`,
        arrival: `${randomMovement.product.name} has arrived at destination`,
        dispatch: `${randomMovement.product.name} has been dispatched`,
        quality_check: `Quality check completed for ${randomMovement.product.name}`
      };

      const newNotification: MovementNotification = {
        id: `notif-${Date.now()}`,
        movement: randomMovement,
        type,
        message: messages[type],
        timestamp: new Date().toISOString(),
        priority: Math.random() > 0.5 ? 'high' : 'medium',
        read: false
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: MovementNotification['type']) => {
    switch (type) {
      case 'arrival': return <MapPin className="w-4 h-4" />;
      case 'dispatch': return <Truck className="w-4 h-4" />;
      case 'quality_check': return <CheckCircle className="w-4 h-4" />;
      case 'status_update': return <Package className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: MovementNotification['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 w-80 max-h-96 overflow-y-auto">
      <Card className="shadow-lg border-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">Live Tracking Updates</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="p-1 h-6 w-6"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 300, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 300, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 rounded-lg border ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'shadow-md' : 'opacity-75'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notification.priority === 'high' ? 'bg-red-500 text-white animate-pulse' :
                        notification.priority === 'medium' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs mb-1">
                          {notification.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissNotification(notification.id)}
                          className="p-0 h-4 w-4 opacity-50 hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <p className="text-sm font-medium mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs opacity-75">
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center">
                            <Package className="w-3 h-3 mr-1" />
                            {notification.movement.product.name}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimestamp(notification.timestamp)}
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs mt-2 h-6"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress indicator for high priority items */}
                  {notification.priority === 'high' && (
                    <div className="mt-2 w-full bg-red-200 rounded-full h-1">
                      <motion.div
                        className="bg-red-500 h-1 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No new notifications</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}