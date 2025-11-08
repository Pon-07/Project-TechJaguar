import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  BarChart3,
  Vote,
  Map,
  Calculator,
  Bot,
  Phone,
  Globe,
  TrendingUp,
  Gift,
  Receipt,
  Target,
  Users,
  Sparkles
} from 'lucide-react';
import { CropAnalyticsDashboard } from './CropAnalyticsDashboard';
import { CommunityPriceVoting } from './CommunityPriceVoting';
import { LandYieldTracker } from './LandYieldTracker';
import { ExpenseSubsidyManager } from './ExpenseSubsidyManager';
import { CallButton } from '../CallButton';
import { useLanguage } from '../../contexts/LanguageContext';

interface FarmerDashboardProps {
  user: any;
}

// Dummy call numbers for different stakeholders
const supportContacts = [
  { 
    label: 'Warehouse Support', 
    phoneNumber: '+91-99999-00011', 
    description: 'Storage, quality checks, and dispatch support',
    icon: '🏭'
  },
  { 
    label: 'Distributor Network', 
    phoneNumber: '+91-99999-00022', 
    description: 'Regional distribution and logistics',
    icon: '🚛' 
  },
  { 
    label: 'Retailer Connect', 
    phoneNumber: '+91-99999-00033', 
    description: 'Direct retail partnerships',
    icon: '🏪'
  },
  { 
    label: 'Consumer Support', 
    phoneNumber: '+91-99999-00044', 
    description: 'Customer queries and feedback',
    icon: '🛒'
  }
];

export function FarmerDashboard({ user }: FarmerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'voting' | 'land' | 'finance' | 'support'>('analytics');
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Enhanced Header with AI Status */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bot className="w-8 h-8" />
              AI-Powered Farmer Dashboard
            </h1>
            <p className="text-green-100 mt-1">
              Advanced analytics and insights for {user?.name || 'Ramesh Kumar'} • Madurai Taluk
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Analytics Active
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Users className="w-3 h-3 mr-1" />
                127 Community Farmers
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Globe className="w-3 h-3 mr-1" />
                Blockchain Verified
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

        {/* Animated background elements */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Bot className="w-32 h-32" />
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            icon: BarChart3, 
            title: 'Crop Analytics', 
            description: 'AI predictions & insights',
            color: 'text-green-600',
            bg: 'bg-green-50',
            tab: 'analytics'
          },
          { 
            icon: Vote, 
            title: 'Price Voting', 
            description: 'Community price democracy',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            tab: 'voting'
          },
          { 
            icon: Map, 
            title: 'Land & Yield', 
            description: 'Track 15 acres performance',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            tab: 'land'
          },
          { 
            icon: Calculator, 
            title: 'Finance Manager', 
            description: 'Expenses & subsidies',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            tab: 'finance'
          }
        ].map((card, index) => (
          <motion.div
            key={card.tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setActiveTab(card.tab as any)}
            className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-lg ${card.bg} ${
              activeTab === card.tab ? 'ring-2 ring-offset-2 ring-green-500' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 ${card.bg} rounded-lg`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <h3 className="font-semibold">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="voting" className="flex items-center gap-2">
                <Vote className="w-4 h-4" />
                Price Voting
              </TabsTrigger>
              <TabsTrigger value="land" className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                Land & Yield
              </TabsTrigger>
              <TabsTrigger value="finance" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Finance
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Support Hub
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="mt-6">
              <CropAnalyticsDashboard user={user} />
            </TabsContent>

            <TabsContent value="voting" className="mt-6">
              <CommunityPriceVoting user={user} />
            </TabsContent>

            <TabsContent value="land" className="mt-6">
              <LandYieldTracker user={user} />
            </TabsContent>

            <TabsContent value="finance" className="mt-6">
              <ExpenseSubsidyManager user={user} />
            </TabsContent>

            <TabsContent value="support" className="mt-6">
              <div className="space-y-6">
                {/* Support Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Phone className="w-6 h-6" />
                        Call & Support Hub
                      </h2>
                      <p className="text-orange-100 mt-1">
                        Direct access to all stakeholders in the GreenLedger ecosystem
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">24/7</div>
                      <div className="text-sm text-orange-100">Support Available</div>
                    </div>
                  </div>
                </motion.div>

                {/* Support Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {supportContacts.map((contact, index) => (
                    <motion.div
                      key={contact.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-lg transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <span className="text-2xl">{contact.icon}</span>
                            <div>
                              <h3 className="text-lg text-orange-700">{contact.label}</h3>
                              <p className="text-sm text-muted-foreground font-normal">
                                {contact.description}
                              </p>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CallButton
                            phoneNumber={contact.phoneNumber}
                            label={`Call ${contact.label}`}
                            description={contact.description}
                            module="farmer"
                            size="lg"
                            className="w-full bg-orange-600 hover:bg-orange-700"
                          />
                          
                          <div className="mt-3 p-2 bg-white rounded border text-center">
                            <code className="text-sm text-orange-600 font-mono">
                              {contact.phoneNumber}
                            </code>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Emergency Support */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="border-2 border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-700">
                        <Phone className="w-5 h-5" />
                        Emergency Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CallButton
                          phoneNumber="+91-99999-99999"
                          label="Emergency Helpline"
                          description="24/7 emergency support for critical issues"
                          module="farmer"
                          size="md"
                          className="bg-red-600 hover:bg-red-700"
                        />
                        <CallButton
                          phoneNumber="+91-88888-88888"
                          label="Technical Support"
                          description="App and blockchain related issues"
                          module="farmer"
                          size="md"
                          className="bg-blue-600 hover:bg-blue-700"
                        />
                        <CallButton
                          phoneNumber="+91-77777-77777"
                          label="Government Liaison"
                          description="Subsidy and scheme related queries"
                          module="farmer"
                          size="md"
                          className="bg-green-600 hover:bg-green-700"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}