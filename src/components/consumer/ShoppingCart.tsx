import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  Truck,
  Shield,
  Leaf,
  ShoppingBag,
  Star,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { notificationManager } from '../NotificationSystem';

interface ShoppingCartProps {
  items: any[];
  onClose: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onCheckout?: () => void;
}

export function ShoppingCart({ items, onClose, onUpdateQuantity, onCheckout }: ShoppingCartProps) {
  const subtotal = items.reduce((sum, item) => sum + ((item.price || item.price_per_kg) * item.quantity), 0);
  const delivery = subtotal > 1000 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
  const total = subtotal + delivery + tax;
  const totalCarbonSaved = items.reduce((sum, item) => sum + (item.carbonSaved || item.carbonReduction || item.carbon_saved_per_kg || 0) * item.quantity, 0);

  const handleQuantityUpdate = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      const item = items.find(i => i.id === id);
      toast.info(
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="font-medium">Item removed</p>
            <p className="text-sm text-muted-foreground">{item?.name}</p>
          </div>
        </div>,
        { duration: 2000 }
      );
    } else {
      toast.success(
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-medium">Quantity updated</p>
            <p className="text-sm text-muted-foreground">New quantity: {newQuantity}</p>
          </div>
        </div>,
        { duration: 2000 }
      );
    }
    onUpdateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    if (onCheckout) {
      // Enhanced checkout notification
      toast.success(
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium">Proceeding to payment</p>
            <p className="text-sm text-muted-foreground">Total: ₹{total.toFixed(2)}</p>
          </div>
        </div>,
        { duration: 3000 }
      );
      onCheckout();
    } else {
      toast.success('Order placed successfully! You\'ll receive updates via blockchain.');
      onClose();
    }
  };

  if (items.length === 0) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-blue-600" />
              Your Cart
            </DialogTitle>
          </DialogHeader>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            </motion.div>
            <h3 className="font-medium mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start shopping for fresh products from local farmers
            </p>
            <Button onClick={onClose} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
              <Leaf className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-blue-600" />
            Your Cart ({items.length} items)
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[70vh]">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.image || item.image_url || `https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.farmer || item.farmer_name || 'Local Farmer'}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        <Leaf className="w-3 h-3 mr-1" />
                        {((item.carbonSaved || item.carbonReduction || item.carbon_saved_per_kg || 0) * item.quantity).toFixed(1)} kg CO₂ saved
                      </Badge>
                      {item.organic_certified && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          <Star className="w-3 h-3 mr-1" />
                          Organic
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    </motion.div>
                    <motion.span 
                      key={item.quantity}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="w-8 text-center font-medium"
                    >
                      {item.quantity}
                    </motion.span>
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">₹{((item.price || item.price_per_kg) * item.quantity).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">₹{(item.price || item.price_per_kg)}/kg</div>
                  </div>
                  
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleQuantityUpdate(item.id, 0)}
                      className="h-8 w-8 p-0 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Separator className="my-4" />

          {/* Order Summary */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-green-800 flex items-center">
                  <Leaf className="w-4 h-4 mr-2" />
                  Environmental Impact
                </span>
                <span className="font-bold text-green-600">
                  {totalCarbonSaved.toFixed(1)} kg CO₂ saved
                </span>
              </div>
              <p className="text-sm text-green-700">
                By buying directly from farmers, you're reducing transportation emissions
              </p>
            </motion.div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className={delivery === 0 ? "text-green-600 font-medium" : ""}>
                  {delivery === 0 ? 'FREE' : `₹${delivery}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18% GST)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-600">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Continue Shopping
              </Button>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button 
                  onClick={handleCheckout} 
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Checkout ₹{total.toFixed(2)}
                </Button>
              </motion.div>
            </div>

            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Blockchain Secured
              </div>
              <div className="flex items-center">
                <Truck className="w-4 h-4 mr-1" />
                24hr Delivery
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}