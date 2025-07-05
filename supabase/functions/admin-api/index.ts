import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
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

    // Verify authentication for all admin endpoints
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
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

    const currentUser = session.admin_users

    // Get all users (admin only)
    if (path === '/admin-api/users' && req.method === 'GET') {
      if (currentUser.role !== 'main_admin') {
        return new Response(
          JSON.stringify({ success: false, error: 'Access denied' }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const { data: users, error } = await supabaseClient
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const formattedUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        role: user.role,
        isActive: user.is_active,
        lastLogin: user.last_login,
        createdAt: user.created_at
      }))

      return new Response(
        JSON.stringify({ success: true, data: formattedUsers }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Update user status (main admin only)
    if (path.startsWith('/admin-api/users/') && path.endsWith('/status') && req.method === 'PATCH') {
      if (currentUser.role !== 'main_admin') {
        return new Response(
          JSON.stringify({ success: false, error: 'Access denied' }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const userId = path.split('/')[3]
      const { isActive } = await req.json()

      // Don't allow deactivating main admin
      const { data: targetUser } = await supabaseClient
        .from('admin_users')
        .select('role')
        .eq('id', userId)
        .single()

      if (targetUser?.role === 'main_admin' && !isActive) {
        return new Response(
          JSON.stringify({ success: false, error: 'Cannot deactivate main admin' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const { data: updatedUser, error } = await supabaseClient
        .from('admin_users')
        .update({ is_active: isActive })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            id: updatedUser.id,
            username: updatedUser.username,
            role: updatedUser.role,
            isActive: updatedUser.is_active,
            lastLogin: updatedUser.last_login,
            createdAt: updatedUser.created_at
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get site content
    if (path === '/admin-api/content' && req.method === 'GET') {
      const { data: content, error } = await supabaseClient
        .from('site_content')
        .select('*')
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const formattedContent = {
        id: content.id,
        title: content.title,
        description: content.description,
        gkk99Link: content.gkk99_link,
        gkk777Link: content.gkk777_link,
        viberLink: content.viber_link,
        pricing: {
          slots: content.pricing_slots,
          freeSpin: content.pricing_free_spin,
          winRate: content.pricing_win_rate,
          gkk99Bonus: content.pricing_gkk99_bonus,
          gkk777Bonus: content.pricing_gkk777_bonus
        },
        updatedAt: content.updated_at,
        updatedBy: content.updated_by
      }

      return new Response(
        JSON.stringify({ success: true, data: formattedContent }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Update site content
    if (path === '/admin-api/content' && req.method === 'PUT') {
      const updates = await req.json()

      const { data: updatedContent, error } = await supabaseClient
        .from('site_content')
        .update({
          title: updates.title,
          description: updates.description,
          gkk99_link: updates.gkk99Link,
          gkk777_link: updates.gkk777Link,
          viber_link: updates.viberLink,
          pricing_slots: updates.pricing?.slots,
          pricing_free_spin: updates.pricing?.freeSpin,
          pricing_win_rate: updates.pricing?.winRate,
          pricing_gkk99_bonus: updates.pricing?.gkk99Bonus,
          pricing_gkk777_bonus: updates.pricing?.gkk777Bonus,
          updated_by: currentUser.username
        })
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const formattedContent = {
        id: updatedContent.id,
        title: updatedContent.title,
        description: updatedContent.description,
        gkk99Link: updatedContent.gkk99_link,
        gkk777Link: updatedContent.gkk777_link,
        viberLink: updatedContent.viber_link,
        pricing: {
          slots: updatedContent.pricing_slots,
          freeSpin: updatedContent.pricing_free_spin,
          winRate: updatedContent.pricing_win_rate,
          gkk99Bonus: updatedContent.pricing_gkk99_bonus,
          gkk777Bonus: updatedContent.pricing_gkk777_bonus
        },
        updatedAt: updatedContent.updated_at,
        updatedBy: updatedContent.updated_by
      }

      return new Response(
        JSON.stringify({ success: true, data: formattedContent }),
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