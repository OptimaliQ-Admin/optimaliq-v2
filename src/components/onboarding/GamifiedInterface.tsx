"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  CheckCircle, 
  Lock,
  TrendingUp,
  Award,
  Crown
} from 'lucide-react';

interface Achievement {
  id: string;
  type: 'milestone' | 'insight' | 'completion' | 'speed' | 'quality';
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface GamifiedInterfaceProps {
  sessionId: string;
  progress: number;
  onAchievement?: (achievement: Achievement) => void;
}

const ACHIEVEMENTS: Omit<Achievement, 'earned' | 'earnedAt'>[] = [
  {
    id: 'first-step',
    type: 'milestone',
    title: 'First Steps',
    description: 'Started your business consultation journey',
    icon: <Target className="w-5 h-5" />,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'business-model',
    type: 'milestone',
    title: 'Business Model Builder',
    description: 'Completed your business model canvas',
    icon: <TrendingUp className="w-5 h-5" />,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'insight-collector',
    type: 'insight',
    title: 'Insight Collector',
    description: 'Received 5 actionable insights',
    icon: <Star className="w-5 h-5" />,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'speed-demon',
    type: 'speed',
    title: 'Speed Demon',
    description: 'Completed onboarding in under 5 minutes',
    icon: <Zap className="w-5 h-5" />,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'quality-master',
    type: 'quality',
    title: 'Quality Master',
    description: 'Provided detailed responses to all questions',
    icon: <Award className="w-5 h-5" />,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'completion-champion',
    type: 'completion',
    title: 'Completion Champion',
    description: 'Successfully completed the full onboarding',
    icon: <Crown className="w-5 h-5" />,
    progress: 0,
    maxProgress: 1
  }
];

export default function GamifiedInterface({
  sessionId,
  progress,
  onAchievement
}: GamifiedInterfaceProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedAchievement, setCelebratedAchievement] = useState<Achievement | null>(null);

  // Initialize achievements
  useEffect(() => {
    const initialAchievements = ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      earned: false
    }));
    setAchievements(initialAchievements);
  }, []);

  // Check for new achievements based on progress
  useEffect(() => {
    checkAchievements();
  }, [progress]);

  const checkAchievements = () => {
    const updatedAchievements = achievements.map(achievement => {
      let shouldEarn = false;
      let newProgress = achievement.progress || 0;

      switch (achievement.id) {
        case 'first-step':
          if (progress > 0 && !achievement.earned) {
            shouldEarn = true;
            newProgress = 1;
          }
          break;
        case 'business-model':
          if (progress >= 50 && !achievement.earned) {
            shouldEarn = true;
            newProgress = 1;
          }
          break;
        case 'insight-collector':
          // This would be updated based on actual insights received
          newProgress = Math.min(Math.floor(progress / 20), 5);
          if (newProgress >= 5 && !achievement.earned) {
            shouldEarn = true;
          }
          break;
        case 'speed-demon':
          // This would be checked based on actual completion time
          if (progress >= 100 && !achievement.earned) {
            shouldEarn = true;
            newProgress = 1;
          }
          break;
        case 'quality-master':
          // This would be based on response quality metrics
          newProgress = Math.min(Math.floor(progress / 10), 10);
          if (newProgress >= 10 && !achievement.earned) {
            shouldEarn = true;
          }
          break;
        case 'completion-champion':
          if (progress >= 100 && !achievement.earned) {
            shouldEarn = true;
            newProgress = 1;
          }
          break;
      }

      if (shouldEarn) {
        const earnedAchievement = {
          ...achievement,
          earned: true,
          earnedAt: new Date(),
          progress: newProgress
        };
        
        // Trigger celebration
        setCelebratedAchievement(earnedAchievement);
        setShowCelebration(true);
        
        // Notify parent
        onAchievement?.(earnedAchievement);
        
        return earnedAchievement;
      }

      return {
        ...achievement,
        progress: newProgress
      };
    });

    setAchievements(updatedAchievements);
  };

  const getProgressColor = (achievement: Achievement) => {
    if (achievement.earned) return 'bg-green-500';
    const progressPercent = (achievement.progress || 0) / (achievement.maxProgress || 1);
    if (progressPercent >= 0.8) return 'bg-yellow-500';
    if (progressPercent >= 0.5) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  const getProgressWidth = (achievement: Achievement) => {
    if (achievement.earned) return '100%';
    const progressPercent = (achievement.progress || 0) / (achievement.maxProgress || 1);
    return `${Math.min(progressPercent * 100, 100)}%`;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your Progress Journey</h2>
            <p className="text-sm text-gray-600">Unlock achievements as you complete your business consultation</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{Math.round(progress)}%</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-300
                ${achievement.earned 
                  ? 'border-green-500 bg-green-50 shadow-lg' 
                  : 'border-gray-200 bg-white hover:shadow-md'
                }
              `}
            >
              {/* Achievement Icon */}
              <div className="flex items-center justify-between mb-3">
                <div className={`
                  p-2 rounded-full
                  ${achievement.earned 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {achievement.earned ? achievement.icon : <Lock className="w-5 h-5" />}
                </div>
                {achievement.earned && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>

              {/* Achievement Content */}
              <h3 className={`font-semibold mb-1 ${achievement.earned ? 'text-green-800' : 'text-gray-900'}`}>
                {achievement.title}
              </h3>
              <p className={`text-sm mb-3 ${achievement.earned ? 'text-green-700' : 'text-gray-600'}`}>
                {achievement.description}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <motion.div
                  className={`h-2 rounded-full ${getProgressColor(achievement)}`}
                  initial={{ width: 0 }}
                  animate={{ width: getProgressWidth(achievement) }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>

              {/* Progress Text */}
              <div className="text-xs text-gray-500">
                {achievement.earned ? (
                  <span className="text-green-600 font-medium">Achievement Unlocked!</span>
                ) : (
                  `${achievement.progress || 0} / ${achievement.maxProgress || 1}`
                )}
              </div>

              {/* Earned Date */}
              {achievement.earned && achievement.earnedAt && (
                <div className="text-xs text-green-600 mt-1">
                  Earned {achievement.earnedAt.toLocaleDateString()}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement Celebration Modal */}
      <AnimatePresence>
        {showCelebration && celebratedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-2xl p-8 text-center max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confetti Effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    initial={{
                      x: Math.random() * 400 - 200,
                      y: -20,
                      opacity: 1
                    }}
                    animate={{
                      y: 400,
                      opacity: 0,
                      rotate: 360
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>

              {/* Trophy Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Achievement Unlocked!
              </h3>
              <p className="text-lg font-semibold text-purple-600 mb-4">
                {celebratedAchievement.title}
              </p>
              <p className="text-gray-600 mb-6">
                {celebratedAchievement.description}
              </p>

              <button
                onClick={() => setShowCelebration(false)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
              >
                Continue Journey
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 