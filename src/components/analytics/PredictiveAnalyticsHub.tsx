import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  MapPin,
  Calendar,
  Zap,
  Target,
  DollarSign,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Brain,
  Globe,
  Layers,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, Legend } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  indianStates, 
  cropDemandPredictions, 
  getCropImage,
  CropDemand 
} from '../../data/indiaWideData';

interface PredictiveAnalyticsHubProps {
  viewMode?: 'farmer' | 'warehouse' | 'consumer';
}

export function PredictiveAnalyticsHub({ viewMode = 'farmer' }: PredictiveAnalyticsHubProps) {
  const { t } = useLanguage();
  const [selectedState, setSelectedState] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('3months');
  const [analyticsData, setAnalyticsData] = useState({
    demandTrends: cropDemandPredictions,
    priceForecasts: [] as any[],
    marketInsights: [] as any[],
    recommendations: [] as any[]
  });

  // Generate dynamic data based on time
  useEffect(() => {
    const generateDynamicData = () => {
      // Price forecasts with realistic fluctuations
      const priceData = [
        { month: 'Jan', rice: 28, wheat: 25, cotton: 65, groundnut: 45 },
        { month: 'Feb', rice: 30, wheat: 26, cotton: 67, groundnut: 47 },
        { month: 'Mar', rice: 32, wheat: 28, cotton: 70, groundnut: 50 },
        { month: 'Apr', rice: 35, wheat: 30, cotton: 72, groundnut: 52 },
        { month: 'May', rice: 33, wheat: 29, cotton: 68, groundnut: 49 },
        { month: 'Jun', rice: 31, wheat: 27, cotton: 65, groundnut: 46 }
      ];

      // Market insights
      const insights = [
        {
          id: 1,
          type: 'demand',
          state: 'Punjab',
          crop: 'Wheat',
          trend: 'increasing',
          confidence: 94,
          impact: 'high',
          description: 'Wheat demand expected to surge by 30% due to government procurement',
          timeframe: 'Next 2 months'
        },
        {
          id: 2,
          type: 'price',
          state: 'Tamil Nadu',
          crop: 'Rice',
          trend: 'increasing',
          confidence: 87,
          impact: 'medium',
          description: 'Rice prices likely to rise due to monsoon delays',
          timeframe: 'Next month'
        },
        {
          id: 3,
          type: 'supply',
          state: 'Maharashtra',
          crop: 'Cotton',
          trend: 'stable',
          confidence: 91,
          impact: 'medium',
          description: 'Cotton supply stable, ideal time for planting',
          timeframe: 'Current season'
        },
        {
          id: 4,
          type: 'demand',
          state: 'West Bengal',
          crop: 'Rice',
          trend: 'increasing',
          confidence: 89,
          impact: 'high',
          description: 'Export demand for Bengal rice increasing in international markets',
          timeframe: 'Next 3 months'
        }
      ];

      // AI Recommendations
      const recommendations = [
        {
          id: 1,
          type: 'crop_suggestion',
          priority: 'high',
          crop: 'Wheat',
          state: 'Punjab',
          reason: 'Projected 30% demand increase',
          potential_profit: 45000,
          confidence: 92,
          season: 'Rabi 2025'
        },
        {
          id: 2,
          type: 'price_timing',
          priority: 'medium',
          crop: 'Rice',
          state: 'Tamil Nadu',
          reason: 'Optimal selling window approaching',
          potential_profit: 15000,
          confidence: 85,
          season: 'Current'
        },
        {
          id: 3,
          type: 'diversification',
          priority: 'high',
          crop: 'Spices',
          state: 'Kerala',
          reason: 'Export demand surge predicted',
          potential_profit: 60000,
          confidence: 88,
          season: 'Year-round'
        },
        {
          id: 4,
          type: 'technology',
          priority: 'medium',
          crop: 'Cotton',
          state: 'Maharashtra',
          reason: 'Precision farming can increase yield by 25%',
          potential_profit: 35000,
          confidence: 79,
          season: 'Kharif 2025'
        }
      ];

      setAnalyticsData(prev => ({
        ...prev,
        priceForecasts: priceData,
        marketInsights: insights,
        recommendations: recommendations
      }));
    };

    generateDynamicData();
    
    // Update data every 30 seconds for demo
    const interval = setInterval(generateDynamicData, 30000);
    return () => clearInterval(interval);
  }, [selectedState, timeframe]);

  const filteredDemandData = selectedState === 'all' 
    ? analyticsData.demandTrends 
    : analyticsData.demandTrends.filter(item => item.state === selectedState);

  const filteredInsights = selectedState === 'all'
    ? analyticsData.marketInsights
    : analyticsData.marketInsights.filter(item => item.state === selectedState);

  const getStateColor = (index: number) => {
    const colors = ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];
    return colors[index % colors.length];
  };

  const getTrendIcon = (trend: string, size = 'w-4 h-4') => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className={`${size} text-green-500`} />;
      case 'decreasing':
        return <TrendingDown className={`${size} text-red-500`} />;
      default:
        return <ArrowRight className={`${size} text-blue-500`} />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-300">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Low Priority</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Brain className="w-6 h-6" />
              AI Predictive Analytics - India-wide Insights
            </CardTitle>
            <div className="flex gap-2">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {indianStates.map(state => (
                    <SelectItem key={state.code} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="demand" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="demand" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Demand Forecast
              </TabsTrigger>
              <TabsTrigger value="prices" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Price Trends
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Market Insights
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                AI Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="demand" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* High Demand Crops Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">High Demand Crops by State</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredDemandData.slice(0, 6)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="crop" />
                          <YAxis />
                          <Tooltip 
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white p-3 border rounded-lg shadow-lg">
                                    <p className="font-semibold">{label}</p>
                                    <p className="text-blue-600">State: {data.state}</p>
                                    <p className="text-green-600">Demand: {data.demandTrend > 0 ? '+' : ''}{data.demandTrend}%</p>
                                    <p className="text-purple-600">Price: ₹{data.currentPrice}/kg</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="demandTrend" fill="#22c55e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Demand Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Demand Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={filteredDemandData.slice(0, 5)}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="demandTrend"
                            nameKey="crop"
                          >
                            {filteredDemandData.slice(0, 5).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getStateColor(index)} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Demand Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDemandData.map((item, index) => (
                  <motion.div
                    key={`${item.crop}-${item.state}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={getCropImage(item.crop)}
                              alt={item.crop}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-semibold">{item.crop}</h4>
                              <p className="text-sm text-gray-600">{item.state}</p>
                            </div>
                          </div>
                          {getTrendIcon(item.demandTrend > 0 ? 'increasing' : 'decreasing')}
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Current Price</span>
                            <span className="font-semibold">₹{item.currentPrice}/kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Demand Trend</span>
                            <span className={`font-semibold ${item.demandTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.demandTrend > 0 ? '+' : ''}{item.demandTrend}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Prediction</span>
                            <Badge variant="outline" className="text-xs">
                              {item.predictedDemand}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="prices" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Price Forecast Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.priceForecasts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="rice" stroke="#22c55e" strokeWidth={3} />
                        <Line type="monotone" dataKey="wheat" stroke="#f59e0b" strokeWidth={3} />
                        <Line type="monotone" dataKey="cotton" stroke="#3b82f6" strokeWidth={3} />
                        <Line type="monotone" dataKey="groundnut" stroke="#8b5cf6" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredInsights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              insight.impact === 'high' ? 'bg-red-100' :
                              insight.impact === 'medium' ? 'bg-yellow-100' :
                              'bg-green-100'
                            }`}>
                              {insight.type === 'demand' && <TrendingUp className="w-6 h-6 text-red-600" />}
                              {insight.type === 'price' && <DollarSign className="w-6 h-6 text-yellow-600" />}
                              {insight.type === 'supply' && <Layers className="w-6 h-6 text-green-600" />}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{insight.crop}</h3>
                              <p className="text-gray-600">{insight.state}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Zap className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium">{insight.confidence}% confidence</span>
                            </div>
                            {getTrendIcon(insight.trend)}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3">{insight.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <Badge className={`${
                            insight.impact === 'high' ? 'bg-red-100 text-red-800 border-red-300' :
                            insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                            'bg-green-100 text-green-800 border-green-300'
                          }`}>
                            {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {insight.timeframe}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analyticsData.recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Brain className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{rec.crop}</h3>
                              <p className="text-gray-600">{rec.state}</p>
                            </div>
                          </div>
                          {getPriorityBadge(rec.priority)}
                        </div>

                        <p className="text-gray-700 mb-4">{rec.reason}</p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">₹{rec.potential_profit.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Potential Profit</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{rec.confidence}%</div>
                            <div className="text-sm text-gray-600">AI Confidence</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {rec.season}
                          </div>
                          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                            <Target className="w-4 h-4 mr-2" />
                            Act on This
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}