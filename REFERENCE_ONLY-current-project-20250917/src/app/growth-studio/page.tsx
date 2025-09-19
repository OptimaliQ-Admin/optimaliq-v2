'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target,
  TrendingUp,
  BarChart3,
  Users,
  
  Zap,
  Brain,
  Activity,
  Calendar,
  Clock,
  Star,
  Award,
  CheckCircle,
  ArrowRight,
  
  Settings,
  
  
  
  
  
  
  
  
  
  
  
  
  Play,
  Pause,
  Stop,
  Maximize,
  Minimize,
  Lock,
  Unlock,
  Shield,
  Crown,
  Heart,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  Database,
  Server,
  Cloud,
  Wifi,
  Battery,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Camera,
  Video,
  Mic,
  Radio,
  Tv,
  Gamepad2,
  Music,
  Headphones,
  Speaker,
  Volume1,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  FastForward,
  Rewind,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Diamond,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  Surprised,
  Confused,
  Wink,
  Tongue,
  Kiss,
  Hug,
  ThumbsUp,
  ThumbsDown,
  Hand,
  Peace,
  Point,
  Wave,
  Clap,
  Pray,
  Cross,
  Sparkles,
  Bolt,
  Flame,
  Droplets,
  Snowflake,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudHail,
  CloudFog,
  Wind,
  Tornado,
  Hurricane,
  Earthquake,
  Volcano,
  Mountain,
  TreePine,
  TreeDeciduous,
  Flower,
  Leaf,
  Seedling,
  Sprout,
  Cactus,
  PalmTree,
  Cherry,
  Apple,
  Banana,
  Orange,
  Lemon,
  Grape,
  Strawberry,
  Watermelon,
  Pineapple,
  Mango,
  Peach,
  Pear,
  Kiwi,
  Avocado,
  Tomato,
  Carrot,
  Broccoli,
  Corn,
  Pepper,
  Onion,
  Garlic,
  Ginger,
  Mushroom,
  Potato,
  SweetPotato,
  Beet,
  Radish,
  Turnip,
  Cabbage,
  Lettuce,
  Spinach,
  Kale,
  Arugula,
  Basil,
  Mint,
  Oregano,
  Thyme,
  Rosemary,
  Sage,
  Parsley,
  Cilantro,
  Dill,
  Chives,
  Tarragon,
  BayLeaf,
  Cinnamon,
  Nutmeg,
  Cloves,
  Cardamom,
  Vanilla,
  Cocoa,
  Coffee,
  Tea,
  Milk,
  Cream,
  Butter,
  Cheese,
  Yogurt,
  IceCream,
  Cake,
  Cookie,
  Pie,
  Donut,
  Croissant,
  Bagel,
  Bread,
  Toast,
  Sandwich,
  Burger,
  Pizza,
  Pasta,
  Rice,
  Noodles,
  Soup,
  Salad,
  Steak,
  Chicken,
  Fish,
  Shrimp,
  Lobster,
  Crab,
  Oyster,
  Mussel,
  Scallop,
  Egg,
  Bacon,
  Sausage,
  Ham,
  Turkey,
  Duck,
  Lamb,
  Pork,
  Beef,
  Veal,
  Venison,
  Bison,
  Elk,
  Rabbit,
  Squirrel,
  Raccoon,
  Skunk,
  Opossum,
  Armadillo,
  Hedgehog,
  Porcupine,
  Beaver,
  Otter,
  Weasel,
  Ferret,
  Mink,
  Badger,
  Wolverine,
  Fox,
  Wolf,
  Coyote,
  Jackal,
  Hyena,
  Lion,
  Tiger,
  Leopard,
  Jaguar,
  Cheetah,
  Cougar,
  Lynx,
  Bobcat,
  Caracal,
  Serval,
  Ocelot,
  Margay,
  Oncilla,
  Kodkod,
  PampasCat,
  GeoffroyCat,
  User,
  
  
  HelpCircle,
  Info,
  AlertTriangle,
  Check,
  
  
  Copy,
  
  EyeOff,
  
  
  
  
  
  Minus,
  
  
  
  
  
  X,
  Menu,
  Search,
  Download,
  Share2,
  Plus,
  Lightbulb
} from 'lucide-react';

// Import Growth Studio components
import QuadrantVisualization from '@/components/growth-studio/quadrant-visualization';
import GrowthSimulator from '@/components/growth-studio/growth-simulator';
import GrowthLevers from '@/components/growth-studio/growth-levers';
import ProgressTracking from '@/components/growth-studio/progress-tracking';
import ImpactCalculator from '@/components/growth-studio/impact-calculator';
import ScenarioPlanning from '@/components/growth-studio/scenario-planning';
import RecommendationDisplays from '@/components/growth-studio/recommendation-displays';
import GoalSettingInterface from '@/components/growth-studio/goal-setting-interface';
import MilestoneTracker from '@/components/growth-studio/milestone-tracker';
import SuccessMetricsDisplay from '@/components/growth-studio/success-metrics-display';
import AchievementSystem from '@/components/growth-studio/achievement-system';
import ProgressVisualization from '@/components/growth-studio/progress-visualization';

export default function GrowthStudioPage() {
  const [activeTab, setActiveTab] = React.useState('overview');

  const growthStats = {
    currentGrowthRate: 23.5,
    targetGrowthRate: 35.0,
    activeInitiatives: 12,
    completedMilestones: 8,
    totalMilestones: 15,
    teamEngagement: 94,
    marketPosition: 78,
    competitiveAdvantage: 82,
    innovationIndex: 76
  };

  const recentActivity = [
    {
      id: 1,
      type: 'milestone_completed',
      title: 'Q3 Revenue Target Achieved',
      description: 'Exceeded target by 12%',
      timestamp: '2 hours ago',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />
    },
    {
      id: 2,
      type: 'initiative_launched',
      title: 'Customer Retention Program',
      description: 'New initiative launched successfully',
      timestamp: '1 day ago',
      icon: <Zap className="h-4 w-4 text-blue-600" />
    },
    {
      id: 3,
      type: 'goal_updated',
      title: 'Market Expansion Goals',
      description: 'Updated targets for Q4',
      timestamp: '2 days ago',
      icon: <Target className="h-4 w-4 text-purple-600" />
    },
    {
      id: 4,
      type: 'achievement_unlocked',
      title: 'Growth Champion',
      description: 'Team achieved 25% growth milestone',
      timestamp: '3 days ago',
      icon: <Award className="h-4 w-4 text-yellow-600" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Growth Studio</h1>
          <p className="text-gray-600 mt-1">
            Strategic planning, growth simulation, and performance optimization tools
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Initiative
          </Button>
        </div>
      </div>

      {/* Growth Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{growthStats.currentGrowthRate}%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5.2% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Initiatives</p>
                  <p className="text-2xl font-bold text-gray-900">{growthStats.activeInitiatives}</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Target className="h-3 w-3 mr-1" />
                    {growthStats.completedMilestones}/{growthStats.totalMilestones} milestones
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">{growthStats.teamEngagement}%</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Users className="h-3 w-3 mr-1" />
                    Excellent collaboration
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Market Position</p>
                  <p className="text-2xl font-bold text-gray-900">{growthStats.marketPosition}%</p>
                  <p className="text-xs text-orange-600 flex items-center mt-1">
                    <Globe className="h-3 w-3 mr-1" />
                    Strong competitive position
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="planning" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Planning</span>
            </TabsTrigger>
            <TabsTrigger value="simulation" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Simulation</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Goals</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Achievements</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <QuadrantVisualization />
                <ProgressVisualization />
              </div>
              <div className="space-y-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="p-2 bg-gray-100 rounded-full">
                            {activity.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Target className="h-4 w-4 mr-2" />
                        Set New Goals
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Zap className="h-4 w-4 mr-2" />
                        Run Simulation
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScenarioPlanning />
              <RecommendationDisplays />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GrowthLevers />
              <ImpactCalculator />
            </div>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-6">
            <GrowthSimulator />
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressTracking />
              <SuccessMetricsDisplay />
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GoalSettingInterface />
              <MilestoneTracker />
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <AchievementSystem />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}