'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Share2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Users,
  Globe,
  Shield,
  Calendar,
  Clock,
  Settings,
  MoreHorizontal,
  Check,
  X,
  AlertTriangle,
  Info,
  HelpCircle,
  Download,
  Upload,
  RefreshCw,
  Save,
  Edit,
  Trash2,
  Bookmark,
  Flag,
  Archive,
  Send,
  Mail,
  MessageCircle,
  Link,
  QrCode,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Desktop
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DashboardShareSettings {
  id: string;
  dashboardId: string;
  isPublic: boolean;
  isPasswordProtected: boolean;
  password?: string;
  allowDownload: boolean;
  allowEdit: boolean;
  allowComment: boolean;
  allowView: boolean;
  expirationDate?: Date;
  maxViews?: number;
  currentViews: number;
  allowedUsers: string[];
  allowedEmails: string[];
  allowedDomains: string[];
  permissions: {
    view: boolean;
    edit: boolean;
    comment: boolean;
    download: boolean;
    share: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    owner?: string;
    team?: string;
    category?: string;
    tags?: string[];
    version?: string;
    status?: 'active' | 'inactive' | 'expired';
    visibility?: 'public' | 'private' | 'team';
  };
}

export interface DashboardSharingProps {
  settings: DashboardShareSettings;
  onSettingsUpdate?: (settings: DashboardShareSettings) => void;
  onShare?: (settings: DashboardShareSettings) => void;
  onCopyLink?: (link: string) => void;
  onGenerateQR?: (link: string) => void;
  onSendEmail?: (emails: string[], message: string) => void;
  onExport?: (format: string) => void;
  className?: string;
}

const DashboardSharing: React.FC<DashboardSharingProps> = ({
  settings,
  onSettingsUpdate,
  onShare,
  onCopyLink,
  onGenerateQR,
  onSendEmail,
  onExport,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [emailList, setEmailList] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSettingsUpdate = (updates: Partial<DashboardShareSettings>) => {
    const updatedSettings = {
      ...settings,
      ...updates,
      updatedAt: new Date()
    };
    onSettingsUpdate?.(updatedSettings);
  };

  const handleShare = () => {
    onShare?.(settings);
  };

  const handleCopyLink = () => {
    onCopyLink?.(shareLink);
  };

  const handleGenerateQR = () => {
    onGenerateQR?.(shareLink);
  };

  const handleSendEmail = () => {
    const emails = emailList.split(',').map(email => email.trim()).filter(email => email);
    onSendEmail?.(emails, emailMessage);
  };

  const handleExport = (format: string) => {
    onExport?.(format);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'inactive':
        return 'text-yellow-600 bg-yellow-50';
      case 'expired':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getVisibilityIcon = (visibility?: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="h-4 w-4 text-green-500" />;
      case 'private':
        return <Lock className="h-4 w-4 text-red-500" />;
      case 'team':
        return <Users className="h-4 w-4 text-blue-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Share2 className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-sm">Dashboard Sharing</CardTitle>
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                getStatusColor(settings.metadata?.status)
              )}
            >
              {settings.metadata?.status || 'Active'}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isExpanded && (
          <div className="space-y-4">
            {/* Share Link */}
            <div className="space-y-2">
              <Label htmlFor="share-link">Share Link</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="share-link"
                  value={shareLink}
                  onChange={(e) => setShareLink(e.target.value)}
                  placeholder="https://dashboard.example.com/share/..."
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateQR}
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="space-y-2">
              <Label>Visibility</Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={settings.isPublic}
                    onChange={(e) => handleSettingsUpdate({ isPublic: e.target.checked })}
                  />
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Public</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={!settings.isPublic}
                    onChange={(e) => handleSettingsUpdate({ isPublic: !e.target.checked })}
                  />
                  <Lock className="h-4 w-4" />
                  <span className="text-sm">Private</span>
                </label>
              </div>
            </div>

            {/* Password Protection */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="password-protection"
                  checked={settings.isPasswordProtected}
                  onChange={(e) => handleSettingsUpdate({ isPasswordProtected: e.target.checked })}
                />
                <Label htmlFor="password-protection">Password Protection</Label>
              </div>
              {settings.isPasswordProtected && (
                <div className="flex items-center space-x-2">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={settings.password || ''}
                    onChange={(e) => handleSettingsUpdate({ password: e.target.value })}
                    placeholder="Enter password"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>

            {/* Permissions */}
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.permissions.view}
                    onChange={(e) => handleSettingsUpdate({
                      permissions: { ...settings.permissions, view: e.target.checked }
                    })}
                  />
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">View</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.permissions.edit}
                    onChange={(e) => handleSettingsUpdate({
                      permissions: { ...settings.permissions, edit: e.target.checked }
                    })}
                  />
                  <Edit className="h-4 w-4" />
                  <span className="text-sm">Edit</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.permissions.comment}
                    onChange={(e) => handleSettingsUpdate({
                      permissions: { ...settings.permissions, comment: e.target.checked }
                    })}
                  />
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">Comment</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.permissions.download}
                    onChange={(e) => handleSettingsUpdate({
                      permissions: { ...settings.permissions, download: e.target.checked }
                    })}
                  />
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Download</span>
                </label>
              </div>
            </div>

            {/* Email Sharing */}
            <div className="space-y-2">
              <Label htmlFor="email-list">Share via Email</Label>
              <div className="space-y-2">
                <Input
                  id="email-list"
                  value={emailList}
                  onChange={(e) => setEmailList(e.target.value)}
                  placeholder="Enter email addresses (comma-separated)"
                />
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Add a message (optional)"
                  className="w-full p-2 border rounded-md text-sm"
                  rows={3}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendEmail}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-2">
              <Label>Export Dashboard</Label>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('pdf')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('png')}
                >
                  <Image className="h-4 w-4 mr-2" />
                  PNG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('json')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  JSON
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="pt-2 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{settings.currentViews} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Created {formatDate(settings.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardSharing;
