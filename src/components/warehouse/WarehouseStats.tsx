import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Package, TrendingUp, Users, Clock } from 'lucide-react';

const stockData = [
  { category: 'Rice', stock: 2500, demand: 2200 },
  { category: 'Wheat', stock: 1800, demand: 1600 },
  { category: 'Vegetables', stock: 1200, demand: 1400 },
  { category: 'Fruits', stock: 800, demand: 900 },
  { category: 'Pulses', stock: 600, demand: 550 }
];

const realTimeData = [
  { time: '09:00', items: 156 },
  { time: '10:00', items: 148 },
  { time: '11:00', items: 142 },
  { time: '12:00', items: 138 },
  { time: '13:00', items: 135 },
  { time: '14:00', items: 132 }
];

const stats = [
  { label: 'Total Items', value: '2,156', icon: Package, color: 'text-blue-600', change: '+12%' },
  { label: 'Active Farmers', value: '847', icon: Users, color: 'text-green-600', change: '+8%' },
  { label: 'Today\'s Sales', value: '₹2.4L', icon: TrendingUp, color: 'text-amber-600', change: '+15%' },
  { label: 'Avg. Freshness', value: '94%', icon: Clock, color: 'text-purple-600', change: '+2%' }
];

export function WarehouseStats() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Quick Stats */}
      <div className="lg:col-span-1 space-y-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stock vs Demand Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="h-80">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Stock vs Demand</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} kg`, '']} />
                <Bar dataKey="stock" fill="#22c55e" name="Stock" />
                <Bar dataKey="demand" fill="#f59e0b" name="Demand" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Real-time Inventory */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="h-80">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Real-time Inventory</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} items`, '']} />
                <Line 
                  type="monotone" 
                  dataKey="items" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}