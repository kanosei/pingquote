import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const logoUrl = searchParams.get('logo');
  const companyName = searchParams.get('company');

  console.log('OG Image Request - Logo URL:', logoUrl);
  console.log('OG Image Request - Company Name:', companyName);

  // Fetch the logo image if provided to ensure it's accessible
  let logoData = null;
  if (logoUrl) {
    try {
      const logoResponse = await fetch(logoUrl);
      if (logoResponse.ok) {
        const arrayBuffer = await logoResponse.arrayBuffer();
        logoData = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
        console.log('Logo fetched and converted to base64');
      } else {
        console.error('Failed to fetch logo:', logoResponse.status);
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  }

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
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        }}
      >
        {/* Company Logo or Default Icon */}
        {logoData ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoData}
            alt="Company logo"
            width={240}
            height={240}
            style={{
              objectFit: 'contain',
              marginBottom: 40,
              maxWidth: '400px',
              maxHeight: '240px',
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 120,
              borderRadius: 24,
              backgroundColor: '#64748b',
              marginBottom: 30,
            }}
          >
            <svg
              width="60"
              height="60"
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
            fontSize: companyName ? 64 : 80,
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: 16,
            textAlign: 'center',
            maxWidth: '90%',
          }}
        >
          {companyName ? (
            companyName
          ) : (
            <>
              Ping<span style={{ color: '#64748b' }}>Quote</span>
            </>
          )}
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: '#64748b',
            fontWeight: 500,
          }}
        >
          Your personalized quote
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            width: 200,
            height: 3,
            borderRadius: 2,
            backgroundColor: '#cbd5e1',
            opacity: 0.6,
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
