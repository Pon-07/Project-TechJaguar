import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Bot,
  Zap,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Package,
  Clock,
  Target,
  Brain,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { warehousesData, Warehouse as WarehouseType } from '../../data/warehouses';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface PredictiveAnalyticsProps {
  selectedWarehouse?: WarehouseType;
}

// Dummy predictive data generators
const generateDemandPrediction = (warehouse: WarehouseType) => {
  return warehouse.inventory.map(item => {
    const baseDemand = item.total_quantity_kg * 0.15; // 15% weekly demand
    const seasonalMultiplier = Math.random() * 0.5 + 0.75; // 0.75-1.25x
    const trendMultiplier = Math.random() * 0.3 + 0.85; // 0.85-1.15x
    
    return {
      crop: item.name,
      currentStock: item.total_quantity_kg,
      predictedDemand: Math.floor(baseDemand * seasonalMultiplier * trendMultiplier),
      confidence: 75 + Math.random() * 20, // 75-95% confidence
      daysUntilStockout: Math.floor(item.total_quantity_kg / (baseDemand * seasonalMultiplier)),
      suggestedRestock: Math.floor(baseDemand * 4), // 4 weeks stock
      priceOptimization: {
        current: item.community_price_per_kg,
        suggested: item.community_price_per_kg * (0.95 + Math.random() * 0.1), // ±5% optimization
        impact: (Math.random() - 0.5) * 10000 // Revenue impact
      }
    };
  });
};

const generateMarketTrends = () => {
  const crops = ['Paddy', 'Groundnut', 'Turmeric', 'Tomato', 'Onion', 'Coconut'];
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  
  return months.map(month => {
    const data = { month };
    crops.forEach(crop => {
      const basePrice = 50 + Math.random() * 100;
      const trend = (Math.random() - 0.5) * 20;
      data[crop] = Math.max(10, basePrice + trend);
    });
    return data;
  });
};

const generateOptimalPricing = (warehouse: WarehouseType) => {
  return warehouse.inventory.map(item => {
    const marketDemand = 70 + Math.random() * 30; // 70-100% market demand
    const competition = 60 + Math.random() * 40; // 60-100% competition level
    const stockLevel = (item.total_quantity_kg / 50000) * 100; // Normalize to percentage
    
    const currentPrice = item.community_price_per_kg;
    const marketPrice = currentPrice * (0.9 + Math.random() * 0.2); // Market variance
    const suggestedPrice = currentPrice * (0.95 + Math.random() * 0.1); // Optimization
    
    return {
      crop: item.name,
      variety: item.variety,
      currentPrice,
      marketPrice: Math.round(marketPrice * 100) / 100,
      suggestedPrice: Math.round(suggestedPrice * 100) / 100,
      marketDemand,
      competition,
      stockLevel: Math.min(100, stockLevel),
      revenueImpact: Math.floor((suggestedPrice - currentPrice) * item.total_quantity_kg),
      confidence: 80 + Math.random() * 15
    };
  });
};

const generateStockoutPredictions = (warehouse: WarehouseType) => {
  return warehouse.inventory.map(item => {
    const dailyConsumption = item.total_quantity_kg * (0.02 + Math.random() * 0.03); // 2-5% daily
    const daysRemaining = Math.floor(item.total_quantity_kg / dailyConsumption);
    const urgency = daysRemaining < 7 ? 'high' : daysRemaining < 14 ? 'medium' : 'low';
    
    return {
      crop: item.name,
      currentStock: item.total_quantity_kg,
      dailyConsumption: Math.floor(dailyConsumption),
      daysRemaining,
      urgency,
      restockSuggestion: Math.floor(dailyConsumption * 30), // 30 days stock
      farmer_count: item.farmer_count,
      batch_id: item.batch_id
    };
  });
};

export function PredictiveAnalytics({ selectedWarehouse }: PredictiveAnalyticsProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'demand' | 'pricing' | 'stockout' | 'trends'>('demand');
  const [refreshing, setRefreshing] = useState(false);

  const warehouses = warehousesData.warehouses;
  const targetWarehouse = selectedWarehouse || warehouses[0]; // Default to first warehouse

  // Generate predictions
  const demandPredictions = useMemo(() => generateDemandPrediction(targetWarehouse), [targetWarehouse]);
  const marketTrends = useMemo(() => generateMarketTrends(), []);
  const pricingOptimization = useMemo(() => generateOptimalPricing(targetWarehouse), [targetWarehouse]);
  const stockoutPredictions = useMemo(() => generateStockoutPredictions(targetWarehouse), [targetWarehouse]);

  // AI Insights
  const aiInsights = useMemo(() => {
    const highDemandCrop = demandPredictions.reduce((max, crop) => 
      crop.predictedDemand > max.predictedDemand ? crop : max
    );
    
    const criticalStock = stockoutPredictions.filter(item => item.urgency === 'high');
    const bestPriceOpportunity = pricingOptimization.reduce((max, crop) => 
      crop.revenueImpact > max.revenueImpact ? crop : max
    );

    return {
      highDemandCrop,
      criticalStockCount: criticalStock.length,
      bestPriceOpportunity,
      totalRevenueOpportunity: pricingOptimization.reduce((sum, crop) => sum + Math.max(0, crop.revenueImpact), 0)
    };
  }, [demandPredictions, stockoutPredictions, pricingOptimization]);

  const handleRefreshPredictions = async () => {
    setRefreshing(true);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
    toast.success('AI predictions updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="w-6 h-6" />
              AI Predictive Analytics
            </h2>
            <p className="text-purple-100 mt-1">
              Advanced ML predictions for {targetWarehouse.warehouse_id} • {targetWarehouse.taluk}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Bot className="w-3 h-3 mr-1" />
                AI Confidence: 87%
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Zap className="w-3 h-3 mr-1" />
                Real-time Analysis
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹{(aiInsights.totalRevenueOpportunity / 1000).toFixed(1)}K</div>
            <div className="text-sm text-purple-100">Revenue Opportunity</div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-2 bg-white/20 hover:bg-white/30"
              onClick={handleRefreshPredictions}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  Refresh AI
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Floating AI elements */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-24 h-24" />
          </motion.div>
        </div>
      </motion.div>

      {/* AI Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold">High Demand Alert</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{aiInsights.highDemandCrop.crop}</p>
            <p className="text-lg font-bold text-green-600">
              {aiInsights.highDemandCrop.predictedDemand.toLocaleString()} kg
            </p>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold">Stock Alerts</h4>
            </div>
            <p className="text-lg font-bold text-red-600">{aiInsights.criticalStockCount}</p>
            <p className="text-xs text-muted-foreground">Critical stock levels</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold">Price Opportunity</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{aiInsights.bestPriceOpportunity.crop}</p>
            <p className="text-lg font-bold text-blue-600">
              ₹{(aiInsights.bestPriceOpportunity.revenueImpact / 1000).toFixed(1)}K
            </p>
            <p className="text-xs text-muted-foreground">Revenue impact</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold">Total Opportunity</h4>
            </div>
            <p className="text-lg font-bold text-purple-600">
              ₹{(aiInsights.totalRevenueOpportunity / 1000).toFixed(1)}K
            </p>
            <p className="text-xs text-muted-foreground">This month potential</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="demand" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Demand Prediction
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Price Optimization
              </TabsTrigger>
              <TabsTrigger value="stockout" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Stock Alerts
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Market Trends
              </TabsTrigger>
            </TabsList>

            {/* Demand Prediction Tab */}
            <TabsContent value="demand" className="mt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Demand Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>7-Day Demand Forecast</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={demandPredictions}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="crop" angle={-45} textAnchor="end" height={60} />
                          <YAxis tickFormatter={(value) => `${value/1000}k`} />
                          <Tooltip formatter={(value: any) => [`${value.toLocaleString()} kg`, '']} />
                          <Bar dataKey="predictedDemand" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Stock vs Demand */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Stock vs Predicted Demand</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={demandPredictions}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="crop" angle={-45} textAnchor="end" height={60} />
                          <YAxis tickFormatter={(value) => `${value/1000}k`} />
                          <Tooltip formatter={(value: any) => [`${value.toLocaleString()} kg`, '']} />
                          <Bar dataKey="currentStock" fill="#22c55e" name="Current Stock" />
                          <Bar dataKey="predictedDemand" fill="#f59e0b" name="Predicted Demand" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Demand Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {demandPredictions.map((prediction, index) => (
                    <motion.div
                      key={prediction.crop}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{prediction.crop}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Predicted Demand:</span>
                              <span className="font-medium">{prediction.predictedDemand.toLocaleString()} kg</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Days until stockout:</span>
                              <span className={`font-medium ${
                                prediction.daysUntilStockout < 7 ? 'text-red-600' : 
                                prediction.daysUntilStockout < 14 ? 'text-amber-600' : 'text-green-600'
                              }`}>
                                {prediction.daysUntilStockout} days
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>AI Confidence:</span>
                              <span className="font-medium">{prediction.confidence.toFixed(1)}%</span>
                            </div>
                            <Progress value={prediction.confidence} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Price Optimization Tab */}
            <TabsContent value="pricing" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Optimal Pricing Suggestions</CardTitle>
                    <p className="text-muted-foreground">AI-powered price optimization based on market demand and competition</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {pricingOptimization.map((item, index) => (
                        <motion.div
                          key={item.crop}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 border rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold">{item.crop}</h4>
                              <p className="text-sm text-muted-foreground">{item.variety}</p>
                            </div>
                            <Badge 
                              variant={item.revenueImpact > 0 ? 'default' : 'secondary'}
                              className={item.revenueImpact > 0 ? 'bg-green-600' : 'bg-red-600'}
                            >
                              {item.revenueImpact > 0 ? '+' : ''}₹{(item.revenueImpact / 1000).toFixed(1)}K
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-sm text-muted-foreground">Current</p>
                                <p className="font-bold">₹{item.currentPrice}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Market</p>
                                <p className="font-bold">₹{item.marketPrice}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Suggested</p>
                                <p className="font-bold text-green-600">₹{item.suggestedPrice}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Market Demand:</span>
                                <span>{item.marketDemand.toFixed(1)}%</span>
                              </div>
                              <Progress value={item.marketDemand} className="h-2" />
                              
                              <div className="flex justify-between text-sm">
                                <span>Competition Level:</span>
                                <span>{item.competition.toFixed(1)}%</span>
                              </div>
                              <Progress value={item.competition} className="h-2 bg-red-100" />
                              
                              <div className="flex justify-between text-sm">
                                <span>Confidence:</span>
                                <span>{item.confidence.toFixed(1)}%</span>
                              </div>
                              <Progress value={item.confidence} className="h-2 bg-purple-100" />
                            </div>

                            <Button 
                              size="sm" 
                              className="w-full bg-green-600 hover:bg-green-700"
                              onClick={() => toast.success(`Price updated for ${item.crop} to ₹${item.suggestedPrice}/kg`)}
                            >
                              Apply Suggested Price
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Stock Alerts Tab */}
            <TabsContent value="stockout" className="mt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stockoutPredictions.map((item, index) => (
                    <motion.div
                      key={item.crop}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`border-l-4 ${
                        item.urgency === 'high' ? 'border-l-red-500' :
                        item.urgency === 'medium' ? 'border-l-amber-500' : 'border-l-green-500'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">{item.crop}</h4>
                            <Badge 
                              variant={item.urgency === 'high' ? 'destructive' : item.urgency === 'medium' ? 'secondary' : 'default'}
                              className={
                                item.urgency === 'high' ? 'bg-red-600' :
                                item.urgency === 'medium' ? 'bg-amber-500' : 'bg-green-600'
                              }
                            >
                              {item.urgency.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Current Stock:</span>
                              <span className="font-medium">{item.currentStock.toLocaleString()} kg</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Daily Consumption:</span>
                              <span className="font-medium">{item.dailyConsumption.toLocaleString()} kg</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Days Remaining:</span>
                              <span className={`font-medium ${
                                item.daysRemaining < 7 ? 'text-red-600' : 
                                item.daysRemaining < 14 ? 'text-amber-600' : 'text-green-600'
                              }`}>
                                {item.daysRemaining} days
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Restock Suggestion:</span>
                              <span className="font-medium">{item.restockSuggestion.toLocaleString()} kg</span>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t">
                            <div className="text-xs text-muted-foreground mb-2">
                              {item.farmer_count} farmers • Batch: {item.batch_id}
                            </div>
                            <Button 
                              size="sm" 
                              variant={item.urgency === 'high' ? 'destructive' : 'outline'}
                              className="w-full"
                              onClick={() => toast.success(`Restock order initiated for ${item.crop}`)}
                            >
                              {item.urgency === 'high' ? 'Urgent Restock' : 'Schedule Restock'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Market Trends Tab */}
            <TabsContent value="trends" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>6-Month Market Price Trends</CardTitle>
                    <p className="text-muted-foreground">Historical and predicted price movements</p>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={marketTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `₹${value}`} />
                        <Tooltip formatter={(value: any) => [`₹${value.toFixed(2)}/kg`, '']} />
                        <Line type="monotone" dataKey="Paddy" stroke="#22c55e" strokeWidth={2} />
                        <Line type="monotone" dataKey="Groundnut" stroke="#f59e0b" strokeWidth={2} />
                        <Line type="monotone" dataKey="Turmeric" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="Tomato" stroke="#ef4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="Onion" stroke="#8b5cf6" strokeWidth={2} />
                        <Line type="monotone" dataKey="Coconut" stroke="#06b6d4" strokeWidth={2} />
                        <Legend />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}