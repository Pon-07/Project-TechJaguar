import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Package,
  QrCode,
  History,
  Edit,
  CheckCircle,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  AlertTriangle,
  Leaf,
  Shield,
  Link
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { warehousesData, Warehouse as WarehouseType, InventoryItem } from '../../data/warehouses';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface EnhancedProductManagementProps {
  selectedWarehouse: WarehouseType;
  onProductUpdate?: (item: InventoryItem, updates: any) => void;
}

interface ProductAction {
  type: 'qr_generate' | 'qr_history' | 'mark_sold' | 'update_quantity';
  label: string;
  icon: any;
  color: string;
}

const productActions: ProductAction[] = [
  { type: 'qr_generate', label: 'Generate QR', icon: QrCode, color: 'bg-blue-600 hover:bg-blue-700' },
  { type: 'qr_history', label: 'QR History', icon: History, color: 'bg-purple-600 hover:bg-purple-700' },
  { type: 'mark_sold', label: 'Mark Sold', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-700' },
  { type: 'update_quantity', label: 'Update Stock', icon: Edit, color: 'bg-amber-600 hover:bg-amber-700' }
];

// Generate dummy blockchain transactions
const generateBlockchainTxHistory = (item: InventoryItem) => {
  const transactions = [];
  const now = new Date();
  
  for (let i = 0; i < 5; i++) {
    transactions.push({
      id: `0x${Math.random().toString(16).substr(2, 10).toUpperCase()}`,
      date: new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)),
      type: ['QR_Generated', 'Stock_Updated', 'Price_Updated', 'Quality_Check', 'Sale_Recorded'][i % 5],
      amount: Math.floor(Math.random() * 5000) + 1000,
      price: item.community_price_per_kg + (Math.random() - 0.5) * 10,
      farmer: `Farmer ${Math.floor(Math.random() * 50) + 1}`,
      status: 'Confirmed'
    });
  }
  
  return transactions;
};

// Generate dummy sales data
const generateSalesData = (item: InventoryItem) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    sold: Math.floor(Math.random() * 1000) + 200,
    revenue: Math.floor(Math.random() * 50000) + 10000
  }));
};

export function EnhancedProductManagement({ selectedWarehouse, onProductUpdate }: EnhancedProductManagementProps) {
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ProductAction | null>(null);
  const [quantityInput, setQuantityInput] = useState('');
  const [saleQuantity, setSaleQuantity] = useState('');

  const inventory = selectedWarehouse.inventory;

  // Calculate enhanced metrics for each product
  const enhancedProducts = useMemo(() => {
    return inventory.map(item => {
      const totalValue = item.total_quantity_kg * item.community_price_per_kg;
      const stockLevel = (item.total_quantity_kg / 50000) * 100; // Normalize to percentage
      const soldQuantity = Math.floor(item.total_quantity_kg * (0.3 + Math.random() * 0.4)); // 30-70% sold
      const salesVelocity = Math.floor(item.total_quantity_kg * 0.05); // 5% daily velocity
      const daysUntilStockout = Math.floor(item.total_quantity_kg / salesVelocity);
      
      return {
        ...item,
        totalValue,
        stockLevel: Math.min(100, stockLevel),
        soldQuantity,
        remainingQuantity: item.total_quantity_kg - soldQuantity,
        salesVelocity,
        daysUntilStockout,
        profitMargin: ((item.community_price_per_kg - item.unit_price_per_kg) / item.unit_price_per_kg) * 100,
        qrCodesGenerated: Math.floor(Math.random() * 10) + 3,
        lastSoldDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        blockchainTxHistory: generateBlockchainTxHistory(item),
        salesData: generateSalesData(item)
      };
    });
  }, [inventory]);

  const handleProductAction = async (product: any, action: ProductAction) => {
    setSelectedProduct(product);
    setCurrentAction(action);
    setActionDialogOpen(true);
  };

  const executeAction = async () => {
    if (!selectedProduct || !currentAction) return;

    switch (currentAction.type) {
      case 'qr_generate':
        // Simulate QR generation
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success(`QR Code generated for ${selectedProduct.name}`, {
          description: `Blockchain TX: 0x${Math.random().toString(16).substr(2, 12).toUpperCase()}`
        });
        break;

      case 'qr_history':
        toast.success(`Displaying QR history for ${selectedProduct.name}`);
        break;

      case 'mark_sold':
        if (saleQuantity && parseInt(saleQuantity) > 0) {
          toast.success(`Marked ${saleQuantity}kg of ${selectedProduct.name} as sold`, {
            description: `Revenue: ₹${(parseInt(saleQuantity) * selectedProduct.community_price_per_kg).toLocaleString()}`
          });
        } else {
          toast.error('Please enter a valid quantity');
          return;
        }
        break;

      case 'update_quantity':
        if (quantityInput && parseInt(quantityInput) > 0) {
          toast.success(`Stock updated for ${selectedProduct.name}`, {
            description: `New quantity: ${quantityInput}kg`
          });
        } else {
          toast.error('Please enter a valid quantity');
          return;
        }
        break;
    }

    if (onProductUpdate) {
      onProductUpdate(selectedProduct, {
        action: currentAction.type,
        quantity: quantityInput || saleQuantity,
        timestamp: new Date()
      });
    }

    setActionDialogOpen(false);
    setQuantityInput('');
    setSaleQuantity('');
  };

  const getStockStatusColor = (stockLevel: number) => {
    if (stockLevel < 20) return 'bg-red-500';
    if (stockLevel < 50) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6" />
              Enhanced Product Management
            </h2>
            <p className="text-green-100 mt-1">
              Complete inventory control for {selectedWarehouse.warehouse_id} • {selectedWarehouse.taluk}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Package className="w-3 h-3 mr-1" />
                {inventory.length} Products
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Shield className="w-3 h-3 mr-1" />
                Blockchain Secured
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              ₹{((enhancedProducts.reduce((sum, p) => sum + p.totalValue, 0)) / 100000).toFixed(1)}L
            </div>
            <div className="text-sm text-green-100">Total Inventory Value</div>
            <div className="flex items-center text-sm mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              {inventory.filter(i => i.organic_cert === 'Yes').length} Organic Certified
            </div>
          </div>
        </div>

        {/* Floating package animation */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Package className="w-24 h-24" />
          </motion.div>
        </div>
      </motion.div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enhancedProducts.map((product, index) => (
          <motion.div
            key={product.item_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border-2 hover:shadow-lg transition-all hover:border-green-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.variety}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {product.organic_cert === 'Yes' && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <Leaf className="w-3 h-3 mr-1" />
                        Organic
                      </Badge>
                    )}
                    <Badge variant="outline">
                      Batch: {product.batch_id.split('-').pop()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{(product.total_quantity_kg / 1000).toFixed(1)}t</p>
                    <p className="text-xs text-muted-foreground">Total Stock</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{(product.soldQuantity / 1000).toFixed(1)}t</p>
                    <p className="text-xs text-muted-foreground">Sold</p>
                  </div>
                </div>

                {/* Stock Level Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Stock Level</span>
                    <span className={`font-medium ${
                      product.stockLevel < 20 ? 'text-red-600' : 
                      product.stockLevel < 50 ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {product.stockLevel.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${getStockStatusColor(product.stockLevel)}`}
                      style={{ width: `${Math.min(product.stockLevel, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Financial Info */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <p className="font-medium">₹{product.community_price_per_kg}/kg</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Value:</span>
                    <p className="font-medium">₹{(product.totalValue / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Farmers:</span>
                    <p className="font-medium flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {product.farmer_count}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Days left:</span>
                    <p className={`font-medium ${
                      product.daysUntilStockout < 7 ? 'text-red-600' : 
                      product.daysUntilStockout < 14 ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {product.daysUntilStockout}
                    </p>
                  </div>
                </div>

                {/* Blockchain Info */}
                <div className="p-2 bg-gray-50 rounded border">
                  <div className="flex items-center gap-2 mb-1">
                    <Link className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-medium">Blockchain</span>
                  </div>
                  <code className="text-xs text-blue-600 break-all">
                    {product.blockchain_contract_id}
                  </code>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {productActions.map((action) => (
                    <Button
                      key={action.type}
                      size="sm"
                      className={action.color}
                      onClick={() => handleProductAction(product, action)}
                    >
                      <action.icon className="w-4 h-4 mr-1" />
                      {action.label}
                    </Button>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>QR Codes: {product.qrCodesGenerated}</span>
                  <span>Last sold: {product.lastSoldDate.toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentAction?.icon && <currentAction.icon className="w-5 h-5" />}
              {currentAction?.label} - {selectedProduct?.name}
            </DialogTitle>
            <DialogDescription>
              Manage product actions and view detailed information for {selectedProduct?.name || "this product"}
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <Tabs defaultValue="action" className="w-full">
              <TabsList>
                <TabsTrigger value="action">Action</TabsTrigger>
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain History</TabsTrigger>
                <TabsTrigger value="analytics">Sales Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="action" className="space-y-4">
                {currentAction?.type === 'qr_generate' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">QR Code Generation</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Generate a new QR code for batch {selectedProduct.batch_id}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Product Name</label>
                          <p className="text-sm">{selectedProduct.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Batch ID</label>
                          <p className="text-sm">{selectedProduct.batch_id}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Farmer Count</label>
                          <p className="text-sm">{selectedProduct.farmer_count} farmers</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Organic Certified</label>
                          <p className="text-sm">{selectedProduct.organic_cert}</p>
                        </div>
                      </div>
                      
                      {/* Mock QR Code Preview */}
                      <div className="mt-4 p-4 bg-white rounded border-2 border-dashed border-blue-300 text-center">
                        <QrCode className="w-16 h-16 mx-auto text-blue-600 mb-2" />
                        <p className="text-sm text-muted-foreground">QR Code will appear here</p>
                        <p className="text-xs text-blue-600 mt-1">
                          TX Hash: 0x{Math.random().toString(16).substr(2, 12).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentAction?.type === 'mark_sold' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Mark Product as Sold</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Record sale and update inventory
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Quantity Sold (kg)</label>
                          <Input
                            type="number"
                            placeholder="Enter quantity in kg"
                            value={saleQuantity}
                            onChange={(e) => setSaleQuantity(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        {saleQuantity && (
                          <div className="p-3 bg-white rounded border">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Revenue:</span>
                                <p className="font-bold text-green-600">
                                  ₹{(parseInt(saleQuantity) * selectedProduct.community_price_per_kg).toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Remaining Stock:</span>
                                <p className="font-bold">
                                  {(selectedProduct.total_quantity_kg - parseInt(saleQuantity)).toLocaleString()} kg
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentAction?.type === 'update_quantity' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Update Stock Quantity</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Update inventory quantity (restocking or corrections)
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">New Quantity (kg)</label>
                          <Input
                            type="number"
                            placeholder="Enter new total quantity"
                            value={quantityInput}
                            onChange={(e) => setQuantityInput(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Current Stock:</span>
                            <p className="font-bold">{selectedProduct.total_quantity_kg.toLocaleString()} kg</p>
                          </div>
                          {quantityInput && (
                            <div>
                              <span className="text-muted-foreground">Change:</span>
                              <p className={`font-bold ${
                                parseInt(quantityInput) > selectedProduct.total_quantity_kg ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {parseInt(quantityInput) > selectedProduct.total_quantity_kg ? '+' : ''}
                                {(parseInt(quantityInput) - selectedProduct.total_quantity_kg).toLocaleString()} kg
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={executeAction} className={currentAction?.color}>
                    Execute {currentAction?.label}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Product Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Item ID:</span>
                        <span className="font-medium">{selectedProduct.item_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Variety:</span>
                        <span className="font-medium">{selectedProduct.variety}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Batch ID:</span>
                        <span className="font-medium">{selectedProduct.batch_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Farmer Count:</span>
                        <span className="font-medium">{selectedProduct.farmer_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Organic Certified:</span>
                        <Badge variant={selectedProduct.organic_cert === 'Yes' ? 'default' : 'secondary'}>
                          {selectedProduct.organic_cert}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expiry Date:</span>
                        <span className="font-medium">{new Date(selectedProduct.expiry_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Financial Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Unit Price:</span>
                        <span className="font-medium">₹{selectedProduct.unit_price_per_kg}/kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Community Price:</span>
                        <span className="font-medium">₹{selectedProduct.community_price_per_kg}/kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Value:</span>
                        <span className="font-medium">₹{(selectedProduct.total_quantity_kg * selectedProduct.community_price_per_kg).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Carbon Saved:</span>
                        <span className="font-medium text-green-600">{selectedProduct.carbon_saved_kg} kg CO₂</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="blockchain" className="space-y-4">
                <h4 className="font-semibold">Blockchain Transaction History</h4>
                <div className="space-y-2">
                  {selectedProduct.blockchainTxHistory.map((tx, index) => (
                    <div key={tx.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{tx.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {tx.date.toLocaleDateString()} {tx.date.toLocaleTimeString()}
                          </span>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {tx.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">TX Hash:</span>
                          <p className="font-mono text-blue-600">{tx.id}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <p>{tx.amount} kg</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <p>₹{tx.price.toFixed(2)}/kg</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Farmer:</span>
                          <p>{tx.farmer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <h4 className="font-semibold">Sales Analytics (Last 7 Days)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={selectedProduct.salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `${value/1000}k`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `₹${value/1000}k`} />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="sold" fill="#22c55e" name="Quantity Sold (kg)" />
                    <Bar yAxisId="right" dataKey="revenue" fill="#3b82f6" name="Revenue (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}