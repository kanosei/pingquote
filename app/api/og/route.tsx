import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
        }}
      >
        {/* Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 100,
            borderRadius: 16,
            backgroundColor: '#1e293b',
            marginBottom: 20,
          }}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01" />
            <path d="M12 10h.01" />
            <path d="M16 10h.01" />
          </svg>
        </div>

        {/* Logo Text */}
        <div
          style={{
            display: 'flex',
            fontSize: 80,
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: 20,
          }}
        >
          Ping<span style={{ color: '#1e293b' }}>Quote</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 36,
            color: '#64748b',
          }}
        >
          Your personalized quote
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            width: 400,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#1e293b',
            opacity: 0.2,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
