import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://fgwmzwguyklmonwgzxop.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)
export { supabase }

// Use this function for admin operations that require authentication
// export const authenticatedSupabaseClient = (session: any) => {
//   return createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL || '',
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
//     {
//       global: {
//         headers: {
//           Authorization: `Bearer ${session?.access_token}`,
//         },
//       },
//     }
//   );
// };