/**
 * AI-Powered Feedback Collection Component
 * User feedback and rating system for conversational AI
 */

import React, { useState } from 'react';
import { z } from 'zod';

// Feedback Collection Schema
const FeedbackCollectionSchema = z.object({
  userId: z.string(),
  conversationId: z.string(),
  feedbackType: z.enum(['rating', 'comment', 'suggestion', 'issue']),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
  category: z.enum(['response_quality', 'helpfulness', 'accuracy', 'usability', 'overall']),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  timestamp: z.string()
});

export type FeedbackData = z.infer<typeof FeedbackCollectionSchema>;

interface FeedbackCollectionProps {
  userId: string;
  conversationId: string;
  onFeedbackSubmit: (feedback: FeedbackData) => void;
  className?: string;
}

export const FeedbackCollection: React.FC<FeedbackCollectionProps> = ({
  userId,
  conversationId,
  onFeedbackSubmit,
  className = ''
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [category, setCategory] = useState<string>('overall');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    
    // Auto-submit rating if no comment is needed
    if (selectedRating >= 4) {
      submitFeedback('rating', selectedRating, '');
    }
  };
  
  const handleCommentSubmit = () => {
    if (comment.trim() || rating > 0) {
      submitFeedback('comment', rating, comment);
    }
  };
  
  const submitFeedback = (type: string, ratingValue: number, commentValue: string) => {
    const feedbackData: FeedbackData = {
      userId,
      conversationId,
      feedbackType: type as any,
      rating: ratingValue || undefined,
      comment: commentValue || undefined,
      category: category as any,
      sentiment: determineSentiment(ratingValue, commentValue),
      timestamp: new Date().toISOString()
    };
    
    try {
      FeedbackCollectionSchema.parse(feedbackData);
      onFeedbackSubmit(feedbackData);
      setIsSubmitted(true);
      
      // Reset form after delay
      setTimeout(() => {
        setIsSubmitted(false);
        setRating(0);
        setComment('');
        setCategory('overall');
      }, 3000);
    } catch (error) {
      console.error('Invalid feedback data:', error);
    }
  };
  
  const determineSentiment = (ratingValue: number, commentValue: string): 'positive' | 'neutral' | 'negative' => {
    if (ratingValue >= 4) return 'positive';
    if (ratingValue <= 2) return 'negative';
    
    // Analyze comment for sentiment
    const positiveWords = ['good', 'great', 'helpful', 'excellent', 'amazing'];
    const negativeWords = ['bad', 'terrible', 'awful', 'useless', 'horrible'];
    
    const commentLower = commentValue.toLowerCase();
    
    if (positiveWords.some(word => commentLower.includes(word))) return 'positive';
    if (negativeWords.some(word => commentLower.includes(word))) return 'negative';
    
    return 'neutral';
  };
  
  if (isSubmitted) {
    return (
      <div className={`feedback-success ${className}`}>
        <div className="flex items-center space-x-2 text-green-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Thank you for your feedback!</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`feedback-collection ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
        <h3 className="text-sm font-medium text-gray-900">How was this conversation?</h3>
        
        {/* Rating Stars */}
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingClick(star)}
              className={`w-6 h-6 ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              } hover:text-yellow-400 transition-colors`}
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        
        {/* Category Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Feedback Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="overall">Overall Experience</option>
            <option value="response_quality">Response Quality</option>
            <option value="helpfulness">Helpfulness</option>
            <option value="accuracy">Accuracy</option>
            <option value="usability">Ease of Use</option>
          </select>
        </div>
        
        {/* Comment Box */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Comments (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience..."
            rows={3}
            className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 resize-none"
          />
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleCommentSubmit}
            disabled={rating === 0 && comment.trim() === ''}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

// Feedback Analytics Hook
export const useFeedbackAnalytics = () => {
  const analyzeFeedback = (feedbackData: FeedbackData[]) => {
    const totalFeedback = feedbackData.length;
    const averageRating = feedbackData.reduce((sum, fb) => sum + (fb.rating || 0), 0) / totalFeedback;
    
    const sentimentBreakdown = {
      positive: feedbackData.filter(fb => fb.sentiment === 'positive').length,
      neutral: feedbackData.filter(fb => fb.sentiment === 'neutral').length,
      negative: feedbackData.filter(fb => fb.sentiment === 'negative').length
    };
    
    const categoryBreakdown = feedbackData.reduce((acc, fb) => {
      acc[fb.category] = (acc[fb.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalFeedback,
      averageRating: Math.round(averageRating * 100) / 100,
      sentimentBreakdown,
      categoryBreakdown,
      trends: analyzeFeedbackTrends(feedbackData)
    };
  };
  
  const analyzeFeedbackTrends = (feedbackData: FeedbackData[]) => {
    // Analyze trends over time
    const sortedByDate = feedbackData.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const recentWeek = sortedByDate.slice(-7);
    const previousWeek = sortedByDate.slice(-14, -7);
    
    const recentAvg = recentWeek.reduce((sum, fb) => sum + (fb.rating || 0), 0) / recentWeek.length;
    const previousAvg = previousWeek.reduce((sum, fb) => sum + (fb.rating || 0), 0) / previousWeek.length;
    
    return {
      trend: recentAvg > previousAvg ? 'improving' : recentAvg < previousAvg ? 'declining' : 'stable',
      change: Math.round((recentAvg - previousAvg) * 100) / 100
    };
  };
  
  return { analyzeFeedback };
};

export default FeedbackCollection;
