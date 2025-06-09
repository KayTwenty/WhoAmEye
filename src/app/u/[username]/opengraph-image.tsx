import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabaseClient';

export const runtime = 'edge';

export async function GET(req: Request, { params }: { params: { username: string } }) {
  const username = params.username;
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
            <span style={{ fontSize: 56, fontWeight: 800, color: '#111', lineHeight: 1 }}>{displayName}</span>
            {tagline && <span style={{ fontSize: 32, color: '#444', marginTop: 12 }}>{tagline}</span>}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 48, bottom: 48, display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="48" height="48" aria-hidden="true">
            <ellipse cx="20" cy="20" rx="16" ry="10" fill="#fff" fillOpacity="0.10" stroke="#222" strokeWidth="2.5" />
            <ellipse cx="20" cy="20" rx="13" ry="8" fill="#222" fillOpacity="0.08" />
            <circle cx="20" cy="20" r="6.5" fill="#222" />
            <circle cx="22.5" cy="18.5" r="2.2" fill="#fff" fillOpacity="0.9" />
          </svg>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#222', letterSpacing: 1 }}>WhoAmEye</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
