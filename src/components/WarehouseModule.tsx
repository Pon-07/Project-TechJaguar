import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Warehouse, MapPin, Package, TrendingUp, Download, Navigation, Phone, BarChart3, Bot, Bell, Shield, Factory, Globe, Zap, Eye } from 'lucide-react';
import { EnhancedIcon, getThemeColor } from './EnhancedIcon';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { indiaWarehousesData } from '../data/indiaWideWarehouseData';
import { India3DLiveTracking } from './warehouse/India3DLiveTracking';
import { SafeWarehouseHub } from './warehouse/SafeWarehouseHub';
import { IndiaQRSystemStrict } from './warehouse/IndiaQRSystemStrict';
import { IndiaPredictiveAnalytics } from './warehouse/IndiaPredictiveAnalytics';
import { IndiaNotificationSystem } from './warehouse/IndiaNotificationSystem';
import { WarehouseProductHistory } from './warehouse/WarehouseProductHistory';
import { CallButton } from './CallButton';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';

export function WarehouseModule() {
  const [activeMainTab, setActiveMainTab] = useState<'overview' | '3d-tracking' | 'qr-system' | 'analytics' | 'notifications' | 'product-history'>('overview');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const { t } = useLanguage();
  const { user } = useAuth();

  // Get India-wide warehouse statistics
  const indiaStats = useMemo(() => {
    return {
      totalWarehouses: indiaWarehousesData.totalStats.totalWarehouses,
      totalCapacity: indiaWarehousesData.totalStats.totalCapacity,
      totalOccupancy: indiaWarehousesData.totalStats.totalOccupancy,
      totalTurnover: indiaWarehousesData.totalStats.totalTurnover,
      totalStates: indiaWarehousesData.totalStats.totalStates,
      totalDistricts: indiaWarehousesData.totalStats.totalDistricts,
      occupancyPercentage: indiaWarehousesData.totalStats.occupancyPercentage
    };
  }, []);

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(indiaWarehousesData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'india-warehouses-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('India warehouse data downloaded successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Globe className="w-8 h-8" />
                  India-Wide Warehouse Hub - Supreme Platform
                </h1>
                <p className="text-orange-100 mt-1">
                  3D Live Tracking • Strict QR Workflows • Predictive Analytics across {indiaStats.totalStates} states, {indiaStats.totalDistricts} districts
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Bot className="w-3 h-3 mr-1" />
                    AI Powered
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Blockchain Secured
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Bell className="w-3 h-3 mr-1" />
                    Smart Notifications
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    Strict QR Mode
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">₹{(indiaStats.totalTurnover / 100000000).toFixed(1)}K Cr</div>
                <div className="text-sm text-orange-100">India Network Value</div>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {indiaStats.totalWarehouses} Active Warehouses
                </div>
                <div className="text-xs text-orange-100 mt-1">
                  {indiaStats.occupancyPercentage}% Network Occupancy
                </div>
              </div>
            </div>

            {/* Floating India map animation */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <Globe className="w-24 h-24" />
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            {[
              { 
                label: 'Warehouse Overview', 
                icon: BarChart3, 
                color: 'text-blue-600', 
                bg: 'bg-blue-50',
                tab: 'overview',
                description: 'India-wide warehouse monitoring'
              },
              { 
                label: '3D Live Tracking', 
                icon: Navigation, 
                color: 'text-green-600', 
                bg: 'bg-green-50',
                tab: '3d-tracking',
                description: 'Interactive 3D route visualization',
                special: true
              },
              { 
                label: 'Product History', 
                icon: Factory, 
                color: 'text-orange-600', 
                bg: 'bg-orange-50',
                tab: 'product-history',
                description: 'Amazon-style product movement tracking',
                special: true
              },
              { 
                label: 'QR System (Strict)', 
                icon: Package, 
                color: 'text-purple-600', 
                bg: 'bg-purple-50',
                tab: 'qr-system',
                description: 'Strict QR workflows with dummy images',
                special: true
              },
              { 
                label: 'AI Analytics', 
                icon: Bot, 
                color: 'text-indigo-600', 
                bg: 'bg-indigo-50',
                tab: 'analytics',
                description: 'Predictive demand & stock insights'
              },
              { 
                label: 'Smart Notifications', 
                icon: Bell, 
                color: 'text-amber-600', 
                bg: 'bg-amber-50',
                tab: 'notifications',
                description: 'Glowing alerts & real-time updates'
              }
            ].map((action, index) => (
              <motion.div
                key={action.tab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveMainTab(action.tab as any)}
                className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-lg ${action.bg} ${
                  activeMainTab === action.tab ? 'ring-2 ring-offset-2 ring-blue-500 shadow-lg' : ''
                } ${action.special ? 'border-2 border-orange-300 hover:border-orange-500' : ''}`}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 ${action.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <EnhancedIcon
                      icon={action.icon}
                      size="lg"
                      glowColor={getThemeColor('warehouse')}
                      pulse={action.special || true}
                      isActive={activeMainTab === action.tab}
                      className={action.color}
                    />
                  </div>
                  <h3 className="font-semibold text-sm">{action.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  {action.special && (
                    <Badge className="mt-2 text-xs bg-orange-100 text-orange-600">Enhanced</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Demo Mode Badge */}
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              🇮🇳 India-Wide Dummy Data — AI Predicted Analytics
            </Badge>
            <Button variant="outline" size="sm" onClick={handleDownloadJSON}>
              <Download className="w-4 h-4 mr-2" />
              Export India Data
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeMainTab} onValueChange={(value) => setActiveMainTab(value as any)}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <EnhancedIcon 
                    icon={BarChart3} 
                    size="sm" 
                    glowColor={getThemeColor('warehouse')} 
                    isActive={activeMainTab === 'overview'}
                    pulse={true}
                  />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="3d-tracking" className="flex items-center gap-2">
                  <EnhancedIcon 
                    icon={Navigation} 
                    size="sm" 
                    glowColor="rgb(34, 197, 94)" 
                    isActive={activeMainTab === '3d-tracking'}
                    pulse={true}
                  />
                  3D Tracking
                </TabsTrigger>
                <TabsTrigger value="product-history" className="flex items-center gap-2">
                  <EnhancedIcon 
                    icon={Factory} 
                    size="sm" 
                    glowColor="rgb(251, 146, 60)" 
                    isActive={activeMainTab === 'product-history'}
                    pulse={true}
                  />
                  Product History
                </TabsTrigger>
                <TabsTrigger value="qr-system" className="flex items-center gap-2">
                  <EnhancedIcon 
                    icon={Package} 
                    size="sm" 
                    glowColor="rgb(147, 51, 234)" 
                    isActive={activeMainTab === 'qr-system'}
                    pulse={true}
                  />
                  QR System
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <EnhancedIcon 
                    icon={Bot} 
                    size="sm" 
                    glowColor={getThemeColor('warehouse')} 
                    isActive={activeMainTab === 'analytics'}
                    pulse={true}
                  />
                  AI Analytics
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <EnhancedIcon 
                    icon={Bell} 
                    size="sm" 
                    glowColor={getThemeColor('warehouse')} 
                    isActive={activeMainTab === 'notifications'}
                    pulse={true}
                  />
                  Notifications
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  {/* India-Wide Warehouse Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Globe className="w-5 h-5 text-blue-600" />
                          National Coverage
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">States</span>
                            <span className="font-semibold">{indiaStats.totalStates}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Districts</span>
                            <span className="font-semibold">{indiaStats.totalDistricts}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Warehouses</span>
                            <span className="font-semibold">{indiaStats.totalWarehouses}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="w-5 h-5 text-green-600" />
                          Storage Capacity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Capacity</span>
                            <span className="font-semibold">{(indiaStats.totalCapacity / 1000000).toFixed(1)}M tonnes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Current Stock</span>
                            <span className="font-semibold">{(indiaStats.totalOccupancy / 1000000).toFixed(1)}M tonnes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Utilization</span>
                            <span className="font-semibold text-green-600">{indiaStats.occupancyPercentage}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                          Network Value
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-purple-600">
                            ₹{(indiaStats.totalTurnover / 100000000).toFixed(1)}K Cr
                          </div>
                          <p className="text-sm text-muted-foreground">Total network turnover</p>
                          <div className="text-sm text-green-600">+12.5% growth this quarter</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Phone className="w-5 h-5 text-amber-600" />
                          Support Network
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <CallButton
                            phoneNumber="+91-99999-00001"
                            label="India Support"
                            description="National warehouse support"
                            module="warehouse"
                            size="sm"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Overview of India States */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                        India-Wide Warehouse Distribution
                      </CardTitle>
                      <p className="text-muted-foreground">
                        Warehouses distributed across major agricultural states
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Object.keys(indiaWarehousesData.warehouses.reduce((acc, w) => ({ ...acc, [w.state]: true }), {}))
                          .slice(0, 12)
                          .map((state) => {
                            const stateWarehouses = indiaWarehousesData.warehouses.filter(w => w.state === state);
                            const avgOccupancy = stateWarehouses.reduce((sum, w) => sum + w.occupancy_percentage, 0) / stateWarehouses.length;
                            
                            return (
                              <motion.div
                                key={state}
                                className="p-3 border rounded-lg hover:shadow-md cursor-pointer transition-all"
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedState(selectedState === state ? null : state)}
                              >
                                <h4 className="font-semibold text-sm">{state}</h4>
                                <p className="text-xs text-muted-foreground">{stateWarehouses.length} warehouses</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs">Occupancy</span>
                                  <span className="text-xs font-semibold">{Math.round(avgOccupancy)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                  <div 
                                    className="bg-blue-500 h-1 rounded-full transition-all"
                                    style={{ width: `${avgOccupancy}%` }}
                                  />
                                </div>
                              </motion.div>
                            );
                          })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* 3D Live Tracking Tab */}
              <TabsContent value="3d-tracking" className="mt-6">
                <SafeWarehouseHub />
              </TabsContent>

              {/* Product History Tab */}
              <TabsContent value="product-history" className="mt-6">
                <WarehouseProductHistory />
              </TabsContent>

              {/* QR System Tab */}
              <TabsContent value="qr-system" className="mt-6">
                <IndiaQRSystemStrict />
              </TabsContent>

              {/* Predictive Analytics Tab */}
              <TabsContent value="analytics" className="mt-6">
                <IndiaPredictiveAnalytics />
              </TabsContent>

              {/* Enhanced Notifications Tab */}
              <TabsContent value="notifications" className="mt-6">
                <IndiaNotificationSystem />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}