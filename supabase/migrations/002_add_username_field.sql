-- Add username field to users table
ALTER TABLE users ADD COLUMN username VARCHAR(50) UNIQUE;

-- Create an index on username for faster lookups
CREATE INDEX idx_users_username ON users(username);

-- Update existing users to have a username based on their email
UPDATE users 
SET username = '@' || SPLIT_PART(email, '@', 1)
WHERE username IS NULL;

-- Make username NOT NULL after setting default values
ALTER TABLE users ALTER COLUMN username SET NOT NULL;
