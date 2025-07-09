'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart } from 'lucide-react';

export default function PulseRespondThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your response has been submitted successfully. Your feedback is valuable and will help leadership 
              understand team sentiment and make informed decisions.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-700">
                <strong>What happens with your feedback?</strong><br />
                • Responses are aggregated anonymously<br />
                • Results are shared with leadership only<br />
                • Insights help identify areas for improvement<br />
                • Your privacy is protected
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Thank you for your time and honest feedback!</span>
            </div>
            
            <Button
              onClick={() => window.close()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Close Window
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 