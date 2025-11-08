import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  CheckCircle, 
  Download, 
  Receipt, 
  Clock,
  Shield,
  Zap,
  QrCode,
  Leaf,
  Copy,
  Share,
  MapPin
} from 'lucide-react';
import { odishaPaymentData, odishaCustomerProfiles } from '../../data/odishaConsumerData';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';
import { notificationManager } from '../NotificationSystem';

interface PaymentSystemProps {
  cartItems: any[];
  totalAmount: number;
  onPaymentSuccess: (receipt: any) => void;
  onClose: () => void;
}

export function PaymentSystem({ cartItems, totalAmount, onPaymentSuccess, onClose }: PaymentSystemProps) {
  const [selectedPayment, setSelectedPayment] = useState(odishaPaymentData.payment_methods[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const { t } = useLanguage();

  const customer = odishaCustomerProfiles.customers[0];
  const paymentMethods = odishaPaymentData.payment_methods;
  const selectedMethod = paymentMethods.find(m => m.id === selectedPayment);

  // Calculate totals with realistic pricing
  const subtotal = totalAmount;
  const deliveryCharge = subtotal > 500 ? 0 : 25;
  const taxes = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
  const greenPointsDiscount = Math.min(subtotal * 0.1, customer.green_points * 0.01); // 1 point = 1 paisa
  const finalTotal = subtotal + deliveryCharge + taxes - greenPointsDiscount;

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);
    
    // Show processing notifications
    toast.info(
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="font-medium">Processing payment...</p>
          <p className="text-sm text-muted-foreground">{selectedMethod.name}</p>
        </div>
      </div>,
      { duration: 3000 }
    );
    
    // Simulate payment processing
    setTimeout(() => {
      const paymentReceipt = {
        receipt_id: `RCP-${Date.now()}`,
        order_id: `ORD-${Date.now()}`,
        customer_id: customer.customer_id,
        customer_name: customer.name,
        customer_phone: customer.phone,
        payment_method: selectedMethod.name,
        payment_id: `TXN-${Date.now()}`,
        blockchain_hash: `0x${Math.random().toString(16).substring(2, 42)}`,
        timestamp: new Date().toISOString(),
        items: cartItems.map(item => ({
          name: item.name,
          variety: item.variety || '',
          quantity_kg: item.quantity || 1,
          price_per_kg: item.price || item.price_per_kg,
          total_price: ((item.price || item.price_per_kg) * (item.quantity || 1)),
          farmer_name: item.farmer || item.farmer_name || 'Local Farmer',
          image_url: item.image || item.image_url
        })),
        subtotal: subtotal,
        delivery_charge: deliveryCharge,
        taxes: taxes,
        green_points_used: Math.floor(greenPointsDiscount * 100),
        green_points_discount: greenPointsDiscount,
        total_amount: finalTotal,
        delivery_address: customer.delivery_addresses[0].address,
        estimated_delivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        carbon_saved: cartItems.reduce((sum, item) => sum + (item.carbonSaved || item.carbonReduction || item.carbon_saved_per_kg || 0) * (item.quantity || 1), 0),
        merchant: odishaPaymentData.receipt_template
      };

      // Add QR code for order verification
      paymentReceipt.qr_code = {
        text: `Order: ${paymentReceipt.order_id}\nTotal: ₹${paymentReceipt.total_amount.toFixed(2)}\nBlockchain: ${paymentReceipt.blockchain_hash.substring(0, 10)}...`,
        url: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjMDAwIi8+CiAgPHRleHQgeD0iNTAiIHk9IjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjgiPldSLSR7cGF5bWVudFJlY2VpcHQub3JkZXJfaWR9PC90ZXh0Pgo8L3N2Zz4=`
      };

      setReceipt(paymentReceipt);
      setShowReceipt(true);
      setIsProcessing(false);
      
      // Enhanced success notifications
      toast.success(
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="font-medium">Payment Successful!</p>
            <p className="text-sm text-muted-foreground">Receipt ready for download</p>
            <p className="text-xs text-green-600">✓ Blockchain verified</p>
          </div>
        </div>,
        { duration: 5000 }
      );

      // Show notification manager alert
      setTimeout(() => {
        notificationManager?.showLocationUpdate?.({
          currentLocation: 'Payment Confirmed',
          farmerName: `Receipt #${paymentReceipt.receipt_id} generated`
        });
      }, 1000);
      
      onPaymentSuccess(paymentReceipt);
    }, 3000);
  };

  const downloadReceipt = () => {
    const receiptText = `
GREENLEDGER - DIRECT FROM FARMER
${receipt.merchant.merchant_address}
GSTIN: ${receipt.merchant.gstin}

DIGITAL RECEIPT
Receipt ID: ${receipt.receipt_id}
Order ID: ${receipt.order_id}
Date: ${new Date(receipt.timestamp).toLocaleString('en-IN')}

Customer: ${receipt.customer_name}
Phone: ${receipt.customer_phone}
Delivery: ${receipt.delivery_address}

ITEMS PURCHASED:
${receipt.items.map(item => 
  `${item.name}${item.variety ? ` (${item.variety})` : ''}\n  From: ${item.farmer_name}\n  ${item.quantity_kg}kg @ ₹${item.price_per_kg}/kg = ₹${item.total_price.toFixed(2)}`
).join('\n')}

CHARGES BREAKDOWN:
Subtotal: ₹${receipt.subtotal.toFixed(2)}
Delivery: ₹${receipt.delivery_charge.toFixed(2)}
Taxes (18% GST): ₹${receipt.taxes.toFixed(2)}
Green Points Discount: -₹${receipt.green_points_discount.toFixed(2)}

TOTAL AMOUNT: ₹${receipt.total_amount.toFixed(2)}

PAYMENT DETAILS:
Payment Method: ${receipt.payment_method}
Payment ID: ${receipt.payment_id}
Blockchain Hash: ${receipt.blockchain_hash}

ENVIRONMENTAL IMPACT:
Carbon Saved: ${receipt.carbon_saved.toFixed(2)} kg CO₂

Thank you for supporting farmers directly!
Support: ${receipt.merchant.customer_support}
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GreenLedger_Receipt_${receipt.receipt_id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <Download className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <p className="font-medium">Receipt downloaded!</p>
          <p className="text-sm text-muted-foreground">Saved to Downloads folder</p>
        </div>
      </div>
    );
  };

  const shareReceipt = () => {
    if (navigator.share) {
      navigator.share({
        title: 'GreenLedger Receipt',
        text: `Order #${receipt.order_id} - ₹${receipt.total_amount.toFixed(2)}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Order #${receipt.order_id} - ₹${receipt.total_amount.toFixed(2)} - GreenLedger`);
      toast.success('Receipt details copied to clipboard!');
    }
  };

  if (showReceipt && receipt) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="w-6 h-6" />
              </motion.div>
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Receipt Header */}
            <div className="text-center border-b pb-4">
              <h2 className="font-bold text-lg">GREENLEDGER</h2>
              <p className="text-sm text-muted-foreground">🌱 Direct from Farmer • Blockchain Verified</p>
              <p className="text-xs text-muted-foreground">{receipt.merchant.merchant_address}</p>
              <p className="text-xs text-muted-foreground">GSTIN: {receipt.merchant.gstin}</p>
            </div>

            {/* Receipt Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Receipt ID:</span>
                <span className="font-mono text-green-600">{receipt.receipt_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono text-blue-600">{receipt.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{new Date(receipt.timestamp).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Separator />

            {/* QR Code for Order Verification */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-3">
                <QrCode className="w-4 h-4" />
                <span className="font-medium">Order Verification QR</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-white rounded-lg border-2 border-blue-200 flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-blue-600" />
                </div>
                <div className="flex-1 ml-3">
                  <p className="text-xs text-blue-600 font-mono">{receipt.order_id}</p>
                  <p className="text-xs text-muted-foreground">Show this QR to verify order</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-1 h-6 text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(receipt.order_id);
                      toast.success('Order ID copied!');
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy ID
                  </Button>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-1 text-sm bg-gray-50 p-3 rounded-lg">
              <p><span className="font-medium">Customer:</span> {receipt.customer_name}</p>
              <p><span className="font-medium">Phone:</span> {receipt.customer_phone}</p>
              <p><span className="font-medium">Delivery:</span> {receipt.delivery_address}</p>
            </div>

            <Separator />

            {/* Items */}
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Receipt className="w-4 h-4 mr-2" />
                Items Purchased:
              </h3>
              {receipt.items.map((item, index) => (
                <div key={index} className="text-sm bg-green-50 p-3 rounded flex items-center space-x-3">
                  {/* Crop Image */}
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg border border-green-200"
                    />
                  )}
                  
                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.name}{item.variety ? ` (${item.variety})` : ''}</span>
                      <span className="font-bold">₹{item.total_price.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center justify-between">
                      <span>{item.quantity_kg}kg @ ₹{item.price_per_kg}/kg</span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.farmer_name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Charges */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({receipt.items.length} items):</span>
                <span>₹{receipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className={receipt.delivery_charge === 0 ? "text-green-600 font-medium" : ""}>
                  {receipt.delivery_charge === 0 ? 'FREE' : `₹${receipt.delivery_charge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (18% GST):</span>
                <span>₹{receipt.taxes.toFixed(2)}</span>
              </div>
              {receipt.green_points_discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Green Points Discount:</span>
                  <span>-₹{receipt.green_points_discount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Paid:</span>
                <span className="text-green-600">₹{receipt.total_amount.toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            {/* Payment Info */}
            <div className="space-y-1 text-sm bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-medium">{receipt.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment ID:</span>
                <span className="font-mono text-xs">{receipt.payment_id}</span>
              </div>
              <div className="mt-2">
                <span className="font-medium text-purple-700">Blockchain Hash:</span>
                <p className="font-mono text-xs break-all text-purple-600 bg-white p-1 rounded mt-1">{receipt.blockchain_hash}</p>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <Leaf className="w-4 h-4" />
                <span className="font-medium">Environmental Impact</span>
              </div>
              <p className="text-sm text-green-600">
                🌱 You saved {receipt.carbon_saved.toFixed(2)} kg CO₂ by buying directly from farmers!
              </p>
              <p className="text-xs text-green-500 mt-1">
                Equivalent to taking a car off the road for {Math.round(receipt.carbon_saved * 4)} km
              </p>
            </div>

            {/* Expected Delivery */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-orange-700">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Expected Delivery</span>
              </div>
              <p className="text-sm text-orange-600 mt-1">
                📦 {new Date(receipt.estimated_delivery).toLocaleDateString('en-IN')} by 6:00 PM
              </p>
              <p className="text-xs text-orange-500 mt-1 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {receipt.delivery_address.split(',')[0]}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-4">
              <Button onClick={downloadReceipt} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button onClick={shareReceipt} variant="outline" size="sm">
                <Share className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button onClick={onClose} size="sm" className="bg-green-600 hover:bg-green-700">
                Done
              </Button>
            </div>

            {/* Support Info */}
            <div className="text-center text-xs text-muted-foreground pt-2 border-t">
              <p>🙏 Thank you for supporting farmers directly!</p>
              <p>📞 Support: {receipt.merchant.customer_support}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Secure Payment
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose your preferred payment method
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium flex items-center">
              <Receipt className="w-4 h-4 mr-2" />
              Order Summary
            </h3>
            
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm space-x-3">
                <div className="flex items-center space-x-2 flex-1">
                  {(item.image || item.image_url) && (
                    <img
                      src={item.image || item.image_url}
                      alt={item.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                  <span className="truncate">{item.name} × {item.quantity || 1}kg</span>
                </div>
                <span className="font-medium">₹{(((item.price || item.price_per_kg) * (item.quantity || 1))).toFixed(2)}</span>
              </div>
            ))}
            
            <Separator />
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : ""}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (18% GST):</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              {greenPointsDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Green Points Discount:</span>
                  <span>-₹{greenPointsDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="font-medium">Payment Method</h3>
            
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
              {paymentMethods.map((method) => (
                <motion.div 
                  key={method.id} 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-muted/30"
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        {method.type === 'UPI' && <Smartphone className="w-4 h-4 text-purple-600" />}
                        {method.type.includes('Card') && <CreditCard className="w-4 h-4 text-blue-600" />}
                        {method.type.includes('Wallet') && <Wallet className="w-4 h-4 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.identifier}</p>
                        {method.fees > 0 && (
                          <p className="text-xs text-orange-600">+₹{method.fees} processing fee</p>
                        )}
                      </div>
                      {method.is_default && (
                        <Badge variant="outline" className="text-xs">Default</Badge>
                      )}
                    </div>
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </div>

          {/* Security Info */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Secure Payment</span>
            </div>
            <ul className="text-sm text-green-600 space-y-1">
              <li>🔒 256-bit SSL encryption</li>
              <li>⛓️ Blockchain transaction verification</li>
              <li>🛡️ PCI DSS compliant processing</li>
            </ul>
          </div>

          {/* Processing State */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-50 rounded-lg p-4 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"
              />
              <p className="text-blue-700 font-medium">Processing Payment...</p>
              <p className="text-sm text-blue-600">Please wait while we verify your transaction</p>
              <div className="mt-2 bg-blue-200 h-1 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600"
                  animate={{ width: ["0%", "100%"] }}
                  transition={{ duration: 3 }}
                />
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isProcessing}>
              Cancel
            </Button>
            <motion.div 
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              className="flex-1"
            >
              <Button 
                onClick={handlePayment} 
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600" 
                disabled={isProcessing || !selectedMethod}
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Pay ₹{finalTotal.toFixed(2)}
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}