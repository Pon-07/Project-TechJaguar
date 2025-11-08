import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Vote,
  Users,
  TrendingUp,
  Shield,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Link,
  MapPin,
  Calendar
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface CommunityPriceVotingProps {
  user: any;
}

// Dummy voting data
const activeVotes = [
  {
    id: 1,
    crop: 'Paddy (Samba Masuri)',
    proposedBy: 'Ramesh Kumar',
    proposedPrice: 42,
    currentAverage: 40,
    totalVotes: 27,
    myVote: null,
    endDate: '2024-01-15',
    blockchainTx: '0xA12B34CDE56F789',
    status: 'active',
    taluk: 'Madurai',
    votes: [
      { price: 38, count: 5, percentage: 18.5 },
      { price: 40, count: 12, percentage: 44.4 },
      { price: 42, count: 8, percentage: 29.6 },
      { price: 45, count: 2, percentage: 7.4 }
    ]
  },
  {
    id: 2,
    crop: 'Groundnut',
    proposedBy: 'Lakshmi Devi',
    proposedPrice: 85,
    currentAverage: 83,
    totalVotes: 19,
    myVote: 83,
    endDate: '2024-01-18',
    blockchainTx: '0xB23C45DEF678901',
    status: 'active',
    taluk: 'Madurai',
    votes: [
      { price: 80, count: 3, percentage: 15.8 },
      { price: 83, count: 10, percentage: 52.6 },
      { price: 85, count: 5, percentage: 26.3 },
      { price: 88, count: 1, percentage: 5.3 }
    ]
  }
];

const completedVotes = [
  {
    id: 3,
    crop: 'Turmeric',
    finalPrice: 125,
    totalVotes: 45,
    completedDate: '2024-01-10',
    blockchainTx: '0xC34D56EF789012A',
    status: 'completed',
    taluk: 'Madurai',
    impact: '+₹15,000 farmer benefit'
  },
  {
    id: 4,
    crop: 'Cotton',
    finalPrice: 92,
    totalVotes: 33,
    completedDate: '2024-01-08',
    blockchainTx: '0xD45E67F890123B',
    status: 'completed',
    taluk: 'Madurai',
    impact: '+₹22,000 farmer benefit'
  }
];

const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6'];

export function CommunityPriceVoting({ user }: CommunityPriceVotingProps) {
  const { t } = useLanguage();
  const [newProposal, setNewProposal] = useState({ crop: '', price: '' });
  const [activeTab, setActiveTab] = useState<'vote' | 'propose' | 'history'>('vote');

  const handleVote = (voteId: number, price: number) => {
    toast.success(`Vote submitted: ₹${price}/kg`, {
      description: 'Your vote has been recorded on the blockchain'
    });
  };

  const handleProposal = () => {
    if (!newProposal.crop || !newProposal.price) {
      toast.error('Please fill in all fields');
      return;
    }

    toast.success('Price proposal submitted!', {
      description: `Proposing ₹${newProposal.price}/kg for ${newProposal.crop}`
    });

    setNewProposal({ crop: '', price: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-green-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Vote className="w-6 h-6" />
              Community Price Voting
            </h2>
            <p className="text-purple-100 mt-1">
              Transparent blockchain-powered price democracy for Madurai Taluk
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Shield className="w-3 h-3 mr-1" />
                Blockchain Verified
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Users className="w-3 h-3 mr-1" />
                127 Active Farmers
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹40</div>
            <div className="text-sm text-purple-100">Current Paddy Price</div>
            <div className="flex items-center text-sm mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              Based on 27 votes
            </div>
          </div>
        </div>

        {/* Blockchain animation */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <Link className="w-24 h-24" />
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vote" className="flex items-center gap-2">
                <Vote className="w-4 h-4" />
                Active Votes
              </TabsTrigger>
              <TabsTrigger value="propose" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Propose Price
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Vote History
              </TabsTrigger>
            </TabsList>

            {/* Active Votes Tab */}
            <TabsContent value="vote" className="mt-6">
              <div className="space-y-6">
                {activeVotes.map((vote, index) => (
                  <motion.div
                    key={vote.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-green-50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
                              <Shield className="w-5 h-5" />
                              {vote.crop}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Proposed by {vote.proposedBy} • Ends {new Date(vote.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">₹{vote.currentAverage}</div>
                            <div className="text-sm text-muted-foreground">Current Average</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Voting Progress */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Vote Distribution</h4>
                            <ResponsiveContainer width="100%" height={200}>
                              <PieChart>
                                <Pie
                                  data={vote.votes}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={40}
                                  outerRadius={80}
                                  paddingAngle={2}
                                  dataKey="count"
                                  label={({ price, percentage }) => `₹${price} (${percentage.toFixed(1)}%)`}
                                >
                                  {vote.votes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Vote Details</h4>
                            <div className="space-y-2">
                              {vote.votes.map((v, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-white rounded">
                                  <span>₹{v.price}/kg</span>
                                  <div className="flex items-center gap-2">
                                    <Progress value={v.percentage} className="w-20 h-2" />
                                    <span className="text-sm">{v.count} votes</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Link className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-800">Blockchain Tx</span>
                              </div>
                              <code className="text-xs text-blue-600 break-all">{vote.blockchainTx}</code>
                            </div>
                          </div>
                        </div>

                        {/* Voting Actions */}
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {vote.totalVotes} farmers voted
                              </span>
                              {vote.myVote && (
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  You voted ₹{vote.myVote}
                                </Badge>
                              )}
                            </div>
                            
                            {!vote.myVote && (
                              <div className="flex gap-2">
                                {[38, 40, 42, 45].map((price) => (
                                  <Button
                                    key={price}
                                    size="sm"
                                    variant={price === vote.proposedPrice ? "default" : "outline"}
                                    onClick={() => handleVote(vote.id, price)}
                                    className={price === vote.proposedPrice ? "bg-purple-600 hover:bg-purple-700" : ""}
                                  >
                                    ₹{price}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Propose Price Tab */}
            <TabsContent value="propose" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Propose New Price
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Submit a price proposal for community voting
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Crop Type</label>
                      <Input
                        placeholder="e.g., Paddy, Groundnut, Cotton"
                        value={newProposal.crop}
                        onChange={(e) => setNewProposal(prev => ({ ...prev, crop: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Proposed Price (₹/kg)</label>
                      <Input
                        type="number"
                        placeholder="e.g., 42"
                        value={newProposal.price}
                        onChange={(e) => setNewProposal(prev => ({ ...prev, price: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">Proposal Guidelines</h4>
                    <ul className="space-y-1 text-sm text-amber-700">
                      <li>• Price proposals are visible to all farmers in your taluk</li>
                      <li>• Voting period lasts 7 days from submission</li>
                      <li>• Final price is the weighted average of all votes</li>
                      <li>• All votes are permanently recorded on blockchain</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={handleProposal}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Submit Proposal to Blockchain
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Vote History Tab */}
            <TabsContent value="history" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Completed Votes</h3>
                {completedVotes.map((vote, index) => (
                  <motion.div
                    key={vote.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-green-700">{vote.crop}</h4>
                            <p className="text-sm text-muted-foreground">
                              Completed {new Date(vote.completedDate).toLocaleDateString()} • {vote.totalVotes} votes
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">₹{vote.finalPrice}/kg</div>
                            <div className="text-sm text-green-600">{vote.impact}</div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Link className="w-4 h-4 text-blue-600" />
                          <code className="text-xs text-blue-600">{vote.blockchainTx}</code>
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