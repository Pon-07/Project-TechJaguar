# Troubleshooting Guide

## Account Creation Issues

### "Failed to fetch" Error

If you're seeing a "Failed to fetch" error when trying to create an account, this typically means:

1. **Supabase Connection Issue**: The app cannot connect to Supabase
2. **Network Problem**: Check your internet connection
3. **Supabase Not Configured**: Supabase project may not be set up

### Solution: Offline Mode (Automatic Fallback)

The app now has **automatic fallback to localStorage** mode. If Supabase is not available or fails, the app will:

- ✅ Automatically use localStorage to store user accounts
- ✅ Allow you to sign up and login offline
- ✅ Show a message: "Account created successfully! (Using offline mode)"

### How to Use Offline Mode

1. Simply try to create an account again
2. The app will automatically detect Supabase connection issues
3. It will fall back to localStorage storage
4. You can still use all features (profile, dashboard, etc.)

### Setting Up Supabase (Optional - for production)

If you want to use Supabase for production:

1. **Create a Supabase Account**
   - Go to https://supabase.com
   - Sign up for a free account

2. **Create a New Project**
   - Click "New Project"
   - Enter project details
   - Wait for project to be created

3. **Get Your Credentials**
   - Go to Project Settings → API
   - Copy your Project URL and anon/public key

4. **Update Configuration**
   - Edit `src/utils/supabase/info.tsx`
   - Replace `projectId` and `publicAnonKey` with your credentials

5. **Create Database Tables**
   - Go to SQL Editor in Supabase
   - Create the following tables:
     ```sql
     -- Users table (optional, Supabase Auth handles this)
     -- Products table
     CREATE TABLE products (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       name TEXT NOT NULL,
       category TEXT,
       quantity INTEGER,
       unit TEXT,
       price_per_unit DECIMAL,
       farmer_id UUID,
       warehouse_id UUID,
       status TEXT,
       created_at TIMESTAMP DEFAULT NOW(),
       updated_at TIMESTAMP DEFAULT NOW()
     );

     -- User activities table
     CREATE TABLE user_activities (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       user_id UUID NOT NULL,
       action TEXT NOT NULL,
       description TEXT,
       created_at TIMESTAMP DEFAULT NOW()
     );
     ```

6. **Create Storage Bucket**
   - Go to Storage in Supabase
   - Create a bucket named `profile-pictures`
   - Set it to public

### Current Status

The app is now working with **offline mode** by default. You can:

- ✅ Create accounts
- ✅ Login
- ✅ Use all features
- ✅ Profile management
- ✅ Dashboard access

All data is stored in browser localStorage, so it will persist between sessions on the same browser.

### Switching Between Modes

- **Offline Mode**: Works automatically if Supabase fails
- **Online Mode**: Automatically switches when Supabase is available
- **Hybrid**: The app will try Supabase first, then fall back to localStorage

### Data Migration

When you set up Supabase later:

1. Data in localStorage will remain accessible
2. You can manually migrate data to Supabase
3. Or start fresh with Supabase and create new accounts

### Need Help?

If you continue to have issues:

1. Check browser console for detailed error messages
2. Try clearing browser cache and localStorage
3. Check your internet connection
4. Verify Supabase credentials if using Supabase mode

