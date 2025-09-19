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
  Plus,
  Minus,
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
  Star,
  Award,
  Target,
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
  RadarChart,
  DoughnutChart,
  PolarChart,
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
  CircleCheck,
  CircleX,
  CirclePause,
  CirclePlay,
  CircleStop,
  CircleAlert,
  CircleInfo,
  CircleQuestion,
  CircleHelp,
  CircleZap,
  CircleBrain,
  CircleLightbulb,
  CircleStar,
  CircleAward,
  CircleTarget,
  CircleActivity,
  CircleUsers,
  CircleBuilding2,
  CircleGlobe,
  CircleCalendar,
  CircleClock,
  CircleFilter,
  CircleSearch,
  CircleBookmark,
  CircleFlag,
  CircleArchive,
  CircleExternalLink,
  CircleUpload,
  CircleFileText,
  CircleImage,
  CircleTable,
  CircleGrid,
  CircleList,
  CircleLayout,
  CircleLayers,
  Bell,
  Menu,
  User,
  LogOut,
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
  HeadphonesIcon,
  Speaker,
  Volume1,
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  FastForward,
  Rewind,
  Square,
  Circle as CircleIcon,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Diamond,
  Heart as HeartIcon,
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
  Star as StarIcon,
  Sparkles,
  Zap as ZapIcon,
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
  PampasCat as PampasCatIcon,
  GeoffroyCat as GeoffroyCatIcon,
  Oncilla as OncillaIcon,
  Kodkod as KodkodIcon,
  Margay as MargayIcon,
  Ocelot as OcelotIcon,
  Serval as ServalIcon,
  Caracal as CaracalIcon,
  Bobcat as BobcatIcon,
  Lynx as LynxIcon,
  Cougar as CougarIcon,
  Cheetah as CheetahIcon,
  Jaguar as JaguarIcon,
  Leopard as LeopardIcon,
  Tiger as TigerIcon,
  Lion as LionIcon,
  Hyena as HyenaIcon,
  Jackal as JackalIcon,
  Coyote as CoyoteIcon,
  Wolf as WolfIcon,
  Fox as FoxIcon,
  Wolverine as WolverineIcon,
  Badger as BadgerIcon,
  Mink as MinkIcon,
  Ferret as FerretIcon,
  Weasel as WeaselIcon,
  Otter as OtterIcon,
  Beaver as BeaverIcon,
  Porcupine as PorcupineIcon,
  Hedgehog as HedgehogIcon,
  Armadillo as ArmadilloIcon,
  Opossum as OpossumIcon,
  Skunk as SkunkIcon,
  Raccoon as RaccoonIcon,
  Squirrel as SquirrelIcon,
  Rabbit as RabbitIcon,
  Elk as ElkIcon,
  Bison as BisonIcon,
  Venison as VenisonIcon,
  Veal as VealIcon,
  Beef as BeefIcon,
  Pork as PorkIcon,
  Lamb as LambIcon,
  Duck as DuckIcon,
  Turkey as TurkeyIcon,
  Ham as HamIcon,
  Sausage as SausageIcon,
  Bacon as BaconIcon,
  Egg as EggIcon,
  Scallop as ScallopIcon,
  Mussel as MusselIcon,
  Oyster as OysterIcon,
  Crab as CrabIcon,
  Lobster as LobsterIcon,
  Shrimp as ShrimpIcon,
  Fish as FishIcon,
  Chicken as ChickenIcon,
  Steak as SteakIcon,
  Salad as SaladIcon,
  Soup as SoupIcon,
  Noodles as NoodlesIcon,
  Rice as RiceIcon,
  Pasta as PastaIcon,
  Pizza as PizzaIcon,
  Burger as BurgerIcon,
  Sandwich as SandwichIcon,
  Toast as ToastIcon,
  Bread as BreadIcon,
  Bagel as BagelIcon,
  Croissant as CroissantIcon,
  Donut as DonutIcon,
  Pie as PieIcon,
  Cookie as CookieIcon,
  Cake as CakeIcon,
  IceCream as IceCreamIcon,
  Yogurt as YogurtIcon,
  Cheese as CheeseIcon,
  Butter as ButterIcon,
  Cream as CreamIcon,
  Milk as MilkIcon,
  Tea as TeaIcon,
  Coffee as CoffeeIcon,
  Cocoa as CocoaIcon,
  Vanilla as VanillaIcon,
  Cardamom as CardamomIcon,
  Cloves as ClovesIcon,
  Nutmeg as NutmegIcon,
  Cinnamon as CinnamonIcon,
  BayLeaf as BayLeafIcon,
  Tarragon as TarragonIcon,
  Chives as ChivesIcon,
  Dill as DillIcon,
  Cilantro as CilantroIcon,
  Parsley as ParsleyIcon,
  Sage as SageIcon,
  Rosemary as RosemaryIcon,
  Thyme as ThymeIcon,
  Oregano as OreganoIcon,
  Mint as MintIcon,
  Basil as BasilIcon,
  Arugula as ArugulaIcon,
  Kale as KaleIcon,
  Spinach as SpinachIcon,
  Lettuce as LettuceIcon,
  Cabbage as CabbageIcon,
  Turnip as TurnipIcon,
  Radish as RadishIcon,
  Beet as BeetIcon,
  SweetPotato as SweetPotatoIcon,
  Potato as PotatoIcon,
  Mushroom as MushroomIcon,
  Ginger as GingerIcon,
  Garlic as GarlicIcon,
  Onion as OnionIcon,
  Pepper as PepperIcon,
  Corn as CornIcon,
  Broccoli as BroccoliIcon,
  Carrot as CarrotIcon,
  Tomato as TomatoIcon,
  Avocado as AvocadoIcon,
  Kiwi as KiwiIcon,
  Pear as PearIcon,
  Peach as PeachIcon,
  Mango as MangoIcon,
  Pineapple as PineappleIcon,
  Watermelon as WatermelonIcon,
  Strawberry as StrawberryIcon,
  Grape as GrapeIcon,
  Lemon as LemonIcon,
  Orange as OrangeIcon,
  Banana as BananaIcon,
  Apple as AppleIcon,
  Cherry as CherryIcon,
  PalmTree as PalmTreeIcon,
  Cactus as CactusIcon,
  Sprout as SproutIcon,
  Seedling as SeedlingIcon,
  Leaf as LeafIcon,
  Flower as FlowerIcon,
  TreeDeciduous as TreeDeciduousIcon,
  TreePine as TreePineIcon,
  Mountain as MountainIcon,
  Volcano as VolcanoIcon,
  Earthquake as EarthquakeIcon,
  Hurricane as HurricaneIcon,
  Tornado as TornadoIcon,
  Wind as WindIcon,
  CloudFog as CloudFogIcon,
  CloudHail as CloudHailIcon,
  CloudDrizzle as CloudDrizzleIcon,
  CloudLightning as CloudLightningIcon,
  CloudSnow as CloudSnowIcon,
  CloudRain as CloudRainIcon,
  Snowflake as SnowflakeIcon,
  Droplets as DropletsIcon,
  Flame as FlameIcon,
  Bolt as BoltIcon,
  Zap as ZapIcon,
  Sparkles as SparklesIcon,
  Star as StarIcon,
  Cross as CrossIcon,
  Pray as PrayIcon,
  Clap as ClapIcon,
  Wave as WaveIcon,
  Point as PointIcon,
  Peace as PeaceIcon,
  Hand as HandIcon,
  ThumbsDown as ThumbsDownIcon,
  ThumbsUp as ThumbsUpIcon,
  Hug as HugIcon,
  Kiss as KissIcon,
  Tongue as TongueIcon,
  Wink as WinkIcon,
  Confused as ConfusedIcon,
  Surprised as SurprisedIcon,
  Angry as AngryIcon,
  Laugh as LaughIcon,
  Meh as MehIcon,
  Frown as FrownIcon,
  Smile as SmileIcon,
  Heart as HeartIcon,
  Diamond as DiamondIcon,
  Pentagon as PentagonIcon,
  Octagon as OctagonIcon,
  Hexagon as HexagonIcon,
  Triangle as TriangleIcon,
  Circle as CircleIcon,
  Square as SquareIcon,
  Rewind as RewindIcon,
  FastForward as FastForwardIcon,
  Shuffle as ShuffleIcon,
  Repeat as RepeatIcon,
  SkipForward as SkipForwardIcon,
  SkipBack as SkipBackIcon,
  Pause as PauseIcon,
  Play as PlayIcon,
  VolumeX as VolumeXIcon,
  Volume2 as Volume2Icon,
  Volume1 as Volume1Icon,
  Speaker as SpeakerIcon,
  Headphones as HeadphonesIcon,
  Music as MusicIcon,
  Gamepad2 as Gamepad2Icon,
  Tv as TvIcon,
  Radio as RadioIcon,
  MicOff as MicOffIcon,
  Mic as MicIcon,
  Video as VideoIcon,
  Camera as CameraIcon,
  Headphones as HeadphonesIcon,
  Desktop as DesktopIcon,
  Laptop as LaptopIcon,
  Tablet as TabletIcon,
  Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  VolumeX as VolumeXIcon,
  Volume2 as Volume2Icon,
  BatteryLow as BatteryLowIcon,
  Battery as BatteryIcon,
  WifiOff as WifiOffIcon,
  Wifi as WifiIcon,
  Cloud as CloudIcon,
  Server as ServerIcon,
  Database as DatabaseIcon,
  Palette as PaletteIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  MessageSquare as MessageSquareIcon,
  Heart as HeartIcon,
  UserX as UserXIcon,
  UserCheck as UserCheckIcon,
  Crown as CrownIcon,
  Shield as ShieldIcon,
  LogOut as LogOutIcon,
  User as UserIcon,
  CircleLayers as CircleLayersIcon,
  CircleLayout as CircleLayoutIcon,
  CircleList as CircleListIcon,
  CircleGrid as CircleGridIcon,
  CircleTable as CircleTableIcon,
  CircleImage as CircleImageIcon,
  CircleFileText as CircleFileTextIcon,
  CircleUpload as CircleUploadIcon,
  CircleExternalLink as CircleExternalLinkIcon,
  CircleFlag as CircleFlagIcon,
  CircleBookmark as CircleBookmarkIcon,
  CircleSearch as CircleSearchIcon,
  CircleFilter as CircleFilterIcon,
  CircleClock as CircleClockIcon,
  CircleCalendar as CircleCalendarIcon,
  CircleGlobe as CircleGlobeIcon,
  CircleBuilding2 as CircleBuilding2Icon,
  CircleUsers as CircleUsersIcon,
  CircleActivity as CircleActivityIcon,
  CircleTarget as CircleTargetIcon,
  CircleAward as CircleAwardIcon,
  CircleStar as CircleStarIcon,
  CircleLightbulb as CircleLightbulbIcon,
  CircleBrain as CircleBrainIcon,
  CircleZap as CircleZapIcon,
  CircleHelp as CircleHelpIcon,
  CircleQuestion as CircleQuestionIcon,
  CircleInfo as CircleInfoIcon,
  CircleAlert as CircleAlertIcon,
  CircleStop as CircleStopIcon,
  CirclePlay as CirclePlayIcon,
  CirclePause as CirclePauseIcon,
  CircleX as CircleXIcon,
  CircleCheck as CircleCheckIcon,
  CircleDot as CircleDotIcon,
  Circle as CircleIcon,
  Minimize as MinimizeIcon,
  Maximize as MaximizeIcon,
  Unlock as UnlockIcon,
  Lock as LockIcon,
  Resize as ResizeIcon,
  Move as MoveIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  ArrowDownRight as ArrowDownRightIcon,
  ArrowUpRight as ArrowUpRightIcon,
  Percent as PercentIcon,
  DollarSign as DollarSignIcon,
  PolarChart as PolarChartIcon,
  DoughnutChart as DoughnutChartIcon,
  RadarChart as RadarChartIcon,
  ScatterChart as ScatterChartIcon,
  AreaChart as AreaChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  Play as PlayIcon,
  Layers as LayersIcon,
  Layout as LayoutIcon,
  List as ListIcon,
  Grid as GridIcon,
  Table as TableIcon,
  Image as ImageIcon,
  FileText as FileTextIcon,
  Upload as UploadIcon,
  Archive as ArchiveIcon,
  Flag as FlagIcon,
  Bookmark as BookmarkIcon,
  Filter as FilterIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Globe as GlobeIcon,
  Building2 as Building2Icon,
  Activity as ActivityIcon,
  Target as TargetIcon,
  Award as AwardIcon,
  Star as StarIcon,
  Lightbulb as LightbulbIcon,
  Brain as BrainIcon,
  Zap as ZapIcon,
  HelpCircle as HelpCircleIcon,
  Info as InfoIcon,
  AlertTriangle as AlertTriangleIcon,
  Check as CheckIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Trash2 as Trash2Icon,
  Copy as CopyIcon,
  Edit as EditIcon,
  EyeOff as EyeOffIcon,
  Eye as EyeIcon,
  Download as DownloadIcon,
  Share2 as Share2Icon,
  Save as SaveIcon,
  RotateCcw as RotateCcwIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronUp as ChevronUpIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon,
  X as XIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Bell as BellIcon,
  Settings as SettingsIcon,
  Users as UsersIcon,
  BarChart3 as BarChart3Icon,
  Home as HomeIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ComponentType<any>;
  badge?: string;
  actions?: {
    label: string;
    icon?: React.ComponentType<any>;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    disabled?: boolean;
    loading?: boolean;
  }[];
  breadcrumbs?: {
    label: string;
    href?: string;
    icon?: React.ComponentType<any>;
  }[];
  tabs?: {
    id: string;
    label: string;
    icon?: React.ComponentType<any>;
    badge?: string;
    isActive?: boolean;
    onClick: () => void;
  }[];
  stats?: {
    label: string;
    value: string | number;
    change?: {
      value: number;
      type: 'increase' | 'decrease' | 'neutral';
    };
    icon?: React.ComponentType<any>;
  }[];
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  icon: Icon,
  badge,
  actions = [],
  breadcrumbs = [],
  tabs = [],
  stats = [],
  className
}) => {
  const [activeTab, setActiveTab] = useState<string | null>(
    tabs.find(tab => tab.isActive)?.id || (tabs.length > 0 ? tabs[0].id : null)
  );

  const handleTabClick = (tabId: string, onClick: () => void) => {
    setActiveTab(tabId);
    onClick();
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              <div className="flex items-center space-x-1">
                {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4" />}
                {breadcrumb.href ? (
                  <a
                    href={breadcrumb.href}
                    className="hover:text-gray-700 transition-colors duration-200"
                  >
                    {breadcrumb.label}
                  </a>
                ) : (
                  <span>{breadcrumb.label}</span>
                )}
              </div>
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Header Content */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {Icon && (
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Icon className="h-6 w-6 text-white" />
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-lg text-gray-600">{subtitle}</p>
            )}
            {description && (
              <p className="text-sm text-gray-500 max-w-2xl">{description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex items-center space-x-2">
            {actions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  onClick={action.onClick}
                  disabled={action.disabled || action.loading}
                  className="flex items-center space-x-2"
                >
                  {ActionIcon && <ActionIcon className="h-4 w-4" />}
                  <span>{action.label}</span>
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {StatIcon && (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <StatIcon className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      {stat.change && (
                        <div className="flex items-center space-x-1 mt-1">
                          {stat.change.type === 'increase' && (
                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                          )}
                          {stat.change.type === 'decrease' && (
                            <ArrowDownRight className="h-3 w-3 text-red-500" />
                          )}
                          {stat.change.type === 'neutral' && (
                            <Minus className="h-3 w-3 text-gray-500" />
                          )}
                          <span className={cn(
                            'text-xs font-medium',
                            stat.change.type === 'increase' && 'text-green-600',
                            stat.change.type === 'decrease' && 'text-red-600',
                            stat.change.type === 'neutral' && 'text-gray-600'
                          )}>
                            {stat.change.value > 0 ? '+' : ''}{stat.change.value}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={cn(
                    'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                  onClick={() => handleTabClick(tab.id, tab.onClick)}
                >
                  {TabIcon && <TabIcon className="h-4 w-4" />}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {tab.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
