import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  MessageCircle,
  Users,
  Send,
  Search,
  Heart,
  Reply,
  TrendingUp,
  MapPin,
  Wheat,
  Droplets,
  Bug,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CommunityHubProps {
  user: any;
}

interface Message {
  id: string;
  sender: string;
  avatar: string;
  location: string;
  message: string;
  timestamp: string;
  likes: number;
  replies: number;
  category: 'general' | 'crops' | 'weather' | 'market' | 'pests';
  isLiked?: boolean;
  expertise?: string;
  verified?: boolean;
}

interface ForumPost {
  id: string;
  title: string;
  author: string;
  avatar: string;
  location: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  category: string;
  tags: string[];
  isLiked?: boolean;
  isSolved?: boolean;
  priority: 'low' | 'medium' | 'high';
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Rajesh Kumar',
    avatar: 'RK',
    location: 'Thanjavur, TN',
    message: 'The organic fertilizer technique I shared last month has increased my rice yield by 15%! Happy to share the detailed process with anyone interested.',
    timestamp: '2 hours ago',
    likes: 24,
    replies: 8,
    category: 'crops',
    isLiked: false,
    expertise: 'Rice Expert',
    verified: true
  },
  {
    id: '2',
    sender: 'Priya Devi',
    avatar: 'PD',
    location: 'Madurai, TN',
    message: 'Weather forecast shows heavy rain this week. Anyone else concerned about their cotton fields? Looking for advice on drainage solutions.',
    timestamp: '4 hours ago',
    likes: 12,
    replies: 15,
    category: 'weather',
    isLiked: true,
    expertise: 'Cotton Specialist'
  },
  {
    id: '3',
    sender: 'Murugan S',
    avatar: 'MS',
    location: 'Coimbatore, TN',
    message: 'Just sold my tomatoes at ₹40/kg through Greenledger! Much better than the local market rate of ₹25/kg. This platform is revolutionary! 🚜',
    timestamp: '6 hours ago',
    likes: 31,
    replies: 6,
    category: 'market',
    isLiked: false,
    verified: true
  },
  {
    id: '4',
    sender: 'Lakshmi Bai',
    avatar: 'LB',
    location: 'Tirunelveli, TN',
    message: 'Found some unusual spots on my sugarcane leaves. Posting photos - can anyone help identify this pest? Need urgent advice!',
    timestamp: '8 hours ago',
    likes: 8,
    replies: 12,
    category: 'pests',
    isLiked: false,
    expertise: 'Sugarcane Grower'
  }
];

const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Best practices for organic rice farming in monsoon season',
    author: 'Dr. Arjun Krishnan',
    avatar: 'AK',
    location: 'Chennai, TN',
    content: 'Looking for comprehensive strategies to maintain organic rice cultivation during heavy monsoon...',
    timestamp: '1 day ago',
    likes: 45,
    replies: 23,
    category: 'Rice Cultivation',
    tags: ['organic', 'monsoon', 'rice', 'sustainability'],
    isLiked: false,
    isSolved: false,
    priority: 'high'
  },
  {
    id: '2',
    title: 'Drip irrigation setup for small-scale farming',
    author: 'Meera Palanisamy',
    avatar: 'MP',
    location: 'Salem, TN',
    content: 'Sharing my experience with setting up cost-effective drip irrigation for 2-acre plot...',
    timestamp: '2 days ago',
    likes: 67,
    replies: 34,
    category: 'Irrigation',
    tags: ['drip-irrigation', 'water-conservation', 'cost-effective'],
    isLiked: true,
    isSolved: true,
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Market price fluctuations for pulses - Need predictions',
    author: 'Venkatesh Reddy',
    avatar: 'VR',
    location: 'Dharmapuri, TN',
    content: 'Has anyone noticed the unusual price patterns for black gram and green gram this season?',
    timestamp: '3 days ago',
    likes: 29,
    replies: 18,
    category: 'Market Analysis',
    tags: ['pulses', 'pricing', 'market-trends'],
    isLiked: false,
    isSolved: false,
    priority: 'medium'
  }
];

export function CommunityHub({ user }: CommunityHubProps) {
  const [activeTab, setActiveTab] = useState('feed');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(mockForumPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: user.name,
      avatar: user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
      location: user.location,
      message: newMessage,
      timestamp: 'Just now',
      likes: 0,
      replies: 0,
      category: 'general',
      isLiked: false,
      verified: true
    };

    setMessages([message, ...messages]);
    setNewMessage('');
    toast.success('Message posted to community!');
  };

  const handleLikeMessage = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1, isLiked: !msg.isLiked }
        : msg
    ));
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.sender.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || msg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredForumPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8" />
              Community Hub
            </h2>
            <p className="text-green-100 mt-1">
              Connect, share knowledge, and grow together with fellow farmers
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">1,247</div>
            <div className="text-sm text-green-100">Active Farmers</div>
            <div className="text-xs text-green-200 mt-1">+23 today</div>
          </div>
        </div>
      </motion.div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Messages Today', value: '156', icon: MessageCircle, color: 'text-blue-600' },
          { label: 'Active Discussions', value: '43', icon: Users, color: 'text-green-600' },
          { label: 'Solved Problems', value: '89', icon: CheckCircle, color: 'text-emerald-600' },
          { label: 'Expert Answers', value: '67', icon: Star, color: 'text-amber-600' }
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
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Community Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              Farmer Community
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feed" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Community Feed
              </TabsTrigger>
              <TabsTrigger value="forum" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Discussion Forum
              </TabsTrigger>
              <TabsTrigger value="experts" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Expert Network
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="mt-6">
              {/* Post New Message */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-green-600 text-white">
                        {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Share your farming experience, ask questions, or offer advice..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="mb-3 min-h-20"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {['general', 'crops', 'weather', 'market', 'pests'].map((category) => (
                            <Badge
                              key={category}
                              variant={selectedCategory === category ? "default" : "outline"}
                              className="cursor-pointer capitalize"
                              onClick={() => setSelectedCategory(category)}
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                          <Send className="w-4 h-4 mr-2" />
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Filter */}
              <div className="flex gap-2 mb-4">
                <Button 
                  variant={selectedCategory === 'all' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </Button>
                {['crops', 'weather', 'market', 'pests', 'general'].map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category === 'crops' && <Wheat className="w-3 h-3 mr-1" />}
                    {category === 'weather' && <Droplets className="w-3 h-3 mr-1" />}
                    {category === 'market' && <TrendingUp className="w-3 h-3 mr-1" />}
                    {category === 'pests' && <Bug className="w-3 h-3 mr-1" />}
                    {category}
                  </Button>
                ))}
              </div>

              {/* Messages Feed */}
              <div className="space-y-4">
                {filteredMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                              {message.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{message.sender}</span>
                              {message.verified && (
                                <CheckCircle className="w-4 h-4 text-blue-500" />
                              )}
                              {message.expertise && (
                                <Badge variant="secondary" className="text-xs">
                                  {message.expertise}
                                </Badge>
                              )}
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3 mr-1" />
                                {message.location}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="w-3 h-3 mr-1" />
                                {message.timestamp}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">{message.message}</p>
                            <div className="flex items-center gap-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLikeMessage(message.id)}
                                className={message.isLiked ? "text-red-500" : ""}
                              >
                                <Heart className={`w-4 h-4 mr-1 ${message.isLiked ? "fill-current" : ""}`} />
                                {message.likes}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Reply className="w-4 h-4 mr-1" />
                                {message.replies}
                              </Button>
                              <Badge variant="outline" className="capitalize">
                                {message.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="forum" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Discussion Forum</h3>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Discussion
                </Button>
              </div>

              <div className="space-y-4">
                {filteredForumPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-r from-amber-500 to-green-500 text-white">
                              {post.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-lg mb-1">{post.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{post.author}</span>
                                  <MapPin className="w-3 h-3" />
                                  <span>{post.location}</span>
                                  <Clock className="w-3 h-3" />
                                  <span>{post.timestamp}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {post.isSolved && (
                                  <Badge variant="default" className="bg-green-600">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Solved
                                  </Badge>
                                )}
                                <Badge 
                                  variant="outline" 
                                  className={
                                    post.priority === 'high' ? 'text-red-600 border-red-200' :
                                    post.priority === 'medium' ? 'text-amber-600 border-amber-200' :
                                    'text-green-600 border-green-200'
                                  }
                                >
                                  {post.priority === 'high' && <AlertCircle className="w-3 h-3 mr-1" />}
                                  {post.priority.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">{post.content}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                {post.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm">
                                  <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? "fill-current text-red-500" : ""}`} />
                                  {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Reply className="w-4 h-4 mr-1" />
                                  {post.replies}
                                </Button>
                                <Badge variant="outline">{post.category}</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="experts" className="mt-6">
              <div className="text-center py-12">
                <Star className="w-16 h-16 mx-auto text-amber-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expert Network</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with agricultural experts and experienced farmers for personalized advice
                </p>
                <Button className="bg-gradient-to-r from-amber-500 to-green-500">
                  Find Experts Near You
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}