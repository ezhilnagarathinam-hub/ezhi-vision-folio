import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const demoEmail = 'demo@eadreamsupporters.com'
    const demoPassword = 'demo123456'

    // Check if demo user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const demoUser = existingUsers?.users.find(u => u.email === demoEmail)

    if (demoUser) {
      return new Response(
        JSON.stringify({ message: 'Demo user already exists', userId: demoUser.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create demo user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Demo Admin'
      }
    })

    if (createError) throw createError

    // Add admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: 'admin'
      })

    if (roleError) throw roleError

    return new Response(
      JSON.stringify({ 
        message: 'Demo user created successfully', 
        userId: newUser.user.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
