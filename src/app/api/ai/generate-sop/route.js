import { generateSOP } from '@/lib/ai/gemini';

export async function POST(request) {
  try {
    const studentProfile = await request.json();

    if (!studentProfile.name || !studentProfile.targetProgram) {
      return Response.json(
        { error: 'Name and target program are required' },
        { status: 400 }
      );
    }

    const sop = await generateSOP(studentProfile);

    return Response.json({ sop });
  } catch (error) {
    console.error('SOP generation error:', error);
    return Response.json(
      { error: error.message || 'SOP generation failed' },
      { status: 500 }
    );
  }
}
