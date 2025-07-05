import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

interface LoginRequest {
  username: string
  password: string
}

interface AuthResponse {
  success: boolean
  user?: any
  token?: string
  message?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const path = url.pathname

    if (path === '/auth-admin/login' && req.method === 'POST') {
      const { username, password }: LoginRequest = await req.json()

      if (!username || !password) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'အသုံးပြုသူအမည် နှင့် စကားဝှက် လိုအပ်ပါသည်'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Find user by username
      const { data: user, error: userError } = await supabaseClient
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single()

      if (userError || !user) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'အသုံးပြုသူအမည် မတွေ့ရှိပါ သို့မဟုတ် အကောင့်ကို ပိတ်ထားပါသည်'
          }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // For demo purposes, we'll use simple password comparison
      // In production, use proper bcrypt comparison
      const validPasswords: Record<string, string> = {
        'admin': 'gkk99admin2024',
        'subadmin1': 'gkk99sub2024',
        'subadmin2': 'gkk99sub2024'
      }

      const isValidPassword = password === validPasswords[username]

      if (!isValidPassword) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'စကားဝှက် မှားယွင်းနေပါသည်'
          }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Generate session token
      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Create session
      const { error: sessionError } = await supabaseClient
        .from('user_sessions')
        .insert({
          user_id: user.id,
          token: token,
          expires_at: expiresAt.toISOString()
        })

      if (sessionError) {
        console.error('Session creation error:', sessionError)
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Session ဖန်တီးရာတွင် ပြဿနာရှိနေပါသည်'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Update last login
      await supabaseClient
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id)

      // Return success response
      const response: AuthResponse = {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          isActive: user.is_active,
          lastLogin: new Date().toISOString(),
          createdAt: user.created_at
        },
        token: token,
        message: 'အောင်မြင်စွာ ဝင်ရောက်ပြီးပါပြီ'
      }

      return new Response(
        JSON.stringify(response),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (path === '/auth-admin/verify' && req.method === 'GET') {
      const authHeader = req.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ success: false, error: 'No token provided' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const token = authHeader.substring(7)

      // Verify session
      const { data: session, error: sessionError } = await supabaseClient
        .from('user_sessions')
        .select(`
          *,
          admin_users (*)
        `)
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (sessionError || !session) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid or expired token' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const user = session.admin_users

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            id: user.id,
            username: user.username,
            role: user.role,
            isActive: user.is_active,
            lastLogin: user.last_login,
            createdAt: user.created_at
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (path === '/auth-admin/logout' && req.method === 'POST') {
      const authHeader = req.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        
        // Delete session
        await supabaseClient
          .from('user_sessions')
          .delete()
          .eq('token', token)
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Not found' }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})