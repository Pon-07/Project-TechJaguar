import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import {
  MapPin,
  TreePine,
  Target,
  TrendingUp,
  TrendingDown,
  Eye,
  BarChart3,
  Map,
  Leaf,
  Calculator,
  Globe
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';

interface LandYieldTrackerProps {
  user: any;
}

// Dummy land and yield data
const landData = {
  totalAcres: 15,
  cultivatedAcres: 15,
  fallowAcres: 0,
  location: 'Madurai Taluk, Tamil Nadu',
  surveyNumbers: ['SF No. 123/1A', 'SF No. 124/2B', 'SF No. 125/1'],
  soilType: 'Red Loamy',
  irrigationType: 'Drip + Bore Well'
};

const cropDistribution = [
  { 
    crop: 'Organic Paddy (Samba Masuri)', 
    acres: 10, 
    percentage: 66.7, 
    expectedYield: 20000,
    actualYield: 19500,
    yieldPerAcre: 1950,
    marketPrice: 42,
    totalValue: 819000,
    status: 'Harvested'
  },
  { 
    crop: 'Groundnut', 
    acres: 5, 
    percentage: 33.3, 
    expectedYield: 7000,
    actualYield: 6800,
    yieldPerAcre: 1360,
    marketPrice: 85,
    totalValue: 578000,
    status: 'Growing'
  }
];

const yieldTrends = [
  { season: '2022 Kharif', paddy: 1850, groundnut: 1200 },
  { season: '2022 Rabi', paddy: 1900, groundnut: 0 },
  { season: '2023 Kharif', paddy: 1920, groundnut: 1250 },
  { season: '2023 Rabi', paddy: 1950, groundnut: 0 },
  { season: '2024 Kharif', paddy: 1950, groundnut: 1360 }
];

const efficiencyMetrics = [
  { metric: 'Water Usage', value: 85, unit: '% efficient', status: 'good' },
  { metric: 'Seed Quality', value: 92, unit: '% germination', status: 'excellent' },
  { metric: 'Pest Control', value: 78, unit: '% effective', status: 'good' },
  { metric: 'Soil Health', value: 88, unit: '% optimal', status: 'excellent' }
];

const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6'];

export function LandYieldTracker({ user }: LandYieldTrackerProps) {
  const { t } = useLanguage();

  const totalValue = cropDistribution.reduce((sum, crop) => sum + crop.totalValue, 0);
  const overallEfficiency = cropDistribution.reduce((sum, crop) => sum + (crop.actualYield / crop.expectedYield * 100), 0) / cropDistribution.length;

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
              <Map className="w-6 h-6" />
              Land & Yield Tracker
            </h2>
            <p className="text-green-100 mt-1">
              Comprehensive farm management for {user?.name || 'Ramesh Kumar'}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <MapPin className="w-3 h-3 mr-1" />
                {landData.location}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <TreePine className="w-3 h-3 mr-1" />
                {landData.soilType} Soil
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{landData.totalAcres}</div>
            <div className="text-sm text-green-100">Total Acres</div>
            <div className="text-sm">₹{(totalValue / 100000).toFixed(1)}L Total Value</div>
          </div>
        </div>

        {/* Floating farm elements */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <TreePine className="w-24 h-24" />
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Land Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Land Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{landData.totalAcres}</div>
                  <div className="text-sm text-muted-foreground">Total Acres</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{landData.cultivatedAcres}</div>
                  <div className="text-sm text-muted-foreground">Cultivated</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Survey Numbers</h4>
                {landData.surveyNumbers.map((survey, index) => (
                  <Badge key={index} variant="outline" className="mr-2">
                    {survey}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Irrigation Type:</span>
                  <span className="text-sm font-medium">{landData.irrigationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Soil Type:</span>
                  <span className="text-sm font-medium">{landData.soilType}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Land Map
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Crop Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Crop Distribution & Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div>
                  <h4 className="font-semibold mb-3">Land Allocation</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={cropDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="acres"
                        label={({ crop, acres }) => `${acres} acres`}
                      >
                        {cropDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Crop Details */}
                <div className="space-y-4">
                  {cropDistribution.map((crop, index) => (
                    <div key={crop.crop} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index] }}
                          />
                          <h5 className="font-medium text-sm">{crop.crop}</h5>
                        </div>
                        <Badge 
                          variant={crop.status === 'Harvested' ? 'default' : 'secondary'}
                          className={crop.status === 'Harvested' ? 'bg-green-600' : 'bg-amber-500'}
                        >
                          {crop.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Area: {crop.acres} acres</div>
                        <div>Yield/acre: {crop.yieldPerAcre} kg</div>
                        <div>Expected: {crop.expectedYield.toLocaleString()} kg</div>
                        <div>Actual: {crop.actualYield.toLocaleString()} kg</div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Efficiency</span>
                          <span>{((crop.actualYield / crop.expectedYield) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={(crop.actualYield / crop.expectedYield) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Yield Trends (5 Seasons)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={yieldTrends}>
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
                  <XAxis dataKey="season" />
                  <YAxis tickFormatter={(value) => `${value/1000}k`} />
                  <Tooltip formatter={(value: any) => [`${value} kg/acre`, '']} />
                  <Area 
                    type="monotone" 
                    dataKey="paddy" 
                    stroke="#22c55e" 
                    fillOpacity={1} 
                    fill="url(#paddyGradient)"
                    name="Paddy"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="groundnut" 
                    stroke="#f59e0b" 
                    fillOpacity={1} 
                    fill="url(#groundnutGradient)"
                    name="Groundnut"
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-600">1950</div>
                  <div className="text-xs text-muted-foreground">Paddy kg/acre</div>
                  <div className="flex items-center justify-center text-xs">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                    +2.6% vs last season
                  </div>
                </div>
                <div className="text-center p-2 bg-amber-50 rounded">
                  <div className="text-lg font-bold text-amber-600">1360</div>
                  <div className="text-xs text-muted-foreground">Groundnut kg/acre</div>
                  <div className="flex items-center justify-center text-xs">
                    <TrendingUp className="w-3 h-3 mr-1 text-amber-600" />
                    +8.8% vs last season
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Efficiency Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Farm Efficiency Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {efficiencyMetrics.map((metric, index) => (
                <motion.div
                  key={metric.metric}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{metric.metric}</span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={metric.status === 'excellent' ? 'default' : 'secondary'}
                        className={metric.status === 'excellent' ? 'bg-green-600' : 'bg-amber-500'}
                      >
                        {metric.value}{metric.unit}
                      </Badge>
                      {metric.value >= 85 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </motion.div>
              ))}

              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Overall Farm Score</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{overallEfficiency.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Based on yield efficiency</div>
                <Progress value={overallEfficiency} className="mt-2 h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}