/**
 * AI Monitoring Dashboard
 * 
 * Provides real-time monitoring of:
 * - AI rate limiting statistics
 * - Model performance metrics
 * - System health and alerts
 * - Cost analysis and usage trends
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Settings,
  BarChart3,
  Zap,
  Shield
} from 'lucide-react';
import { aiRateLimiter, RateLimitStats } from '@/lib/ai/rateLimiter';
import { modelVersioning, ModelVersion } from '@/lib/ai/modelVersioning';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
}

interface CostMetrics {
  totalCost: number;
  costPerHour: number;
  costPerDay: number;
  costTrend: 'up' | 'down' | 'stable';
}

interface AlertItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export default function AIMonitoringDashboard() {
  const [rateLimitStats, setRateLimitStats] = useState<RateLimitStats[]>([]);
  const [modelPerformance, setModelPerformance] = useState<Record<string, ModelVersion['performance']>>({});
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    message: 'All systems operational',
    timestamp: new Date()
  });
  const [costMetrics, setCostMetrics] = useState<CostMetrics>({
    totalCost: 0,
    costPerHour: 0,
    costPerDay: 0,
    costTrend: 'stable'
  });
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Refresh data every 30 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get rate limiting stats
        const stats = aiRateLimiter.getStats();
        setRateLimitStats(stats);

        // Get model performance
        const performance = modelVersioning.getAllModelPerformance();
        setModelPerformance(performance);

        // Calculate cost metrics
        const costs = modelVersioning.getCostAnalysis('day');
        const totalCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
        setCostMetrics({
          totalCost,
          costPerHour: totalCost / 24,
          costPerDay: totalCost,
          costTrend: totalCost > 100 ? 'up' : 'stable'
        });

        // Check system health
        await checkSystemHealth();

        // Generate alerts
        generateAlerts(stats, performance, totalCost);

        setLastRefresh(new Date());
      } catch (error) {
        console.error('Failed to fetch monitoring data:', error);
        setSystemHealth({
          status: 'critical',
          message: 'Failed to fetch monitoring data',
          timestamp: new Date()
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    // Check for critical issues
    const criticalIssues = rateLimitStats.filter(stat => stat.errorRate > 0.1);
    const highUsage = rateLimitStats.filter(stat => stat.totalRequests > 1000);

    if (criticalIssues.length > 0) {
      setSystemHealth({
        status: 'critical',
        message: `${criticalIssues.length} providers experiencing high error rates`,
        timestamp: new Date()
      });
    } else if (highUsage.length > 0) {
      setSystemHealth({
        status: 'warning',
        message: `${highUsage.length} providers under high load`,
        timestamp: new Date()
      });
    } else {
      setSystemHealth({
        status: 'healthy',
        message: 'All systems operational',
        timestamp: new Date()
      });
    }
  };

  const generateAlerts = (
    stats: RateLimitStats[], 
    performance: Record<string, ModelVersion['performance']>, 
    totalCost: number
  ) => {
    const newAlerts: AlertItem[] = [];

    // Check for high error rates
    stats.forEach(stat => {
      if (stat.errorRate > 0.05) {
        newAlerts.push({
          id: `error-${stat.lastReset.getTime()}`,
          type: 'error',
          title: 'High Error Rate',
          message: `${stat.errorRate * 100}% error rate detected`,
          timestamp: new Date(),
          acknowledged: false
        });
      }
    });

    // Check for high costs
    if (totalCost > 50) {
      newAlerts.push({
        id: `cost-${Date.now()}`,
        type: 'warning',
        title: 'High Cost Alert',
        message: `Daily cost exceeded $50: $${totalCost.toFixed(2)}`,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    // Check for slow response times
    Object.entries(performance).forEach(([model, perf]) => {
      if (perf.averageResponseTime > 5000) {
        newAlerts.push({
          id: `slow-${model}`,
          type: 'warning',
          title: 'Slow Response Time',
          message: `${model} averaging ${perf.averageResponseTime}ms response time`,
          timestamp: new Date(),
          acknowledged: false
        });
      }
    });

    setAlerts(prev => [...newAlerts, ...prev.slice(0, 9)]); // Keep last 10 alerts
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const getHealthIcon = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getCostTrendIcon = (trend: CostMetrics['costTrend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'stable':
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading monitoring data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Monitoring Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of AI systems and performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Last updated: {lastRefresh.toLocaleTimeString()}
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            {getHealthIcon(systemHealth.status)}
            <div>
              <p className="font-medium">{systemHealth.message}</p>
              <p className="text-sm text-muted-foreground">
                {systemHealth.timestamp.toLocaleString()}
              </p>
            </div>
            <Badge variant={systemHealth.status === 'healthy' ? 'primary' : 'danger'}>
              {systemHealth.status.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Cost Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Cost Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">${costMetrics.totalCost.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">${costMetrics.costPerHour.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Per Hour</p>
            </div>
            <div className="text-center flex items-center justify-center">
              {getCostTrendIcon(costMetrics.costTrend)}
              <span className="ml-2 text-sm">
                {costMetrics.costTrend === 'up' ? 'Increasing' : 
                 costMetrics.costTrend === 'down' ? 'Decreasing' : 'Stable'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="rate-limits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rate-limits">Rate Limits</TabsTrigger>
          <TabsTrigger value="performance">Model Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="rate-limits" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rateLimitStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.lastReset.toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Requests</span>
                      <span className="font-medium">{stat.totalRequests}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Blocked</span>
                      <span className="font-medium text-red-500">{stat.blockedRequests}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Error Rate</span>
                      <span className="font-medium">{(stat.errorRate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Response</span>
                      <span className="font-medium">{stat.averageResponseTime.toFixed(0)}ms</span>
                    </div>
                    <Progress value={stat.errorRate * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(modelPerformance).map(([model, perf]) => (
              <Card key={model}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{model}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span className="font-medium">{(perf.successRate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Response</span>
                      <span className="font-medium">{perf.averageResponseTime.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Requests</span>
                      <span className="font-medium">{perf.totalRequests}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Cost</span>
                      <span className="font-medium">${perf.totalCost.toFixed(2)}</span>
                    </div>
                    <Progress 
                      value={perf.successRate * 100} 
                      className="h-2"
                      style={{
                        '--progress-background': perf.successRate > 0.95 ? 'hsl(var(--success))' : 
                                                perf.successRate > 0.9 ? 'hsl(var(--warning))' : 
                                                'hsl(var(--destructive))'
                      } as React.CSSProperties}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-2">
            {alerts.length === 0 ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>No Alerts</AlertTitle>
                <AlertDescription>
                  All systems are running normally with no active alerts.
                </AlertDescription>
              </Alert>
            ) : (
              alerts.map((alert) => (
                <Alert key={alert.id} variant={alert.acknowledged ? 'default' : 'destructive'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription className="flex items-center justify-between">
                    <span>{alert.message}</span>
                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </AlertDescription>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </Alert>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 