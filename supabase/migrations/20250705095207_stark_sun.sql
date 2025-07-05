/*
  # Create Admin System Tables

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `role` (enum: main_admin, sub_admin)
      - `is_active` (boolean)
      - `last_login` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `site_content`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `gkk99_link` (text)
      - `gkk777_link` (text)
      - `viber_link` (text)
      - `pricing_*` (text fields for pricing info)
      - `updated_at` (timestamptz)
      - `updated_by` (text)
    
    - `user_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `token` (text)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin users
    - Create indexes for performance
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('main_admin', 'sub_admin');

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role user_role NOT NULL DEFAULT 'sub_admin',
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create site_content table
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'GKK99 - မြန်မာ AI ချတ်ဘော့ဝန်ဆောင်မှု',
  description text NOT NULL DEFAULT '၂၄ နာရီ အချိန်မရွေး သင့်အတွက် အဖြေများ ပေးနိုင်သော ဉာဏ်ရည်တုံ့ပြန်မှု စနစ်',
  gkk99_link text NOT NULL DEFAULT 'https://www.gkk99.com/',
  gkk777_link text NOT NULL DEFAULT 'https://7777gkkk.info/',
  viber_link text NOT NULL DEFAULT 'viber://pa?chatURI=chatbotnhantri',
  pricing_slots text NOT NULL DEFAULT '20 Ks',
  pricing_free_spin text NOT NULL DEFAULT '1000 Ks',
  pricing_win_rate text NOT NULL DEFAULT '96.5%',
  pricing_gkk99_bonus text NOT NULL DEFAULT '30,000 Ks',
  pricing_gkk777_bonus text NOT NULL DEFAULT '30,000 Ks',
  updated_at timestamptz DEFAULT now(),
  updated_by text NOT NULL DEFAULT 'system'
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES admin_users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY "Admin users can read all users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Main admin can update all users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid()::uuid
      AND au.role = 'main_admin'
      AND au.is_active = true
    )
  );

CREATE POLICY "Users can update their own last_login"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid()::uuid)
  WITH CHECK (id = auth.uid()::uuid);

-- Create policies for site_content
CREATE POLICY "Anyone can read site content"
  ON site_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin users can update site content"
  ON site_content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid()::uuid
      AND au.is_active = true
    )
  );

-- Create policies for user_sessions
CREATE POLICY "Users can manage their own sessions"
  ON user_sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid()::uuid);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: gkk99admin2024)
-- Note: In production, use proper password hashing
INSERT INTO admin_users (username, password_hash, role, is_active) VALUES
('admin', '$2b$10$rQZ8kHWKQVz7QGQqQQqQQeQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ', 'main_admin', true),
('subadmin1', '$2b$10$rQZ8kHWKQVz7QGQqQQqQQeQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ', 'sub_admin', true),
('subadmin2', '$2b$10$rQZ8kHWKQVz7QGQqQQqQQeQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ', 'sub_admin', true)
ON CONFLICT (username) DO NOTHING;

-- Insert default site content
INSERT INTO site_content (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;