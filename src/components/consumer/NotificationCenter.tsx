import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Bell, CheckCircle, X, TrendingDown, Package, Truck, Gift, AlertCircle } from 'lucide-react';
import { odishaConsumerNotifications } from '../../data/odishaConsumerData';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';

interface NotificationCenterProps {
  onNotificationAction: (notificationId: string, action: string) => void;
}

export function NotificationCenter({ onNotificationAction }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(odishaConsumerNotifications.notifications);
  const { t } = useLanguage();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_confirmation':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'price_drop':
        return <TrendingDown className="w-5 h-5 text-green-600" />;
      case 'new_arrival':
        return <Gift className="w-5 h-5 text-blue-600" />;
      case 'delivery_update':
        return <Truck className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order_confirmation':
        return 'border-green-200 bg-green-50';
      case 'price_drop':
        return 'border-green-200 bg-green-50';
      case 'new_arrival':
        return 'border-blue-200 bg-blue-50';
      case 'delivery_update':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, is_read: true }
          : notif
      )
    );
    toast.success('Notification marked as read');
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    toast.success('Notification dismissed');
  };

  const handleActionButton = (notificationId: string, action: string) => {
    onNotificationAction(notificationId, action);
    markAsRead(notificationId);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          Notifications
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white ml-auto">
              {unreadCount} new
            </Badge>
          )}
        </CardTitle>
        <p className="text-muted-foreground">
          Stay updated with your orders, deals, and deliveries
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-muted-foreground">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-lg p-4 ${getNotificationColor(notification.type)} ${
                  !notification.is_read ? 'border-l-4' : ''
                }`}
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
                        
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>
                            {new Date(notification.timestamp).toLocaleString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {!notification.is_read && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 h-auto"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissNotification(notification.id)}
                          className="p-1 h-auto"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    {notification.action_buttons && notification.action_buttons.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {notification.action_buttons.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant="outline"
                            size="sm"
                            onClick={() => handleActionButton(notification.id, action)}
                            className="text-xs"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                toast.success('All notifications marked as read');
              }}
              className="flex-1"
            >
              Mark All Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNotifications([]);
                toast.success('All notifications cleared');
              }}
              className="flex-1"
            >
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}