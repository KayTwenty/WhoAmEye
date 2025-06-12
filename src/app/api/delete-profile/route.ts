import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function DELETE(/* req: NextRequest */) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Delete profile row
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('user_id', user.id);

  if (profileError) {
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
