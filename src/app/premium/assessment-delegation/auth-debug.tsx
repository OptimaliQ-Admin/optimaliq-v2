'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthDebug() {
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('User check:', { user, userError });

        // Check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Session check:', { session, sessionError });

        // Check if we can access the database and get subscription info
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('plan, status')
          .eq('u_id', user?.id)
          .single();

        setAuthStatus({
          user: user ? { id: user.id, email: user.email } : null,
          userError,
          session: session ? { 
            access_token: session.access_token ? 'Present' : 'Missing',
            refresh_token: session.refresh_token ? 'Present' : 'Missing'
          } : null,
          sessionError,
          subscriptionData,
          subscriptionError
        });
      } catch (error: any) {
        console.error('Auth check error:', error);
        setAuthStatus({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Authentication Debug Info:</h3>
      <pre className="text-xs bg-white p-2 rounded overflow-auto">
        {JSON.stringify(authStatus, null, 2)}
      </pre>
    </div>
  );
} 