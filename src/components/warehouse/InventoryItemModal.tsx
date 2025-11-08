import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Users, 
  Leaf, 
  Calendar, 
  Package, 
  Shield, 
  TrendingUp, 
  ShoppingCart, 
  Eye,
  ExternalLink,
  Copy,
  Truck,
  Award,
  QrCode
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ARPreview } from './ARPreview';
import { InventoryItem } from '../../data/warehouses';
import { toast } from 'sonner@2.0.3';

interface InventoryItemModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerateQR?: () => void;
}

export function InventoryItemModal({ item, isOpen, onClose, onGenerateQR }: InventoryItemModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!item) return null;

  // Mock data for price history
  const priceHistory = [
    { date: 'Jul', price: item.unit_price_per_kg - 2 },
    { date: 'Aug', price: item.unit_price_per_kg + 1 },
    { date: 'Sep', price: item.community_price_per_kg },
  ];

  // Mock farmer data
  const sampleFarmers = [
    { name: 'Raj Kumar', pin: 'UZP-12345', contribution: '35%' },
    { name: 'Meera Devi', pin: 'UZP-12346', contribution: '28%' },
    { name: 'Suresh M.', pin: 'UZP-12347', contribution: '22%' },
    { name: 'Lakshmi R.', pin: 'UZP-12348', contribution: '15%' },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiry = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (dateString: string) => {
    const days = getDaysUntilExpiry(dateString);
    if (days < 30) return { status: 'urgent', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
    if (days < 90) return { status: 'warning', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-50 border-green-200' };
  };

  const priceIncrease = ((item.community_price_per_kg - item.unit_price_per_kg) / item.unit_price_per_kg) * 100;
  const expiryInfo = getExpiryStatus(item.expiry_date);
  const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date);

  const handleCopyContract = () => {
    navigator.clipboard.writeText(item.blockchain_contract_id);
    toast.success('Contract ID copied to clipboard');
  };

  const handleBuyDirect = () => {
    toast.success('Redirecting to consumer purchase flow...');
  };

  const handleCreateContract = () => {
    toast.success('Smart contract creation initiated...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-sm text-muted-foreground">{item.variety} • Batch: {item.batch_id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.organic_cert === 'Yes' && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Leaf className="w-3 h-3 mr-1" />
                  Organic Certified
                </Badge>
              )}
              {item.organic_cert === 'Partial' && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Partial Organic
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            View detailed information, blockchain data, and farmer details for this inventory item
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - AR Preview & Quick Info */}
          <div className="space-y-4">
            {/* AR Model Preview */}
            <ARPreview 
              asset3D={item.ar_model}
              title="3D Crop Model"
              subtitle="Tap for AR view"
            />

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Farmers</span>
                  </div>
                  <span className="font-medium">{item.farmer_count}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Quantity</span>
                  </div>
                  <span className="font-medium">{(item.total_quantity_kg / 1000).toFixed(1)}t</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Carbon Saved</span>
                  </div>
                  <span className="font-medium text-green-600">{item.carbon_saved_kg}kg CO₂</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Expiry</span>
                  </div>
                  <span className={`font-medium ${expiryInfo.color}`}>
                    {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">
                    ₹{item.community_price_per_kg}/kg
                  </div>
                  <div className="text-sm text-green-600">Community Price</div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Base Price</span>
                  <span>₹{item.unit_price_per_kg}/kg</span>
                </div>
                
                {priceIncrease > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Community Premium</span>
                    <span className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      +{priceIncrease.toFixed(1)}%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="farmers">Farmers</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Batch Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Batch Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Batch ID</label>
                        <p className="font-mono text-sm mt-1">{item.batch_id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Item ID</label>
                        <p className="font-mono text-sm mt-1">{item.item_id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Variety</label>
                        <p className="text-sm mt-1">{item.variety}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                        <p className={`text-sm mt-1 ${expiryInfo.color}`}>
                          {formatDate(item.expiry_date)}
                        </p>
                      </div>
                    </div>

                    {/* Expiry Warning */}
                    {daysUntilExpiry < 90 && (
                      <div className={`p-3 rounded-lg border ${expiryInfo.bg}`}>
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${expiryInfo.color}`} />
                          <span className={`text-sm font-medium ${expiryInfo.color}`}>
                            {daysUntilExpiry < 30 ? 'Urgent: ' : 'Warning: '}
                            {daysUntilExpiry > 0 ? `${daysUntilExpiry} days until expiry` : 'Product expired'}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Certification & Quality */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Certification & Quality</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {item.organic_cert === 'Yes' ? (
                          <Award className="w-5 h-5 text-green-600" />
                        ) : (
                          <Package className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-medium">
                            {item.organic_cert === 'Yes' ? 'Organic Certified' : 
                             item.organic_cert === 'Partial' ? 'Partially Organic' : 'Conventional'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.organic_cert === 'Yes' ? 'Meets organic standards' :
                             item.organic_cert === 'Partial' ? 'Some organic practices' : 'Standard farming practices'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {item.carbon_saved_kg > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="font-medium text-green-800">Environmental Impact</div>
                            <div className="text-sm text-green-700">
                              This batch saved {item.carbon_saved_kg}kg of CO₂ through sustainable farming practices
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button className="flex items-center gap-2" onClick={handleBuyDirect}>
                    <ShoppingCart className="w-4 h-4" />
                    Buy Direct
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 border-green-600 text-green-700 hover:bg-green-50" 
                    onClick={onGenerateQR}
                  >
                    <QrCode className="w-4 h-4" />
                    Generate QR Code
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Open AR View
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Request Delivery
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" onClick={handleCreateContract}>
                    <Shield className="w-4 h-4" />
                    Create Smart Contract
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="farmers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Contributing Farmers ({item.farmer_count})
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Farmers contributing to this batch with their Uzhavar PIN verification
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sampleFarmers.map((farmer, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-green-700" />
                            </div>
                            <div>
                              <div className="font-medium">{farmer.name}</div>
                              <div className="text-sm text-muted-foreground font-mono">{farmer.pin}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-green-600">{farmer.contribution}</div>
                            <div className="text-xs text-muted-foreground">contribution</div>
                          </div>
                        </motion.div>
                      ))}
                      {item.farmer_count > 4 && (
                        <div className="text-center text-sm text-muted-foreground py-2">
                          +{item.farmer_count - 4} more farmers contributing to this batch
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="blockchain" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Blockchain Information
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Immutable record of this crop batch on blockchain
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium text-blue-800">Smart Contract Address</div>
                        <Button variant="ghost" size="sm" onClick={handleCopyContract}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="font-mono text-sm text-blue-700 break-all">
                        {item.blockchain_contract_id}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-green-600 font-medium">✓ Verified</div>
                        <div className="text-xs text-muted-foreground mt-1">Contract Status</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-blue-600 font-medium">Active</div>
                        <div className="text-xs text-muted-foreground mt-1">Current State</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button variant="outline" className="w-full flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View on Blockchain Explorer
                      </Button>
                      <Button variant="outline" className="w-full flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Verify Authenticity
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Community Price History</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Price evolution over the last 3 months
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceHistory}>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#22c55e" 
                            strokeWidth={2}
                            dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center text-sm text-muted-foreground mt-4">
                      Current community price reflects {priceIncrease.toFixed(1)}% premium over base price
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}