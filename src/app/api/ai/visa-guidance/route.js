import { getVisaGuidance } from '@/lib/ai/gemini';

export async function POST(request) {
  try {
    const { country } = await request.json();

    if (!country) {
      return Response.json(
        { error: 'Country is required' },
        { status: 400 }
      );
    }

    const guidance = await getVisaGuidance(country);

    return Response.json({ guidance });
  } catch (error) {
    console.error('Visa guidance error:', error);
    return Response.json(
      { error: error.message || 'Visa guidance failed' },
      { status: 500 }
    );
  }
}
