import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import {
  DollarSign,
  Plus,
  Receipt,
  Gift,
  TrendingUp,
  TrendingDown,
  Calculator,
  PieChart,
  Target,
  Edit,
  Trash2,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface ExpenseSubsidyManagerProps {
  user: any;
}

// Dummy expense data
const expenses = [
  { id: 1, category: 'Seeds', item: 'Paddy Seeds (Samba Masuri)', amount: 15000, date: '2024-01-10', season: 'Kharif 2024' },
  { id: 2, category: 'Seeds', item: 'Groundnut Seeds', amount: 5000, date: '2024-01-10', season: 'Kharif 2024' },
  { id: 3, category: 'Fertilizers', item: 'Organic Compost', amount: 8000, date: '2024-01-15', season: 'Kharif 2024' },
  { id: 4, category: 'Fertilizers', item: 'NPK Fertilizer', amount: 7000, date: '2024-01-20', season: 'Kharif 2024' },
  { id: 5, category: 'Transport', item: 'Harvest Transportation', amount: 6000, date: '2024-03-15', season: 'Kharif 2024' },
  { id: 6, category: 'Transport', item: 'Market Transportation', amount: 4000, date: '2024-03-20', season: 'Kharif 2024' },
  { id: 7, category: 'Labor', item: 'Harvesting Labor', amount: 12000, date: '2024-03-10', season: 'Kharif 2024' },
  { id: 8, category: 'Equipment', item: 'Tractor Rental', amount: 8000, date: '2024-02-01', season: 'Kharif 2024' }
];

const subsidies = [
  { id: 1, scheme: 'PM-KISAN', amount: 6000, status: 'Received', date: '2024-01-01', description: '3 installments @ ₹2000 each' },
  { id: 2, scheme: 'Crop Insurance', amount: 3500, status: 'Received', date: '2024-02-15', description: 'Weather-based compensation' },
  { id: 3, scheme: 'Organic Farming Subsidy', amount: 2500, status: 'Pending', date: '2024-03-01', description: 'Organic certification support' },
  { id: 4, scheme: 'Drip Irrigation Subsidy', amount: 15000, status: 'Approved', date: '2024-01-20', description: '50% subsidy on drip system' }
];

const monthlyTrends = [
  { month: 'Jan', expenses: 28000, subsidies: 6000, profit: 45000 },
  { month: 'Feb', expenses: 15000, subsidies: 15000, profit: 52000 },
  { month: 'Mar', expenses: 22000, subsidies: 3500, profit: 48000 },
  { month: 'Apr', expenses: 8000, subsidies: 0, profit: 38000 },
  { month: 'May', expenses: 12000, subsidies: 2500, profit: 42000 },
  { month: 'Jun', expenses: 18000, subsidies: 0, profit: 46000 }
];

const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];

export function ExpenseSubsidyManager({ user }: ExpenseSubsidyManagerProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'subsidies' | 'analysis'>('overview');
  const [newExpense, setNewExpense] = useState({ category: '', item: '', amount: '' });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSubsidies = subsidies.reduce((sum, subsidy) => sum + (subsidy.status === 'Received' ? subsidy.amount : 0), 0);
  const totalApprovedSubsidies = subsidies.reduce((sum, subsidy) => sum + (subsidy.status !== 'Pending' ? subsidy.amount : 0), 0);
  
  // Dummy revenue calculation
  const totalRevenue = 1397000; // From crop sales
  const netProfit = totalRevenue - totalExpenses + totalSubsidies;

  const expenseByCategory = expenses.reduce((acc: any, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const expensePieData = Object.entries(expenseByCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: ((amount as number) / totalExpenses * 100).toFixed(1)
  }));

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.item || !newExpense.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    toast.success('Expense added successfully!');
    setNewExpense({ category: '', item: '', amount: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Expense & Subsidy Manager
            </h2>
            <p className="text-emerald-100 mt-1">
              Complete financial tracking for {user?.name || 'Ramesh Kumar'}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Receipt className="w-3 h-3 mr-1" />
                Current Season: Kharif 2024
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Gift className="w-3 h-3 mr-1" />
                4 Subsidy Schemes
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹{(netProfit / 100000).toFixed(1)}L</div>
            <div className="text-sm text-emerald-100">Net Profit</div>
            <div className="flex items-center text-sm mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5% vs last season
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <IndianRupee className="w-24 h-24" />
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Revenue', 
            value: `₹${(totalRevenue / 100000).toFixed(1)}L`, 
            icon: TrendingUp, 
            color: 'text-green-600',
            bg: 'bg-green-50',
            change: '+8.2%'
          },
          { 
            label: 'Total Expenses', 
            value: `₹${(totalExpenses / 1000).toFixed(0)}K`, 
            icon: Receipt, 
            color: 'text-red-600',
            bg: 'bg-red-50',
            change: '-5.1%'
          },
          { 
            label: 'Subsidies Received', 
            value: `₹${(totalSubsidies / 1000).toFixed(0)}K`, 
            icon: Gift, 
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            change: '+15.3%'
          },
          { 
            label: 'Net Profit', 
            value: `₹${(netProfit / 100000).toFixed(1)}L`, 
            icon: Calculator, 
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            change: '+12.5%'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                  </div>
                  <div className={`p-3 ${stat.bg} rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="expenses" className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Expenses
              </TabsTrigger>
              <TabsTrigger value="subsidies" className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Subsidies
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Analysis
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Expense Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={expensePieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="amount"
                          label={({ category, percentage }) => `${category} (${percentage}%)`}
                        >
                          {expensePieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, '']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Profit Calculation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profit Calculation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">Total Revenue</span>
                        <span className="font-bold text-green-600">+₹{totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="font-medium">Total Expenses</span>
                        <span className="font-bold text-red-600">-₹{totalExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Subsidies Received</span>
                        <span className="font-bold text-blue-600">+₹{totalSubsidies.toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                          <span className="font-bold">Net Profit</span>
                          <span className="font-bold text-purple-600 text-xl">₹{netProfit.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm text-muted-foreground mb-2">Profit Margin</div>
                      <Progress value={(netProfit / totalRevenue) * 100} className="h-3" />
                      <div className="text-sm text-center mt-1">{((netProfit / totalRevenue) * 100).toFixed(1)}%</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Expenses Tab */}
            <TabsContent value="expenses" className="mt-6">
              <div className="space-y-4">
                {/* Add New Expense */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-green-600" />
                      Add New Expense
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input
                        placeholder="Category (e.g., Seeds)"
                        value={newExpense.category}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                      />
                      <Input
                        placeholder="Item description"
                        value={newExpense.item}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, item: e.target.value }))}
                      />
                      <Input
                        type="number"
                        placeholder="Amount (₹)"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      />
                      <Button onClick={handleAddExpense} className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Expense
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Expense List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {expenses.map((expense, index) => (
                        <motion.div
                          key={expense.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div>
                            <div className="font-medium">{expense.item}</div>
                            <div className="text-sm text-muted-foreground">
                              {expense.category} • {new Date(expense.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{expense.category}</Badge>
                            <span className="font-bold">₹{expense.amount.toLocaleString()}</span>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Subsidies Tab */}
            <TabsContent value="subsidies" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subsidy Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-blue-600" />
                      Government Subsidies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {subsidies.map((subsidy, index) => (
                      <motion.div
                        key={subsidy.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{subsidy.scheme}</h4>
                          <Badge 
                            variant={subsidy.status === 'Received' ? 'default' : subsidy.status === 'Approved' ? 'secondary' : 'outline'}
                            className={
                              subsidy.status === 'Received' ? 'bg-green-600' : 
                              subsidy.status === 'Approved' ? 'bg-blue-600' : 'bg-amber-500'
                            }
                          >
                            {subsidy.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">{subsidy.description}</div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-green-600">₹{subsidy.amount.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">{new Date(subsidy.date).toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Subsidy Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subsidy Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">₹{(totalSubsidies / 1000).toFixed(0)}K</div>
                        <div className="text-sm text-muted-foreground">Received</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">₹{((totalApprovedSubsidies - totalSubsidies) / 1000).toFixed(0)}K</div>
                        <div className="text-sm text-muted-foreground">Approved</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">Total Expected: ₹{(totalApprovedSubsidies / 1000).toFixed(0)}K</div>
                      <Progress value={(totalSubsidies / totalApprovedSubsidies) * 100} className="h-2" />
                      <div className="text-xs text-muted-foreground text-center">
                        {((totalSubsidies / totalApprovedSubsidies) * 100).toFixed(1)}% received
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="font-semibold text-amber-800 mb-1">Pending Actions</h4>
                      <p className="text-sm text-amber-700">
                        Complete organic certification documents for ₹2,500 subsidy release
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Financial Trends Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                      <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, '']} />
                      <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" strokeWidth={2} />
                      <Line type="monotone" dataKey="subsidies" stroke="#3b82f6" name="Subsidies" strokeWidth={2} />
                      <Line type="monotone" dataKey="profit" stroke="#22c55e" name="Profit" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg text-center">
                      <h4 className="font-semibold text-red-700">Average Monthly Expenses</h4>
                      <div className="text-2xl font-bold text-red-600">₹{(totalExpenses / 6 / 1000).toFixed(0)}K</div>
                      <div className="text-sm text-muted-foreground">6-month average</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <h4 className="font-semibold text-blue-700">Subsidy Impact</h4>
                      <div className="text-2xl font-bold text-blue-600">{((totalSubsidies / totalExpenses) * 100).toFixed(0)}%</div>
                      <div className="text-sm text-muted-foreground">of expenses covered</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <h4 className="font-semibold text-green-700">Profit Margin</h4>
                      <div className="text-2xl font-bold text-green-600">{((netProfit / totalRevenue) * 100).toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">vs revenue</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}