import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  X, 
  Shield, 
  MapPin, 
  Calendar, 
  Leaf, 
  TrendingUp, 
  TrendingDown, 
  Thermometer,
  Droplets,
  Award,
  Truck,
  User,
  Phone,
  Mail,
  Navigation,
  BarChart3,
  Zap,
  CheckCircle
} from 'lucide-react';
import { QRProduct } from '../../data/qrProducts';
import { LiveTrackingMap } from '../tracking/LiveTrackingMap';

interface ProductDetailsViewProps {
  product: QRProduct;
  onClose: () => void;
  userType?: 'consumer' | 'warehouse';
}

export function ProductDetailsView({ product, onClose, userType = 'consumer' }: ProductDetailsViewProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProfitLossColor = (margin: number) => {
    if (margin >= 30) return 'text-green-600';
    if (margin >= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProfitLossIcon = (margin: number) => {
    return margin >= 15 ? TrendingUp : TrendingDown;
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 10) return 'bg-green-100 text-green-700';
    if (risk <= 20) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="border-2 border-green-200">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={product.farmerPhoto} 
                    alt={product.farmerName}
                    className="w-12 h-12 rounded-full border-2 border-white/30"
                  />
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {product.cropType}
                      {product.verified && (
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-green-100">by {product.farmerName} • {product.taluk}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="farmer">Farmer Info</TabsTrigger>
                  <TabsTrigger value="quality">Quality</TabsTrigger>
                  <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6 space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4 text-center">
                        <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-semibold text-green-700">{product.quantity}</p>
                        <p className="text-sm text-green-600">{product.unit}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-semibold text-blue-700">{product.qualityGrade}</p>
                        <p className="text-sm text-blue-600">Quality Grade</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-amber-50 border-amber-200">
                      <CardContent className="p-4 text-center">
                        <BarChart3 className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                        <p className="text-2xl font-semibold text-amber-700">{product.profitMargin}%</p>
                        <p className="text-sm text-amber-600">Profit Margin</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4 text-center">
                        <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-semibold text-purple-700">{product.carbonFootprint}</p>
                        <p className="text-sm text-purple-600">kg CO₂</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Product Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-green-600" />
                          Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Harvested:</span>
                          <Badge variant="outline">{formatDate(product.harvestDate)}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Expected Delivery:</span>
                          <Badge variant="outline">{formatDate(product.estimatedDelivery)}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Created:</span>
                          <Badge variant="outline">{formatDate(product.createdAt)}</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          Financial Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Price per {product.unit}:</span>
                          <Badge variant="outline">{formatCurrency(product.pricePerUnit)}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Value:</span>
                          <Badge variant="outline" className="text-green-700">{formatCurrency(product.totalValue)}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Profit Margin:</span>
                          <Badge 
                            variant="outline" 
                            className={getProfitLossColor(product.profitMargin)}
                          >
                            {React.createElement(getProfitLossIcon(product.profitMargin), { className: "w-3 h-3 mr-1" })}
                            {product.profitMargin}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Risk Level:</span>
                          <Badge className={getRiskColor(product.lossRisk)}>
                            {product.lossRisk}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Blockchain Verification */}
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Blockchain Verification
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium">Blockchain ID: {product.blockchainId}</p>
                          <p className="text-sm text-gray-600">QR Code: {product.qrCodeId}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        This product has been verified on the blockchain and is guaranteed authentic. 
                        All information is tamper-proof and traceable.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Farmer Info Tab */}
                <TabsContent value="farmer" className="mt-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5 text-green-600" />
                          Farmer Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={product.farmerPhoto} 
                            alt={product.farmerName}
                            className="w-16 h-16 rounded-full border-2 border-green-200"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">{product.farmerName}</h3>
                            <p className="text-gray-600">{product.taluk}, Tamil Nadu</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">+91 98xxx xxxxx</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{product.farmerName.toLowerCase().replace(' ', '.')}@farmer.com</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-red-600" />
                          Farm Location
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm">{product.farmLocation.address}</p>
                        
                        <div className="bg-gray-100 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Coordinates:</span>
                            <Badge variant="outline" className="text-xs">
                              {product.farmLocation.coordinates.lat}, {product.farmLocation.coordinates.lng}
                            </Badge>
                          </div>
                          <Button size="sm" variant="outline" className="w-full">
                            <Navigation className="w-4 h-4 mr-2" />
                            View on Map
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Quality Tab */}
                <TabsContent value="quality" className="mt-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Leaf className="w-5 h-5 text-green-600" />
                          Cultivation Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Variety:</span>
                          <Badge variant="outline">{product.variety || 'Standard'}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Soil Health:</span>
                          <Badge variant="outline" className="text-green-700">{product.soilHealth}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Water Source:</span>
                          <Badge variant="outline">{product.waterSource}</Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Fertilizers Used:</p>
                          <div className="flex flex-wrap gap-1">
                            {product.fertilizers.map((fertilizer, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {fertilizer}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Pest Control:</p>
                          <div className="flex flex-wrap gap-1">
                            {product.pesticides.map((pesticide, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {pesticide}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Thermometer className="w-5 h-5 text-orange-600" />
                          Storage & Quality
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Storage Temperature:</span>
                          <Badge variant="outline">{product.storageTemp}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Moisture Content:</span>
                          <Badge variant="outline" className="text-blue-700">
                            <Droplets className="w-3 h-3 mr-1" />
                            {product.moistureContent}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Quality Grade:</span>
                          <Badge className="bg-green-600 text-white">{product.qualityGrade}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Organic Certified:</span>
                          <Badge 
                            variant={product.organicCertified ? "default" : "secondary"}
                            className={product.organicCertified ? "bg-green-600" : ""}
                          >
                            {product.organicCertified ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-800">
                            <strong>Carbon Footprint:</strong> {product.carbonFootprint}kg CO₂ equivalent
                            <br />
                            <span className="text-xs">Environmental impact per unit</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Live Tracking Tab */}
                <TabsContent value="tracking" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-blue-600" />
                        Live Delivery Tracking
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium mb-2">Delivery Route</h4>
                          <div className="flex flex-wrap gap-2">
                            {product.deliveryRoute.map((location, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Badge variant="outline">{location}</Badge>
                                {index < product.deliveryRoute.length - 1 && (
                                  <span className="text-gray-400">→</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center text-gray-600">
                            <Truck className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p>Live 3D tracking map will be integrated here</p>
                            <p className="text-sm">Showing real-time location and delivery status</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}