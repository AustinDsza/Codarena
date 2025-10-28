-- Fix RLS policy to allow user creation during registration
-- This policy allows inserting a user record when the user ID matches the authenticated user

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create new policies that allow user creation during registration
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Also allow system to create users (for the auth trigger)
CREATE POLICY "System can create users" ON users FOR INSERT WITH CHECK (true);
