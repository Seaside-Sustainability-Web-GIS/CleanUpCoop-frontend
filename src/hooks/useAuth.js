import { useEffect, useState } from 'react';
import { supabase } from 'src/lib/supabaseClient.js';

export const useAuth = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const { data, error } = supabase.auth.getSession();
    if (data) setSession(data?.sesssion);
    if (error) console.error('There is an error at useAuth', error);

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('What is this event', event);
        console.log('Is there a session', session);
        setSession(session);
      }
    );
  
    return () => listener.subscription.unsubscribe();
  }, []);

  return { session };
}