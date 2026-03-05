import { supabase } from 'src/lib/supabaseClient.js';

export const signInWithEmail = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return { error };
  return { data };
}

export const signUpNewUser = async ({ first_name, last_name, email, password}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: first_name,
        last_name: last_name
      }
    }
  });

  if (error) return { error };
  return { data };
}