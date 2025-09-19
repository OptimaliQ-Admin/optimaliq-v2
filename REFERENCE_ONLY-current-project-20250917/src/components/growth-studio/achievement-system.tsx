'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Award,
  Trophy,
  Medal,
  Star,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Share2,
  Download,
  Settings,
  Eye,
  EyeOff,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertTriangle,
  Info,
  HelpCircle,
  Zap,
  Brain,
  Lightbulb,
  Activity,
  Users,
  Building2,
  Globe,
  Calendar,
  Clock,
  Filter,
  Search,
  Bookmark,
  Flag,
  Archive,
  ExternalLink,
  Upload,
  FileText,
  Image,
  Table,
  Grid,
  List,
  Layout,
  Layers,
  Play,
  Pause,
  Stop,
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Move,
  Resize,
  Lock,
  Unlock,
  Maximize,
  Minimize,
  CheckCircle,
  Circle,
  CircleDot,
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'acquisition' | 'retention' | 'monetization' | 'efficiency' | 'expansion' | 'innovation' | 'milestone' | 'custom';
  type: 'badge' | 'trophy' | 'medal' | 'certificate' | 'rank' | 'streak' | 'milestone' | 'custom';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legendary';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  status: 'locked' | 'unlocked' | 'claimed' | 'archived';
  progress: number; // 0-100
  requirements: {
    [key: string]: {
      label: string;
      target: number;
      current: number;
      unit: string;
      description: string;
    };
  };
  rewards: {
    points: number;
    experience: number;
    badges: string[];
    unlocks: string[];
    special: {
      title?: string;
      color?: string;
      icon?: string;
      privileges?: string[];
    };
  };
  conditions: {
    trigger: 'manual' | 'automatic' | 'scheduled' | 'event';
    criteria: string[];
    dependencies: string[];
    cooldown?: number; // in hours
  };
  metadata: {
    createdAt: Date;
    unlockedAt?: Date;
    claimedAt?: Date;
    expiresAt?: Date;
    version: string;
    tags: string[];
    owner?: string;
    team?: string;
    industry?: string;
    region?: string;
    segment?: string;
    source?: string;
    visibility?: 'public' | 'private' | 'team';
    permissions?: string[];
  };
}

export interface AchievementSystemProps {
  achievements: Achievement[];
  onAchievementCreate?: (achievement: Achievement) => void;
  onAchievementUpdate?: (achievement: Achievement) => void;
  onAchievementDelete?: (achievementId: string) => void;
  onAchievementDuplicate?: (achievement: Achievement) => void;
  onAchievementArchive?: (achievement: Achievement) => void;
  onAchievementUnlock?: (achievement: Achievement) => void;
  onAchievementClaim?: (achievement: Achievement) => void;
  onAchievementProgressUpdate?: (achievement: Achievement, progress: number) => void;
  onRequirementUpdate?: (achievement: Achievement, requirementKey: string, value: number) => void;
  onAchievementExport?: (achievement: Achievement, format: string) => void;
  onAchievementShare?: (achievement: Achievement) => void;
  className?: string;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  achievements,
  onAchievementCreate,
  onAchievementUpdate,
  onAchievementDelete,
  onAchievementDuplicate,
  onAchievementArchive,
  onAchievementUnlock,
  onAchievementClaim,
  onAchievementProgressUpdate,
  onRequirementUpdate,
  onAchievementExport,
  onAchievementShare,
  className
}) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'tier' | 'rarity' | 'progress' | 'status' | 'createdAt'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'gallery'>('gallery');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const categories = [
    { value: 'all', label: 'All Categories', icon: Grid },
    { value: 'acquisition', label: 'Acquisition', icon: Users, color: 'text-blue-600' },
    { value: 'retention', label: 'Retention', icon: Target, color: 'text-green-600' },
    { value: 'monetization', label: 'Monetization', icon: DollarSign, color: 'text-purple-600' },
    { value: 'efficiency', label: 'Efficiency', icon: Zap, color: 'text-orange-600' },
    { value: 'expansion', label: 'Expansion', icon: TrendingUp, color: 'text-indigo-600' },
    { value: 'innovation', label: 'Innovation', icon: Lightbulb, color: 'text-pink-600' },
    { value: 'milestone', label: 'Milestone', icon: Flag, color: 'text-yellow-600' },
    { value: 'custom', label: 'Custom', icon: Settings, color: 'text-gray-600' }
  ];

  const types = [
    { value: 'all', label: 'All Types', icon: Grid },
    { value: 'badge', label: 'Badge', icon: Award, color: 'text-blue-600' },
    { value: 'trophy', label: 'Trophy', icon: Trophy, color: 'text-yellow-600' },
    { value: 'medal', label: 'Medal', icon: Medal, color: 'text-orange-600' },
    { value: 'certificate', label: 'Certificate', icon: FileText, color: 'text-green-600' },
    { value: 'rank', label: 'Rank', icon: Star, color: 'text-purple-600' },
    { value: 'streak', label: 'Streak', icon: Activity, color: 'text-red-600' },
    { value: 'milestone', label: 'Milestone', icon: Flag, color: 'text-indigo-600' },
    { value: 'custom', label: 'Custom', icon: Settings, color: 'text-gray-600' }
  ];

  const tiers = [
    { value: 'all', label: 'All Tiers', color: 'text-gray-600' },
    { value: 'bronze', label: 'Bronze', color: 'text-orange-600' },
    { value: 'silver', label: 'Silver', color: 'text-gray-600' },
    { value: 'gold', label: 'Gold', color: 'text-yellow-600' },
    { value: 'platinum', label: 'Platinum', color: 'text-blue-600' },
    { value: 'diamond', label: 'Diamond', color: 'text-cyan-600' },
    { value: 'legendary', label: 'Legendary', color: 'text-purple-600' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses', color: 'text-gray-600' },
    { value: 'locked', label: 'Locked', color: 'text-gray-600' },
    { value: 'unlocked', label: 'Unlocked', color: 'text-blue-600' },
    { value: 'claimed', label: 'Claimed', color: 'text-green-600' },
    { value: 'archived', label: 'Archived', color: 'text-gray-600' }
  ];

  const filteredAchievements = achievements
    .filter(achievement => {
      const matchesSearch = achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           achievement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           achievement.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || achievement.category === filterCategory;
      const matchesType = filterType === 'all' || achievement.type === filterType;
      const matchesTier = filterTier === 'all' || achievement.tier === filterTier;
      const matchesStatus = filterStatus === 'all' || achievement.status === filterStatus;
      return matchesSearch && matchesCategory && matchesType && matchesTier && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'tier':
          const tierOrder = { 'legendary': 6, 'diamond': 5, 'platinum': 4, 'gold': 3, 'silver': 2, 'bronze': 1 };
          aValue = tierOrder[a.tier as keyof typeof tierOrder];
          bValue = tierOrder[b.tier as keyof typeof tierOrder];
          break;
        case 'rarity':
          const rarityOrder = { 'mythic': 6, 'legendary': 5, 'epic': 4, 'rare': 3, 'uncommon': 2, 'common': 1 };
          aValue = rarityOrder[a.rarity as keyof typeof rarityOrder];
          bValue = rarityOrder[b.rarity as keyof typeof rarityOrder];
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'status':
          const statusOrder = { 'claimed': 4, 'unlocked': 3, 'locked': 2, 'archived': 1 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'createdAt':
          aValue = a.metadata.createdAt.getTime();
          bValue = b.metadata.createdAt.getTime();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleAchievementCreate = () => {
    const newAchievement: Achievement = {
      id: '',
      title: 'New Achievement',
      description: 'A new achievement to unlock',
      category: 'acquisition',
      type: 'badge',
      tier: 'bronze',
      rarity: 'common',
      status: 'locked',
      progress: 0,
      requirements: {
        target: {
          label: 'Target',
          target: 100,
          current: 0,
          unit: 'units',
          description: 'Reach the target value'
        }
      },
      rewards: {
        points: 100,
        experience: 50,
        badges: [],
        unlocks: [],
        special: {}
      },
      conditions: {
        trigger: 'automatic',
        criteria: [],
        dependencies: []
      },
      metadata: {
        createdAt: new Date(),
        version: '1.0',
        tags: [],
        visibility: 'public'
      }
    };
    onAchievementCreate?.(newAchievement);
  };

  const handleAchievementUpdate = (achievement: Achievement, updates: Partial<Achievement>) => {
    const updatedAchievement = {
      ...achievement,
      ...updates,
      metadata: {
        ...achievement.metadata,
        ...updates.metadata
      }
    };
    setSelectedAchievement(updatedAchievement);
    onAchievementUpdate?.(updatedAchievement);
  };

  const handleAchievementDelete = (achievementId: string) => {
    onAchievementDelete?.(achievementId);
    if (selectedAchievement?.id === achievementId) {
      setSelectedAchievement(null);
    }
  };

  const handleAchievementDuplicate = (achievement: Achievement) => {
    const duplicatedAchievement = {
      ...achievement,
      id: '',
      title: `${achievement.title} (Copy)`,
      status: 'locked',
      progress: 0,
      metadata: {
        ...achievement.metadata,
        createdAt: new Date(),
        unlockedAt: undefined,
        claimedAt: undefined
      }
    };
    onAchievementDuplicate?.(duplicatedAchievement);
  };

  const handleAchievementArchive = (achievement: Achievement) => {
    onAchievementArchive?.(achievement);
  };

  const handleAchievementUnlock = (achievement: Achievement) => {
    onAchievementUnlock?.(achievement);
  };

  const handleAchievementClaim = (achievement: Achievement) => {
    onAchievementClaim?.(achievement);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData?.icon || Grid;
  };

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData?.color || 'text-gray-600';
  };

  const getTypeIcon = (type: string) => {
    const typeData = types.find(t => t.value === type);
    return typeData?.icon || Award;
  };

  const getTypeColor = (type: string) => {
    const typeData = types.find(t => t.value === type);
    return typeData?.color || 'text-gray-600';
  };

  const getTierColor = (tier: string) => {
    const tierData = tiers.find(t => t.value === tier);
    return tierData?.color || 'text-gray-600';
  };

  const getStatusColor = (status: string) => {
    const statusData = statuses.find(s => s.value === status);
    return statusData?.color || 'text-gray-600';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600';
      case 'uncommon':
        return 'text-green-600';
      case 'rare':
        return 'text-blue-600';
      case 'epic':
        return 'text-purple-600';
      case 'legendary':
        return 'text-orange-600';
      case 'mythic':
        return 'text-pink-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'from-orange-400 to-orange-600';
      case 'silver':
        return 'from-gray-300 to-gray-500';
      case 'gold':
        return 'from-yellow-400 to-yellow-600';
      case 'platinum':
        return 'from-blue-400 to-blue-600';
      case 'diamond':
        return 'from-cyan-400 to-cyan-600';
      case 'legendary':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const renderAchievementCard = (achievement: Achievement) => {
    const CategoryIcon = getCategoryIcon(achievement.category);
    const TypeIcon = getTypeIcon(achievement.type);
    const isSelected = selectedAchievement?.id === achievement.id;
    const isLocked = achievement.status === 'locked';
    
    return (
      <Card
        key={achievement.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-lg',
          isSelected && 'ring-2 ring-blue-500',
          isLocked && 'opacity-60'
        )}
        onClick={() => setSelectedAchievement(achievement)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center shadow-lg',
                `bg-gradient-to-r ${getTierGradient(achievement.tier)}`
              )}>
                <TypeIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <CardTitle className="text-sm font-medium truncate">
                    {achievement.title}
                  </CardTitle>
                  {achievement.status === 'claimed' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {achievement.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge
                variant="outline"
                className={cn('text-xs', getTierColor(achievement.tier))}
              >
                {achievement.tier}
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-xs', getRarityColor(achievement.rarity))}
              >
                {achievement.rarity}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium">{achievement.progress}%</span>
              </div>
              <Progress
                value={achievement.progress}
                className="h-2"
              />
            </div>

            {/* Requirements */}
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Requirements</div>
              <div className="space-y-1">
                {Object.entries(achievement.requirements).slice(0, 2).map(([key, req]) => (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 truncate">{req.label}</span>
                    <span className="font-medium">{req.current}/{req.target} {req.unit}</span>
                  </div>
                ))}
                {Object.keys(achievement.requirements).length > 2 && (
                  <div className="text-xs text-gray-400">
                    +{Object.keys(achievement.requirements).length - 2} more requirements
                  </div>
                )}
              </div>
            </div>

            {/* Rewards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Points:</span>
                <span className="ml-1 font-medium">{achievement.rewards.points}</span>
              </div>
              <div>
                <span className="text-gray-500">XP:</span>
                <span className="ml-1 font-medium">{achievement.rewards.experience}</span>
              </div>
            </div>

            {/* Tags */}
            {achievement.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {achievement.metadata.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {achievement.metadata.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{achievement.metadata.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                {achievement.status === 'unlocked' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAchievementClaim(achievement);
                    }}
                  >
                    <Award className="h-3 w-3 text-green-500" />
                  </Button>
                )}
                {achievement.status === 'locked' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAchievementUnlock(achievement);
                    }}
                  >
                    <Unlock className="h-3 w-3 text-blue-500" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAchievementDuplicate(achievement);
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAchievementShare?.(achievement);
                  }}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAchievementDelete(achievement.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderAchievementList = () => (
    <div className="space-y-2">
      {filteredAchievements.map((achievement) => {
        const isSelected = selectedAchievement?.id === achievement.id;
        const isLocked = achievement.status === 'locked';
        
        return (
          <div
            key={achievement.id}
            className={cn(
              'flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50',
              isSelected && 'bg-blue-50 border-blue-200',
              isLocked && 'opacity-60'
            )}
            onClick={() => setSelectedAchievement(achievement)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center shadow-md',
                `bg-gradient-to-r ${getTierGradient(achievement.tier)}`
              )}>
                {React.createElement(getTypeIcon(achievement.type), {
                  className: 'h-5 w-5 text-white'
                })}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium truncate">{achievement.title}</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getTierColor(achievement.tier))}
                  >
                    {achievement.tier}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getRarityColor(achievement.rarity))}
                  >
                    {achievement.rarity}
                  </Badge>
                  {achievement.status === 'claimed' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{achievement.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="text-center">
                <div className="font-medium">{achievement.progress}%</div>
                <div>Progress</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{achievement.rewards.points}</div>
                <div>Points</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{achievement.rewards.experience}</div>
                <div>XP</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderGallery = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAchievements.map(renderAchievementCard)}
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Achievement System</h2>
          <p className="text-sm text-gray-500">Track and manage your growth achievements</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button onClick={handleAchievementCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Achievement
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search achievements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <category.icon className="h-4 w-4" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tier">Tier</Label>
                <Select value={filterTier} onValueChange={setFilterTier}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiers.map((tier) => (
                      <SelectItem key={tier.value} value={tier.value}>
                        <span className={tier.color}>{tier.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <span className={status.color}>{status.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'gallery' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('gallery')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Layout className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="sort">Sort by</Label>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="tier">Tier</SelectItem>
              <SelectItem value="rarity">Rarity</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="createdAt">Date</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {viewMode === 'gallery' && renderGallery()}
        
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map(renderAchievementCard)}
          </div>
        )}
        
        {viewMode === 'list' && renderAchievementList()}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterCategory !== 'all' || filterType !== 'all' || filterTier !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first achievement'
            }
          </p>
          <Button onClick={handleAchievementCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Achievement
          </Button>
        </div>
      )}
    </div>
  );
};

export default AchievementSystem;
