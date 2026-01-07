import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const logoUrl = searchParams.get('logo');
  const companyName = searchParams.get('company');

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
          background: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)',
        }}
      >
        {/* Company Logo or Default Icon */}
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Company logo"
            width={120}
            height={120}
            style={{
              objectFit: 'contain',
              marginBottom: 30,
              borderRadius: 16,
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 100,
              height: 100,
              borderRadius: 16,
              backgroundColor: '#1a9d5c',
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
        )}

        {/* Company Name or Logo Text */}
        <div
          style={{
            display: 'flex',
            fontSize: companyName ? 60 : 80,
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: 20,
            textAlign: 'center',
            maxWidth: '90%',
          }}
        >
          {companyName ? (
            companyName
          ) : (
            <>
              Ping<span style={{ color: '#1a9d5c' }}>Quote</span>
            </>
          )}
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 36,
            color: '#475569',
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
            backgroundColor: '#1a9d5c',
            opacity: 0.3,
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
