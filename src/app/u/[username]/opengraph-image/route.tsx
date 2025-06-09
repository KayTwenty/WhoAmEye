import React from 'react';
import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabaseClient';

export const runtime = 'edge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: Request, context: any) {
  const username = context.params.username;
  // Fetch profile data from Supabase
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username.toLowerCase())
    .single();

  // Fallbacks
  const displayName = profile?.display_name || profile?.username || 'WhoAmEye User';
  const avatar = profile?.avatar || 'https://api.dicebear.com/7.x/shapes/svg?seed=profile';
  const tagline = profile?.tagline || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff 60%, #e5e7eb 100%)',
          border: '1px solid #e5e7eb',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <img
            src={avatar}
            width={180}
            height={180}
            style={{ borderRadius: '50%', border: '6px solid #222', background: '#f3f4f6', objectFit: 'cover' }}
            alt="Avatar"
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 48, fontWeight: 800, color: '#111', lineHeight: 1 }}>{displayName}</span>
            <span style={{ fontSize: 28, color: '#444', marginTop: 8 }}>{tagline}</span>
            <span style={{ fontSize: 22, color: '#888', marginTop: 16, fontFamily: 'monospace', letterSpacing: 1 }}>whoameye.bio</span>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 32, right: 48, fontSize: 24, color: '#222', opacity: 0.15, fontWeight: 900, letterSpacing: 2 }}>
          WhoAmEye
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
