import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  X, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Package,
  Thermometer,
  Droplets,
  Zap,
  Clock,
  Users,
  Truck,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie, BarChart, Bar } from 'recharts';

interface Warehouse3DAnalyticsProps {
  onClose: () => void;
}

const mockAnalyticsData = {
  occupancy: {
    total: 78,
    bySection: [
      { name: 'Grain Storage', value: 85, color: '#138808' },
      { name: 'Cold Storage', value: 92, color: '#FF9933' },
      { name: 'Loading Bay', value: 45, color: '#0B3D91' },
      { name: 'Processing', value: 67, color: '#8b5cf6' }
    ]
  },
  flow: [
    { time: '00:00', inflow: 12, outflow: 8 },
    { time: '04:00', inflow: 15, outflow: 10 },
    { time: '08:00', inflow: 25, outflow: 18 },
    { time: '12:00', inflow: 30, outflow: 22 },
    { time: '16:00', inflow: 28, outflow: 25 },
    { time: '20:00', inflow: 20, outflow: 15 },
  ],
  inventory: [
    { category: 'Grains', value: 450, trend: 'up', change: 12 },
    { category: 'Vegetables', value: 320, trend: 'down', change: -8 },
    { category: 'Fruits', value: 280, trend: 'up', change: 15 },
    { category: 'Spices', value: 150, trend: 'stable', change: 2 }
  ],
  environment: {
    temperature: { current: 22, target: 20, status: 'warning' },
    humidity: { current: 65, target: 60, status: 'healthy' },
    airQuality: { current: 85, target: 90, status: 'healthy' }
  },
  predictive: {
    demandForecast: '+15%',
    stockoutRisk: 'Low',
    maintenanceAlerts: 2,
    efficiencyScore: 88
  }
};

export function Warehouse3DAnalytics({ onClose }: Warehouse3DAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-4 z-40 flex items-center justify-center"
    >
      <Card className="w-full max-w-6xl h-full bg-black/10 backdrop-blur-xl border border-[#FF9933]/30 overflow-hidden">
        <CardHeader className="border-b border-[#FF9933]/20 bg-gradient-to-r from-[#FF9933]/10 to-[#0B3D91]/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF9933] to-[#0B3D91] rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">3D Analytics Hub</h2>
                <p className="text-sm text-white/70">Real-time warehouse intelligence</p>
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/20 border-b border-[#FF9933]/20">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-[#FF9933]/30 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="flow" className="text-white data-[state=active]:bg-[#0B3D91]/30 data-[state=active]:text-white">
                Flow Analysis
              </TabsTrigger>
              <TabsTrigger value="inventory" className="text-white data-[state=active]:bg-[#138808]/30 data-[state=active]:text-white">
                Inventory
              </TabsTrigger>
              <TabsTrigger value="predictive" className="text-white data-[state=active]:bg-purple-500/30 data-[state=active]:text-white">
                Predictive
              </TabsTrigger>
            </TabsList>

            <div className="p-6 h-full overflow-y-auto bg-gradient-to-br from-slate-900/50 to-slate-800/50">
              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="bg-black/20 border-[#138808]/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white/70">Total Occupancy</p>
                            <p className="text-2xl font-bold text-[#138808]">{mockAnalyticsData.occupancy.total}%</p>
                          </div>
                          <Package className="w-8 h-8 text-[#138808]" />
                        </div>
                        <Progress value={mockAnalyticsData.occupancy.total} className="mt-2 h-2" />
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="bg-black/20 border-[#FF9933]/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white/70">Temperature</p>
                            <p className="text-2xl font-bold text-[#FF9933]">{mockAnalyticsData.environment.temperature.current}°C</p>
                          </div>
                          <Thermometer className="w-8 h-8 text-[#FF9933]" />
                        </div>
                        <Badge className={`mt-2 ${
                          mockAnalyticsData.environment.temperature.status === 'healthy' 
                            ? 'bg-[#138808]/20 text-[#138808] border-[#138808]'
                            : 'bg-[#FF9933]/20 text-[#FF9933] border-[#FF9933]'
                        }`}>
                          {mockAnalyticsData.environment.temperature.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="bg-black/20 border-[#0B3D91]/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white/70">Humidity</p>
                            <p className="text-2xl font-bold text-[#0B3D91]">{mockAnalyticsData.environment.humidity.current}%</p>
                          </div>
                          <Droplets className="w-8 h-8 text-[#0B3D91]" />
                        </div>
                        <Progress value={mockAnalyticsData.environment.humidity.current} className="mt-2 h-2" />
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="bg-black/20 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white/70">Efficiency</p>
                            <p className="text-2xl font-bold text-purple-400">{mockAnalyticsData.predictive.efficiencyScore}%</p>
                          </div>
                          <Activity className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-green-400">+5% this week</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Section Occupancy */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-black/20 border-[#FF9933]/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-[#FF9933]" />
                        Section Occupancy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={mockAnalyticsData.occupancy.bySection}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {mockAnalyticsData.occupancy.bySection.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {mockAnalyticsData.occupancy.bySection.map((section, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: section.color }}
                            />
                            <span className="text-xs text-white">{section.name}: {section.value}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/20 border-[#0B3D91]/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#0B3D91]" />
                        Daily Flow Pattern
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={mockAnalyticsData.flow}>
                            <XAxis dataKey="time" stroke="#ffffff66" />
                            <YAxis stroke="#ffffff66" />
                            <Line 
                              type="monotone" 
                              dataKey="inflow" 
                              stroke="#138808" 
                              strokeWidth={3}
                              dot={{ fill: '#138808', strokeWidth: 2, r: 4 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="outflow" 
                              stroke="#FF9933" 
                              strokeWidth={3}
                              dot={{ fill: '#FF9933', strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-[#138808] rounded-full" />
                          <span className="text-white">Inflow</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-[#FF9933] rounded-full" />
                          <span className="text-white">Outflow</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="flow" className="space-y-6 mt-0">
                <Card className="bg-black/20 border-[#0B3D91]/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#0B3D91]" />
                      Real-Time Flow Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockAnalyticsData.flow}>
                          <XAxis dataKey="time" stroke="#ffffff66" />
                          <YAxis stroke="#ffffff66" />
                          <Bar dataKey="inflow" fill="#138808" />
                          <Bar dataKey="outflow" fill="#FF9933" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockAnalyticsData.inventory.map((item, index) => (
                    <motion.div
                      key={item.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-black/20 border-[#138808]/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-white">{item.category}</h3>
                            <div className="flex items-center gap-1">
                              {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                              {item.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                              <span className={`text-sm ${
                                item.trend === 'up' ? 'text-green-400' :
                                item.trend === 'down' ? 'text-red-400' :
                                'text-gray-400'
                              }`}>
                                {item.change > 0 ? '+' : ''}{item.change}%
                              </span>
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-[#138808] mb-2">{item.value} tons</div>
                          <Progress value={(item.value / 500) * 100} className="h-2" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="predictive" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-black/20 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-400" />
                        AI Predictions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                        <div className="text-sm text-purple-300">Demand Forecast (Next 30 Days)</div>
                        <div className="text-xl font-bold text-purple-400">{mockAnalyticsData.predictive.demandForecast}</div>
                      </div>
                      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                        <div className="text-sm text-green-300">Stockout Risk</div>
                        <div className="text-xl font-bold text-green-400">{mockAnalyticsData.predictive.stockoutRisk}</div>
                      </div>
                      <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                        <div className="text-sm text-orange-300">Maintenance Alerts</div>
                        <div className="text-xl font-bold text-orange-400">{mockAnalyticsData.predictive.maintenanceAlerts}</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/20 border-[#FF9933]/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#FF9933]" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white">Efficiency Score</span>
                            <span className="text-[#FF9933]">{mockAnalyticsData.predictive.efficiencyScore}%</span>
                          </div>
                          <Progress value={mockAnalyticsData.predictive.efficiencyScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white">Space Utilization</span>
                            <span className="text-[#0B3D91]">82%</span>
                          </div>
                          <Progress value={82} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white">Energy Efficiency</span>
                            <span className="text-[#138808]">91%</span>
                          </div>
                          <Progress value={91} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}