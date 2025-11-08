import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  Bot,
  Sparkles,
  Calendar,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface CropAnalyticsDashboardProps {
  user: any;
}

// Dummy data for analytics
const cropProfitData = [
  { crop: 'Paddy', currentProfit: 420000, predictedProfit: 450000, acres: 10 },
  { crop: 'Groundnut', currentProfit: 200000, predictedProfit: 180000, acres: 5 }
];

const priceHistoryData = [
  { month: 'Jan', paddy: 38, groundnut: 78 },
  { month: 'Feb', paddy: 40, groundnut: 80 },
  { month: 'Mar', paddy: 42, groundnut: 85 },
  { month: 'Apr', paddy: 43, groundnut: 83 },
  { month: 'May', paddy: 45, groundnut: 87 },
  { month: 'Jun', paddy: 44, groundnut: 85 }
];

const priceforecastData = [
  { month: 'Jul', paddy: 42, groundnut: 85, paddyForecast: 44, groundnutForecast: 88 },
  { month: 'Aug', paddy: null, groundnut: null, paddyForecast: 45, groundnutForecast: 90 },
  { month: 'Sep', paddy: null, groundnut: null, paddyForecast: 47, groundnutForecast: 92 }
];

const yieldComparisonData = [
  { crop: 'Paddy', expected: 20000, actual: 19500, efficiency: 97.5 },
  { crop: 'Groundnut', expected: 7000, actual: 6800, efficiency: 97.1 }
];

const aiInsights = [
  {
    type: 'profit',
    icon: TrendingUp,
    title: 'Profit Optimization',
    insight: 'Your groundnut yield is 2.9% below target. Consider adjusting irrigation schedule for next season.',
    impact: 'Potential +₹15,000 increase',
    confidence: 89
  },
  {
    type: 'market',
    icon: Target,
    title: 'Market Timing',
    insight: 'Paddy prices expected to peak in September. Consider holding 30% of harvest until then.',
    impact: 'Potential +₹35,000 increase',
    confidence: 94
  },
  {
    type: 'weather',
    icon: Bot,
    title: 'Weather Impact',
    insight: 'Monsoon forecast favorable for next season. Plan 15% increased planting area.',
    impact: 'Potential +₹80,000 increase',
    confidence: 76
  }
];

const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6'];

export function CropAnalyticsDashboard({ user }: CropAnalyticsDashboardProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Header with AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Bot className="w-6 h-6" />
              AI Crop Analytics Dashboard
            </h2>
            <p className="text-green-100 mt-1">
              AI-powered insights for {user?.name || 'Ramesh Kumar'} • Madurai Taluk
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <MapPin className="w-3 h-3 mr-1" />
                15 acres total
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Calendar className="w-3 h-3 mr-1" />
                Current Season: Kharif 2024
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹6,20,000</div>
            <div className="text-sm text-green-100">AI Predicted Net Profit</div>
            <div className="flex items-center text-sm mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5% vs last season
            </div>
          </div>
        </div>
        
        {/* Floating AI elements */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-24 h-24" />
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Profit Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Crop Profit Analysis
              </CardTitle>
              <p className="text-muted-foreground">Current vs Predicted Profits</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cropProfitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" />
                  <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                  <Tooltip 
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, '']}
                    labelFormatter={(label) => `${label} Profit`}
                  />
                  <Bar dataKey="currentProfit" fill="#22c55e" name="Current" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="predictedProfit" fill="#f59e0b" name="Predicted" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                {cropProfitData.map((crop, index) => (
                  <div key={crop.crop} className="text-center p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700">{crop.crop}</h4>
                    <p className="text-sm text-muted-foreground">{crop.acres} acres</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      {crop.predictedProfit > crop.currentProfit ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium">
                        {((crop.predictedProfit - crop.currentProfit) / crop.currentProfit * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Price Forecast */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                3-Month Price Forecast
              </CardTitle>
              <p className="text-muted-foreground">AI Predicted Market Prices</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={[...priceHistoryData, ...priceforecastData]}>
                  <defs>
                    <linearGradient id="paddyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="groundnutGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${value}`} />
                  <Tooltip formatter={(value: any) => [`₹${value}/kg`, '']} />
                  
                  {/* Historical data */}
                  <Area 
                    type="monotone" 
                    dataKey="paddy" 
                    stroke="#22c55e" 
                    fillOpacity={1} 
                    fill="url(#paddyGradient)"
                    name="Paddy (Historical)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="groundnut" 
                    stroke="#f59e0b" 
                    fillOpacity={1} 
                    fill="url(#groundnutGradient)"
                    name="Groundnut (Historical)"
                  />
                  
                  {/* Forecast data */}
                  <Line 
                    type="monotone" 
                    dataKey="paddyForecast" 
                    stroke="#22c55e" 
                    strokeDasharray="8 8"
                    name="Paddy (Forecast)"
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="groundnutForecast" 
                    stroke="#f59e0b" 
                    strokeDasharray="8 8"
                    name="Groundnut (Forecast)"
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <h4 className="font-semibold text-green-700">Paddy Forecast</h4>
                  <p className="text-sm text-muted-foreground">₹42 → ₹47/kg</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 mt-1">
                    +11.9% in 3 months
                  </Badge>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg text-center">
                  <h4 className="font-semibold text-amber-700">Groundnut Forecast</h4>
                  <p className="text-sm text-muted-foreground">₹85 → ₹92/kg</p>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 mt-1">
                    +8.2% in 3 months
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Yield Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Yield Performance Analysis
            </CardTitle>
            <p className="text-muted-foreground">Expected vs Actual Yield Comparison</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {yieldComparisonData.map((crop, index) => (
                <div key={crop.crop} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{crop.crop}</h4>
                    <Badge 
                      variant={crop.efficiency >= 95 ? "default" : "secondary"}
                      className={crop.efficiency >= 95 ? "bg-green-600" : "bg-amber-500"}
                    >
                      {crop.efficiency}% Efficiency
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Expected: {crop.expected.toLocaleString()} kg</span>
                      <span>Actual: {crop.actual.toLocaleString()} kg</span>
                    </div>
                    <Progress value={crop.efficiency} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Gap: {(crop.expected - crop.actual).toLocaleString()} kg 
                      ({((crop.expected - crop.actual) / crop.expected * 100).toFixed(1)}% below target)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              AI-Generated Insights
            </CardTitle>
            <p className="text-muted-foreground">Personalized recommendations based on your farm data</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight, index) => (
                <motion.div
                  key={insight.type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <insight.icon className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-semibold">{insight.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{insight.insight}</p>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-green-600">{insight.impact}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Confidence</span>
                      <Badge variant="outline">{insight.confidence}%</Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}