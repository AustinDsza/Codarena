# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose organization and enter project details:
   - Name: `codarena`
   - Database Password: (generate strong password)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be ready (2-3 minutes)

## Step 2: Get API Keys

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

## Step 3: Run Database Migration

1. Go to **SQL Editor** in Supabase dashboard
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run the SQL script
4. Verify tables are created in **Table Editor**

## Step 4: Update Environment Variables

Add to your `.env.local` file:

```env
# Judge0 API Configuration
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=7add15aa0amsh43fb9bfc0af64d0p1b98a1jsnb49f6f78aca7

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 5: Test the Setup

1. Restart your development server:
   ```bash
   pnpm run dev
   ```

2. Test authentication:
   - Go to `/register` and create an account
   - Check if user appears in Supabase **Table Editor** → **users**

3. Test contest creation:
   - Go to `/create-contest`
   - Create a contest and check **contests** table

## Database Schema

### Tables Created:
- **users** - User profiles and wallet balances
- **contests** - Contest information
- **problems** - Contest problems with test cases
- **submissions** - Code submissions and results
- **transactions** - Wallet transaction history

### Features:
- ✅ Row Level Security (RLS) enabled
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Foreign key relationships
- ✅ Indexes for performance
- ✅ UUID primary keys

## API Endpoints Available

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Contests
- `GET /api/contests` - List contests (with filters)
- `POST /api/contests` - Create contest
- `GET /api/contests/[id]` - Get contest details
- `PUT /api/contests/[id]` - Update contest
- `DELETE /api/contests/[id]` - Delete contest

### Submissions
- `POST /api/submissions` - Submit code
- `GET /api/submissions` - Get submissions (with filters)

### Users & Wallet
- `GET /api/users/[id]` - Get user profile
- `PUT /api/users/[id]` - Update user profile
- `GET /api/wallet` - Get wallet balance & transactions
- `POST /api/wallet` - Make wallet transaction

## Troubleshooting

### Common Issues:

1. **"Invalid API key"**
   - Check if environment variables are correct
   - Restart development server after adding env vars

2. **"Table doesn't exist"**
   - Run the migration SQL script in Supabase SQL Editor
   - Check if all tables are created

3. **"RLS policy violation"**
   - Check if user is authenticated
   - Verify RLS policies in Supabase dashboard

4. **"Foreign key constraint"**
   - Ensure referenced records exist
   - Check data types match

### Debug Steps:

1. Check Supabase logs in **Logs** section
2. Check browser console for errors
3. Verify environment variables are loaded
4. Test API endpoints with Postman/curl

## Production Considerations

1. **Security**:
   - Never expose service role key in frontend
   - Use RLS policies for data access control
   - Enable email verification for auth

2. **Performance**:
   - Add more indexes as needed
   - Use database connection pooling
   - Monitor query performance

3. **Backup**:
   - Enable automatic backups in Supabase
   - Export data regularly
   - Test restore procedures

## Next Steps

1. Set up email templates for auth
2. Add real-time subscriptions for live contests
3. Implement file storage for contest assets
4. Add monitoring and analytics
5. Set up CI/CD for database migrations
