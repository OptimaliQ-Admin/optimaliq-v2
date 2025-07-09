'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PulseDelegateThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Delegation Complete!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your team members have been successfully assigned to the pulse check. 
              The results will be compiled and shared with the strategic team.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-700">
                <strong>What happens next?</strong><br />
                • Team members will receive their individual pulse check links<br />
                • Responses will be collected anonymously<br />
                • Results will be aggregated and shared with leadership
              </p>
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