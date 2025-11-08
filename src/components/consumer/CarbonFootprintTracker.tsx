import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Leaf, 
  TrendingUp, 
  Award, 
  TreePine,
  Car,
  Home
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const carbonData = [
  { name: 'Transportation Saved', value: 65, color: '#22c55e' },
  { name: 'Packaging Reduced', value: 25, color: '#3b82f6' },
  { name: 'Processing Eliminated', value: 10, color: '#f59e0b' }
];

const monthlyProgress = [
  { month: 'Jan', saved: 8.2 },
  { month: 'Feb', saved: 9.1 },
  { month: 'Mar', saved: 11.5 },
  { month: 'Apr', saved: 12.7 }
];

interface CarbonFootprintTrackerProps {
  totalSaved: number;
}

export function CarbonFootprintTracker({ totalSaved }: CarbonFootprintTrackerProps) {
  const annualGoal = 150;
  const progress = (totalSaved / annualGoal) * 100;
  const treesEquivalent = Math.round(totalSaved / 22); // 1 tree absorbs ~22kg CO2/year

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Leaf className="w-6 h-6 mr-2 text-green-600" />
            Carbon Footprint Tracker
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
              Eco Impact
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{totalSaved}</div>
              <div className="text-sm text-muted-foreground">kg CO₂ Saved</div>
              <div className="flex items-center justify-center mt-1 text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+2.3 this month</span>
              </div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{treesEquivalent}</div>
              <div className="text-sm text-muted-foreground">Trees Equivalent</div>
              <div className="flex items-center justify-center mt-1 text-blue-600">
                <TreePine className="w-4 h-4 mr-1" />
                <span className="text-sm">Annual absorption</span>
              </div>
            </div>
          </div>

          {/* Annual Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Annual Goal Progress</span>
              <span className="text-sm text-muted-foreground">
                {totalSaved}/{annualGoal} kg CO₂
              </span>
            </div>
            <Progress value={progress} className="h-3 mb-2" />
            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                {Math.round(progress)}% Complete
              </Badge>
            </div>
          </div>

          {/* Breakdown Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-3">Carbon Reduction Breakdown</h4>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={carbonData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {carbonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {carbonData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Comparisons */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
            <h4 className="font-medium mb-3">Your Impact Comparison</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <Car className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <div className="text-lg font-bold">{Math.round(totalSaved * 4.5)}</div>
                <div className="text-xs text-muted-foreground">km car travel avoided</div>
              </div>
              <div className="text-center">
                <Home className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <div className="text-lg font-bold">{Math.round(totalSaved * 0.1)}</div>
                <div className="text-xs text-muted-foreground">days of home energy</div>
              </div>
            </div>
          </div>

          {/* Achievement Badge */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg"
          >
            <Award className="w-8 h-8 mx-auto mb-2" />
            <div className="font-bold">Eco Warrior</div>
            <div className="text-sm opacity-90">Keep up the green shopping!</div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}