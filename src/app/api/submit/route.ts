import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK;

    if (!webhookUrl) {
      return NextResponse.json({ success: false, error: 'Webhook URL missing' }, { status: 500 });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseBody = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: responseBody?.error || `Request failed with status ${response.status}`
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data: responseBody });
  } catch (error) {
    console.error('[API Submit] Error forwarding request', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected error'
      },
      { status: 500 }
    );
  }
}
