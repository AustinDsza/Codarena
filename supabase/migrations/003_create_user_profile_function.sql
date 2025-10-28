-- Create a function to create user profiles that bypasses RLS
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_name TEXT,
  user_username TEXT,
  user_wallet_balance INTEGER DEFAULT 1000
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass RLS
AS $$
DECLARE
  result JSON;
BEGIN
  -- Insert the user profile
  INSERT INTO users (id, email, name, username, wallet_balance)
  VALUES (user_id, user_email, user_name, user_username, user_wallet_balance)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    username = EXCLUDED.username,
    wallet_balance = EXCLUDED.wallet_balance,
    updated_at = NOW();
  
  -- Return success
  result := json_build_object(
    'success', true,
    'message', 'User profile created successfully',
    'user_id', user_id
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return error
    result := json_build_object(
      'success', false,
      'error', SQLERRM,
      'user_id', user_id
    );
    
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_user_profile TO authenticated;
