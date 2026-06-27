import { streamChat } from '@/lib/ai/gemini';

export async function POST(request) {
  try {
    const { messages, context = 'general' } = await request.json();

    if (!messages || messages.length === 0) {
      return Response.json({ error: 'No messages provided' }, { status: 400 });
    }

    const response = await streamChat(messages, context);

    return Response.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: error.message || 'Chat failed' },
      { status: 500 }
    );
  }
}
