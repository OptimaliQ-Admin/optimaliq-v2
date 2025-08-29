'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BarChart3,
  Brain,
  Users,
  TrendingUp,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  Home,
  FileText,
  Target,
  LogOut,
  User
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    title?: string;
    company?: string;
  };
}

// Navigation items
const navigationItems = [
  {
    name: 'Dashboard',
    href: '/premium/dashboard',
    icon: Home,
    description: 'Overview and insights'
  },
  {
    name: 'Assessments',
    href: '/premium/assessments',
    icon: FileText,
    description: 'Take and review assessments'
  },
  {
    name: 'Growth Studio',
    href: '/premium/growth-studio',
    icon: Target,
    description: 'Strategic planning tools'
  },
  {
    name: 'Team',
    href: '/premium/team',
    icon: Users,
    description: 'Team management'
  },
  {
    name: 'Market Intelligence',
    href: '/premium/market-intelligence',
    icon: TrendingUp,
    description: 'Market trends and insights'
  },
  {
    name: 'Analytics',
    href: '/premium/analytics',
    icon: BarChart3,
    description: 'Performance analytics'
  }
];

const sidebarVariants = {
  open: { 
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  closed: { 
    x: '-100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
};

const overlayVariants = {
  open: { opacity: 1, backdropFilter: 'blur(4px)' },
  closed: { opacity: 0, backdropFilter: 'blur(0px)' }
};

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false); // Desktop doesn't need mobile sidebar
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full bg-card border-r border-border transition-all duration-300
        ${sidebarCollapsed ? 'w-16' : 'w-64'} hidden lg:block
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-bold text-lg"
                >
                  OptimaliQ
                </motion.div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }
                    `}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.name}</div>
                        <div className="text-xs opacity-75 truncate">
                          {item.description}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Collapse Toggle */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="w-full justify-start"
            >
              <Menu className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-lg">OptimaliQ</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  return (
                    <Link key={item.name} href={item.href}>
                      <div
                        className={`
                          flex items-center gap-3 px-3 py-3 rounded-lg transition-colors
                          ${isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                          }
                        `}
                      >
                        <item.icon className="h-5 w-5" />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs opacity-75">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`
        transition-all duration-300
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
      `}>
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search assessments, insights..."
                  className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="" alt="User avatar" />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user ? `${user.firstName} ${user.lastName}` : 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || 'user@example.com'}
                      </p>
                      {user?.title && (
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.title} {user.company && `at ${user.company}`}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
