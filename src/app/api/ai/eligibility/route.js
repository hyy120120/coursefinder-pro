import { checkEligibility } from '@/lib/ai/groq';

export async function POST(request) {
  try {
    const { studentProfile, courseDetails } = await request.json();

    if (!studentProfile || !courseDetails) {
      return Response.json(
        { error: 'Student and course details required' },
        { status: 400 }
      );
    }

    const analysis = await checkEligibility(studentProfile, courseDetails);

    return Response.json({ analysis });
  } catch (error) {
    console.error('Eligibility check error:', error);
    return Response.json(
      { error: error.message || 'Eligibility check failed' },
      { status: 500 }
    );
  }
}