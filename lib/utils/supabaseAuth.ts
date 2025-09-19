import { supabase } from '@/lib/supabase/client';

export async function generateReferralCode(): Promise<string> {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // Check if code already exists
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('referral_code', result);
    
  if (data && data.length > 0) {
    // If code exists, generate a new one recursively
    return generateReferralCode();
  }
  
  return result;
}

export type AccountLockoutResult = {
  isLocked: boolean;
  remainingTime?: number;
};

export async function checkAccountLockout(email: string): Promise<AccountLockoutResult> {
  // TODO: Implement actual lockout logic using the email parameter
  // For now, we're returning a simplified version
  console.log(email);
  return { isLocked: false };
}


export async function recordLoginAttempt(
  email: string, 
  success: boolean
): Promise<AccountLockoutResult> {
  try {
    // Record the attempt
    const { error } = await supabase
      .from('login_attempts')
      .insert([{
        email,
        success,
        created_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
    
    // If successful, no need to check lockout
    if (success) {
      return { isLocked: false };
    }
    
    // Check if account is now locked
    return await checkAccountLockout(email);
  } catch (error) {
    console.error('Error recording login attempt:', error);
    return { isLocked: false };
  }
}

export function formatLockoutTime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}
