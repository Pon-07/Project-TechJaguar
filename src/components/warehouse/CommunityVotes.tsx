import React from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp, Shield, ExternalLink, Vote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { CommunityVote } from '../../data/warehouses';

interface CommunityVotesProps {
  votes: CommunityVote[];
  contractIds: string[];
}

export function CommunityVotes({ votes, contractIds }: CommunityVotesProps) {
  const totalVotes = votes.reduce((sum, vote) => sum + vote.votes, 0);
  const maxVotes = Math.max(...votes.map(v => v.votes));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Community Price Voting
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Community-driven price setting through democratic voting on blockchain
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{totalVotes}</div>
              <div className="text-sm text-green-600">Total Votes Cast</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{votes.length}</div>
              <div className="text-sm text-blue-600">Active Proposals</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-700">{contractIds.length}</div>
              <div className="text-sm text-amber-600">Smart Contracts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voting Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Current Voting Results
            </span>
            <Button size="sm" className="flex items-center gap-2">
              <Vote className="w-4 h-4" />
              Cast Vote
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {votes.map((vote, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{vote.crop}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Users className="w-3 h-3 mr-1" />
                        {vote.votes} votes
                      </Badge>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                        Community Price: {formatCurrency(vote.final_price_per_kg)}/kg
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Vote Weight</div>
                    <div className="text-2xl font-bold text-green-600">
                      {((vote.votes / maxVotes) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Community Support</span>
                    <span className="font-medium">{vote.votes} / {maxVotes} votes</span>
                  </div>
                  <Progress 
                    value={(vote.votes / maxVotes) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Price accepted by community</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Shield className="w-4 h-4 mr-2" />
                      View Contract
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Blockchain Explorer
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Smart Contracts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Blockchain Smart Contracts
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Transparent and immutable pricing contracts on blockchain
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contractIds?.slice(0, 6).map((contractId, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border rounded-lg p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-mono text-xs text-blue-600">
                        {contractId}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Smart Contract #{index + 1}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600 font-medium">✓ Verified</span>
                    <span className="text-muted-foreground">Active</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {contractIds && contractIds.length > 6 && (
            <div className="text-center mt-4">
              <Button variant="outline" size="sm">
                View All {contractIds.length} Contracts
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Community Voting Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium mb-2">1. Community Proposal</h4>
              <p className="text-sm text-muted-foreground">
                Farmers and buyers propose fair prices for crops based on quality and market conditions
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Vote className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium mb-2">2. Democratic Voting</h4>
              <p className="text-sm text-muted-foreground">
                Community members vote on proposed prices, with each vote weighted by their stake in the system
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="font-medium mb-2">3. Smart Contract</h4>
              <p className="text-sm text-muted-foreground">
                Final prices are automatically enforced through blockchain smart contracts, ensuring transparency
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}