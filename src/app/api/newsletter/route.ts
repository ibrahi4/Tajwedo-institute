import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const key = process.env.WEB3FORMS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!key || key === 'YOUR_ACCESS_KEY_HERE') return NextResponse.json({ success: true, message: 'Dev mode' });
    const f: Record<string, string> = {};
    for (const [k, v] of Object.entries(data)) if (v != null && v !== '') f[k] = typeof v === 'object' ? JSON.stringify(v) : String(v);
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_key: key, subject: 'Newsletter Signup | Tajwedo Institute', from_name: 'Tajwedo Institute', botcheck: '', ...f }),
    });
    return NextResponse.json(await r.json());
  } catch { return NextResponse.json({ success: false, message: 'Error' }, { status: 500 }); }
}