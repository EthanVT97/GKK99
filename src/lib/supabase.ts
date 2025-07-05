import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          username: string
          password_hash: string
          role: 'main_admin' | 'sub_admin'
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          role: 'main_admin' | 'sub_admin'
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          role?: 'main_admin' | 'sub_admin'
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      site_content: {
        Row: {
          id: string
          title: string
          description: string
          gkk99_link: string
          gkk777_link: string
          viber_link: string
          pricing_slots: string
          pricing_free_spin: string
          pricing_win_rate: string
          pricing_gkk99_bonus: string
          pricing_gkk777_bonus: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          gkk99_link: string
          gkk777_link: string
          viber_link: string
          pricing_slots: string
          pricing_free_spin: string
          pricing_win_rate: string
          pricing_gkk99_bonus: string
          pricing_gkk777_bonus: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          gkk99_link?: string
          gkk777_link?: string
          viber_link?: string
          pricing_slots?: string
          pricing_free_spin?: string
          pricing_win_rate?: string
          pricing_gkk99_bonus?: string
          pricing_gkk777_bonus?: string
          updated_at?: string
          updated_by?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          expires_at?: string
          created_at?: string
        }
      }
    }
  }
}