import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { 
  Check, 
  AlertTriangle, 
  Info, 
  X, 
  QrCode, 
  ShoppingCart, 
  Package, 
  Phone,
  TrendingUp,
  Zap,
  MapPin,
  Star
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';

interface NotificationData {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  icon?: React.ReactNode;
  image?: string;
  data?: any;
  autoClose?: boolean;
  duration?: number;
}

// Global notification system for GreenLedger
export class NotificationManager {
  private static instance: NotificationManager;
  private listeners: ((notification: NotificationData) => void)[] = [];

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  addListener(listener: (notification: NotificationData) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (notification: NotificationData) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // QR Code Generation Notification (with multilingual support)
  showQRGenerated(qrData: any, t?: (key: string) => string) {
    const notification: NotificationData = {
      id: `qr-${Date.now()}`,
      type: 'success',
      title: t ? t('notification.qrGenerated') : 'QR Code Generated Successfully',
      message: t ? 
        `${t('qr.generateCode')} ${qrData.productName || t('qr.productInfo')}` : 
        `QR code created for ${qrData.productName || 'product'}`,
      icon: <QrCode className="w-6 h-6" />,
      image: qrData.qrCodeUrl || `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPgogIDxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIi8+CiAgPHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz4KICA8dGV4dCB4PSIxMDAiIHk9IjEwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMiI+UVItJHtxckRhdGEucHJvZHVjdE5hbWUgfHwgJ1BST0QnfTwvdGV4dD4KPC9zdmc+`,
      data: qrData,
      autoClose: true,
      duration: 5000
    };
    this.notify(notification);
  }

  // Sale Confirmation Notification
  showSaleConfirmation(saleData: any) {
    const notification: NotificationData = {
      id: `sale-${Date.now()}`,
      type: 'success',
      title: 'Sale Confirmed!',
      message: `₹${saleData.amount} - ${saleData.productName} sold to ${saleData.customerName}`,
      icon: <Check className="w-6 h-6" />,
      image: saleData.productImage,
      data: saleData,
      autoClose: true,
      duration: 5000
    };
    this.notify(notification);
  }

  // Low Stock Alert
  showLowStockAlert(stockData: any) {
    const notification: NotificationData = {
      id: `stock-${Date.now()}`,
      type: 'warning',
      title: 'Low Stock Alert',
      message: `Only ${stockData.quantity}kg left of ${stockData.productName}`,
      icon: <AlertTriangle className="w-6 h-6" />,
      image: stockData.productImage,
      data: stockData,
      autoClose: true,
      duration: 7000
    };
    this.notify(notification);
  }

  // Purchase Confirmation
  showPurchaseConfirmation(purchaseData: any) {
    const notification: NotificationData = {
      id: `purchase-${Date.now()}`,
      type: 'success',
      title: 'Purchase Successful!',
      message: `Order #${purchaseData.orderId} confirmed - ₹${purchaseData.total}`,
      icon: <ShoppingCart className="w-6 h-6" />,
      image: purchaseData.productImage,
      data: purchaseData,
      autoClose: true,
      duration: 6000
    };
    this.notify(notification);
  }

  // Support Call Notification
  showCallSupport(callData: any) {
    const notification: NotificationData = {
      id: `call-${Date.now()}`,
      type: 'info',
      title: 'Calling Support',
      message: `Connecting to ${callData.supportType} - ${callData.phoneNumber}`,
      icon: <Phone className="w-6 h-6" />,
      data: callData,
      autoClose: true,
      duration: 4000
    };
    this.notify(notification);
  }

  // High Demand Product Alert
  showHighDemandAlert(demandData: any) {
    const notification: NotificationData = {
      id: `demand-${Date.now()}`,
      type: 'info',
      title: 'High Demand Alert!',
      message: `${demandData.productName} is trending - Price up by ${demandData.priceIncrease}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      image: demandData.productImage,
      data: demandData,
      autoClose: true,
      duration: 6000
    };
    this.notify(notification);
  }

  // Payment Confirmation
  showPaymentConfirmation(paymentData: any) {
    const notification: NotificationData = {
      id: `payment-${Date.now()}`,
      type: 'success',
      title: 'Payment Processed',
      message: `₹${paymentData.amount} paid via ${paymentData.method}`,
      icon: <Zap className="w-6 h-6" />,
      data: paymentData,
      autoClose: true,
      duration: 5000
    };
    this.notify(notification);
  }

  // Delivery Update
  showDeliveryUpdate(deliveryData: any) {
    const notification: NotificationData = {
      id: `delivery-${Date.now()}`,
      type: 'info',
      title: 'Delivery Update',
      message: `Order ${deliveryData.orderId} is ${deliveryData.status}`,
      icon: <Package className="w-6 h-6" />,
      data: deliveryData,
      autoClose: true,
      duration: 5000
    };
    this.notify(notification);
  }

  // Location Update
  showLocationUpdate(locationData: any) {
    const notification: NotificationData = {
      id: `location-${Date.now()}`,
      type: 'info',
      title: 'Location Updated',
      message: `Now at ${locationData.currentLocation}`,
      icon: <MapPin className="w-6 h-6" />,
      data: locationData,
      autoClose: true,
      duration: 4000
    };
    this.notify(notification);
  }

  // Rating/Review Notification
  showRatingUpdate(ratingData: any) {
    const notification: NotificationData = {
      id: `rating-${Date.now()}`,
      type: 'success',
      title: 'New Rating Received',
      message: `${ratingData.stars} stars from ${ratingData.customerName}`,
      icon: <Star className="w-6 h-6" />,
      data: ratingData,
      autoClose: true,
      duration: 5000
    };
    this.notify(notification);
  }

  private notify(notification: NotificationData) {
    this.listeners.forEach(listener => listener(notification));
    
    // Also trigger sonner toast for immediate feedback
    switch (notification.type) {
      case 'success':
        toast.success(notification.title, {
          description: notification.message,
          duration: 3000
        });
        break;
      case 'warning':
        toast.warning(notification.title, {
          description: notification.message,
          duration: 4000
        });
        break;
      case 'error':
        toast.error(notification.title, {
          description: notification.message,
          duration: 5000
        });
        break;
      default:
        toast.info(notification.title, {
          description: notification.message,
          duration: 3000
        });
    }
  }
}

// React component for displaying notifications
export function NotificationDisplay() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const notificationManager = NotificationManager.getInstance();
    
    const listener = (notification: NotificationData) => {
      setNotifications(prev => [...prev, notification]);
      
      if (notification.autoClose) {
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, notification.duration || 5000);
      }
    };

    notificationManager.addListener(listener);

    return () => {
      notificationManager.removeListener(listener);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              boxShadow: [
                "0 4px 20px rgba(0, 0, 0, 0.1)",
                "0 8px 25px rgba(34, 197, 94, 0.3)",
                "0 4px 20px rgba(0, 0, 0, 0.1)"
              ]
            }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 100
            }}
            className="relative"
          >
            <Card className={`
              ${notification.type === 'success' ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100' : ''}
              ${notification.type === 'warning' ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100' : ''}
              ${notification.type === 'error' ? 'border-red-200 bg-gradient-to-br from-red-50 to-red-100' : ''}
              ${notification.type === 'info' ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100' : ''}
              shadow-lg border-2
            `}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`
                    flex-shrink-0 p-2 rounded-full
                    ${notification.type === 'success' ? 'bg-green-100 text-green-600' : ''}
                    ${notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : ''}
                    ${notification.type === 'error' ? 'bg-red-100 text-red-600' : ''}
                    ${notification.type === 'info' ? 'bg-blue-100 text-blue-600' : ''}
                  `}>
                    {notification.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-white/50"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>

                    {/* Image if provided */}
                    {notification.image && (
                      <div className="mt-2">
                        <img 
                          src={notification.image} 
                          alt="Notification"
                          className="w-full h-16 object-cover rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Data badges if provided */}
                    {notification.data && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {notification.data.amount && (
                          <Badge variant="secondary" className="text-xs">
                            ₹{notification.data.amount}
                          </Badge>
                        )}
                        {notification.data.quantity && (
                          <Badge variant="outline" className="text-xs">
                            {notification.data.quantity}kg
                          </Badge>
                        )}
                        {notification.data.location && (
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="w-2 h-2 mr-1" />
                            {notification.data.location}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Animated progress bar for auto-close */}
                {notification.autoClose && (
                  <motion.div
                    className={`
                      absolute bottom-0 left-0 h-1 rounded-b
                      ${notification.type === 'success' ? 'bg-green-400' : ''}
                      ${notification.type === 'warning' ? 'bg-yellow-400' : ''}
                      ${notification.type === 'error' ? 'bg-red-400' : ''}
                      ${notification.type === 'info' ? 'bg-blue-400' : ''}
                    `}
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ 
                      duration: (notification.duration || 5000) / 1000,
                      ease: 'linear'
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Export notification manager instance for global use
export const notificationManager = NotificationManager.getInstance();