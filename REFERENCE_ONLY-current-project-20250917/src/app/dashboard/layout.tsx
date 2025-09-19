'use client';

import React from 'react';
import MainNavigation, { NavigationItem } from '@/components/navigation/main-navigation';
import BreadcrumbNavigation from '@/components/navigation/breadcrumb-navigation';
import PageLayout from '@/components/layout/page-layout';
import { 
  Home,
  BarChart3,
  Users,
  Target,
  FileText,
  TrendingUp,
  Settings,
  Bell,
  LogOut,
  Brain,
  Zap,
  Globe,
  Building2,
  Activity,
  Calendar,
  Clock,
  Shield,
  Crown,
  UserCheck,
  UserX,
  Heart,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Link,
  Code,
  Palette,
  Database,
  Server,
  Cloud,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Headphones,
  Camera,
  Video,
  Mic,
  MicOff,
  Radio,
  Tv,
  Gamepad2,
  Music,
  Speaker,
  Volume1,
  Play,
  Pause,
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
  Star,
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
  Lightbulb,
  Award,
  HelpCircle,
  Info,
  AlertTriangle,
  Check,
  MoreHorizontal,
  Trash2,
  Copy,
  Edit,
  EyeOff,
  Eye,
  Download,
  Share2,
  Save,
  RotateCcw,
  Minus,
  Plus,
  ChevronLeft,
  ChevronUp,
  ChevronRight,
  ChevronDown,
  X,
  Menu,
  Search
} from 'lucide-react';

// Navigation configuration
const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    metadata: {
      description: 'Overview and key metrics',
      category: 'main'
    }
  },
  {
    id: 'assessments',
    label: 'Assessments',
    icon: FileText,
    href: '/assessments',
    metadata: {
      description: 'Growth assessments and evaluations',
      category: 'main'
    }
  },
  {
    id: 'growth-studio',
    label: 'Growth Studio',
    icon: Target,
    href: '/growth-studio',
    metadata: {
      description: 'Strategic planning and growth tools',
      category: 'main'
    }
  },
  {
    id: 'team',
    label: 'Team Management',
    icon: Users,
    href: '/team',
    metadata: {
      description: 'Team collaboration and management',
      category: 'main'
    },
    children: [
      {
        id: 'team-overview',
        label: 'Team Overview',
        icon: Users,
        href: '/team/overview',
        metadata: {
          description: 'Team structure and performance',
          category: 'team'
        }
      },
      {
        id: 'role-management',
        label: 'Role Management',
        icon: UserCheck,
        href: '/team/roles',
        metadata: {
          description: 'Manage roles and permissions',
          category: 'team'
        }
      },
      {
        id: 'performance-tracking',
        label: 'Performance Tracking',
        icon: BarChart3,
        href: '/team/performance',
        metadata: {
          description: 'Track team performance metrics',
          category: 'team'
        }
      },
      {
        id: 'team-analytics',
        label: 'Team Analytics',
        icon: Activity,
        href: '/team/analytics',
        metadata: {
          description: 'Advanced team analytics',
          category: 'team'
        }
      }
    ]
  },
  {
    id: 'market-intelligence',
    label: 'Market Intelligence',
    icon: Globe,
    href: '/market-intelligence',
    metadata: {
      description: 'Market trends and competitive analysis',
      category: 'main'
    }
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
    metadata: {
      description: 'Performance analytics and insights',
      category: 'main'
    }
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    metadata: {
      description: 'Application settings and preferences',
      category: 'main'
    }
  }
];

// Mock user data
const mockUser = {
  name: 'Jennifer Walsh',
  email: 'jennifer@healthforward.com',
  role: 'CEO & Executive Director',
  notifications: 3
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleItemClick = (item: NavigationItem) => {
    console.log('Navigation item clicked:', item);
  };

  const handleItemToggle = (item: NavigationItem) => {
    console.log('Navigation item toggled:', item);
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Navigation Sidebar */}
      <div className="w-64 flex-shrink-0">
        <MainNavigation
          items={navigationItems}
          onItemClick={handleItemClick}
          onItemToggle={handleItemToggle}
          onSearch={handleSearch}
          onNotificationClick={handleNotificationClick}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          onLogout={handleLogout}
          user={mockUser}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <BreadcrumbNavigation
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Overview', href: '/dashboard', isActive: true }
            ]}
            separator="/"
            className="text-sm"
          />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <PageLayout>
            {children}
          </PageLayout>
        </div>
      </div>
    </div>
  );
}
