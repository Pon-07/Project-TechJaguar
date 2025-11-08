import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  DollarSign,
  Users,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const priceData = [
  { time: '6:00', rice: 82, tomato: 48, wheat: 35 },
  { time: '9:00', rice: 85, tomato: 45, wheat: 32 },
  { time: '12:00', rice: 88, tomato: 42, wheat: 30 },
  { time: '15:00', rice: 85, tomato: 45, wheat: 32 },
  { time: '18:00', rice: 83, tomato: 47, wheat: 34 },
  { time: 'Now', rice: 85, tomato: 45, wheat: 32 }
];

const priceAlerts = [
  {
    product: 'Premium Basmati Rice',
    currentPrice: 85,
    change: -5,
    votes: 847,
    trend: 'down',
    nextUpdate: '2 hours'
  },
  {
    product: 'Organic Tomatoes',
    currentPrice: 45,
    change: -8,
    votes: 623,
    trend: 'down',
    nextUpdate: '45 mins'
  },
  {
    product: 'Golden Wheat',
    currentPrice: 32,
    change: 2,
    votes: 445,
    trend: 'up',
    nextUpdate: '3 hours'
  }
];

export function PriceFluctuationTracker() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-blue-600" />
            Real-time Price Tracker
            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
              Live Updates
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Chart */}
          <div>
            <h4 className="font-medium mb-3">Today's Price Movement</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, '']} />
                <Line 
                  type="monotone" 
                  dataKey="rice" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Rice"
                />
                <Line 
                  type="monotone" 
                  dataKey="tomato" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Tomato"
                />
                <Line 
                  type="monotone" 
                  dataKey="wheat" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Wheat"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Price Alerts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Community Price Updates</h4>
              <Button size="sm" variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Set Alert
              </Button>
            </div>
            
            <div className="space-y-3">
              {priceAlerts.map((alert, index) => (
                <motion.div
                  key={alert.product}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className="font-medium">{alert.product}</h5>
                      <Badge 
                        variant={alert.trend === 'down' ? 'default' : 'secondary'}
                        className={alert.trend === 'down' ? 'bg-green-500' : 'bg-red-500'}
                      >
                        {alert.trend === 'down' ? (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        )}
                        {alert.change > 0 ? '+' : ''}{alert.change}%
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {alert.votes} votes
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Next update: {alert.nextUpdate}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold">₹{alert.currentPrice}</div>
                    <div className="text-sm text-muted-foreground">/kg</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Blockchain Voting Info */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium">Community Voting Active</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Prices are democratically set by community voting every 4 hours. 
              All votes are recorded on blockchain for transparency.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-bold text-purple-600">2,847</div>
                <div className="text-xs text-muted-foreground">Active Voters</div>
              </div>
              <div>
                <div className="font-bold text-blue-600">96%</div>
                <div className="text-xs text-muted-foreground">Consensus Rate</div>
              </div>
              <div>
                <div className="font-bold text-green-600">₹2.4L</div>
                <div className="text-xs text-muted-foreground">Daily Volume</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}